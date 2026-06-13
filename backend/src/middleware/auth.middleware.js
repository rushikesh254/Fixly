import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";

// middleware
// this middleware checks token and verifies authneticatted or not if yes then add user data with request obj,, can be accesed using req.user in next controllers
const protect = async (req, res, next) => {
  const token = req.cookies?.token; // get token from cookies(if it exists)
  if (!token) {
    return res.status(401).json({ error: "please login first" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await UserModel.findById(decoded.userId).select("-password"); // exclude password from user data for security)
    if (!user) {
      return res.status(401).json({ error: "user not found" });
    }
    req.user = user;

    next();
  } catch (error) {
    console.log("Bad Token", error.message);
    return res
      .status(401)
      .json({ error: "invalid token , please Signup first " });
  }
};

// gets roles as arguments and checks if the user has the required role to access the route, if not then return 403 error (dont need to check if user is authenticated or not because this middleware is used after the protect middleware which checks for authentication)
const autherize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "you are not authorized" });
    }
    next();
  };
};

export { autherize, protect };
