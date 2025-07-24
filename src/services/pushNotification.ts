import axios from "axios";
import { SendResponse } from "../types/PushNotificationPayload";

const MAX_ATTEMPTS = 3;
const BASE_DELAY_MS = 1000; // initial backoff delay

export const sendToTelexWebhook = async (
  webhookUrl: string,
  apiKey: string,
  payload: SendResponse
): Promise<boolean> => {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await axios.post(webhookUrl, payload, {
        headers: {
          "X-AGENT-API-KEY": apiKey,
          "Content-Type": "application/json"
        },
        timeout: 8000 // optional: fail fast if Telex isn't responding
      });

      console.log(`✅ Push succeeded [attempt ${attempt}] → Status: ${res.status}`);
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data || err.message || "Unknown error";
      const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1); // exponential

      console.error(`❌ Push failed [attempt ${attempt}] → ${JSON.stringify(errorMessage, null, 2)}`);

      if (attempt < MAX_ATTEMPTS) {
        console.log(`⏳ Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        console.error("🚫 All retry attempts exhausted.");
        return false;
      }
    }
  }

  return false; // fallback safeguard
};