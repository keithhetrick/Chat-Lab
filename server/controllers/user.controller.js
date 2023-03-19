import User from "../models/user.model.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const bcryptSalt = bcrypt.genSaltSync(10);

// @desc    Create user profile
// @route   POST /api/users/profile
// @access  Public
export const createUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
    const createdUser = await User.create({
      username: username,
      password: hashedPassword,
    });
    jwt.sign(
      { userId: createdUser._id, username },
      process.env.ACCESS_TOKEN_SECRET,
      {},
      (err, token) => {
        if (err) return res.status(500).json({ error: err });
        res
          .cookie("token", token, { sameSite: "none", secure: true })
          .status(201)
          .json({
            success: true,
            id: createdUser._id,
            message: `User created: ${username}`,
          });
      }
    );
  } catch (err) {
    console.error("\nERROR FROM USER CONTROLLER:", err);
    res.status(500).json({ success: false, error: err });
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Public
export const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({}).select("-password");

    if (!users?.length) {
      return res.status(404).json({ message: "No users found" });
    }

    // sort user by newest first
    users.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Fetching users failed - ${err.message}`,
    });
  }
});

// @desc    Get users by username
// @route   GET /api/users/:username
// @access  Public
export const getUserByUsername = asyncHandler(async (req, res) => {
  const users = await User.find({}, { _id: 1, username: 1 });
  res.json(users);
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
export const getUserById = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Fetching user failed - ${err.message}`,
    });
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // check for duplicate email exists
    const candidate = await User.findOne({ username })
      .collation({
        locale: "en",
        strength: 2,
      })
      .exec();

    if (candidate && candidate?._id.toString() !== req.params.id) {
      return res.status(409).json({
        success: false,
        message: `Unable to update user - "${email}" already exists`,
      });
    }

    if (user) {
      user.username = username || user.username;
      user.password = password
        ? bcrypt.hashSync(password, bcryptSalt)
        : user.password;

      const updatedUser = await user.save();

      res.status(200).json({
        success: true,
        message: "User updated",
        user: updatedUser,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Updating user failed - ${err.message}`,
    });
  }
});

// @desc    Delete user profile
// @route   DELETE /api/users/profile
// @access  Private
export const deleteUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ success: true, message: `User ${user.username} deleted` });
  } catch (error) {}
});
