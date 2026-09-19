import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z.string().email("Invalid email").toLowerCase().trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
  role: z.enum(["user", "provider"]).optional(),
});

export const googleLoginSchema = z.object({
  tokenId: z.string().min(1, "Google token is required"),
});

export const updateProfileSchema = z.object({
  name: z.string().trim().max(50, "Name must be at most 50 characters").optional(),
  phoneNumber: z
    .string()
    .trim()
    .regex(/^$|^[0-9]{10}$/, "Phone number must be 10 digits")
    .optional(),
  bio: z.string().max(500, "Bio must be at most 500 characters").optional(),
  gender: z.enum(["Male", "Female", "Other", ""]).optional(),
  dob: z.coerce.date().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email").toLowerCase().trim(),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Valid email is required").toLowerCase().trim(),
});

export const resendVerificationSchema = z.object({
  email: z.string().email("Valid email is required").toLowerCase().trim(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
});

export const resetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
});
