import express from "express";
import {
  createUser,
  getAllUsers,
  getUserByUsername,
  getSingleUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/api/users", getAllUsers);
router.get("/api/people", getUserByUsername);
router.get("/api/users/:id", getSingleUserById);
router.patch("/api/users/:id", updateUser);
router.post("/api/register", createUser);
router.delete("/api/delete/:id", deleteUser);

export default router;
