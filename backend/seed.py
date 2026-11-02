from database import SessionLocal, engine, Base
import models
from security import hash_password

def seed_admin(db):
    """
    Seeds or updates the primary administrator account (suri@gmail.com).
    """
    try:
        admin_email = "suri@gmail.com"
        existing = db.query(models.User).filter(models.User.email == admin_email).first()
        if not existing:
            new_admin = models.User(
                id="usr-admin-suri",
                email=admin_email,
                name="Suri",
                hashed_password=hash_password("suri@1234"),
                phone="+918121191577",
                role="admin",
                is_active=True,
                b2b_approved=True,
                mfa_enabled=False
            )
            db.add(new_admin)
            db.commit()
            print(f"Admin account '{admin_email}' created successfully.")
        else:
            existing.name = "Suri"
            existing.role = "admin"
            existing.phone = "+918121191577"
            existing.hashed_password = hash_password("suri@1234")
            existing.is_active = True
            existing.b2b_approved = True
            existing.mfa_enabled = False
            db.commit()
            print(f"Admin account '{admin_email}' updated with latest admin credentials.")
    except Exception as e:
        print(f"Notice: Admin seeding check ({e})")
        db.rollback()

def seed_db():
    """
    Seeds initial catalog sarees and administrator account.
    """
    db = SessionLocal()

    try:
        # 1. Seed or verify Admin Account
        seed_admin(db)

        # 2. Seed Catalog Products
        product_count = db.query(models.Product).count()
        if product_count > 0:
            print(f"Database already contains {product_count} products.")
            return

        print("Seeding initial saree catalog into database...")
        products = [
            models.Product(
                id="ss-001",
                sku="SS-GW-SLK-001",
                name="Classic Crimson Gadwal Semi Silk Saree",
                weave="Gadwal Semi Silk",
                fabric="Semi Silk",
                color="Maroon",
                occasion="Wedding Wear",
                price=3499,
                stock=5,
                description="An elegant Crimson Red Gadwal Semi Silk Saree featuring a contrast rich golden tissue border and an ornate zari-woven checks pallu. Perfectly mimics the drape and shine of traditional pure silk.",
                length="6.3 Meters (5.5m Saree + 0.8m Running Blouse)",
                weight="580 grams",
                care="Dry Clean Recommended to maintain zari luster.",
                image="saree1Img"
            ),
            models.Product(
                id="ss-002",
                sku="SS-GW-CIC-002",
                name="Emerald Green Gadwal Semi Cicco Saree",
                weave="Gadwal Semi Cicco",
                fabric="Semi Cicco",
                color="Emerald Green",
                occasion="Festive Wear",
                price=2799,
                stock=1,
                description="Features a rich emerald green body woven with fine cotton-silk blend threads (Semi Cicco) for maximum comfort and a crisp traditional drape. Finished with a contrasting peacock blue zari border and traditional coin buttis.",
                length="6.3 Meters (5.5m Saree + 0.8m Running Blouse)",
                weight="520 grams",
                care="Gentle Hand Wash with mild detergent, Dry in Shade.",
                image="saree2Img"
            ),
            models.Product(
                id="ss-003",
                sku="SS-GW-SLK-003",
                name="Mustard & Pink Gadwal Heritage Saree",
                weave="Gadwal Semi Silk",
                fabric="Semi Silk",
                color="Mustard Gold",
                occasion="Festive Wear",
                price=3899,
                stock=8,
                description="A heritage mustard gold body paired with a traditional dark pink silk border and a grand pallu. A timeless design originating from Bengaluru weavers, suitable for pujas, housewarmings, and weddings.",
                length="6.3 Meters (5.5m Saree + 0.8m Running Blouse)",
                weight="610 grams",
                care="Dry Clean Recommended.",
                image="saree3Img"
            ),
            models.Product(
                id="ss-004",
                sku="SS-GW-CIC-004",
                name="Royal Sapphire Blue Gadwal Semi Cicco Saree",
                weave="Gadwal Semi Cicco",
                fabric="Semi Cicco",
                color="Royal Blue",
                occasion="Party Wear",
                price=2999,
                stock=3,
                description="Drape in royal sophistication with this deep sapphire blue semi cicco saree featuring pure gold tested zari weaving along the border and a lightweight, breathable drape.",
                length="6.3 Meters (5.5m Saree + 0.8m Running Blouse)",
                weight="540 grams",
                care="Gentle Hand Wash / Dry in Shade.",
                image="saree1Img"
            ),
            models.Product(
                id="ss-005",
                sku="SS-GW-SLK-005",
                name="Rani Pink & Gold Brocade Gadwal Saree",
                weave="Gadwal Semi Silk",
                fabric="Semi Silk",
                color="Pink",
                occasion="Bridal & Wedding",
                price=4299,
                stock=2,
                description="A celebration of rich Indian heritage, this Rani pink saree showcases dense gold floral brocade throughout the pallu and contrasting emerald green borders.",
                length="6.3 Meters (5.5m Saree + 0.8m Running Blouse)",
                weight="640 grams",
                care="Dry Clean Recommended.",
                image="saree2Img"
            ),
            models.Product(
                id="ss-006",
                sku="SS-GW-CIC-006",
                name="Sunlit Yellow & Teal Gadwal Sico Saree",
                weave="Gadwal Semi Cicco",
                fabric="Semi Cicco",
                color="Yellow",
                occasion="Haldi & Festive",
                price=2699,
                stock=6,
                description="Vibrant haldi yellow hue complemented by a striking teal blue border with temple zari geometric patterns. Perfect for daytime rituals and lightweight all-day comfort.",
                length="6.3 Meters (5.5m Saree + 0.8m Running Blouse)",
                weight="500 grams",
                care="Gentle Hand Wash.",
                image="saree3Img"
            ),
            models.Product(
                id="ss-007",
                sku="SS-GW-SLK-007",
                name="Midnight Black & Gold Tissue Gadwal Saree",
                weave="Gadwal Semi Silk",
                fabric="Semi Silk",
                color="Black",
                occasion="Daily Wear",
                price=3699,
                stock=4,
                description="A rare midnight black semi-silk saree bordered by dual gold bands. The simple, elegant plain body highlights the intricate border and block print detail on the pallu, making it perfect for evening celebrations.",
                length="6.3 Meters (5.5m Saree + 0.8m Running Blouse)",
                weight="550 grams",
                care="Dry Clean Only.",
                image="saree1Img"
            ),
            models.Product(
                id="ss-008",
                sku="SS-GW-SLK-008",
                name="Pastel Pink & Olive Semi Silk Saree",
                weave="Gadwal Semi Silk",
                fabric="Semi Silk",
                color="Pink",
                occasion="Festive Wear",
                price=3999,
                stock=2,
                description="Delightful baby pink body paired with an olive green traditional Gadwal double border. Woven in our finest semi-silk fibers, it mimics pure mulberry silk with a smooth hand-feel.",
                length="6.3 Meters (5.5m Saree + 0.8m Olive Blouse)",
                weight="560 grams",
                care="Dry Clean Only.",
                image="saree2Img"
            )
        ]
        db.add_all(products)
        db.commit()
        print(f"Successfully seeded {len(products)} products into database.")
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
