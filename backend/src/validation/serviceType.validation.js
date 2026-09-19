import { z } from "zod";

export const createServiceTypeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Service name must be at least 2 characters")
    .max(60, "Service name must be at most 60 characters"),
  category: z.string().min(1, "Category is required"),
});
