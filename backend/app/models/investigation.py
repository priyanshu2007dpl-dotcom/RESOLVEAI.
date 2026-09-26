import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class Investigation(Base):
    __tablename__ = "investigations"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    complaint_id = Column(String(36), ForeignKey("complaints.id", ondelete="CASCADE"), unique=True, nullable=False)
    solver_id = Column(String(36), ForeignKey("solvers.id", ondelete="SET NULL"), nullable=True)
    
    summary = Column(Text, nullable=False)
    observed_problem = Column(Text, nullable=True)
    probable_root_cause = Column(Text, nullable=False)
    contributing_factors = Column(JSON, default=list)  # list of strings
    confidence_score = Column(Float, default=0.85)  # 0.0 to 1.0
    
    # Evidence attribution
    evidence_links = Column(JSON, default=list)  # list of {evidence_id, note, source_type}
    next_steps = Column(JSON, default=list)  # list of checklist items for solver
    
    safety_verification_required = Column(Boolean, default=False)
    human_verified = Column(Boolean, default=False)
    status = Column(String(30), default="in_progress")  # in_progress, verified, completed
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    complaint = relationship("Complaint", back_populates="investigation")
    corrective_actions = relationship("CorrectiveAction", back_populates="investigation", cascade="all, delete-orphan")

class RootCause(Base):
    __tablename__ = "root_causes"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    code = Column(String(50), nullable=False, index=True)  # e.g. RC-MECH-409
    title = Column(String(150), nullable=False)
    category = Column(String(80), nullable=False)
    domain = Column(String(60), nullable=False)
    description = Column(Text, nullable=False)
    incident_count = Column(Integer, default=1)
    is_recurring = Column(Boolean, default=False)
    prevention_recommendation = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    incidents = relationship("Incident", back_populates="root_cause")
    prevention_recommendations = relationship("PreventionRecommendation", back_populates="root_cause", cascade="all, delete-orphan")

class CorrectiveAction(Base):
    __tablename__ = "corrective_actions"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    investigation_id = Column(String(36), ForeignKey("investigations.id", ondelete="CASCADE"), nullable=False, index=True)
    complaint_id = Column(String(36), ForeignKey("complaints.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(150), nullable=False)
    action_type = Column(String(50), default="Immediate Fix")  # Immediate Fix, Preventive, Design Modification, Process Update
    status = Column(String(30), default="proposed")  # proposed, approved, implemented, verified
    assigned_to = Column(String(100), default="Assigned Solver")
    impact_summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    investigation = relationship("Investigation", back_populates="corrective_actions")

class PreventionRecommendation(Base):
    __tablename__ = "prevention_recommendations"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    root_cause_id = Column(String(36), ForeignKey("root_causes.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(150), nullable=False)
    reason = Column(Text, nullable=False)
    affected_area = Column(String(120), nullable=False)
    priority = Column(String(20), default="high")  # low, medium, high, critical
    owner = Column(String(100), default="Engineering Leadership")
    estimated_impact = Column(String(150), default="Reduces repeat failures by ~40%")
    status = Column(String(30), default="open")  # open, under_review, approved, implemented
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    root_cause = relationship("RootCause", back_populates="prevention_recommendations")
