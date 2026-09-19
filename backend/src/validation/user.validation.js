import { z } from "zod";

// An account has exactly one address, so saving it is an upsert rather than a
// create. Every field the ui collects is validated here.
export const saveAddressSchema = z.object({
  label: z.string().trim().max(30, "Label must be at most 30 characters").optional(),
  flat: z.string().trim().optional(),
  street: z.string().trim().min(1, "Street is required"),
  city: z.string().trim().min(1, "City is required"),
  state: z.string().trim().min(1, "State is required"),
  pincode: z
    .string()
    .trim()
    .regex(/^[0-9]{6}$/, "Pincode must be 6 digits"),
  lat: z.coerce.number().optional(),
  lon: z.coerce.number().optional(),
});

export const favoriteSchema = z.object({
  serviceId: z.string().min(1, "Service is required"),
});
