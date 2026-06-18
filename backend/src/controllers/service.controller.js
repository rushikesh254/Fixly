import BookingModel from "../models/booking.model.js";
import CategoryModel from "../models/category.model.js";
import ServiceModel from "../models/service.model.js";
import UserModel from "../models/user.model.js";

// Controller function to create a new service
// POST /api/services
const createService = async (req, res) => {
  try {
    // Extract service details from the request body
    const {
      name,
      description,
      price,
      duration,
      category,
      address,
      latitude,
      longitude,
      phoneNumber,
    } = req.body;

    // Validate required fields
    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "name, description, price and category are required",
      });
    }

    if (name.length < 3) {
      return res
        .status(400)
        .json({ success: false, message: "name must be atleast 3 characters" });
    }

    if (price < 0) {
      return res
        .status(400)
        .json({ success: false, message: "price cannot be negative" });
    }

    // // Only providers and admins can create services
    // if (req.user.role !== "provider" && req.user.role !== "admin") {
    //   return res
    //     .status(403)
    //     .json({ message: "only providers can create services" });
    // }

    // Check if the provided category exists
    const categoryExists = await CategoryModel.findById(category);

    if (!categoryExists) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    // If the user provided a phone number, update it in their profile
    if (phoneNumber) {
      await UserModel.findByIdAndUpdate(req.user._id, { phoneNumber });
    }

    // If latitude and longitude are provided, create a GeoJSON Point for the service location
    let location;
    if (latitude && longitude) {
      location = {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      };
    }

    // Create the service
    const serviceData = {
      name,
      description,
      price,
      duration: duration || 60, // default to 60 minutes if not provided
      category,
      provider: req.user._id,
      address,
      location,
    };

    // If images are uploaded, add their paths to the service data (handled by multer middleware) and stored in req.files  ( array of files )
    if (req.files && req.files.length > 0) {
      serviceData.images = req.files.map((file) => file.path);
    }

    // Save the service to the database
    const service = await ServiceModel.create(serviceData);

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      service,
    });
  } catch (error) {
    console.error("Error creating service:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create service." });
  }
};

// Controller function to get all services
// GET /api/services
const getAllServices = async (req, res) => {
  try {
    const { keyword, category, minPrice, maxPrice, lat, lng, distance, sort } =
      req.query;

    const filter = {};

    // filter by keyword in name or description
    if (keyword) {
      filter.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }
    // filter by category
    if (category) {
      filter.category = category;
    }
    // filter by price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // default sort by newest first
    let sortOption = { createdAt: -1 };

    // sort by price if requested
    if (sort === "price-asc") {
      sortOption = { price: 1 };
    } else if (sort === "price-desc") {
      sortOption = { price: -1 };
    }

    //  add catehory ,provider and reviews data to the service data using populate
    let query = ServiceModel.find(filter)
      .populate("category")
      .populate("provider", "-password -verificationToken -verificationTokenExpires -resetPasswordToken -resetPasswordExpires")
      .populate("reviews");

    // if lat and lng are provided, sort by distance from the given location using geospatial query

    // show services near the given location within the specified distance (default to 10km if not provided)

    if (lat && lng) {
      sortOption = {};
      query = query.find({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [parseFloat(lng), parseFloat(lat)],
            },
            $maxDistance: (distance || 10) * 1000, // convert km to meters
          },
        },
      });
    }

    const services = await query.sort(sortOption);

    // Return the services in the response
    res.status(200).json({
      success: true,
      count: services.length,
      message: "Services fetched successfully",
      services,
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    res
      .status(500)
      .json({ success: false, message: "Could not fetch services" });
  }
};

// get service by id
// GET /api/services/:id
const getServiceById = async (req, res) => {
  try {
    const service = await ServiceModel.findById(req.params.id)
      .populate("category")
      .populate("provider", "-password -verificationToken -verificationTokenExpires -resetPasswordToken -resetPasswordExpires");

    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }

    res.status(200).json({
      success: true,
      message: "Service fetched successfully",
      service,
    });
  } catch (error) {
    console.error("Error fetching service:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch service." });
  }
};

// update service by id
// PUT /api/services/:id
const updateService = async (req, res) => {
  try {
    const service = await ServiceModel.findById(req.params.id);

    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }

    if (service.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this service",
      });
    }

    // Extract service details from the request body
    const {
      name,
      description,
      price,
      duration,
      category,
      address,
      latitude,
      longitude,
      phoneNumber,
    } = req.body;

    if (name) service.name = name;
    if (description) service.description = description;
    if (price !== undefined) service.price = price;
    if (duration) service.duration = duration;
    if (category) service.category = category;
    if (address) service.address = address;
    if (latitude && longitude) {
      service.location = {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      };
    }

    // If images are uploaded, add their paths to the service data (handled by multer middleware) and stored in req.files  ( array of files )
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
    res
      .status(500)
      .json({ success: false, message: "Failed to update service." });
  }
};

// delete service by id
// DELETE /api/services/:id

const deleteService = async (req, res) => {
  try {
    const service = await ServiceModel.findById(req.params.id);

    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }
    if (service.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this service",
      });
    }

    //
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
    res
      .status(500)
      .json({ success: false, message: "Failed to delete service." });
  }
};

export {
  createService,
  deleteService,
  getAllServices,
  getServiceById,
  updateService,
};
