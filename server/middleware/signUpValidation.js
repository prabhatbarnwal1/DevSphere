import { body } from "express-validator";

export const signupValidation = [
  body("username").trim().isLength({ min: 3, max: 50 }),
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 8 }),
  body("phone")
    .optional()
    .matches(/^[0-9]{10}$/),
];
