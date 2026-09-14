import React, { useState } from "react";
import { CheckCircle, ShieldCheck, MapPin, CreditCard, ShoppingBag, ArrowLeft } from "lucide-react";

export default function Checkout({ 
  cart, 
  clearCart, 
  currentUser, 
  setOrders, 
  productsList,
  setProductsList,
  setCurrentTab,
  fetchOrders
}) {
  const [shippingData, setShippingData] = useState({
    name: currentUser ? currentUser.name : "",
    address: "",
    city: "",
    pincode: "",
    phone: currentUser ? (currentUser.phone || "") : "",
    paymentMethod: "cod" // options: 'cod', 'upi'
  });

  const [orderCompleted, setOrderCompleted] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState("");

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  
  // Apply B2B Bulk discount if user has B2B partner role
  const isB2B = currentUser && currentUser.role === "b2b";
  const discount = isB2B ? subtotal * 0.25 : 0; // 25% Off for B2B wholesale
  const shipping = subtotal > 5000 || shippingData.city.toLowerCase() === "bengaluru" ? 0 : 150;
  const total = subtotal - discount + shipping;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!shippingData.name || !shippingData.address || !shippingData.city || !shippingData.pincode || !shippingData.phone) {
      alert("Please fill in all shipping details.");
      return;
    }

    // Create new order record matching backend schemas.OrderCreate
    const orderData = {
      customer_name: shippingData.name,
      email: currentUser ? currentUser.email : "guest@mail.com",
      items: cart.map(item => ({
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price
      })),
      total: total,
      status: shippingData.paymentMethod === "stripe" ? "Pending Payment" : "Processing",
      date: new Date().toISOString().split("T")[0],
      type: isB2B ? "B2B" : "B2C",
      payment_status: "Unpaid"
    };

    if (shippingData.paymentMethod === "stripe") {
      try {
        const res = await fetch("http://localhost:8000/api/payments/create-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(orderData)
        });

        if (res.ok) {
          const sessionData = await res.json();
          if (sessionData.checkout_url) {
            window.location.href = sessionData.checkout_url;
          } else {
            alert("Failed to initiate Stripe session.");
          }
        } else {
          alert("Failed to initiate Stripe session. Please verify backend.");
        }
      } catch (err) {
        console.error("Connection error initiating stripe payment:", err);
        alert("Connection error: Unable to contact FastAPI backend.");
      }
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
      });
      
      if (res.ok) {
        const createdOrder = await res.json();
        setPlacedOrderId(createdOrder.id);
        
        // Refresh global orders
        if (fetchOrders) {
          await fetchOrders();
        }

        setOrderCompleted(true);
        clearCart();
      } else {
        alert("Failed to submit order to the local server. Please verify backend.");
      }
    } catch (err) {
      console.error("Connection error placing order:", err);
      alert("Connection error: Unable to contact FastAPI backend.");
    }
  };

  if (orderCompleted) {
    return (
      <div className="container" style={{ paddingTop: "60px", maxWidth: "600px", textAlign: "center" }}>
        <div className="glass-card" style={{ padding: "48px", display: "flex", flexDirection: "column", gap: "20px", alignItems: "center" }}>
          <CheckCircle size={64} style={{ color: "#22c55e" }} />
          <h1 style={{ fontSize: "32px", color: "var(--primary-maroon)" }} className="dark-gold-text">Order Placed!</h1>
          <p style={{ fontWeight: "700" }}>Your order ID is: <span style={{ color: "var(--accent-gold-hover)" }}>{placedOrderId}</span></p>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: "1.6" }}>
            Namaste! Your order has been registered in our loom database. Our support team has been notified and will contact you to coordinate delivery and verify UPI payment if chosen.
          </p>
          
          <div style={{
            borderTop: "1px dashed var(--border-light)",
            width: "100%",
            paddingTop: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "12px"
          }}>
            <button 
              onClick={() => {
                setCurrentTab("account");
                window.location.hash = "#/account";
              }} 
              className="btn btn-primary"
              style={{ width: "100%", padding: "12px" }}
            >
              Track Order History
            </button>
            <button 
              onClick={() => {
                setCurrentTab("shop");
                window.location.hash = "#/shop";
              }} 
              className="btn btn-outline"
              style={{ width: "100%", padding: "12px" }}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: "40px", marginBottom: "60px" }}>
      
      {/* Back button */}
      <a 
        href="#/shop" 
        onClick={() => setCurrentTab("shop")}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          color: "var(--primary-maroon)",
          fontWeight: "700",
          fontSize: "14px",
          marginBottom: "24px"
        }}
        className="dark-gold-text"
      >
        <ArrowLeft size={16} /> Back to Catalog
      </a>

      <div style={{
        display: "grid",
        gridTemplateColumns: "2fr 1.3fr",
        gap: "40px"
      }} className="checkout-layout">
        
        {/* Left Side: Shipping & payment Form */}
        <form onSubmit={handlePlaceOrder} style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          
          {/* Shipping Coordinates */}
          <div className="glass-card" style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <h2 style={{ fontSize: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
              <MapPin size={20} style={{ color: "var(--accent-gold)" }} /> Delivery Address
            </h2>
            
            <div className="form-group">
              <label className="form-label" htmlFor="ship-name">Recipient Name *</label>
              <input 
                id="ship-name"
                type="text" 
                className="form-input" 
                value={shippingData.name}
                onChange={(e) => setShippingData({ ...shippingData, name: e.target.value })}
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="ship-address">Street Address *</label>
              <input 
                id="ship-address"
                type="text" 
                className="form-input" 
                value={shippingData.address}
                onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                placeholder="House No, Building Name, Street, Layout"
                required 
              />
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px"
            }}>
              <div className="form-group">
                <label className="form-label" htmlFor="ship-city">City *</label>
                <input 
                  id="ship-city"
                  type="text" 
                  className="form-input" 
                  value={shippingData.city}
                  onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                  placeholder="e.g. Bengaluru"
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="ship-pincode">Pincode / Zip *</label>
                <input 
                  id="ship-pincode"
                  type="text" 
                  className="form-input" 
                  value={shippingData.pincode}
                  onChange={(e) => setShippingData({ ...shippingData, pincode: e.target.value })}
                  placeholder="e.g. 560064"
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="ship-phone">Contact Mobile Number *</label>
              <input 
                id="ship-phone"
                type="tel" 
                className="form-input" 
                value={shippingData.phone}
                onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                placeholder="+91 XXXXX XXXXX"
                required 
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="glass-card" style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <h2 style={{ fontSize: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
              <CreditCard size={20} style={{ color: "var(--accent-gold)" }} /> Settlement Method
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <label style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "16px",
                border: "1px solid var(--border-light)",
                borderRadius: "var(--radius-sm)",
                cursor: "pointer"
              }}>
                <input 
                  type="radio" 
                  name="payment" 
                  checked={shippingData.paymentMethod === "cod"}
                  onChange={() => setShippingData({ ...shippingData, paymentMethod: "cod" })}
                  style={{ accentColor: "var(--primary-maroon)" }}
                />
                <div>
                  <strong>Cash On Delivery (COD)</strong>
                  <span style={{ display: "block", fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>Pay on package delivery to your address.</span>
                </div>
              </label>

              <label style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "16px",
                border: "1px solid var(--border-light)",
                borderRadius: "var(--radius-sm)",
                cursor: "pointer"
              }}>
                <input 
                  type="radio" 
                  name="payment" 
                  checked={shippingData.paymentMethod === "upi"}
                  onChange={() => setShippingData({ ...shippingData, paymentMethod: "upi" })}
                  style={{ accentColor: "var(--primary-maroon)" }}
                />
                <div>
                  <strong>Pay via UPI (GPay / PhonePe / Paytm)</strong>
                  <span style={{ display: "block", fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>Coordinate with store support to scan QR code prior to dispatch.</span>
                </div>
              </label>

              <label style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "16px",
                border: "1px solid var(--border-light)",
                borderRadius: "var(--radius-sm)",
                cursor: "pointer"
              }}>
                <input 
                  type="radio" 
                  name="payment" 
                  checked={shippingData.paymentMethod === "stripe"}
                  onChange={() => setShippingData({ ...shippingData, paymentMethod: "stripe" })}
                  style={{ accentColor: "var(--primary-maroon)" }}
                />
                <div>
                  <strong>Stripe Test Card</strong>
                  <span style={{ display: "block", fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>Pay with credit/debit card using safe Stripe checkout.</span>
                </div>
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={cart.length === 0}
            style={{
              padding: "16px",
              fontSize: "16px",
              fontWeight: "700"
            }}
          >
            Place Order (₹{total.toLocaleString("en-IN")})
          </button>
        </form>

        {/* Right Side: Order summary layout */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          <div className="glass-card" style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <h3 style={{ fontSize: "18px", borderBottom: "1px solid var(--border-light)", paddingBottom: "12px" }}>Order Summary</h3>

            {cart.length === 0 ? (
              <p style={{ color: "var(--text-muted)", textAlign: "center" }}>Your cart is empty.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Items List */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {cart.map((item) => (
                    <div key={item.product.id} style={{ display: "flex", justifyBetween: "space-between", gap: "12px" }}>
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          borderRadius: "var(--radius-sm)",
                          border: "1px solid var(--border-gold)"
                        }} 
                      />
                      <div style={{ flexGrow: 1, fontSize: "13px" }}>
                        <h4 style={{ fontWeight: "700", fontSize: "13px" }}>{item.product.name}</h4>
                        <span style={{ color: "var(--text-muted)" }}>Qty: {item.quantity} × ₹{item.product.price}</span>
                      </div>
                      <span style={{ fontWeight: "700", fontSize: "14px" }}>
                        ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Calculation breakdown */}
                <div style={{
                  borderTop: "1px solid var(--border-light)",
                  paddingTop: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  fontSize: "14px"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Bag Subtotal</span>
                    <span>₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>

                  {isB2B && (
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#059669", fontWeight: "600" }}>
                      <span>Wholesale Discount (25%)</span>
                      <span>- ₹{discount.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Delivery Charge</span>
                    <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                  </div>

                  <div style={{
                    borderTop: "1px dashed var(--border-light)",
                    paddingTop: "12px",
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: "800",
                    fontSize: "16px",
                    color: "var(--primary-maroon)"
                  }} className="dark-gold-text">
                    <span>Order Total</span>
                    <span>₹{total.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Secure transaction box */}
          <div className="glass-card" style={{
            padding: "20px",
            backgroundColor: "rgba(34, 197, 94, 0.02)",
            border: "1px solid rgba(34, 197, 94, 0.2)",
            display: "flex",
            gap: "12px"
          }}>
            <ShieldCheck size={28} style={{ color: "#22c55e", flexShrink: 0 }} />
            <div>
              <h4 style={{ fontSize: "14px", color: "#166534" }}>Safe Loom Dispatch</h4>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                As custom weaving manufacturers, we verify each border piece for quality and loop thread faults prior to box sealing. Secure delivery guaranteed.
              </p>
            </div>
          </div>

        </div>

      </div>

      <style>{`
        .dark .dark-gold-text {
          color: var(--accent-gold) !important;
        }
        @media (max-width: 1024px) {
          .checkout-layout {
            grid-template-columns: 1fr !important;
            gap: 30px !important;
          }
        }
      `}</style>
    </div>
  );
}
