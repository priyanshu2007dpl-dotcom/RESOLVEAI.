from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.models.complaint import Complaint
from app.services.copilot_service import CopilotService
from app.services.ai_engine import AIEngine
from app.services.multi_agent_system import MultiAgentSystem
from app.api.deps import get_current_user

router = APIRouter(prefix="/ai", tags=["AI Copilot & Intelligence"])

@router.post("/copilot")
def query_copilot(
    payload: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    complaint_id = payload.get("complaint_id")
    prompt = payload.get("prompt", "What should I check first?")

    if not complaint_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="complaint_id is required")

    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint not found")

    return CopilotService.query_copilot(complaint, complaint.investigation, prompt)

@router.post("/deliberate")
def run_multi_agent_deliberation(
    payload: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    complaint_id = payload.get("complaint_id")
    if not complaint_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="complaint_id is required")

    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint not found")

    return MultiAgentSystem.deliberate_complaint(complaint, db)

@router.post("/analyze")
def analyze_text(
    payload: dict
):
    title = payload.get("title", "")
    description = payload.get("description", "")
    product_service = payload.get("product_service", "")

    if not title or not description:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Title and description required")

    return AIEngine.analyze_complaint(title, description, product_service)
