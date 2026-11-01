import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from dependencies import get_current_user, get_current_admin, get_optional_user
from audit import record_audit

router = APIRouter(prefix="/api/orders", tags=["Orders"])

@router.get("", response_model=List[schemas.OrderResponse])
def get_orders(
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_optional_user)
):
    """
    Returns orders list:
    - If user is admin: returns ALL orders across the store.
    - If authenticated user: returns orders associated with their email or user ID.
    - If unauthenticated guest: returns empty list.
    """
    if not current_user:
        return []

    if current_user.role == "admin":
        return db.query(models.Order).order_by(models.Order.created_at.desc()).all()

    return (
        db.query(models.Order)
        .filter(
            (models.Order.email == current_user.email) |
            (models.Order.user_id == current_user.id)
        )
        .order_by(models.Order.created_at.desc())
        .all()
    )

@router.get("/{order_id}", response_model=schemas.OrderResponse)
def get_order_by_id(
    order_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_optional_user)
):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")

    if current_user and current_user.role == "admin":
        return order

    if current_user and (order.email.lower() == current_user.email.lower() or order.user_id == current_user.id):
        return order

    raise HTTPException(status_code=403, detail="Not authorized to view this order.")

@router.post("", response_model=schemas.OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    payload: schemas.OrderCreate,
    request: Request,
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_optional_user)
):
    """Creates a new order with generated UUID and logs audit event"""
    order_id = f"ORD-{uuid.uuid4().hex[:8].upper()}"
    user_id = current_user.id if current_user else None

    db_order = models.Order(
        id=order_id,
        user_id=user_id,
        customer_name=payload.customer_name,
        email=payload.email.lower(),
        items=payload.items,
        total=payload.total,
        status=payload.status or "Processing",
        date=payload.date,
        type=payload.type or "B2C",
        payment_status=payload.payment_status or "Unpaid",
        stripe_session_id=payload.stripe_session_id
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    record_audit(
        db=db,
        request=request,
        action="ORDER_CREATED",
        resource=f"Order {db_order.id}",
        user=current_user,
        user_email=payload.email.lower(),
        user_name=payload.customer_name,
        user_role=current_user.role if current_user else "customer",
        details={"total": db_order.total, "item_count": len(payload.items), "type": db_order.type}
    )

    return db_order

@router.put("/{order_id}", response_model=schemas.OrderResponse)
def update_order_status(
    order_id: str,
    payload: schemas.OrderUpdate,
    request: Request,
    db: Session = Depends(get_db),
    admin: models.User = Depends(get_current_admin)
):
    """Admin-only endpoint to update an order's status (e.g. Processing -> Shipped -> Delivered)"""
    db_order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order record not found.")

    old_status = db_order.status
    db_order.status = payload.status
    db.commit()
    db.refresh(db_order)

    record_audit(
        db=db,
        request=request,
        action="ORDER_STATUS_UPDATED",
        resource=f"Order {db_order.id}",
        user=admin,
        details={"order_id": db_order.id, "old_status": old_status, "new_status": payload.status}
    )

    return db_order
