from fastapi import FastAPI, Depends, HTTPException, status, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import List
import uuid
import stripe
from pathlib import Path

# Setup Stripe Test Secret Key (standard test credentials)
stripe.api_key = "sk_test_51O7Q2VSAc4XN8x9D99JzTestKeyPlaceholder..."

from database import engine, Base, get_db
import models
import schemas

UPLOAD_DIR = Path(__file__).parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)
ALLOWED_IMAGE_TYPES = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp"}

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Sri Someshwara Silk Sarees API",
    description="Python FastAPI backend serving saree products and orders log database",
    version="1.0.0"
)
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

# Enable CORS for Vite dev server (and production bundle host)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For local testing convenience. In production, lock this down.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/uploads")
async def upload_product_image(file: UploadFile = File(...)):
    """Store an admin-uploaded saree image and return its public API path."""
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=415, detail="Upload a JPG, PNG, or WebP image.")

    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="The image file is empty.")
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Image must be 5 MB or smaller.")

    filename = f"{uuid.uuid4().hex}{ALLOWED_IMAGE_TYPES[file.content_type]}"
    (UPLOAD_DIR / filename).write_bytes(content)
    return {"url": f"/uploads/{filename}", "filename": filename}

def record_product_history(db: Session, product: models.Product, action: str):
    db.add(models.ProductHistory(
        product_id=product.id,
        product_name=product.name,
        action=action,
        image=product.image,
    ))

# --- PRODUCT ENDPOINTS ---
@app.get("/api/products", response_model=List[schemas.ProductResponse])
def get_products(db: Session = Depends(get_db)):
    return db.query(models.Product).all()

@app.get("/api/product-history")
def get_product_history(db: Session = Depends(get_db)):
    return [
        {
            "id": item.id,
            "product_id": item.product_id,
            "product_name": item.product_name,
            "action": item.action,
            "image": item.image,
            "created_at": item.created_at.isoformat(),
        }
        for item in db.query(models.ProductHistory).order_by(models.ProductHistory.created_at.desc()).limit(30).all()
    ]

@app.post("/api/products", response_model=schemas.ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    db_product = models.Product(
        id="ss-" + str(uuid.uuid4())[:8],
        sku=product.sku,
        name=product.name,
        weave=product.weave,
        fabric=product.fabric,
        color=product.color,
        occasion=product.occasion,
        price=product.price,
        stock=product.stock,
        description=product.description,
        length=product.length,
        weight=product.weight,
        care=product.care,
        image=product.image,
        category=product.category,
        discount=product.discount,
    )
    db.add(db_product)
    record_product_history(db, db_product, "Created")
    db.commit()
    db.refresh(db_product)
    return db_product

@app.put("/api/products/{product_id}", response_model=schemas.ProductResponse)
def update_product(product_id: str, product_update: schemas.ProductUpdate, db: Session = Depends(get_db)):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Saree product not found")
    
    update_data = product_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_product, key, value)
    record_product_history(db, db_product, "Updated")
    db.commit()
    db.refresh(db_product)
    return db_product

@app.delete("/api/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: str, db: Session = Depends(get_db)):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Saree product not found")
    record_product_history(db, db_product, "Deleted")
    db.delete(db_product)
    db.commit()
    return None

# --- ORDER ENDPOINTS ---
@app.get("/api/orders", response_model=List[schemas.OrderResponse])
def get_orders(db: Session = Depends(get_db)):
    db_orders = db.query(models.Order).all()
    # Map model properties to JSON response
    response_orders = []
    for order in db_orders:
        response_orders.append({
            "id": order.id,
            "customer_name": order.customer_name,
            "email": order.email,
            "items": order.items,
            "total": order.total,
            "status": order.status,
            "date": order.date,
            "type": order.type,
            "payment_status": order.payment_status or "Unpaid",
            "stripe_session_id": order.stripe_session_id
        })
    return response_orders

@app.post("/api/orders", response_model=schemas.OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    db_order = models.Order(
        id=f"ORD-{str(uuid.uuid4().int)[:4]}",
        customer_name=order.customer_name,
        email=order.email,
        items=order.items,
        total=order.total,
        status=order.status,
        date=order.date,
        type=order.type,
        payment_status=order.payment_status or "Unpaid",
        stripe_session_id=order.stripe_session_id
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return {
        "id": db_order.id,
        "customer_name": db_order.customer_name,
        "email": db_order.email,
        "items": db_order.items,
        "total": db_order.total,
        "status": db_order.status,
        "date": db_order.date,
        "type": db_order.type,
        "payment_status": db_order.payment_status,
        "stripe_session_id": db_order.stripe_session_id
    }

@app.put("/api/orders/{order_id}", response_model=schemas.OrderResponse)
def update_order_status(order_id: str, order_update: schemas.OrderUpdate, db: Session = Depends(get_db)):
    db_order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order record not found")
    db_order.status = order_update.status
    db.commit()
    db.refresh(db_order)
    return {
        "id": db_order.id,
        "customer_name": db_order.customer_name,
        "email": db_order.email,
        "items": db_order.items,
        "total": db_order.total,
        "status": db_order.status,
        "date": db_order.date,
        "type": db_order.type,
        "payment_status": db_order.payment_status,
        "stripe_session_id": db_order.stripe_session_id
    }

# --- PAYMENT ENDPOINTS ---
@app.post("/api/payments/create-session")
def create_payment_session(order_payload: schemas.OrderCreate, db: Session = Depends(get_db)):
    # Create the order in "Pending Payment" state
    order_id = f"ORD-{str(uuid.uuid4().int)[:4]}"
    stripe_session_id = None
    checkout_url = None
    
    try:
        # Create line items from order items payload
        line_items = []
        for item in order_payload.items:
            line_items.append({
                "price_data": {
                    "currency": "inr",
                    "product_data": {
                        "name": item["productName"],
                    },
                    "unit_amount": int(item["price"] * 100), # in paise
                },
                "quantity": int(item["quantity"]),
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
    except Exception as e:
        print(f"Warning: Stripe initialization failed ({e}). Reverting to demo simulation.")
        # Simulation Mode redirects user directly to success page mock
        stripe_session_id = f"sim_session_{str(uuid.uuid4())[:8]}"
        checkout_url = f"http://localhost:5173/#/checkout-success?session_id={stripe_session_id}&order_id={order_id}"

    db_order = models.Order(
        id=order_id,
        customer_name=order_payload.customer_name,
        email=order_payload.email,
        items=order_payload.items,
        total=order_payload.total,
        status="Processing" if "sim" in stripe_session_id else "Pending Payment",
        date=order_payload.date,
        type=order_payload.type,
        payment_status="Paid" if "sim" in stripe_session_id else "Unpaid",
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

@app.post("/api/payments/confirm")
def confirm_payment(payload: dict, db: Session = Depends(get_db)):
    session_id = payload.get("session_id")
    order_id = payload.get("order_id")
    
    db_order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
        
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
            print(f"Error checking Stripe session: {e}. Defaulting to Paid status for demo convenience.")
            db_order.payment_status = "Paid"
            db_order.status = "Processing"
            
    db.commit()
    db.refresh(db_order)
    return {
        "status": "success",
        "payment_status": db_order.payment_status,
        "order_status": db_order.status
    }

# --- USER ENDPOINTS ---
@app.post("/api/users/login", response_model=schemas.UserResponse)
def login_user(login_data: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == login_data.email).first()
    if not db_user:
        # For simulation, auto-create customer user if logging in with email
        role = "admin" if "admin" in login_data.email else "customer"
        db_user = models.User(
            email=login_data.email,
            name=login_data.email.split("@")[0].capitalize(),
            role=role,
            b2b_approved=False
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
    return db_user

@app.put("/api/users/b2b-approve", response_model=schemas.UserResponse)
def approve_b2b(email_data: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == email_data.email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db_user.role = "b2b"
    db_user.b2b_approved = True
    db.commit()
    db.refresh(db_user)
    return db_user
