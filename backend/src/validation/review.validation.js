import { z } from "zod";

export const createReviewSchema = z.object({
  serviceId: z.string().min(1, "Service is required"),
  rating: z.coerce
    .number()
    .min(1, "Rating must be between 1 and 5")
    .max(5, "Rating must be between 1 and 5"),
  // the rating is what matters, a written review is optional
  comment: z
    .string()
    .trim()
    .max(1000, "Review must be at most 1000 characters")
    .optional(),
});
