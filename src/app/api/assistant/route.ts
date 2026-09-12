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

function acronym(value: string) {
  const ignoredWords = new Set(["a", "an", "and", "for", "in", "of", "on", "the", "to"]);
  return value
    .split(/\s+/u)
    .map((word) => word.replace(/[^A-Za-z]/gu, "").toLocaleLowerCase())
    .filter((word) => word.length > 0 && !ignoredWords.has(word))
    .map((word) => word[0])
    .join("");
}

function ensureCanonicalStatus(question: string, answer: string, results: ReturnType<typeof retrieve>) {
  if (!/\b(status|accepted|published|submitted|under review|major revision)\b/i.test(question)) return answer;

  const questionTokens = question.match(/[A-Za-z][A-Za-z0-9-]{2,}/gu)?.map((token) => token.toLocaleLowerCase()) ?? [];
  const statusRecords = results
    .map(({ item }) => ({
      item,
      status: item.content.match(/^Status:\s*(.+)$/m)?.[1],
      venue: item.content.match(/^Venue:\s*(.+)$/m)?.[1],
    }))
    .filter((record): record is { item: (typeof results)[number]["item"]; status: string; venue: string | undefined } => Boolean(record.status));
  const namedRecords = statusRecords.filter(({ item, venue }) => {
    const searchableText = `${item.title} ${item.content}`.toLocaleLowerCase();
    const aliases = venue ? [acronym(venue)] : [];
    return questionTokens.some((token) => searchableText.includes(token) || aliases.includes(token));
  });
  const distinctStatuses = new Set(namedRecords.map((record) => record.status));
  const explicitAcronyms = question.match(/\b[A-Z][A-Z0-9-]{2,}\b/g) ?? [];
  const target = namedRecords.length > 0 && distinctStatuses.size === 1
    ? namedRecords[0]
    : explicitAcronyms.length > 0 && statusRecords.length > 0
      ? statusRecords[0]
      : statusRecords.length === 1
        ? statusRecords[0]
        : undefined;
  if (!target || answer.toLocaleLowerCase().includes(target.status.toLocaleLowerCase())) return answer;

  return `${answer}\n\nThe portfolio lists the relevant record as ${target.status}.`;
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
