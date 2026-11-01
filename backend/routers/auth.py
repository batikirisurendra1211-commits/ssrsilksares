import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from security import (
    hash_password,
    verify_password,
    create_jwt_token,
    decode_jwt_token,
    create_temp_mfa_token,
    generate_totp_secret,
    get_totp_uri,
    verify_totp_code,
    generate_qr_base64,
    set_auth_cookie,
    clear_auth_cookie,
)
from dependencies import get_current_user, get_current_admin, get_optional_user
from config import settings
from audit import record_audit

router = APIRouter(prefix="/api/auth", tags=["Authentication & Users"])

# --- REGISTER (Normal User / B2B) ---
@router.post("/register", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(
    payload: schemas.UserRegister,
    response: Response,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Registers a normal customer or B2B account with password hashing.
    Generates a JWT and sets an HTTP-only cookie automatically.
    Records IP and device in the application audit log.
    """
    existing_user = db.query(models.User).filter(models.User.email == payload.email.lower()).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    account_role = payload.account_type.lower()
    if account_role not in ["customer", "b2b"]:
        account_role = "customer"

    new_user = models.User(
        id=str(uuid.uuid4()),
        email=payload.email.lower(),
        hashed_password=hash_password(payload.password),
        name=payload.name.strip(),
        phone=payload.phone.strip() if payload.phone else None,
        role=account_role,
        is_active=True,
        b2b_approved=False,  # B2B requires approval from admin
        mfa_enabled=False
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Record audit log
    record_audit(
        db=db,
        request=request,
        action="USER_REGISTER",
        resource=f"/api/auth/register ({account_role.upper()})",
        user=new_user,
        details={"account_type": account_role, "name": new_user.name}
    )

    # Issue JWT and set HTTP-only cookie
    token = create_jwt_token({
        "sub": new_user.id,
        "email": new_user.email,
        "role": new_user.role,
        "type": "access"
    })
    set_auth_cookie(response, token)

    return new_user

# --- ADMIN SETUP (Dynamic initial admin creation without hardcoded accounts) ---
@router.post("/admin/setup", status_code=status.HTTP_201_CREATED)
def setup_initial_admin(
    payload: schemas.AdminSetupRequest,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Secure bootstrap endpoint to create an administrator.
    Allowed if no admin exists yet OR if matching ADMIN_SETUP_SECRET is provided.
    Generates MFA TOTP secret and returns QR code for Authenticator app.
    """
    admin_count = db.query(models.User).filter(models.User.role == "admin").count()
    if admin_count > 0:
        if not payload.setup_secret or payload.setup_secret != settings.ADMIN_SETUP_SECRET:
            record_audit(
                db=db,
                request=request,
                action="ADMIN_SETUP_FAILED",
                resource="/api/auth/admin/setup",
                user_email=payload.email,
                details={"reason": "Invalid or missing setup secret"}
            )
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin already configured. Valid setup secret required to create additional admins."
            )

    existing = db.query(models.User).filter(models.User.email == payload.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account with this email already exists."
        )

    # Generate MFA secret and QR code for the admin
    mfa_secret = generate_totp_secret()
    totp_uri = get_totp_uri(mfa_secret, payload.email.lower())
    qr_code_b64 = generate_qr_base64(totp_uri)

    admin_user = models.User(
        id=str(uuid.uuid4()),
        email=payload.email.lower(),
        hashed_password=hash_password(payload.password),
        name=payload.name.strip(),
        phone=payload.phone.strip() if payload.phone else None,
        role="admin",
        is_active=True,
        b2b_approved=True,
        mfa_secret=mfa_secret,
        mfa_enabled=False  # Will be enabled once they verify first TOTP code
    )
    db.add(admin_user)
    db.commit()
    db.refresh(admin_user)

    # Record audit log
    record_audit(
        db=db,
        request=request,
        action="ADMIN_INITIAL_SETUP",
        resource="/api/auth/admin/setup",
        user=admin_user,
        details={"name": admin_user.name, "email": admin_user.email}
    )

    temp_token = create_temp_mfa_token(admin_user.id, is_setup=True)

    return {
        "message": "Admin account created successfully. Scan the QR code in Google Authenticator or Authy to complete MFA activation.",
        "admin_id": admin_user.id,
        "email": admin_user.email,
        "mfa_setup": {
            "secret": mfa_secret,
            "qr_code": qr_code_b64,
            "otpauth_uri": totp_uri,
            "temp_token": temp_token
        }
    }

# --- LOGIN (User & Admin MFA-aware) ---
@router.post("/login")
def login(
    payload: schemas.UserLoginRequest,
    response: Response,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Handles login for all roles:
    - Normal users (Customer, B2B): Verified by password, receives HTTP-only JWT cookie.
    - Admin users: MFA enforcement. If MFA is active, checks mfa_code or returns mfa_required with temp_token.
    Logs each attempt with IP and Device.
    """
    user = db.query(models.User).filter(models.User.email == payload.email.lower()).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        record_audit(
            db=db,
            request=request,
            action="LOGIN_FAILED",
            resource="/api/auth/login",
            user_email=payload.email.lower(),
            user_role="unknown",
            details={"reason": "Invalid credentials"}
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    if not user.is_active:
        record_audit(
            db=db,
            request=request,
            action="LOGIN_BLOCKED_INACTIVE",
            resource="/api/auth/login",
            user=user,
            details={"reason": "Account deactivated"}
        )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated. Please contact support."
        )

    # --- ADMIN MFA FLOW ---
    if user.role == "admin":
        if user.mfa_enabled:
            if not payload.mfa_code:
                temp_token = create_temp_mfa_token(user.id, is_setup=False)
                record_audit(
                    db=db,
                    request=request,
                    action="ADMIN_LOGIN_MFA_PROMPT",
                    resource="/api/auth/login",
                    user=user,
                    details={"status": "Awaiting 2FA TOTP code"}
                )
                return {
                    "mfa_required": True,
                    "mfa_setup": False,
                    "temp_token": temp_token,
                    "message": "Two-factor authentication code required for admin login."
                }

            # Direct code verification if passed in payload
            if not verify_totp_code(user.mfa_secret, payload.mfa_code):
                record_audit(
                    db=db,
                    request=request,
                    action="ADMIN_MFA_FAILED",
                    resource="/api/auth/login",
                    user=user,
                    details={"reason": "Invalid TOTP code"}
                )
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid MFA verification code."
                )
        else:
            # 2. Admin whose MFA is not yet enabled -> trigger MFA setup flow
            if not user.mfa_secret:
                user.mfa_secret = generate_totp_secret()
                db.commit()

            totp_uri = get_totp_uri(user.mfa_secret, user.email)
            qr_code_b64 = generate_qr_base64(totp_uri)
            temp_token = create_temp_mfa_token(user.id, is_setup=True)

            record_audit(
                db=db,
                request=request,
                action="ADMIN_MFA_SETUP_PROMPT",
                resource="/api/auth/login",
                user=user,
                details={"status": "QR Code generated for 2FA onboarding"}
            )

            return {
                "mfa_required": True,
                "mfa_setup_required": True,
                "temp_token": temp_token,
                "secret": user.mfa_secret,
                "qr_code": qr_code_b64,
                "message": "Admin MFA setup required. Scan QR code and enter 6-digit code to complete login."
            }

    # --- NORMAL USER / VERIFIED ADMIN: Issue JWT Cookie ---
    token = create_jwt_token({
        "sub": user.id,
        "email": user.email,
        "role": user.role,
        "type": "access"
    })
    set_auth_cookie(response, token)

    record_audit(
        db=db,
        request=request,
        action="USER_LOGIN_SUCCESS",
        resource="/api/auth/login",
        user=user,
        details={"role": user.role}
    )

    return {
        "message": "Login successful.",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "phone": user.phone,
            "role": user.role,
            "b2b_approved": user.b2b_approved,
            "mfa_enabled": user.mfa_enabled
        }
    }

# --- MFA VERIFICATION / ACTIVATION ---
@router.post("/mfa/verify")
def verify_mfa(
    payload: schemas.MfaVerifyRequest,
    response: Response,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Completes MFA verification for admin logins or initial setup.
    Sets the HTTP-only JWT cookie upon success and logs the security audit event.
    """
    token_data = decode_jwt_token(payload.temp_token)
    if not token_data or token_data.get("type") != "mfa_pending":
        record_audit(
            db=db,
            request=request,
            action="MFA_TOKEN_EXPIRED",
            resource="/api/auth/mfa/verify",
            details={"reason": "Invalid or expired temp token"}
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="MFA session expired or invalid. Please log in again."
        )

    user_id = token_data.get("sub")
    is_setup = token_data.get("is_setup", False)

    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    if not verify_totp_code(user.mfa_secret, payload.code):
        record_audit(
            db=db,
            request=request,
            action="ADMIN_MFA_FAILED",
            resource="/api/auth/mfa/verify",
            user=user,
            details={"reason": "Invalid 6-digit TOTP code"}
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid 6-digit verification code. Please check your authenticator app and try again."
        )

    # Enable MFA permanently if this was an initial setup
    if is_setup or not user.mfa_enabled:
        user.mfa_enabled = True
        db.commit()

    # Success -> Issue full access token in HTTP-only cookie
    access_token = create_jwt_token({
        "sub": user.id,
        "email": user.email,
        "role": user.role,
        "type": "access"
    })
    set_auth_cookie(response, access_token)

    record_audit(
        db=db,
        request=request,
        action="ADMIN_LOGIN_MFA_SUCCESS",
        resource="/api/auth/mfa/verify",
        user=user,
        details={"is_setup_completed": is_setup}
    )

    return {
        "message": "Two-factor authentication successful.",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "phone": user.phone,
            "role": user.role,
            "b2b_approved": user.b2b_approved,
            "mfa_enabled": user.mfa_enabled
        }
    }

# --- GET CURRENT AUTHENTICATED USER ---
@router.get("/me", response_model=schemas.UserResponse)
def get_me(current_user: models.User = Depends(get_current_user)):
    """
    Returns profile information of currently logged in user based on HTTP-only cookie.
    """
    return current_user

# --- UPDATE CURRENT USER PROFILE ---
@router.put("/me", response_model=schemas.UserResponse)
def update_me(
    payload: schemas.UserUpdateProfile,
    request: Request,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Allows user to update their own profile (name, phone).
    """
    if payload.name is not None:
        current_user.name = payload.name.strip()
    if payload.phone is not None:
        current_user.phone = payload.phone.strip()

    db.commit()
    db.refresh(current_user)

    record_audit(
        db=db,
        request=request,
        action="USER_PROFILE_UPDATED",
        resource="/api/auth/me",
        user=current_user,
        details={"name": current_user.name, "phone": current_user.phone}
    )

    return current_user

# --- LOGOUT ---
@router.post("/logout")
def logout(
    response: Response,
    request: Request,
    current_user: Optional[models.User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    """
    Clears the HTTP-only access token cookie and records logout.
    """
    if current_user:
        record_audit(
            db=db,
            request=request,
            action="USER_LOGOUT",
            resource="/api/auth/logout",
            user=current_user
        )
    clear_auth_cookie(response)
    return {"message": "Logged out successfully."}

# --- ADMIN USER MANAGEMENT ---
@router.get("/users", response_model=List[schemas.UserResponse])
def list_users(
    admin: models.User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Admin-only endpoint to view all registered users.
    """
    return db.query(models.User).order_by(models.User.created_at.desc()).all()

@router.put("/users/{user_id}/approve-b2b", response_model=schemas.UserResponse)
def approve_b2b_account(
    user_id: str,
    request: Request,
    admin: models.User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Admin-only endpoint to approve a B2B partner account.
    """
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User account not found.")

    user.role = "b2b"
    user.b2b_approved = True
    db.commit()
    db.refresh(user)

    record_audit(
        db=db,
        request=request,
        action="B2B_PARTNER_APPROVED",
        resource=f"User {user.email}",
        user=admin,
        details={"approved_user_id": user.id, "approved_user_email": user.email}
    )

    return user

@router.put("/users/{user_id}/role", response_model=schemas.UserResponse)
def update_user_role(
    user_id: str,
    payload: schemas.UserRoleUpdate,
    request: Request,
    admin: models.User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Admin-only endpoint to change user role or active status.
    """
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User account not found.")

    if payload.role:
        if payload.role not in ["customer", "b2b", "admin"]:
            raise HTTPException(status_code=400, detail="Invalid role specified.")
        user.role = payload.role
    if payload.b2b_approved is not None:
        user.b2b_approved = payload.b2b_approved

    db.commit()
    db.refresh(user)

    record_audit(
        db=db,
        request=request,
        action="USER_ROLE_UPDATED",
        resource=f"User {user.email}",
        user=admin,
        details={"updated_user_id": user.id, "new_role": user.role, "b2b_approved": user.b2b_approved}
    )

    return user
