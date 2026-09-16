import { Router } from "express";
import {
  forgotPassword,
  googleLogin,
  login,
  logout,
  me,
  refreshToken,
  resetPassword,
  signup,
  updateProfile,
  verifyEmail,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authLimiter } from "../middleware/rate.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = Router();

router.post("/signup", authLimiter, signup);

router.post("/login", authLimiter, login);

router.post("/logout", authLimiter, logout);

router.get("/me", protect, me);

router.put("/profile", protect, upload.single("profileImage"), updateProfile);

router.get("/verify-email/:token", authLimiter, verifyEmail);

router.post("/forgot-password", authLimiter, forgotPassword);

router.post("/reset-password/:token", authLimiter, resetPassword);

router.post("/google-login", authLimiter, googleLogin);

router.post("/refresh-token", authLimiter, refreshToken);

export default router;
