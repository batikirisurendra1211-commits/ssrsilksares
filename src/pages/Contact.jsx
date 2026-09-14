import React, { useState } from "react";
import { Phone, Mail, MapPin, Send, MessageSquare, CheckCircle2 } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    let tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = "Name is required";
    
    // Email regex check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      tempErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = "Please enter a valid email address";
    }

    // Indian Phone validation (+91 / 10 digits check)
    const phoneCleaned = formData.phone.replace(/[^0-9]/g, "");
    if (!formData.phone.trim()) {
      tempErrors.phone = "Phone number is required";
    } else if (phoneCleaned.length < 10) {
      tempErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (!formData.message.trim()) tempErrors.message = "Message is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Simulate API submit
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
      setErrors({});
    }
  };

  return (
    <div className="container" style={{ paddingTop: "40px", marginBottom: "60px" }}>
      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <h1 style={{ fontSize: "40px", marginBottom: "8px" }}>Contact Us</h1>
        <div style={{ width: "60px", height: "3px", backgroundColor: "var(--accent-gold)", margin: "0 auto 12px auto" }} />
        <p style={{ color: "var(--text-muted)", maxWidth: "550px", margin: "0 auto" }}>
          Have a question about our Gadwal sarees, bulk discount pricing, or custom loom setups? Reach out directly to our support team.
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "48px"
      }} className="contact-layout">
        
        {/* Contact Information & Map */}
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          <h2 style={{ fontSize: "24px", color: "var(--primary-maroon)" }} className="dark-gold-text">Store Coordinates</h2>
          
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "20px" }}>
            <li style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
              <div style={{
                backgroundColor: "rgba(74, 14, 21, 0.1)",
                color: "var(--primary-maroon)",
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }} className="contact-icon-wrapper">
                <MapPin size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: "16px", marginBottom: "4px" }}>Mill Address</h4>
                <p style={{ color: "var(--text-muted)", lineHeight: "1.5" }}>
                  No. 95, 1st Main Road, 3rd Cross,<br />
                  Markandaya Nagar, Agrahara Layout,<br />
                  Yelahanka, Bengaluru – 560064
                </p>
              </div>
            </li>

            <li style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
              <div style={{
                backgroundColor: "rgba(74, 14, 21, 0.1)",
                color: "var(--primary-maroon)",
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }} className="contact-icon-wrapper">
                <Phone size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: "16px", marginBottom: "4px" }}>Phone Numbers</h4>
                <p style={{ color: "var(--text-muted)" }}>
                  Primary: +91 XXXXX XXXXX<br />
                  Secondary: +91 YYYYY YYYYY
                </p>
              </div>
            </li>

            <li style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
              <div style={{
                backgroundColor: "rgba(74, 14, 21, 0.1)",
                color: "var(--primary-maroon)",
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }} className="contact-icon-wrapper">
                <Mail size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: "16px", marginBottom: "4px" }}>Email Inbox</h4>
                <p style={{ color: "var(--text-muted)" }}>sales@sssilksarees.com</p>
              </div>
            </li>
          </ul>

          {/* Styled Google Map Placeholder */}
          <div style={{
            height: "220px",
            border: "1px solid var(--border-gold)",
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
            position: "relative",
            backgroundColor: "rgba(74, 14, 21, 0.02)"
          }}>
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "24px",
              textAlign: "center"
            }}>
              <MapPin size={32} style={{ color: "var(--primary-maroon)", marginBottom: "8px" }} className="dark-gold-text" />
              <strong style={{ fontSize: "14px", marginBottom: "4px" }}>Agrahara Layout, Yelahanka</strong>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "16px" }}>Weaving looms located in northern Bengaluru near Yelahanka Railway Station.</p>
              <a 
                href="https://maps.google.com/?q=Agrahara+Layout+Yelahanka+Bengaluru" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{ padding: "6px 16px", fontSize: "12px", minHeight: "auto" }}
              >
                Open Google Maps
              </a>
            </div>
          </div>
        </div>

        {/* Lead Capture Form */}
        <div className="glass-card" style={{ padding: "40px", display: "flex", flexDirection: "column", gap: "24px" }}>
          <h2 style={{ fontSize: "24px", color: "var(--primary-maroon)" }} className="dark-gold-text">Send Enquiry</h2>

          {submitted ? (
            <div style={{
              textAlign: "center",
              padding: "40px 0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
              color: "var(--text-dark)"
            }}>
              <CheckCircle2 size={56} style={{ color: "#22c55e" }} />
              <h3>Thank You!</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                Your inquiry has been successfully sent to our support team. We will reach back to you within 24 hours via Phone/Email.
              </p>
              <button 
                onClick={() => setSubmitted(false)} 
                className="btn btn-outline" 
                style={{ marginTop: "16px", padding: "10px 24px" }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Name */}
              <div className="form-group">
                <label className="form-label" htmlFor="contact-name">Full Name *</label>
                <input 
                  id="contact-name"
                  type="text" 
                  className="form-input" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Aarati Nair"
                />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label" htmlFor="contact-email">Email Address *</label>
                <input 
                  id="contact-email"
                  type="email" 
                  className="form-input" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. customer@gmail.com"
                />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>

              {/* Phone */}
              <div className="form-group">
                <label className="form-label" htmlFor="contact-phone">Phone Number (with Country Code) *</label>
                <input 
                  id="contact-phone"
                  type="tel" 
                  className="form-input" 
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. +91 XXXXXXXXXX"
                />
                {errors.phone && <span className="form-error">{errors.phone}</span>}
              </div>

              {/* Message */}
              <div className="form-group">
                <label className="form-label" htmlFor="contact-message">Enquiry Message *</label>
                <textarea 
                  id="contact-message"
                  rows="4" 
                  className="form-input" 
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about the sarees or bulk quantities you need..."
                  style={{ resize: "vertical", fontFamily: "inherit" }}
                />
                {errors.message && <span className="form-error">{errors.message}</span>}
              </div>

              {/* Submit */}
              <button 
                type="submit" 
                className="btn btn-primary"
                style={{
                  padding: "14px",
                  fontWeight: "700",
                  marginTop: "8px"
                }}
              >
                <Send size={16} /> Send Message
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        .dark .dark-gold-text {
          color: var(--accent-gold) !important;
        }
        .dark .contact-icon-wrapper {
          background-color: rgba(212, 175, 55, 0.15) !important;
          color: var(--accent-gold) !important;
        }
      `}</style>
    </div>
  );
}
