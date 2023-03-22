import mongoose from "mongoose";

const OpenAISchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    prompt: String,
    response: String,
  },
  {
    timestamps: true,
  }
);

const OpenAI = mongoose.model("OpenAI", OpenAISchema);

export default OpenAI;
