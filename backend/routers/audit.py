from typing import List, Optional
from fastapi import APIRouter, Depends, Query, Request, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from dependencies import get_current_admin, get_optional_user
from audit import record_audit

router = APIRouter(prefix="/api/audit-logs", tags=["Audit & Security Logs"])

@router.get("", response_model=List[schemas.AuditLogResponse])
def get_audit_logs(
    action: Optional[str] = Query(None, description="Filter by action keyword"),
    role: Optional[str] = Query(None, description="Filter by user role"),
    search: Optional[str] = Query(None, description="Search by name, email, IP, or resource"),
    limit: int = Query(100, ge=1, le=500),
    admin: models.User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Admin-only endpoint returning system-wide audit logs:
    shows user name, email, role, action, resource, IP address, and device.
    """
    query = db.query(models.AuditLog)

    if action:
        query = query.filter(models.AuditLog.action.ilike(f"%{action}%"))
    if role:
        query = query.filter(models.AuditLog.user_role == role.lower())
    if search:
        s = f"%{search}%"
        query = query.filter(
            (models.AuditLog.user_email.ilike(s)) |
            (models.AuditLog.user_name.ilike(s)) |
            (models.AuditLog.ip_address.ilike(s)) |
            (models.AuditLog.resource.ilike(s)) |
            (models.AuditLog.action.ilike(s))
        )

    return query.order_by(models.AuditLog.created_at.desc()).limit(limit).all()

@router.get("/summary")
def get_audit_summary(
    admin: models.User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Returns high-level security & activity audit KPIs for the Admin Dashboard."""
    total_events = db.query(models.AuditLog).count()
    admin_logins = db.query(models.AuditLog).filter(models.AuditLog.action.ilike("%ADMIN_LOGIN%")).count()
    user_signups = db.query(models.AuditLog).filter(models.AuditLog.action.ilike("%REGISTER%")).count()
    product_actions = db.query(models.AuditLog).filter(models.AuditLog.action.ilike("%PRODUCT%")).count()

    # Distinct IPs
    unique_ips = db.query(models.AuditLog.ip_address).distinct().count()

    return {
        "total_events": total_events,
        "admin_logins": admin_logins,
        "user_signups": user_signups,
        "product_actions": product_actions,
        "unique_ips": unique_ips
    }

@router.post("/page-view")
def log_page_navigation(
    payload: schemas.AuditPageViewRequest,
    request: Request,
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_optional_user)
):
    """
    Logs navigation actions and admin views (where the admin goes, panel switches).
    Captures IP, Device, Page Name, and Role.
    """
    action_type = "ADMIN_PAGE_NAVIGATION" if current_user and current_user.role == "admin" else "PAGE_VIEW"
    record_audit(
        db=db,
        request=request,
        action=action_type,
        resource=f"{payload.page_name} ({payload.path or ''})",
        user=current_user,
        details=payload.details
    )
    return {"status": "logged"}

