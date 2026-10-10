const BASE_URL = "http://127.0.0.1:8000";

function getToken() {
  return localStorage.getItem("token");
}

async function request(path, options = {}) {
  const headers = options.headers || {};
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await res.json() : await res.text();

  if (!res.ok) {
    const message = typeof data === "object" && data.detail ? data.detail : String(data);
    throw new Error(message);
  }
  return data;
}

export const api = {
  register: (payload) => request("/api/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload) => request("/api/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  me: () => request("/api/users/me"),
  updateMe: (payload) => request("/api/users/me", { method: "PUT", body: JSON.stringify(payload) }),
  getUser: (id) => request(`/api/users/${id}`),
  uploadAvatar: (file) => {
    const form = new FormData();
    form.append("file", file);
    return request("/api/users/me/avatar", { method: "POST", body: form });
  },
  products: (category) => request(`/api/products${category ? `?category=${category}` : ""}`),
  searchProducts: (q) => request(`/api/products/search?q=${encodeURIComponent(q)}`),
  product: (id) => request(`/api/products/${id}`),
  reviews: (productId) => request(`/api/products/${productId}/reviews`),
  createReview: (payload) => request("/api/reviews", { method: "POST", body: JSON.stringify(payload) }),
  checkout: (payload) => request("/api/checkout", { method: "POST", body: JSON.stringify(payload) }),
  myOrders: () => request("/api/orders"),
  order: (id) => request(`/api/orders/${id}`),
  contact: (payload) => request("/api/contact", { method: "POST", body: JSON.stringify(payload) }),
  adminUsers: () => request("/api/admin/users"),
  adminStats: () => request("/api/admin/stats"),
  adminMessages: () => request("/api/admin/contact-messages"),
  BASE_URL,
};
