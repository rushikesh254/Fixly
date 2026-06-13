import CategoryModel from "../models/category.model.js";

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const existing = await CategoryModel.findOne({ name: name.trim() });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Category with this name already exists" });
    }

    const slug = name.trim().toLowerCase().split(" ").join("-"); // create slug from name

    const newCategory = await CategoryModel.create({ name: name.trim(), slug });

    res.status(201).json({ success: true, category: newCategory });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    res
      .status(200)
      .json({ success: true, count: categories.length, categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await CategoryModel.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await CategoryModel.findByIdAndDelete(id);

    res
      .status(200)
      .json({
        success: true,
        message: "Category deleted successfully",
        category,
      });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: error.message });
  }
};

export { createCategory, deleteCategory, getCategories };
