import { z } from "zod";

// multipart/form-data sends every field as a string, so booleans and arrays have
// to be coerced back to their real types before the schemas can validate them.
// These helpers are shared by the schemas that sit behind an upload middleware.

export const booleanFromForm = z
  .union([z.boolean(), z.enum(["true", "false"])])
  .transform((value) => value === true || value === "true");

export const stringArrayFromForm = z.preprocess((value) => {
  if (value === undefined || value === null || value === "") return undefined;
  if (Array.isArray(value)) return value;
  if (typeof value !== "string") return value;

  // the client sends the list as a JSON string, fall back to a comma separated
  // list so the endpoint stays usable from a plain form or an api client
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.map(String);
  } catch {
    // not json, handled below
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}, z.array(z.string().trim().min(1)));
