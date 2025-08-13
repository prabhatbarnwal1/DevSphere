import { body } from "express-validator";

export const postValidation = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 255 })
    .withMessage("Title must not exceed 255 characters"),
  body("content").notEmpty().withMessage("Content is required"),
  body("owner_id").isInt().withMessage("Owner ID must be an integer"),
  body("collab").optional().isBoolean(),
];
