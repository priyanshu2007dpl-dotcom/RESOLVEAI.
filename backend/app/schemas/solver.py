from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel

class SolverSkillOut(BaseModel):
    id: str
    skill_name: str
    domain: str
    proficiency_level: str

    class Config:
        from_attributes = True

class SolverOut(BaseModel):
    id: str
    user_id: str
    full_name: str
    email: str
    primary_domain: str
    secondary_domains: list[str] = []
    experience_years: int
    availability_status: str
    max_concurrent_complaints: int
    current_workload: int
    average_rating: float
    avg_resolution_hours: float
    location: str
    certifications: list[str] = []
    skills: list[SolverSkillOut] = []

    class Config:
        from_attributes = True

class SolverMatchResponse(BaseModel):
    solver: SolverOut
    match_score: float  # 0 to 100
    match_reasons: list[str]
    skill_overlap: list[str]
    sla_feasibility: str
    workload_status: str

class SolverAssignRequest(BaseModel):
    solver_id: str
    notes: Optional[str] = None
