import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, JSON
from app.core.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="SET NULL"), nullable=True, index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    user_email = Column(String(160), nullable=True)
    action = Column(String(80), nullable=False)  # login, create_complaint, assign_solver, resolve_case, etc.
    resource_type = Column(String(50), nullable=False)  # complaint, investigation, solver, api_key, etc.
    resource_id = Column(String(100), nullable=True)
    ip_address = Column(String(45), default="127.0.0.1")
    details = Column(JSON, default=dict)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)

class ApiKey(Base):
    __tablename__ = "api_keys"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    key_prefix = Column(String(16), nullable=False)  # e.g. "omni_live_9a8b"
    hashed_key = Column(String(128), nullable=False)
    name = Column(String(80), nullable=False)
    permissions = Column(JSON, default=lambda: ["complaints:write", "complaints:read", "webhooks:manage"])
    last_used_at = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Webhook(Base):
    __tablename__ = "webhooks"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    url = Column(String(300), nullable=False)
    secret = Column(String(64), nullable=False)
    subscribed_events = Column(JSON, default=lambda: ["complaint.created", "complaint.assigned", "complaint.resolved"])
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
