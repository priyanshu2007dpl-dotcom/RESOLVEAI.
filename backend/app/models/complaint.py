import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class Complaint(Base):
    __tablename__ = "complaints"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    tracking_code = Column(String(30), unique=True, nullable=False, index=True)
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    customer_id = Column(String(36), ForeignKey("customer_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    product_service = Column(String(120), nullable=False)
    transaction_ref = Column(String(100), nullable=True)
    location = Column(String(120), nullable=True)
    urgency = Column(String(20), default="medium")  # low, medium, high, critical
    
    # Lifecycle status: submitted, analyzed, investigating, assigned, in_progress, resolved, confirmed, reopened
    status = Column(String(30), default="submitted", index=True)
    
    # AI extracted multi-domain taxonomy
    primary_domain = Column(String(60), nullable=True, index=True)
    contributing_domains = Column(JSON, default=list)  # e.g. ["Electrical", "Software"]
    severity_score = Column(Integer, default=50)  # 1 - 100
    sentiment_score = Column(Float, default=-0.5)  # -1.0 to 1.0
    detected_entities = Column(JSON, default=dict)
    
    # Assignment & SLA
    assigned_solver_id = Column(String(36), ForeignKey("solvers.id", ondelete="SET NULL"), nullable=True, index=True)
    assigned_at = Column(DateTime, nullable=True)
    sla_due_at = Column(DateTime, nullable=True)
    resolved_at = Column(DateTime, nullable=True)
    closed_at = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    organization = relationship("Organization", back_populates="complaints")
    customer = relationship("CustomerProfile", back_populates="complaints")
    assigned_solver = relationship("Solver", back_populates="assigned_complaints")
    
    evidence_items = relationship("Evidence", back_populates="complaint", cascade="all, delete-orphan")
    events = relationship("ComplaintEvent", back_populates="complaint", cascade="all, delete-orphan", order_by="ComplaintEvent.created_at.asc()")
    investigation = relationship("Investigation", back_populates="complaint", uselist=False, cascade="all, delete-orphan")
    messages = relationship("Message", back_populates="complaint", cascade="all, delete-orphan", order_by="Message.created_at.asc()")
    feedback = relationship("Feedback", back_populates="complaint", uselist=False, cascade="all, delete-orphan")
    ai_evaluation = relationship("AIResolutionAudit", back_populates="complaint", uselist=False, cascade="all, delete-orphan")
    incident_associations = relationship("IncidentComplaint", back_populates="complaint", cascade="all, delete-orphan")
    process_events = relationship("ProcessEvent", back_populates="complaint", cascade="all, delete-orphan")

class Evidence(Base):
    __tablename__ = "evidence"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    complaint_id = Column(String(36), ForeignKey("complaints.id", ondelete="CASCADE"), nullable=False, index=True)
    file_name = Column(String(255), nullable=False)
    file_type = Column(String(30), nullable=False)  # image, pdf, audio, video, text, log
    file_size_bytes = Column(Integer, default=0)
    mime_type = Column(String(100), nullable=False)
    sha256_hash = Column(String(64), nullable=False)
    file_path = Column(String(500), nullable=False)
    
    # Multimodal AI Extractions
    extracted_text = Column(Text, nullable=True)
    visual_observation = Column(Text, nullable=True)
    audio_transcript = Column(Text, nullable=True)
    
    uploaded_by_user_id = Column(String(36), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    complaint = relationship("Complaint", back_populates="evidence_items")

class ComplaintEvent(Base):
    __tablename__ = "complaint_events"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    complaint_id = Column(String(36), ForeignKey("complaints.id", ondelete="CASCADE"), nullable=False, index=True)
    event_type = Column(String(50), nullable=False)  # submitted, classified, solver_matched, assigned, status_change, resolved, confirmed, reopened
    actor_role = Column(String(30), nullable=False)  # system, ai, customer, solver, company_admin
    actor_name = Column(String(100), default="System")
    description = Column(String(255), nullable=False)
    metadata_json = Column(JSON, default=dict)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    complaint = relationship("Complaint", back_populates="events")

class Message(Base):
    __tablename__ = "messages"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    complaint_id = Column(String(36), ForeignKey("complaints.id", ondelete="CASCADE"), nullable=False, index=True)
    sender_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    sender_name = Column(String(120), nullable=False)
    sender_role = Column(String(30), nullable=False)
    message_text = Column(Text, nullable=False)
    is_internal_note = Column(Boolean, default=False)  # Must be hidden from customer!
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    complaint = relationship("Complaint", back_populates="messages")

class Feedback(Base):
    __tablename__ = "feedback"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    complaint_id = Column(String(36), ForeignKey("complaints.id", ondelete="CASCADE"), unique=True, nullable=False)
    customer_id = Column(String(36), ForeignKey("customer_profiles.id", ondelete="CASCADE"), nullable=False)
    rating = Column(Integer, nullable=False)  # 1 to 5
    comment = Column(Text, nullable=True)
    resolution_confirmed = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    complaint = relationship("Complaint", back_populates="feedback")
