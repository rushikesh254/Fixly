import bcrypt from "bcrypt";
import mongoose from "mongoose";

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
      minLength: 6,
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

    verificationToken: String, // random token emailed to user for verification(at time of registration)
    verificationTokenExpires: Date, // expiry time for verification token (e.g., 24 hours after generation)
    resetPasswordToken: String, // random token emailed to user for password reset
    resetPasswordExpires: Date, // expiry time for reset password token (e.g., 1 hour after generation)
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
