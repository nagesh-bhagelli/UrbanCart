import axios from "axios";
// In production (served from preview) the vite dev proxy is not available.
// Use an absolute URL pointing to the backend on the host so the browser
// can reach the API when the frontend is served from a different container.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api",
});

export async function fetchProducts(params) {
  const res = await api.get("/products", { params });
  return res.data.data;
}

export async function fetchProduct(sku) {
  const res = await api.get(`/products/${sku}`);
  return res.data.data;
}

export async function createProduct(payload) {
  // Use admin endpoint
  const res = await api.post("/admin/products", payload, {
    headers: { "x-user-role": "admin" } // In a real app, use auth token
  });
  return res.data.data;
}

export async function updateProduct(sku, payload) {
  const res = await api.patch(`/admin/products/${sku}`, payload, {
    headers: { "x-user-role": "admin" }
  });
  return res.data.data;
}

export async function deleteProduct(sku) {
  const res = await api.delete(`/admin/products/${sku}`, {
    headers: { "x-user-role": "admin" }
  });
  return res.data.data;
}

export async function placeOrder(payload) {
  const res = await api.post("/orders", payload);
  return res.data.data;
}

export async function fetchMyOrders(userId) {
  const res = await api.get("/orders/my-orders", {
    headers: { "x-user-id": userId }
  });
  return res.data.data;
}
