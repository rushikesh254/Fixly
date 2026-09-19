import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import errorHandler from "./middleware/error.middleware.js";
import { apiLimiter } from "./middleware/rate.middleware.js";
import adminRoutes from "./routes/admin.routes.js";
import authRoutes from "./routes/auth.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import providerRoutes from "./routes/provider.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import serviceRoutes from "./routes/service.routes.js";
import serviceTypeRoutes from "./routes/serviceType.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

// trust a single proxy hop so rate limiting sees real client IPs on managed hosts
app.set("trust proxy", 1);

// middlewares

app.use(helmet()); // set security-related HTTP headers
app.use(express.json()); // allow JSON data in the request body
app.use(cookieParser()); // parse cookies in the request headers
app.use(express.urlencoded({ extended: true })); // allow urlencoded data in the request body

app.use(
  cors({
    origin: process.env.CROSS_ORIGIN || "http://localhost:5173", // allow requests from this origin
    credentials: true, // allow cookies and other credentials in the requests
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"], // allow these headers in the requests
  }),
);

// apply rate limiting to all routes
app.use(apiLimiter);

// routes
app.get("/", (req, res) => {
  res.json({ success: true, message: "Fixly Server is running" });
});

// healthcheck route

app.get("/health", (req, res) => {
  res.json({ success: true, message: "Server is healthy" });
});

// auth routes
app.use("/api/auth", authRoutes);

// category routes
app.use("/api/categories", categoryRoutes);

// service catalogue routes ( the titles providers can publish a service under )
app.use("/api/service-types", serviceTypeRoutes);

// service routes
app.use("/api/services", serviceRoutes);

// booking routes
app.use("/api/bookings", bookingRoutes);

// review routes
app.use("/api/reviews", reviewRoutes);

// signed in user routes ( saved services, address, account )
app.use("/api/users", userRoutes);

// provider routes ( public profile and provider self service )
app.use("/api/providers", providerRoutes);

// admin routes
app.use("/api/admin", adminRoutes);

// public contact form
app.use("/api/contact", contactRoutes);

// centralized error handling middleware
app.use(errorHandler);

export default app;
