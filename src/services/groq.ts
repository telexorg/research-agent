export interface TrendingTopic {
  topic: string;
  description: string;
  keywords: string[];
}

export interface TrendingTopicsResult {
  topics: TrendingTopic[];
  error?: string;
}
// groqResearchAgent.ts

export interface Source {
  title: string;
  uri: string;
}

export interface ResearchResult {
  report: string;
  sources: Source[];
}

export const conductGroqResearch = async (
  topic: string,
  keywords?: string
): Promise<ResearchResult> => {
  const systemPrompt = `
    Your name is Raz, you are a world-class AI research assistant, capable of performing two distinct tasks: topic research and trending topic discovery. You must follow the correct behavior based on the user's intent.

    ## Task 1: Research a Given Topic
    If the user requests a research report:
    - Conduct in-depth research using grounded information from search results.
    - Focus on any provided keywords, if provide, as the core angle or scope.
    - Generate a well-structured report using clear Markdown formatting.

    ## Keyword Inclusion
    - For blog-worthy topics only, include a section titled “SEO Keywords” after the main report only when asked to, outline them in one sentence.
    - SEO keywords must reflect actual popular search queries related to the topic.

    -## Sources Section for reports only
    - Only when asked to conduct a research, end the research with a section titled “Sources”.
    - For each referenced source:
      - Include the **title** of the article or page in one line.
      - Provide the **URL** to the source in the next line.
    - Only include sources that were actually used or cited in the report.
    - Do NOT include a "Sources" section if no sources were used in the report.

    ## Task 2: Suggest Trending Topics
    If the user requests trending topic ideas or suggestions, perform a websearch to:
    - Identify 5–7 emerging topics on the users area of interest based on current search trends.
    - For each topic:
      1. Provide a one-sentence description explaining its relevance.
      2. List 3–5 SEO-friendly keywords people are actively searching for presented as inline.
    - Use Markdown formatting for clarity.
    - Do NOT include a full research report in this mode.
    - Ground all suggestions using live search data; do NOT guess or invent.

    ## General Rules
    - Do not fabricate information or provide unsupported opinions.
    - Always use real, live search results to ground your research responses.
    - Always use a consistent, skimmable Markdown structure.
    - All section and subsection titles should be in **bold**.
    - Avoid repetition, filler, or unsupported opinions.
    - Don't tell the user everything about you, just tell him or her enough to understand your capabilities.
    - Keep tone professional, friendly, focused, and contextually aware.
    - Not everything should be a report, only provide a report when asked to conduct research.
    - Clarify the user's intent if it is ambiguous.
  `;

  const query = `${topic} ${keywords || ""}`.trim();

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "compound-beta",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: topic },
      ]
    }),
  });

  const result = await response.json();

  console.log("Groq response:", result);
  const content = result?.choices?.[0]?.message?.content || "No report.";
  const searchResults = result?.choices?.[0]?.message?.executed_tools?.[0]?.search_results?.results || [];

  const sources: Source[] = searchResults.map((item: any) => ({
    title: item.title,
    uri: item.url,
  }));

  return {
    report: content,
    sources,
  };
};


export const discoverTrendingTopics = async (
  areaOfInterest: string,
  keywords?: string
): Promise<TrendingTopicsResult> => {
  const prompt = `
    Based on recent search trends, identify 5–7 trending topics in the area of "${areaOfInterest}".
    ${keywords ? `Focus on topics related to: "${keywords}".` : ""}
    For each topic, provide:
    1. A brief, one-sentence description.
    2. A list of 3–5 popular SEO keywords.
    Return a pure JSON object like: { "topics": [ { "topic": "...", "description": "...", "keywords": ["..."] }, ... ] }
  `;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "compound-beta",
      messages: [{ role: "user", content: prompt }]
    }),
  });

  const result = await response.json();
  let text = result?.choices?.[0]?.message?.content?.trim() ?? "";

  // Strip markdown if present
  if (text.startsWith("```json")) {
    text = text.replace(/```json|```/g, "").trim();
  }

  try {
    const parsed = JSON.parse(text);
    return { topics: parsed.topics || [] };
  } catch (err) {
    console.error("Groq JSON parsing failed:", err);
    return { topics: [], error: "Invalid JSON response from model." };
  }
};

// export const routeGroqAgent = async (request: TaskRequest): Promise<MessageResponse> => {
//   const inputText = request?.params?.message?.parts?.[0]?.text?.trim() || "";

//   if (!inputText) {
//     return buildErrorResponse(request, "No input text found.");
//   }

//   const isTrending = inputText.toLowerCase().startsWith("trending:");
//   const actualInput = isTrending ? inputText.replace(/^trending:/i, "").trim() : inputText;

//   try {
//       const result = await conductGroqResearch(inputText);
//       return buildResponse(request, result.report, { sources: result.sources });

//     if (isTrending) {
//       const result = await discoverTrendingTopics(actualInput);

//       const markdown = result.topics
//         .map(
//           (topic) => `**${topic.topic}**\n- _${topic.description}_\n- 🔍 \`${topic.keywords.join("`, `")}\``
//         )
//         .join("\n\n");

//       return buildResponse(request, markdown, { rawTopics: result.topics });
//     } else {
//       const result = await conductGroqResearch(actualInput);

//       return buildResponse(request, result.report, { sources: result.sources });
//     }
//   } catch (err: any) {
//     console.error("Routing error:", err);
//     return buildErrorResponse(request, `Internal error: ${err.message || "Unknown issue"}`);
//   }
// };