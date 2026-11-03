from datetime import datetime
from typing import List, Dict, Any, Optional, Union
from pydantic import BaseModel, EmailStr, Field

# --- AUTH & USER SCHEMAS ---
class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters")
    name: str = Field(..., min_length=2)
    phone: Optional[str] = None
    account_type: str = Field("customer", description="'customer' or 'b2b'")

class UserLoginRequest(BaseModel):
    email: str = Field(..., description="Email address or phone number")
    password: str
    mfa_code: Optional[str] = None  # 6-digit TOTP code for admin MFA

class AdminSetupRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    name: str
    phone: Optional[str] = None
    setup_secret: Optional[str] = None

class MfaVerifyRequest(BaseModel):
    temp_token: str
    code: str = Field(..., min_length=6, max_length=6, description="6-digit TOTP code")

class UserUpdateProfile(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None

class UserRoleUpdate(BaseModel):
    role: Optional[str] = None
    b2b_approved: Optional[bool] = None

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    phone: Optional[str] = None
    role: str
    is_active: bool
    b2b_approved: bool
    mfa_enabled: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- PRODUCT SCHEMAS ---
class ProductBase(BaseModel):
    sku: str
    name: str
    weave: Optional[str] = None
    fabric: Optional[str] = None
    color: Optional[str] = None
    occasion: Optional[str] = None
    price: int
    stock: int
    description: Optional[str] = None
    length: Optional[str] = None
    weight: Optional[str] = None
    care: Optional[str] = None
    image: Optional[str] = None
    category: Optional[str] = "Sarees"
    discount: Optional[int] = 0

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
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- ORDER SCHEMAS ---
class OrderItem(BaseModel):
    productName: str
    quantity: int
    price: int

class OrderCreate(BaseModel):
    customer_name: str
    email: str
    items: List[Dict[str, Any]]
    total: Union[int, float]
    status: Optional[str] = "Processing"
    date: Optional[str] = None
    type: Optional[str] = "B2C"
    payment_status: Optional[str] = "Unpaid"
    stripe_session_id: Optional[str] = None

class OrderUpdate(BaseModel):
    status: str

class OrderResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    customer_name: str
    email: str
    items: List[Dict[str, Any]]
    total: int
    status: str
    date: Optional[str] = None
    type: str
    payment_status: str
    stripe_session_id: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- PRODUCT HISTORY SCHEMA ---
class ProductHistoryResponse(BaseModel):
    id: str
    product_id: str
    product_name: str
    action: str
    image: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# --- AUDIT LOG SCHEMAS ---
class AuditLogResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    user_name: Optional[str] = None
    user_email: Optional[str] = None
    user_role: Optional[str] = None
    action: str
    resource: Optional[str] = None
    ip_address: Optional[str] = None
    device: Optional[str] = None
    details: Optional[Dict[str, Any]] = None
    created_at: datetime

    class Config:
        from_attributes = True

class AuditPageViewRequest(BaseModel):
    page_name: str
    path: Optional[str] = None
    details: Optional[Dict[str, Any]] = None
