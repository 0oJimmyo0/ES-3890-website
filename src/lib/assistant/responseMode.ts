export type ResponseMode = "standard" | "short" | "detailed";

export const RESPONSE_MODE_CONFIG = {
  standard: {
    instruction: "Use the usual concise portfolio response format.",
    maxCompletionTokens: 400,
  },
  short: {
    instruction: "SHORT ANSWER: Answer directly in at most 70 words, using one short paragraph or up to three brief hyphen bullets. Prioritize the requested facts.",
    maxCompletionTokens: 250,
  },
  detailed: {
    instruction: "DETAILED ANSWER: Explain the requested topic using the available evidence. For a broad research question, aim for 120–180 words and cover the problem, approach, and Mingyang's contribution when supported. Use short paragraphs or hyphen bullets. For a simple factual question, clarification, or refusal, answer briefly. Do not pad the answer or invent facts to reach a length target.",
    maxCompletionTokens: 650,
  },
} satisfies Record<ResponseMode, { instruction: string; maxCompletionTokens: number }>;
