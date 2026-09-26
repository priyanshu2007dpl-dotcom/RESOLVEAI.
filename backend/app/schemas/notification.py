from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class NotificationOut(BaseModel):
    id: str
    user_id: str
    organization_id: Optional[str] = None
    role: str
    notification_type: str
    title: str
    message: str
    link_url: Optional[str] = None
    read: bool
    created_at: datetime

    class Config:
        from_attributes = True
