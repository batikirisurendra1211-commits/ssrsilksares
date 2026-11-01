import React, { useState, useRef } from "react";
import logo from "../assets/logo.svg";
import { Search, ShoppingBag, User, Menu, X, Sun, Moon, Briefcase } from "lucide-react";

export default function Header({ 
  currentTab, 
  setCurrentTab, 
  cart, 
  setCartOpen, 
  darkMode, 
  setDarkMode, 
  currentUser, 
  setSearchQuery 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const searchInputRef = useRef(null);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchQuery(searchInput);
      setCurrentTab("shop");
      window.location.hash = "#/shop";
      setSearchOpen(false);
    }
  };

  const toggleSearch = () => {
    setSearchOpen((prev) => {
      const next = !prev;
      if (next) {
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }
      return next;
    });
  };

  const navLinks = [
    { id: "home", label: "Home", hash: "#/" },
    { id: "shop", label: "Shop", hash: "#/shop" },
    { id: "about", label: "Heritage", hash: "#/about" },
    { id: "b2b", label: "Wholesale", hash: "#/b2b" },
    { id: "contact", label: "Contact", hash: "#/contact" }
  ];

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header 
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        width: "100%",
        backgroundColor: "rgba(26, 5, 8, 0.96)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1.5px solid rgba(212, 175, 55, 0.35)",
        boxShadow: "0 6px 24px rgba(0, 0, 0, 0.4)"
      }}
    >
      <div 
        className="container" 
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "72px",
          gap: "24px"
        }}
      >
        {/* BRAND LOGO & TYPOGRAPHY */}
        <a 
          href="#/" 
          onClick={() => setCurrentTab("home")} 
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            cursor: "pointer",
            textDecoration: "none",
            flexShrink: 0
          }}
        >
          <div 
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              border: "1.5px solid rgba(212, 175, 55, 0.65)",
              padding: "3px",
              backgroundColor: "rgba(212, 175, 55, 0.08)",
              boxShadow: "0 0 14px rgba(212, 175, 55, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <img 
              src={logo} 
              alt="Sri Someshwara Silk Sarees" 
              style={{
                height: "100%",
                width: "100%",
                objectFit: "contain"
              }} 
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span 
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "19px",
                fontWeight: "700",
                letterSpacing: "0.5px",
                lineHeight: "1.15",
                color: "var(--accent-gold)"
              }}
            >
              Sri Someshwara
            </span>
            <span 
              style={{
                fontSize: "9px",
                letterSpacing: "2.5px",
                color: "rgba(250, 247, 240, 0.8)",
                fontWeight: "600",
                textTransform: "uppercase",
                marginTop: "1px"
              }}
            >
              HANDLOOM SILK SAREES
            </span>
          </div>
        </a>

        {/* CENTER LUXURY NAVIGATION LINKS WITH HOVER LINE EFFECT */}
        <nav 
          className="header-desktop-nav"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "36px"
          }}
        >
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <a 
                key={link.id} 
                href={link.hash}
                onClick={() => setCurrentTab(link.id)}
                className={`luxury-nav-link ${isActive ? "active" : ""}`}
              >
                <span>{link.label}</span>
              </a>
            );
          })}
        </nav>

        {/* RIGHT UTILITIES & ACTIONS */}
        <div 
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}
        >
          {/* Expandable Search Control */}
          {searchOpen ? (
            <form 
              onSubmit={handleSearchSubmit}
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                border: "1px solid var(--accent-gold)",
                borderRadius: "9999px",
                padding: "5px 14px",
                gap: "8px",
                boxShadow: "0 0 12px rgba(212, 175, 55, 0.25)"
              }}
            >
              <Search size={14} style={{ color: "var(--accent-gold)" }} />
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Search sarees..." 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                style={{
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: "#ffffff",
                  fontSize: "13px",
                  width: "150px",
                  fontFamily: "inherit"
                }} 
              />
              <button 
                type="button" 
                onClick={() => setSearchOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(255, 255, 255, 0.6)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <X size={14} />
              </button>
            </form>
          ) : (
            <button 
              onClick={toggleSearch}
              className="luxury-icon-btn"
              aria-label="Search"
              title="Search Sarees"
            >
              <Search size={16} />
            </button>
          )}

          {/* Admin Panel Button (if user is admin) */}
          {currentUser && currentUser.role === "admin" && (
            <a 
              href="#/admin" 
              onClick={() => setCurrentTab("admin")}
              className={`luxury-icon-btn ${currentTab === "admin" ? "active" : ""}`}
              aria-label="Admin Studio"
              title="Admin Studio"
              style={{
                color: "var(--accent-gold)"
              }}
            >
              <Briefcase size={16} />
            </a>
          )}

          {/* Dark/Light Mode Toggle */}
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="luxury-icon-btn"
            aria-label="Toggle dark mode"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* User Account Button */}
          <a 
            href="#/account" 
            onClick={() => setCurrentTab("account")}
            style={{
              color: currentTab === "account" ? "var(--accent-gold)" : "#ffffff",
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              fontSize: "13px",
              fontWeight: "600",
              padding: "7px 16px",
              borderRadius: "9999px",
              backgroundColor: currentTab === "account" ? "rgba(212, 175, 55, 0.18)" : "rgba(255, 255, 255, 0.05)",
              border: "1px solid",
              borderColor: currentTab === "account" ? "var(--accent-gold)" : "rgba(212, 175, 55, 0.35)",
              textDecoration: "none",
              transition: "all 0.25s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent-gold)";
              e.currentTarget.style.color = "var(--accent-gold)";
              e.currentTarget.style.backgroundColor = "rgba(212, 175, 55, 0.15)";
            }}
            onMouseLeave={(e) => {
              if (currentTab !== "account") {
                e.currentTarget.style.borderColor = "rgba(212, 175, 55, 0.35)";
                e.currentTarget.style.color = "#ffffff";
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
              }
            }}
            aria-label="My Account"
          >
            <User size={15} style={{ color: "var(--accent-gold)" }} />
            {currentUser ? (
              <span 
                style={{ 
                  maxWidth: "80px", 
                  overflow: "hidden", 
                  textOverflow: "ellipsis", 
                  whiteSpace: "nowrap" 
                }} 
                className="header-username"
              >
                {currentUser.name ? currentUser.name.split(" ")[0] : "Account"}
              </span>
            ) : (
              <span className="header-username" style={{ fontSize: "12px", opacity: 0.95 }}>
                Sign In
              </span>
            )}
          </a>

          {/* Shopping Cart Button */}
          <button 
            onClick={() => setCartOpen(true)}
            className="luxury-icon-btn cart-btn"
            aria-label="Shopping Cart"
            title="View Cart"
            style={{ position: "relative" }}
          >
            <ShoppingBag size={17} />
            {totalCartItems > 0 && (
              <span 
                style={{
                  position: "absolute",
                  top: "-3px",
                  right: "-3px",
                  backgroundColor: "var(--accent-gold)",
                  color: "#2a060a",
                  fontSize: "10.5px",
                  fontWeight: "800",
                  borderRadius: "50%",
                  width: "18px",
                  height: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1.5px solid #20060a",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.4)"
                }}
              >
                {totalCartItems}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="luxury-icon-btn header-mobile-toggle"
            aria-label="Toggle navigation menu"
            style={{ display: "none" }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div 
          style={{
            backgroundColor: "rgba(26, 5, 8, 0.98)",
            borderTop: "1px solid rgba(212, 175, 55, 0.3)",
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            backdropFilter: "blur(20px)"
          }} 
          className="mobile-menu-drawer"
        >
          {/* Mobile Search */}
          <form 
            onSubmit={handleSearchSubmit} 
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(212, 175, 55, 0.4)",
              borderRadius: "9999px",
              padding: "8px 16px"
            }}
          >
            <Search size={16} style={{ color: "var(--accent-gold)", marginRight: "10px" }} />
            <input 
              type="text" 
              placeholder="Search Gadwal Sarees..." 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{
                background: "none",
                border: "none",
                outline: "none",
                color: "#ffffff",
                fontSize: "14px",
                width: "100%",
                fontFamily: "inherit"
              }} 
            />
          </form>

          {/* Mobile Navigation Links */}
          <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {navLinks.map((link) => (
              <a 
                key={link.id} 
                href={link.hash}
                onClick={() => {
                  setCurrentTab(link.id);
                  setMobileMenuOpen(false);
                }}
                style={{
                  fontSize: "15px",
                  fontWeight: "600",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  color: currentTab === link.id ? "var(--accent-gold)" : "#ffffff",
                  padding: "10px 0",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                  textDecoration: "none"
                }}
              >
                {link.label}
              </a>
            ))}
            {currentUser && currentUser.role === "admin" && (
              <a 
                href="#/admin" 
                onClick={() => {
                  setCurrentTab("admin");
                  setMobileMenuOpen(false);
                }}
                style={{
                  fontSize: "15px",
                  fontWeight: "700",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  color: "var(--accent-gold)",
                  padding: "10px 0",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                <Briefcase size={16} />
                <span>Admin Studio</span>
              </a>
            )}
          </nav>
        </div>
      )}

      {/* STYLES FOR HOVER LINE ANIMATION AND RESPONSIVENESS */}
      <style>{`
        /* Luxury Navigation Hover Line Effect */
        .luxury-nav-link {
          position: relative;
          font-size: 13.5px;
          font-weight: 600;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          color: rgba(250, 247, 240, 0.82);
          padding: 8px 0;
          text-decoration: none;
          transition: color 0.3s ease;
          display: inline-flex;
          align-items: center;
        }

        .luxury-nav-link::after {
          content: "";
          position: absolute;
          bottom: -2px;
          left: 50%;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #d4af37, #fef08a, #d4af37, transparent);
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateX(-50%);
          border-radius: 2px;
          box-shadow: 0 0 8px rgba(212, 175, 55, 0.6);
        }

        .luxury-nav-link:hover::after,
        .luxury-nav-link.active::after {
          width: 100%;
        }

        .luxury-nav-link:hover,
        .luxury-nav-link.active {
          color: #d4af37 !important;
        }

        /* Luxury Icon Buttons */
        .luxury-icon-btn {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 50%;
          width: 38px;
          height: 38px;
          color: var(--accent-gold);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.25s ease;
          text-decoration: none;
        }

        .luxury-icon-btn:hover,
        .luxury-icon-btn.active {
          border-color: var(--accent-gold);
          background: rgba(212, 175, 55, 0.18);
          box-shadow: 0 0 12px rgba(212, 175, 55, 0.3);
          color: var(--accent-gold);
        }

        @media (max-width: 1024px) {
          .header-desktop-nav {
            display: none !important;
          }
          .header-mobile-toggle {
            display: flex !important;
          }
        }
        @media (max-width: 768px) {
          .header-username {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
