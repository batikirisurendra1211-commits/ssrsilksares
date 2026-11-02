import React, { useState, useEffect } from "react";
import { 
  User, 
  LogOut, 
  Package, 
  Mail, 
  Phone, 
  Calendar, 
  Key, 
  AlertCircle, 
  ShieldCheck, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Lock, 
  Building, 
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Check,
  X
} from "lucide-react";
import api from "../api/apiClient";
import bannerWedding from "../assets/banners/wedding.png";
import saree1Img from "../assets/products/saree-1.png";

export default function Account({ currentUser, setCurrentUser, orders, setCurrentTab, fetchOrders, addToCart }) {
  // Mode: "login" or "register"
  const [authMode, setAuthMode] = useState("login");

  // Login Form States
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginTouched, setLoginTouched] = useState({ identifier: false, password: false });

  // Register Form States
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regPhone, setRegPhone] = useState("");
  const [regAccountType, setRegAccountType] = useState("customer");
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState("");
  const [regTouched, setRegTouched] = useState({ name: false, email: false, phone: false, password: false, confirmPassword: false });

  // Pending cart item from clicking "+" on sarees before logging in
  const [pendingCartItem, setPendingCartItem] = useState(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("pending_cart_product");
      if (raw) {
        setPendingCartItem(JSON.parse(raw));
      }
    } catch {
      setPendingCartItem(null);
    }
  }, []);

  // MFA Flow States (for Admin login)
  const [showMfaModal, setShowMfaModal] = useState(false);
  const [mfaTempToken, setMfaTempToken] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [mfaError, setMfaError] = useState("");
  const [mfaLoading, setMfaLoading] = useState(false);
  const [mfaSetupInfo, setMfaSetupInfo] = useState(null); // { secret, qr_code }

  // Profile Edit States
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(currentUser ? currentUser.name : "");
  const [editPhone, setEditPhone] = useState(currentUser ? (currentUser.phone || "") : "");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");

  // ================= Form Validation Logic =================
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailInput = (val) => val.includes("@");
  const isValidPhone = (val) => val.replace(/\D/g, "").length >= 10;

  // Login Validations
  const loginIdentifierIsValid = loginEmail.trim().length > 0 && (
    isEmailInput(loginEmail) ? emailRegex.test(loginEmail.trim()) : isValidPhone(loginEmail)
  );
  const loginPasswordIsValid = loginPassword.length >= 6;
  const isLoginFormValid = loginIdentifierIsValid && loginPasswordIsValid;

  // Register Validations
  const regNameIsValid = regName.trim().length >= 2;
  const regEmailIsValid = emailRegex.test(regEmail.trim());
  const regPhoneIsValid = !regPhone.trim() || isValidPhone(regPhone);
  const regPasswordIsValid = regPassword.length >= 6;
  const regPasswordsMatch = regPassword === regConfirmPassword && regConfirmPassword.length > 0;
  const isRegFormValid = regNameIsValid && regEmailIsValid && regPhoneIsValid && regPasswordIsValid && regPasswordsMatch;

  // Password Strength Meter
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: "", color: "#e2e8f0" };
    if (pwd.length < 6) return { score: 1, label: "Too short", color: "#dc2626" };
    let score = 1;
    if (pwd.length >= 8) score++;
    if (/[0-9]/.test(pwd) && /[a-zA-Z]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 2) return { score: 2, label: "Fair", color: "#d97706" };
    if (score === 3) return { score: 3, label: "Good", color: "var(--accent-gold)" };
    return { score: 4, label: "Strong", color: "#16a34a" };
  };
  const pwdStrength = getPasswordStrength(regPassword);

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginTouched({ identifier: true, password: true });
    setLoginError("");

    if (!isLoginFormValid) {
      if (!loginIdentifierIsValid) {
        setLoginError("Please enter a valid email address or 10-digit phone number.");
      } else if (!loginPasswordIsValid) {
        setLoginError("Password must be at least 6 characters.");
      }
      return;
    }

    setLoginLoading(true);
    try {
      const res = await api.auth.login({
        email: loginEmail.trim().toLowerCase(),
        password: loginPassword,
      });

      // Check if Admin MFA is required
      if (res.mfa_required) {
        setMfaTempToken(res.temp_token);
        if (res.mfa_setup_required) {
          setMfaSetupInfo({
            secret: res.secret,
            qr_code: res.qr_code,
          });
        } else {
          setMfaSetupInfo(null);
        }
        setShowMfaModal(true);
        setLoginLoading(false);
        return;
      }

      // Normal Login Success
      if (res.user) {
        setCurrentUser(res.user);
        if (fetchOrders) fetchOrders();

        // Check if there was a pending saree waiting to be added to cart
        if (pendingCartItem && addToCart) {
          const qty = parseInt(sessionStorage.getItem("pending_cart_qty") || "1", 10);
          sessionStorage.removeItem("pending_cart_product");
          sessionStorage.removeItem("pending_cart_qty");
          addToCart(pendingCartItem, qty);
        }

        if (res.user.role === "admin") {
          setCurrentTab("admin");
          window.location.hash = "#/admin";
        }
      }
    } catch (err) {
      setLoginError(err.message || "Failed to log in. Please check your credentials.");
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle MFA Verification
  const handleMfaSubmit = async (e) => {
    e.preventDefault();
    setMfaError("");
    if (!mfaCode.trim() || mfaCode.trim().length !== 6) {
      setMfaError("Please enter the 6-digit verification code from your authenticator app.");
      return;
    }

    setMfaLoading(true);
    try {
      const res = await api.auth.verifyMfa({
        temp_token: mfaTempToken,
        code: mfaCode.trim(),
      });

      if (res.user) {
        setCurrentUser(res.user);
        setShowMfaModal(false);
        setMfaCode("");
        setMfaTempToken("");
        if (fetchOrders) fetchOrders();
        setCurrentTab("admin");
        window.location.hash = "#/admin";
      }
    } catch (err) {
      setMfaError(err.message || "Invalid 6-digit MFA code. Please try again.");
    } finally {
      setMfaLoading(false);
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegTouched({ name: true, email: true, phone: true, password: true, confirmPassword: true });
    setRegError("");

    if (!isRegFormValid) {
      if (!regNameIsValid) setRegError("Please enter your full name (minimum 2 characters).");
      else if (!regEmailIsValid) setRegError("Please enter a valid email address.");
      else if (!regPasswordIsValid) setRegError("Password must be at least 6 characters.");
      else if (!regPasswordsMatch) setRegError("Passwords do not match.");
      return;
    }

    setRegLoading(true);
    try {
      const newUser = await api.auth.register({
        name: regName.trim(),
        email: regEmail.trim().toLowerCase(),
        password: regPassword,
        phone: regPhone.trim() || null,
        account_type: regAccountType,
      });

      if (newUser) {
        setCurrentUser(newUser);
        if (fetchOrders) fetchOrders();

        // Check if there was a pending saree waiting to be added to cart
        if (pendingCartItem && addToCart) {
          const qty = parseInt(sessionStorage.getItem("pending_cart_qty") || "1", 10);
          sessionStorage.removeItem("pending_cart_product");
          sessionStorage.removeItem("pending_cart_qty");
          addToCart(pendingCartItem, qty);
        }

        if (newUser.role === "b2b") {
          setCurrentTab("b2b");
          window.location.hash = "#/b2b";
        }
      }
    } catch (err) {
      setRegError(err.message || "Registration failed. An account with this email may already exist.");
    } finally {
      setRegLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await api.auth.logout();
    } catch (e) {
      console.warn("Logout error:", e);
    }
    setCurrentUser(null);
    setLoginEmail("");
    setLoginPassword("");
    setAuthMode("login");
  };

  // Handle Profile Save
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileSuccess("");
    try {
      const updated = await api.auth.updateMe({
        name: editName.trim(),
        phone: editPhone.trim() || null,
      });
      setCurrentUser(updated);
      setIsEditing(false);
      setProfileSuccess("Profile updated successfully!");
      setTimeout(() => setProfileSuccess(""), 4000);
    } catch (err) {
      alert("Failed to update profile: " + err.message);
    } finally {
      setProfileSaving(false);
    }
  };

  // Filter orders related to active user
  const userOrders = currentUser
    ? orders.filter(
        (o) =>
          (o.email && o.email.toLowerCase() === currentUser.email?.toLowerCase()) ||
          o.user_id === currentUser.id
      )
    : [];

  return (
    <div className="container" style={{ paddingTop: "30px", marginBottom: "60px" }}>
      
      {/* MFA Verification Modal (For Administrator login) */}
      {showMfaModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "20px",
          backdropFilter: "blur(4px)"
        }}>
          <div className="glass-card" style={{
            maxWidth: "460px",
            width: "100%",
            padding: "36px",
            backgroundColor: "var(--bg-white)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-gold)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
          }}>
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                backgroundColor: "rgba(212, 175, 55, 0.15)",
                color: "var(--accent-gold-hover)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 12px auto"
              }}>
                <ShieldCheck size={32} />
              </div>
              <h2 style={{ fontSize: "22px", color: "var(--primary-maroon)" }}>
                Two-Factor Authentication
              </h2>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "6px" }}>
                Administrator portal access requires a 6-digit TOTP verification code.
              </p>
            </div>

            {/* QR Code display if this is the first time setup */}
            {mfaSetupInfo && (
              <div style={{
                textAlign: "center",
                backgroundColor: "rgba(74, 14, 21, 0.03)",
                border: "1px dashed var(--border-gold)",
                borderRadius: "var(--radius-sm)",
                padding: "16px",
                marginBottom: "20px"
              }}>
                <p style={{ fontSize: "12px", fontWeight: "600", marginBottom: "10px", color: "var(--primary-maroon)" }}>
                  Scan with Google Authenticator or Authy:
                </p>
                <img
                  src={mfaSetupInfo.qr_code}
                  alt="MFA QR Code"
                  style={{ width: "160px", height: "160px", margin: "0 auto", display: "block", borderRadius: "8px" }}
                />
                <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "8px" }}>
                  Manual Secret: <code style={{ color: "var(--primary-maroon)", fontWeight: "700" }}>{mfaSetupInfo.secret}</code>
                </p>
              </div>
            )}

            <form onSubmit={handleMfaSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {mfaError && (
                <div style={{
                  backgroundColor: "rgba(220, 38, 38, 0.08)",
                  color: "#dc2626",
                  padding: "10px 14px",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "13px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  <AlertCircle size={16} /> {mfaError}
                </div>
              )}

              <div className="form-group">
                <label className="form-label" htmlFor="mfa-code">Enter 6-Digit Code</label>
                <input
                  id="mfa-code"
                  type="text"
                  maxLength={6}
                  autoComplete="one-time-code"
                  className="form-input"
                  style={{
                    letterSpacing: "8px",
                    textAlign: "center",
                    fontSize: "24px",
                    fontWeight: "700"
                  }}
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="000000"
                  autoFocus
                />
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button
                  type="button"
                  onClick={() => setShowMfaModal(false)}
                  className="btn btn-outline"
                  style={{ flex: 1, padding: "12px" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={mfaLoading || mfaCode.length !== 6}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: "12px", fontWeight: "700" }}
                >
                  {mfaLoading ? "Verifying..." : "Verify & Enter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {!currentUser ? (
        /* ================= SAREE-THEMED LUXURY LOGIN & SIGNUP PORTAL ================= */
        <div className="saree-auth-container" style={{
          maxWidth: "1040px",
          margin: "0 auto",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(74, 14, 21, 0.25), 0 0 0 1px rgba(212, 175, 55, 0.25)",
          backgroundColor: "var(--bg-white)"
        }}>
          <div className="saree-auth-grid" style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.15fr",
            minHeight: "640px"
          }}>
            
            {/* LEFT COLUMN: HERITAGE SAREE SHOWCASE & CRAFTSMANSHIP */}
            <div className="saree-auth-showcase" style={{
              position: "relative",
              background: "linear-gradient(165deg, #32070c 0%, #4a0e15 45%, #1a0306 100%)",
              color: "#ffffff",
              padding: "48px 40px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              overflow: "hidden"
            }}>
              {/* Background saree texture */}
              <div style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${bannerWedding})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: 0.22,
                mixBlendMode: "luminosity",
                pointerEvents: "none"
              }} />

              {/* Gold light gradient overlay */}
              <div style={{
                position: "absolute",
                inset: 0,
                background: "radial-gradient(circle at 85% 15%, rgba(212, 175, 55, 0.2) 0%, transparent 65%)",
                pointerEvents: "none"
              }} />

              {/* Top brand header */}
              <div style={{ position: "relative", zIndex: 2 }}>
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "rgba(212, 175, 55, 0.15)",
                  border: "1px solid rgba(212, 175, 55, 0.4)",
                  padding: "6px 14px",
                  borderRadius: "var(--radius-full)",
                  marginBottom: "18px"
                }}>
                  <Sparkles size={14} style={{ color: "var(--accent-gold)" }} />
                  <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "1.5px", color: "var(--accent-gold)", textTransform: "uppercase" }}>
                    Authentic Bengaluru Looms
                  </span>
                </div>

                <h1 style={{
                  color: "#ffffff",
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "30px",
                  lineHeight: "1.25",
                  marginBottom: "12px"
                }}>
                  Sri Someshwara <br />
                  <span style={{ color: "var(--accent-gold)" }}>Handloom Silk Sarees</span>
                </h1>

                <p style={{
                  color: "rgba(255, 255, 255, 0.85)",
                  fontSize: "14px",
                  lineHeight: "1.6",
                  maxWidth: "400px"
                }}>
                  Generational pitloom craftsmanship of Gadwal Semi Silk and Semi Sicco sarees. Direct from our looms to your wardrobe with zero middleman markups.
                </p>
              </div>

              {/* Middle: Signature Saree Preview Card */}
              <div style={{
                position: "relative",
                zIndex: 2,
                margin: "24px 0",
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(212, 175, 55, 0.35)",
                borderRadius: "var(--radius-md)",
                padding: "16px",
                display: "flex",
                alignItems: "center",
                gap: "16px"
              }}>
                <div style={{
                  width: "72px",
                  height: "88px",
                  borderRadius: "8px",
                  overflow: "hidden",
                  flexShrink: 0,
                  border: "1px solid rgba(212, 175, 55, 0.5)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.4)"
                }}>
                  <img
                    src={saree1Img}
                    alt="Gadwal Semi Silk Saree"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: "10px", color: "var(--accent-gold)", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px" }}>
                    Signature Pitloom Weave
                  </div>
                  <div style={{ fontSize: "15px", fontWeight: "700", color: "#ffffff", marginTop: "2px" }}>
                    Classic Crimson Gadwal Semi Silk
                  </div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", marginTop: "2px" }}>
                    Contrast golden tissue border & rich temple pallu
                  </div>
                  <div style={{ fontSize: "13px", fontWeight: "800", color: "var(--accent-gold)", marginTop: "4px" }}>
                    ₹3,499 <span style={{ fontSize: "11px", opacity: 0.7, fontWeight: "normal", color: "#ffffff" }}>Direct Loom Price</span>
                  </div>
                </div>
              </div>

              {/* Bottom: Trust highlights */}
              <div style={{
                position: "relative",
                zIndex: 2,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                borderTop: "1px solid rgba(212, 175, 55, 0.2)",
                paddingTop: "20px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "rgba(255, 255, 255, 0.9)" }}>
                  <CheckCircle2 size={16} style={{ color: "var(--accent-gold)", flexShrink: 0 }} />
                  <span>100% Pitloom Weave</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "rgba(255, 255, 255, 0.9)" }}>
                  <CheckCircle2 size={16} style={{ color: "var(--accent-gold)", flexShrink: 0 }} />
                  <span>Direct Factory Rates</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "rgba(255, 255, 255, 0.9)" }}>
                  <CheckCircle2 size={16} style={{ color: "var(--accent-gold)", flexShrink: 0 }} />
                  <span>Pan-India Safe Delivery</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "rgba(255, 255, 255, 0.9)" }}>
                  <CheckCircle2 size={16} style={{ color: "var(--accent-gold)", flexShrink: 0 }} />
                  <span>Verified B2B Wholesale</span>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: INTERACTIVE AUTHENTICATION PANEL */}
            <div style={{
              padding: "40px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              backgroundColor: "var(--bg-white)"
            }}>

              {/* Pending Cart Item Alert Banner (Shown when redirected after clicking "+ Add" on a saree) */}
              {pendingCartItem && (
                <div style={{
                  backgroundColor: "rgba(212, 175, 55, 0.12)",
                  border: "1px solid var(--accent-gold)",
                  borderRadius: "var(--radius-md)",
                  padding: "14px 18px",
                  marginBottom: "24px",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px"
                }}>
                  <div style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(74, 14, 21, 0.1)",
                    color: "var(--primary-maroon)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}>
                    <ShoppingBag size={22} style={{ color: "var(--primary-maroon)" }} />
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: "800", color: "var(--primary-maroon)" }}>
                      One Step to Add to Bag!
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                      Please sign in or create an account to add <strong>"{pendingCartItem.name}"</strong> (₹{pendingCartItem.price}) to your cart.
                    </div>
                  </div>
                </div>
              )}

              {/* Mode Switcher Tabs */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                backgroundColor: "rgba(74, 14, 21, 0.04)",
                borderRadius: "var(--radius-md)",
                padding: "4px",
                marginBottom: "28px"
              }}>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("login");
                    setLoginError("");
                    setLoginTouched({ identifier: false, password: false });
                  }}
                  style={{
                    padding: "12px",
                    border: "none",
                    borderRadius: "var(--radius-sm)",
                    background: authMode === "login" ? "var(--bg-white)" : "transparent",
                    fontWeight: authMode === "login" ? "800" : "600",
                    fontSize: "14px",
                    color: authMode === "login" ? "var(--primary-maroon)" : "var(--text-muted)",
                    boxShadow: authMode === "login" ? "0 2px 6px rgba(0,0,0,0.08)" : "none",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("register");
                    setRegError("");
                    setRegTouched({ name: false, email: false, phone: false, password: false, confirmPassword: false });
                  }}
                  style={{
                    padding: "12px",
                    border: "none",
                    borderRadius: "var(--radius-sm)",
                    background: authMode === "register" ? "var(--bg-white)" : "transparent",
                    fontWeight: authMode === "register" ? "800" : "600",
                    fontSize: "14px",
                    color: authMode === "register" ? "var(--primary-maroon)" : "var(--text-muted)",
                    boxShadow: authMode === "register" ? "0 2px 6px rgba(0,0,0,0.08)" : "none",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  Create Account
                </button>
              </div>

              {authMode === "login" ? (
                /* ================= SIGN IN FORM ================= */
                <form onSubmit={handleLoginSubmit} autoComplete="off" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {/* Decoy hidden inputs to absorb browser autofill heuristics */}
                  <input type="text" style={{ position: "absolute", top: "-9999px", left: "-9999px", opacity: 0, height: 0, width: 0, pointerEvents: "none" }} tabIndex="-1" readOnly autoComplete="off" />
                  <input type="password" style={{ position: "absolute", top: "-9999px", left: "-9999px", opacity: 0, height: 0, width: 0, pointerEvents: "none" }} tabIndex="-1" readOnly autoComplete="off" />

                  {loginError && (
                    <div style={{
                      backgroundColor: "rgba(220, 38, 38, 0.08)",
                      border: "1px solid rgba(220, 38, 38, 0.2)",
                      color: "#dc2626",
                      padding: "12px 16px",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "13px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px"
                    }}>
                      <AlertCircle size={18} style={{ flexShrink: 0 }} />
                      <span>{loginError}</span>
                    </div>
                  )}

                  {/* Identifier: Email or Phone */}
                  <div className="form-group">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <label className="form-label" htmlFor="login-email" style={{ margin: 0 }}>Email or Phone Number</label>
                      {loginTouched.identifier && loginEmail.trim() && (
                        <span style={{ fontSize: "11px", fontWeight: "600", color: loginIdentifierIsValid ? "#16a34a" : "#dc2626" }}>
                          {loginIdentifierIsValid ? "✓ Valid format" : isEmailInput(loginEmail) ? "Invalid email" : "Needs 10 digits"}
                        </span>
                      )}
                    </div>
                    <div style={{ position: "relative" }}>
                      <input
                        id="login-email"
                        name="ss_auth_identifier"
                        type="text"
                        autoComplete="off"
                        className="form-input"
                        value={loginEmail}
                        onChange={(e) => {
                          setLoginEmail(e.target.value);
                          if (!loginTouched.identifier) setLoginTouched(prev => ({ ...prev, identifier: true }));
                        }}
                        onBlur={() => setLoginTouched(prev => ({ ...prev, identifier: true }))}
                        placeholder="Enter registered email or phone"
                        required
                        style={{
                          paddingLeft: "40px",
                          paddingRight: "36px",
                          borderColor: loginTouched.identifier && loginEmail.trim() && !loginIdentifierIsValid ? "#dc2626" : undefined
                        }}
                        readOnly
                        onFocus={(e) => e.target.removeAttribute('readonly')}
                        onMouseDown={(e) => e.target.removeAttribute('readonly')}
                      />
                      <Mail size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                      {loginTouched.identifier && loginIdentifierIsValid && (
                        <Check size={18} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#16a34a" }} />
                      )}
                    </div>
                  </div>

                  {/* Password */}
                  <div className="form-group">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <label className="form-label" htmlFor="login-password" style={{ margin: 0 }}>Password</label>
                      {loginTouched.password && loginPassword && !loginPasswordIsValid && (
                        <span style={{ fontSize: "11px", color: "#dc2626", fontWeight: "600" }}>
                          Min. 6 characters
                        </span>
                      )}
                    </div>
                    <div style={{ position: "relative" }}>
                      <input
                        id="login-password"
                        name="ss_auth_secret_key"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        className="form-input"
                        value={loginPassword}
                        onChange={(e) => {
                          setLoginPassword(e.target.value);
                          if (!loginTouched.password) setLoginTouched(prev => ({ ...prev, password: true }));
                        }}
                        onBlur={() => setLoginTouched(prev => ({ ...prev, password: true }))}
                        placeholder="Enter your password"
                        required
                        style={{
                          paddingLeft: "40px",
                          paddingRight: "44px",
                          borderColor: loginTouched.password && loginPassword && !loginPasswordIsValid ? "#dc2626" : undefined
                        }}
                        readOnly
                        onFocus={(e) => e.target.removeAttribute('readonly')}
                        onMouseDown={(e) => e.target.removeAttribute('readonly')}
                      />
                      <Lock size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: "absolute",
                          right: "12px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--text-muted)",
                          padding: "4px"
                        }}
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="btn btn-primary"
                    style={{
                      padding: "14px",
                      fontWeight: "700",
                      fontSize: "15px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      marginTop: "6px"
                    }}
                  >
                    <span>{loginLoading ? "Authenticating..." : "Sign In to Account"}</span>
                    <ArrowRight size={18} />
                  </button>

                  <div style={{ textAlign: "center", fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
                    New to Sri Someshwara Silks?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("register");
                        setRegTouched({ name: false, email: false, phone: false, password: false, confirmPassword: false });
                        setRegError("");
                      }}
                      style={{ background: "none", border: "none", color: "var(--accent-gold-hover)", fontWeight: "700", cursor: "pointer", textDecoration: "underline" }}
                    >
                      Create an Account
                    </button>
                  </div>
                </form>
              ) : (
                /* ================= REGISTRATION FORM ================= */
                <form onSubmit={handleRegisterSubmit} autoComplete="off" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {/* Decoy hidden inputs to absorb browser autofill heuristics */}
                  <input type="text" style={{ position: "absolute", top: "-9999px", left: "-9999px", opacity: 0, height: 0, width: 0, pointerEvents: "none" }} tabIndex="-1" readOnly autoComplete="off" />
                  <input type="password" style={{ position: "absolute", top: "-9999px", left: "-9999px", opacity: 0, height: 0, width: 0, pointerEvents: "none" }} tabIndex="-1" readOnly autoComplete="off" />

                  {regError && (
                    <div style={{
                      backgroundColor: "rgba(220, 38, 38, 0.08)",
                      border: "1px solid rgba(220, 38, 38, 0.2)",
                      color: "#dc2626",
                      padding: "12px 16px",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "13px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px"
                    }}>
                      <AlertCircle size={18} style={{ flexShrink: 0 }} />
                      <span>{regError}</span>
                    </div>
                  )}

                  {/* Name */}
                  <div className="form-group">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <label className="form-label" htmlFor="reg-name" style={{ margin: 0 }}>Full Name *</label>
                      {regTouched.name && regName.trim() && !regNameIsValid && (
                        <span style={{ fontSize: "11px", color: "#dc2626", fontWeight: "600" }}>Min. 2 characters</span>
                      )}
                    </div>
                    <div style={{ position: "relative" }}>
                      <input
                        id="reg-name"
                        name="ss_reg_user_name"
                        type="text"
                        autoComplete="off"
                        className="form-input"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        onBlur={() => setRegTouched(prev => ({ ...prev, name: true }))}
                        placeholder="Enter your full name"
                        required
                        style={{ paddingLeft: "38px" }}
                        readOnly
                        onFocus={(e) => e.target.removeAttribute('readonly')}
                        onMouseDown={(e) => e.target.removeAttribute('readonly')}
                      />
                      <User size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="form-group">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <label className="form-label" htmlFor="reg-email" style={{ margin: 0 }}>Email Address *</label>
                      {regTouched.email && regEmail.trim() && (
                        <span style={{ fontSize: "11px", fontWeight: "600", color: regEmailIsValid ? "#16a34a" : "#dc2626" }}>
                          {regEmailIsValid ? "✓ Valid email" : "Invalid email format"}
                        </span>
                      )}
                    </div>
                    <div style={{ position: "relative" }}>
                      <input
                        id="reg-email"
                        name="ss_reg_user_mail"
                        type="email"
                        autoComplete="off"
                        className="form-input"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        onBlur={() => setRegTouched(prev => ({ ...prev, email: true }))}
                        placeholder="Enter your email address"
                        required
                        style={{ paddingLeft: "38px", paddingRight: "36px" }}
                        readOnly
                        onFocus={(e) => e.target.removeAttribute('readonly')}
                        onMouseDown={(e) => e.target.removeAttribute('readonly')}
                      />
                      <Mail size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                      {regTouched.email && regEmailIsValid && (
                        <Check size={16} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#16a34a" }} />
                      )}
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="form-group">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <label className="form-label" htmlFor="reg-phone" style={{ margin: 0 }}>Phone Number (Optional)</label>
                      {regPhone.trim() && (
                        <span style={{ fontSize: "11px", fontWeight: "600", color: regPhoneIsValid ? "#16a34a" : "#dc2626" }}>
                          {regPhoneIsValid ? "✓ Valid" : "Needs 10 digits"}
                        </span>
                      )}
                    </div>
                    <div style={{ position: "relative" }}>
                      <input
                        id="reg-phone"
                        name="ss_reg_user_tel"
                        type="tel"
                        autoComplete="off"
                        className="form-input"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        onBlur={() => setRegTouched(prev => ({ ...prev, phone: true }))}
                        placeholder="Enter your phone number"
                        style={{ paddingLeft: "38px" }}
                        readOnly
                        onFocus={(e) => e.target.removeAttribute('readonly')}
                        onMouseDown={(e) => e.target.removeAttribute('readonly')}
                      />
                      <Phone size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                    </div>
                  </div>

                  {/* Password & Strength Meter */}
                  <div className="form-group">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <label className="form-label" htmlFor="reg-password" style={{ margin: 0 }}>Create Password *</label>
                      {regPassword && (
                        <span style={{ fontSize: "11px", fontWeight: "700", color: pwdStrength.color }}>
                          {pwdStrength.label}
                        </span>
                      )}
                    </div>
                    <div style={{ position: "relative" }}>
                      <input
                        id="reg-password"
                        name="ss_reg_new_pwd"
                        type={showRegPassword ? "text" : "password"}
                        autoComplete="new-password"
                        className="form-input"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        onBlur={() => setRegTouched(prev => ({ ...prev, password: true }))}
                        placeholder="Min. 6 characters"
                        required
                        style={{ paddingLeft: "38px", paddingRight: "40px" }}
                        readOnly
                        onFocus={(e) => e.target.removeAttribute('readonly')}
                        onMouseDown={(e) => e.target.removeAttribute('readonly')}
                      />
                      <Lock size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        style={{
                          position: "absolute",
                          right: "12px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--text-muted)"
                        }}
                      >
                        {showRegPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    {/* Strength meter bar */}
                    {regPassword && (
                      <div style={{ display: "flex", gap: "4px", marginTop: "6px", height: "4px" }}>
                        {[1, 2, 3, 4].map((step) => (
                          <div
                            key={step}
                            style={{
                              flex: 1,
                              borderRadius: "2px",
                              backgroundColor: pwdStrength.score >= step ? pwdStrength.color : "#e2e8f0",
                              transition: "all 0.2s"
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="form-group">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <label className="form-label" htmlFor="reg-confirm-password" style={{ margin: 0 }}>Confirm Password *</label>
                      {regConfirmPassword && (
                        <span style={{ fontSize: "11px", fontWeight: "600", color: regPasswordsMatch ? "#16a34a" : "#dc2626" }}>
                          {regPasswordsMatch ? "✓ Passwords match" : "Does not match"}
                        </span>
                      )}
                    </div>
                    <div style={{ position: "relative" }}>
                      <input
                        id="reg-confirm-password"
                        name="ss_reg_confirm_pwd"
                        type={showRegPassword ? "text" : "password"}
                        autoComplete="new-password"
                        className="form-input"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        onBlur={() => setRegTouched(prev => ({ ...prev, confirmPassword: true }))}
                        placeholder="Re-enter password"
                        required
                        style={{ paddingLeft: "38px" }}
                        readOnly
                        onFocus={(e) => e.target.removeAttribute('readonly')}
                        onMouseDown={(e) => e.target.removeAttribute('readonly')}
                      />
                      <Lock size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={regLoading}
                    className="btn btn-primary"
                    style={{
                      padding: "14px",
                      fontWeight: "700",
                      fontSize: "15px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      marginTop: "6px"
                    }}
                  >
                    <span>{regLoading ? "Creating Account..." : "Complete Registration"}</span>
                    <ArrowRight size={18} />
                  </button>

                  <div style={{ textAlign: "center", fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("login");
                        setLoginTouched({ identifier: false, password: false });
                        setLoginError("");
                      }}
                      style={{ background: "none", border: "none", color: "var(--accent-gold-hover)", fontWeight: "700", cursor: "pointer", textDecoration: "underline" }}
                    >
                      Sign In
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>
        </div>
      ) : (
        /* ================= LOGGED-IN USER DASHBOARD ================= */
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 2.5fr",
          gap: "40px"
        }} className="account-layout">
          
          {/* Left Panel: Profile Summary */}
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
                  {currentUser.role === "admin"
                    ? "Store Administrator"
                    : currentUser.role === "b2b"
                    ? currentUser.b2b_approved
                      ? "B2B Partner (Verified)"
                      : "B2B Partner (Pending Approval)"
                    : "Retail Customer"}
                </span>
              </div>

              <div style={{ width: "100%", borderTop: "1px solid var(--border-light)", paddingTop: "16px", display: "flex", flexDirection: "column", gap: "12px", textAlign: "left", fontSize: "13px" }}>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <Mail size={14} style={{ color: "var(--accent-gold)" }} />
                  <span style={{ wordBreak: "break-all" }}>{currentUser.email}</span>
                </div>
                {currentUser.phone && (
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <Phone size={14} style={{ color: "var(--accent-gold)" }} />
                    <span>{currentUser.phone}</span>
                  </div>
                )}
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <ShieldCheck size={14} style={{ color: currentUser.mfa_enabled ? "#16a34a" : "var(--accent-gold)" }} />
                  <span>2FA Security: {currentUser.mfa_enabled ? "Enabled (Active)" : "Standard"}</span>
                </div>
              </div>

              {currentUser.role === "admin" && (
                <button
                  onClick={() => {
                    setCurrentTab("admin");
                    window.location.hash = "#/admin";
                  }}
                  className="btn btn-gold"
                  style={{ width: "100%", padding: "10px", fontSize: "13px", fontWeight: "700" }}
                >
                  Go to Admin Panel
                </button>
              )}

              <button
                onClick={handleLogout}
                className="btn btn-outline"
                style={{ width: "100%", gap: "8px", padding: "10px", fontSize: "14px", minHeight: "auto" }}
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>

            {/* B2B Status Notification Card */}
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
                  <Building size={16} /> Wholesale B2B Tier
                </h4>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.5" }}>
                  {currentUser.b2b_approved ? (
                    <>Your business account is verified for wholesale discount rates (up to 25% Off) on bulk lots of 30+ items.</>
                  ) : (
                    <>Your wholesale application is currently under review by our mill team. Once approved, wholesale rates will automatically unlock.</>
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Right Panel: Orders & Settings */}
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            
            {/* Profile Settings */}
            <div className="glass-card" style={{ padding: "32px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ fontSize: "22px" }}>Account Settings</h2>
                {!isEditing && (
                  <button onClick={() => { setIsEditing(true); setEditName(currentUser.name); setEditPhone(currentUser.phone || ""); }} className="btn btn-text" style={{ fontWeight: "700" }}>
                    Edit Profile
                  </button>
                )}
              </div>

              {profileSuccess && (
                <div style={{ backgroundColor: "#d1fae5", color: "#065f46", padding: "10px 14px", borderRadius: "var(--radius-sm)", marginBottom: "16px", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <CheckCircle2 size={16} /> {profileSuccess}
                </div>
              )}

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
                      required
                    />
                  </div>
                  <div className="form-group" style={{ flex: "1 1 200px" }}>
                    <label className="form-label" htmlFor="edit-phone">Phone Number</label>
                    <input
                      id="edit-phone"
                      type="tel"
                      className="form-input"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                  <div style={{ width: "100%", display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                    <button type="button" onClick={() => setIsEditing(false)} className="btn btn-outline" style={{ padding: "8px 16px", minHeight: "auto" }}>
                      Cancel
                    </button>
                    <button type="submit" disabled={profileSaving} className="btn btn-primary" style={{ padding: "8px 16px", minHeight: "auto" }}>
                      {profileSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", fontSize: "14px" }}>
                  <div>
                    <strong>Full Name:</strong> <span style={{ color: "var(--text-muted)", marginLeft: "8px" }}>{currentUser.name}</span>
                  </div>
                  <div>
                    <strong>Phone Number:</strong> <span style={{ color: "var(--text-muted)", marginLeft: "8px" }}>{currentUser.phone || "Not specified"}</span>
                  </div>
                  <div>
                    <strong>Account ID:</strong> <code style={{ fontSize: "12px", color: "var(--text-muted)", marginLeft: "8px" }}>{currentUser.id}</code>
                  </div>
                  <div>
                    <strong>Member Since:</strong> <span style={{ color: "var(--text-muted)", marginLeft: "8px" }}>{currentUser.created_at ? new Date(currentUser.created_at).toLocaleDateString() : "2026"}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Orders list */}
            <div className="glass-card" style={{ padding: "32px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ fontSize: "22px" }}>Order History</h2>
                {fetchOrders && (
                  <button onClick={fetchOrders} className="btn btn-text" style={{ fontSize: "13px" }}>
                    Refresh
                  </button>
                )}
              </div>

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
                  <a href="#/shop" onClick={() => setCurrentTab("shop")} className="btn btn-primary" style={{ marginTop: "12px", padding: "8px 20px" }}>
                    Shop Saree Catalog
                  </a>
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
                          <strong style={{ color: "var(--primary-maroon)" }}>Order #{order.id}</strong>
                          <span style={{ fontSize: "12px", color: "var(--text-muted)", display: "block" }}>
                            Placed on: {order.date || (order.created_at ? new Date(order.created_at).toLocaleDateString() : "Recent")}
                          </span>
                        </div>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <span className="badge" style={{
                            backgroundColor: order.payment_status === "Paid" ? "#d1fae5" : "#fef3c7",
                            color: order.payment_status === "Paid" ? "#065f46" : "#92400e"
                          }}>
                            {order.payment_status}
                          </span>
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
                        {Array.isArray(order.items) && order.items.map((item, idx) => (
                          <div key={idx} style={{ display: "flex", justifyContent: "space-between" }}>
                            <span>{item.productName || item.name} <strong>× {item.quantity}</strong></span>
                            <span>₹{((item.price || 0) * (item.quantity || 1)).toLocaleString("en-IN")}</span>
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
                        <span style={{ fontSize: "16px", color: "var(--primary-maroon)" }}>
                          ₹{(order.total || 0).toLocaleString("en-IN")}
                        </span>
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
        @media (max-width: 900px) {
          .saree-auth-grid {
            grid-template-columns: 1fr !important;
          }
          .saree-auth-showcase {
            padding: 32px 24px !important;
            min-height: auto !important;
          }
          .account-layout {
            grid-template-columns: 1fr !important;
            gap: 30px !important;
          }
        }
      `}</style>
    </div>
  );
}
