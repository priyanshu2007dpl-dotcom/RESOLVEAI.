import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="SET NULL"), nullable=True, index=True)
    role = Column(String(30), nullable=False)  # customer, solver, company_user, platform_admin
    notification_type = Column(String(50), nullable=False)  # complaint_assigned, safety_escalation, incident_detected, resolution_confirmed, sla_warning
    title = Column(String(160), nullable=False)
    message = Column(Text, nullable=False)
    link_url = Column(String(255), nullable=True)
    read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)

    user = relationship("User", backref="notifications")
