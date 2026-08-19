import mongoose from "mongoose";
const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
      minlength: 3,
    },
    description: {
      type: String,
      required: [true, "Service description is required"],
    },
    price: {
      type: Number,
      required: [true, "Service price is required"],
      min: 0,
    },
    duration: {
      type: Number,
      required: [true, "Service duration is required"],
      min: 1,
      default: 60, // duration in minutes ( 1 hour )
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Service category is required"],
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Service provider is required"],
    },
    images: {
      type: [String],
      default: [],
    },
    address: {
      type: String,
      required: [true, "Service address is required"],
    },
    // location is stored as GeoJSON Point (longitude, latitude) eg { type: "Point", coordinates: [longitude, latitude] } used to calculate distance between user and service provider
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
      },
    },
  },
  {
    timestamps: true,
  },
);

// Create a geospatial index on the location field to enable geospatial queries (e.g., finding services near a user's location)
serviceSchema.index({ location: "2dsphere" });

// Virtual field to populate reviews for a service (assuming a Review model exists with a reference to the Service model)
serviceSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "service",
});

// Ensure virtual fields are included when converting documents to JSON or Objects
serviceSchema.set("toJSON", { virtuals: true });
serviceSchema.set("toObject", { virtuals: true });

const ServiceModel = mongoose.model("Service", serviceSchema);

export default ServiceModel;
