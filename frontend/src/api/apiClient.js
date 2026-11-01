const API_BASE = import.meta.env.VITE_API_URL || (
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:8000/api"
    : "/api"
);

/**
 * Standard fetch wrapper with cookie credentials and error extraction.
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  // Don't set Content-Type for FormData (file uploads)
  if (options.body instanceof FormData) {
    delete defaultHeaders["Content-Type"];
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
    credentials: "include", // Crucial for HTTP-only JWT cookies
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.detail || data?.message || "An unexpected error occurred.";
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // --- AUTHENTICATION ---
  auth: {
    login: (credentials) =>
      request("/auth/login", { method: "POST", body: JSON.stringify(credentials) }),
    
    register: (userData) =>
      request("/auth/register", { method: "POST", body: JSON.stringify(userData) }),

    verifyMfa: (mfaData) =>
      request("/auth/mfa/verify", { method: "POST", body: JSON.stringify(mfaData) }),

    adminSetup: (setupData) =>
      request("/auth/admin/setup", { method: "POST", body: JSON.stringify(setupData) }),

    getMe: () => request("/auth/me", { method: "GET" }),

    updateMe: (profileData) =>
      request("/auth/me", { method: "PUT", body: JSON.stringify(profileData) }),

    logout: () => request("/auth/logout", { method: "POST" }),

    getUsers: () => request("/auth/users", { method: "GET" }),

    approveB2B: (userId) =>
      request(`/auth/users/${userId}/approve-b2b`, { method: "PUT" }),
  },

  // --- PRODUCTS ---
  products: {
    getAll: () => request("/products", { method: "GET" }),
    getById: (id) => request(`/products/${id}`, { method: "GET" }),
    getHistory: () => request("/product-history", { method: "GET" }),
    create: (product) =>
      request("/products", { method: "POST", body: JSON.stringify(product) }),
    update: (id, product) =>
      request(`/products/${id}`, { method: "PUT", body: JSON.stringify(product) }),
    delete: (id) => request(`/products/${id}`, { method: "DELETE" }),
  },

  // --- ORDERS ---
  orders: {
    getAll: () => request("/orders", { method: "GET" }),
    getById: (id) => request(`/orders/${id}`, { method: "GET" }),
    create: (order) =>
      request("/orders", { method: "POST", body: JSON.stringify(order) }),
    updateStatus: (id, status) =>
      request(`/orders/${id}`, { method: "PUT", body: JSON.stringify({ status }) }),
  },

  // --- AUDIT & SECURITY LOGS ---
  audit: {
    getLogs: (params = {}) => {
      const query = new URLSearchParams();
      if (params.action) query.append("action", params.action);
      if (params.role) query.append("role", params.role);
      if (params.search) query.append("search", params.search);
      if (params.limit) query.append("limit", params.limit.toString());
      const qs = query.toString() ? `?${query.toString()}` : "";
      return request(`/audit-logs${qs}`, { method: "GET" });
    },
    getSummary: () => request("/audit-logs/summary", { method: "GET" }),
    logPageView: (pageName, path = "", details = {}) =>
      request("/audit-logs/page-view", {
        method: "POST",
        body: JSON.stringify({ page_name: pageName, path, details }),
      }).catch((e) => console.warn("Audit navigation log notice:", e)),
  },

  // --- UPLOADS ---
  uploads: {
    uploadImage: (formData) =>
      request("/uploads", { method: "POST", body: formData }),
  },

  // --- PAYMENTS ---
  payments: {
    createSession: (orderPayload) =>
      request("/payments/create-session", { method: "POST", body: JSON.stringify(orderPayload) }),
    confirm: (payload) =>
      request("/payments/confirm", { method: "POST", body: JSON.stringify(payload) }),
  },
};

export default api;

