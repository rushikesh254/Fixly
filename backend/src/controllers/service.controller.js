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
        message: "name, description, price and category are required",
      });
    }

    if (name.length < 3) {
      return res
        .status(400)
        .json({ message: "name must be atleast 3 characters" });
    }

    if (price < 0) {
      return res.status(400).json({ message: "price cannot be negative" });
    }

    // Only providers and admins can create services
    if (req.user.role !== "provider" && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "only providers can create services" });
    }

    // Check if the provided category exists
    const categoryExists = await CategoryModel.findById(category);

    if (!categoryExists) {
      return res.status(404).json({ message: "category not found" });
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

    res.status(201).json({ message: "Service created successfully", service });
  } catch (error) {
    console.error("Error creating service:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Controller function to get all services
// GET /api/services
const getAllServices = async (req, res) => {
  try {
    const services = await ServiceModel.find()
      .populate("category")
      .populate("provider")
      .sort({ createdAt: -1 }); // sort by newest first

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
      .json({ message: "Internal server error", error: error.message });
  }
};

// get service by id
// GET /api/services/:id
const getServiceById = async (req, res) => {
  try {
    const service = await ServiceModel.findById(req.params.id)
      .populate("category")
      .populate("provider");

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
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
      .json({ message: "Internal server error", error: error.message });
  }
};

// update service by id
// PUT /api/services/:id
const updateService = async (req, res) => {
  try {
    const service = await ServiceModel.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (service.provider.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this service" });
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

    res.status(200).json({ message: "Service updated successfully", service });
  } catch (error) {
    console.error("Error updating service:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// delete service by id
// DELETE /api/services/:id

const deleteService = async (req, res) => {
  try {
    const service = await ServiceModel.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    if (service.provider.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this service" });
    }

    await ServiceModel.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("Error deleting service:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export {
  createService,
  deleteService,
  getAllServices,
  getServiceById,
  updateService,
};
