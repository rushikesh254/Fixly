import { Router } from "express";
import {
  cancelBooking,
  createBooking,
  getMyBookings,
  updateBookingStatus,
} from "../controllers/booking.controller.js";
import { autherize, protect } from "../middleware/auth.middleware.js";

const router = Router();

// create a new booking only user can create a booking
router.post("/", protect, autherize("user"), createBooking);

// get bookings of the logged in user or provider
router.get(
  "/my-bookings",
  protect,
  autherize("user", "provider"),
  getMyBookings,
);

// only provider can update the booking status
router.put(
  "/:bookingId/status",
  protect,
  autherize("provider"),
  updateBookingStatus,
);

// user or provider can cancel the booking
router.put(
  "/:bookingId/cancel",
  protect,
  autherize("user", "provider"),
  cancelBooking,
);

export default router;
