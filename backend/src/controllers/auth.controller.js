import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";
import {
  resetPasswordTemplate,
  verifyEmailTemplate,
} from "../utils/emailTemplates.js";
import sendEmail from "../utils/sendEmail.js";
import {
  clearRefreshTokenCookie,
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  sendRefreshTokenCookie,
} from "../utils/token.js";
import {
  forgotPasswordSchema,
  googleLoginSchema,
  loginSchema,
  resetPasswordSchema,
  signupSchema,
  updateProfileSchema,
} from "../validation/auth.validation.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const signup = async (req, res, next) => {
  try {
    const result = signupSchema.safeParse(req.body);
    // validation failed (returns all errors in the request body)
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message).join(", ");
      return res.status(400).json({ success: false, message: messages });
    }

    // validation succeeded, extract the validated data
    const { name, email, password, role } = result.data;

    const userRole = role || "user";

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // verification and save user to db
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const hashedVerificationToken = hashToken(verificationToken);

    const user = await UserModel.create({
      name,
      email,
      password,
      role: userRole,
      verificationToken: hashedVerificationToken,
      verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours expiration
    });

    const verificationUrl = `${process.env.BACKEND_URL}/api/auth/verify-email/${verificationToken}`;
    try {
      await sendEmail({
        email: user.email,
        subject: "Verify your Fixly account",
        message: verifyEmailTemplate(verificationUrl),
      });
    } catch {
      console.log("Email send failed. Verification URL:", verificationUrl);
    }

    res.status(201).json({
      success: true,
      message:
        "User registered successfully. Please check your email to verify your account and then log in.",
    });
  } catch (error) {
    // this will catch duplicate key(email ) error from mongoose unique index and return a user-friendly message instead of generic server error ( it is for race condition when two users try to register with same email at the same time, since we check for existing user before creating a new one)
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    console.error("Error registering user: ", error.message);
    error.statusCode = 500;
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = loginSchema.safeParse(req.body);
    // validation failed (returns all errors in the request body)
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message).join(", ");
      return res.status(400).json({ success: false, message: messages });
    }

    const { email, password } = result.data;

    // find user by email and check password
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // if user exists but is not verified, prevent login and ask to verify email first
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in",
      });
    }

    // match password using the method defined in the user model
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // generate tokens, save hashed refresh token in db, and send refresh token as httpOnly cookie
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = hashToken(refreshToken);
    await user.save();
    sendRefreshTokenCookie(res, refreshToken);

    res.status(200).json({
      success: true,
      accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error logging in user: ", error.message);
    error.statusCode = 500;
    next(error);
  }
};

const googleLogin = async (req, res, next) => {
  try {
    const result = googleLoginSchema.safeParse(req.body);
    if (!result.success) {
      return res
        .status(400)
        .json({ success: false, message: result.error.issues[0].message });
    }
    const { tokenId } = result.data;

    const ticket = await googleClient.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, email_verified } = payload;

    if (!email_verified) {
      return res
        .status(400)
        .json({ success: false, message: "Google account email not verified" });
    }

    let user = await UserModel.findOne({ email });

    if (!user) {
      const randomPassword = crypto.randomBytes(16).toString("hex");
      user = await UserModel.create({
        email,
        name,
        password: randomPassword,
        isVerified: true,
        profileImage: picture,
      });
    } else {
      user.isVerified = true;
      await user.save();
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = hashToken(refreshToken);
    await user.save();
    sendRefreshTokenCookie(res, refreshToken);

    res.status(200).json({
      success: true,
      accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Error in Google login: ", error.message);
    error.statusCode = 500;
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No refresh token" });
    }

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await UserModel.findById(decoded.userId);

    if (!user || !user.refreshToken) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid refresh token" });
    }

    if (user.refreshToken !== hashToken(token)) {
      return res
        .status(401)
        .json({ success: false, message: "Refresh token mismatch" });
    }

    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);
    user.refreshToken = hashToken(newRefreshToken);
    await user.save();
    sendRefreshTokenCookie(res, newRefreshToken);

    res.status(200).json({ success: true, accessToken: newAccessToken });
  } catch (error) {
    console.log("Refresh token error:", error.message);
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      clearRefreshTokenCookie(res);
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired refresh token" });
    }
    error.statusCode = 500;
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        await UserModel.findByIdAndUpdate(decoded.userId, { refreshToken: "" });
      } catch (err) {
        console.log("logout cleanup error:", err.message);
      }
    }

    clearRefreshTokenCookie(res);
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Error logging out user: ", error.message);
    error.statusCode = 500;
    next(error);
  }
};

const me = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user profile: ", error.message);
    error.statusCode = 500;
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    const hashedToken = hashToken(token);

    const user = await UserModel.findOne({
      verificationToken: hashedToken,
      verificationTokenExpires: { $gt: Date.now() },
    });

    // if token is invalid or expired, redirect to login with failure message
    if (!user) {
      return res.redirect(`${process.env.CLIENT_URL}/login?verified=false`);
    }

    // if token is valid, mark user as verified and clear verification fields
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.redirect(`${process.env.CLIENT_URL}/login?verified=true`);
  } catch (error) {
    console.error("Error verifying email: ", error.message);
    res.redirect(`${process.env.CLIENT_URL}/login?verified=false`);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const result = forgotPasswordSchema.safeParse(req.body);
    if (!result.success) {
      return res
        .status(400)
        .json({ success: false, message: result.error.issues[0].message });
    }
    const { email } = result.data;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedResetToken = hashToken(resetToken);

    user.resetPasswordToken = hashedResetToken;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Reset your Fixly password",
        message: resetPasswordTemplate(resetUrl),
      });
      res.status(200).json({
        success: true,
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });
    } catch (emailErr) {
      console.log("Email send failed. Reset URL:", resetUrl);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });
      res.status(500).json({
        success: false,
        message: "Failed to send reset email. Please try again.",
      });
    }
  } catch (error) {
    console.error("Error in forgot password: ", error.message);
    error.statusCode = 500;
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const result = resetPasswordSchema.safeParse(req.body);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message).join(", ");
      return res.status(400).json({ success: false, message: messages });
    }
    const { newPassword } = result.data;
    const hashedToken = hashToken(token);

    const user = await UserModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired password reset token",
      });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message:
        "Password reset successful. You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Error in reset password: ", error.message);
    error.statusCode = 500;
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const result = updateProfileSchema.safeParse(req.body);
    if (!result.success) {
      return res
        .status(400)
        .json({ success: false, message: result.error.issues[0].message });
    }
    const { name, phoneNumber, bio } = result.data;

    const updates = {};

    if (name) updates.name = name.trim();
    if (phoneNumber !== undefined) updates.phoneNumber = phoneNumber;
    if (bio !== undefined) updates.bio = bio;

    if (req.file) {
      updates.profileImage = req.file.path;
    }

    if (Object.keys(updates).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No fields to update" });
    }

    const user = await UserModel.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select(
      "-password -verificationToken -verificationTokenExpires -resetPasswordToken -resetPasswordExpires -refreshToken",
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile: ", error.message);
    error.statusCode = 500;
    next(error);
  }
};

export {
  forgotPassword,
  googleLogin,
  login,
  logout,
  me,
  refreshToken,
  resetPassword,
  signup,
  updateProfile,
  verifyEmail,
};
