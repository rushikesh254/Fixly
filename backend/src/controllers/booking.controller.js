import BookingModel from "../models/booking.model.js";
import ServiceModel from "../models/service.model.js";

// Controller function to create a new booking
// POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const { serviceId, bookingDate, address, bookingTime } = req.body;

    // Validate required fields
    if (!serviceId || !bookingDate || !address || !bookingTime) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Validate service exists  (using serviceId from request body)
    const service = await ServiceModel.findById(serviceId);
    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }

    // Prevent users from booking their own services
    if (service.provider.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ success: false, message: "You cannot book your own service" });
    }

    // convert bookingDate and bookingTime to a single Date object for comparison
    const bookingDateTimeString = `${bookingDate}T${bookingTime}`;
    const bookingDateTime = new Date(bookingDateTimeString);

    if (bookingDateTime <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Booking date and time must be in the future",
      });
    }

    //  default 60 minutes if duration not given
    const bookingEndTime = new Date(
      bookingDateTime.getTime() + service.duration * 60000,
    );

    // find provider existing  bookings
    const existingBookings = await BookingModel.find({
      provider: service.provider,
      status: {
        $in: ["pending", "confirmed"], // only consider pending and confirmed bookings for conflict check
      },
    });

    // check overlap with existing bookings
    for (const booking of existingBookings) {
      const existingStart = booking.bookingDate;

      const existingEnd = new Date(
        existingStart.getTime() + booking.duration * 60000,
      );

      const isOverlapping =
        bookingDateTime < existingEnd && bookingEndTime > existingStart;

      if (isOverlapping) {
        return res.status(400).json({
          success: false,
          message: "Provider is already booked for the selected time slot",
        });
      }
    }

    // Create the booking
    const booking = await BookingModel.create({
      service: serviceId,
      user: req.user._id,
      provider: service.provider,
      bookingDate: bookingDateTime,
      bookingTime: bookingTime,
      address,
      amount: service.price,
      duration: service.duration,
    });
    // Populate the booking with related data for response
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res
      .status(500)
      .json({ success: false, message: "Could not create booking" });
  }
};

// Controller function to get bookings for the logged-in user (both as a customer and provider)
//  GET /api/bookings/my
const getMyBookings = async (req, res) => {
  try {
    //  fetch  booking if user or provider is the logged in user and populate related data  add  service, user, provider details and sort by most recent first
    const bookings = await BookingModel.find({
      $or: [{ user: req.user._id }, { provider: req.user._id }],
    })
      .populate("service")
      .populate("user")
      .populate("provider")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res
      .status(500)
      .json({ success: false, message: "Could not fetch bookings" });
  }
};

// Controller function to update booking status (for providers)
// PUT /api/bookings/:bookingId/status
const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "confirmed", "completed", "cancelled"];

    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status value" });
    }

    const booking = await BookingModel.findById(bookingId);

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    if (booking.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the provider can update booking status",
      });
    }
    booking.status = status;

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      booking,
    });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res
      .status(500)
      .json({ success: false, message: "Could not update booking status" });
  }
};

// Controller function to cancel a booking (for both customers and providers)
// PUT /api/bookings/:bookingId/cancel
const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await BookingModel.findById(bookingId);

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    if (
      booking.user.toString() !== req.user._id.toString() &&
      booking.provider.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to cancel this booking",
      });
    }

    if (booking.status === "cancelled") {
      return res
        .status(400)
        .json({ success: false, message: "Booking is already cancelled" });
    }

    if (booking.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Completed bookings cannot be cancelled",
      });
    }

    booking.status = "cancelled";

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res
      .status(500)
      .json({ success: false, message: "Could not cancel booking" });
  }
};

export { cancelBooking, createBooking, getMyBookings, updateBookingStatus };
