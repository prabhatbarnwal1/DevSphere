import pool from "../database/db.js";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwtUtils.js";

export const signup = async (req, res) => {
  const { username, email, password, phone } = req.body;

  try {
    // Check existing users
    const existingEmail = await pool.query(
      "SELECT 1 FROM users WHERE email=$1",
      [email]
    );
    if (existingEmail.rows.length) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const existingUsername = await pool.query(
      "SELECT 1 FROM users WHERE username=$1",
      [username]
    );
    if (existingUsername.rows.length) {
      return res.status(409).json({ error: "Username already taken" });
    }

    // Create user
    const hashed = await bcrypt.hash(password, 12);
    const userResult = await pool.query(
      "INSERT INTO users (username, email, password, phone) VALUES ($1,$2,$3,$4) RETURNING user_id, username, email, phone",
      [username, email, hashed, phone]
    );

    const user = userResult.rows[0];

    // Generate tokens
    const accessToken = generateAccessToken({
      user_id: user.user_id,
      username: user.username,
      email: user.email,
    });

    const refreshToken = generateRefreshToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Store refresh token
    await pool.query(
      "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
      [user.user_id, refreshToken, expiresAt]
    );

    // Set refresh token as HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        phone: user.phone,
      },
      accessToken,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);
    if (!result.rows.length) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      user_id: user.user_id,
      username: user.username,
      email: user.email,
    });

    const refreshToken = generateRefreshToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Clean old refresh tokens for this user
    await pool.query("DELETE FROM refresh_tokens WHERE user_id = $1", [
      user.user_id,
    ]);

    // Store new refresh token
    await pool.query(
      "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
      [user.user_id, refreshToken, expiresAt]
    );

    // Set refresh token cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        phone: user.phone,
      },
      accessToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const refreshToken = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({
      error: "Refresh token required",
      code: "REFRESH_TOKEN_REQUIRED",
    });
  }

  try {
    // Find refresh token in database
    const tokenResult = await pool.query(
      "SELECT rt.*, u.user_id, u.username, u.email FROM refresh_tokens rt JOIN users u ON rt.user_id = u.user_id WHERE rt.token = $1 AND rt.expires_at > NOW()",
      [refreshToken]
    );

    if (!tokenResult.rows.length) {
      // Clear invalid cookie
      res.clearCookie("refreshToken");
      return res.status(403).json({
        error: "Invalid or expired refresh token",
        code: "REFRESH_TOKEN_INVALID",
      });
    }

    const tokenData = tokenResult.rows[0];

    // Generate new tokens
    const newAccessToken = generateAccessToken({
      user_id: tokenData.user_id,
      username: tokenData.username,
      email: tokenData.email,
    });

    const newRefreshToken = generateRefreshToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Replace old refresh token with new one (token rotation)
    await pool.query(
      "UPDATE refresh_tokens SET token = $1, expires_at = $2 WHERE id = $3",
      [newRefreshToken, expiresAt, tokenData.id]
    );

    // Set new refresh token cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken: newAccessToken,
      user: {
        user_id: tokenData.user_id,
        username: tokenData.username,
        email: tokenData.email,
      },
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (refreshToken) {
    // Remove refresh token from database
    await pool.query("DELETE FROM refresh_tokens WHERE token = $1", [
      refreshToken,
    ]);
  }

  // Clear refresh token cookie
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
};

export const me = async (req, res) => {
  try {
    const userResult = await pool.query(
      "SELECT user_id, username, email, phone FROM users WHERE user_id = $1",
      [req.user.user_id]
    );

    if (!userResult.rows.length) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user: userResult.rows[0] });
  } catch (error) {
    console.error("Me endpoint error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
