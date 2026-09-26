from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel

class ComplaintCreate(BaseModel):
    title: str
    description: str
    product_service: str
    organization_slug: Optional[str] = "apex-dynamics"
    transaction_ref: Optional[str] = None
    location: Optional[str] = None
    urgency: str = "medium"  # low, medium, high, critical
    category_hint: Optional[str] = None  # Optional user guess, AI will infer dynamic taxonomy

class EvidenceOut(BaseModel):
    id: str
    complaint_id: str
    file_name: str
    file_type: str
    file_size_bytes: int
    mime_type: str
    sha256_hash: str
    extracted_text: Optional[str] = None
    visual_observation: Optional[str] = None
    audio_transcript: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class ComplaintEventOut(BaseModel):
    id: str
    event_type: str
    actor_role: str
    actor_name: str
    description: str
    metadata_json: Optional[dict[str, Any]] = None
    created_at: datetime

    class Config:
        from_attributes = True

class MessageCreate(BaseModel):
    message_text: str
    is_internal_note: bool = False

class MessageOut(BaseModel):
    id: str
    complaint_id: str
    sender_id: str
    sender_name: str
    sender_role: str
    message_text: str
    is_internal_note: bool
    created_at: datetime

    class Config:
        from_attributes = True

class FeedbackCreate(BaseModel):
    rating: int  # 1 to 5
    comment: Optional[str] = None
    resolution_confirmed: bool = True

class FeedbackOut(BaseModel):
    id: str
    complaint_id: str
    rating: int
    comment: Optional[str] = None
    resolution_confirmed: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ComplaintOut(BaseModel):
    id: str
    tracking_code: str
    organization_id: str
    organization_name: Optional[str] = None
    customer_id: str
    customer_name: Optional[str] = None
    title: str
    description: str
    product_service: str
    transaction_ref: Optional[str] = None
    location: Optional[str] = None
    urgency: str
    status: str
    primary_domain: Optional[str] = None
    contributing_domains: list[str] = []
    severity_score: int
    sentiment_score: float
    detected_entities: dict[str, Any] = {}
    assigned_solver_id: Optional[str] = None
    assigned_solver_name: Optional[str] = None
    sla_due_at: Optional[datetime] = None
    resolved_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ComplaintDetailOut(ComplaintOut):
    evidence_items: list[EvidenceOut] = []
    events: list[ComplaintEventOut] = []
    messages: list[MessageOut] = []
    feedback: Optional[FeedbackOut] = None
    investigation_summary: Optional[dict[str, Any]] = None
    ai_evaluation: Optional[dict[str, Any]] = None
    related_complaints: list[dict[str, Any]] = []

class AutonomousActionOut(BaseModel):
    id: str
    complaint_id: str
    action_type: str
    permission_tier: str
    status: str
    amount: Optional[float] = None
    currency: str = "INR"
    result_summary: str
    policy_citation: Optional[str] = None
    executed_by: str
    executed_at: datetime

    class Config:
        from_attributes = True

class AutonomousSolveResponse(BaseModel):
    success: bool
    action_taken: str
    complaint_id: str
    tracking_code: str
    customer_context_retrieved: dict[str, Any]
    transaction_verified: bool
    policy_checked: str
    execution_result: str
    status: str
    customer_message: str

class HumanHandoffSummaryOut(BaseModel):
    complaint_id: str
    tracking_code: str
    customer_problem: str
    what_ai_understood: dict[str, Any]
    customer_history: dict[str, Any]
    actions_already_attempted: list[str]
    evidence_collected: list[dict[str, Any]]
    possible_root_causes: list[dict[str, Any]]
    policy_checked: str
    reason_for_escalation: str
    recommended_next_step: str
    escalation_timestamp: datetime
    sla_due_at: Optional[datetime] = None
    assigned_expert: Optional[str] = None
