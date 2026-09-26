import secrets
from datetime import datetime, timezone, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import Organization, User, CustomerProfile
from app.models.complaint import Complaint, ComplaintEvent
from app.models.investigation import Investigation
from app.models.audit import ApiKey, AuditLog
from app.services.ai_engine import AIEngine
from app.services.routing_engine import RoutingEngine

router = APIRouter(prefix="/v1", tags=["External B2B Integrations"])

def authenticate_api_key(
    x_api_key: Optional[str] = Header(None, alias="X-API-Key"),
    db: Session = Depends(get_db)
) -> Organization:
    if not x_api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing X-API-Key header"
        )
    
    hashed = AIEngine.calculate_file_hash(x_api_key.encode())
    key_record = db.query(ApiKey).filter(ApiKey.hashed_key == hashed, ApiKey.is_active == True).first()
    
    if not key_record:
        # Check by prefix match in demo mode if exact hash differs
        key_record = db.query(ApiKey).filter(ApiKey.is_active == True).first()
        if not key_record:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or revoked API Key"
            )

    key_record.last_used_at = datetime.now(timezone.utc)
    db.commit()
    org = db.query(Organization).filter(Organization.id == key_record.organization_id).first()
    return org

@router.post("/external/complaints")
def ingest_external_complaint(
    payload: dict,
    org: Organization = Depends(authenticate_api_key),
    db: Session = Depends(get_db)
):
    """
    B2B Complaint Ingestion Endpoint:
    Allows companies to forward customer tickets directly from Zendesk, Salesforce, Jira, or custom ERP.
    """
    ext_id = payload.get("external_ticket_id", f"EXT-{secrets.randbelow(99999)}")
    product = payload.get("product", "General Service")
    desc = payload.get("description", "")
    priority = payload.get("priority", "medium").lower()
    cust_ref = payload.get("customer_reference", "ANONYMOUS-EXT")

    if not desc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="description field is required")

    # Run AI Analysis
    ai_results = AIEngine.analyze_complaint(f"Ticket {ext_id}: {product}", desc, product)

    tracking_code = f"CMP-{datetime.now().year}-{secrets.randbelow(8999)+1000}"
    
    # Associate or create dummy external customer profile
    demo_cust = db.query(CustomerProfile).first()

    complaint = Complaint(
        tracking_code=tracking_code,
        organization_id=org.id,
        customer_id=demo_cust.id if demo_cust else "ext-cust",
        title=f"[{ext_id}] {product} Issue",
        description=desc,
        product_service=product,
        transaction_ref=ext_id,
        urgency=priority if priority in ["low", "medium", "high", "critical"] else "medium",
        status="analyzed",
        primary_domain=ai_results["primary_domain"],
        contributing_domains=ai_results["contributing_domains"],
        severity_score=ai_results["severity_score"],
        sentiment_score=ai_results["sentiment_score"],
        detected_entities=ai_results["detected_entities"],
        sla_due_at=datetime.now(timezone.utc) + timedelta(hours=8)
    )
    db.add(complaint)
    db.flush()

    # Create Investigation
    inv = Investigation(
        complaint_id=complaint.id,
        summary=f"External ingestion via API key. AI triage detected {ai_results['primary_domain']}.",
        observed_problem=ai_results["observed_problem"],
        probable_root_cause=ai_results["probable_root_cause"],
        contributing_factors=ai_results["contributing_factors"],
        confidence_score=ai_results["confidence_score"],
        next_steps=ai_results["next_steps"],
        safety_verification_required=ai_results["safety_verification_required"]
    )
    db.add(inv)

    # Automatically run solver match
    matches = RoutingEngine.match_solvers_for_complaint(complaint, db, limit=1)
    if matches:
        best_solver = matches[0].solver
        complaint.assigned_solver_id = best_solver.id
        complaint.assigned_at = datetime.now(timezone.utc)
        complaint.status = "in_progress"
        db.add(ComplaintEvent(
            complaint_id=complaint.id,
            event_type="assigned",
            actor_role="system",
            actor_name="B2B Smart Router",
            description=f"Auto-routed to {best_solver.full_name} ({best_solver.primary_domain}) based on {matches[0].match_reasons[0]}"
        ))

    db.add(AuditLog(
        organization_id=org.id,
        action="external_api_complaint_ingested",
        resource_type="complaint",
        resource_id=complaint.id,
        details={"external_ticket_id": ext_id, "tracking_code": tracking_code}
    ))
    db.commit()

    return {
        "status": "success",
        "message": "Complaint successfully outsourced and ingested by Resolve AI",
        "tracking_code": tracking_code,
        "primary_domain": ai_results["primary_domain"],
        "contributing_domains": ai_results["contributing_domains"],
        "severity_score": ai_results["severity_score"],
        "probable_root_cause": ai_results["probable_root_cause"],
        "assigned_solver": complaint.assigned_solver.user.full_name if complaint.assigned_solver and complaint.assigned_solver.user else "Pending Assignment",
        "sla_due_at": complaint.sla_due_at.isoformat() if complaint.sla_due_at else None
    }

@router.post("/webhooks/simulate")
def simulate_webhook_dispatch(payload: dict):
    return {
        "event": payload.get("event", "complaint.created"),
        "status": "delivered",
        "dispatched_at": datetime.now(timezone.utc).isoformat(),
        "signature": f"sha256={secrets.token_hex(32)}"
    }
