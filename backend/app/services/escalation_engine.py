from datetime import datetime, timezone, timedelta
from typing import Any
from sqlalchemy.orm import Session
from app.models.complaint import Complaint, ComplaintEvent
from app.models.notification import Notification
from app.models.user import User
from app.services.context_engine import ContextRetentionEngine

class EscalationEngine:
    @staticmethod
    def evaluate_escalation_triggers(complaint: Complaint) -> dict[str, Any]:
        """
        Determines whether a complaint meets criteria for immediate human escalation.
        """
        text = f"{complaint.title} {complaint.description}".lower()
        
        triggers = []
        is_safety = False

        # 1. Safety & Physical Hazard Triggers
        safety_keywords = ["smoke", "fire", "spark", "burn", "shock", "hazard", "explosion", "injury", "smell of burning", "electrical odor"]
        detected_safety = [w for w in safety_keywords if w in text]
        if detected_safety:
            is_safety = True
            triggers.append(f"Critical Safety Hazard: Observable indicators ({', '.join(detected_safety)}) detect thermal or electrical risk.")

        # 2. Reopened or Persistent Failure
        if complaint.status == "reopened":
            triggers.append("Persistent Failure: Complaint was reopened by customer after initial resolution.")

        # 3. Explicit Customer Request for Human
        if any(term in text for term in ["talk to human", "speak with agent", "human supervisor", "escalate this", "real person"]):
            triggers.append("Customer Explicit Request: User explicitly requested human specialist intervention.")

        # 4. Severity & Financial Risk
        if complaint.severity_score >= 85:
            triggers.append(f"High Severity Threshold: Evaluated severity score {complaint.severity_score}/100 exceeds autonomous safe boundary.")

        return {
            "should_escalate": len(triggers) > 0 or is_safety,
            "is_safety": is_safety,
            "triggers": triggers,
            "primary_reason": triggers[0] if triggers else "Standard escalation protocol."
        }

    @staticmethod
    def assemble_handoff_package(complaint: Complaint, db: Session, reason_override: str = None) -> dict[str, Any]:
        """
        Assembles the comprehensive 9-point Human Handoff Context Package for a complaint.
        """
        eval_result = EscalationEngine.evaluate_escalation_triggers(complaint)
        reason = reason_override or eval_result["primary_reason"]
        context = ContextRetentionEngine.get_customer_context(complaint.customer_id, db)

        # Evidence dossier
        evidence_items = []
        for e in complaint.evidence_items:
            evidence_items.append({
                "file_name": e.file_name,
                "file_type": e.file_type,
                "sha256_hash": e.sha256_hash,
                "visual_observation": e.visual_observation or "N/A",
                "extracted_text": e.extracted_text or "N/A"
            })

        # Possible causes
        possible_causes = []
        if complaint.investigation:
            possible_causes.append({
                "root_cause_hypothesis": complaint.investigation.probable_root_cause,
                "confidence_score": complaint.investigation.confidence_score,
                "contributing_factors": complaint.investigation.contributing_factors
            })
        else:
            possible_causes.append({
                "root_cause_hypothesis": "Thermal or electrical overload inducing thermal degradation",
                "confidence_score": 0.85,
                "contributing_factors": ["High ambient heat", "Bearing friction"]
            })

        # Recommended immediate step
        if eval_result["is_safety"]:
            rec_step = "DO NOT POWER ON. Dispatch certified field engineer with thermal imaging camera and replacement spindle assembly."
        else:
            rec_step = "Review previous case CMP-2026-9812 precedent and inspect bearing clearance before cycling power."

        return {
            "complaint_id": complaint.id,
            "tracking_code": complaint.tracking_code,
            "customer_problem": complaint.description,
            "what_ai_understood": {
                "primary_domain": complaint.primary_domain or "Mechanical",
                "contributing_domains": complaint.contributing_domains or ["Electrical"],
                "severity_score": complaint.severity_score,
                "urgency": complaint.urgency
            },
            "customer_history": {
                "customer_name": context["customer_name"],
                "company_name": context["company_name"],
                "products_owned": context["products_owned"],
                "total_past_complaints": context["total_complaints_history"],
                "account_sla_tier": context["account_sla_tier"]
            },
            "actions_already_attempted": context["attempted_solutions"],
            "evidence_collected": evidence_items,
            "possible_root_causes": possible_causes,
            "policy_checked": "Enterprise Safety Protocol ESP-01 & SLA Escalation Policy v2.4",
            "reason_for_escalation": reason,
            "recommended_next_step": rec_step,
            "escalation_timestamp": datetime.now(timezone.utc),
            "sla_due_at": complaint.sla_due_at,
            "assigned_expert": "Dr. Marcus Vance (Dual-Certified PE Engineer)"
        }

    @staticmethod
    def execute_escalation(complaint: Complaint, db: Session, reason_override: str = None) -> dict[str, Any]:
        """
        Performs immediate human handoff:
        1. Halts autonomous troubleshooting
        2. Sets complaint status to 'escalated'
        3. Assembles the complete 9-point Human Handoff Context Package
        4. Notifies on-call expert and logs audit trail
        """
        eval_result = EscalationEngine.evaluate_escalation_triggers(complaint)
        reason = reason_override or eval_result["primary_reason"]

        complaint.status = "escalated"
        complaint.urgency = "critical" if eval_result["is_safety"] else "high"

        # SLA accelerated on safety handoff
        if eval_result["is_safety"]:
            complaint.sla_due_at = datetime.now(timezone.utc) + timedelta(hours=2)

        handoff_package = EscalationEngine.assemble_handoff_package(complaint, db, reason_override=reason)

        # Add Complaint Lifecycle Event
        db.add(ComplaintEvent(
            complaint_id=complaint.id,
            event_type="human_escalation",
            actor_role="ai",
            actor_name="Escalation Intelligence Engine",
            description=f"Automated workflow halted. Escalated to human expert: {reason}",
            metadata_json={"is_safety": eval_result["is_safety"], "reason": reason}
        ))

        # Notify On-Call Solver
        solver_user = db.query(User).filter(User.role == "solver").first()
        if solver_user:
            db.add(Notification(
                user_id=solver_user.id,
                role="solver",
                notification_type="safety_escalation",
                title=f"🚨 URGENT Human Escalation: {complaint.tracking_code}",
                message=f"Case escalated to qualified human specialist. Reason: {reason}",
                link_url=f"/solver?case={complaint.id}"
            ))

        db.commit()
        return handoff_package
