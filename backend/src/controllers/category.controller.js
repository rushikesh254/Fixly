import { createCategorySchema } from "../validation/category.validation.js";
import CategoryModel from "../models/category.model.js";

const createCategory = async (req, res, next) => {
  try {
    const result = createCategorySchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ success: false, message: result.error.issues[0].message });
    }
    const { name } = result.data;

    const existing = await CategoryModel.findOne({ name });
    if (existing) {
      return res.status(400).json({ success: false, message: "Category with this name already exists" });
    }

    const slug = name.toLowerCase().split(" ").join("-");

    const newCategory = await CategoryModel.create({ name, slug });

    res.status(201).json({ success: true, category: newCategory });
  } catch (error) {
    console.error("Error creating category:", error);
    error.statusCode = 500;
    next(error);
  }
};

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await CategoryModel.find();
    res.status(200).json({ success: true, count: categories.length, categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    error.statusCode = 500;
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await CategoryModel.findById(id);

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    await CategoryModel.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Category deleted successfully", category });
  } catch (error) {
    console.error("Error deleting category:", error);
    error.statusCode = 500;
    next(error);
  }
};

export { createCategory, deleteCategory, getAllCategories };
