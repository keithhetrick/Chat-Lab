import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

// @desc    Login
// @route   POST /login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const candidate = await User.findOne({ username });

  if (candidate) {
    const authPassword = bcrypt.compareSync(password, candidate.password);
    if (authPassword) {
      jwt.sign(
        { userId: candidate._id, username },
        process.env.ACCESS_TOKEN_SECRET,
        {},
        (err, token) => {
          res.cookie("token", token, { sameSite: "none", secure: true }).json({
            success: true,
            id: candidate._id,
          });
        }
      );
    }
  }

  console.log(`\nUser ${username} logged in\n`);
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
