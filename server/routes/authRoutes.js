import express from "express";
import {
  signup,
  login,
  refreshToken,
  logout,
  me,
} from "../controllers/authController.js";
import { signupValidation } from "../middleware/signUpValidation.js";
import { validate } from "../middleware/validate.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", validate(signupValidation), signup);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);
router.get("/me", authenticateToken, me);

export default router;
