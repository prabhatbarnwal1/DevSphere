import express from "express";
import {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  getUserPosts,
} from "../controllers/postController.js";
import { postValidation } from "../middleware/postValidation.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.get("/", getAllPosts);
router.get("/:user_id", getUserPosts);
router.post("/", validate(postValidation), createPost);
router.patch("/:id", validate(postValidation), updatePost);
router.delete("/:id", deletePost);

export default router;
