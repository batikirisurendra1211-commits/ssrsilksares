import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from dependencies import get_current_admin, get_optional_user
from audit import record_audit

router = APIRouter(prefix="/api", tags=["Products"])

def record_product_history(db: Session, product: models.Product, action: str):
    db.add(models.ProductHistory(
        id=str(uuid.uuid4()),
        product_id=product.id,
        product_name=product.name,
        action=action,
        image=product.image,
    ))

@router.get("/products", response_model=List[schemas.ProductResponse])
def get_products(db: Session = Depends(get_db)):
    """Public list of all saree catalog items"""
    return db.query(models.Product).order_by(models.Product.created_at.desc()).all()

@router.get("/products/{product_id}", response_model=schemas.ProductResponse)
def get_product_by_id(product_id: str, db: Session = Depends(get_db)):
    """Public endpoint to fetch a single saree by ID"""
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Saree product not found.")
    return product

@router.get("/product-history", response_model=List[schemas.ProductHistoryResponse])
def get_product_history(
    db: Session = Depends(get_db)
):
    """Audit history of catalog modifications"""
    return (
        db.query(models.ProductHistory)
        .order_by(models.ProductHistory.created_at.desc())
        .limit(50)
        .all()
    )

@router.post("/products", response_model=schemas.ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    product: schemas.ProductCreate,
    request: Request,
    db: Session = Depends(get_db),
    admin: models.User = Depends(get_current_admin)
):
    """Create a new saree product (Admin only, uses UUID)"""
    existing_sku = db.query(models.Product).filter(models.Product.sku == product.sku).first()
    if existing_sku:
        raise HTTPException(status_code=400, detail=f"A saree with SKU '{product.sku}' already exists.")

    product_id = f"ss-{uuid.uuid4().hex[:8]}"
    db_product = models.Product(
        id=product_id,
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
        category=product.category or "Sarees",
        discount=product.discount or 0,
    )
    db.add(db_product)
    record_product_history(db, db_product, "Created")
    db.commit()
    db.refresh(db_product)

    # Record system-wide audit event with IP & Device
    record_audit(
        db=db,
        request=request,
        action="PRODUCT_CREATED",
        resource=f"{db_product.name} ({db_product.sku})",
        user=admin,
        details={"product_id": db_product.id, "price": db_product.price, "stock": db_product.stock}
    )

    return db_product

@router.put("/products/{product_id}", response_model=schemas.ProductResponse)
def update_product(
    product_id: str,
    product_update: schemas.ProductUpdate,
    request: Request,
    db: Session = Depends(get_db),
    admin: models.User = Depends(get_current_admin)
):
    """Update an existing saree product (Admin only)"""
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Saree product not found.")

    update_data = product_update.model_dump(exclude_unset=True) if hasattr(product_update, "model_dump") else product_update.dict(exclude_unset=True)
    
    if "sku" in update_data and update_data["sku"] != db_product.sku:
        clash = db.query(models.Product).filter(models.Product.sku == update_data["sku"]).first()
        if clash:
            raise HTTPException(status_code=400, detail=f"SKU '{update_data['sku']}' is already in use by another product.")

    for key, value in update_data.items():
        setattr(db_product, key, value)

    record_product_history(db, db_product, "Updated")
    db.commit()
    db.refresh(db_product)

    record_audit(
        db=db,
        request=request,
        action="PRODUCT_UPDATED",
        resource=f"{db_product.name} ({db_product.sku})",
        user=admin,
        details={"product_id": db_product.id, "updated_fields": list(update_data.keys())}
    )

    return db_product

@router.delete("/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: str,
    request: Request,
    db: Session = Depends(get_db),
    admin: models.User = Depends(get_current_admin)
):
    """Delete a saree product (Admin only)"""
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Saree product not found.")

    record_product_history(db, db_product, "Deleted")
    
    record_audit(
        db=db,
        request=request,
        action="PRODUCT_DELETED",
        resource=f"{db_product.name} ({db_product.sku})",
        user=admin,
        details={"deleted_product_id": db_product.id}
    )

    db.delete(db_product)
    db.commit()
    return None
