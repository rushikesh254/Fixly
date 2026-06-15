import BookingModel from "../models/booking.model.js";
import ServiceModel from "../models/service.model.js";

const createBooking = async (req, res) => {
  try {
    const { serviceId, bookingDate, address, bookingTime } = req.body;

    // Validate required fields
    if (!serviceId || !bookingDate || !address || !bookingTime) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const bookingDateObj = new Date(bookingDate);
    const currentDate = new Date();
    if (bookingDateObj < currentDate) {
      return res
        .status(400)
        .json({ message: "Booking date must be in the future" });
    }

    const service = await ServiceModel.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (service.provider.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot book your own service" });
    }

    // if (phoneNumber) {
    //   await UserModel.findByIdAndUpdate(req.user._id, { phoneNumber });
    // }

    const booking = await BookingModel.create({
      service: serviceId,
      user: req.user._id,
      provider: service.provider,
      bookingDate: bookingDateObj,
      bookingTime: bookingTime,
      address,
      amount: service.price,
    });
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({
      success: false,
      message: "Could not create booking",
      error: error.message,
    });
  }
};

const getMyBookings = async (req, res) => {
  try {
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

const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const validateStatuses = ["pending", "confirmed", "completed", "cancelled"];

    if (!status && !validateStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const booking = await BookingModel.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.provider.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Only the provider can update booking status" });
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

const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await BookingModel.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (
      booking.user.toString() !== req.user._id.toString() &&
      booking.provider.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to cancel this booking" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    if (booking.status === "completed") {
      return res
        .status(400)
        .json({ message: "Completed bookings cannot be cancelled" });
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
