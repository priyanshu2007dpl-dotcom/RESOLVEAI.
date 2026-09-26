from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel

class IncidentOut(BaseModel):
    id: str
    incident_code: str
    organization_id: str
    title: str
    description: str
    status: str
    severity: str
    primary_domain: str
    root_cause_id: Optional[str] = None
    root_cause_title: Optional[str] = None
    affected_user_count: int
    affected_products: list[str] = []
    affected_regions: list[str] = []
    detected_at: datetime
    resolved_at: Optional[datetime] = None
    linked_complaint_ids: list[str] = []

    class Config:
        from_attributes = True

class ProcessEventOut(BaseModel):
    id: str
    process_name: str
    step_name: str
    step_order: int
    started_at: datetime
    completed_at: datetime
    duration_seconds: int
    is_rework: bool
    is_bottleneck: bool

    class Config:
        from_attributes = True

class ProcessMiningGraphOut(BaseModel):
    process_name: str
    total_traces: int
    bottleneck_steps: list[dict[str, Any]]
    rework_rate: float
    nodes: list[dict[str, Any]]
    transitions: list[dict[str, Any]]
    recommended_optimization: str

class SilentFailureAlertOut(BaseModel):
    alert_id: str
    title: str
    domain: str
    urgency: str
    confidence: float
    detected_pattern: str
    affected_services: list[str]
    complaint_spike_ratio: float
    recommendation: str
    created_at: datetime
