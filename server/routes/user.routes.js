import express from "express";
import {
  createUser,
  getAllUsers,
  getUserByUsername,
  // getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/api/users", getAllUsers);
router.get("/people", getUserByUsername);
router.patch("/api/users/:id", updateUser);
router.post("/register", createUser);
router.delete("/api/delete/:id", deleteUser);

export default router;
