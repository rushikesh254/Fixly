import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";
import {
  resetPasswordTemplate,
  verifyEmailTemplate,
} from "../utils/emailTemplates.js";
import sendEmail from "../utils/sendEmail.js";
import { PRIVATE_USER_FIELDS } from "../utils/userFields.js";
import {
  clearRefreshTokenCookie,
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  sendRefreshTokenCookie,
} from "../utils/token.js";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  googleLoginSchema,
  loginSchema,
  resendVerificationSchema,
  resetPasswordSchema,
  signupSchema,
  updateProfileSchema,
} from "../validation/auth.validation.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Strip the sensitive fields from a user document so that login, google login
// and /me all hand back exactly the same shape to the client.
const sanitizeUser = (user) => {
  const {
    password,
    refreshToken,
    verificationToken,
    verificationTokenExpires,
    resetPasswordToken,
    resetPasswordExpires,
    ...safeUser
  } = user.toObject ? user.toObject() : user;

  return safeUser;
};

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
      // a provider signup is an application, an admin has to approve it before
      // the provider becomes discoverable by customers
      ...(userRole === "provider"
        ? { providerStatus: "pending", appliedAt: new Date() }
        : {}),
      verificationToken: hashedVerificationToken,
      verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours expiration
    });

    const verificationUrl = `${process.env.BACKEND_URL}/api/auth/verify-email/${verificationToken}`;
    let emailSent = true;
    try {
      await sendEmail({
        email: user.email,
        subject: "Verify your Fixly account",
        message: verifyEmailTemplate(verificationUrl),
      });
    } catch {
      emailSent = false;
      console.log("Email send failed. Verification URL:", verificationUrl);
    }

    res.status(201).json({
      success: true,
      emailSent,
      message: emailSent
        ? "Verification email sent. Please check your inbox."
        : "Account created, but the email could not be sent. Please try resending.",
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
    if (!user || user.isDeleted) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // an admin can block an account, blocked users cannot sign in
    if (user.status === "blocked") {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked. Please contact support.",
      });
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

    await user.populate("category", "name slug");

    res.status(200).json({
      success: true,
      accessToken,
      user: sanitizeUser(user),
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

    if (user && (user.isDeleted || user.status === "blocked")) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked. Please contact support.",
      });
    }

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

    await user.populate("category", "name slug");

    res.status(200).json({
      success: true,
      accessToken,
      user: sanitizeUser(user),
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
    const presentedHash = hashToken(token);

    // atomically swap the stored hash: only one request can win with a given
    // token value, so a replayed or already-rotated token is rejected instead
    // of silently minting a second session (single-use rotation).
    const newRefreshToken = generateRefreshToken(decoded.userId);
    const user = await UserModel.findOneAndUpdate(
      { _id: decoded.userId, refreshToken: presentedHash },
      { $set: { refreshToken: hashToken(newRefreshToken) } },
      { new: true },
    ).select(PRIVATE_USER_FIELDS);

    if (!user) {
      // the token is stale, was already rotated, or the account is gone.
      // invalidate the whole session and clear the dead cookie.
      await UserModel.findByIdAndUpdate(decoded.userId, { refreshToken: "" });
      clearRefreshTokenCookie(res);
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired refresh token" });
    }

    sendRefreshTokenCookie(res, newRefreshToken);
    res
      .status(200)
      .json({ success: true, accessToken: generateAccessToken(user._id) });
  } catch (error) {
    console.error("Refresh token error:", error.message);
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
        console.error("logout cleanup error:", err.message);
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
    // the provider ui needs the category name, not just its id
    await user.populate("category", "name slug");
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
    user.refreshToken = ""; // invalidate all existing sessions
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    clearRefreshTokenCookie(res);

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

const resendVerificationEmail = async (req, res, next) => {
  try {
    const result = resendVerificationSchema.safeParse(req.body);
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
          "If an account with that email exists, a verification email has been sent.",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "This account is already verified. You can log in.",
      });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const hashedVerificationToken = hashToken(verificationToken);

    user.verificationToken = hashedVerificationToken;
    user.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await user.save();

    const verificationUrl = `${process.env.BACKEND_URL}/api/auth/verify-email/${verificationToken}`;
    try {
      await sendEmail({
        email: user.email,
        subject: "Verify your Fixly account",
        message: verifyEmailTemplate(verificationUrl),
      });
    } catch {
      console.log(
        "Resend email failed. Verification URL:",
        verificationUrl,
      );
      return res.status(500).json({
        success: false,
        message:
          "Failed to send verification email. Please try again later.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Verification email sent successfully. Please check your inbox.",
    });
  } catch (error) {
    console.error("Error resending verification email: ", error.message);
    error.statusCode = 500;
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const result = changePasswordSchema.safeParse(req.body);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message).join(", ");
      return res.status(400).json({ success: false, message: messages });
    }
    const { currentPassword, newPassword } = result.data;

    const user = await UserModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from your current password",
      });
    }

    user.password = newPassword;
    user.refreshToken = ""; // invalidate all existing sessions
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully. Please log in again.",
    });
  } catch (error) {
    console.error("Error changing password: ", error.message);
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
    const { name, phoneNumber, bio, gender, dob } = result.data;

    const updates = {};

    if (name) updates.name = name.trim();
    if (phoneNumber !== undefined) updates.phoneNumber = phoneNumber;
    if (bio !== undefined) updates.bio = bio;
    if (gender !== undefined) updates.gender = gender;
    if (dob !== undefined) updates.dob = dob;

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
    })
      .select(PRIVATE_USER_FIELDS)
      .populate("category", "name slug");

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
  changePassword,
  forgotPassword,
  googleLogin,
  login,
  logout,
  me,
  refreshToken,
  resendVerificationEmail,
  resetPassword,
  signup,
  updateProfile,
  verifyEmail,
};
