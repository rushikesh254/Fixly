import api from "./axios";

export const getServiceReviews = (serviceId) => api.get(`/reviews/${serviceId}`);

export const createReview = (data) => api.post("/reviews", data);
