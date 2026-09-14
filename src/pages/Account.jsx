import React, { useState } from "react";
import { User, LogOut, Package, Mail, Phone, Calendar, Key, AlertCircle } from "lucide-react";

export default function Account({ currentUser, setCurrentUser, orders, setCurrentTab }) {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  
  // Track profile edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(currentUser ? currentUser.name : "");
  const [editPhone, setEditPhone] = useState(currentUser ? (currentUser.phone || "XXXXX XXXXX") : "");

  // Login handler
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError("Please enter email and password.");
      return;
    }

    // Owner Login
    if (loginEmail === "admin@sssilksarees.com" && loginPassword === "admin123") {
      setCurrentUser({
        email: "admin@sssilksarees.com",
        name: "Store Owner",
        role: "admin",
        b2bApproved: false
      });
      setLoginError("");
      setCurrentTab("admin");
      window.location.hash = "#/admin";
    }
    // B2B Partner Login
    else if (loginEmail === "retailer@sareebazaar.com") {
      setCurrentUser({
        email: "retailer@sareebazaar.com",
        name: "Devendra Swamy",
        role: "b2b",
        b2bApproved: true
      });
      setLoginError("");
    }
    // Default Customer Login
    else {
      setCurrentUser({
        email: loginEmail,
        name: loginEmail.split("@")[0].toUpperCase(),
        role: "customer",
        b2bApproved: false
      });
      setLoginError("");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLoginEmail("");
    setLoginPassword("");
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setCurrentUser(prev => ({
      ...prev,
      name: editName,
      phone: editPhone
    }));
    setIsEditing(false);
  };

  // Filter orders related to active user
  const userOrders = currentUser 
    ? orders.filter(o => o.email.toLowerCase() === currentUser.email.toLowerCase())
    : [];

  return (
    <div className="container" style={{ paddingTop: "40px", marginBottom: "60px" }}>
      
      {!currentUser ? (
        /* Login / Register Panel */
        <div style={{ maxWidth: "450px", margin: "0 auto" }} className="glass-card">
          <div style={{
            padding: "32px",
            borderBottom: "1px solid var(--border-light)",
            textAlign: "center",
            backgroundColor: "var(--primary-maroon)",
            color: "var(--bg-cream)",
            borderRadius: "var(--radius-md) var(--radius-md) 0 0"
          }}>
            <h2 style={{ color: "var(--accent-gold)", fontFamily: "'Playfair Display', serif" }}>SS Silks Portal</h2>
            <p style={{ fontSize: "13px", opacity: 0.9, marginTop: "4px" }}>Login to track orders and access B2B rates.</p>
          </div>

          <form onSubmit={handleLoginSubmit} style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "20px" }}>
            {loginError && (
              <div style={{
                backgroundColor: "rgba(220, 38, 38, 0.08)",
                color: "#dc2626",
                padding: "12px",
                borderRadius: "var(--radius-sm)",
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <AlertCircle size={16} /> {loginError}
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email Address</label>
              <input 
                id="login-email"
                type="email" 
                className="form-input" 
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="customer@gmail.com / admin@sssilksarees.com"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Password</label>
              <input 
                id="login-password"
                type="password" 
                className="form-input" 
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Password (Owner: admin123)"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: "14px", fontWeight: "700" }}>
              Sign In
            </button>

            {/* Helper tips */}
            <div style={{
              backgroundColor: "rgba(212,175,55,0.05)",
              border: "1px solid var(--border-gold)",
              borderRadius: "var(--radius-sm)",
              padding: "12px",
              fontSize: "12px",
              color: "var(--text-muted)",
              lineHeight: "1.5"
            }}>
              <strong>Quick testing login tips:</strong><br />
              • Owner: <code>admin@sssilksarees.com</code> / pass: <code>admin123</code><br />
              • B2B Client: <code>retailer@sareebazaar.com</code> / pass: <code>any</code><br />
              • Retail Client: <code>customer@gmail.com</code> / pass: <code>any</code>
            </div>
          </form>
        </div>
      ) : (
        /* Logged-In User Dashboard */
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 2.5fr",
          gap: "40px"
        }} className="account-layout">
          
          {/* Left panel Profile Summary */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div className="glass-card" style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "20px", alignItems: "center", textAlign: "center" }}>
              {/* Profile Avatar */}
              <div style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                backgroundColor: "rgba(74, 14, 21, 0.1)",
                color: "var(--primary-maroon)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }} className="account-avatar">
                <User size={36} />
              </div>

              <div>
                <h3 style={{ fontSize: "20px" }}>{currentUser.name}</h3>
                <span className="badge badge-gold" style={{ marginTop: "4px" }}>
                  {currentUser.role === "admin" ? "Store Owner" : currentUser.role === "b2b" ? "B2B Partner" : "Customer"}
                </span>
              </div>

              <div style={{ width: "100%", borderTop: "1px solid var(--border-light)", paddingTop: "16px", display: "flex", flexDirection: "column", gap: "12px", textAlign: "left", fontSize: "13px" }}>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <Mail size={14} style={{ color: "var(--accent-gold)" }} />
                  <span style={{ wordBreak: "break-all" }}>{currentUser.email}</span>
                </div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <Phone size={14} style={{ color: "var(--accent-gold)" }} />
                  <span>{currentUser.phone || "+91 XXXXX XXXXX"}</span>
                </div>
              </div>

              <button 
                onClick={handleLogout}
                className="btn btn-outline"
                style={{ width: "100%", gap: "8px", padding: "10px", fontSize: "14px", minHeight: "auto" }}
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>

            {/* B2B Tier Badge indicator */}
            {currentUser.role === "b2b" && (
              <div className="glass-card" style={{
                padding: "24px",
                border: "1px solid var(--accent-gold)",
                backgroundColor: "rgba(212,175,55,0.05)",
                display: "flex",
                flexDirection: "column",
                gap: "10px"
              }}>
                <h4 style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--accent-gold-hover)" }}>
                  <Key size={16} /> B2B Partner Enabled
                </h4>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.4" }}>
                  Your business account receives flat <strong>25% discount rates</strong> in checkout on bulk lots of 30+ items. Direct factory loom support enabled.
                </p>
              </div>
            )}
          </div>

          {/* Right panel Content: Orders list & Profile editor */}
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            
            {/* Profile editor */}
            <div className="glass-card" style={{ padding: "32px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ fontSize: "22px" }}>Account Settings</h2>
                {!isEditing && (
                  <button onClick={() => setIsEditing(true)} className="btn btn-text" style={{ fontWeight: "700" }}>Edit Profile</button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSaveProfile} style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                  <div className="form-group" style={{ flex: "1 1 200px" }}>
                    <label className="form-label" htmlFor="edit-name">Display Name</label>
                    <input 
                      id="edit-name"
                      type="text" 
                      className="form-input" 
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ flex: "1 1 200px" }}>
                    <label className="form-label" htmlFor="edit-phone">Phone Number</label>
                    <input 
                      id="edit-phone"
                      type="text" 
                      className="form-input" 
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                    />
                  </div>
                  <div style={{ width: "100%", display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                    <button type="button" onClick={() => setIsEditing(false)} className="btn btn-outline" style={{ padding: "8px 16px", minHeight: "auto" }}>Cancel</button>
                    <button type="submit" className="btn btn-primary" style={{ padding: "8px 16px", minHeight: "auto" }}>Save Changes</button>
                  </div>
                </form>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", fontSize: "14px" }}>
                  <div>
                    <strong>Full Name:</strong> <span style={{ color: "var(--text-muted)" }}>{currentUser.name}</span>
                  </div>
                  <div>
                    <strong>Authorized Phone:</strong> <span style={{ color: "var(--text-muted)" }}>{currentUser.phone || "+91 XXXXX XXXXX"}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Orders list */}
            <div className="glass-card" style={{ padding: "32px" }}>
              <h2 style={{ fontSize: "22px", marginBottom: "20px" }}>Order History</h2>

              {userOrders.length === 0 ? (
                <div style={{
                  padding: "48px",
                  textAlign: "center",
                  color: "var(--text-muted)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px"
                }}>
                  <Package size={36} style={{ color: "var(--accent-gold)" }} />
                  <p>You haven't placed any orders yet.</p>
                  <a href="#/shop" onClick={() => setCurrentTab("shop")} className="btn btn-primary" style={{ marginTop: "12px", padding: "8px 20px" }}>Shop Now</a>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {userOrders.map((order) => (
                    <div 
                      key={order.id}
                      style={{
                        border: "1px solid var(--border-light)",
                        borderRadius: "var(--radius-sm)",
                        padding: "20px",
                        backgroundColor: "rgba(0,0,0,0.01)"
                      }}
                    >
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "10px",
                        marginBottom: "12px",
                        borderBottom: "1px solid var(--border-light)",
                        paddingBottom: "12px"
                      }}>
                        <div>
                          <strong style={{ color: "var(--primary-maroon)" }}>Order ID: {order.id}</strong>
                          <span style={{ fontSize: "12px", color: "var(--text-muted)", display: "block" }}>Placed on: {order.date}</span>
                        </div>
                        <div>
                          <span className="badge" style={{
                            backgroundColor: order.status === "Delivered" ? "#d1fae5" : order.status === "Shipped" ? "#dbeafe" : "#fef3c7",
                            color: order.status === "Delivered" ? "#065f46" : order.status === "Shipped" ? "#1e40af" : "#92400e"
                          }}>
                            {order.status}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
                        {order.items.map((item, idx) => (
                          <div key={idx} style={{ display: "flex", justifyContent: "space-between" }}>
                            <span>{item.productName} <strong>× {item.quantity}</strong></span>
                            <span>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                          </div>
                        ))}
                      </div>

                      {/* Summary */}
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "16px",
                        borderTop: "1px dashed var(--border-light)",
                        paddingTop: "12px",
                        fontWeight: "700"
                      }}>
                        <span>Total Paid</span>
                        <span style={{ fontSize: "16px", color: "var(--primary-maroon)" }}>₹{order.total.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      )}
      
      <style>{`
        .dark .dark-gold-text {
          color: var(--accent-gold) !important;
        }
        .dark .account-avatar {
          background-color: rgba(212,175,55,0.15) !important;
          color: var(--accent-gold) !important;
        }
        @media (max-width: 768px) {
          .account-layout {
            grid-template-columns: 1fr !important;
            gap: 30px !important;
          }
        }
      `}</style>
    </div>
  );
}
