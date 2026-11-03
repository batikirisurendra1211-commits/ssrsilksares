import React, { useEffect, useState } from "react";
import { CheckCircle, AlertTriangle, ArrowRight, Loader, ShoppingBag } from "lucide-react";
import api from "../api/apiClient";

export default function CheckoutSuccess({ setCurrentTab, fetchOrders, clearCart }) {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("verifying"); // 'verifying', 'success', 'error'
  const [orderId, setOrderId] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  useEffect(() => {
    // Parse query params from the hash URL: e.g., #/checkout-success?session_id=...&order_id=...
    const hash = window.location.hash;
    const queryString = hash.split("?")[1] || "";
    const params = new URLSearchParams(queryString);
    const sessionId = params.get("session_id");
    const oid = params.get("order_id");

    setOrderId(oid || "");

    const confirmPayment = async () => {
      try {
        const data = await api.payments.confirm({
          session_id: sessionId,
          order_id: oid
        });

        if (data && data.payment_status) {
          setPaymentStatus(data.payment_status);
          setStatus("success");
          clearCart(); // Clear the cart since order was paid/placed successfully
          if (fetchOrders) {
            await fetchOrders();
          }
        } else {
          setStatus("error");
        }
      } catch (err) {
        console.error("Error confirming payment:", err);
        setStatus("error");
      } finally {
        setLoading(false);
      }
    };

    if (sessionId && oid) {
      confirmPayment();
    } else {
      setLoading(false);
      setStatus("error");
    }
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: "80px", maxWidth: "600px", textAlign: "center" }}>
        <div className="glass-card" style={{ padding: "48px", display: "flex", flexDirection: "column", gap: "24px", alignItems: "center" }}>
          <Loader className="animate-spin" size={48} style={{ color: "var(--accent-gold)" }} />
          <h2 style={{ fontSize: "24px" }} className="dark-gold-text">Verifying Payment...</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
            Please do not refresh or close this tab. We are verifying your transaction with Stripe.
          </p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="container" style={{ paddingTop: "80px", maxWidth: "600px", textAlign: "center" }}>
        <div className="glass-card" style={{ padding: "48px", display: "flex", flexDirection: "column", gap: "20px", alignItems: "center", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
          <AlertTriangle size={64} style={{ color: "#ef4444" }} />
          <h1 style={{ fontSize: "32px", color: "#ef4444" }}>Payment Verification Failed</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: "1.6" }}>
            We could not verify your Stripe payment. If money was deducted, please contact support with your details.
          </p>
          <div style={{ marginTop: "20px", display: "flex", gap: "12px", width: "100%" }}>
            <button 
              onClick={() => {
                setCurrentTab("shop");
                window.location.hash = "#/shop";
              }} 
              className="btn btn-primary"
              style={{ flex: 1, padding: "12px" }}
            >
              Back to Shop
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: "80px", maxWidth: "600px", textAlign: "center" }}>
      <div className="glass-card" style={{ padding: "48px", display: "flex", flexDirection: "column", gap: "20px", alignItems: "center" }}>
        <CheckCircle size={64} style={{ color: "#22c55e" }} />
        <h1 style={{ fontSize: "32px", color: "var(--primary-maroon)" }} className="dark-gold-text">Payment Successful!</h1>
        <p style={{ fontWeight: "700" }}>Your order ID is: <span style={{ color: "var(--accent-gold-hover)" }}>{orderId}</span></p>
        <p style={{ color: "#22c55e", fontWeight: "600", fontSize: "14px" }}>Status: {paymentStatus}</p>
        <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: "1.6" }}>
          Thank you for your purchase! Your payment has been verified successfully. Our team has been notified and your saree will be dispatched shortly.
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
      
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        .dark .dark-gold-text {
          color: var(--accent-gold) !important;
        }
      `}</style>
    </div>
  );
}
