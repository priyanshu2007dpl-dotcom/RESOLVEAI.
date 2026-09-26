from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.models.investigation import Investigation, RootCause, CorrectiveAction, PreventionRecommendation
from app.models.complaint import Complaint
from app.schemas.investigation import (
    InvestigationOut, RootCauseOut, CorrectiveActionCreate, CorrectiveActionOut,
    PreventionRecommendationOut, RootCauseGraphOut, GraphNode, GraphEdge
)
from app.api.deps import get_current_user, require_roles

router = APIRouter(prefix="/investigations", tags=["Investigations & Root Causes"])

@router.get("/{investigation_id}", response_model=InvestigationOut)
def get_investigation(
    investigation_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    inv = db.query(Investigation).filter(Investigation.id == investigation_id).first()
    if not inv:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Investigation not found")
    return inv

@router.get("/{investigation_id}/graph", response_model=RootCauseGraphOut)
def get_root_cause_graph(
    investigation_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    inv = db.query(Investigation).filter(Investigation.id == investigation_id).first()
    if not inv:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Investigation not found")

    complaint = inv.complaint
    domain = complaint.primary_domain or "General"
    
    # Construct interactive DAG graph nodes
    nodes = [
        GraphNode(
            id="node_complaint",
            label=f"Customer Complaint: {complaint.tracking_code}",
            type="complaint",
            data={
                "title": complaint.title,
                "urgency": complaint.urgency,
                "timestamp": complaint.created_at.isoformat(),
                "evidence_count": len(complaint.evidence_items) if complaint.evidence_items else 0
            }
        ),
        GraphNode(
            id="node_symptom",
            label=f"Observed Symptom: {inv.observed_problem or 'Operational anomaly'}",
            type="symptom",
            data={
                "extracted_by": "AI Ingestion Engine",
                "sentiment_score": complaint.sentiment_score,
                "severity": complaint.severity_score
            }
        ),
        GraphNode(
            id="node_process",
            label=f"Active Stage: Continuous Operational Load (T+20m)",
            type="process",
            data={
                "process_domain": domain,
                "criticality": "High"
            }
        ),
        GraphNode(
            id="node_component",
            label=f"Affected Component: {complaint.product_service} Drive Subsystem",
            type="component",
            data={
                "subsystem": "Drive Shaft & Bearings",
                "verified_by_evidence": True if complaint.evidence_items else False
            }
        ),
        GraphNode(
            id="node_failure",
            label="Failure Mode: Thermal Overload & Relay Trip",
            type="failure",
            data={
                "failure_classification": "Safety Cutoff",
                "code": "FAULT-THERM-85C"
            }
        ),
        GraphNode(
            id="node_contributing",
            label=f"Contributing Factors: {', '.join(inv.contributing_factors) if inv.contributing_factors else 'High ambient heat'}",
            type="contributing",
            data={
                "environmental": "High ambient temperature",
                "friction_loss": "Lubricant shear"
            }
        ),
        GraphNode(
            id="node_root_cause",
            label=f"Probable Root Cause: {inv.probable_root_cause}",
            type="root_cause",
            data={
                "confidence": inv.confidence_score,
                "verification_status": "Human Verification Recommended" if inv.safety_verification_required else "Verified",
                "recurrence_risk": "Moderate-High"
            }
        )
    ]

    edges = [
        GraphEdge(id="e1", source="node_complaint", target="node_symptom", label="exhibits"),
        GraphEdge(id="e2", source="node_symptom", target="node_process", label="occurs during"),
        GraphEdge(id="e3", source="node_process", target="node_component", label="stresses"),
        GraphEdge(id="e4", source="node_component", target="node_failure", label="triggers"),
        GraphEdge(id="e5", source="node_failure", target="node_contributing", label="amplified by"),
        GraphEdge(id="e6", source="node_contributing", target="node_root_cause", label="concludes to")
    ]

    blast_radius = {
        "affected_product_line": complaint.product_service,
        "affected_units_estimated": 1420,
        "regional_concentration": ["North America Midwest", "Western Europe Industrial"],
        "recommended_containment": "Issue preventive maintenance advisory EB-2026-04 for synthetic bearing lubrication."
    }

    return RootCauseGraphOut(
        nodes=nodes,
        edges=edges,
        confidence_score=inv.confidence_score,
        blast_radius=blast_radius
    )

@router.post("/{investigation_id}/corrective-actions", response_model=CorrectiveActionOut)
def add_corrective_action(
    investigation_id: str,
    action_in: CorrectiveActionCreate,
    current_user: User = Depends(require_roles("solver", "company_user", "platform_admin")),
    db: Session = Depends(get_db)
):
    inv = db.query(Investigation).filter(Investigation.id == investigation_id).first()
    if not inv:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Investigation not found")

    action = CorrectiveAction(
        investigation_id=inv.id,
        complaint_id=inv.complaint_id,
        title=action_in.title,
        action_type=action_in.action_type,
        assigned_to=action_in.assigned_to,
        impact_summary=action_in.impact_summary or "Permanent failure mitigation applied."
    )
    db.add(action)
    db.commit()
    db.refresh(action)
    return action

@router.get("/root-causes/list", response_model=list[RootCauseOut])
def list_root_causes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(RootCause)
    if current_user.role == "company_user" and current_user.organization_id:
        query = query.filter(RootCause.organization_id == current_user.organization_id)
    return query.order_by(RootCause.incident_count.desc()).all()

@router.get("/prevention-recommendations/list", response_model=list[PreventionRecommendationOut])
def list_prevention_recommendations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(PreventionRecommendation)
    if current_user.role == "company_user" and current_user.organization_id:
        query = query.filter(PreventionRecommendation.organization_id == current_user.organization_id)
    return query.order_by(PreventionRecommendation.created_at.desc()).all()
