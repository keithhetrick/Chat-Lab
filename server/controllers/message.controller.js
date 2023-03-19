import Message from "../models/message.model.js";
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
export const getUserMessagesById = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  try {
    const messages = await Message.find({
      sender: userId,
    }).sort({ createdAt: -1 });

    console.log("messages", messages);

    res.status(200).json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get user conversations from recipient & sender ID
// @route   GET /api/messages/:userId
// @access  Private
const getUserDataFromRequest = async (req) => {
  return new Promise((resolve, reject) => {
    const token = req.cookies?.token;

    if (token) {
      jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        {},
        (err, userData) => {
          if (err) return reject(err);

          resolve(userData);
        }
      );
    } else {
      reject("Unauthorized - no token");
    }
  });
};

export const getUserConversationsById = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  try {
    const userData = await getUserDataFromRequest(req);
    const ourUserId = userData?.userId;

    const messages = await Message.find({
      sender: { $in: [userId, ourUserId] },
      recipient: { $in: [userId, ourUserId] },
    }).sort({ createdAt: 1 });

    console.log("messages", messages);

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

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

    console.log("messageData", messageData);

    res.status(200).json({ success: true, message: messageData });
  } catch (error) {
    console.error(error);
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
