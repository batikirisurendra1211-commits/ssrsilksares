# Sri Someshwara Silk Sarees (SS Silks)

Sri Someshwara Silk Sarees (SS Silks) is a modern full-stack web application designed for premium Gadwal and handloom saree sales. It supports both retail customers (B2C), wholesale partners (B2B), and store administrators with a comprehensive inventory and order fulfillment management panel.

🌐 **Live Website:** [https://sssilksarees.vercel.app](https://sssilksarees.vercel.app)

---

## ✨ Features

### 🛍️ Customers (B2C)
*   **Curated Catalog:** Browse premium handloom and Gadwal Semi Silk / Semi Cicco sarees.
*   **Virtual Drape Preview:** Select saree colors and visualize the drape styling (zari borders, pallu details).
*   **Stripe Payment Integration:** Secure online credit/debit card checkouts using safe Stripe Test cards (with frictionless simulated mode fallback).
*   **Order Success Screens:** Dynamic validation success pages providing detailed order receipts and histories.

### 🤝 Wholesale Partners (B2B)
*   **Bulk Enquiry Forms:** Register business profiles to unlock wholesale manufacturer rates.
*   **Tiered Partner Discounts:** Auto-applied **25% wholesale discount** on checkout for bulk orders (30+ items).
*   **B2B Client Dashboard:** Custom tracking of wholesale order receipts and partner levels.

### 👑 Store Owners (Admin)
*   **Fulfillment Center:** View, search, and manage order statuses (*Processing, Shipped, Delivered, Cancelled*).
*   **Payment Status Badges:** Instantly track whether an order is `Paid` or `Unpaid`.
*   **Stock Levels Alert:** Monitor live loom stock levels and update inventories on the fly.
*   **Dynamic Saree Editor:** Discontinue existing saree products or create new collections.

---

## 🛠️ Technology Stack

*   **Frontend:** React (Vite), Framer Motion (premium animations), Lucide React (icons), Vanilla CSS.
*   **Backend:** Python, FastAPI, Uvicorn, SQLAlchemy.
*   **Database:** PostgreSQL (with SQLite fallback).
*   **Settlement:** Stripe Checkout API (Test Environment).
*   **Deployment:** Vercel.

---

## 🚀 Setup & Execution

### 1. Prerequisites
Ensure you have **Python 3.12+** and **Node.js 18+** installed.

### 2. Backend Installation (FastAPI)
Navigate to the root directory and install dependencies:
```bash
pip install -r backend/requirements.txt
```

Seed the local database with pre-configured products and users:
```bash
python -m backend.seed
```

Start the local backend API server:
```bash
python -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```
*API Docs available locally at:* http://127.0.0.1:8000/docs

### 3. Frontend Installation (Vite)
Install package dependencies:
```bash
npm install
```

Start the local development server:
```bash
npm run dev
```
*Frontend app running locally at:* http://localhost:5173/

---

## 🔑 Test Accounts & Portals

Use the following credentials inside the **My Account** portal for testing:

| Account Type | Email Address | Password |
| :--- | :--- | :--- |
| **Store Owner (Admin)** | `admin@sssilksarees.com` | `admin123` |
| **Wholesale Partner (B2B)** | `retailer@sareebazaar.com` | *Any password* |
| **Retail Customer** | `customer@gmail.com` | *Any password* |

---

## 💳 Stripe Test Payment Flow

When choosing **Stripe Test Card** in checkout:
1. The app requests a Stripe session from the backend.
2. If Stripe keys are configured, it redirects to Stripe's secure test checkout page. You can use standard test card number `4242 4242 4242 4242` with any future expiry and CVV.
3. If Stripe keys are empty/unreachable, the backend falls back to **Simulation Mode**, redirecting you to the success screen seamlessly.
4. On redirection, the `/api/payments/confirm` endpoint validates the payment and updates the order status to `Paid` in the database.
5. In the **Owner Admin Dashboard**, the payment status badge will instantly toggle to green: **Payment: Paid**.
