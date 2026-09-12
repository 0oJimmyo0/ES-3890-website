import { NextResponse } from "next/server";

import { knowledgeBase } from "@/data/knowledge";
import { getGroqClient, GroqConfigurationError } from "@/lib/groq";
import { validateAssistantRequest } from "@/lib/assistant/validation";
import { buildGroundedPrompt, SYSTEM_PROMPT } from "@/lib/prompt";
import { retrieve } from "@/lib/retrieval";

export const runtime = "nodejs";

const NO_EVIDENCE_ANSWER = "That information is not available in the public portfolio.";

function errorResponse(status: number, code: string, message: string) {
  return NextResponse.json({ error: { code, message } }, { status });
}

function getErrorStatus(error: unknown) {
  if (typeof error !== "object" || error === null || !("status" in error)) return undefined;
  const status = error.status;
  return typeof status === "number" ? status : undefined;
}

function buildSources(results: ReturnType<typeof retrieve>) {
  const seen = new Set<string>();

  return results
    .filter(({ item }) => {
      if (seen.has(item.sourceHref)) return false;
      seen.add(item.sourceHref);
      return true;
    })
    .map(({ item }) => ({ title: item.sourceLabel, href: item.sourceHref }));
}

function ensureCanonicalStatus(question: string, answer: string, results: ReturnType<typeof retrieve>) {
  if (!/\b(status|accepted|published|submitted|under review|major revision)\b/i.test(question)) return answer;

  const firstStatus = results
    .map(({ item }) => ({ title: item.title, status: item.content.match(/^Status:\s*(.+)$/m)?.[1] }))
    .find((record): record is { title: string; status: string } => Boolean(record.status));
  if (!firstStatus || answer.toLocaleLowerCase().includes(firstStatus.status.toLocaleLowerCase())) return answer;

  return `${answer}\n\nThe portfolio lists the relevant record as ${firstStatus.status}.`;
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return errorResponse(400, "INVALID_JSON", "Request body must be valid JSON.");
  }

  const validation = validateAssistantRequest(payload);
  if (!validation.ok) return errorResponse(400, "INVALID_REQUEST", validation.message);

  const { question, history } = validation.value;
  const results = retrieve(question, knowledgeBase, 5);

  if (results.length === 0) {
    return NextResponse.json({ answer: NO_EVIDENCE_ANSWER, sources: [] });
  }

  let groq: ReturnType<typeof getGroqClient>;
  try {
    groq = getGroqClient();
  } catch (error) {
    if (error instanceof GroqConfigurationError) {
      return errorResponse(500, "CONFIGURATION_ERROR", "The research assistant is not configured yet.");
    }
    return errorResponse(500, "CONFIGURATION_ERROR", "The research assistant is not configured correctly.");
  }

  const startedAt = Date.now();

  try {
    const completion = await groq.client.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...history,
        { role: "user", content: buildGroundedPrompt(question, results) },
      ],
      model: groq.model,
      temperature: 0.15,
      reasoning_effort: "low",
      include_reasoning: false,
      max_completion_tokens: 400,
      citation_options: "disabled",
    });

    const generatedAnswer = completion.choices[0]?.message?.content?.trim();
    if (!generatedAnswer) return errorResponse(502, "UPSTREAM_INVALID_RESPONSE", "The research assistant returned an empty answer.");
    const answer = ensureCanonicalStatus(question, generatedAnswer, results);

    const response: {
      answer: string;
      sources: { title: string; href: string }[];
      metadata?: { model: string; durationMs: number; usage?: unknown };
    } = { answer, sources: buildSources(results) };

    if (process.env.NODE_ENV !== "production") {
      response.metadata = {
        model: groq.model,
        durationMs: Date.now() - startedAt,
        usage: completion.usage,
      };
    }

    return NextResponse.json(response);
  } catch (error) {
    const status = getErrorStatus(error);
    if (status === 429) return errorResponse(429, "RATE_LIMITED", "The research assistant is temporarily rate limited.");
    if (status && status >= 500) return errorResponse(503, "SERVICE_UNAVAILABLE", "The research assistant is temporarily unavailable.");
    if (error instanceof Error && error.name === "APIConnectionError") {
      return errorResponse(503, "SERVICE_UNAVAILABLE", "The research assistant is temporarily unavailable.");
    }
    return errorResponse(502, "UPSTREAM_ERROR", "The research assistant could not complete the request.");
  }
}
