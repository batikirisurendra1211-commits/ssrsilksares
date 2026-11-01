from typing import Optional
from fastapi import Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from database import get_db
import models
from security import decode_jwt_token
from config import settings

def extract_token_from_request(request: Request) -> Optional[str]:
    # 1. Check HTTP-only cookie
    cookie_token = request.cookies.get(settings.COOKIE_NAME)
    if cookie_token:
        return cookie_token

    # 2. Check Authorization Header (Bearer token)
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        return auth_header.split(" ", 1)[1].strip()

    return None

def get_current_user(
    request: Request,
    db: Session = Depends(get_db)
) -> models.User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials or session expired.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    token = extract_token_from_request(request)
    if not token:
        raise credentials_exception

    payload = decode_jwt_token(token)
    if not payload:
        raise credentials_exception

    user_id: Optional[str] = payload.get("sub")
    token_type: Optional[str] = payload.get("type", "access")
    if not user_id or token_type != "access":
        raise credentials_exception

    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user or not user.is_active:
        raise credentials_exception

    return user

def get_current_admin(
    current_user: models.User = Depends(get_current_user)
) -> models.User:
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access restricted: administrator privileges required."
        )
    return current_user

def get_optional_user(
    request: Request,
    db: Session = Depends(get_db)
) -> Optional[models.User]:
    token = extract_token_from_request(request)
    if not token:
        return None

    payload = decode_jwt_token(token)
    if not payload:
        return None

    user_id = payload.get("sub")
    if not user_id:
        return None

    return db.query(models.User).filter(models.User.id == user_id, models.User.is_active == True).first()

