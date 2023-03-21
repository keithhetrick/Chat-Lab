import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import asyncHandler from "express-async-handler";

// @desc    Get all messages
// @route   GET /api/messages
// @access  Public
export const getAllMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get user messages by ID
// @route   GET /api/messages/:userId
// @access  Private

// @desc    Get user conversations from recipient & sender ID
// @route   GET /api/messages/conversation/:id
// @access  Private

// @desc    Get single message by ID
// @route   GET /api/messages/:id
// @access  Private
export const getMessageById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const messageData = await Message.findById(id);

    if (!messageData) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.status(200).json({ success: true, messageData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update message
// @route   PUT /api/messages/:id
// @access  Private
export const updateMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  try {
    const updatedMessage = await Message.findByIdAndUpdate(
      id,
      {
        text,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.status(200).json({ success: true, updatedMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private
export const deleteMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const deletedMessage = await Message.findByIdAndDelete(id);

    if (!deletedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }

    res
      .status(200)
      .json({ success: true, message: `${id} deleted`, deletedMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
