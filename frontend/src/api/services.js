import api from "./axios";

// params: keyword, category, minPrice, maxPrice, lat, lng, distance, sort,
// provider, instantBooking, availableToday, minRating
export const getServices = (params) => api.get("/services", { params });

export const getServiceById = (id) => api.get(`/services/${id}`);

// services of the signed in provider, including those awaiting approval
export const getMyServices = () => api.get("/services/my-services");

export const createService = (formData) => api.post("/services", formData);

export const updateService = (id, formData) =>
  api.put(`/services/${id}`, formData);

export const deleteService = (id) => api.delete(`/services/${id}`);
