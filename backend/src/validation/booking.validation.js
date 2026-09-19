import { z } from "zod";

export const createBookingSchema = z.object({
  serviceId: z.string().min(1, "Service is required"),
  bookingDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Booking date must be in YYYY-MM-DD format"),
  address: z.string().trim().min(1, "Address is required"),
  bookingTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Booking time must be in HH:mm format"),
  specialInstructions: z
    .string()
    .trim()
    .max(1000, "Instructions must be at most 1000 characters")
    .optional(),
});

export const updateBookingStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "completed", "cancelled", "rejected"], {
    message:
      "Status must be one of: pending, confirmed, completed, cancelled, rejected",
  }),
});
