import React, { useEffect, useState } from "react";
import {
  Package,
  ClipboardList,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  ShoppingBag,
  Edit,
  Plus,
  Trash,
  X,
  Search,
  History,
  Shield,
  Users,
  Eye,
  Globe,
  Monitor,
  Check,
  Building,
  UserCheck,
  Activity,
  ArrowRight
} from "lucide-react";
import ImageDropzone from "../components/ImageDropzone";
import api from "../api/apiClient";

export default function Admin({
  currentUser,
  orders,
  setOrders,
  products,
  setProducts,
  fetchProducts,
  fetchOrders,
  setCurrentTab
}) {
  // Active Sidebar Navigation Tab
  const [activeNav, setActiveNav] = useState("dashboard");

  // Search & Filter States
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [auditSearchQuery, setAuditSearchQuery] = useState("");
  const [auditActionFilter, setAuditActionFilter] = useState("");
  const [auditRoleFilter, setAuditRoleFilter] = useState("");

  // Product Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Product Form States
  const [formName, setFormName] = useState("");
  const [formSku, setFormSku] = useState("");
  const [formPrice, setFormPrice] = useState(2999);
  const [formStock, setFormStock] = useState(5);
  const [formWeave, setFormWeave] = useState("Gadwal Semi Silk");
  const [formFabric, setFormFabric] = useState("Semi Silk");
  const [formColor, setFormColor] = useState("Maroon");
  const [formOccasion, setFormOccasion] = useState("Festive Wear");
  const [formDesc, setFormDesc] = useState("");
  const [formCare, setFormCare] = useState("Dry Clean Recommended.");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Data States
  const [creationHistory, setCreationHistory] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditSummary, setAuditSummary] = useState(null);
  const [auditLoading, setAuditLoading] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Safe refresh that never wipes data
  const handleRefreshAll = async () => {
    setRefreshing(true);
    try {
      await Promise.allSettled([
        fetchProducts ? fetchProducts() : Promise.resolve(),
        fetchOrders ? fetchOrders() : Promise.resolve(),
        fetchAuditLogs(),
        fetchUsers(),
        fetchCreationHistory()
      ]);
    } finally {
      setRefreshing(false);
    }
  };

  // Log admin navigation when switching panels & auto-refresh relevant tab data
  const handleNavChange = (navKey, navTitle) => {
    setActiveNav(navKey);
    if (navKey === "orders" || navKey === "dashboard") {
      if (fetchOrders) fetchOrders();
    }
    if (navKey === "products") {
      if (fetchProducts) fetchProducts();
    }
    api.audit.logPageView(`Admin Panel: ${navTitle}`, `#/admin?tab=${navKey}`);
  };

  // Fetch product history
  const fetchCreationHistory = async () => {
    try {
      const data = await api.products.getHistory();
      if (Array.isArray(data)) setCreationHistory(data);
    } catch (error) {
      console.warn("Failed to load product history:", error);
    }
  };

  // Fetch audit logs
  const fetchAuditLogs = async () => {
    setAuditLoading(true);
    try {
      const logs = await api.audit.getLogs({
        search: auditSearchQuery,
        action: auditActionFilter,
        role: auditRoleFilter,
        limit: 150
      });
      if (Array.isArray(logs)) setAuditLogs(logs);

      const summary = await api.audit.getSummary();
      if (summary) setAuditSummary(summary);
    } catch (err) {
      console.warn("Failed to load audit logs:", err);
    } finally {
      setAuditLoading(false);
    }
  };

  // Fetch registered users
  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const users = await api.auth.getUsers();
      if (Array.isArray(users)) setUsersList(users);
    } catch (err) {
      console.warn("Failed to load users:", err);
    } finally {
      setUsersLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (currentUser?.role === "admin") {
      fetchCreationHistory();
      fetchAuditLogs();
      fetchUsers();
      if (fetchOrders) fetchOrders();
      if (fetchProducts) fetchProducts();
      api.audit.logPageView("Admin Dashboard", "#/admin");
    }
  }, [currentUser?.role]);

  // Refetch audit logs when filters change
  useEffect(() => {
    if (activeNav === "audit" && currentUser?.role === "admin") {
      fetchAuditLogs();
    }
  }, [auditActionFilter, auditRoleFilter]);

  // Security guard check
  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="container" style={{ paddingTop: "80px", textAlign: "center" }}>
        <div className="glass-card" style={{ padding: "48px", maxWidth: "500px", margin: "0 auto" }}>
          <AlertTriangle size={48} style={{ color: "#eab308", marginBottom: "16px" }} />
          <h2>Access Prohibited</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "8px" }}>
            The admin operations dashboard is strictly reserved for authenticated administrators with active 2FA sessions.
          </p>
          <a
            href="#/account"
            onClick={() => setCurrentTab && setCurrentTab("account")}
            className="btn btn-primary"
            style={{ marginTop: "20px" }}
          >
            Go to Admin Login
          </a>
        </div>
      </div>
    );
  }

  // Calculate high level stats
  const totalSales = orders
    .filter((o) => o.status !== "Cancelled" && o.status !== "Pending Inquiry")
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const pendingOrders = orders.filter((o) => o.status === "Processing" || o.status === "Pending Inquiry").length;
  const lowStockItems = products.filter((p) => p.stock <= 2).length;

  // Order status change handler
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.orders.updateStatus(orderId, newStatus);
      if (fetchOrders) await fetchOrders();
      fetchAuditLogs();
    } catch (err) {
      alert("Failed to update status on server: " + err.message);
    }
  };

  // Approve B2B partner handler
  const handleApproveB2B = async (userId) => {
    try {
      await api.auth.approveB2B(userId);
      fetchUsers();
      fetchAuditLogs();
      alert("B2B Wholesale Partner account approved successfully!");
    } catch (err) {
      alert("Failed to approve B2B user: " + err.message);
    }
  };

  // Create Product handler
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!formImageUrl) {
      alert("Please upload a saree photograph before adding this product.");
      return;
    }
    setFormSubmitting(true);
    const productData = {
      sku: formSku || "SS-GW-SLK-" + Math.floor(Math.random() * 10000),
      name: formName,
      price: Number(formPrice),
      stock: Number(formStock),
      weave: formWeave,
      fabric: formFabric,
      color: formColor,
      occasion: formOccasion,
      description: formDesc || "Premium handloom Gadwal saree.",
      care: formCare || "Dry Clean Recommended.",
      length: "6.3 Meters (5.5m Saree + 0.8m Running Blouse)",
      weight: "550 grams",
      image: formImageUrl,
      category: "Sarees",
      discount: 0
    };

    try {
      const created = await api.products.create(productData);
      const productWithId = {
        ...productData,
        id: created?.id || "ss-" + Math.floor(Math.random() * 10000),
        image: created?.image || formImageUrl
      };

      if (setProducts) {
        setProducts((prev) => {
          const updated = [productWithId, ...(prev || []).filter(p => p.id !== productWithId.id)];
          try {
            localStorage.setItem("ss_products_cache", JSON.stringify(updated));
          } catch {}
          return updated;
        });
      }

      if (fetchProducts) await fetchProducts();
      await fetchCreationHistory();
      fetchAuditLogs();
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      alert("Failed to create product: " + err.message);
    } finally {
      setFormSubmitting(false);
    }
  };

  // Update Product handler
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setFormSubmitting(true);
    const updateData = {
      name: formName,
      price: Number(formPrice),
      stock: Number(formStock),
      weave: formWeave,
      fabric: formFabric,
      color: formColor,
      occasion: formOccasion,
      description: formDesc,
      care: formCare,
      image: formImageUrl || selectedProduct.image
    };

    try {
      const updated = await api.products.update(selectedProduct.id, updateData);
      if (setProducts) {
        setProducts((prev) => {
          const updatedList = (prev || []).map((p) =>
            p.id === selectedProduct.id ? { ...p, ...updateData, ...(updated || {}) } : p
          );
          try {
            localStorage.setItem("ss_products_cache", JSON.stringify(updatedList));
          } catch {}
          return updatedList;
        });
      }

      if (fetchProducts) await fetchProducts();
      await fetchCreationHistory();
      fetchAuditLogs();
      setShowEditModal(false);
      setSelectedProduct(null);
      resetForm();
    } catch (err) {
      alert("Failed to update product: " + err.message);
    } finally {
      setFormSubmitting(false);
    }
  };

  // Delete Product handler
  const handleDeleteProduct = async (productId, productName) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${productName}"?`)) return;
    try {
      await api.products.delete(productId);
      if (setProducts) {
        setProducts((prev) => {
          const filtered = (prev || []).filter((p) => p.id !== productId);
          try {
            localStorage.setItem("ss_products_cache", JSON.stringify(filtered));
          } catch {}
          return filtered;
        });
      }
      if (fetchProducts) await fetchProducts();
      await fetchCreationHistory();
      fetchAuditLogs();
    } catch (err) {
      alert("Failed to delete product: " + err.message);
    }
  };

  const openEditModal = (prod) => {
    setSelectedProduct(prod);
    setFormName(prod.name);
    setFormSku(prod.sku);
    setFormPrice(prod.price);
    setFormStock(prod.stock);
    setFormWeave(prod.weave || "Gadwal Semi Silk");
    setFormFabric(prod.fabric || "Semi Silk");
    setFormColor(prod.color || "Maroon");
    setFormOccasion(prod.occasion || "Festive Wear");
    setFormDesc(prod.description || "");
    setFormCare(prod.care || "Dry Clean Recommended.");
    setFormImageUrl(prod.image || "");
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormName("");
    setFormSku("");
    setFormPrice(2999);
    setFormStock(5);
    setFormDesc("");
    setFormImageUrl("");
  };

  // Filtered lists
  const filteredOrders = orders.filter((o) => {
    const q = orderSearchQuery.toLowerCase();
    return (
      (o.id && o.id.toLowerCase().includes(q)) ||
      (o.customer_name && o.customer_name.toLowerCase().includes(q)) ||
      (o.email && o.email.toLowerCase().includes(q))
    );
  });

  const filteredProducts = products.filter((p) => {
    const q = productSearchQuery.toLowerCase();
    return (
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.sku && p.sku.toLowerCase().includes(q)) ||
      (p.weave && p.weave.toLowerCase().includes(q)) ||
      (p.color && p.color.toLowerCase().includes(q))
    );
  });

  return (
    <div className="container" style={{ paddingTop: "30px", marginBottom: "80px" }}>
      
      {/* Admin Panel Header Banner */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "16px",
        marginBottom: "28px",
        padding: "24px 32px",
        backgroundColor: "var(--primary-maroon)",
        color: "var(--bg-cream)",
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--shadow-md)"
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h1 style={{ color: "var(--accent-gold)", fontSize: "26px", margin: 0 }}>
              Store Operations Dashboard
            </h1>
            <span className="badge" style={{ backgroundColor: "rgba(212,175,55,0.2)", color: "var(--accent-gold)", border: "1px solid var(--accent-gold)" }}>
              <Shield size={12} style={{ marginRight: "4px" }} /> 2FA Verified
            </span>
          </div>
          <p style={{ fontSize: "13px", opacity: 0.85, marginTop: "4px" }}>
            Logged in as <strong>{currentUser.name}</strong> ({currentUser.email}) • Real-time PostgreSQL Backend
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button
            onClick={handleRefreshAll}
            disabled={refreshing}
            className="btn btn-outline"
            style={{
              borderColor: "rgba(255,255,255,0.3)",
              color: "var(--bg-cream)",
              padding: "8px 16px",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              opacity: refreshing ? 0.7 : 1,
              cursor: refreshing ? "wait" : "pointer"
            }}
          >
            <RefreshCw size={14} className={refreshing ? "spin-animation" : ""} />
            {refreshing ? "Refreshing..." : "Refresh Data"}
          </button>
          <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="btn btn-gold"
            style={{ padding: "8px 18px", fontSize: "13px", fontWeight: "700" }}
          >
            <Plus size={16} /> Add New Saree
          </button>
        </div>
      </div>

      {/* Main Admin Two-Column Layout (Sidebar + Content) */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "240px 1fr",
        gap: "28px"
      }} className="admin-grid-layout">
        
        {/* --- SLEEK ADMIN SIDEBAR --- */}
        <aside style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div className="glass-card" style={{ padding: "16px 12px", display: "flex", flexDirection: "column", gap: "6px" }}>
            
            <button
              onClick={() => handleNavChange("dashboard", "Overview")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 16px",
                borderRadius: "var(--radius-sm)",
                border: "none",
                background: activeNav === "dashboard" ? "var(--primary-maroon)" : "transparent",
                color: activeNav === "dashboard" ? "var(--bg-cream)" : "var(--text-dark)",
                fontWeight: activeNav === "dashboard" ? "700" : "500",
                cursor: "pointer",
                textAlign: "left",
                fontSize: "14px",
                transition: "all 0.15s ease"
              }}
            >
              <TrendingUp size={18} style={{ color: activeNav === "dashboard" ? "var(--accent-gold)" : "inherit" }} />
              Overview & KPIs
            </button>

            <button
              onClick={() => handleNavChange("products", "Products Catalog")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 16px",
                borderRadius: "var(--radius-sm)",
                border: "none",
                background: activeNav === "products" ? "var(--primary-maroon)" : "transparent",
                color: activeNav === "products" ? "var(--bg-cream)" : "var(--text-dark)",
                fontWeight: activeNav === "products" ? "700" : "500",
                cursor: "pointer",
                textAlign: "left",
                fontSize: "14px",
                transition: "all 0.15s ease"
              }}
            >
              <ShoppingBag size={18} style={{ color: activeNav === "products" ? "var(--accent-gold)" : "inherit" }} />
              Saree Catalog ({products.length})
            </button>

            <button
              onClick={() => handleNavChange("orders", "Orders Management")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 16px",
                borderRadius: "var(--radius-sm)",
                border: "none",
                background: activeNav === "orders" ? "var(--primary-maroon)" : "transparent",
                color: activeNav === "orders" ? "var(--bg-cream)" : "var(--text-dark)",
                fontWeight: activeNav === "orders" ? "700" : "500",
                cursor: "pointer",
                textAlign: "left",
                fontSize: "14px",
                transition: "all 0.15s ease"
              }}
            >
              <ClipboardList size={18} style={{ color: activeNav === "orders" ? "var(--accent-gold)" : "inherit" }} />
              Orders ({orders.length})
              {pendingOrders > 0 && (
                <span style={{
                  marginLeft: "auto",
                  backgroundColor: "#dc2626",
                  color: "#fff",
                  fontSize: "11px",
                  padding: "2px 6px",
                  borderRadius: "10px",
                  fontWeight: "700"
                }}>
                  {pendingOrders}
                </span>
              )}
            </button>

            <button
              onClick={() => handleNavChange("users", "Users & B2B Approvals")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 16px",
                borderRadius: "var(--radius-sm)",
                border: "none",
                background: activeNav === "users" ? "var(--primary-maroon)" : "transparent",
                color: activeNav === "users" ? "var(--bg-cream)" : "var(--text-dark)",
                fontWeight: activeNav === "users" ? "700" : "500",
                cursor: "pointer",
                textAlign: "left",
                fontSize: "14px",
                transition: "all 0.15s ease"
              }}
            >
              <Users size={18} style={{ color: activeNav === "users" ? "var(--accent-gold)" : "inherit" }} />
              Users & B2B ({usersList.length})
            </button>

            <button
              onClick={() => handleNavChange("audit", "Audit & Security Logs")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 16px",
                borderRadius: "var(--radius-sm)",
                border: "none",
                background: activeNav === "audit" ? "var(--primary-maroon)" : "transparent",
                color: activeNav === "audit" ? "var(--bg-cream)" : "var(--text-dark)",
                fontWeight: activeNav === "audit" ? "700" : "500",
                cursor: "pointer",
                textAlign: "left",
                fontSize: "14px",
                transition: "all 0.15s ease"
              }}
            >
              <Activity size={18} style={{ color: activeNav === "audit" ? "var(--accent-gold)" : "inherit" }} />
              Audit Logs
            </button>

            <button
              onClick={() => handleNavChange("history", "Product History")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 16px",
                borderRadius: "var(--radius-sm)",
                border: "none",
                background: activeNav === "history" ? "var(--primary-maroon)" : "transparent",
                color: activeNav === "history" ? "var(--bg-cream)" : "var(--text-dark)",
                fontWeight: activeNav === "history" ? "700" : "500",
                cursor: "pointer",
                textAlign: "left",
                fontSize: "14px",
                transition: "all 0.15s ease"
              }}
            >
              <History size={18} style={{ color: activeNav === "history" ? "var(--accent-gold)" : "inherit" }} />
              Catalog History
            </button>

          </div>

          {/* Quick System Status Card */}
          <div className="glass-card" style={{ padding: "16px", fontSize: "12px", color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#16a34a", fontWeight: "700" }}>
              <CheckCircle size={14} /> Database: PostgreSQL
            </div>
            <div>Database: <code>sssilksarees</code></div>
            <div>Auth: <code>JWT + HTTP-Only Cookie</code></div>
            <div>MFA: <code>TOTP Authenticator</code></div>
          </div>
        </aside>

        {/* --- MAIN CONTENT AREA --- */}
        <main style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeNav === "dashboard" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              {/* Stat Cards */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                gap: "20px"
              }}>
                <div className="glass-card" style={{ padding: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <span style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "700" }}>Total Revenue</span>
                      <h3 style={{ fontSize: "28px", color: "var(--primary-maroon)", marginTop: "4px" }}>
                        ₹{totalSales.toLocaleString("en-IN")}
                      </h3>
                    </div>
                    <div style={{ padding: "10px", borderRadius: "50%", backgroundColor: "rgba(212,175,55,0.15)", color: "var(--accent-gold-hover)" }}>
                      <TrendingUp size={22} />
                    </div>
                  </div>
                  <span style={{ fontSize: "12px", color: "#16a34a", marginTop: "8px", display: "block" }}>
                    Across {orders.length} orders
                  </span>
                </div>

                <div className="glass-card" style={{ padding: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <span style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "700" }}>Pending Fulfillment</span>
                      <h3 style={{ fontSize: "28px", color: pendingOrders > 0 ? "#dc2626" : "var(--primary-maroon)", marginTop: "4px" }}>
                        {pendingOrders}
                      </h3>
                    </div>
                    <div style={{ padding: "10px", borderRadius: "50%", backgroundColor: "rgba(220,38,38,0.1)", color: "#dc2626" }}>
                      <ClipboardList size={22} />
                    </div>
                  </div>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "8px", display: "block" }}>
                    Requires shipment & dispatch
                  </span>
                </div>

                <div className="glass-card" style={{ padding: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <span style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "700" }}>Active Products</span>
                      <h3 style={{ fontSize: "28px", color: "var(--primary-maroon)", marginTop: "4px" }}>
                        {products.length}
                      </h3>
                    </div>
                    <div style={{ padding: "10px", borderRadius: "50%", backgroundColor: "rgba(74,14,21,0.1)", color: "var(--primary-maroon)" }}>
                      <Package size={22} />
                    </div>
                  </div>
                  <span style={{ fontSize: "12px", color: lowStockItems > 0 ? "#ea580c" : "#16a34a", marginTop: "8px", display: "block" }}>
                    {lowStockItems > 0 ? `${lowStockItems} low stock items` : "All items well stocked"}
                  </span>
                </div>

                <div className="glass-card" style={{ padding: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <span style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "700" }}>Registered Users</span>
                      <h3 style={{ fontSize: "28px", color: "var(--primary-maroon)", marginTop: "4px" }}>
                        {usersList.length}
                      </h3>
                    </div>
                    <div style={{ padding: "10px", borderRadius: "50%", backgroundColor: "rgba(59,130,246,0.1)", color: "#2563eb" }}>
                      <Users size={22} />
                    </div>
                  </div>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "8px", display: "block" }}>
                    Customers & B2B partners
                  </span>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="glass-card" style={{ padding: "28px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <h3 style={{ fontSize: "20px" }}>Recent Orders</h3>
                  <button onClick={() => handleNavChange("orders", "Orders")} className="btn btn-text" style={{ fontSize: "13px" }}>
                    View All Orders <ArrowRight size={14} />
                  </button>
                </div>

                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid var(--border-light)", textAlign: "left", color: "var(--text-muted)" }}>
                        <th style={{ padding: "12px 16px" }}>Order ID</th>
                        <th style={{ padding: "12px 16px" }}>Customer</th>
                        <th style={{ padding: "12px 16px" }}>Total</th>
                        <th style={{ padding: "12px 16px" }}>Status</th>
                        <th style={{ padding: "12px 16px" }}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                          <td style={{ padding: "12px 16px", fontWeight: "700" }}>{order.id}</td>
                          <td style={{ padding: "12px 16px" }}>
                            <div>{order.customer_name}</div>
                            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{order.email}</div>
                          </td>
                          <td style={{ padding: "12px 16px", fontWeight: "700" }}>₹{(order.total || 0).toLocaleString("en-IN")}</td>
                          <td style={{ padding: "12px 16px" }}>
                            <span className="badge" style={{
                              backgroundColor: order.status === "Delivered" ? "#d1fae5" : order.status === "Shipped" ? "#dbeafe" : "#fef3c7",
                              color: order.status === "Delivered" ? "#065f46" : order.status === "Shipped" ? "#1e40af" : "#92400e"
                            }}>
                              {order.status}
                            </span>
                          </td>
                          <td style={{ padding: "12px 16px", color: "var(--text-muted)" }}>{order.date || "Recent"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS CATALOG */}
          {activeNav === "products" && (
            <div className="glass-card" style={{ padding: "28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
                <div>
                  <h3 style={{ fontSize: "20px" }}>Saree Inventory Catalog</h3>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>Manage pricing, weave specs, and stock levels.</p>
                </div>
                
                <div style={{ display: "flex", gap: "12px" }}>
                  <div style={{ position: "relative" }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Search sarees..."
                      value={productSearchQuery}
                      onChange={(e) => setProductSearchQuery(e.target.value)}
                      style={{ paddingLeft: "36px", width: "220px", fontSize: "13px" }}
                    />
                    <Search size={16} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                  </div>
                  <button onClick={() => { resetForm(); setShowAddModal(true); }} className="btn btn-primary" style={{ padding: "8px 16px", fontSize: "13px" }}>
                    <Plus size={14} /> Add Saree
                  </button>
                </div>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--border-light)", textAlign: "left", color: "var(--text-muted)" }}>
                      <th style={{ padding: "12px 16px" }}>Saree</th>
                      <th style={{ padding: "12px 16px" }}>SKU</th>
                      <th style={{ padding: "12px 16px" }}>Weave & Fabric</th>
                      <th style={{ padding: "12px 16px" }}>Price</th>
                      <th style={{ padding: "12px 16px" }}>Stock</th>
                      <th style={{ padding: "12px 16px", textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((p) => (
                      <tr key={p.id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <img
                              src={p.image}
                              alt={p.name}
                              style={{ width: "44px", height: "44px", objectFit: "cover", borderRadius: "6px", border: "1px solid var(--border-light)" }}
                            />
                            <div>
                              <div style={{ fontWeight: "700" }}>{p.name}</div>
                              <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{p.color} • {p.occasion}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "12px 16px" }}><code>{p.sku}</code></td>
                        <td style={{ padding: "12px 16px" }}>
                          <div>{p.weave}</div>
                          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{p.fabric}</div>
                        </td>
                        <td style={{ padding: "12px 16px", fontWeight: "700", color: "var(--primary-maroon)" }}>
                          ₹{p.price.toLocaleString("en-IN")}
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <span className="badge" style={{
                            backgroundColor: p.stock > 2 ? "#d1fae5" : p.stock > 0 ? "#fef3c7" : "#fee2e2",
                            color: p.stock > 2 ? "#065f46" : p.stock > 0 ? "#92400e" : "#991b1b"
                          }}>
                            {p.stock} in stock
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px", textAlign: "right" }}>
                          <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                            <button
                              onClick={() => openEditModal(p)}
                              className="btn btn-outline"
                              style={{ padding: "6px 10px", fontSize: "12px", minHeight: "auto" }}
                              title="Edit product"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              className="btn btn-outline"
                              style={{ padding: "6px 10px", fontSize: "12px", minHeight: "auto", color: "#dc2626", borderColor: "rgba(220,38,38,0.3)" }}
                              title="Delete product"
                            >
                              <Trash size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS MANAGEMENT */}
          {activeNav === "orders" && (
            <div className="glass-card" style={{ padding: "28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
                <div>
                  <h3 style={{ fontSize: "20px" }}>Customer & B2B Orders</h3>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>Manage order fulfillment and status transitions.</p>
                </div>

                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <div style={{ position: "relative" }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Search orders..."
                      value={orderSearchQuery}
                      onChange={(e) => setOrderSearchQuery(e.target.value)}
                      style={{ paddingLeft: "36px", width: "220px", fontSize: "13px" }}
                    />
                    <Search size={16} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                  </div>
                  <button 
                    onClick={() => { if (fetchOrders) fetchOrders(); }} 
                    className="btn btn-outline" 
                    style={{ padding: "8px 14px", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}
                    title="Reload latest customer orders"
                  >
                    <RefreshCw size={14} /> Refresh
                  </button>
                </div>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--border-light)", textAlign: "left", color: "var(--text-muted)" }}>
                      <th style={{ padding: "12px 16px" }}>Order ID</th>
                      <th style={{ padding: "12px 16px" }}>Customer & Delivery</th>
                      <th style={{ padding: "12px 16px" }}>Items</th>
                      <th style={{ padding: "12px 16px" }}>Total</th>
                      <th style={{ padding: "12px 16px" }}>Payment</th>
                      <th style={{ padding: "12px 16px" }}>Status Workflow</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
                          <ClipboardList size={36} style={{ margin: "0 auto 12px", color: "var(--accent-gold)", opacity: 0.8 }} />
                          <p style={{ fontWeight: "600", fontSize: "15px", margin: "0 0 6px" }}>No orders found</p>
                          <p style={{ fontSize: "13px", margin: 0 }}>Orders placed by customers will automatically show up here.</p>
                          <button onClick={() => { if (fetchOrders) fetchOrders(); }} className="btn btn-outline" style={{ marginTop: "14px", padding: "6px 16px", fontSize: "12px" }}>
                            <RefreshCw size={12} style={{ marginRight: "6px" }} /> Refresh Orders List
                          </button>
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr key={order.id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                          <td style={{ padding: "12px 16px", fontWeight: "700" }}>
                            <div>{order.id}</div>
                            <span className="badge" style={{ fontSize: "10px", backgroundColor: order.type === "B2B" ? "rgba(212,175,55,0.15)" : "rgba(0,0,0,0.05)" }}>
                              {order.type || "B2C"}
                            </span>
                          </td>
                          <td style={{ padding: "12px 16px" }}>
                            <div style={{ fontWeight: "600" }}>{order.customer_name}</div>
                            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{order.email}</div>
                            {Array.isArray(order.items) && order.items[0]?.deliveryAddress && (
                              <div style={{ fontSize: "11px", color: "var(--primary-maroon)", marginTop: "4px" }}>
                                📍 {order.items[0].deliveryAddress}
                              </div>
                            )}
                          </td>
                          <td style={{ padding: "12px 16px" }}>
                            <div style={{ fontSize: "12px" }}>
                              {Array.isArray(order.items) && order.items.map((it, idx) => (
                                <div key={idx}>{it.productName || it.name} × {it.quantity}</div>
                              ))}
                            </div>
                          </td>
                          <td style={{ padding: "12px 16px", fontWeight: "700" }}>₹{(order.total || 0).toLocaleString("en-IN")}</td>
                          <td style={{ padding: "12px 16px" }}>
                            <span className="badge" style={{
                              backgroundColor: order.payment_status === "Paid" ? "#d1fae5" : order.payment_status?.includes("COD") ? "#fef3c7" : "#fee2e2",
                              color: order.payment_status === "Paid" ? "#065f46" : order.payment_status?.includes("COD") ? "#92400e" : "#991b1b"
                            }}>
                              {order.payment_status}
                            </span>
                          </td>
                          <td style={{ padding: "12px 16px" }}>
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              className="form-input"
                              style={{ padding: "6px 10px", fontSize: "13px", cursor: "pointer", width: "140px" }}
                            >
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: USERS & B2B APPROVALS */}
          {activeNav === "users" && (
            <div className="glass-card" style={{ padding: "28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <div>
                  <h3 style={{ fontSize: "20px" }}>Registered Users & B2B Accounts</h3>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                    Review customer registrations and approve wholesale B2B partner applications.
                  </p>
                </div>
                <button onClick={fetchUsers} className="btn btn-outline" style={{ padding: "6px 14px", fontSize: "12px" }}>
                  <RefreshCw size={12} /> Refresh Users
                </button>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--border-light)", textAlign: "left", color: "var(--text-muted)" }}>
                      <th style={{ padding: "12px 16px" }}>User Name</th>
                      <th style={{ padding: "12px 16px" }}>Email Address</th>
                      <th style={{ padding: "12px 16px" }}>Role</th>
                      <th style={{ padding: "12px 16px" }}>Phone</th>
                      <th style={{ padding: "12px 16px" }}>B2B Status</th>
                      <th style={{ padding: "12px 16px", textAlign: "right" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map((u) => (
                      <tr key={u.id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                        <td style={{ padding: "12px 16px", fontWeight: "700" }}>{u.name}</td>
                        <td style={{ padding: "12px 16px" }}>{u.email}</td>
                        <td style={{ padding: "12px 16px" }}>
                          <span className="badge" style={{
                            backgroundColor: u.role === "admin" ? "#fef3c7" : u.role === "b2b" ? "#e0e7ff" : "#f1f5f9",
                            color: u.role === "admin" ? "#92400e" : u.role === "b2b" ? "#3730a3" : "#475569"
                          }}>
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px", color: "var(--text-muted)" }}>{u.phone || "—"}</td>
                        <td style={{ padding: "12px 16px" }}>
                          {u.role === "b2b" ? (
                            u.b2b_approved ? (
                              <span className="badge" style={{ backgroundColor: "#d1fae5", color: "#065f46" }}>
                                <Check size={12} style={{ marginRight: "4px" }} /> Approved Partner
                              </span>
                            ) : (
                              <span className="badge" style={{ backgroundColor: "#fee2e2", color: "#991b1b" }}>
                                Pending Review
                              </span>
                            )
                          ) : (
                            <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>N/A</span>
                          )}
                        </td>
                        <td style={{ padding: "12px 16px", textAlign: "right" }}>
                          {u.role === "b2b" && !u.b2b_approved && (
                            <button
                              onClick={() => handleApproveB2B(u.id)}
                              className="btn btn-gold"
                              style={{ padding: "6px 12px", fontSize: "12px", fontWeight: "700" }}
                            >
                              Approve Wholesale
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: APPLICATION & SECURITY AUDIT LOGS */}
          {activeNav === "audit" && (
            <div className="glass-card" style={{ padding: "28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
                <div>
                  <h3 style={{ fontSize: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <Shield size={20} style={{ color: "var(--accent-gold)" }} /> Application & Security Audit Log
                  </h3>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
                    Full audit trail tracking user creation, admin logins with MFA, page navigation, and catalog changes based on IP and Device.
                  </p>
                </div>

                <button
                  onClick={fetchAuditLogs}
                  disabled={auditLoading}
                  className="btn btn-outline"
                  style={{ padding: "8px 16px", fontSize: "13px" }}
                >
                  <RefreshCw size={14} className={auditLoading ? "spin" : ""} /> {auditLoading ? "Refreshing..." : "Refresh Logs"}
                </button>
              </div>

              {/* Audit Summary KPIs */}
              {auditSummary && (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "16px",
                  marginBottom: "24px"
                }}>
                  <div style={{ padding: "16px", backgroundColor: "rgba(0,0,0,0.02)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-light)" }}>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "700" }}>Total Audit Events</span>
                    <h4 style={{ fontSize: "22px", color: "var(--primary-maroon)", marginTop: "4px" }}>{auditSummary.total_events}</h4>
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "rgba(0,0,0,0.02)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-light)" }}>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "700" }}>Admin 2FA Logins</span>
                    <h4 style={{ fontSize: "22px", color: "#16a34a", marginTop: "4px" }}>{auditSummary.admin_logins}</h4>
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "rgba(0,0,0,0.02)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-light)" }}>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "700" }}>Unique Client IPs</span>
                    <h4 style={{ fontSize: "22px", color: "#2563eb", marginTop: "4px" }}>{auditSummary.unique_ips}</h4>
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "rgba(0,0,0,0.02)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-light)" }}>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "700" }}>User Signups</span>
                    <h4 style={{ fontSize: "22px", color: "var(--accent-gold-hover)", marginTop: "4px" }}>{auditSummary.user_signups}</h4>
                  </div>
                </div>
              )}

              {/* Filters Bar */}
              <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                marginBottom: "20px",
                alignItems: "center"
              }}>
                <div style={{ position: "relative", flex: "1 1 200px" }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Search by user, IP, action, resource..."
                    value={auditSearchQuery}
                    onChange={(e) => setAuditSearchQuery(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") fetchAuditLogs(); }}
                    style={{ paddingLeft: "36px", fontSize: "13px" }}
                  />
                  <Search size={16} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                </div>

                <select
                  className="form-input"
                  value={auditActionFilter}
                  onChange={(e) => setAuditActionFilter(e.target.value)}
                  style={{ width: "180px", fontSize: "13px" }}
                >
                  <option value="">All Actions</option>
                  <option value="LOGIN">Logins & 2FA</option>
                  <option value="REGISTER">Registrations</option>
                  <option value="PRODUCT">Product Modifications</option>
                  <option value="ORDER">Orders Placed/Updated</option>
                  <option value="PAGE">Admin Navigation</option>
                  <option value="B2B">B2B Approvals</option>
                </select>

                <select
                  className="form-input"
                  value={auditRoleFilter}
                  onChange={(e) => setAuditRoleFilter(e.target.value)}
                  style={{ width: "150px", fontSize: "13px" }}
                >
                  <option value="">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="customer">Customer</option>
                  <option value="b2b">B2B</option>
                </select>

                <button
                  onClick={fetchAuditLogs}
                  className="btn btn-primary"
                  style={{ padding: "8px 16px", fontSize: "13px" }}
                >
                  Apply Filters
                </button>
              </div>

              {/* Audit Table */}
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--border-light)", textAlign: "left", color: "var(--text-muted)" }}>
                      <th style={{ padding: "10px 14px" }}>Timestamp</th>
                      <th style={{ padding: "10px 14px" }}>User & Identity</th>
                      <th style={{ padding: "10px 14px" }}>Action</th>
                      <th style={{ padding: "10px 14px" }}>Resource / Page</th>
                      <th style={{ padding: "10px 14px" }}>Client IP</th>
                      <th style={{ padding: "10px 14px" }}>Device / Browser</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)" }}>
                          No audit events found matching the criteria.
                        </td>
                      </tr>
                    ) : (
                      auditLogs.map((log) => {
                        const isLogin = log.action.includes("LOGIN") || log.action.includes("MFA");
                        const isProduct = log.action.includes("PRODUCT");
                        const isOrder = log.action.includes("ORDER");
                        const isNav = log.action.includes("PAGE");
                        const isB2B = log.action.includes("B2B");

                        return (
                          <tr key={log.id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                            <td style={{ padding: "10px 14px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                              {new Date(log.created_at).toLocaleString()}
                            </td>
                            <td style={{ padding: "10px 14px" }}>
                              <div style={{ fontWeight: "700" }}>{log.user_name || "Guest / Anonymous"}</div>
                              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{log.user_email}</div>
                              {log.user_role && (
                                <span className="badge" style={{
                                  fontSize: "10px",
                                  marginTop: "2px",
                                  backgroundColor: log.user_role === "admin" ? "#fef3c7" : "#f1f5f9",
                                  color: log.user_role === "admin" ? "#92400e" : "#475569"
                                }}>
                                  {log.user_role}
                                </span>
                              )}
                            </td>
                            <td style={{ padding: "10px 14px" }}>
                              <span className="badge" style={{
                                backgroundColor: isLogin ? "#dcfce7" : isProduct ? "#f3e8ff" : isOrder ? "#dbeafe" : isB2B ? "#fef3c7" : "#f1f5f9",
                                color: isLogin ? "#15803d" : isProduct ? "#7e22ce" : isOrder ? "#1d4ed8" : isB2B ? "#b45309" : "#475569",
                                fontWeight: "700",
                                fontSize: "11px"
                              }}>
                                {log.action}
                              </span>
                            </td>
                            <td style={{ padding: "10px 14px", maxWidth: "200px", wordBreak: "break-word" }}>
                              {log.resource}
                            </td>
                            <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                              <code style={{
                                backgroundColor: "rgba(0,0,0,0.05)",
                                padding: "2px 6px",
                                borderRadius: "4px",
                                fontSize: "12px",
                                color: "var(--primary-maroon)"
                              }}>
                                {log.ip_address || "127.0.0.1"}
                              </code>
                            </td>
                            <td style={{ padding: "10px 14px", whiteSpace: "nowrap", color: "var(--text-muted)", fontSize: "12px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <Monitor size={14} /> {log.device || "Unknown Browser"}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: CATALOG HISTORY */}
          {activeNav === "history" && (
            <div className="glass-card" style={{ padding: "28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <div>
                  <h3 style={{ fontSize: "20px" }}>Saree Product History Log</h3>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>Audit trail of saree additions, modifications, and deletions.</p>
                </div>
                <button onClick={fetchCreationHistory} className="btn btn-outline" style={{ padding: "6px 14px", fontSize: "12px" }}>
                  <RefreshCw size={12} /> Refresh
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {creationHistory.length === 0 ? (
                  <p style={{ color: "var(--text-muted)", padding: "20px 0" }}>No product history entries recorded yet.</p>
                ) : (
                  creationHistory.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "14px 18px",
                        border: "1px solid var(--border-light)",
                        borderRadius: "var(--radius-sm)",
                        backgroundColor: "rgba(0,0,0,0.01)"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span className="badge" style={{
                          backgroundColor: item.action === "Created" ? "#d1fae5" : item.action === "Updated" ? "#dbeafe" : "#fee2e2",
                          color: item.action === "Created" ? "#065f46" : item.action === "Updated" ? "#1e40af" : "#991b1b"
                        }}>
                          {item.action}
                        </span>
                        <div>
                          <strong style={{ fontSize: "14px" }}>{item.product_name}</strong>
                          <span style={{ fontSize: "12px", color: "var(--text-muted)", display: "block" }}>
                            Product ID: <code>{item.product_id}</code>
                          </span>
                        </div>
                      </div>
                      <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                        {new Date(item.created_at).toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* --- ADD PRODUCT MODAL --- */}
      {showAddModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "20px",
          backdropFilter: "blur(4px)"
        }}>
          <div className="glass-card" style={{
            maxWidth: "600px",
            width: "100%",
            maxHeight: "90vh",
            overflowY: "auto",
            padding: "32px",
            backgroundColor: "var(--bg-white)",
            borderRadius: "var(--radius-md)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "20px", color: "var(--primary-maroon)" }}>Add Saree to Catalog</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <ImageDropzone onImageUploaded={(url) => setFormImageUrl(url)} currentImage={formImageUrl} />

              <div className="form-group">
                <label className="form-label">Saree Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Classic Crimson Gadwal Semi Silk Saree"
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-group">
                  <label className="form-label">SKU</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    placeholder="e.g. SS-GW-SLK-010"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Retail Price (₹) *</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-group">
                  <label className="form-label">Stock Units *</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Color *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formColor}
                    onChange={(e) => setFormColor(e.target.value)}
                    placeholder="e.g. Maroon, Emerald Green"
                    required
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-group">
                  <label className="form-label">Weave Category</label>
                  <select className="form-input" value={formWeave} onChange={(e) => setFormWeave(e.target.value)}>
                    <option value="Gadwal Semi Silk">Gadwal Semi Silk</option>
                    <option value="Gadwal Semi Cicco">Gadwal Semi Cicco</option>
                    <option value="Kanchipuram Style">Kanchipuram Style</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Occasion</label>
                  <select className="form-input" value={formOccasion} onChange={(e) => setFormOccasion(e.target.value)}>
                    <option value="Festive Wear">Festive Wear</option>
                    <option value="Wedding Wear">Wedding Wear</option>
                    <option value="Daily Wear">Daily Wear</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Detailed craftsmanship and zari join details..."
                />
              </div>

              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "12px" }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" disabled={formSubmitting} className="btn btn-primary">
                  {formSubmitting ? "Saving..." : "Add to Catalog"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT PRODUCT MODAL --- */}
      {showEditModal && selectedProduct && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "20px",
          backdropFilter: "blur(4px)"
        }}>
          <div className="glass-card" style={{
            maxWidth: "600px",
            width: "100%",
            maxHeight: "90vh",
            overflowY: "auto",
            padding: "32px",
            backgroundColor: "var(--bg-white)",
            borderRadius: "var(--radius-md)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "20px", color: "var(--primary-maroon)" }}>Edit Saree: {selectedProduct.name}</h3>
              <button onClick={() => setShowEditModal(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <ImageDropzone onImageUploaded={(url) => setFormImageUrl(url)} currentImage={formImageUrl} />

              <div className="form-group">
                <label className="form-label">Saree Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-group">
                  <label className="form-label">Retail Price (₹) *</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock Units *</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-group">
                  <label className="form-label">Weave Category</label>
                  <select className="form-input" value={formWeave} onChange={(e) => setFormWeave(e.target.value)}>
                    <option value="Gadwal Semi Silk">Gadwal Semi Silk</option>
                    <option value="Gadwal Semi Cicco">Gadwal Semi Cicco</option>
                    <option value="Kanchipuram Style">Kanchipuram Style</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Color</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formColor}
                    onChange={(e) => setFormColor(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "12px" }}>
                <button type="button" onClick={() => setShowEditModal(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" disabled={formSubmitting} className="btn btn-primary">
                  {formSubmitting ? "Updating..." : "Save Modifications"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
        @media (max-width: 900px) {
          .admin-grid-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
