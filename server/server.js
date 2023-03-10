"use strict";

import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan, { token } from "morgan";
import corsOptions from "./config/corsOptions.js";
import { logger } from "./middleware/logger.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import User from "./models/user.model.js";
import Message from "./models/message.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { WebSocketServer } from "ws";

import connectDB from "./config/mongoose.config.js";

/* CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

const bcryptSalt = bcrypt.genSaltSync(10);

/* ENVIRONMENT VARIABLES */
const PORT = process.env.PORT;
const ENVIRONMENT = process.env.NODE_ENV;
const DB = process.env.MONGODB_URL;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

/* MIDDLEWARE */
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors(corsOptions));

/* MIDDLEWARE LOGGER */
app.use(logger);

const getUserDataFromRequest = async (req) => {
  return new Promise((resolve, reject) => {
    const token = req.cookies?.token;

    if (token) {
      jwt.verify(token, ACCESS_TOKEN_SECRET, {}, (err, userData) => {
        if (err) return reject(err);

        resolve(userData);
      });
    } else {
      reject("Unauthorized - no token");
    }
  });
};

app.get("/test", (req, res) => {
  res.json(
    `Hello from server http://localhost:${PORT}! Currently running on ${ENVIRONMENT} mode.`
  );
});

app.get("/messages/:userId", async (req, res) => {
  const { userId } = req.params;

  const userData = await getUserDataFromRequest(req);
  const ourUserId = userData?.userId;

  const messages = await Message.find({
    sender: { $in: [userId, ourUserId] },
    recipient: { $in: [userId, ourUserId] },
  }).sort({ createdAt: 1 });

  res.json(messages);
});

app.get("/profile", (req, res) => {
  const token = req.cookies?.token;

  if (token) {
    jwt.verify(token, ACCESS_TOKEN_SECRET, {}, (err, userData) => {
      if (err) return res.status(403).json({ error: err });

      res.json(userData);
    });
  } else {
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const candidate = await User.findOne({ username });

  if (candidate) {
    const authPassword = bcrypt.compareSync(password, candidate.password);
    if (authPassword) {
      jwt.sign(
        { userId: candidate._id, username },
        ACCESS_TOKEN_SECRET,
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
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
    const createdUser = await User.create({
      username: username,
      password: hashedPassword,
    });
    jwt.sign(
      { userId: createdUser._id, username },
      ACCESS_TOKEN_SECRET,
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
    res.status(500).json({ success: false, error: err });
  }
});

/* ERROR HANDLING */
app.use(errorHandler);
app.use(notFound);

process.on("uncaughtException", (err) => {
  console.error("\nUNCAUGHT EXCEPTION! Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

/* SERVER CONFIG */
const startServer = async () => {
  try {
    connectDB(DB);
    const server = app.listen(PORT, () =>
      console.log(`\nListening on port ${PORT} on ${ENVIRONMENT} mode`)
    );

    /* WEB SOCKET CONFIG */
    const wss = new WebSocketServer({ server });

    wss.on("connection", (connection, req) => {
      // Get token from cookie
      const cookies = req.headers.cookie;

      if (cookies) {
        const tokenCookieStr = cookies
          .split(";")
          .find((str) => str.startsWith("token="));
        if (tokenCookieStr) {
          const token = tokenCookieStr.split("=")[1];
          jwt.verify(token, ACCESS_TOKEN_SECRET, {}, (err, userData) => {
            if (err) return res.status(403).json({ error: err });

            // connection.send(`Welcome ${userData.username}!`);

            const { userId, username } = userData;
            connection.userId = userId;
            connection.username = username;
          });
        }
      }

      connection.on("message", async (message) => {
        const messageData = JSON.parse(message.toString());
        const { recipient, text } = messageData;

        if (recipient && text) {
          const messageDoc = await Message.create({
            sender: connection?.userId,
            recipient,
            text,
          });

          [...wss.clients]
            .filter((client) => client.userId === recipient)
            .forEach((client) =>
              client.send(
                JSON.stringify({
                  text,
                  sender: connection?.userId,
                  recipient,
                  _id: messageDoc?._id,
                })
              )
            );
        }
      });

      // Notify all clients of new connection (when a new user logs in/someone connects)
      [...wss.clients].forEach((client) => {
        client.send(
          JSON.stringify({
            online: [...wss.clients].map((c) => ({
              userId: c.userId,
              username: c.username,
            })),
          })
        );
        // client.send(`There are ${wss.clients.size} clients connected.`);
      });
    });
  } catch (error) {
    console.error("\nERROR:", error);
  }
};
startServer();
