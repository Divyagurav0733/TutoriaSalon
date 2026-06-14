import axios from "axios";
 
const BASE_URL = import.meta.env.VITE_API_URL || "/api";
 
const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});
 
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("tutoria_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
 
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status  = err.response?.status;
    const message = err.response?.data?.message || err.message || "Something went wrong";
    if (status === 401) {
      localStorage.removeItem("tutoria_user");
      localStorage.removeItem("tutoria_token");
    }
    return Promise.reject(new Error(message));
  }
);
 
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login:    (data) => api.post("/auth/login",    data),
  getMe:    ()     => api.get("/auth/me"),
};
 
export const stylistAPI = {
  getAll: ()   => api.get("/stylists"),
  getOne: (id) => api.get(`/stylists/${id}`),
};
 
export const bookingAPI = {
  getSlots: (stylistId, date, duration) =>
    api.get(`/bookings/slots?stylistId=${stylistId}&date=${date}&duration=${duration}`),
  create: (data) => api.post("/bookings",           data),
  getMy:  ()     => api.get("/bookings/my"),
  cancel: (id)   => api.put(`/bookings/${id}/cancel`),
};
 
export const adminAPI = {
  getStats:      ()         => api.get("/admin/stats"),
  getBookings:   (params)   => api.get("/admin/bookings", { params }),
  editBooking:   (id, data) => api.put(`/admin/bookings/${id}`, data),
  cancelBooking: (id, data) => api.delete(`/admin/bookings/${id}/cancel`, { data }),
  notify:        (data)     => api.post("/admin/notify",  data),
  getAnalytics:  ()         => api.get("/admin/analytics"),
};
 
export const publicAPI = {
  getCharts: () => api.get("/public/charts"),
};
 
export default api;
 