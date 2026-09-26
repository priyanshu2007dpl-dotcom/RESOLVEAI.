import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class AIResolutionAudit(Base):
    __tablename__ = "ai_resolution_audits"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    complaint_id = Column(String(36), ForeignKey("complaints.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)

    # Core scoring (0 to 100)
    overall_score = Column(Integer, default=94)
    confidence_level = Column(String(50), default="Very High")  # Optimal, Very High, High, Moderate, Review Needed
    quality_tier = Column(String(80), default="Optimal Automated Resolution")  # e.g., "Optimal Automated Resolution", "Human-Verified Engineered Fix"
    
    # Granular breakdown sub-metrics (0 to 100)
    accuracy_score = Column(Integer, default=96)
    root_cause_depth_score = Column(Integer, default=93)
    policy_compliance_score = Column(Integer, default=99)
    safety_adherence_score = Column(Integer, default=100)
    prevention_impact_score = Column(Integer, default=91)

    # Multi-persona structured feedbacks
    # feedback_to_user: { summary, what_was_fixed, root_cause_explained, proactive_prevention_tips: [], user_verification_prompt, satisfaction_forecast }
    feedback_to_user = Column(JSON, default=dict)

    # feedback_to_solver: { peer_review_critique, diagnostic_accuracy_rating, root_cause_precision, oem_bulletins_cited: [], edge_case_checklist: [], suggestions }
    feedback_to_solver = Column(JSON, default=dict)

    # feedback_to_company: { workload_avoidance_hours, sla_impact_pct, cost_avoided_est, recurrence_risk_reduction, engineering_redesign_advisory, executive_summary }
    feedback_to_company = Column(JSON, default=dict)

    # feedback_to_admin: { inference_latency_ms, hallucination_risk_pct, pii_scrubbed_status, cryptographic_hash_verified, safety_guardrail_status, tenant_isolation_audit }
    feedback_to_admin = Column(JSON, default=dict)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    complaint = relationship("Complaint", back_populates="ai_evaluation")
