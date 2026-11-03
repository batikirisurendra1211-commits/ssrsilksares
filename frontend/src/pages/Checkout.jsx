import React, { useState, useEffect } from "react";
import { CheckCircle, ShieldCheck, MapPin, CreditCard, ShoppingBag, ArrowLeft, Loader, Truck, Phone, Mail } from "lucide-react";
import api from "../api/apiClient";

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
    name: currentUser ? (currentUser.name || "") : "",
    email: currentUser ? (currentUser.email || "") : "",
    address: "",
    city: "",
    pincode: "",
    phone: currentUser ? (currentUser.phone || "") : "",
    paymentMethod: "cod" // options: 'cod', 'upi', 'stripe'
  });

  const [submitting, setSubmitting] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState("");
  const [placedOrderSummary, setPlacedOrderSummary] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setShippingData(prev => ({
        ...prev,
        name: prev.name || currentUser.name || "",
        email: prev.email || currentUser.email || "",
        phone: prev.phone || currentUser.phone || ""
      }));
    }
  }, [currentUser]);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  
  // Apply B2B Bulk discount if user has B2B partner role
  const isB2B = currentUser && currentUser.role === "b2b";
  const discount = isB2B ? subtotal * 0.25 : 0; // 25% Off for B2B wholesale
  const shipping = subtotal > 5000 || shippingData.city.toLowerCase() === "bengaluru" ? 0 : 150;
  const total = subtotal - discount + shipping;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!shippingData.name || !shippingData.address || !shippingData.city || !shippingData.pincode || !shippingData.phone || !shippingData.email) {
      alert("Please fill in all shipping and contact details.");
      return;
    }

    setSubmitting(true);

    const fullAddress = `${shippingData.address.trim()}, ${shippingData.city.trim()} - ${shippingData.pincode.trim()}`;
    const customerDisplayName = `${shippingData.name.trim()} (${shippingData.phone.trim()})`;
    const customerEmail = shippingData.email.trim().toLowerCase();
    const finalTotal = Math.round(total);

    // Set to Cash On Delivery (all online methods paused per store configuration)
    const orderData = {
      customer_name: customerDisplayName,
      email: customerEmail,
      items: cart.map(item => ({
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        image: item.product.image || "",
        deliveryAddress: fullAddress,
        contactPhone: shippingData.phone.trim(),
        paymentMethod: "Cash On Delivery (COD)"
      })),
      total: finalTotal,
      status: "Processing",
      date: new Date().toISOString().split("T")[0],
      type: isB2B ? "B2B" : "B2C",
      payment_status: "COD Pending"
    };

    // Cash on Delivery submission
    try {
      const createdOrder = await api.orders.create(orderData);
      setPlacedOrderId(createdOrder.id);
      setPlacedOrderSummary({
        id: createdOrder.id,
        total: finalTotal,
        name: shippingData.name.trim(),
        phone: shippingData.phone.trim(),
        email: customerEmail,
        address: fullAddress,
        paymentMethod: "Cash On Delivery (COD)"
      });
      
      // Update global orders state immediately so Admin & User Order history see it
      if (setOrders) {
        setOrders(prev => [createdOrder, ...prev.filter(o => o.id !== createdOrder.id)]);
      }

      // Persist in localStorage cache for instant cross-session sync
      try {
        const cached = JSON.parse(localStorage.getItem("ss_orders_cache") || "[]");
        localStorage.setItem("ss_orders_cache", JSON.stringify([createdOrder, ...cached.filter(o => o.id !== createdOrder.id)]));
      } catch {}

      // Refresh global orders from backend
      if (fetchOrders) {
        await fetchOrders();
      }

      setOrderCompleted(true);
      clearCart();
    } catch (err) {
      console.error("Connection error placing order:", err);
      alert("Failed to place order: " + (err.message || "Please check your connection and try again."));
    } finally {
      setSubmitting(false);
    }
  };

  if (orderCompleted) {
    return (
      <div className="container" style={{ paddingTop: "60px", maxWidth: "640px", textAlign: "center" }}>
        <div className="glass-card" style={{ padding: "48px 36px", display: "flex", flexDirection: "column", gap: "24px", alignItems: "center" }}>
          <div style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor: "rgba(34, 197, 94, 0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#16a34a"
          }}>
            <CheckCircle size={52} />
          </div>

          <div>
            <span className="badge" style={{
              backgroundColor: "rgba(212, 175, 55, 0.15)",
              color: "var(--accent-gold)",
              border: "1px solid var(--accent-gold)",
              fontSize: "12px",
              padding: "4px 12px",
              borderRadius: "16px",
              marginBottom: "8px",
              display: "inline-block"
            }}>
              Order Confirmed & Received
            </span>
            <h1 style={{ fontSize: "32px", color: "var(--primary-maroon)", margin: "8px 0" }} className="dark-gold-text">
              Order Placed Successfully!
            </h1>
            <p style={{ fontWeight: "700", fontSize: "16px", color: "var(--text-dark)" }}>
              Order ID: <span style={{ color: "var(--accent-gold)", letterSpacing: "1px" }}>{placedOrderId}</span>
            </p>
          </div>

          {placedOrderSummary && (
            <div style={{
              width: "100%",
              backgroundColor: "rgba(74, 14, 21, 0.03)",
              border: "1px solid var(--border-gold)",
              borderRadius: "var(--radius-sm)",
              padding: "20px",
              textAlign: "left",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              fontSize: "14px"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-light)", paddingBottom: "8px" }}>
                <span style={{ color: "var(--text-muted)" }}>Settlement Mode:</span>
                <strong style={{ color: "var(--primary-maroon)" }}>{placedOrderSummary.paymentMethod}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-light)", paddingBottom: "8px" }}>
                <span style={{ color: "var(--text-muted)" }}>Payable on Delivery:</span>
                <strong style={{ color: "#16a34a", fontSize: "16px" }}>₹{placedOrderSummary.total.toLocaleString("en-IN")}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-light)", paddingBottom: "8px" }}>
                <span style={{ color: "var(--text-muted)" }}>Recipient:</span>
                <span>{placedOrderSummary.name} ({placedOrderSummary.phone})</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ color: "var(--text-muted)" }}>Delivery Address:</span>
                <span style={{ fontWeight: "600", color: "var(--text-dark)" }}>{placedOrderSummary.address}</span>
              </div>
            </div>
          )}

          <p style={{ color: "var(--text-muted)", fontSize: "13px", lineHeight: "1.6", margin: 0 }}>
            Namaste! Your pure silk order has been dispatched to our weaving and packaging master craftsmen in Bengaluru. You can pay cash upon parcel delivery.
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
              style={{ width: "100%", padding: "14px", fontWeight: "700" }}
            >
              Track in My Orders / Account
            </button>
            <button 
              onClick={() => {
                setCurrentTab("shop");
                window.location.hash = "#/shop";
              }} 
              className="btn btn-outline"
              style={{ width: "100%", padding: "12px" }}
            >
              Continue Exploring Sarees
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

            <div className="form-group">
              <label className="form-label" htmlFor="ship-email">Email Address (for Order Receipt & Updates) *</label>
              <input 
                id="ship-email"
                type="email" 
                className="form-input" 
                value={shippingData.email}
                onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                placeholder="name@example.com"
                required 
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="glass-card" style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "20px", display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
                <CreditCard size={20} style={{ color: "var(--accent-gold)" }} /> Settlement Method
              </h2>
              <span className="badge" style={{ backgroundColor: "#dcfce7", color: "#166534", border: "1px solid #86efac", fontSize: "12px", padding: "4px 10px", borderRadius: "12px" }}>
                ✓ COD Active
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* Cash On Delivery (Active Option) */}
              <div style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "14px",
                padding: "18px",
                border: "2px solid var(--accent-gold)",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "rgba(212, 175, 55, 0.08)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
              }}>
                <div style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  backgroundColor: "var(--primary-maroon)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "2px",
                  flexShrink: 0
                }}>
                  <Truck size={14} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "6px" }}>
                    <strong style={{ fontSize: "16px", color: "var(--primary-maroon)" }}>Cash On Delivery (COD)</strong>
                    <span style={{ fontSize: "12px", color: "#16a34a", fontWeight: "700" }}>Zero Advance Required</span>
                  </div>
                  <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--text-dark)", lineHeight: "1.5" }}>
                    Pay in cash directly upon parcel delivery to your doorstep. You can inspect the pure handloom saree before paying.
                  </p>
                </div>
              </div>

              {/* Paused Online Payment Options */}
              <div style={{
                padding: "14px 18px",
                border: "1px dashed var(--border-light)",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "rgba(0,0,0,0.02)",
                opacity: 0.7,
                display: "flex",
                flexDirection: "column",
                gap: "6px"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-muted)" }}>Online UPI & Card Gateways</span>
                  <span style={{ fontSize: "11px", backgroundColor: "#fef3c7", color: "#92400e", padding: "2px 8px", borderRadius: "10px", fontWeight: "700" }}>Temporarily Paused</span>
                </div>
                <p style={{ margin: 0, fontSize: "12px", color: "var(--text-muted)" }}>
                  Direct online UPI & Card payments are paused by store operations. Please complete your order securely via Cash On Delivery.
                </p>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={cart.length === 0 || submitting}
            style={{
              padding: "16px",
              fontSize: "16px",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              opacity: (cart.length === 0 || submitting) ? 0.7 : 1,
              cursor: (cart.length === 0 || submitting) ? "not-allowed" : "pointer"
            }}
          >
            {submitting ? (
              <>
                <Loader size={18} className="spin-animation" />
                <span>Confirming COD Order...</span>
              </>
            ) : (
              <span>
                Confirm Cash On Delivery Order (₹{total.toLocaleString("en-IN")})
              </span>
            )}
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
