import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import errorHandler from "./middleware/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import serviceRoutes from "./routes/service.routes.js";

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // allow urlencoded data in the request body
app.use(express.static("public")); // serve static files from the public directory
app.use(cookieParser()); // parse cookies in the request headers

app.use(
  cors({
    origin: process.env.CROSS_ORIGIN || "http://localhost:5173", // allow requests from this origin
    credentials: true, // allow cookies and other credentials in the requests
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"], // allow these headers in the requests
  }),
);

// routes

app.get("/", (req, res) => {
  res.json({ success: true, message: "Fixly Server is running" });
});

// auth routes
app.use("/api/auth", authRoutes);

// category routes
app.use("/api/categories", categoryRoutes);

// service routes

app.use("/api/services", serviceRoutes);

// booking routes
app.use("/api/bookings", bookingRoutes);

// review routes

app.use("/api/reviews", reviewRoutes);

// centralized error handling middleware

app.use(errorHandler);

export default app;
