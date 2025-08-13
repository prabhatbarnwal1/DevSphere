import express from "express";
import { getUser, deleteUser } from "../controllers/userController.js";

const router = express.Router();

router.get("/:user_id", (req, res) => getUser(req, res));

router.delete("/:user_id", (req, res) => deleteUser(req, res));

export default router;
