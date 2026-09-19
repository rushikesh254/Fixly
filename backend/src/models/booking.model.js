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
    // notes the customer leaves for the provider when booking
    specialInstructions: {
      type: String,
      default: "",
    },
    status: {
      // "rejected" means the provider declined the request, "cancelled" means
      // the customer or provider called off an accepted booking
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled", "rejected"],
      default: "pending",
    },
    // there is no payment gateway yet, this only tracks how the job will be paid
    paymentStatus: {
      type: String,
      enum: ["Pay after Service", "Paid", "Not Paid"],
      default: "Pay after Service",
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
    // timestamps for the status timeline shown in the booking detail modal
    confirmedAt: Date,
    completedAt: Date,
    cancelledAt: Date,
    rejectedAt: Date,
  },

  { timestamps: true },
);

const BookingModel = mongoose.model("Booking", bookingSchema);

export default BookingModel;
