import express from "express";
import {
  loginUser,
  logoutUser,
  getUserToken,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/api/login", loginUser);
router.post("/api/logout", logoutUser);
router.get("/api/profile", getUserToken);

export default router;
