from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel

class CompanyAnalyticsOut(BaseModel):
    total_complaints: int
    open_complaints: int
    resolved_complaints: int
    critical_complaints: int
    active_incidents: int
    recurring_root_causes: int
    avg_resolution_hours: float
    sla_compliance_rate: float
    first_contact_resolution_rate: float
    repeat_complaint_rate: float
    domain_distribution: list[dict[str, Any]]
    trend_data: list[dict[str, Any]]
    sla_performance: dict[str, Any]

class OperationalEfficiencyOut(BaseModel):
    complaints_outsourced: int
    complaints_resolved: int
    avg_handling_hours_platform: float
    avg_handling_hours_traditional_est: float
    human_investigation_hours_platform: float
    human_investigation_hours_traditional_est: float
    internal_workload_hours_avoided: float
    sla_compliance_platform: float
    sla_compliance_traditional_est: float
    escalation_rate: float
    repeat_complaint_rate: float
    disclaimer: str = "Estimates are modeled based on standard internal cross-functional resolution overhead versus Resolve AI triaging. Actual savings may vary."
    configurable_assumptions: dict[str, Any]

class WhatIfRequest(BaseModel):
    response_sla_hours: float = 2.0  # target SLA
    automate_verification: bool = True  # whether verification step is automated
    preventive_maintenance_enabled: bool = True  # whether high recurring causes are fixed
    simulation_horizon_days: int = 30

class WhatIfResponse(BaseModel):
    projected_resolution_time_hours: float
    projected_sla_compliance_rate: float
    projected_repeat_complaint_reduction_pct: float
    projected_workload_hours_saved: float
    causal_factors_analyzed: list[dict[str, Any]]
    model_type: str = "Counterfactual Structural Causal Model (Estimated)"
    confidence_interval: str
    assumptions_statement: str

class ApiKeyCreate(BaseModel):
    name: str
    permissions: list[str] = ["complaints:write", "complaints:read"]

class ApiKeyOut(BaseModel):
    id: str
    key_prefix: str
    name: str
    permissions: list[str]
    last_used_at: Optional[datetime] = None
    created_at: datetime
    raw_api_key: Optional[str] = None  # Returned only upon creation

class WebhookCreate(BaseModel):
    url: str
    subscribed_events: list[str] = ["complaint.created", "complaint.resolved", "incident.detected"]

class WebhookOut(BaseModel):
    id: str
    url: str
    secret: str
    subscribed_events: list[str]
    is_active: bool
    created_at: datetime

class CsvImportRequest(BaseModel):
    records: list[dict[str, Any]]
    column_mapping: dict[str, str]

class CsvImportResult(BaseModel):
    total_records: int
    imported_count: int
    duplicate_count: int
    errors: list[str]
