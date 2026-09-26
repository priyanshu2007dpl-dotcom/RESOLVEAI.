from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel

class PolicyCreate(BaseModel):
    title: str
    slug: str
    version: str = "v1.0"
    category: str
    content: str
    rules_json: dict[str, Any] = {}

class PolicyOut(BaseModel):
    id: str
    organization_id: str
    title: str
    slug: str
    version: str
    category: str
    content: str
    effective_date: datetime
    is_active: bool
    rules_json: dict[str, Any] = {}
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class PolicyDriftRecordOut(BaseModel):
    id: str
    organization_id: str
    policy_id: str
    previous_version: str
    new_version: str
    change_summary: str
    detected_drift_type: str
    pre_change_complaint_rate: int
    post_change_complaint_rate: int
    correlation_confidence: str
    created_at: datetime

    class Config:
        from_attributes = True

class PolicyDriftAnalysisOut(BaseModel):
    policies_analyzed: int
    active_drift_alerts: list[PolicyDriftRecordOut] = []
    correlation_summary: str
    disclaimer: str = "CORRELATION VS CAUSALITY: Complaint trend shifts around policy release dates represent observed statistical correlation. Causal confirmation requires controlled root-cause verification."
