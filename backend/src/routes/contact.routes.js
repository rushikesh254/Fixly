import { Router } from "express";
import { sendContactMessage } from "../controllers/contact.controller.js";
import { contactLimiter } from "../middleware/rate.middleware.js";

const router = Router();

// public, rate limited so the form cannot be used as a mail relay
router.post("/", contactLimiter, sendContactMessage);

export default router;
