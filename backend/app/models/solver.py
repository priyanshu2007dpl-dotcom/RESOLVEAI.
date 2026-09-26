import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class Solver(Base):
    __tablename__ = "solvers"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    primary_domain = Column(String(60), nullable=False, index=True)
    secondary_domains = Column(JSON, default=list)  # e.g. ["Electrical", "Industrial Equipment"]
    experience_years = Column(Integer, default=5)
    availability_status = Column(String(30), default="available")  # available, busy, offline
    max_concurrent_complaints = Column(Integer, default=5)
    current_workload = Column(Integer, default=0)
    average_rating = Column(Float, default=4.9)
    avg_resolution_hours = Column(Float, default=4.5)
    location = Column(String(100), default="Global Remote")
    certifications = Column(JSON, default=list)  # e.g. ["PE Certified", "Six Sigma Black Belt", "AWS Solutions Architect"]
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="solver_profile")
    skills = relationship("SolverSkill", back_populates="solver", cascade="all, delete-orphan")
    assigned_complaints = relationship("Complaint", back_populates="assigned_solver")

class SolverSkill(Base):
    __tablename__ = "solver_skills"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    solver_id = Column(String(36), ForeignKey("solvers.id", ondelete="CASCADE"), nullable=False, index=True)
    skill_name = Column(String(80), nullable=False)
    domain = Column(String(60), nullable=False)
    proficiency_level = Column(String(30), default="Expert")  # Intermediate, Advanced, Expert

    solver = relationship("Solver", back_populates="skills")
