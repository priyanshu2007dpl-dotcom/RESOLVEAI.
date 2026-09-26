import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text, JSON, Integer
from sqlalchemy.orm import relationship
from app.core.database import Base

class Policy(Base):
    __tablename__ = "policies"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(160), nullable=False)
    slug = Column(String(80), nullable=False, index=True)
    version = Column(String(20), nullable=False, default="v1.0")  # e.g., v1.0, v1.1, v2.0
    category = Column(String(60), nullable=False)  # Billing & Refund, Warranty & Hardware, Extruder SOP, SLA & Escalation
    content = Column(Text, nullable=False)
    effective_date = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    is_active = Column(Boolean, default=True)
    rules_json = Column(JSON, default=dict)  # structured rules: e.g. {"max_auto_refund_inr": 5000, "return_window_days": 30}
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    organization = relationship("Organization", back_populates="policies")
    drift_records = relationship("PolicyDriftRecord", back_populates="policy", cascade="all, delete-orphan")

class PolicyDriftRecord(Base):
    __tablename__ = "policy_drift_records"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    policy_id = Column(String(36), ForeignKey("policies.id", ondelete="CASCADE"), nullable=False, index=True)
    previous_version = Column(String(20), nullable=False)
    new_version = Column(String(20), nullable=False)
    change_summary = Column(Text, nullable=False)
    detected_drift_type = Column(String(80), nullable=False)  # e.g., "Refund Window Shortened", "Mandatory Photo Requirement Added"
    pre_change_complaint_rate = Column(Integer, default=12)  # complaints / month
    post_change_complaint_rate = Column(Integer, default=38) # complaints / month
    correlation_confidence = Column(String(20), default="High")  # Low, Medium, High
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    policy = relationship("Policy", back_populates="drift_records")
