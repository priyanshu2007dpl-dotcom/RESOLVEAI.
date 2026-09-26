from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User, Organization
from app.models.policy import Policy
from app.schemas.policy import PolicyOut, PolicyDriftAnalysisOut
from app.api.deps import get_current_user, require_roles
from app.services.policy_drift_detector import PolicyDriftDetector

router = APIRouter(prefix="/policies", tags=["Policies & Drift Analysis"])

@router.get("", response_model=list[PolicyOut])
def list_policies(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    org_id = current_user.organization_id
    query = db.query(Policy)
    if org_id and current_user.role != "platform_admin":
        query = query.filter(Policy.organization_id == org_id)
    return query.order_by(Policy.created_at.desc()).all()

@router.get("/drift", response_model=PolicyDriftAnalysisOut)
def get_policy_drift(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    org_id = current_user.organization_id
    if not org_id:
        first_org = db.query(Organization).first()
        org_id = first_org.id if first_org else "apex-dynamics"
    return PolicyDriftDetector.get_drift_analysis(org_id, db)
