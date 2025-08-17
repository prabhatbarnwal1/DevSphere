import express from "express";
import {
  createUserInfo,
  fetchUserInfo,
  editUserInfo,
} from "../controllers/userInfoController.js";

const router = express.Router();

router.get("/:user_id", (req, res) => fetchUserInfo(req, res));

router.post("/", (req, res) => createUserInfo(req, res));

router.put("/:user_id", (req, res) => editUserInfo(req, res));

export default router;
