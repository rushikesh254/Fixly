import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    bookingDate: {
      type: Date,
      required: [true, "Booking date is required"],
    },
    bookingTime: {
      type: String,
      required: [true, "Booking time is required"],
    },
    // address of the user where the service will be provided
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    duration: {
      type: Number,
      required: true,
      default: 60,
    },
    isReviewed: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true },
);

const BookingModel = mongoose.model("Booking", bookingSchema);

export default BookingModel;
