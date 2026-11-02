import React, { useState } from "react";
import { User, LogOut, Package, Mail, Phone, Calendar, Key, AlertCircle, ShieldCheck, CheckCircle2, Eye, EyeOff, Lock, Building, Sparkles } from "lucide-react";
import api from "../api/apiClient";

export default function Account({ currentUser, setCurrentUser, orders, setCurrentTab, fetchOrders }) {
  // Mode: "login" or "register"
  const [authMode, setAuthMode] = useState("login");

  // Login Form States
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Register Form States
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regAccountType, setRegAccountType] = useState("customer");
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState("");

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

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError("Please enter your email and password.");
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
    setRegError("");

    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setRegError("Please fill in all required fields.");
      return;
    }
    if (regPassword.length < 6) {
      setRegError("Password must be at least 6 characters long.");
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
    <div className="container" style={{ paddingTop: "40px", marginBottom: "60px" }}>
      
      {/* MFA Verification Modal */}
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
        /* Sign In / Register Panel */
        <div style={{ maxWidth: "480px", margin: "0 auto" }} className="glass-card">
          
          {/* Header */}
          <div style={{
            padding: "28px 32px",
            borderBottom: "1px solid var(--border-light)",
            textAlign: "center",
            backgroundColor: "var(--primary-maroon)",
            color: "var(--bg-cream)",
            borderRadius: "var(--radius-md) var(--radius-md) 0 0"
          }}>
            <h2 style={{ color: "var(--accent-gold)", fontFamily: "'Playfair Display', serif", fontSize: "26px" }}>
              Sri Someshwara Silks
            </h2>
            <p style={{ fontSize: "13px", opacity: 0.9, marginTop: "4px" }}>
              Customer Account Portal
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            borderBottom: "1px solid var(--border-light)",
            backgroundColor: "rgba(0,0,0,0.02)"
          }}>
            <button
              type="button"
              onClick={() => {
                setAuthMode("login");
                setLoginError("");
                setLoginEmail("");
                setLoginPassword("");
              }}
              style={{
                padding: "14px",
                border: "none",
                background: authMode === "login" ? "var(--bg-white)" : "transparent",
                fontWeight: authMode === "login" ? "700" : "500",
                color: authMode === "login" ? "var(--primary-maroon)" : "var(--text-muted)",
                borderBottom: authMode === "login" ? "3px solid var(--accent-gold)" : "none",
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
                setRegName("");
                setRegEmail("");
                setRegPhone("");
                setRegPassword("");
              }}
              style={{
                padding: "14px",
                border: "none",
                background: authMode === "register" ? "var(--bg-white)" : "transparent",
                fontWeight: authMode === "register" ? "700" : "500",
                color: authMode === "register" ? "var(--primary-maroon)" : "var(--text-muted)",
                borderBottom: authMode === "register" ? "3px solid var(--accent-gold)" : "none",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              Create Account
            </button>
          </div>

          {authMode === "login" ? (
            /* --- SIGN IN FORM --- */
            <form onSubmit={handleLoginSubmit} autoComplete="off" style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Decoy hidden inputs to absorb browser autofill */}
              <input type="text" style={{ position: "absolute", top: "-9999px", left: "-9999px", opacity: 0, height: 0, width: 0, pointerEvents: "none" }} tabIndex="-1" readOnly autoComplete="off" />
              <input type="password" style={{ position: "absolute", top: "-9999px", left: "-9999px", opacity: 0, height: 0, width: 0, pointerEvents: "none" }} tabIndex="-1" readOnly autoComplete="off" />

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
                <label className="form-label" htmlFor="login-email">Email Address or Phone Number</label>
                <div style={{ position: "relative" }}>
                  <input
                    id="login-email"
                    name="ss_auth_identifier"
                    type="text"
                    autoComplete="off"
                    className="form-input"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="Enter registered email or phone"
                    required
                    style={{ paddingLeft: "38px" }}
                    readOnly
                    onFocus={(e) => e.target.removeAttribute('readonly')}
                    onMouseDown={(e) => e.target.removeAttribute('readonly')}
                  />
                  <Mail size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="login-password">Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    id="login-password"
                    name="ss_auth_secret_key"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    className="form-input"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    style={{ paddingLeft: "38px", paddingRight: "40px" }}
                    readOnly
                    onFocus={(e) => e.target.removeAttribute('readonly')}
                    onMouseDown={(e) => e.target.removeAttribute('readonly')}
                  />
                  <Lock size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
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
                      color: "var(--text-muted)"
                    }}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="btn btn-primary"
                style={{ padding: "14px", fontWeight: "700" }}
              >
                {loginLoading ? "Authenticating..." : "Sign In to Account"}
              </button>

              <div style={{ textAlign: "center", fontSize: "13px", color: "var(--text-muted)" }}>
                Don't have an account yet?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("register");
                    setRegName("");
                    setRegEmail("");
                    setRegPhone("");
                    setRegPassword("");
                  }}
                  style={{ background: "none", border: "none", color: "var(--accent-gold-hover)", fontWeight: "700", cursor: "pointer" }}
                >
                  Register here
                </button>
              </div>
            </form>
          ) : (
            /* --- REGISTRATION FORM --- */
            <form onSubmit={handleRegisterSubmit} autoComplete="off" style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "18px" }}>
              {/* Decoy hidden inputs to absorb browser autofill */}
              <input type="text" style={{ position: "absolute", top: "-9999px", left: "-9999px", opacity: 0, height: 0, width: 0, pointerEvents: "none" }} tabIndex="-1" readOnly autoComplete="off" />
              <input type="password" style={{ position: "absolute", top: "-9999px", left: "-9999px", opacity: 0, height: 0, width: 0, pointerEvents: "none" }} tabIndex="-1" readOnly autoComplete="off" />

              {regError && (
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
                  <AlertCircle size={16} /> {regError}
                </div>
              )}

              {/* Name */}
              <div className="form-group">
                <label className="form-label" htmlFor="reg-name">Full Name *</label>
                <input
                  id="reg-name"
                  name="ss_reg_user_name"
                  type="text"
                  autoComplete="off"
                  className="form-input"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  readOnly
                  onFocus={(e) => e.target.removeAttribute('readonly')}
                  onMouseDown={(e) => e.target.removeAttribute('readonly')}
                />
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label" htmlFor="reg-email">Email Address *</label>
                <input
                  id="reg-email"
                  name="ss_reg_user_mail"
                  type="email"
                  autoComplete="off"
                  className="form-input"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  readOnly
                  onFocus={(e) => e.target.removeAttribute('readonly')}
                  onMouseDown={(e) => e.target.removeAttribute('readonly')}
                />
              </div>

              {/* Phone */}
              <div className="form-group">
                <label className="form-label" htmlFor="reg-phone">Phone Number (with Country Code)</label>
                <input
                  id="reg-phone"
                  name="ss_reg_user_tel"
                  type="tel"
                  autoComplete="off"
                  className="form-input"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  readOnly
                  onFocus={(e) => e.target.removeAttribute('readonly')}
                  onMouseDown={(e) => e.target.removeAttribute('readonly')}
                />
              </div>

              {/* Password */}
              <div className="form-group">
                <label className="form-label" htmlFor="reg-password">Create Password (min. 6 characters) *</label>
                <input
                  id="reg-password"
                  name="ss_reg_new_pwd"
                  type="password"
                  autoComplete="new-password"
                  className="form-input"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Create a secure password"
                  required
                  readOnly
                  onFocus={(e) => e.target.removeAttribute('readonly')}
                  onMouseDown={(e) => e.target.removeAttribute('readonly')}
                />
              </div>

              <button
                type="submit"
                disabled={regLoading}
                className="btn btn-primary"
                style={{ padding: "14px", fontWeight: "700" }}
              >
                {regLoading ? "Creating Account..." : "Complete Registration"}
              </button>

              <div style={{ textAlign: "center", fontSize: "13px", color: "var(--text-muted)" }}>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("login");
                    setLoginEmail("");
                    setLoginPassword("");
                  }}
                  style={{ background: "none", border: "none", color: "var(--accent-gold-hover)", fontWeight: "700", cursor: "pointer" }}
                >
                  Sign In
                </button>
              </div>
            </form>
          )}

        </div>
      ) : (
        /* --- LOGGED-IN USER DASHBOARD --- */
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
