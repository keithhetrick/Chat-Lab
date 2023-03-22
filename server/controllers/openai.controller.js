import OpenAI from "../models/openai.model.js";
import dotenv from "dotenv";
import { openai } from "../server.js";

dotenv.config();

// @desc    Create openai response
// @route   POST /api/openai
// @access  Public
export const createOpenAIResponse = async (req, res) => {
  try {
    const { sender, prompt } = req.body;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `/*${prompt}*/`,
      temperature: 0,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const responseData = await OpenAI.create({
      sender,
      prompt,
      response: response.data.choices[0].text,
    });

    res.status(200).json({ success: true, data: responseData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get openai responses
// @route   GET /api/openai
// @access  Public
export const getOpenAIResponses = async (req, res) => {
  try {
    const openaiResponses = await OpenAI.find()
      .populate("sender")
      .populate("prompt")
      .populate("response");

    console.table(openaiResponses);

    res.status(200).json({ success: true, data: openaiResponses });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
