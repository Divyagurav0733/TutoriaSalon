import axios from "axios";

// In production (Vercel), VITE_API_URL must point to your Render backend URL.
// In development, Vite's proxy forwards "/api" to localhost:5000.
const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : "/api";

//  Axios instance 
const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// Attach JWT token from localStorage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("tutoria_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global response error handler
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status  = err.response?.status;
    const message = err.response?.data?.message || err.message || "Something went wrong";

    // If token is rejected by server, clear stale auth data
    if (status === 401) {
      localStorage.removeItem("tutoria_user");
      localStorage.removeItem("tutoria_token");
    }

    return Promise.reject(new Error(message));
  }
);

//  Auth 
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login:    (data) => api.post("/auth/login",    data),
  getMe:    ()     => api.get("/auth/me"),
};

//  Stylists 
export const stylistAPI = {
  getAll: ()    => api.get("/stylists"),
  getOne: (id)  => api.get(`/stylists/${id}`),
};

//  Bookings 
export const bookingAPI = {
  getSlots: (stylistId, date, duration) =>
    api.get(`/bookings/slots?stylistId=${stylistId}&date=${date}&duration=${duration}`),
  create:   (data) => api.post("/bookings",       data),
  getMy:    ()     => api.get("/bookings/my"),
  cancel:   (id)   => api.put(`/bookings/${id}/cancel`),
};

//  Admin 
export const adminAPI = {
  getStats:      ()           => api.get("/admin/stats"),
  getBookings:   (params)     => api.get("/admin/bookings", { params }),
  editBooking:   (id, data)   => api.put(`/admin/bookings/${id}`, data),
  cancelBooking: (id, data)   => api.delete(`/admin/bookings/${id}/cancel`, { data }),
  notify:        (data)       => api.post("/admin/notify",  data),
  getAnalytics:  ()           => api.get("/admin/analytics"),
};

export default api;
