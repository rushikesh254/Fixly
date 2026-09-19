import { Router } from "express";
import { createReview, getReviews } from "../controllers/review.controller.js";
import { authorize, protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/:serviceId", getReviews);
router.post("/", protect, authorize("user"), createReview);

export default router;
