import CategoryModel from "../models/category.model.js";

// Controller function to create a new category
// POST /api/categories
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Category name is required" });
    }

    const existing = await CategoryModel.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Category with this name already exists",
      });
    }

    const slug = name.trim().toLowerCase().split(" ").join("-"); // create slug from name

    const newCategory = await CategoryModel.create({ name: name.trim(), slug });

    res.status(201).json({ success: true, category: newCategory });
  } catch (error) {
    console.error("Error creating category:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create category." });
  }
};

// Controller function to get all categories
// GET /api/categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    res
      .status(200)
      .json({ success: true, count: categories.length, categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch categories." });
  }
};

// Controller function to delete a category
// DELETE /api/categories/:id
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await CategoryModel.findById(id);

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    await CategoryModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      category,
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete category." });
  }
};

export { createCategory, deleteCategory, getAllCategories };
