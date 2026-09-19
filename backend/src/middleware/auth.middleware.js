import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";
import { PRIVATE_USER_FIELDS } from "../utils/userFields.js";

// Middleware to protect routes and ensure the user is authenticated

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "Please login first" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await UserModel.findById(decoded.userId).select(
      PRIVATE_USER_FIELDS,
    );
    if (!user || user.isDeleted) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }
    if (!user.isVerified) {
      return res
        .status(403)
        .json({ success: false, message: "Please verify your email first" });
    }
    // an admin can block an account at any time, so it is checked on every request
    if (user.status === "blocked") {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked. Please contact support.",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Bad Token", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please login again.",
    });
  }
};

// Middleware to check if the user has the required role(s)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ success: false, message: "You are not authorized" });
    }
    next();
  };
};

export { authorize, protect };
