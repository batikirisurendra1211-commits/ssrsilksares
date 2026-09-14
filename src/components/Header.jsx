import React, { useState } from "react";
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
  const [searchInput, setSearchInput] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setCurrentTab("shop");
    window.location.hash = "#/shop";
  };

  const navLinks = [
    { id: "home", label: "Home", hash: "#/" },
    { id: "shop", label: "Shop", hash: "#/shop" },
    { id: "about", label: "About Us", hash: "#/about" },
    { id: "contact", label: "Contact", hash: "#/contact" },
    { id: "b2b", label: "Wholesale (B2B)", hash: "#/b2b" }
  ];

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="glass-card" style={{
      position: "sticky",
      top: 0,
      zIndex: 100,
      backgroundColor: "var(--primary-maroon)",
      color: "var(--bg-cream)",
      borderBottom: "2px solid var(--accent-gold)",
      borderRadius: "0"
    }}>
      <div className="container" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "80px",
        gap: "16px"
      }}>
        {/* Brand Logo & Name */}
        <a href="#/" onClick={() => setCurrentTab("home")} style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          cursor: "pointer"
        }}>
          <img src={logo} alt="Sri Someshwara Silk Sarees" style={{
            height: "55px",
            width: "55px",
            objectFit: "contain",
            border: "1px solid var(--accent-gold)",
            borderRadius: "50%",
            padding: "2px",
            backgroundColor: "rgba(255,255,255,0.05)"
          }} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "18px",
              fontWeight: "700",
              letterSpacing: "0.5px",
              lineHeight: "1.2",
              color: "var(--accent-gold)"
            }}>
              Sri Someshwara
            </span>
            <span style={{
              fontSize: "12px",
              letterSpacing: "1.5px",
              color: "var(--bg-cream)",
              opacity: "0.9"
            }}>
              SILK SAREES
            </span>
          </div>
        </a>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          border: "1px solid rgba(212, 175, 55, 0.4)",
          borderRadius: "var(--radius-full)",
          padding: "4px 12px",
          width: "25%",
          maxWidth: "300px"
        }} className="search-form-desktop">
          <input 
            type="text" 
            placeholder="Search Gadwal sarees..." 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{
              background: "none",
              border: "none",
              outline: "none",
              color: "var(--bg-cream)",
              fontSize: "14px",
              width: "100%"
            }} 
          />
          <button type="submit" style={{
            background: "none",
            border: "none",
            color: "var(--accent-gold)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center"
          }}>
            <Search size={16} />
          </button>
        </form>

        {/* Navigation Links */}
        <nav className="nav-menu">
          {navLinks.map((link) => (
            <a 
              key={link.id} 
              href={link.hash}
              onClick={() => setCurrentTab(link.id)}
              style={{
                fontSize: "14px",
                fontWeight: "600",
                letterSpacing: "0.5px",
                color: currentTab === link.id ? "var(--accent-gold)" : "var(--bg-cream)",
                borderBottom: currentTab === link.id ? "2px solid var(--accent-gold)" : "2px solid transparent",
                padding: "6px 0",
                transition: "all var(--transition-fast)"
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right side Actions */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "16px"
        }}>
          {/* Admin panel quick link if user is owner/staff */}
          {currentUser && currentUser.role === "admin" && (
            <a 
              href="#/admin" 
              onClick={() => setCurrentTab("admin")}
              style={{
                color: currentTab === "admin" ? "var(--accent-gold)" : "var(--bg-cream)",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13px",
                fontWeight: "700",
                backgroundColor: "rgba(212, 175, 55, 0.15)",
                padding: "6px 12px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--accent-gold)"
              }}
            >
              <Briefcase size={14} /> Admin
            </a>
          )}

          {/* Dark Mode Toggle */}
          <button 
            onClick={() => setDarkMode(!darkMode)}
            style={{
              background: "none",
              border: "none",
              color: "var(--accent-gold)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center"
            }}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Account Icon */}
          <a 
            href="#/account" 
            onClick={() => setCurrentTab("account")}
            style={{
              color: currentTab === "account" ? "var(--accent-gold)" : "var(--bg-cream)",
              display: "flex",
              alignItems: "center"
            }}
            aria-label="My Account"
          >
            <User size={20} />
          </a>

          {/* Cart Icon */}
          <button 
            onClick={() => setCartOpen(true)}
            style={{
              background: "none",
              border: "none",
              color: "var(--accent-gold)",
              cursor: "pointer",
              position: "relative",
              display: "flex",
              alignItems: "center",
              padding: "4px"
            }}
            aria-label="Shopping Cart"
          >
            <ShoppingBag size={20} />
            {totalCartItems > 0 && (
              <span style={{
                position: "absolute",
                top: "-4px",
                right: "-4px",
                backgroundColor: "var(--bg-cream)",
                color: "var(--primary-maroon)",
                fontSize: "10px",
                fontWeight: "800",
                borderRadius: "50%",
                width: "16px",
                height: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid var(--accent-gold)"
              }}>
                {totalCartItems}
              </span>
            )}
          </button>

          {/* Mobile Hamburguer Menu */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: "none",
              border: "none",
              color: "var(--bg-cream)",
              cursor: "pointer",
              display: "none"
            }}
            className="mobile-menu-btn"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: "var(--primary-maroon)",
          borderTop: "1px solid var(--border-gold)",
          padding: "16px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px"
        }} className="mobile-menu-drawer">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(212, 175, 55, 0.4)",
            borderRadius: "var(--radius-full)",
            padding: "8px 16px"
          }}>
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{
                background: "none",
                border: "none",
                outline: "none",
                color: "var(--bg-cream)",
                fontSize: "14px",
                width: "100%"
              }} 
            />
            <button type="submit" style={{
              background: "none",
              border: "none",
              color: "var(--accent-gold)"
            }}>
              <Search size={16} />
            </button>
          </form>

          {/* Links list */}
          <nav style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {navLinks.map((link) => (
              <a 
                key={link.id} 
                href={link.hash}
                onClick={() => {
                  setCurrentTab(link.id);
                  setMobileMenuOpen(false);
                }}
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: currentTab === link.id ? "var(--accent-gold)" : "var(--bg-cream)",
                  padding: "8px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.05)"
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
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "var(--accent-gold)",
                  padding: "8px 0"
                }}
              >
                Admin Panel
              </a>
            )}
          </nav>
        </div>
      )}
      
      {/* Styles inject for header responsiveness */}
      <style>{`
        @media (max-width: 1024px) {
          .search-form-desktop {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
}
