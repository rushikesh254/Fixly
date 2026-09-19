import { Router } from "express";
import {
  getBookings,
  getProviders,
  getStats,
  getUsers,
  updateProviderStatus,
  updateUserStatus,
} from "../controllers/admin.controller.js";
import { authorize, protect } from "../middleware/auth.middleware.js";

const router = Router();

// the whole admin surface requires an authenticated admin
router.use(protect, authorize("admin"));

router.get("/stats", getStats);

router.get("/users", getUsers);
router.put("/users/:id/status", updateUserStatus);

router.get("/providers", getProviders);
router.put("/providers/:id/status", updateProviderStatus);

router.get("/bookings", getBookings);

export default router;
