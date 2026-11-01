"""
Interactive Admin Account Creation Script
Allows creating an administrator dynamically without hardcoding credentials in the codebase.
Usage:
    python scripts/create_admin.py
"""
import sys
import uuid
import getpass
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from database import SessionLocal
import models
from security import hash_password, generate_totp_secret, get_totp_uri

def create_admin():
    print("=" * 60)
    print("Sri Someshwara Silk Sarees - Administrator Account Creation")
    print("=" * 60)

    email = input("Admin Email: ").strip().lower()
    if not email or "@" not in email:
        print("Error: Valid email address is required.")
        return

    name = input("Admin Full Name: ").strip()
    if not name:
        name = "Administrator"

    phone = input("Admin Phone (optional): ").strip() or None

    password = getpass.getpass("Admin Password (min 8 chars): ")
    if len(password) < 8:
        print("Error: Password must be at least 8 characters.")
        return

    password_confirm = getpass.getpass("Confirm Admin Password: ")
    if password != password_confirm:
        print("Error: Passwords do not match.")
        return

    db = SessionLocal()
    try:
        existing = db.query(models.User).filter(models.User.email == email).first()
        if existing:
            print(f"Error: An account with email '{email}' already exists.")
            return

        mfa_secret = generate_totp_secret()
        totp_uri = get_totp_uri(mfa_secret, email)

        new_admin = models.User(
            id=str(uuid.uuid4()),
            email=email,
            hashed_password=hash_password(password),
            name=name,
            phone=phone,
            role="admin",
            is_active=True,
            b2b_approved=True,
            mfa_secret=mfa_secret,
            mfa_enabled=False  # Admin will scan QR code and verify code on first login
        )
        db.add(new_admin)
        db.commit()
        db.refresh(new_admin)

        print("\n" + "=" * 60)
        print("SUCCESS: Admin account created successfully!")
        print(f"User ID:    {new_admin.id}")
        print(f"Email:      {new_admin.email}")
        print(f"Role:       {new_admin.role}")
        print(f"MFA Secret: {mfa_secret}")
        print(f"TOTP URI:   {totp_uri}")
        print("=" * 60)
        print("When logging in through the admin portal, scan this TOTP URI or input the secret into Google Authenticator/Authy.")

    except Exception as e:
        db.rollback()
        print(f"Database error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_admin()

