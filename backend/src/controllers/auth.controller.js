import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";

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
    const { name, email, password, role } = req.body;

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

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const user = await UserModel.create({
      name,
      email,
      password,
      role: role || "user",
    });

    const token = generateToken(user._id);

    // set token in httpOnly cookie for security

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // use secure cookies in production
      sameSite: "strict", // prevent CSRF attacks (only send cookies for same site requests)
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
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
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide email and password" });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

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

export { login, logout, me, signup };
