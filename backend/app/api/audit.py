from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.audit import AuditLog
from app.api.deps import require_roles

router = APIRouter(tags=["Audit & Diagnostics"])

@router.get("/audit-logs")
def get_audit_logs(
    limit: int = 50,
    current_user = Depends(require_roles("company_user", "platform_admin")),
    db: Session = Depends(get_db)
):
    query = db.query(AuditLog)
    if current_user.role != "platform_admin" and current_user.organization_id:
        query = query.filter(AuditLog.organization_id == current_user.organization_id)
    logs = query.order_by(AuditLog.created_at.desc()).limit(limit).all()
    
    return [
        {
            "id": log.id,
            "action": log.action,
            "resource_type": log.resource_type,
            "resource_id": log.resource_id,
            "user_email": log.user_email or "System",
            "ip_address": log.ip_address,
            "details": log.details,
            "created_at": log.created_at.isoformat()
        } for log in logs
    ]

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Resolve AI Backend Core",
        "version": "1.0.0"
    }

@router.get("/ready")
def readiness_check(db: Session = Depends(get_db)):
    # Verify DB connectivity
    try:
        db.execute("SELECT 1")
        return {"status": "ready", "database": "connected"}
    except Exception as e:
        return {"status": "not_ready", "error": str(e)}
