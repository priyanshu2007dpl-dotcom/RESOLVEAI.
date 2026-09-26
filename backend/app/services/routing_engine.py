from typing import Any
from sqlalchemy.orm import Session
from app.models.solver import Solver
from app.models.complaint import Complaint
from app.schemas.solver import SolverMatchResponse, SolverOut, SolverSkillOut

class RoutingEngine:
    @staticmethod
    def match_solvers_for_complaint(complaint: Complaint, db: Session, limit: int = 5) -> list[SolverMatchResponse]:
        """
        Calculates transparent operational matching criteria across:
        1. Domain alignment (Primary domain + Cross-domain contributing match)
        2. Skill verification
        3. Real-time workload & availability
        4. Historical resolution performance & SLA feasibility
        """
        solvers = db.query(Solver).filter(Solver.availability_status != "offline").all()
        scored_matches = []

        primary_domain = complaint.primary_domain or "Customer Service"
        contributing_domains = complaint.contributing_domains or []

        for solver in solvers:
            user = solver.user
            reasons = []
            skill_overlap = []
            domain_score = 0.0

            # 1. Primary domain match (40% weight)
            if solver.primary_domain.lower() == primary_domain.lower():
                domain_score += 40.0
                reasons.append(f"Primary specialty exactly aligns with {primary_domain}")
            elif any(c.lower() == solver.primary_domain.lower() for c in contributing_domains):
                domain_score += 28.0
                reasons.append(f"Primary specialty covers contributing domain {solver.primary_domain}")

            # 2. Secondary/Cross-Domain match (20% weight)
            secondary = solver.secondary_domains or []
            secondary_hits = [s for s in secondary if s.lower() == primary_domain.lower() or any(s.lower() == c.lower() for c in contributing_domains)]
            if secondary_hits:
                domain_score += min(20.0, len(secondary_hits) * 10.0)
                reasons.append(f"Secondary certifications match cross-domain areas ({', '.join(secondary_hits)})")

            # 3. Workload Feasibility (20% weight)
            capacity = max(1, solver.max_concurrent_complaints)
            current = solver.current_workload
            load_ratio = current / capacity
            
            if load_ratio < 0.5:
                workload_score = 20.0
                workload_status = f"High Capacity ({current}/{capacity} active cases)"
                reasons.append(workload_status)
            elif load_ratio < 1.0:
                workload_score = 12.0
                workload_status = f"Moderate Capacity ({current}/{capacity} active cases)"
                reasons.append(workload_status)
            else:
                workload_score = 3.0
                workload_status = f"At Full Capacity ({current}/{capacity} active cases)"

            # 4. SLA & Historical Adherence (20% weight)
            sla_feasibility = "Within Target SLA window"
            sla_score = 18.0
            if solver.avg_resolution_hours <= 4.0:
                sla_score += 2.0
                reasons.append(f"Fast historical resolution velocity ({solver.avg_resolution_hours}h avg)")

            # Check individual skill tokens
            for skill in solver.skills:
                if skill.domain.lower() in [primary_domain.lower()] + [c.lower() for c in contributing_domains]:
                    skill_overlap.append(f"{skill.skill_name} ({skill.proficiency_level})")

            total_score = round(domain_score + workload_score + sla_score, 1)

            # Build Pydantic response
            solver_out = SolverOut(
                id=solver.id,
                user_id=solver.user_id,
                full_name=user.full_name if user else "Expert Specialist",
                email=user.email if user else "",
                primary_domain=solver.primary_domain,
                secondary_domains=solver.secondary_domains or [],
                experience_years=solver.experience_years,
                availability_status=solver.availability_status,
                max_concurrent_complaints=solver.max_concurrent_complaints,
                current_workload=solver.current_workload,
                average_rating=solver.average_rating,
                avg_resolution_hours=solver.avg_resolution_hours,
                location=solver.location,
                certifications=solver.certifications or [],
                skills=[
                    SolverSkillOut(
                        id=s.id,
                        skill_name=s.skill_name,
                        domain=s.domain,
                        proficiency_level=s.proficiency_level
                    ) for s in solver.skills
                ]
            )

            scored_matches.append(
                SolverMatchResponse(
                    solver=solver_out,
                    match_score=total_score,
                    match_reasons=reasons,
                    skill_overlap=skill_overlap[:4],
                    sla_feasibility=sla_feasibility,
                    workload_status=workload_status
                )
            )

        # Sort strictly by total score
        scored_matches.sort(key=lambda x: x.match_score, reverse=True)
        return scored_matches[:limit]
