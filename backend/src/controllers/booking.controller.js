import BookingModel from "../models/booking.model.js";
import ServiceModel from "../models/service.model.js";
import { PRIVATE_USER_FIELDS } from "../utils/userFields.js";
import {
  createBookingSchema,
  updateBookingStatusSchema,
} from "../validation/booking.validation.js";

// Timestamp written alongside a status change so the booking timeline in the ui
// can show when each transition happened.
const STATUS_TIMESTAMP = {
  confirmed: "confirmedAt",
  completed: "completedAt",
  cancelled: "cancelledAt",
  rejected: "rejectedAt",
};

const applyStatus = (booking, status) => {
  booking.status = status;
  const field = STATUS_TIMESTAMP[status];
  if (field) booking[field] = new Date();
  if (status === "completed") booking.paymentStatus = "Paid";
};

const createBooking = async (req, res, next) => {
  try {
    const result = createBookingSchema.safeParse(req.body);
    if (!result.success) {
      const messages = result.error.issues.map(i => i.message).join(", ");
      return res.status(400).json({ success: false, message: messages });
    }
    const { serviceId, bookingDate, address, bookingTime, specialInstructions } = result.data;

    const service = await ServiceModel.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    if (service.provider.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: "You cannot book your own service" });
    }

    const bookingDateTimeString = `${bookingDate}T${bookingTime}`;
    const bookingDateTime = new Date(bookingDateTimeString);

    if (Number.isNaN(bookingDateTime.getTime())) {
      return res.status(400).json({ success: false, message: "Invalid booking date or time" });
    }

    if (bookingDateTime <= new Date()) {
      return res.status(400).json({ success: false, message: "Booking date and time must be in the future" });
    }

    const bookingEndTime = new Date(bookingDateTime.getTime() + service.duration * 60000);

    const existingBookings = await BookingModel.find({
      provider: service.provider,
      status: { $in: ["pending", "confirmed"] },
    });

    for (const booking of existingBookings) {
      const existingStart = booking.bookingDate;
      const existingEnd = new Date(existingStart.getTime() + booking.duration * 60000);
      const isOverlapping = bookingDateTime < existingEnd && bookingEndTime > existingStart;

      if (isOverlapping) {
        return res.status(400).json({ success: false, message: "Provider is already booked for the selected time slot" });
      }
    }

    const booking = await BookingModel.create({
      service: serviceId,
      user: req.user._id,
      provider: service.provider,
      bookingDate: bookingDateTime,
      bookingTime: bookingTime,
      address,
      specialInstructions: specialInstructions || "",
      amount: service.price,
      duration: service.duration,
    });

    // return the populated booking so the ui can render it without a refetch
    const populated = await BookingModel.findById(booking._id)
      .populate("service")
      .populate("user", PRIVATE_USER_FIELDS)
      .populate("provider", PRIVATE_USER_FIELDS);

    res.status(201).json({ success: true, message: "Booking created successfully", booking: populated });
  } catch (error) {
    console.error("Error creating booking:", error);
    error.statusCode = 500;
    next(error);
  }
};

const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await BookingModel.find({
      $or: [{ user: req.user._id }, { provider: req.user._id }],
    })
      .populate({ path: "service", populate: { path: "category" } })
      .populate("user", PRIVATE_USER_FIELDS)
      .populate("provider", PRIVATE_USER_FIELDS)
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    error.statusCode = 500;
    next(error);
  }
};

const updateBookingStatus = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const result = updateBookingStatusSchema.safeParse(req.body);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message).join(", ");
      return res.status(400).json({ success: false, message: messages });
    }
    const { status } = result.data;

    const booking = await BookingModel.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Only the provider can update booking status" });
    }

    if (booking.status === "completed") {
      return res.status(400).json({ success: false, message: "Completed bookings can no longer be updated" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ success: false, message: "Cancelled bookings can no longer be updated" });
    }

    applyStatus(booking, status);
    await booking.save();

    const populated = await BookingModel.findById(booking._id)
      .populate({ path: "service", populate: { path: "category" } })
      .populate("user", PRIVATE_USER_FIELDS)
      .populate("provider", PRIVATE_USER_FIELDS);

    res.status(200).json({ success: true, message: "Booking status updated successfully", booking: populated });
  } catch (error) {
    console.error("Error updating booking status:", error);
    error.statusCode = 500;
    next(error);
  }
};

const cancelBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    const booking = await BookingModel.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (
      booking.user.toString() !== req.user._id.toString() &&
      booking.provider.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: "You are not authorized to cancel this booking" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ success: false, message: "Booking is already cancelled" });
    }

    if (booking.status === "completed") {
      return res.status(400).json({ success: false, message: "Completed bookings cannot be cancelled" });
    }

    if (booking.status === "rejected") {
      return res.status(400).json({ success: false, message: "Rejected bookings cannot be cancelled" });
    }

    if (new Date(booking.bookingDate) < new Date()) {
      return res.status(400).json({ success: false, message: "Past bookings cannot be cancelled" });
    }

    applyStatus(booking, "cancelled");
    booking.paymentStatus = "Not Paid";
    await booking.save();

    const populated = await BookingModel.findById(booking._id)
      .populate({ path: "service", populate: { path: "category" } })
      .populate("user", PRIVATE_USER_FIELDS)
      .populate("provider", PRIVATE_USER_FIELDS);

    res.status(200).json({ success: true, message: "Booking cancelled successfully", booking: populated });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    error.statusCode = 500;
    next(error);
  }
};

export { cancelBooking, createBooking, getMyBookings, updateBookingStatus };
