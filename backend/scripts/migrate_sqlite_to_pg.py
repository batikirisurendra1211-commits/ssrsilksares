"""
Script to migrate existing SQLite catalog and orders to PostgreSQL database.
Usage:
    python scripts/migrate_sqlite_to_pg.py
"""
import os
import sys
import sqlite3
import json
from pathlib import Path
from datetime import datetime, timezone

# Add backend directory to path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from config import settings
from database import engine, SessionLocal, Base
import models

def migrate():
    sqlite_path = backend_dir / "sssilksarees.db"
    if not sqlite_path.exists():
        sqlite_path = backend_dir.parent / "sssilksarees.db"

    if not sqlite_path.exists():
        print(f"SQLite file not found at {sqlite_path}")
        return

    print(f"Connecting to SQLite: {sqlite_path}")
    sqlite_conn = sqlite3.connect(sqlite_path)
    sqlite_conn.row_factory = sqlite3.Row
    cur = sqlite_conn.cursor()

    db = SessionLocal()

    try:
        # 1. Products
        cur.execute("SELECT * FROM products")
        products = cur.fetchall()
        migrated_products = 0

        for p in products:
            p_dict = dict(p)
            existing = db.query(models.Product).filter(models.Product.sku == p_dict["sku"]).first()
            if not existing:
                new_p = models.Product(
                    id=p_dict.get("id"),
                    sku=p_dict.get("sku"),
                    name=p_dict.get("name"),
                    weave=p_dict.get("weave"),
                    fabric=p_dict.get("fabric"),
                    color=p_dict.get("color"),
                    occasion=p_dict.get("occasion"),
                    price=p_dict.get("price", 0),
                    stock=p_dict.get("stock", 0),
                    description=p_dict.get("description"),
                    length=p_dict.get("length"),
                    weight=p_dict.get("weight"),
                    care=p_dict.get("care"),
                    image=p_dict.get("image"),
                    category=p_dict.get("category", "Sarees"),
                    discount=p_dict.get("discount", 0),
                )
                db.add(new_p)
                migrated_products += 1

        # 2. Orders
        cur.execute("SELECT * FROM orders")
        orders = cur.fetchall()
        migrated_orders = 0

        for o in orders:
            o_dict = dict(o)
            existing = db.query(models.Order).filter(models.Order.id == o_dict["id"]).first()
            if not existing:
                raw_items = o_dict.get("items")
                if isinstance(raw_items, str):
                    try:
                        items_val = json.loads(raw_items)
                    except Exception:
                        items_val = []
                else:
                    items_val = raw_items or []

                new_order = models.Order(
                    id=o_dict.get("id"),
                    customer_name=o_dict.get("customer_name"),
                    email=o_dict.get("email"),
                    items=items_val,
                    total=o_dict.get("total", 0),
                    status=o_dict.get("status", "Processing"),
                    date=o_dict.get("date"),
                    type=o_dict.get("type", "B2C"),
                    payment_status=o_dict.get("payment_status", "Unpaid"),
                    stripe_session_id=o_dict.get("stripe_session_id")
                )
                db.add(new_order)
                migrated_orders += 1

        db.commit()
        print(f"Migration completed successfully! Added {migrated_products} products and {migrated_orders} orders to PostgreSQL.")

    except Exception as e:
        db.rollback()
        print(f"Error during migration: {e}")
    finally:
        db.close()
        sqlite_conn.close()

if __name__ == "__main__":
    migrate()

