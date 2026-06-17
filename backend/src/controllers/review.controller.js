import BookingModel from "../models/booking.model.js";
import ReviewModel from "../models/review.model.js";
import ServiceModel from "../models/service.model.js";

// Controller function to create a new review
// POST /api/reviews
const createReview = async (req, res) => {
  try {
    const { serviceId, rating, comment } = req.body;

    // Validate input
    if (!serviceId || !rating || !comment) {
      return res
        .status(400)
        .json({ status: true, message: "All fields are required" });
    }

    // rating must be between 1 and 5
    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ status: true, message: "Rating must be between 1 and 5" });
    }

    // Check if service exists
    const service = await ServiceModel.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Check if user has completed a booking for this service
    const completedBooking = await BookingModel.findOne({
      user: req.user._id,
      service: serviceId,
      status: "completed",
    });

    if (!completedBooking) {
      return res.status(400).json({
        message: "You can only review services you have booked and completed",
      });
    }

    // Check if user has already reviewed this service
    const existingReview = await ReviewModel.findOne({
      user: req.user._id,
      service: serviceId,
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this service" });
    }

    // Create review
    const review = await ReviewModel.create({
      user: req.user._id,
      service: serviceId,
      rating,
      comment,
    });

    // Mark booking as reviewed
    completedBooking.isReviewed = true;
    await completedBooking.save();

    // send response
    res.status(201).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ status: false, message: "Error creating review" });
  }
};

// get reviews for a service
// GET /api/reviews/service/:serviceId
const getReviews = async (req, res) => {
  try {
    const { serviceId } = req.params;
    // Check if service exists
    const service = await ServiceModel.findById(serviceId);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const reviews = await ReviewModel.find({ service: serviceId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    res.status(500).json({ status: false, message: "Error fetching reviews" });
  }
};

// Controller function to delete a review
// DELETE /api/reviews/:reviewId
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await ReviewModel.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Only the user who created the review can delete it
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await review.remove();

    res.status(200).json({ success: true, message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ status: false, message: "Error deleting review" });
  }
};

export { createReview, deleteReview, getReviews };
