import { GoogleGenerativeAI } from "@google/generative-ai";
import { geminiConfig } from "../utils/prompt";
import dotenv from "dotenv";
dotenv.config();
const apiKey = process.env.GEMINI_API_KEY!;

// console.log(`key is ${apiKey} and project id is .projectId}"`);
// if (!geminiConfig.apiKey) {
//   throw new Error("Missing Gemini API key. Please set GEMINI_API_KEY in your .env file.");
// }

const genAI = new GoogleGenerativeAI(apiKey);

export async function summarizeWithGemini(content: string, title: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
  Summarize the following article into a clean blog post. Add a short, engaging headline.

  Title: ${title}

  Content:
  ${content}
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
