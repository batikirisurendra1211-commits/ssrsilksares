import uuid
from typing import Optional, Dict, Any
from fastapi import Request
from sqlalchemy.orm import Session
import models

def parse_device_info(user_agent: str) -> str:
    """Parses a raw User-Agent header into a clean, human-readable device and browser summary."""
    if not user_agent:
        return "Unknown Device"

    ua = user_agent.lower()
    os_name = "Desktop"
    if "windows nt 10.0" in ua or "windows 11" in ua or "windows" in ua:
        os_name = "Windows"
    elif "macintosh" in ua or "mac os x" in ua:
        os_name = "macOS"
    elif "android" in ua:
        os_name = "Android Mobile"
    elif "iphone" in ua:
        os_name = "iPhone (iOS)"
    elif "ipad" in ua:
        os_name = "iPad (iPadOS)"
    elif "linux" in ua:
        os_name = "Linux"

    browser_name = "Browser"
    if "edg" in ua:
        browser_name = "Edge"
    elif "chrome" in ua and "chromium" not in ua and "edg" not in ua:
        browser_name = "Chrome"
    elif "safari" in ua and "chrome" not in ua:
        browser_name = "Safari"
    elif "firefox" in ua:
        browser_name = "Firefox"
    elif "opera" in ua or "opr" in ua:
        browser_name = "Opera"

    return f"{os_name} • {browser_name}"

def extract_client_ip(request: Request) -> str:
    """Extracts genuine client IP address taking into account reverse proxies."""
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        # First IP in list is client
        return forwarded.split(",")[0].strip()
    
    real_ip = request.headers.get("x-real-ip")
    if real_ip:
        return real_ip.strip()

    if request.client and request.client.host:
        return request.client.host

    return "127.0.0.1"

def record_audit(
    db: Session,
    request: Request,
    action: str,
    resource: str,
    user: Optional[models.User] = None,
    user_email: Optional[str] = None,
    user_name: Optional[str] = None,
    user_role: Optional[str] = None,
    details: Optional[Dict[str, Any]] = None
) -> models.AuditLog:
    """
    Records an application or security audit event with client IP, device, and user information.
    """
    ip = extract_client_ip(request)
    ua = request.headers.get("user-agent", "")
    device = parse_device_info(ua)

    u_id = user.id if user else None
    u_email = (user.email if user else user_email) or "anonymous"
    u_name = (user.name if user else user_name) or "Guest / System"
    u_role = (user.role if user else user_role) or "anonymous"

    audit_entry = models.AuditLog(
        id=str(uuid.uuid4()),
        user_id=u_id,
        user_name=u_name,
        user_email=u_email,
        user_role=u_role,
        action=action,
        resource=resource,
        ip_address=ip,
        device=device,
        details=details or {}
    )

    try:
        db.add(audit_entry)
        db.commit()
        db.refresh(audit_entry)
    except Exception as e:
        db.rollback()
        print(f"Warning: Failed to record audit log: {e}")

    return audit_entry

