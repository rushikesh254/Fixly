import crypto from "crypto";
import jwt from "jsonwebtoken";

// generate an access token with a short expiration time (e.g., 15 minutes)
export const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

// generate a refresh token with a longer expiration time (e.g., 7 days)
export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

// hash the refresh token before storing it in the database for security reasons
export const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

// set the refresh token in an HTTP-only cookie
export const sendRefreshTokenCookie = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });
};

// clear the refresh token cookie when logging out
export const clearRefreshTokenCookie = (res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
};
