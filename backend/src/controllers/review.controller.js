import BookingModel from "../models/booking.model.js";
import ReviewModel from "../models/review.model.js";
import ServiceModel from "../models/service.model.js";
import { createReviewSchema } from "../validation/review.validation.js";

const createReview = async (req, res, next) => {
  try {
    const result = createReviewSchema.safeParse(req.body);
    if (!result.success) {
      const messages = result.error.issues.map(i => i.message).join(", ");
      return res.status(400).json({ success: false, message: messages });
    }
    const { serviceId, rating, comment } = result.data;

    const service = await ServiceModel.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    const completedBooking = await BookingModel.findOne({
      user: req.user._id,
      service: serviceId,
      status: "completed",
    });

    if (!completedBooking) {
      return res.status(400).json({
        success: false,
        message: "You can only review services you have booked and completed",
      });
    }

    const existingReview = await ReviewModel.findOne({
      user: req.user._id,
      service: serviceId,
    });

    if (existingReview) {
      return res.status(400).json({ success: false, message: "You have already reviewed this service" });
    }

    const review = await ReviewModel.create({
      user: req.user._id,
      service: serviceId,
      rating,
      comment,
    });

    completedBooking.isReviewed = true;
    await completedBooking.save();

    res.status(201).json({ success: true, review });
  } catch (error) {
    console.error("Error creating review:", error);
    error.statusCode = 500;
    next(error);
  }
};

const getReviews = async (req, res, next) => {
  try {
    const { serviceId } = req.params;

    const service = await ServiceModel.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    const reviews = await ReviewModel.find({ service: serviceId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    error.statusCode = 500;
    next(error);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;

    const review = await ReviewModel.findById(reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await review.deleteOne();

    res.status(200).json({ success: true, message: "Review deleted" });
  } catch (error) {
    console.error("Error deleting review:", error);
    error.statusCode = 500;
    next(error);
  }
};

export { createReview, deleteReview, getReviews };
