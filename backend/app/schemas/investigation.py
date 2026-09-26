from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel

class CorrectiveActionCreate(BaseModel):
    title: str
    action_type: str = "Immediate Fix"  # Immediate Fix, Preventive, Design Modification, Process Update
    assigned_to: str = "Assigned Solver"
    impact_summary: Optional[str] = None

class CorrectiveActionOut(BaseModel):
    id: str
    investigation_id: str
    complaint_id: str
    title: str
    action_type: str
    status: str
    assigned_to: str
    impact_summary: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class InvestigationOut(BaseModel):
    id: str
    complaint_id: str
    solver_id: Optional[str] = None
    summary: str
    observed_problem: Optional[str] = None
    probable_root_cause: str
    contributing_factors: list[str] = []
    confidence_score: float
    evidence_links: list[dict[str, Any]] = []
    next_steps: list[dict[str, Any]] = []
    safety_verification_required: bool
    human_verified: bool
    status: str
    created_at: datetime
    corrective_actions: list[CorrectiveActionOut] = []

    class Config:
        from_attributes = True

class RootCauseOut(BaseModel):
    id: str
    organization_id: str
    code: str
    title: str
    category: str
    domain: str
    description: str
    incident_count: int
    is_recurring: bool
    prevention_recommendation: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class PreventionRecommendationOut(BaseModel):
    id: str
    organization_id: str
    root_cause_id: str
    title: str
    reason: str
    affected_area: str
    priority: str
    owner: str
    estimated_impact: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class GraphNode(BaseModel):
    id: str
    label: str
    type: str  # complaint, symptom, process, component, failure, root_cause
    data: dict[str, Any] = {}

class GraphEdge(BaseModel):
    id: str
    source: str
    target: str
    label: Optional[str] = None

class RootCauseGraphOut(BaseModel):
    nodes: list[GraphNode]
    edges: list[GraphEdge]
    confidence_score: float
    blast_radius: dict[str, Any]
