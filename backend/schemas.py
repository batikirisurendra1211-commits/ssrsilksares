from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class ProductBase(BaseModel):
    sku: str
    name: str
    weave: str
    fabric: str
    color: str
    occasion: str
    price: int
    stock: int
    description: str
    length: str
    weight: str
    care: str
    image: str
    category: str = "Sarees"
    discount: int = 0

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    sku: Optional[str] = None
    price: Optional[int] = None
    stock: Optional[int] = None
    weave: Optional[str] = None
    fabric: Optional[str] = None
    color: Optional[str] = None
    occasion: Optional[str] = None
    description: Optional[str] = None
    care: Optional[str] = None
    image: Optional[str] = None
    category: Optional[str] = None
    discount: Optional[int] = None
    length: Optional[str] = None
    weight: Optional[str] = None

class ProductResponse(ProductBase):
    id: str

    class Config:
        orm_mode = True

class OrderItem(BaseModel):
    productName: str
    quantity: int
    price: int

class OrderCreate(BaseModel):
    customer_name: str
    email: str
    items: List[Dict[str, Any]]
    total: int
    status: str
    date: str
    type: str
    payment_status: Optional[str] = "Unpaid"
    stripe_session_id: Optional[str] = None

class OrderUpdate(BaseModel):
    status: str

class OrderResponse(BaseModel):
    id: str
    customer_name: str
    email: str
    items: List[Dict[str, Any]]
    total: int
    status: str
    date: str
    type: str
    payment_status: str
    stripe_session_id: Optional[str] = None

    class Config:
        orm_mode = True

class UserBase(BaseModel):
    email: str
    name: str
    role: str
    b2b_approved: bool

class UserLogin(BaseModel):
    email: str

class UserResponse(UserBase):
    class Config:
        orm_mode = True
