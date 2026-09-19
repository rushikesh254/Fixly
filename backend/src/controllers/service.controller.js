import BookingModel from "../models/booking.model.js";
import CategoryModel from "../models/category.model.js";
import ServiceModel from "../models/service.model.js";
import UserModel from "../models/user.model.js";
import { parseDurationToMinutes } from "../utils/duration.js";
import {
  getCompletedBookingCounts,
  getServiceRatings,
} from "../utils/stats.js";
import { PRIVATE_USER_FIELDS } from "../utils/userFields.js";
import {
  createServiceSchema,
  updateServiceSchema,
} from "../validation/service.validation.js";

// Ratings and booking counters are derived from the reviews and bookings
// collections, so they are attached to the plain service objects right before
// they are sent out instead of being stored on the service itself.
const withRatings = async (services) => {
  const serviceIds = services.map((service) => service._id);

  // aggregation does not cast ids, so the ObjectIds are kept and only deduped
  const providerIds = new Map();
  services.forEach((service) => {
    const id = service.provider?._id || service.provider;
    if (id) providerIds.set(id.toString(), id);
  });

  const [ratings, completed] = await Promise.all([
    getServiceRatings(serviceIds),
    getCompletedBookingCounts([...providerIds.values()]),
  ]);

  return services.map((service) => {
    const plain = service.toObject ? service.toObject() : service;
    const stats = ratings.get(plain._id.toString());
    const providerId = (plain.provider?._id || plain.provider)?.toString();

    return {
      ...plain,
      rating: stats ? stats.rating : 0,
      totalReviews: stats ? stats.totalReviews : 0,
      bookingsCompleted: completed.get(providerId) || 0,
    };
  });
};

// A provider does not enter an address per service, so the address saved on the
// provider account is used for the listing and for the geo search.
const resolveProviderLocation = async (providerId) => {
  const provider = await UserModel.findById(providerId).select("address");
  const address = provider?.address;
  if (!address) return {};

  const parts = [
    address.flat,
    address.street,
    address.city,
    address.state,
    address.pincode,
  ];

  const resolved = { address: parts.filter(Boolean).join(", ") };

  if (address.lat !== undefined && address.lon !== undefined) {
    resolved.location = {
      type: "Point",
      coordinates: [address.lon, address.lat],
    };
  }

  return resolved;
};

const createService = async (req, res, next) => {
  try {
    const result = createServiceSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error.issues.map((i) => i.message).join(", "),
      });
    }
    const {
      name,
      description,
      price,
      duration,
      estimatedDuration,
      category,
      address,
      latitude,
      longitude,
      phoneNumber,
      includes,
      availableToday,
      instantBooking,
    } = result.data;

    const categoryExists = await CategoryModel.findById(category);
    if (!categoryExists) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    if (phoneNumber) {
      await UserModel.findByIdAndUpdate(req.user._id, { phoneNumber });
    }

    let location;
    if (latitude !== undefined && longitude !== undefined) {
      location = {
        type: "Point",
        coordinates: [longitude, latitude],
      };
    }

    const serviceData = {
      name,
      description,
      price,
      // the numeric duration drives the overlap check, derive it from the label
      // when the provider only gave a human readable estimate
      duration: duration || parseDurationToMinutes(estimatedDuration),
      estimatedDuration: estimatedDuration || "",
      category,
      provider: req.user._id,
      address,
      location,
      includes: includes || [],
      availableToday: availableToday || false,
      instantBooking: instantBooking || false,
    };

    // fall back to the provider's default address when none was supplied
    if (!serviceData.address || !serviceData.location) {
      const fallback = await resolveProviderLocation(req.user._id);
      if (!serviceData.address) serviceData.address = fallback.address || "";
      if (!serviceData.location) serviceData.location = fallback.location;
    }

    const service = await ServiceModel.create(serviceData);

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      service,
    });
  } catch (error) {
    console.error("Error creating service:", error);
    error.statusCode = 500;
    next(error);
  }
};

const getAllServices = async (req, res, next) => {
  try {
    const {
      keyword,
      category,
      minPrice,
      maxPrice,
      lat,
      lng,
      distance,
      sort,
      provider,
      instantBooking,
      availableToday,
      minRating,
    } = req.query;

    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (instantBooking === "true") {
      filter.instantBooking = true;
    }

    if (availableToday === "true") {
      filter.availableToday = true;
    }

    // customers may only discover services of approved, active providers
    const approvedProviders = await UserModel.find({
      role: "provider",
      providerStatus: "approved",
      status: "active",
      isDeleted: false,
      ...(provider ? { _id: provider } : {}),
    }).select("_id");

    filter.provider = { $in: approvedProviders.map((item) => item._id) };

    if (keyword) {
      // escape special regex characters from user input before building the
      // pattern to prevent ReDoS on adversarially crafted search strings
      const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const pattern = new RegExp(escaped, "i");
      const matchingProviders = await UserModel.find({
        role: "provider",
        $or: [{ providerName: pattern }, { name: pattern }],
      }).select("_id");

      filter.$or = [
        { name: pattern },
        { description: pattern },
        { address: pattern },
        { provider: { $in: matchingProviders.map((item) => item._id) } },
      ];
    }

    let sortOption = { createdAt: -1 };

    if (sort === "price-asc") {
      sortOption = { price: 1 };
    } else if (sort === "price-desc") {
      sortOption = { price: -1 };
    }

    let query = ServiceModel.find(filter)
      .populate("category")
      .populate("provider", PRIVATE_USER_FIELDS);

    if (lat && lng) {
      sortOption = {};
      query = query.find({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [parseFloat(lng), parseFloat(lat)],
            },
            $maxDistance: (distance || 10) * 1000,
          },
        },
      });
    }

    const services = await withRatings(await query.sort(sortOption));

    // rating is derived, so it has to be filtered after the documents are loaded
    const filtered = minRating
      ? services.filter((service) => service.rating >= parseFloat(minRating))
      : services;

    res.status(200).json({
      success: true,
      count: filtered.length,
      message: "Services fetched successfully",
      services: filtered,
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    error.statusCode = 500;
    next(error);
  }
};

// A provider manages their own catalogue here, which unlike the public listing
// also returns services created while the account is still awaiting approval.
const getMyServices = async (req, res, next) => {
  try {
    const services = await ServiceModel.find({ provider: req.user._id })
      .populate("category")
      .sort({ createdAt: -1 });

    const withStats = await withRatings(services);

    res.status(200).json({
      success: true,
      count: withStats.length,
      message: "Services fetched successfully",
      services: withStats,
    });
  } catch (error) {
    console.error("Error fetching provider services:", error);
    error.statusCode = 500;
    next(error);
  }
};

const getServiceById = async (req, res, next) => {
  try {
    const service = await ServiceModel.findById(req.params.id)
      .populate("category")
      .populate("provider", PRIVATE_USER_FIELDS);

    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }

    const [withStats] = await withRatings([service]);

    res.status(200).json({
      success: true,
      message: "Service fetched successfully",
      service: withStats,
    });
  } catch (error) {
    console.error("Error fetching service:", error);
    error.statusCode = 500;
    next(error);
  }
};

const updateService = async (req, res, next) => {
  try {
    const result = updateServiceSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error.issues.map((i) => i.message).join(", "),
      });
    }
    const {
      name,
      description,
      price,
      duration,
      estimatedDuration,
      category,
      address,
      latitude,
      longitude,
      includes,
      availableToday,
      instantBooking,
      images,
    } = result.data;

    const service = await ServiceModel.findById(req.params.id);

    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }

    // the owning provider or an admin may edit a service
    if (
      req.user.role !== "admin" &&
      service.provider.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this service",
      });
    }

    if (name) service.name = name;
    if (description) service.description = description;
    if (price !== undefined) service.price = price;
    if (duration) service.duration = duration;
    if (estimatedDuration !== undefined) {
      service.estimatedDuration = estimatedDuration;
      // keep the numeric duration in step with the label unless it was given
      if (!duration)
        service.duration = parseDurationToMinutes(estimatedDuration);
    }
    if (category) service.category = category;
    if (address) service.address = address;
    if (includes) service.includes = includes;
    if (availableToday !== undefined) service.availableToday = availableToday;
    if (instantBooking !== undefined) service.instantBooking = instantBooking;
    if (latitude !== undefined && longitude !== undefined) {
      service.location = {
        type: "Point",
        coordinates: [longitude, latitude],
      };
    }

    // "images" holds the urls the provider kept, uploads are appended to it
    if (images) service.images = images;

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => file.path);
      service.images = [...service.images, ...newImages];
    }

    await service.save();

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      service,
    });
  } catch (error) {
    console.error("Error updating service:", error);
    error.statusCode = 500;
    next(error);
  }
};

const deleteService = async (req, res, next) => {
  try {
    const service = await ServiceModel.findById(req.params.id);

    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }

    // the owning provider or an admin may delete a service
    if (
      req.user.role !== "admin" &&
      service.provider.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this service",
      });
    }

    const activeBookings = await BookingModel.find({
      service: req.params.id,
      status: { $in: ["pending", "confirmed"] },
    });

    if (activeBookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete service with active bookings.",
      });
    }

    await ServiceModel.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({ success: true, message: "Service deleted successfully" });
  } catch (error) {
    console.error("Error deleting service:", error);
    error.statusCode = 500;
    next(error);
  }
};

export {
  createService,
  deleteService,
  getAllServices,
  getMyServices,
  getServiceById,
  updateService,
};
