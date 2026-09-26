from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel

class AIResolutionAuditBase(BaseModel):
    overall_score: int
    confidence_level: str
    quality_tier: str
    accuracy_score: int
    root_cause_depth_score: int
    policy_compliance_score: int
    safety_adherence_score: int
    prevention_impact_score: int
    feedback_to_user: dict[str, Any] = {}
    feedback_to_solver: dict[str, Any] = {}
    feedback_to_company: dict[str, Any] = {}
    feedback_to_admin: dict[str, Any] = {}

class AIResolutionAuditCreate(BaseModel):
    complaint_id: str
    overall_score: Optional[int] = None
    confidence_level: Optional[str] = None
    quality_tier: Optional[str] = None
    feedback_notes: Optional[str] = None

class AIResolutionAuditOut(AIResolutionAuditBase):
    id: str
    complaint_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class AggregateQualityScoresOut(BaseModel):
    average_score: float
    total_evaluated: int
    high_confidence_pct: float
    optimal_resolution_rate: float
    human_in_loop_ratio: float
    sub_metric_averages: dict[str, float]
    domain_benchmarks: list[dict[str, Any]]
    recent_evaluations: list[dict[str, Any]] = []
