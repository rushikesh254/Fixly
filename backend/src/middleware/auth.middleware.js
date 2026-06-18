import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";

// middleware

// checks if the user is authenticated or not by checking the token in the cookies, if not then return 401 error also checks if the user is verified or not, if not then return 403 error
const protect = async (req, res, next) => {
  const token = req.cookies?.token; // get token from cookies(if it exists)
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Please login first" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await UserModel.findById(decoded.userId).select("-password"); // exclude password from user data for security)
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }
    if (!user.isVerified) {
      return res
        .status(403)
        .json({ success: false, message: "Please verify your email first" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("Bad Token", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please login again.",
    });
  }
};

// checks if the user has the required role(s) to access a route, if not then return 403 error like it is used in the booking routes to check if the user is a customer or a service provider before allowing them to create a booking or view their bookings
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
