import api from "./axios";

export const createBooking = (data) => api.post("/bookings", data);

export const getMyBookings = () => api.get("/bookings/my-bookings");

export const updateBookingStatus = (bookingId, status) =>
  api.put(`/bookings/${bookingId}/status`, { status });

export const cancelBooking = (bookingId) =>
  api.put(`/bookings/${bookingId}/cancel`);
