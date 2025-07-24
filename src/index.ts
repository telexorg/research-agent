import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { conductResearch } from "./services/researchAgent";
import summarizeRoute from "./routes/summarize";
import agentCardRoute from "./routes/agentCardRoute";
import researchRoute from "./routes/research";
import { geminiConfig } from "./utils/prompt";

dotenv.config();

// src/config/gemini.ts

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/.well-known/agent.json", agentCardRoute);
// app.use("/api/summarize", summarizeRoute);
app.use("/api/a2a", researchRoute);

// app.post("/api/research", async (req, res) => {
//   const { topic, keywords } = req.body;
//   try {
//     const result = await conductResearch(topic, keywords);
//     res.json(result);
//   } catch (error) {
//     res
//       .status(500)
//       .json({
//         report: "Something went wrong while conducting research.",
//         sources: [],
//       });
//   }
// });

app.get("/", (req, res) => {
  res.send(
    "Welcome to the Research Agent API! Use the /api/research endpoint to conduct research."
  );
});

app.listen(PORT, () => {
  console.log(
    `Agent API is running on port http://localhost:${PORT}`
  );
});
