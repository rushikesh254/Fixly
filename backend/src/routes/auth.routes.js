import { Router } from "express";
import {
  forgotPassword,
  login,
  logout,
  me,
  resetPassword,
  signup,
  verifyEmail,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authLimiter } from "../middleware/rate.middleware.js";

const router = Router();

// auth limiter middleware is applied to the signup and login routes to prevent brute-force attacks
router.post("/signup", authLimiter, signup);

router.post("/login", authLimiter, login);

router.post("/logout", logout);

router.get("/me", protect, me);

router.get("/verify-email/:token", authLimiter, verifyEmail);

router.post("/forgot-password", authLimiter, forgotPassword);

router.post("/reset-password/:token", authLimiter, resetPassword);

export default router;
