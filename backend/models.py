from datetime import datetime
from sqlalchemy import Column, String, Integer, Boolean, JSON, DateTime
from database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True, index=True)
    sku = Column(String, unique=True, index=True)
    name = Column(String, index=True)
    weave = Column(String)
    fabric = Column(String)
    color = Column(String)
    occasion = Column(String)
    price = Column(Integer)
    stock = Column(Integer)
    description = Column(String)
    length = Column(String)
    weight = Column(String)
    care = Column(String)
    image = Column(String) # Will store the relative path or base64 string
    category = Column(String, default="Uncategorized")
    discount = Column(Integer, default=0)

class Order(Base):
    __tablename__ = "orders"

    id = Column(String, primary_key=True, index=True)
    customer_name = Column(String)
    email = Column(String)
    items = Column(JSON) # Stores list of items: [{"productName": ..., "quantity": ..., "price": ...}]
    total = Column(Integer)
    status = Column(String)
    date = Column(String)
    type = Column(String) # B2C or B2B
    payment_status = Column(String, default="Unpaid")
    stripe_session_id = Column(String)

class User(Base):
    __tablename__ = "users"

    email = Column(String, primary_key=True, index=True)
    name = Column(String)
    role = Column(String) # customer, b2b, admin
    b2b_approved = Column(Boolean, default=False)

class ProductHistory(Base):
    __tablename__ = "product_history"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(String, index=True, nullable=False)
    product_name = Column(String, nullable=False)
    action = Column(String, nullable=False)
    image = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
