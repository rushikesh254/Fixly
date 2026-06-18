import crypto from "crypto";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";
import {
  resetPasswordTemplate,
  verifyEmailTemplate,
} from "../utils/emailTemplates.js";
import sendEmail from "../utils/sendEmail.js";

// utility function to generate JWT token ( expiry time is 7 days)
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Controller function to handle user registration
// POST /api/auth/signup
const signup = async (req, res) => {
  try {
    // get name, email, password and role from request body
    const { name, email, password, role } = req.body;

    // validate input fields
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    //  validate role and set default role to "user" if not provided or invalid
    const allowedRoles = ["user", "provider"];
    const userRole = allowedRoles.includes(role) ? role : "user";

    // check if user with the same email already exists in the database
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // generate verification token (for email verification) and store its hashed version in DB for security
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const hashedVerificationToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    // create new user in the database with the provided name, email, password, role and verification token
    const user = await UserModel.create({
      name,
      email,
      password,
      role: userRole,
      verificationToken: hashedVerificationToken, // store hashed token in DB for security
      verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours (1 day) expiry
    });

    // send verification email to user with the verification token in the URL (verification link will be valid for 24 hours) verification token is sent in URL as a param and when user clicks on the link, frontend will make a request to backend with the token and then backend will verify the token and if valid then mark user as verified
    const verificationUrl = `${process.env.BACKEND_URL}/api/auth/verify-email/${verificationToken}`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Verify your Fixly account",
        message: verifyEmailTemplate(verificationUrl),
      });
    } catch (emailErr) {
      console.log("Email send failed. Verification URL:", verificationUrl);
    }

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error registering user: ", error.message);
    res.status(500).json({
      success: false,
      message: "Registration failed. Please try again.",
    });
  }
};

// Controller function to handle user login
// POST /api/auth/login
const login = async (req, res) => {
  try {
    // get email and password from request body
    const { email, password } = req.body;

    // validate input fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide email and password" });
    }

    // find user by email in the database
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // check if user is verified, if not then return 403 error
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in",
      });
    }

    // compare provided password with hashed password in the database using bcrypt's compare method (defined in user model)
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // generate JWT token for the user (expiry time is 7 days) and send it in httpOnly cookie for security
    const token = generateToken(user._id);

    // set token in httpOnly cookie for security
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // use secure cookies in production
      sameSite: "strict", // prevent CSRF attacks (only send cookies for same site requests)
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error logging in user: ", error.message);
    res
      .status(500)
      .json({ success: false, message: "Login failed. Please try again." });
  }
};

// Controller function to handle user logout
// POST /api/auth/logout
const logout = async (req, res) => {
  try {
    // Clear the token cookie to log out the user
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Error logging out user: ", error.message);
    res
      .status(500)
      .json({ success: false, message: "Logout failed. Please try again." });
  }
};

// Controller function to get user object
// GET /api/auth/me
const me = async (req, res) => {
  try {
    const user = req.user; // get user from auth middleware

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error fetching user profile: ", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch profile." });
  }
};

// Controller function to handle email verification
// GET /api/auth/verify-email/:token
const verifyEmail = async (req, res) => {
  try {
    // get token from url params
    const { token } = req.params;

    // compare hashed version of token from params with hashed token in DB to find user
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // find user with matching verification token and check if token is not expired
    const user = await UserModel.findOne({
      verificationToken: hashedToken,
      verificationTokenExpires: { $gt: Date.now() },
    });

    // if no user found with the token or token is expired then return error
    if (!user) {
      return res.redirect(`${process.env.CLIENT_URL}/login?verified=false`);
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.redirect(`${process.env.CLIENT_URL}/login?verified=true`);
  } catch (error) {
    console.log(error);
    res.redirect(`${process.env.CLIENT_URL}/login?verified=false`);
  }
};

const forgotPassword = async (req, res) => {
  try {
    // get email from request body
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide your email" });
    }

    // find user by email
    const user = await UserModel.findOne({ email });

    // always return the same response to prevent user enumeration
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If an account with that email exists, a password reset link has been sent.",
      });
    }

    // generate reset token and store its hashed version in DB for security
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedResetToken; // store hashed token in DB for security
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry

    await user.save({ validateBeforeSave: false }); // skip validation since we are not providing all required fields

    // send email to user with reset token in URL (reset link will be valid for 15 minutes)
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Reset your Fixly password",
        message: resetPasswordTemplate(resetUrl),
      });
      res.status(200).json({
        success: true,
        message: "If an account with that email exists, a password reset link has been sent.",
      });
    } catch (emailErr) {
      console.log("Email send failed. Reset URL:", resetUrl);
      // if email sending fails then clear the reset token and expiry from DB since user won't be able to reset password without the email
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
    res.status(500).json({
      success: false,
      message: "Failed to send reset email. Please try again.",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    // get token from url params and new password from request body
    const { token } = req.params;
    const { newPassword } = req.body;

    // validate new password
    if (!newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide a new password" });
    }

    // validate new password length
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // compare hashed version of token from params with hashed token in DB to find user
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // find user with matching reset token and check if token is not expired
    const user = await UserModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    // if no user found with the token or token is expired then return error
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired password reset token",
      });
    }

    // update user's password and clear reset token and expiry from DB
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
    res.status(500).json({
      success: false,
      message: "Failed to reset password. Please try again.",
    });
  }
};

export {
  forgotPassword,
  login,
  logout,
  me,
  resetPassword,
  signup,
  verifyEmail,
};
