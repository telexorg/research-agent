import { GoogleGenAI } from "@google/genai";
import { systemInstruction } from "../utils/prompt";

const ai = new GoogleGenAI({
  vertexai: true,
  project: process.env.PROJECT_ID || "gen-lang-client-0617055657",
  location: process.env.PROJECT_LOCATION || "us-central1",
});

export interface Source {
  uri: string;
  title: string;
}

export interface ResearchResult {
  report: string;
  sources: Source[];
}

export const conductResearch = async (
  topic: string,
  keywords?: string
): Promise<ResearchResult> => {
  let userPrompt = `Please research the topic: "${topic}"`;
  if (keywords?.trim()) {
    userPrompt += `\nFocus on: "${keywords}"`;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.5,
        topP: 0.9,
        topK: 40,
        tools: [{ googleSearch: {} }],
      },
    });

    const report = response.text ?? "No report generated.";
    const groundingChunks =
      response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
    const sources = groundingChunks
      .map((chunk) => ({
        uri: chunk.web?.uri ?? "",
        title: chunk.web?.title ?? "Untitled",
      }))
      .filter((source) => source.uri);

    const uniqueSources = Array.from(
      new Map(sources.map((s) => [s.uri, s])).values()
    );

    return { report, sources: uniqueSources };
  } catch (error) {
    return {
      report: `Error: ${(error as Error).message}`,
      sources: [],
    };
  }
};
