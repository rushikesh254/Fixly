import { Router } from "express";
import {
  getMyProviderProfile,
  getMyReviews,
  getProviderById,
  updateMyProviderProfile,
} from "../controllers/provider.controller.js";
import { authorize, protect } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = Router();

// the signed in provider's own routes, declared before "/:id" so that "me" is
// never treated as a provider id
router.get("/me", protect, authorize("provider"), getMyProviderProfile);

router.put(
  "/me",
  protect,
  authorize("provider"),
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 8 },
  ]),
  updateMyProviderProfile,
);

router.get("/me/reviews", protect, authorize("provider"), getMyReviews);

// public profile of an approved provider
router.get("/:id", getProviderById);

export default router;
