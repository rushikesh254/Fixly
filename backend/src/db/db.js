import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing. Add it to backend/.env.");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully ✅");
  } catch (error) {
    console.error("MongoDB connection failed ❌:", error.message);
    process.exit(1); // if connection fails, exit the process with an error code  (server won't start if DB connection fails)
  }
};

export default connectDB;
