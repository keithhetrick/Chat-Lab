import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

// @desc    Login
// @route   POST /login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const targetLength = 4;

  try {
    if (!username && !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    } else if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "Password is required" });
    } else if (!username) {
      return res
        .status(400)
        .json({ success: false, message: "Username is required" });
    } else if (password.length < targetLength) {
      return res.status(400).json({
        success: false,
        message: `Password must be at least ${targetLength} characters`,
      });
    } else if (username.length < targetLength) {
      return res.status(400).json({
        success: false,
        message: `Username must be at least ${targetLength} characters`,
      });
    }

    const candidate = await User.findOne({ username }).exec();

    if (!candidate) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    } else {
      const authPassword = bcrypt.compareSync(password, candidate.password);
      if (authPassword) {
        jwt.sign(
          { userId: candidate._id, username },
          process.env.ACCESS_TOKEN_SECRET,
          {},
          (err, token) => {
            res
              .cookie("token", token, { sameSite: "none", secure: true })
              .json({
                success: true,
                id: candidate._id,
              });
          }
        );
      }
    }

    console.log(`\nUser ${username} logged in\n`);

    res.status(200).json({ success: true, message: "User logged in" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @desc    Logout
// @route   GET /logout
// @access  Public
export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", { sameSite: "none", secure: true }).json({
    success: true,
    message: "User logged out",
  });

  console.log("\nUser logged out");
});

// @desc    Get user token data
// @route   GET /profile
// @access  Private
export const getUserToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.token;

  try {
    if (!token || token === "undefined" || token === "null") {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ success: false, message: "Forbidden" });
      }

      res.status(200).json({ success: true, decoded });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});
