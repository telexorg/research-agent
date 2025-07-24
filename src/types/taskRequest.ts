export interface TaskRequest {
  jsonrpc: string;
  id: string;
  method: string;
  params: {
    message: {
      kind: "message";
      role: "user";
      messageId: string;
      contextId: string;
      taskId?: string | null;
      parts: {
        kind: "text";
        text: string;
        metadata: Record<string, any> | null;
      }[];
      metadata: {
        telex_user_id: string;
        telex_channel_id: string;
        org_id: string;
      };
    };
    configuration: {
      acceptedOutputModes: string[];
      historyLength: number;
      pushNotificationConfig: {
        url: string;
        token?: string | null;
        authentication?: {
          schemes: string[];
          credentials: string;
        };
      };
      blocking: boolean;
    };
    metadata?: Record<string, any> | null;
  };
}