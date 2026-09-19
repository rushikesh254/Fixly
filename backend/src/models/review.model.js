import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
    },
    // optional, a customer may rate without writing anything
    comment: {
      type: String,
      default: "",
      trim: true,
      maxLength: 1000,
    },
  },
  {
    timestamps: true,
  },
);

const ReviewModel = mongoose.model("Review", reviewSchema);

export default ReviewModel;
