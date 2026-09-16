import dotenv from "dotenv";
import mongoose from "mongoose";
import CategoryModel from "./models/category.model.js";
import UserModel from "./models/user.model.js";
dotenv.config();

// This script seeds the database with an admin user and predefined categories.
const seed = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing. Add it to backend/.env.");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    // seed admin
    const adminEmail = "admin@fixly.com";
    const existingAdmin = await UserModel.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log("Admin already exists");
    } else {
      await UserModel.create({
        name: "Admin",
        email: adminEmail,
        password: "admin123",
        role: "admin",
        isVerified: true,
      });
      console.log("Admin seeded successfully");
      console.log("Email: admin@fixly.com");
      console.log("Password: admin123");
    }

    // seed categories
    await CategoryModel.deleteMany();

    const categories = [
      { name: "Plumbing", slug: "plumbing" },
      { name: "Cleaning", slug: "cleaning" },
      { name: "Electrical", slug: "electrical" },
      { name: "Painting", slug: "painting" },
      { name: "Moving", slug: "moving" },
      { name: "Landscaping", slug: "landscaping" },
      { name: "Carpentry", slug: "carpentry" },
      { name: "Appliance Repair", slug: "appliance-repair" },
    ];

    await CategoryModel.insertMany(categories);
    console.log("Categories seeded successfully");

    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
};

seed();
