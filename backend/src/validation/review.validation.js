import { z } from "zod";

export const createReviewSchema = z.object({
  serviceId: z.string().min(1, "Service is required"),
  rating: z.number().min(1, "Rating must be between 1 and 5").max(5, "Rating must be between 1 and 5"),
  comment: z.string().min(1, "Comment is required"),
});
