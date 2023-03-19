import express from "express";
import {
  getAllMessages,
  getUserMessagesById,
  getUserConversationsById,
  getMessageById,
  deleteMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/api/messages", getAllMessages);
router.get("/api/messages/:userId", getUserMessagesById);
router.get("/api/messages/:messageId", getMessageById);
router.get("/api/messages/:conversationId", getUserConversationsById);
router.delete("/api/messages/:id", deleteMessage);

export default router;
