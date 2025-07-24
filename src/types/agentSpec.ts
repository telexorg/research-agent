export interface AgentSpec {
  name: string;
  description: string;
  url: string;
  version: string;
  iconUrl: string;
  documentationUrl: string;
  capabilities: AgentCapabilities;
  defaultInputModes: string[];
  defaultOutputModes: string[];
  skills: AgentSkill[];
  provider: AgentProvider;
  security: Record<string, string[]>[];
  securitySchemes: Record<string, SecurityScheme>;
  supportsAuthenticatedExtendedCard: boolean;
}

export interface AgentCapabilities {
  streaming?: boolean;
  pushNotifications?: boolean;
  stateTransitionHistory?: boolean;
}

export interface AgentProvider {
  organization: string;
  url?: string;
}
export interface AgentSkill {
  id: string;
  name: string;
  description?: string;
  tags?: string[];
  examples?: string[];
  inputModes?: string[];
  outputModes?: string[];
}

export interface SecurityScheme {
  type: string;
  scheme: string;
  in?: string;
  name?: string;
}

