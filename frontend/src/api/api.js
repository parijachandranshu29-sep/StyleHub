import api from "./axiosInstance";

// Auth
export const registerUser = d => api.post("/auth/register", d);
export const loginUser = d => api.post("/auth/login", d);

// Products
export const getProducts = () => api.get("/products");
export const getFeaturedProducts = () => api.get("/products/featured");
export const getProductsByGender = g => api.get(`/products/gender/${g}`);
export const getProductsByCategory = c => api.get(`/products/category/${c}`);
export const getProductById = id => api.get(`/products/${id}`);

// Orders
export const placeOrder = d => api.post("/orders", d);
export const verifyPayment = d => api.post("/orders/verify-payment", d);
export const getMyOrders = () => api.get("/orders/my");
export const getOrderById = id => api.get(`/orders/${id}`);

// Admin
export const adminGetProducts = () => api.get("/admin/products");
export const adminCreateProduct = d => api.post("/admin/products", d);
export const adminUpdateProduct = (id,d) => api.put(`/admin/products/${id}`, d);
export const adminDeleteProduct = id => api.delete(`/admin/products/${id}`);
export const adminGetOrders = () => api.get("/admin/orders");
export const adminUpdateOrderStatus = (id,d) => api.put(`/admin/orders/${id}/status`, d);
