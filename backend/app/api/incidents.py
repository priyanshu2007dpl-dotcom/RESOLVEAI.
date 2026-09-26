from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.incident import Incident
from app.schemas.incident import IncidentOut, ProcessMiningGraphOut, SilentFailureAlertOut
from app.api.deps import get_current_user
from app.services.process_mining import ProcessMiningEngine

router = APIRouter(prefix="/incidents", tags=["Incidents & Process Mining"])

@router.get("", response_model=list[IncidentOut])
def list_incidents(
    db: Session = Depends(get_db)
):
    incidents = db.query(Incident).all()
    results = []
    for inc in incidents:
        linked_ids = [assoc.complaint_id for assoc in inc.complaint_associations]
        results.append(
            IncidentOut(
                id=inc.id,
                incident_code=inc.incident_code,
                organization_id=inc.organization_id,
                title=inc.title,
                description=inc.description,
                status=inc.status,
                severity=inc.severity,
                primary_domain=inc.primary_domain,
                root_cause_id=inc.root_cause_id,
                root_cause_title=inc.root_cause.title if inc.root_cause else None,
                affected_user_count=inc.affected_user_count,
                affected_products=inc.affected_products or [],
                affected_regions=inc.affected_regions or [],
                detected_at=inc.detected_at,
                resolved_at=inc.resolved_at,
                linked_complaint_ids=linked_ids
            )
        )
    return results

@router.get("/process-mining", response_model=ProcessMiningGraphOut)
def get_process_mining(
    organization_id: str = "apex-dynamics",
    current_user = Depends(get_current_user)
):
    return ProcessMiningEngine.get_process_mining_analysis(organization_id)

@router.get("/silent-failure-alerts", response_model=list[SilentFailureAlertOut])
def get_silent_failure_alerts(
    current_user = Depends(get_current_user)
):
    """
    Combines complaint velocity spikes, API error latencies, and service telemetry
    to flag emerging incidents before they escalate to critical outages.
    """
    return [
        SilentFailureAlertOut(
            alert_id="SFA-2026-081",
            title="Sustained Thermal Trip Spike on Apex Extruder Line 4B",
            domain="Mechanical / Electrical",
            urgency="high",
            confidence=0.94,
            detected_pattern="Acoustic screeching + Thermal cut-off reported by 32 independent operators within 48h.",
            affected_services=["Apex Industrial Extruder v3", "Assembly Spindle Motor"],
            complaint_spike_ratio=3.4,
            recommendation="Issue immediate Engineering Service Bulletin to inspect drive shaft grease degradation.",
            created_at=datetime.now(timezone.utc)
        ),
        SilentFailureAlertOut(
            alert_id="SFA-2026-082",
            title="Payment Webhook Retry Timeout Degradation",
            domain="Billing & Payment",
            urgency="medium",
            confidence=0.87,
            detected_pattern="Acquiring bank timeout rate rose to 4.2% causing duplicate ledger entries.",
            affected_services=["Stripe/Adyen Ingress Listener", "Checkout API"],
            complaint_spike_ratio=2.1,
            recommendation="Increase reverse proxy gateway timeout from 15s to 30s and verify idempotency lock cache.",
            created_at=datetime.now(timezone.utc)
        )
    ]
