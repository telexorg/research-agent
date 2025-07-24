import express from "express";
import { fetchPageContent } from "../services/scraper";
import { summarizeWithGemini } from "../services/gemini";

const router = express.Router();

router.post("/", async (req, res) => {
  const { url } = req.body;

  if (!url) return res.status(400).json({ message: "URL is required" });

  try {
    const { title, content } = await fetchPageContent(url);
    const summary = await summarizeWithGemini(content, title);
    res.json({ title, summary });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Failed to summarize" });
  }
});

export default router;
