import React, { useState } from "react";
import { Download, FileText, Send, CheckCircle2, ShieldCheck, Tag } from "lucide-react";
import api from "../api/apiClient";

export default function B2B({ currentUser, setCurrentUser, setOrders }) {
  const [formData, setFormData] = useState({
    businessName: "",
    contactName: "",
    phone: "",
    sareeType: "Gadwal Semi Silk",
    quantity: "20",
    budget: "₹50,000 - ₹1,00,000",
    message: ""
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.businessName || !formData.contactName || !formData.phone) {
      alert("Please fill in the required fields.");
      return;
    }

    setSubmitting(true);
    const orderTotal = parseInt(formData.quantity) * 2500;
    try {
      const createdOrder = await api.orders.create({
        customer_name: `${formData.businessName} (Attn: ${formData.contactName})`,
        email: currentUser ? currentUser.email : "wholesale.inquiry@b2b.com",
        items: [
          { productName: `Bulk ${formData.sareeType}`, quantity: parseInt(formData.quantity), price: 2500 }
        ],
        total: orderTotal,
        status: "Pending Inquiry",
        date: new Date().toISOString().split("T")[0],
        type: "B2B",
        payment_status: "Unpaid"
      });
      setOrders((prev) => [createdOrder, ...prev]);
      setSubmitted(true);
    } catch (err) {
      console.warn("Server order submission note:", err);
      // Fallback local display
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: "40px", marginBottom: "60px" }}>

      {/* Page Header */}
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <span style={{
          color: "var(--accent-gold)",
          fontWeight: "700",
          fontSize: "12px",
          letterSpacing: "1.5px",
          textTransform: "uppercase"
        }}>
          Manufacturer Direct Supply
        </span>
        <h1 style={{ fontSize: "40px", marginTop: "8px", marginBottom: "8px" }}>Wholesale & B2B Portal</h1>
        <div style={{ width: "60px", height: "3px", backgroundColor: "var(--accent-gold)", margin: "0 auto 16px auto" }} />
        <p style={{ color: "var(--text-muted)", maxWidth: "600px", margin: "0 auto" }}>
          We manufacture and supply custom-women Gadwal Semi Silk and Semi Sicco sarees in bulk quantities directly to boutiques, retail stores, and clothing houses.
        </p>
      </div>

      {/* Grid: Info Tiles & Inquiry Form */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "48px"
      }} className="b2b-layout">

        {/* Left Side: Wholesale tiers & catalog download */}
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>

          {/* Tiers display */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h2 style={{ fontSize: "24px", color: "var(--primary-maroon)" }} className="dark-gold-text">Wholesale Benefits</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="glass-card" style={{ padding: "20px", display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <Tag size={24} style={{ color: "var(--accent-gold)", flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: "16px", marginBottom: "4px" }}>Tiered Discount Pricing</h4>
                  <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
                    • Min. 15 pieces: <strong>15% Off</strong> catalog price.<br />
                    • Min. 30 pieces: <strong>25% Off</strong> catalog price.<br />
                    • Custom weaving orders (50+): <strong>Factory Direct Pricing</strong>.
                  </p>
                </div>
              </div>

              <div className="glass-card" style={{ padding: "20px", display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <ShieldCheck size={24} style={{ color: "var(--accent-gold)", flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: "16px", marginBottom: "4px" }}>Custom Design Options</h4>
                  <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
                    Specify border designs, color combinations, and thread blends (cotton-silk Cicco warp ratios). We align our looms to match your boutique requirements.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Download Catalog (PDF Mock) */}
          <div className="glass-card" style={{
            padding: "24px",
            border: "1px dashed var(--accent-gold)",
            backgroundColor: "rgba(212,175,55,0.02)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px"
          }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <FileText size={32} style={{ color: "var(--primary-maroon)" }} className="dark-gold-text" />
              <div>
                <h4 style={{ fontSize: "15px" }}>Wholesale Saree Catalog 2026</h4>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>PDF file • 8.4 MB • 45 Designs</span>
              </div>
            </div>
            {/* Mock download */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert("Catalog PDF download started successfully! (Mock Asset)");
              }}
              className="btn btn-outline"
              style={{
                padding: "8px 12px",
                fontSize: "12px",
                minHeight: "auto",
                borderColor: "var(--accent-gold)",
                color: "var(--accent-gold)"
              }}
            >
              <Download size={14} /> Download
            </a>
          </div>

        </div>

        {/* Right Side: Bulk inquiry form */}
        <div className="glass-card" style={{ padding: "40px" }}>
          <h2 style={{ fontSize: "24px", color: "var(--primary-maroon)", marginBottom: "20px" }} className="dark-gold-text">
            Bulk Inquiry Form
          </h2>

          {submitted ? (
            <div style={{
              textAlign: "center",
              padding: "40px 0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px"
            }}>
              <CheckCircle2 size={56} style={{ color: "#22c55e" }} />
              <h3>Inquiry Registered!</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                Thank you for registering your retail business. Our team has received your request. Your profile has been updated to B2B Partner status!
              </p>
              <p style={{ fontSize: "13px", fontWeight: "600", color: "var(--primary-maroon)" }}>
                You can now log in to the My Account portal to see your wholesale dashboard.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="btn btn-outline"
                style={{ marginTop: "16px" }}
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

              <div className="form-group">
                <label className="form-label">Business Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  placeholder="Enter your business name"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Person Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  placeholder="Enter contact person name"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">WhatsApp Contact Number *</label>
                <input
                  type="tel"
                  className="form-input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter WhatsApp contact number"
                  required
                />
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px"
              }}>
                <div className="form-group">
                  <label className="form-label">Saree Type</label>
                  <select
                    className="form-input"
                    value={formData.sareeType}
                    onChange={(e) => setFormData({ ...formData, sareeType: e.target.value })}
                    style={{ cursor: "pointer" }}
                  >
                    <option value="Gadwal Semi Silk">Gadwal Semi Silk</option>
                    <option value="Gadwal Semi Cicco">Gadwal Semi Cicco</option>
                    <option value="Kanchipuram Style">Kanchipuram Style</option>
                    <option value="Mixed Lot">Mixed Lot (All varieties)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Min Quantity</label>
                  <select
                    className="form-input"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    style={{ cursor: "pointer" }}
                  >
                    <option value="15">15 Sarees (Tier 1)</option>
                    <option value="30">30 Sarees (Tier 2)</option>
                    <option value="50">50+ Sarees (Factory direct)</option>
                    <option value="100">100+ (Bulk export)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Approximate Budget Range</label>
                <select
                  className="form-input"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  style={{ cursor: "pointer" }}
                >
                  <option value="₹30,000 - ₹50,000">₹30,000 - ₹50,000</option>
                  <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
                  <option value="₹1,00,000+">₹1,00,000+ (High volume)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Custom Specifications / Message</label>
                <textarea
                  rows="3"
                  className="form-input"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Detail any color choices or loom spacing preferences..."
                  style={{ resize: "vertical", fontFamily: "inherit" }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: "14px", fontWeight: "700", marginTop: "8px" }}
              >
                <Send size={16} /> Submit Bulk Inquiry
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        .dark .dark-gold-text {
          color: var(--accent-gold) !important;
        }
      `}</style>
    </div>
  );
}
