import base64
import io
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
import bcrypt
import jwt
import pyotp
import qrcode
from fastapi import Response, Request, HTTPException, status
from config import settings

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except Exception:
        return False

def create_jwt_token(payload: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    to_encode = payload.copy()
    now = datetime.utcnow()
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"iat": now, "exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def decode_jwt_token(token: str) -> Optional[Dict[str, Any]]:
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except (jwt.PyJWTError, Exception):
        return None

def create_temp_mfa_token(user_id: str, is_setup: bool = False) -> str:
    """Short-lived JWT (5 minutes) specifically for MFA verification step"""
    expire = datetime.utcnow() + timedelta(minutes=5)
    payload = {
        "sub": user_id,
        "type": "mfa_pending",
        "is_setup": is_setup,
        "exp": expire,
        "iat": datetime.utcnow()
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

# --- TOTP MFA HELPERS ---
def generate_totp_secret() -> str:
    return pyotp.random_base32()

def get_totp_uri(secret: str, email: str, issuer: str = "Sri Someshwara Silks") -> str:
    totp = pyotp.TOTP(secret)
    return totp.provisioning_uri(name=email, issuer_name=issuer)

def verify_totp_code(secret: str, code: str) -> bool:
    if not secret or not code:
        return False
    totp = pyotp.TOTP(secret)
    # valid_window=1 allows a +/- 30s clock drift
    return bool(totp.verify(code.strip(), valid_window=1))

def generate_qr_base64(otp_uri: str) -> str:
    qr = qrcode.QRCode(
        version=1,
        box_size=10,
        border=3
    )
    qr.add_data(otp_uri)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    b64_str = base64.b64encode(buf.getvalue()).decode("utf-8")
    return f"data:image/png;base64,{b64_str}"

# --- COOKIE HELPERS ---
def set_auth_cookie(response: Response, token: str):
    max_age = settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    response.set_cookie(
        key=settings.COOKIE_NAME,
        value=token,
        max_age=max_age,
        expires=max_age,
        httponly=settings.COOKIE_HTTPONLY,
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
        path="/"
    )

def clear_auth_cookie(response: Response):
    response.delete_cookie(
        key=settings.COOKIE_NAME,
        path="/"
    )

