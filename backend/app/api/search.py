from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.core.database import get_db
from app.models.user import User, CustomerProfile
from app.models.complaint import Complaint, Evidence
from app.models.incident import Incident
from app.models.solver import Solver
from app.models.policy import Policy
from app.schemas.search import GlobalSearchResponse, SearchResultItem
from app.api.deps import get_current_user

router = APIRouter(prefix="/search", tags=["Global Semantic Search"])

@router.get("", response_model=GlobalSearchResponse)
def global_search(
    q: str = Query(..., min_length=1),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query_str = f"%{q.strip()}%"
    results = []

    # 1. Search Complaints
    complaints = db.query(Complaint).filter(
        or_(
            Complaint.title.ilike(query_str),
            Complaint.description.ilike(query_str),
            Complaint.tracking_code.ilike(query_str),
            Complaint.product_service.ilike(query_str)
        )
    ).limit(8).all()

    for c in complaints:
        results.append(SearchResultItem(
            id=c.id,
            entity_type="complaint",
            title=f"[{c.tracking_code}] {c.title}",
            subtitle=f"{c.product_service} • Urgency: {c.urgency.upper()}",
            domain=c.primary_domain,
            status=c.status,
            link_url=f"/solver?case={c.id}" if current_user.role == "solver" else f"/customer?case={c.id}"
        ))

    # 2. Search Incidents
    incidents = db.query(Incident).filter(
        or_(
            Incident.title.ilike(query_str),
            Incident.incident_code.ilike(query_str),
            Incident.description.ilike(query_str)
        )
    ).limit(5).all()

    for inc in incidents:
        results.append(SearchResultItem(
            id=inc.id,
            entity_type="incident",
            title=f"[{inc.incident_code}] {inc.title}",
            subtitle=f"Affected: {inc.affected_user_count} units • Domain: {inc.primary_domain}",
            domain=inc.primary_domain,
            status=inc.status,
            link_url="/company?tab=incidents"
        ))

    # 3. Search Solvers
    solvers = db.query(Solver).all()
    for s in solvers:
        s_user = s.user
        s_name = s_user.full_name if s_user else "Specialist"
        if q.lower() in s_name.lower() or q.lower() in s.primary_domain.lower() or any(q.lower() in str(sk).lower() for sk in (s.secondary_domains or [])):
            results.append(SearchResultItem(
                id=s.id,
                entity_type="solver",
                title=f"{s_name} ({s.primary_domain} PE)",
                subtitle=f"Exp: {s.experience_years}y • Rating: {s.average_rating}★ • Active Cases: {s.current_workload}",
                domain=s.primary_domain,
                status=s.availability_status,
                link_url="/admin"
            ))

    # 4. Search Policies
    policies = db.query(Policy).filter(
        or_(
            Policy.title.ilike(query_str),
            Policy.content.ilike(query_str),
            Policy.category.ilike(query_str)
        )
    ).limit(4).all()

    for p in policies:
        results.append(SearchResultItem(
            id=p.id,
            entity_type="policy",
            title=f"{p.title} ({p.version})",
            subtitle=f"Category: {p.category} • Effective: {p.effective_date.strftime('%b %Y')}",
            domain=p.category,
            status="Active" if p.is_active else "Archived",
            link_url="/company?tab=overview"
        ))

    return GlobalSearchResponse(
        query=q,
        total_results=len(results),
        results=results
    )
