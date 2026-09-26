import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class AutonomousAction(Base):
    __tablename__ = "autonomous_actions"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    complaint_id = Column(String(36), ForeignKey("complaints.id", ondelete="CASCADE"), nullable=False, index=True)
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    
    action_type = Column(String(60), nullable=False)  # reconciliation_refund, resend_confirmation, reset_password, generate_troubleshooting, create_service_ticket, schedule_followup
    permission_tier = Column(String(30), default="low_risk_auto")  # low_risk_auto, medium_risk_confirm, high_risk_blocked
    status = Column(String(30), default="executed")  # executed, pending_approval, rejected
    
    amount = Column(Float, nullable=True)  # e.g., 2000.0 for payment refund
    currency = Column(String(10), default="INR")
    
    payload = Column(JSON, default=dict)
    result_summary = Column(Text, nullable=False)
    policy_citation = Column(String(200), nullable=True)
    
    executed_by = Column(String(80), default="Autonomous Support Agent")
    executed_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    complaint = relationship("Complaint", backref="autonomous_actions")
