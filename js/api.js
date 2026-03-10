const API_BASE = "http://localhost:8000/api";

async function apiRequest(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || "Request failed");
  }
  return res.json();
}

async function fetchProducts() { return apiRequest("/products"); }
async function fetchProduct(id) { return apiRequest(`/products/${id}`); }
async function fetchCategories() { return apiRequest("/categories"); }
async function signupApi(payload) { return apiRequest("/auth/signup", { method: "POST", body: JSON.stringify(payload) }); }
async function loginApi(payload) { return apiRequest("/auth/login", { method: "POST", body: JSON.stringify(payload) }); }
async function adminLoginApi(payload) { return apiRequest("/auth/admin", { method: "POST", body: JSON.stringify(payload) }); }
async function addReviewApi(productId, payload) { return apiRequest(`/products/${productId}/reviews`, { method: "POST", body: JSON.stringify(payload) }); }
async function createOrderApi(payload) { return apiRequest("/orders", { method: "POST", body: JSON.stringify(payload) }); }
async function fetchOrdersApi(userId) { const query = userId ? `?user_id=${encodeURIComponent(userId)}` : ""; return apiRequest(`/orders${query}`); }
async function fetchOrderApi(orderId) { return apiRequest(`/orders/${orderId}`); }
async function updateOrderStatusApi(orderId, status) { return apiRequest(`/orders/${orderId}/status`, { method: "PUT", body: JSON.stringify({ status }) }); }
async function deleteOrderApi(orderId) { return apiRequest(`/orders/${orderId}`, { method: "DELETE" }); }
async function addProductApi(payload) { return apiRequest("/products", { method: "POST", body: JSON.stringify(payload) }); }
async function updateProductApi(id, payload) { return apiRequest(`/products/${id}`, { method: "PUT", body: JSON.stringify(payload) }); }
async function deleteProductApi(id) { return apiRequest(`/products/${id}`, { method: "DELETE" }); }
async function fetchUsersApi() { return apiRequest("/users"); }

window.api = {
  fetchProducts,
  fetchProduct,
  fetchCategories,
  signupApi,
  loginApi,
  adminLoginApi,
  addReviewApi,
  createOrderApi,
  fetchOrdersApi,
  fetchOrderApi,
  updateOrderStatusApi,
  deleteOrderApi,
  addProductApi,
  updateProductApi,
  deleteProductApi,
  fetchUsersApi,
};
