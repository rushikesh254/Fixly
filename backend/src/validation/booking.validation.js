import { z } from "zod";

export const createBookingSchema = z.object({
  serviceId: z.string().min(1, "Service is required"),
  bookingDate: z.string().min(1, "Booking date is required"),
  address: z.string().min(1, "Address is required"),
  bookingTime: z.string().min(1, "Booking time is required"),
});
