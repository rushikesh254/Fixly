import { Router } from "express";
import {
  changePassword,
  forgotPassword,
  googleLogin,
  login,
  logout,
  me,
  refreshToken,
  resendVerificationEmail,
  resetPassword,
  signup,
  updateProfile,
  verifyEmail,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import {
  authLimiter,
  refreshLimiter,
} from "../middleware/rate.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = Router();

router.post("/signup", authLimiter, signup);

router.post("/login", authLimiter, login);

// logout only clears the session, so it is not part of the brute force surface
router.post("/logout", logout);

router.get("/me", protect, me);

router.put("/profile", protect, upload.single("profileImage"), updateProfile);

router.get("/verify-email/:token", authLimiter, verifyEmail);

router.post("/resend-verification", authLimiter, resendVerificationEmail);

router.post("/forgot-password", authLimiter, forgotPassword);

router.post("/reset-password/:token", authLimiter, resetPassword);

router.post("/google-login", authLimiter, googleLogin);

// refresh token has a dedicated, higher limit (see rate.middleware.js)
router.post("/refresh-token", refreshLimiter, refreshToken);

// change password for logged-in users
router.put("/change-password", protect, changePassword);

export default router;
