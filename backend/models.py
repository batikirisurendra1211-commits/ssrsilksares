import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Boolean, JSON, DateTime, Text
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    name = Column(String(150), nullable=False)
    phone = Column(String(50), nullable=True)
    role = Column(String(50), default="customer", nullable=False)  # "customer", "b2b", "admin"
    is_active = Column(Boolean, default=True, nullable=False)
    b2b_approved = Column(Boolean, default=False, nullable=False)
    mfa_secret = Column(String(64), nullable=True)  # TOTP secret for admin MFA
    mfa_enabled = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

class Product(Base):
    __tablename__ = "products"

    id = Column(String(36), primary_key=True, default=lambda: f"ss-{uuid.uuid4().hex[:8]}", index=True)
    sku = Column(String(100), unique=True, index=True, nullable=False)
    name = Column(String(255), index=True, nullable=False)
    weave = Column(String(100), nullable=True)
    fabric = Column(String(100), nullable=True)
    color = Column(String(100), nullable=True)
    occasion = Column(String(100), nullable=True)
    price = Column(Integer, nullable=False)
    stock = Column(Integer, default=0, nullable=False)
    description = Column(Text, nullable=True)
    length = Column(String(100), nullable=True)
    weight = Column(String(100), nullable=True)
    care = Column(String(255), nullable=True)
    image = Column(Text, nullable=True)  # URL, relative path, or data URI
    category = Column(String(100), default="Sarees")
    discount = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

class Order(Base):
    __tablename__ = "orders"

    id = Column(String(36), primary_key=True, default=lambda: f"ORD-{uuid.uuid4().hex[:8].upper()}", index=True)
    user_id = Column(String(36), nullable=True, index=True)
    customer_name = Column(String(255), nullable=False)
    email = Column(String(255), index=True, nullable=False)
    items = Column(JSON, nullable=False)  # list of {"productName": ..., "quantity": ..., "price": ...}
    total = Column(Integer, nullable=False)
    status = Column(String(50), default="Processing", nullable=False)
    date = Column(String(50), nullable=True)
    type = Column(String(50), default="B2C", nullable=False)  # "B2C" or "B2B"
    payment_status = Column(String(50), default="Unpaid", nullable=False)
    stripe_session_id = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

class ProductHistory(Base):
    __tablename__ = "product_history"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    product_id = Column(String(36), index=True, nullable=False)
    product_name = Column(String(255), nullable=False)
    action = Column(String(50), nullable=False)  # "Created", "Updated", "Deleted"
    image = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(String(36), nullable=True, index=True)
    user_name = Column(String(150), nullable=True)
    user_email = Column(String(255), nullable=True, index=True)
    user_role = Column(String(50), nullable=True)
    action = Column(String(100), nullable=False, index=True)
    resource = Column(String(255), nullable=True)
    ip_address = Column(String(100), nullable=True)
    device = Column(String(255), nullable=True)
    details = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
