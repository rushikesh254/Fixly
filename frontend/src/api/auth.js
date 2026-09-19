import api from "./axios";

export const signup = (data) => api.post("/auth/signup", data);

export const login = (data) => api.post("/auth/login", data);

export const googleLogin = (tokenId) =>
  api.post("/auth/google-login", { tokenId });

export const logout = () => api.post("/auth/logout");

export const getMe = () => api.get("/auth/me");

export const forgotPassword = (email) =>
  api.post("/auth/forgot-password", { email });

export const resetPassword = (token, newPassword) =>
  api.post(`/auth/reset-password/${token}`, { newPassword });

export const resendVerification = (email) =>
  api.post("/auth/resend-verification", { email });

export const updateProfile = (formData) =>
  api.put("/auth/profile", formData);

export const changePassword = (data) =>
  api.put("/auth/change-password", data);