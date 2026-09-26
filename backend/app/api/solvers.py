from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.models.solver import Solver
from app.models.complaint import Complaint
from app.schemas.solver import SolverOut, SolverMatchResponse, SolverSkillOut
from app.api.deps import get_current_user
from app.services.routing_engine import RoutingEngine

router = APIRouter(prefix="/solvers", tags=["Solvers & Routing"])

@router.get("", response_model=list[SolverOut])
def list_solvers(
    domain: str = None,
    db: Session = Depends(get_db)
):
    query = db.query(Solver)
    if domain:
        query = query.filter(Solver.primary_domain == domain)
    solvers = query.all()

    results = []
    for s in solvers:
        u = s.user
        results.append(
            SolverOut(
                id=s.id,
                user_id=s.user_id,
                full_name=u.full_name if u else "Domain Expert",
                email=u.email if u else "",
                primary_domain=s.primary_domain,
                secondary_domains=s.secondary_domains or [],
                experience_years=s.experience_years,
                availability_status=s.availability_status,
                max_concurrent_complaints=s.max_concurrent_complaints,
                current_workload=s.current_workload,
                average_rating=s.average_rating,
                avg_resolution_hours=s.avg_resolution_hours,
                location=s.location,
                certifications=s.certifications or [],
                skills=[
                    SolverSkillOut(
                        id=sk.id,
                        skill_name=sk.skill_name,
                        domain=sk.domain,
                        proficiency_level=sk.proficiency_level
                    ) for sk in s.skills
                ]
            )
        )
    return results

@router.post("/match", response_model=list[SolverMatchResponse])
def match_solvers_for_complaint(
    payload: dict,
    db: Session = Depends(get_db)
):
    complaint_id = payload.get("complaint_id")
    if not complaint_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="complaint_id required")

    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint not found")

    return RoutingEngine.match_solvers_for_complaint(complaint, db)
