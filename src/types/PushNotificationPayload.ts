export interface SendResponse {
  id: string;  
  jsonrpc: string;
  result: Task;
}
export interface Message {
  role: "user" | "agent";
  parts: Part[];
  messageId: string;
  kind: "message";
  metadata?: Record<string, any> | null;
}

export interface TaskStatus {
  state: TaskState;
  message?: Message;
  timestamp: string; // ISO 8601
}

export interface Artifact {
  name?: string;
  description?: string;
  parts: Part[];
  metadata?: Record<string, any>;
  index?: number;
  append?: boolean;
  lastChunk?: boolean;
}

export interface Task {
  id: string;
  contextId?: string;
  status: TaskStatus;
  artifacts?: Artifact[];
  history?: Message[];
  metadata?: Record<string, any>;
}

export enum TaskState {
  SUBMITTED = "submitted",
  WORKING = "working",
  INPUT_REQUIRED = "input-required",
  COMPLETED = "completed",
  CANCELED = "canceled",
  FAILED = "failed",
  UNKNOWN = "unknown"
}

export type Part = TextPart | FilePart | DataPart;

export interface TextPart {
  kind: "text";
  text: string;
  metadata?: Record<string, any> | null; // e.g. "text/plain"
}

export interface DataPart {
  kind: "data";
  data: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface FilePart {
  kind: "file";
  file: FileContent;
  metadata?: Record<string, any>;
}

export interface FileContent {
  name?: string;
  mimeType?: string;
  bytes?: string;
  uri?: string;
}

