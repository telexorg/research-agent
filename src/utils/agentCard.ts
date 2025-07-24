export const getAgentCard = () => ({
  name: "Raz - Research Agent",
  description:
    "The Research Agent helps users conduct real-time research on any topic using AI-powered search, summarization, and synthesis. It delivers grounded insights from live sources with markdown formatting and SEO awareness.",
  url: "https://research-agent.onrender.com/api/a2a",
  version: "1.0.0",
  iconUrl:
    "https://your-cdn.com/images/research-agent-icon.png",
  documentationUrl: "https://your-research-agent-docs.com",
  capabilities: {
    streaming: false,
    pushNotifications: true,
  },
  defaultInputModes: ["application/json"],
  defaultOutputModes: ["application/json"],
  provider: {
    organization: "AI Research Services Org",
    url: "https://your-research-agent-url.com/api/v1/research-agent",
  },
  supportsAuthenticatedExtendedCard: true,
  skills: [
    {
      id: "conduct-research",
      name: "Conduct Research",
      description:
        "Delivers comprehensive reports on any topic using live search results and Groq-based synthesis.",
      tags: ["research", "web search", "groq", "summarization"],
      examples: [
        "Research Bitcoin and its market trends",
        "Summarize the latest innovations in AI",
        "Generate a markdown-formatted report grounded in real sources",
        "Conduct topic-based analysis using SEO keywords"
      ],
    },
    {
      id: "discover-trends",
      name: "Discover Trending Topics",
      description:
        "Identifies and summarizes 5–7 trending themes using search signals and real-time web data.",
      tags: ["trending", "seo", "insights", "groq"],
      examples: [
        "List trending topics in fintech",
        "Find SEO keywords for emerging health trends",
        "Summarize why a topic is gaining traction",
        "Generate structured topic summaries with search-based grounding"
      ],
    }
  ],
  security: [
    { TelexApiKey: ["read"] },
  ],
  securitySchemes: {
    TelexApiKey: {
      type: "apiKey",
      scheme: "Bearer",
      in: "header",
      name: "Authorization",
    },
  }
});