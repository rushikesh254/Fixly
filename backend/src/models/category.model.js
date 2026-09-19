import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a category name"],
      trim: true,
      unique: true,
      maxLength: 50,
    },
    slug: {
      // url friendly name like "home-cleaning" for "Home Cleaning"
      type: String,
      unique: true,
      lowercase: true,
    },
  },
  { timestamps: true },
);

const CategoryModel = mongoose.model("Category", categorySchema);

export default CategoryModel;
