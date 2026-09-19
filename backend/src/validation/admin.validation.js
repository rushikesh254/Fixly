import { z } from "zod";

export const updateUserStatusSchema = z.object({
  status: z.enum(["active", "blocked"], {
    message: "Status must be either active or blocked",
  }),
});

export const updateProviderStatusSchema = z.object({
  status: z.enum(["pending", "approved", "rejected", "blocked"], {
    message: "Status must be one of: pending, approved, rejected, blocked",
  }),
});
