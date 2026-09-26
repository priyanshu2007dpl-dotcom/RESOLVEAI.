from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.models.user import User, Organization, CustomerProfile
from app.models.solver import Solver
from app.models.audit import AuditLog
from app.schemas.auth import Token, UserLogin, UserRegister, UserOut, PersonaSwitchRequest
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists."
        )

    # Resolve or create organization if company user
    org_id = None
    if user_in.organization_name:
        slug = user_in.organization_name.lower().replace(" ", "-")
        org = db.query(Organization).filter(Organization.slug == slug).first()
        if not org:
            org = Organization(name=user_in.organization_name, slug=slug)
            db.add(org)
            db.flush()
        org_id = org.id
    elif user_in.role in ["company_user", "platform_admin"]:
        # Attach to default demo organization
        default_org = db.query(Organization).first()
        if default_org:
            org_id = default_org.id

    new_user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        role=user_in.role,
        organization_id=org_id
    )
    db.add(new_user)
    db.flush()

    if user_in.role == "customer":
        profile = CustomerProfile(user_id=new_user.id, customer_code=f"CUST-{new_user.id[:6].upper()}")
        db.add(profile)
    elif user_in.role == "solver":
        solver = Solver(
            user_id=new_user.id,
            primary_domain=user_in.domain_specialty or "Mechanical",
            secondary_domains=["Electrical", "Hardware"]
        )
        db.add(solver)

    db.add(AuditLog(
        organization_id=org_id,
        user_id=new_user.id,
        user_email=new_user.email,
        action="user_registered",
        resource_type="user",
        resource_id=new_user.id
    ))
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"sub": new_user.id, "role": new_user.role, "org_id": new_user.organization_id})
    user_out = UserOut.from_orm(new_user)
    if new_user.organization:
        user_out.organization_name = new_user.organization.name

    return Token(access_token=token, token_type="bearer", user=user_out)

@router.post("/login", response_model=Token)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )

    db.add(AuditLog(
        organization_id=user.organization_id,
        user_id=user.id,
        user_email=user.email,
        action="user_login",
        resource_type="auth",
        resource_id=user.id
    ))
    db.commit()

    token = create_access_token({"sub": user.id, "role": user.role, "org_id": user.organization_id})
    user_out = UserOut.from_orm(user)
    if user.organization:
        user_out.organization_name = user.organization.name

    return Token(access_token=token, token_type="bearer", user=user_out)

@router.get("/me", response_model=UserOut)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    user_out = UserOut.from_orm(current_user)
    if current_user.organization:
        user_out.organization_name = current_user.organization.name
    return user_out

@router.post("/switch-persona", response_model=Token)
def switch_persona(payload: PersonaSwitchRequest, db: Session = Depends(get_db)):
    """
    Demo Quick-Switcher: Allows instantaneous persona switching to inspect Customer, Solver,
    Company Admin, and Platform Admin dashboards with zero friction.
    """
    target_role = payload.target_role.lower()
    
    # Map role to pre-seeded demo user
    user = db.query(User).filter(User.role == target_role).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Demo user for role '{target_role}' not found. Please ensure database seed is loaded."
        )

    token = create_access_token({"sub": user.id, "role": user.role, "org_id": user.organization_id})
    user_out = UserOut.from_orm(user)
    if user.organization:
        user_out.organization_name = user.organization.name

    return Token(access_token=token, token_type="bearer", user=user_out)
