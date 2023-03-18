import express from "express";
import { loginUser, logoutUser } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/api/login", loginUser);
router.post("/api/logout", logoutUser);

export default router;
