import express from "express";
import {
  createOpenAIResponse,
  getOpenAIResponses,
} from "../controllers/openai.controller.js";

const router = express.Router();

router.post("/api/openai", createOpenAIResponse);
router.get("/api/openai", getOpenAIResponses);

export default router;
