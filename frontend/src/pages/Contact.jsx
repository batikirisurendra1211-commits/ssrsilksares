import React, { useState } from "react";
import { Phone, Mail, MapPin, Send, MessageSquare, CheckCircle2, ExternalLink } from "lucide-react";

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.3 1.12.3 3.48.3 3.48s0 2.36-.3 3.48a2.01 2.01 0 0 1-1.415 1.42c-1.12.3-5.285.3-6.11.335h-.09c-.823-.003-4.987-.03-6.11-.335a2.01 2.01 0 0 1-1.415-1.42c-.3-1.12-.3-3.48-.3-3.48s0-2.36.3-3.48a2.01 2.01 0 0 1 1.415-1.42c1.122-.3 5.285-.3 6.11-.335zM6.5 5.5v5l4.5-2.5z" />
  </svg>
);

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
  </svg>
);

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const GOOGLE_MAPS_LINK = "https://www.google.com/maps/place/sri+someshwara+silk+sarees/data=!4m2!3m1!1s0x3bae1956a0610233:0x8428be60cdc82448?sa=X&ved=1t:242&ictx=111";

  const validate = () => {
    let tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = "Name is required";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      tempErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = "Please enter a valid email address";
    }

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
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
      setErrors({});
    }
  };

  return (
    <div className="container" style={{ paddingTop: "40px", marginBottom: "60px" }}>
      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <h1 style={{ fontSize: "40px", marginBottom: "8px" }}>Visit & Contact Our Looms</h1>
        <div style={{ width: "60px", height: "3px", backgroundColor: "var(--accent-gold)", margin: "0 auto 12px auto" }} />
        <p style={{ color: "var(--text-muted)", maxWidth: "580px", margin: "0 auto" }}>
          Have questions about our Gadwal Semi Silk sarees, wholesale orders, or custom loom weaving? Connect with us directly or visit our Bengaluru weaving center.
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
                <h4 style={{ fontSize: "16px", marginBottom: "4px" }}>Weaving Mill & Showroom</h4>
                <p style={{ color: "var(--text-muted)", lineHeight: "1.5" }}>
                  <strong>Sri Someshwara Silk Sarees</strong><br />
                  No. 95, 1st Main Road, 3rd Cross,<br />
                  Markandaya Nagar, Agrahara Layout,<br />
                  Yelahanka, Bengaluru, Karnataka – 560064
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
                <h4 style={{ fontSize: "16px", marginBottom: "4px" }}>Direct Phone Numbers</h4>
                <p style={{ color: "var(--text-muted)", lineHeight: "1.6" }}>
                  Primary: <a href="tel:+918073428079" style={{ color: "var(--primary-maroon)", fontWeight: "700" }}>+91 80734 28079</a><br />
                  Secondary: <a href="tel:+919590791849" style={{ color: "var(--primary-maroon)", fontWeight: "700" }}>+91 95907 91849</a>
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
                <p style={{ color: "var(--text-muted)" }}>
                  <a href="mailto:sales@sssilksarees.com" style={{ color: "inherit" }}>sales@sssilksarees.com</a>
                </p>
              </div>
            </li>
          </ul>

          {/* Social Channels */}
          <div>
            <h4 style={{ fontSize: "15px", marginBottom: "12px", color: "var(--text-dark)" }}>Connect On Social Media</h4>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <a
                href="https://www.instagram.com/sssilksarees49/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{ padding: "8px 14px", fontSize: "13px", minHeight: "auto", display: "inline-flex", gap: "6px", alignItems: "center" }}
              >
                <InstagramIcon /> Instagram (@sssilksarees49)
              </a>
              <a
                href="https://www.youtube.com/@SSSilksarees"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{ padding: "8px 14px", fontSize: "13px", minHeight: "auto", display: "inline-flex", gap: "6px", alignItems: "center" }}
              >
                <YoutubeIcon /> YouTube (@SSSilksarees)
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{ padding: "8px 14px", fontSize: "13px", minHeight: "auto", display: "inline-flex", gap: "6px", alignItems: "center" }}
              >
                <FacebookIcon /> Facebook
              </a>
            </div>
          </div>

          {/* Real Google Map Embed */}
          <div style={{
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
            border: "1px solid var(--border-gold)",
            boxShadow: "var(--shadow-sm)"
          }}>
            <iframe
              title="Sri Someshwara Silk Sarees Location Map"
              src="https://maps.google.com/maps?q=Sri+Someshwara+Silk+Sarees+Agrahara+Layout+Yelahanka+Bengaluru&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="260"
              style={{ border: 0, display: "block" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div style={{
              padding: "12px 16px",
              backgroundColor: "var(--bg-white)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "13px"
            }}>
              <span style={{ color: "var(--text-muted)" }}>Agrahara Layout, Yelahanka, Bengaluru</span>
              <a
                href={GOOGLE_MAPS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold"
                style={{ padding: "6px 14px", fontSize: "12px", minHeight: "auto", gap: "4px" }}
              >
                View on Google Maps <ExternalLink size={12} />
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
                Your inquiry has been successfully sent to our support team. We will reach back to you within 24 hours via Phone or Email.
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
                  placeholder="Enter your full name"
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
                  placeholder="Enter your email address"
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
                  placeholder="Enter your phone number"
                />
                {errors.phone && <span className="form-error">{errors.phone}</span>}
              </div>

              {/* Message */}
              <div className="form-group">
                <label className="form-label" htmlFor="contact-msg">Message / Requirements *</label>
                <textarea 
                  id="contact-msg"
                  className="form-input" 
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about the sarees you are looking for (retail, wedding bulk, or wholesale lots)..."
                />
                {errors.message && <span className="form-error">{errors.message}</span>}
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ 
                  marginTop: "8px", 
                  width: "100%", 
                  fontWeight: "700",
                  gap: "10px",
                  padding: "14px"
                }}
              >
                <Send size={18} /> Submit Enquiry
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
          background-color: rgba(212,175,55,0.15) !important;
          color: var(--accent-gold) !important;
        }
        @media (max-width: 768px) {
          .contact-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
