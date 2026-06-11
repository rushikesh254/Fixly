import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // allow urlencoded data in the request body
app.use(express.static("public")); // serve static files from the public directory
app.use(cookieParser()); // parse cookies in the request headers

app.use(
  cors({
    origin: process.env.CROSS_ORIGIN || "http://localhost:5174", // allow requests from this origin
    credentials: true, // allow cookies and other credentials in the requests
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"], // allow these headers in the requests
  }),
);

// routes

app.get("/", (req, res) => {
  res.json({ message: "Fixly Server is running" });
});

// auth routes
import authRoutes from "./routes/auth.routes.js";
app.use("/api/auth", authRoutes);

export default app;
