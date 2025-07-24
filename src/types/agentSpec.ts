export interface AgentSpec {
  name: string;
  description: string;
  url: string;
  version: string;
  iconUrl: string;
  documentationUrl: string;
  capabilities: {
    streaming: boolean;
    pushNotifications: boolean;
  };
  defaultInputModes: string[];
  defaultOutputModes: string[];
  skills: Skill[];
  provider: {
    organization: string;
    url: string;
  };
  security: Record<string, string[]>[];
  securitySchemes: Record<string, SecurityScheme>;
  supportsAuthenticatedExtendedCard: boolean;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  tags: string[];
  examples: string[];
}

export interface SecurityScheme {
  type: string;
  scheme: string;
  in?: string;
  name?: string;
}