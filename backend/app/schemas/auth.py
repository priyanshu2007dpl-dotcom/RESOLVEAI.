from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserOut"

class TokenPayload(BaseModel):
    sub: str  # user_id
    role: str
    org_id: Optional[str] = None
    exp: Optional[int] = None

class UserLogin(BaseModel):
    email: str
    password: str

class UserRegister(BaseModel):
    email: str
    password: str
    full_name: str
    role: str = "customer"  # customer, solver, company_user, platform_admin
    organization_name: Optional[str] = None
    domain_specialty: Optional[str] = None

class UserOut(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    organization_id: Optional[str] = None
    organization_name: Optional[str] = None
    avatar_url: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class PersonaSwitchRequest(BaseModel):
    target_role: str  # "customer", "solver", "company_user", "platform_admin"
