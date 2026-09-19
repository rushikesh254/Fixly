import { z } from "zod";
import { stringArrayFromForm } from "./form.js";

export const updateProviderSchema = z.object({
  providerName: z
    .string()
    .trim()
    .max(80, "Business name must be at most 80 characters")
    .optional(),
  experience: z
    .string()
    .trim()
    .max(50, "Experience must be at most 50 characters")
    .optional(),
  bio: z.string().max(500, "Bio must be at most 500 characters").optional(),
  category: z.string().optional(),
  gender: z.enum(["male", "female", "other", ""]).optional(),
  // urls of the already uploaded gallery images the provider wants to keep,
  // newly uploaded files are appended to this list
  galleryImages: stringArrayFromForm.optional(),
  // set to true when the provider removed the current cover image
  removeCoverImage: z.enum(["true", "false"]).optional(),
});
