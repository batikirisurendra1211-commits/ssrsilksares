import React from "react";
import { X, Trash2, Plus, Minus, ShoppingCart } from "lucide-react";

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cart, 
  updateQuantity, 
  removeItem, 
  setCurrentTab 
}) {
  if (!isOpen) return null;

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity, 
    0
  );

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 200,
      backgroundColor: "rgba(0,0,0,0.6)",
      display: "flex",
      justifyContent: "flex-end"
    }} onClick={onClose}>
      {/* Drawer Body */}
      <div style={{
        backgroundColor: "var(--bg-white)",
        color: "var(--text-dark)",
        width: "100%",
        maxWidth: "450px",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        boxShadow: "-4px 0 25px rgba(0,0,0,0.15)",
        borderLeft: "2px solid var(--accent-gold)"
      }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          padding: "24px",
          borderBottom: "1px solid var(--border-light)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "var(--primary-maroon)",
          color: "var(--bg-cream)"
        }}>
          <h3 style={{ 
            color: "var(--accent-gold)", 
            fontFamily: "'Playfair Display', serif",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            <ShoppingCart size={22} /> Shopping Bag
          </h3>
          <button 
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "var(--bg-cream)",
              cursor: "pointer",
              padding: "4px"
            }}
            aria-label="Close cart"
          >
            <X size={24} />
          </button>
        </div>

        {/* Items List */}
        <div style={{
          flexGrow: 1,
          overflowY: "auto",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "20px"
        }}>
          {cart.length === 0 ? (
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "60%",
              color: "var(--text-muted)",
              gap: "16px"
            }}>
              <ShoppingCart size={64} strokeWidth={1} style={{ color: "var(--accent-gold)" }} />
              <p style={{ fontSize: "16px", fontWeight: "600" }}>Your cart is empty</p>
              <button 
                onClick={() => {
                  setCurrentTab("shop");
                  window.location.hash = "#/shop";
                  onClose();
                }}
                className="btn btn-primary"
                style={{ fontSize: "14px", padding: "10px 24px" }}
              >
                Browse Saree Catalog
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div 
                key={item.product.id}
                style={{
                  display: "flex",
                  gap: "16px",
                  paddingBottom: "20px",
                  borderBottom: "1px solid var(--border-light)",
                  position: "relative"
                }}
              >
                {/* Thumbnail */}
                <img 
                  src={item.product.image} 
                  alt={item.product.name} 
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border-gold)"
                  }} 
                />

                {/* Info */}
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", flexGrow: 1 }}>
                  <h4 style={{ 
                    fontSize: "14px", 
                    fontFamily: "inherit",
                    fontWeight: "700",
                    color: "var(--text-dark)",
                    paddingRight: "24px"
                  }}>
                    {item.product.name}
                  </h4>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    Weave: {item.product.weave}
                  </span>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: "8px"
                  }}>
                    {/* Quantity Selector */}
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      border: "1px solid var(--border-light)",
                      borderRadius: "var(--radius-full)",
                      padding: "2px"
                    }}>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: "4px 8px",
                          color: "var(--text-muted)"
                        }}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ fontSize: "13px", fontWeight: "600", width: "20px", textAlign: "center" }}>
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: "4px 8px",
                          color: "var(--text-muted)"
                        }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Price */}
                    <span style={{ fontWeight: "700", color: "var(--primary-maroon)", fontSize: "15px" }} className="dark-gold-text">
                      ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Remove item */}
                <button 
                  onClick={() => removeItem(item.product.id)}
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    background: "none",
                    border: "none",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    padding: "4px"
                  }}
                  aria-label="Delete item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer summary */}
        {cart.length > 0 && (
          <div style={{
            padding: "24px",
            borderTop: "1px solid var(--border-light)",
            backgroundColor: "rgba(74, 14, 21, 0.02)",
            display: "flex",
            flexDirection: "column",
            gap: "16px"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "16px",
              fontWeight: "700"
            }}>
              <span>Subtotal</span>
              <span style={{ color: "var(--primary-maroon)", fontSize: "18px" }} className="dark-gold-text">
                ₹{totalAmount.toLocaleString("en-IN")}
              </span>
            </div>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.4" }}>
              *Shipping is calculated at checkout. Free shipping across Bengaluru.
            </p>
            <button 
              onClick={() => {
                setCurrentTab("checkout");
                window.location.hash = "#/checkout";
                onClose();
              }}
              className="btn btn-primary"
              style={{
                width: "100%",
                padding: "16px",
                fontSize: "16px",
                fontWeight: "700"
              }}
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
      
      {/* Styles mapping */}
      <style>{`
        .dark .dark-gold-text {
          color: var(--accent-gold) !important;
        }
      `}</style>
    </div>
  );
}
