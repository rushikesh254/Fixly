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
      default: 60, // duration in minutes ( 1 hour ), used to detect overlapping bookings
    },
    // human readable duration shown to customers eg "2-3 hours", the numeric
    // duration above stays the source of truth for scheduling
    estimatedDuration: {
      type: String,
      default: "",
      trim: true,
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
    // what the service covers, shown as a checklist on the details page
    includes: {
      type: [String],
      default: [],
    },
    availableToday: {
      type: Boolean,
      default: false,
    },
    instantBooking: {
      type: Boolean,
      default: false,
    },
    // optional, falls back to the provider's default saved address
    address: {
      type: String,
      default: "",
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

const ServiceModel = mongoose.model("Service", serviceSchema);

export default ServiceModel;
