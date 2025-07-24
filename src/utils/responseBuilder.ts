import { Message, SendResponse, TaskState, TaskStatus, TextPart } from "../types/PushNotificationPayload";
import { v4 as uuidv4 } from "uuid";
import { TaskRequest } from "../types/taskRequest";
import { MessageResponse, MessageResponsePart } from "../types/messageResponse";

export const buildPushNotificationPayload = (
  requestId: string,
  reportMarkdown: string,
  taskId: string,
  a2aRequest: TaskRequest
): SendResponse => {

  return {
    id: requestId,
    jsonrpc: a2aRequest.jsonrpc,
    result: {
      id: taskId,
      contextId: a2aRequest.params.message.contextId,      
      status: {
        state: TaskState.COMPLETED,
        message: {
          role: "agent",
          messageId: uuidv4(),
          kind: "message",
          parts: [
            {
              kind: "text",
              text: "Research completed successfully.",
              metadata: { contentType: "text/plain" }
            }
          ] as TextPart[],
        } as Message
      } as TaskStatus,
      artifacts: [
        {
          parts: [
            {
              kind: "text",
              text: reportMarkdown,
              metadata: { contentType: "text/plain" }
            }
          ] as TextPart[],
        }
      ]
    }
  };
};

export const buildResponse = (
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
    parts: [{ kind: "text", text }] as TextPart[],
    metadata,
  },
});

export const buildErrorResponse = (request: TaskRequest, error: string): MessageResponse =>
  buildResponse(request, `❌ Error: ${error}`);
