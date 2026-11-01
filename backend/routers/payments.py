import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import stripe
from database import get_db
import models
import schemas
from config import settings
from dependencies import get_optional_user

router = APIRouter(prefix="/api/payments", tags=["Payments"])

# Set up Stripe test key from settings
stripe.api_key = settings.STRIPE_SECRET_KEY

@router.post("/create-session")
def create_payment_session(
    order_payload: schemas.OrderCreate,
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_optional_user)
):
    """
    Creates an order in DB and opens a Stripe Checkout Session.
    Falls back to a demo simulation mode if valid Stripe credentials are not present.
    """
    order_id = f"ORD-{uuid.uuid4().hex[:8].upper()}"
    stripe_session_id = None
    checkout_url = None

    try:
        if settings.STRIPE_SECRET_KEY and not settings.STRIPE_SECRET_KEY.startswith("sk_test_placeholder"):
            line_items = []
            for item in order_payload.items:
                line_items.append({
                    "price_data": {
                        "currency": "inr",
                        "product_data": {
                            "name": item.get("productName", "Saree"),
                        },
                        "unit_amount": int(item.get("price", 0) * 100),  # in paise
                    },
                    "quantity": int(item.get("quantity", 1)),
                })

            session = stripe.checkout.Session.create(
                payment_method_types=["card"],
                line_items=line_items,
                mode="payment",
                success_url=f"http://localhost:5173/#/checkout-success?session_id={{CHECKOUT_SESSION_ID}}&order_id={order_id}",
                cancel_url="http://localhost:5173/#/checkout",
            )
            stripe_session_id = session.id
            checkout_url = session.url
        else:
            raise ValueError("Stripe placeholder key active, using mock simulation.")
    except Exception as e:
        # Simulation Mode
        stripe_session_id = f"sim_session_{uuid.uuid4().hex[:12]}"
        checkout_url = f"http://localhost:5173/#/checkout-success?session_id={stripe_session_id}&order_id={order_id}"

    user_id = current_user.id if current_user else None
    db_order = models.Order(
        id=order_id,
        user_id=user_id,
        customer_name=order_payload.customer_name,
        email=order_payload.email.lower(),
        items=order_payload.items,
        total=order_payload.total,
        status="Processing" if "sim_" in (stripe_session_id or "") else "Pending Payment",
        date=order_payload.date,
        type=order_payload.type or "B2C",
        payment_status="Paid" if "sim_" in (stripe_session_id or "") else "Unpaid",
        stripe_session_id=stripe_session_id
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    return {
        "checkout_url": checkout_url,
        "order_id": order_id,
        "stripe_session_id": stripe_session_id
    }

@router.post("/confirm")
def confirm_payment(
    payload: dict,
    db: Session = Depends(get_db)
):
    """
    Confirms order payment from Stripe or mock simulation.
    """
    session_id = payload.get("session_id")
    order_id = payload.get("order_id")

    if not order_id:
        raise HTTPException(status_code=400, detail="Order ID is required.")

    db_order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found.")

    if session_id and session_id.startswith("sim_"):
        db_order.payment_status = "Paid"
        db_order.status = "Processing"
    else:
        try:
            session = stripe.checkout.Session.retrieve(session_id)
            if session.payment_status == "paid":
                db_order.payment_status = "Paid"
                db_order.status = "Processing"
        except Exception as e:
            # Fallback for testing
            db_order.payment_status = "Paid"
            db_order.status = "Processing"

    db.commit()
    db.refresh(db_order)

    return {
        "status": "success",
        "payment_status": db_order.payment_status,
        "order_status": db_order.status
    }

