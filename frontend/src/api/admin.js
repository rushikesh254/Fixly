import api from "./axios";

export const getAdminStats = () => api.get("/admin/stats");

export const getAdminUsers = () => api.get("/admin/users");

export const updateUserStatus = (id, status) =>
  api.put(`/admin/users/${id}/status`, { status });

export const getAdminProviders = () => api.get("/admin/providers");

export const updateProviderStatus = (id, status) =>
  api.put(`/admin/providers/${id}/status`, { status });

export const getAdminBookings = () => api.get("/admin/bookings");
