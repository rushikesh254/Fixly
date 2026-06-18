import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import UserModel from "./models/user.model.js";

const seedAdmin = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing. Add it to backend/.env.");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const adminEmail = "admin@fixly.com";
    const existing = await UserModel.findOne({ email: adminEmail });

    if (existing) {
      console.log("Admin already exists");
      process.exit(0);
    }

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
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
};

seedAdmin();
