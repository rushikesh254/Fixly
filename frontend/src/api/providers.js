import api from "./axios";

// public profile of an approved provider
export const getProviderById = (id) => api.get(`/providers/${id}`);

// business details of the signed in provider
export const getMyProviderProfile = () => api.get("/providers/me");

export const updateMyProviderProfile = (formData) =>
  api.put("/providers/me", formData);

export const getMyProviderReviews = () => api.get("/providers/me/reviews");
