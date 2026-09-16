import { createServiceSchema, updateServiceSchema } from "../validation/service.validation.js";
import BookingModel from "../models/booking.model.js";
import CategoryModel from "../models/category.model.js";
import ServiceModel from "../models/service.model.js";
import UserModel from "../models/user.model.js";

const createService = async (req, res, next) => {
  try {
    const result = createServiceSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ success: false, message: result.error.issues.map((i) => i.message).join(", ") });
    }
    const { name, description, price, duration, category, address, latitude, longitude, phoneNumber } = result.data;

    const categoryExists = await CategoryModel.findById(category);
    if (!categoryExists) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    if (phoneNumber) {
      await UserModel.findByIdAndUpdate(req.user._id, { phoneNumber });
    }

    let location;
    if (latitude && longitude) {
      location = {
        type: "Point",
        coordinates: [longitude, latitude],
      };
    }

    const serviceData = {
      name, description, price,
      duration,
      category,
      provider: req.user._id,
      address, location,
    };

    if (req.files && req.files.length > 0) {
      serviceData.images = req.files.map((file) => file.path);
    }

    const service = await ServiceModel.create(serviceData);

    res.status(201).json({ success: true, message: "Service created successfully", service });
  } catch (error) {
    console.error("Error creating service:", error);
    error.statusCode = 500;
    next(error);
  }
};

const getAllServices = async (req, res, next) => {
  try {
    const { keyword, category, minPrice, maxPrice, lat, lng, distance, sort } = req.query;

    const filter = {};

    if (keyword) {
      filter.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    let sortOption = { createdAt: -1 };

    if (sort === "price-asc") {
      sortOption = { price: 1 };
    } else if (sort === "price-desc") {
      sortOption = { price: -1 };
    }

    let query = ServiceModel.find(filter)
      .populate("category")
      .populate("provider", "-password -verificationToken -verificationTokenExpires -resetPasswordToken -resetPasswordExpires")
      .populate("reviews");

    if (lat && lng) {
      sortOption = {};
      query = query.find({
        location: {
          $near: {
            $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
            $maxDistance: (distance || 10) * 1000,
          },
        },
      });
    }

    const services = await query.sort(sortOption);

    res.status(200).json({ success: true, count: services.length, message: "Services fetched successfully", services });
  } catch (error) {
    console.error("Error fetching services:", error);
    error.statusCode = 500;
    next(error);
  }
};

const getServiceById = async (req, res, next) => {
  try {
    const service = await ServiceModel.findById(req.params.id)
      .populate("category")
      .populate("provider", "-password -verificationToken -verificationTokenExpires -resetPasswordToken -resetPasswordExpires");

    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    res.status(200).json({ success: true, message: "Service fetched successfully", service });
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
      return res.status(400).json({ success: false, message: result.error.issues.map((i) => i.message).join(", ") });
    }
    const { name, description, price, duration, category, address, latitude, longitude } = result.data;

    const service = await ServiceModel.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    if (service.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "You are not authorized to update this service" });
    }

    if (name) service.name = name;
    if (description) service.description = description;
    if (price !== undefined) service.price = price;
    if (duration) service.duration = duration;
    if (category) service.category = category;
    if (address) service.address = address;
    if (latitude && longitude) {
      service.location = {
        type: "Point",
        coordinates: [longitude, latitude],
      };
    }

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => file.path);
      service.images = [...service.images, ...newImages];
    }

    await service.save();

    res.status(200).json({ success: true, message: "Service updated successfully", service });
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
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    if (service.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "You are not authorized to delete this service" });
    }

    const activeBookings = await BookingModel.find({
      service: req.params.id,
      status: { $in: ["pending", "confirmed"] },
    });

    if (activeBookings.length > 0) {
      return res.status(400).json({ success: false, message: "Cannot delete service with active bookings." });
    }

    await ServiceModel.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: "Service deleted successfully" });
  } catch (error) {
    console.error("Error deleting service:", error);
    error.statusCode = 500;
    next(error);
  }
};

export { createService, deleteService, getAllServices, getServiceById, updateService };
