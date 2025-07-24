import { conductGroqResearch, discoverTrendingTopics } from "../services/groq";
import { MessageResponse } from "../types/messageResponse";
import { TaskRequest } from "../types/taskRequest";
import { AgentSpec } from "../types/agentSpec";
import { Router } from "express";

const router = Router();


router.post("/", async (req, res) => {
  try {    
    const a2aRequest = req.body; // should match the TaskRequest format

    const inputText = a2aRequest?.params?.message?.parts?.[0]?.text?.trim() || "";
    const result = await conductGroqResearch(inputText);
    const response = buildResponse(a2aRequest, result.report, { sources: result.sources });

    res.json(response); // Telex-compliant MessageResponse
  } catch (err: any) {
    console.error("Groq A2A error:", err);
    res.status(500).json({
      jsonrpc: "2.0",
      id: req.body?.id ?? "unknown",
      error: {
        code: 500,
        message: "Research Agent A2A routing failed",
        data: err.message ?? "Unexpected error",
      },
    });
  }
});

// 

const buildResponse = (
  request: TaskRequest,
  text: string,
  metadata?: Record<string, any>
): MessageResponse => ({
  jsonrpc: "2.0",
  id: request.id,
  result: {
    role: "agent",
    kind: "message",
    messageId: crypto.randomUUID(),
    taskId: request.params.message.taskId,
    contextId: request.params.message.contextId,
    parts: [{ kind: "text", text }],
    metadata,
  },
});

const buildErrorResponse = (request: TaskRequest, error: string): MessageResponse =>
  buildResponse(request, `❌ Error: ${error}`);

export default router