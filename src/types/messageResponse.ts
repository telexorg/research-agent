export interface MessageResponse {
  jsonrpc: string;
  id: string;
  result: {
    role: "agent";
    kind: "message";
    messageId: string;
    taskId?: string | null;
    contextId: string;
    parts: MessageResponsePart[];
    metadata?: Record<string, any> | null;
  };
}

export interface MessageResponsePart {
  kind: "text";
  text: string;
}