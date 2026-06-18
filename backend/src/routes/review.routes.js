import { Router } from "express";
import {
  createReview,
  deleteReview,
  getReviews,
} from "../controllers/review.controller.js";

import { authorize, protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/:serviceId", getReviews);
router.post("/", protect, authorize("user"), createReview);
router.delete("/:reviewId", protect, authorize("user"), deleteReview);

export default router;
