import mongoose from "mongoose";

// A service type is an entry in the platform catalogue that the admin curates.
// Providers pick a service type as the title of the services they publish, which
// keeps service names consistent across the platform.
const serviceTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a service name"],
      trim: true,
      unique: true,
      maxLength: 60,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Service category is required"],
    },
  },
  { timestamps: true },
);

const ServiceTypeModel = mongoose.model("ServiceType", serviceTypeSchema);

export default ServiceTypeModel;
