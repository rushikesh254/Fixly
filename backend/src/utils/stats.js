import BookingModel from "../models/booking.model.js";
import ReviewModel from "../models/review.model.js";

// Rating and booking counters are computed on read instead of being stored on the
// documents, so they can never drift out of sync with the reviews and bookings
// they are derived from. Every helper returns a Map keyed by the id as a string.

const round1 = (value) => Math.round(value * 10) / 10;

// average rating + review count per service
const getServiceRatings = async (serviceIds = []) => {
  const map = new Map();
  if (serviceIds.length === 0) return map;

  const rows = await ReviewModel.aggregate([
    { $match: { service: { $in: serviceIds } } },
    {
      $group: {
        _id: "$service",
        rating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  rows.forEach((row) => {
    map.set(row._id.toString(), {
      rating: round1(row.rating),
      totalReviews: row.totalReviews,
    });
  });

  return map;
};

// average rating + review count per provider, joined through their services
const getProviderRatings = async (providerIds = []) => {
  const map = new Map();
  if (providerIds.length === 0) return map;

  const rows = await ReviewModel.aggregate([
    {
      $lookup: {
        from: "services",
        localField: "service",
        foreignField: "_id",
        as: "service",
      },
    },
    { $unwind: "$service" },
    { $match: { "service.provider": { $in: providerIds } } },
    {
      $group: {
        _id: "$service.provider",
        rating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  rows.forEach((row) => {
    map.set(row._id.toString(), {
      rating: round1(row.rating),
      totalReviews: row.totalReviews,
    });
  });

  return map;
};

// number of completed bookings per provider
const getCompletedBookingCounts = async (providerIds = []) => {
  const map = new Map();
  if (providerIds.length === 0) return map;

  const rows = await BookingModel.aggregate([
    { $match: { provider: { $in: providerIds }, status: "completed" } },
    { $group: { _id: "$provider", count: { $sum: 1 } } },
  ]);

  rows.forEach((row) => map.set(row._id.toString(), row.count));

  return map;
};

// total bookings placed per customer
const getBookingCountsByUser = async (userIds = []) => {
  const map = new Map();
  if (userIds.length === 0) return map;

  const rows = await BookingModel.aggregate([
    { $match: { user: { $in: userIds } } },
    { $group: { _id: "$user", count: { $sum: 1 } } },
  ]);

  rows.forEach((row) => map.set(row._id.toString(), row.count));

  return map;
};

export {
  getBookingCountsByUser,
  getCompletedBookingCounts,
  getProviderRatings,
  getServiceRatings,
};
