import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class Incident(Base):
    __tablename__ = "incidents"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    incident_code = Column(String(30), unique=True, nullable=False, index=True)  # e.g. INC-2047
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String(30), default="investigating")  # investigating, contained, resolved
    severity = Column(String(20), default="high")  # low, medium, high, critical
    primary_domain = Column(String(60), nullable=False)
    
    root_cause_id = Column(String(36), ForeignKey("root_causes.id", ondelete="SET NULL"), nullable=True)
    affected_user_count = Column(Integer, default=1)
    affected_products = Column(JSON, default=list)
    affected_regions = Column(JSON, default=list)
    
    detected_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    resolved_at = Column(DateTime, nullable=True)

    root_cause = relationship("RootCause", back_populates="incidents")
    complaint_associations = relationship("IncidentComplaint", back_populates="incident", cascade="all, delete-orphan")

class IncidentComplaint(Base):
    __tablename__ = "incident_complaints"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    incident_id = Column(String(36), ForeignKey("incidents.id", ondelete="CASCADE"), nullable=False, index=True)
    complaint_id = Column(String(36), ForeignKey("complaints.id", ondelete="CASCADE"), nullable=False, index=True)
    similarity_score = Column(Float, default=0.88)
    linked_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    incident = relationship("Incident", back_populates="complaint_associations")
    complaint = relationship("Complaint", back_populates="incident_associations")

class ProcessEvent(Base):
    __tablename__ = "process_events"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    complaint_id = Column(String(36), ForeignKey("complaints.id", ondelete="CASCADE"), nullable=False, index=True)
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    process_name = Column(String(100), default="Order-to-Fulfillment")  # Order Fulfillment, Diagnostic Triad, etc.
    step_name = Column(String(80), nullable=False)  # e.g., "Payment Authorization", "Firmware Flash", "Mechanical Calibration"
    step_order = Column(Integer, default=1)
    started_at = Column(DateTime, nullable=False)
    completed_at = Column(DateTime, nullable=False)
    duration_seconds = Column(Integer, default=0)
    is_rework = Column(Boolean, default=False)
    is_bottleneck = Column(Boolean, default=False)

    complaint = relationship("Complaint", back_populates="process_events")
