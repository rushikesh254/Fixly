import bcrypt from "bcrypt";
import mongoose from "mongoose";

// The single address of an account. Stored as a subdocument because an address
// has no meaning outside of the user that owns it. Customers use it as the place
// a service is delivered to, providers as the place they operate from.
const addressSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      default: "",
      trim: true,
      maxLength: 30,
    },
    flat: {
      type: String,
      default: "",
      trim: true,
    },
    street: {
      type: String,
      required: [true, "Street is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
    },
    pincode: {
      type: String,
      required: [true, "Pincode is required"],
      trim: true,
    },
    // filled in only when the address was auto-detected from the browser, used
    // as a fallback location for the services a provider creates
    lat: {
      type: Number,
    },
    lon: {
      type: Number,
    },
  },
  { _id: false, timestamps: true },
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
      maxLength: 50,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minLength: 8,
    },
    phoneNumber: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "provider", "admin"],
      default: "user",
    },
    profileImage: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
      maxLength: 500,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    // account state controlled by an admin ( blocked users cannot log in or use the api )
    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
    },
    // soft delete so that past bookings and reviews keep a valid reference
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,

    gender: {
      type: String,
      enum: ["Male", "Female", "Other", ""],
      default: "",
    },
    dob: Date,

    // one address per account, editable at any time ( prefills the booking form
    // for a customer, and locates the services a provider publishes )
    address: {
      type: addressSchema,
      default: null,
    },

    // services the user bookmarked
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
      },
    ],

    // ----- provider only fields ( ignored for the "user" and "admin" roles ) -----

    // public business name shown on the service cards
    providerName: {
      type: String,
      default: "",
      trim: true,
      maxLength: 80,
    },
    // the single category a provider operates in
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    experience: {
      type: String,
      default: "",
      trim: true,
      maxLength: 50,
    },
    coverImage: {
      type: String,
      default: "",
    },
    galleryImages: {
      type: [String],
      default: [],
    },
    // approval state of a provider application, only approved providers are
    // discoverable by customers
    providerStatus: {
      type: String,
      enum: ["pending", "approved", "rejected", "blocked"],
      default: "pending",
    },
    appliedAt: Date,

    verificationToken: String,
    verificationTokenExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    refreshToken: String,
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  // Hash the password before saving
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
