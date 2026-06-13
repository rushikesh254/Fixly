import { Router } from "express";
import { login, logout, me, signup } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.get("/me", protect, me);

export default router;
