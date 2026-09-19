import CategoryModel from "../models/category.model.js";
import ServiceTypeModel from "../models/serviceType.model.js";
import { createServiceTypeSchema } from "../validation/serviceType.validation.js";

// The catalogue an admin curates. Providers pick one of these names as the title
// of the services they publish, which keeps the naming consistent platform wide.
const getAllServiceTypes = async (req, res, next) => {
  try {
    const { category } = req.query;

    const filter = {};
    if (category) filter.category = category;

    const serviceTypes = await ServiceTypeModel.find(filter)
      .populate("category", "name slug")
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: serviceTypes.length,
      serviceTypes,
    });
  } catch (error) {
    console.error("Error fetching service types:", error);
    error.statusCode = 500;
    next(error);
  }
};

const createServiceType = async (req, res, next) => {
  try {
    const result = createServiceTypeSchema.safeParse(req.body);
    if (!result.success) {
      return res
        .status(400)
        .json({ success: false, message: result.error.issues[0].message });
    }
    const { name, category } = result.data;

    const categoryExists = await CategoryModel.findById(category);
    if (!categoryExists) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    const existing = await ServiceTypeModel.findOne({ name });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "A service with this name already exists",
      });
    }

    const serviceType = await ServiceTypeModel.create({ name, category });
    await serviceType.populate("category", "name slug");

    res.status(201).json({ success: true, serviceType });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A service with this name already exists",
      });
    }
    console.error("Error creating service type:", error);
    error.statusCode = 500;
    next(error);
  }
};

export { createServiceType, getAllServiceTypes };
