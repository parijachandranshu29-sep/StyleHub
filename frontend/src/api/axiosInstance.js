import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" }
});
api.interceptors.request.use(c => {
  const t = localStorage.getItem("sh_token");
  if (t) c.headers.Authorization = `Bearer ${t}`;
  return c;
});
api.interceptors.response.use(r => r, e => {
  if (e.response?.status === 401) {
    localStorage.removeItem("sh_token");
    localStorage.removeItem("sh_user");
  }
  return Promise.reject(e);
});
export default api;
