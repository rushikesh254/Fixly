import { z } from "zod";

export const createServiceSchema = z.object({
  name: z.string().trim().min(3, "Service name must be at least 3 characters"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(0, "Price cannot be negative"), // Coerce to number and validate
  duration: z.coerce.number().min(1).default(60).optional(),
  category: z.string().min(1, "Category is required"),
  address: z.string().min(1, "Address is required"),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  phoneNumber: z.string().optional(),
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
  category: z.string().optional(),
  address: z.string().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
});
