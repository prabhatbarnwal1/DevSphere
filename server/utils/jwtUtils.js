import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRY || "15m",
    issuer: "devsphere",
    audience: "devsphere-client",
  });
};

export const generateRefreshToken = () => {
  return randomBytes(64).toString("hex");
};

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    throw new Error("Invalid access token");
  }
};

export const decodeToken = (token) => {
  return jwt.decode(token);
};

export const isTokenExpired = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) return true;
    return Date.now() >= decoded.exp * 1000;
  } catch {
    return true;
  }
};
