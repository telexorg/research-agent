import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { conductGroqResearch, discoverTrendingTopics } from "../services/groq";
import { Router } from "express";
import { buildPushNotificationPayload, buildResponse } from "../utils/responseBuilder";
import { sendToTelexWebhook } from "../services/pushNotification";
import { Message, TaskState, TextPart } from "../types/PushNotificationPayload";

const router = Router();


// router.post("/", async (req, res) => {
//   try {    
//     const a2aRequest = req.body; // should match the TaskRequest format

//     const inputText = a2aRequest?.params?.message?.parts?.[0]?.text?.trim() || "";
//     const result = await conductGroqResearch(inputText);
//     const response = buildResponse(a2aRequest, result.report, { sources: result.sources });

//     res.json(response); // Telex-compliant MessageResponse
//   } catch (err: any) {
//     console.error("Groq A2A error:", err);
//     res.status(500).json({
//       jsonrpc: "2.0",
//       id: req.body?.id ?? "unknown",
//       error: {
//         code: 500,
//         message: "Research Agent A2A routing failed",
//         data: err.message ?? "Unexpected error",
//       },
//     });
//   }
// });



router.post("/", async (req, res) => {
  try {
    const a2aRequest = req.body;

    // Extract input & identifiers
    const inputText = a2aRequest?.params?.message?.parts?.[0]?.text?.trim() || "";
    const requestId = a2aRequest?.id || uuidv4();
    const webhookUrl = a2aRequest?.params?.configuration?.pushNotificationConfig?.url;
    const apiKey = a2aRequest?.params?.configuration?.pushNotificationConfig?.authentication?.credentials;

    if (!inputText || !webhookUrl || !apiKey) {
      return res.status(400).json({
        jsonrpc: "2.0",
        id: requestId,
        error: {
          code: 400,
          message: "Missing input, webhook URL, or API key",
        },
      });
    }

    console.log("Received A2A request:", {
      requestId,
      inputText,
      webhookUrl,
      apiKey: apiKey.slice(0, 4) + "****", // Mask API key for logs
    });

    // Submit initial SUBMITTED task immediately
    const taskId = uuidv4();
    res.json({
      jsonrpc: a2aRequest.jsonrpc,
      id: requestId,
      result: {
        id: taskId,
        status: {
          state: TaskState.SUBMITTED,
          message: {
            role: "agent",
            kind: "message",
            messageId: uuidv4(),
            parts: [{  kind: "text" , text: "Research task submitted"}] as TextPart[],
          } as Message,
        },
      },
    });

    // Start async research
    (async () => {
      try {
        const result = await conductGroqResearch(inputText);

        const reportMarkdown = result?.report || "No report generated.";
        const pushPayload = buildPushNotificationPayload(requestId, reportMarkdown, taskId, a2aRequest);

        console.log("sending push payload:", JSON.stringify(pushPayload, null, 2));

        const isSucceeded = await sendToTelexWebhook(webhookUrl, apiKey, pushPayload);
        if (!isSucceeded) {
          console.error("Failed to send push notification");
          return;
        }
        console.log("Push sent successfully");
      } catch (error:any) {
        console.error("Background research failed:", error.message);
      }
    })();

  } catch (err:any) {
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


export default router