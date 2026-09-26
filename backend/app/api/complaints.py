import os
import random
from datetime import datetime, timezone, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import get_db
from app.models.user import User, Organization, CustomerProfile
from app.models.solver import Solver
from app.models.complaint import Complaint, Evidence, ComplaintEvent, Message, Feedback
from app.models.investigation import Investigation, RootCause, PreventionRecommendation
from app.models.audit import AuditLog
from app.schemas.complaint import (
    ComplaintCreate, ComplaintOut, ComplaintDetailOut, EvidenceOut,
    MessageCreate, MessageOut, FeedbackCreate, FeedbackOut,
    HumanHandoffSummaryOut, AutonomousSolveResponse, AutonomousActionOut
)
from app.api.deps import get_current_user, require_roles
from app.services.ai_engine import AIEngine
from app.services.genealogy_engine import GenealogyEngine
from app.services.autonomous_agent import AutonomousSupportAgent
from app.services.escalation_engine import EscalationEngine
from app.services.context_engine import ContextRetentionEngine
from app.schemas.ai_evaluation import AIResolutionAuditOut
from app.services.ai_evaluation_engine import AIEvaluationEngine

router = APIRouter(prefix="/complaints", tags=["Complaints"])

@router.post("", response_model=ComplaintDetailOut)
def create_complaint(
    complaint_in: ComplaintCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Ensure customer profile exists
    customer_profile = current_user.customer_profile
    if not customer_profile:
        customer_profile = CustomerProfile(user_id=current_user.id, customer_code=f"CUST-{current_user.id[:6].upper()}")
        db.add(customer_profile)
        db.flush()

    # Find target organization
    org = db.query(Organization).filter(Organization.slug == complaint_in.organization_slug).first()
    if not org:
        org = db.query(Organization).first()
        if not org:
            org = Organization(name="Apex Dynamics Corp", slug="apex-dynamics")
            db.add(org)
            db.flush()

    # Generate tracking code CMP-YYYY-XXXX
    tracking_code = f"CMP-{datetime.now().year}-{random.randint(1000, 9999)}"

    # 1. Run AI Multi-Domain Analysis
    ai_results = AIEngine.analyze_complaint(
        title=complaint_in.title,
        description=complaint_in.description,
        product_service=complaint_in.product_service
    )

    # Calculate SLA due date based on urgency
    hours_map = {"critical": 2, "high": 8, "medium": 24, "low": 72}
    sla_hours = hours_map.get(complaint_in.urgency.lower(), 24)
    sla_due_at = datetime.now(timezone.utc) + timedelta(hours=sla_hours)

    complaint = Complaint(
        tracking_code=tracking_code,
        organization_id=org.id,
        customer_id=customer_profile.id,
        title=complaint_in.title,
        description=complaint_in.description,
        product_service=complaint_in.product_service,
        transaction_ref=complaint_in.transaction_ref,
        location=complaint_in.location,
        urgency=complaint_in.urgency,
        status="analyzed",
        primary_domain=ai_results["primary_domain"],
        contributing_domains=ai_results["contributing_domains"],
        severity_score=ai_results["severity_score"],
        sentiment_score=ai_results["sentiment_score"],
        detected_entities=ai_results["detected_entities"],
        sla_due_at=sla_due_at
    )
    db.add(complaint)
    db.flush()

    # 2. Automatically generate Root-Cause Investigation Record
    investigation = Investigation(
        complaint_id=complaint.id,
        summary=f"Automated AI cross-domain triage identified primary domain '{ai_results['primary_domain']}' with contributing factors in {', '.join(ai_results['contributing_domains']) or 'none'}.",
        observed_problem=ai_results["observed_problem"],
        probable_root_cause=ai_results["probable_root_cause"],
        contributing_factors=ai_results["contributing_factors"],
        confidence_score=ai_results["confidence_score"],
        next_steps=ai_results["next_steps"],
        safety_verification_required=ai_results["safety_verification_required"],
        status="in_progress"
    )
    db.add(investigation)

    # 3. Log System Lifecycle Events
    db.add(ComplaintEvent(
        complaint_id=complaint.id,
        event_type="submitted",
        actor_role="customer",
        actor_name=current_user.full_name,
        description=f"Complaint registered under tracking code {tracking_code}"
    ))
    db.add(ComplaintEvent(
        complaint_id=complaint.id,
        event_type="classified",
        actor_role="ai",
        actor_name="Resolve AI Core",
        description=f"Classified into primary domain '{ai_results['primary_domain']}' ({', '.join(ai_results['contributing_domains']) or 'no contributing domains'}). Severity score: {ai_results['severity_score']}/100."
    ))

    # Audit Log
    db.add(AuditLog(
        organization_id=org.id,
        user_id=current_user.id,
        user_email=current_user.email,
        action="complaint_created",
        resource_type="complaint",
        resource_id=complaint.id,
        details={"tracking_code": tracking_code, "domain": ai_results["primary_domain"]}
    ))
    db.commit()
    db.refresh(complaint)

    # Check for genealogy matches
    related = GenealogyEngine.find_related_complaints(complaint, db)

    return _format_complaint_detail(complaint, current_user, related)

@router.get("", response_model=list[ComplaintOut])
def list_complaints(
    status_filter: Optional[str] = Query(None, alias="status"),
    domain_filter: Optional[str] = Query(None, alias="domain"),
    urgency_filter: Optional[str] = Query(None, alias="urgency"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Complaint)

    # Strict multi-tenant RBAC Scoping:
    if current_user.role == "customer":
        # Customers only see their own complaints
        if current_user.customer_profile:
            query = query.filter(Complaint.customer_id == current_user.customer_profile.id)
        else:
            return []
    elif current_user.role == "solver":
        # Solvers see assigned complaints or available queue
        solver = current_user.solver_profile
        if solver:
            query = query.filter(
                (Complaint.assigned_solver_id == solver.id) | 
                ((Complaint.status.in_(["analyzed", "investigating"])) & (Complaint.primary_domain == solver.primary_domain))
            )
    elif current_user.role == "company_user":
        # Company managers only see their own organization complaints
        if current_user.organization_id:
            query = query.filter(Complaint.organization_id == current_user.organization_id)
    # platform_admin sees all

    if status_filter:
        query = query.filter(Complaint.status == status_filter)
    if domain_filter:
        query = query.filter(Complaint.primary_domain == domain_filter)
    if urgency_filter:
        query = query.filter(Complaint.urgency == urgency_filter)

    complaints = query.order_by(Complaint.created_at.desc()).all()
    
    results = []
    for c in complaints:
        out = ComplaintOut.from_orm(c)
        if c.organization:
            out.organization_name = c.organization.name
        if c.customer and c.customer.user:
            out.customer_name = c.customer.user.full_name
        if c.assigned_solver and c.assigned_solver.user:
            out.assigned_solver_name = c.assigned_solver.user.full_name
        results.append(out)

    return results

@router.get("/{complaint_id}", response_model=ComplaintDetailOut)
def get_complaint_details(
    complaint_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    complaint = db.query(Complaint).filter(
        (Complaint.id == complaint_id) | (Complaint.tracking_code == complaint_id)
    ).first()
    if not complaint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint not found")

    # RBAC verification
    if current_user.role == "customer":
        if not current_user.customer_profile or complaint.customer_id != current_user.customer_profile.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied to this complaint")
    elif current_user.role == "company_user":
        if current_user.organization_id and complaint.organization_id != current_user.organization_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied to another company's records")

    related = GenealogyEngine.find_related_complaints(complaint, db)
    return _format_complaint_detail(complaint, current_user, related)

@router.post("/{complaint_id}/assign")
def assign_solver(
    complaint_id: str,
    payload: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint not found")

    solver_id = payload.get("solver_id")
    solver = db.query(Solver).filter(Solver.id == solver_id).first()
    if not solver:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Solver not found")

    complaint.assigned_solver_id = solver.id
    complaint.assigned_at = datetime.now(timezone.utc)
    complaint.status = "in_progress"
    solver.current_workload += 1

    if complaint.investigation:
        complaint.investigation.solver_id = solver.id

    solver_name = solver.user.full_name if solver.user else "Domain Specialist"
    db.add(ComplaintEvent(
        complaint_id=complaint.id,
        event_type="assigned",
        actor_role="system",
        actor_name="Routing Engine",
        description=f"Routed and assigned to expert solver {solver_name} ({solver.primary_domain})."
    ))
    db.commit()
    return {"message": "Solver successfully assigned", "status": complaint.status, "assigned_solver": solver_name}

@router.post("/{complaint_id}/resolve")
def resolve_complaint(
    complaint_id: str,
    payload: dict,
    current_user: User = Depends(require_roles("solver", "company_user", "platform_admin")),
    db: Session = Depends(get_db)
):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint not found")

    resolution_notes = payload.get("resolution_notes", "Corrective action applied and verified.")
    complaint.status = "resolved"
    complaint.resolved_at = datetime.now(timezone.utc)
    
    if complaint.assigned_solver and complaint.assigned_solver.current_workload > 0:
        complaint.assigned_solver.current_workload -= 1

    db.add(ComplaintEvent(
        complaint_id=complaint.id,
        event_type="resolved",
        actor_role="solver",
        actor_name=current_user.full_name,
        description=f"Complaint resolved: {resolution_notes}"
    ))

    # Automatically check if this root cause should trigger a Prevention Recommendation
    if complaint.primary_domain:
        rc = db.query(RootCause).filter(
            RootCause.organization_id == complaint.organization_id,
            RootCause.domain == complaint.primary_domain
        ).first()
        if rc:
            rc.incident_count += 1
            if rc.incident_count >= 3:
                rc.is_recurring = True

    # Compute AI Resolution Score & Multi-Persona Self-Assessment Feedback
    ai_audit = AIEvaluationEngine.evaluate_complaint_resolution(complaint, db, force_regenerate=True)

    db.commit()
    return {
        "message": "Complaint marked as resolved. Customer confirmation requested.",
        "status": complaint.status,
        "ai_resolution_score": ai_audit.overall_score,
        "ai_quality_tier": ai_audit.quality_tier
    }

@router.get("/{complaint_id}/ai-evaluation", response_model=AIResolutionAuditOut)
def get_complaint_ai_evaluation(
    complaint_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    complaint = db.query(Complaint).filter(
        (Complaint.id == complaint_id) | (Complaint.tracking_code == complaint_id)
    ).first()
    if not complaint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint not found")

    evaluation = AIEvaluationEngine.evaluate_complaint_resolution(complaint, db)
    return evaluation

@router.post("/{complaint_id}/ai-evaluation/generate", response_model=AIResolutionAuditOut)
def generate_complaint_ai_evaluation(
    complaint_id: str,
    current_user: User = Depends(require_roles("solver", "company_user", "platform_admin")),
    db: Session = Depends(get_db)
):
    complaint = db.query(Complaint).filter(
        (Complaint.id == complaint_id) | (Complaint.tracking_code == complaint_id)
    ).first()
    if not complaint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint not found")

    evaluation = AIEvaluationEngine.evaluate_complaint_resolution(complaint, db, force_regenerate=True)
    return evaluation

@router.post("/{complaint_id}/reopen")
def reopen_complaint(
    complaint_id: str,
    payload: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint not found")

    reason = payload.get("reason", "Customer indicated issue persists.")
    complaint.status = "reopened"
    
    db.add(ComplaintEvent(
        complaint_id=complaint.id,
        event_type="reopened",
        actor_role=current_user.role,
        actor_name=current_user.full_name,
        description=f"Complaint reopened by customer: {reason}"
    ))
    db.commit()
    return {"message": "Complaint reopened for investigation", "status": complaint.status}

@router.post("/{complaint_id}/feedback", response_model=FeedbackOut)
def submit_feedback(
    complaint_id: str,
    feedback_in: FeedbackCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint not found")

    existing_fb = db.query(Feedback).filter(Feedback.complaint_id == complaint.id).first()
    if existing_fb:
        existing_fb.rating = feedback_in.rating
        existing_fb.comment = feedback_in.comment
        existing_fb.resolution_confirmed = feedback_in.resolution_confirmed
        db.commit()
        db.refresh(existing_fb)
        return existing_fb

    customer_id = current_user.customer_profile.id if current_user.customer_profile else complaint.customer_id
    feedback = Feedback(
        complaint_id=complaint.id,
        customer_id=customer_id,
        rating=feedback_in.rating,
        comment=feedback_in.comment,
        resolution_confirmed=feedback_in.resolution_confirmed
    )
    db.add(feedback)
    
    if feedback_in.resolution_confirmed:
        complaint.status = "confirmed"
        complaint.closed_at = datetime.now(timezone.utc)
        db.add(ComplaintEvent(
            complaint_id=complaint.id,
            event_type="confirmed",
            actor_role="customer",
            actor_name=current_user.full_name,
            description=f"Customer confirmed satisfactory resolution with {feedback_in.rating}/5 stars."
        ))

    db.commit()
    db.refresh(feedback)
    return feedback

@router.post("/{complaint_id}/messages", response_model=MessageOut)
def post_message(
    complaint_id: str,
    message_in: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint not found")

    # If customer is sending, they cannot create internal notes
    is_internal = message_in.is_internal_note
    if current_user.role == "customer":
        is_internal = False

    msg = Message(
        complaint_id=complaint.id,
        sender_id=current_user.id,
        sender_name=current_user.full_name,
        sender_role=current_user.role,
        message_text=message_in.message_text,
        is_internal_note=is_internal
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg

@router.post("/upload-evidence")
async def upload_evidence(
    complaint_id: str = Form(...),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint not found")

    content = await file.read()
    file_hash = AIEngine.calculate_file_hash(content)
    
    # Save file securely to uploads folder
    safe_name = f"{file_hash[:12]}_{file.filename}"
    file_path = settings.UPLOAD_DIR / safe_name
    with open(file_path, "wb") as f:
        f.write(content)

    # Process multimodal extractions
    mime = file.content_type or "application/octet-stream"
    extractions = AIEngine.process_multimodal_evidence(file.filename, mime, content)

    # Determine broad file type
    ftype = "text"
    if mime.startswith("image/") or file.filename.lower().endswith((".jpg", ".png", ".jpeg")):
        ftype = "image"
    elif mime == "application/pdf" or file.filename.lower().endswith(".pdf"):
        ftype = "pdf"
    elif mime.startswith("audio/") or file.filename.lower().endswith((".mp3", ".wav")):
        ftype = "audio"
    elif mime.startswith("video/") or file.filename.lower().endswith((".mp4", ".mov")):
        ftype = "video"

    evidence = Evidence(
        complaint_id=complaint.id,
        file_name=file.filename,
        file_type=ftype,
        file_size_bytes=len(content),
        mime_type=mime,
        sha256_hash=file_hash,
        file_path=str(file_path),
        extracted_text=extractions["extracted_text"],
        visual_observation=extractions["visual_observation"],
        audio_transcript=extractions["audio_transcript"],
        uploaded_by_user_id=current_user.id
    )
    db.add(evidence)

    # Log event
    db.add(ComplaintEvent(
        complaint_id=complaint.id,
        event_type="evidence_uploaded",
        actor_role=current_user.role,
        actor_name=current_user.full_name,
        description=f"Evidence file '{file.filename}' uploaded and cryptographically verified (SHA-256)."
    ))
    db.commit()
    db.refresh(evidence)

    return {
        "id": evidence.id,
        "file_name": evidence.file_name,
        "file_type": evidence.file_type,
        "sha256_hash": evidence.sha256_hash,
        "visual_observation": evidence.visual_observation,
        "audio_transcript": evidence.audio_transcript,
        "extracted_text": evidence.extracted_text
    }

@router.post("/{complaint_id}/escalate", response_model=HumanHandoffSummaryOut)
def escalate_complaint_to_human(
    complaint_id: str,
    payload: dict = {},
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint not found")
    
    reason = payload.get("reason")
    handoff_package = EscalationEngine.execute_escalation(complaint, db, reason_override=reason)
    return handoff_package

@router.get("/{complaint_id}/handoff-package", response_model=HumanHandoffSummaryOut)
def get_complaint_handoff_package(
    complaint_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint not found")
    
    return EscalationEngine.assemble_handoff_package(complaint, db)

@router.post("/{complaint_id}/autonomous-solve", response_model=AutonomousSolveResponse)
def trigger_autonomous_solution(
    complaint_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint not found")
    
    result = AutonomousSupportAgent.evaluate_and_execute(complaint, db)
    if not result.get("success"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result.get("reason", "Autonomous action could not be executed.")
        )
    return result

@router.get("/{complaint_id}/context")
def get_complaint_customer_context(
    complaint_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint not found")
    
    return ContextRetentionEngine.get_customer_context(complaint.customer_id, db)

def _format_complaint_detail(complaint: Complaint, current_user: User, related_complaints: list) -> ComplaintDetailOut:
    out = ComplaintDetailOut.from_orm(complaint)
    if complaint.organization:
        out.organization_name = complaint.organization.name
    if complaint.customer and complaint.customer.user:
        out.customer_name = complaint.customer.user.full_name
    if complaint.assigned_solver and complaint.assigned_solver.user:
        out.assigned_solver_name = complaint.assigned_solver.user.full_name

    # Evidence items
    out.evidence_items = [EvidenceOut.from_orm(e) for e in complaint.evidence_items]
    
    # Events
    out.events = [ComplaintEventOut.from_orm(ev) for ev in complaint.events]

    # Messages: Customer MUST NOT see internal notes!
    if current_user.role == "customer":
        out.messages = [MessageOut.from_orm(m) for m in complaint.messages if not m.is_internal_note]
    else:
        out.messages = [MessageOut.from_orm(m) for m in complaint.messages]

    if complaint.feedback:
        out.feedback = FeedbackOut.from_orm(complaint.feedback)

    if complaint.investigation:
        out.investigation_summary = {
            "id": complaint.investigation.id,
            "summary": complaint.investigation.summary,
            "observed_problem": complaint.investigation.observed_problem,
            "probable_root_cause": complaint.investigation.probable_root_cause,
            "contributing_factors": complaint.investigation.contributing_factors,
            "confidence_score": complaint.investigation.confidence_score,
            "next_steps": complaint.investigation.next_steps,
            "safety_verification_required": complaint.investigation.safety_verification_required,
            "status": complaint.investigation.status
        }

    if complaint.ai_evaluation:
        out.ai_evaluation = {
            "id": complaint.ai_evaluation.id,
            "overall_score": complaint.ai_evaluation.overall_score,
            "confidence_level": complaint.ai_evaluation.confidence_level,
            "quality_tier": complaint.ai_evaluation.quality_tier,
            "accuracy_score": complaint.ai_evaluation.accuracy_score,
            "root_cause_depth_score": complaint.ai_evaluation.root_cause_depth_score,
            "policy_compliance_score": complaint.ai_evaluation.policy_compliance_score,
            "safety_adherence_score": complaint.ai_evaluation.safety_adherence_score,
            "prevention_impact_score": complaint.ai_evaluation.prevention_impact_score,
            "feedback_to_user": complaint.ai_evaluation.feedback_to_user or {},
            "feedback_to_solver": complaint.ai_evaluation.feedback_to_solver or {},
            "feedback_to_company": complaint.ai_evaluation.feedback_to_company or {},
            "feedback_to_admin": complaint.ai_evaluation.feedback_to_admin or {},
            "created_at": complaint.ai_evaluation.created_at
        }
    else:
        eval_obj = AIEvaluationEngine.evaluate_complaint_resolution(complaint, None)
        out.ai_evaluation = {
            "id": eval_obj.id,
            "overall_score": eval_obj.overall_score,
            "confidence_level": eval_obj.confidence_level,
            "quality_tier": eval_obj.quality_tier,
            "accuracy_score": eval_obj.accuracy_score,
            "root_cause_depth_score": eval_obj.root_cause_depth_score,
            "policy_compliance_score": eval_obj.policy_compliance_score,
            "safety_adherence_score": eval_obj.safety_adherence_score,
            "prevention_impact_score": eval_obj.prevention_impact_score,
            "feedback_to_user": eval_obj.feedback_to_user or {},
            "feedback_to_solver": eval_obj.feedback_to_solver or {},
            "feedback_to_company": eval_obj.feedback_to_company or {},
            "feedback_to_admin": eval_obj.feedback_to_admin or {},
            "created_at": eval_obj.created_at
        }

    out.related_complaints = related_complaints
    return out
