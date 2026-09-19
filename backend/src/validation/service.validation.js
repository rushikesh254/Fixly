import { z } from "zod";
import { booleanFromForm, stringArrayFromForm } from "./form.js";

export const createServiceSchema = z.object({
  name: z.string().trim().min(3, "Service name must be at least 3 characters"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(0, "Price cannot be negative"), // Coerce to number and validate
  duration: z.coerce.number().min(1).optional(),
  estimatedDuration: z.string().trim().optional(),
  category: z.string().min(1, "Category is required"),
  // optional, falls back to the provider's default saved address
  address: z.string().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  phoneNumber: z.string().optional(),
  includes: stringArrayFromForm.optional(),
  availableToday: booleanFromForm.optional(),
  instantBooking: booleanFromForm.optional(),
});

export const updateServiceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Service name must be at least 3 characters")
    .optional(),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price cannot be negative").optional(),
  duration: z.coerce.number().min(1).optional(),
  estimatedDuration: z.string().trim().optional(),
  category: z.string().optional(),
  address: z.string().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  includes: stringArrayFromForm.optional(),
  availableToday: booleanFromForm.optional(),
  instantBooking: booleanFromForm.optional(),
  // urls of the already uploaded images the provider wants to keep
  images: stringArrayFromForm.optional(),
});
