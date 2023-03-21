import express from "express";
import {
  getAllMessages,
  getMessageById,
  updateMessage,
  deleteMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/api/messages", getAllMessages);
router.get("/api/messages/conversation/:id", getMessageById);
router.patch("/api/messages/:id", updateMessage);
router.delete("/api/messages/:id", deleteMessage);

export default router;
