import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

import { assistantEvaluationQuestions, type AssistantEvaluationCase } from "@/data/evaluation/assistantQuestions";
import { knowledgeBase } from "@/data/knowledge";
import { POST } from "@/app/api/assistant/route";
import { retrieve } from "@/lib/retrieval";

const NO_EVIDENCE_ANSWER = "That information is not available in the public portfolio.";
const INPUT_PRICE_PER_MILLION = 0.075;
const OUTPUT_PRICE_PER_MILLION = 0.3;
// Keep the default below the free-plan token-per-minute window during live runs.
const defaultDelayMs = 12_000;
const delayMs = Number.parseInt(process.env.EVAL_DELAY_MS ?? `${defaultDelayMs}`, 10);
const reportPath = "reports/assistant-evaluation.latest.json";

type AssistantApiBody = {
  answer?: unknown;
  sources?: { title?: unknown; href?: unknown }[];
  error?: { code?: unknown; message?: unknown };
  metadata?: { model?: unknown; durationMs?: unknown; usage?: { prompt_tokens?: unknown; completion_tokens?: unknown; total_tokens?: unknown } };
};

type EvaluationResult = {
  id: string;
  category: string;
  question: string;
  retrievedEvidenceIds: string[];
  answer: string;
  sources: { title: string; href: string }[];
  httpStatus: number;
  classification: "PASS" | "PARTIAL" | "FAIL";
  refusalExpected: boolean;
  refusalCorrect: boolean;
  statusExpected?: string;
  statusCorrect: boolean;
  sourceLinksValid: boolean;
  sourceRelevant: boolean;
  latencyMs: number;
  usage?: { inputTokens: number; outputTokens: number; totalTokens: number };
  failureReasons: string[];
};

function sleep(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function lower(value: string) {
  return value.toLocaleLowerCase().replace(/\s+/gu, " ").trim();
}

function containsAll(answer: string, phrases: string[] = []) {
  const normalized = lower(answer);
  return phrases.every((phrase) => normalized.includes(lower(phrase)));
}

function containsAny(answer: string, phrases: string[] = []) {
  const normalized = lower(answer);
  return phrases.some((phrase) => normalized.includes(lower(phrase)));
}

function getSources(body: AssistantApiBody) {
  if (!Array.isArray(body.sources)) return [];
  return body.sources.filter(
    (source): source is { title: string; href: string } => typeof source.title === "string" && typeof source.href === "string",
  );
}

async function runCase(test: AssistantEvaluationCase): Promise<EvaluationResult> {
  const retrievalResults = retrieve(test.question, knowledgeBase, 5);
  const retrievedEvidenceIds = retrievalResults.map(({ item }) => item.id);
  const retrievedHrefs = new Set(retrievalResults.map(({ item }) => item.sourceHref));
  const expectedItems = knowledgeBase.filter((item) => test.expectedEvidenceIds?.includes(item.id));
  const expectedHrefs = new Set(expectedItems.map((item) => item.sourceHref));
  const validHrefs = new Set(knowledgeBase.map((item) => item.sourceHref));
  const startedAt = Date.now();

  let httpStatus = 500;
  let body: AssistantApiBody = {};
  try {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const request = new Request("http://localhost/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: test.question, history: test.history }),
      });
      const response = await POST(request);
      httpStatus = response.status;
      body = (await response.json()) as AssistantApiBody;
      if (httpStatus !== 429 || attempt === 2) break;
      await sleep(5_000 * (attempt + 1));
    }
  } catch (error) {
    body = { error: { message: error instanceof Error ? error.message : "Unknown evaluation error" } };
  }

  const latencyMs = Date.now() - startedAt;
  const answer = typeof body.answer === "string" ? body.answer : "";
  const sources = getSources(body);
  const failureReasons: string[] = [];
  const refusalCorrect = test.expectRefusal
    ? httpStatus === 200 && answer === NO_EVIDENCE_ANSWER && sources.length === 0
    : httpStatus === 200 && answer !== NO_EVIDENCE_ANSWER;
  const statusCorrect = test.expectedStatus ? lower(answer).includes(lower(test.expectedStatus)) : true;
  const sourceLinksValid = test.expectRefusal
    ? sources.length === 0
    : sources.length > 0 && sources.every((source) => validHrefs.has(source.href) && retrievedHrefs.has(source.href));
  const sourceRelevant = test.expectRefusal
    ? true
    : sources.some((source) => expectedHrefs.has(source.href));
  const expectedEvidenceHit = test.expectRefusal
    ? retrievedEvidenceIds.length === 0
    : test.expectedEvidenceIds?.some((id) => retrievedEvidenceIds.includes(id)) ?? retrievedEvidenceIds.length > 0;
  const requiredPhrasesPresent = test.expectRefusal ? true : containsAll(answer, test.requiredPhrases);
  const forbiddenPhraseAbsent = !containsAny(answer, test.forbiddenPhrases);

  if (httpStatus !== 200) failureReasons.push(`HTTP ${httpStatus}: ${String(body.error?.message ?? "request failed")}`);
  if (!refusalCorrect) failureReasons.push(test.expectRefusal ? "Expected exact grounded refusal." : "Supported question was refused or returned an invalid answer.");
  if (!expectedEvidenceHit) failureReasons.push("Expected evidence was not retrieved.");
  if (!requiredPhrasesPresent) failureReasons.push(`Missing required phrase(s): ${(test.requiredPhrases ?? []).join(", ")}`);
  if (!forbiddenPhraseAbsent) failureReasons.push(`Contained forbidden phrase(s): ${(test.forbiddenPhrases ?? []).join(", ")}`);
  if (!statusCorrect) failureReasons.push(`Expected status: ${test.expectedStatus}`);
  if (!sourceLinksValid) failureReasons.push("Returned source was missing, invalid, or not among retrieved evidence.");
  if (!sourceRelevant) failureReasons.push("Returned sources did not include an expected evidence source.");

  const hardFailures = !refusalCorrect || !statusCorrect || !sourceLinksValid || !sourceRelevant || !expectedEvidenceHit || !forbiddenPhraseAbsent || httpStatus !== 200;
  const classification = hardFailures ? "FAIL" : requiredPhrasesPresent && forbiddenPhraseAbsent ? "PASS" : "PARTIAL";
  const usage = body.metadata?.usage;
  const normalizedUsage = usage && [usage.prompt_tokens, usage.completion_tokens, usage.total_tokens].every((token) => typeof token === "number")
    ? { inputTokens: usage.prompt_tokens as number, outputTokens: usage.completion_tokens as number, totalTokens: usage.total_tokens as number }
    : undefined;

  return {
    id: test.id,
    category: test.category,
    question: test.question,
    retrievedEvidenceIds,
    answer,
    sources,
    httpStatus,
    classification,
    refusalExpected: Boolean(test.expectRefusal),
    refusalCorrect,
    statusExpected: test.expectedStatus,
    statusCorrect,
    sourceLinksValid,
    sourceRelevant,
    latencyMs,
    usage: normalizedUsage,
    failureReasons,
  };
}

async function main() {
  if (!process.env.GROQ_API_KEY?.trim()) {
    throw new Error("GROQ_API_KEY is required for live assistant evaluation. Keep it in .env.local only.");
  }

  const results: EvaluationResult[] = [];
  for (const [index, test] of assistantEvaluationQuestions.entries()) {
    const result = await runCase(test);
    results.push(result);
    console.log(`[${index + 1}/${assistantEvaluationQuestions.length}] ${result.classification} ${test.id} (${result.latencyMs}ms)`);
    if (result.failureReasons.length > 0) console.log(`  ${result.failureReasons.join(" | ")}`);
    if (index < assistantEvaluationQuestions.length - 1 && delayMs > 0) await sleep(delayMs);
  }

  const supported = results.filter((result) => !result.refusalExpected);
  const unsupported = results.filter((result) => result.refusalExpected);
  const liveCalls = results.filter((result) => result.retrievedEvidenceIds.length > 0);
  const groundedPasses = supported.filter((result) => result.classification === "PASS").length;
  const refusalCorrect = unsupported.filter((result) => result.refusalCorrect).length;
  const statusCases = results.filter((result) => result.statusExpected);
  const statusCorrect = statusCases.filter((result) => result.statusCorrect).length;
  const sourceCases = supported;
  const sourceRelevant = sourceCases.filter((result) => result.sourceRelevant && result.sourceLinksValid).length;
  const timedCalls = liveCalls.map((result) => result.latencyMs).sort((a, b) => a - b);
  const percentile = (values: number[], percentileRank: number) => values.length === 0 ? 0 : values[Math.min(values.length - 1, Math.ceil(values.length * percentileRank) - 1)];
  const usages = results.flatMap((result) => result.usage ? [result.usage] : []);
  const inputTokens = usages.reduce((sum, usage) => sum + usage.inputTokens, 0);
  const outputTokens = usages.reduce((sum, usage) => sum + usage.outputTokens, 0);
  const totalTokens = usages.reduce((sum, usage) => sum + usage.totalTokens, 0);
  const inputCost = inputTokens / 1_000_000 * INPUT_PRICE_PER_MILLION;
  const outputCost = outputTokens / 1_000_000 * OUTPUT_PRICE_PER_MILLION;
  const estimatedCost = inputCost + outputCost;
  const liveRequestCount = usages.length;
  const averageCost = liveRequestCount ? estimatedCost / liveRequestCount : 0;
  const summary = {
    evaluatedAt: new Date().toISOString(),
    model: process.env.GROQ_MODEL?.trim() || "openai/gpt-oss-20b",
    reasoningEffort: "low",
    includeReasoning: false,
    maxCompletionTokens: 400,
    delayMs,
    questionCount: results.length,
    supportedCount: supported.length,
    unsupportedCount: unsupported.length,
    groundedAnswerPassRate: `${groundedPasses}/${supported.length} (${((groundedPasses / supported.length) * 100).toFixed(1)}%)`,
    unsupportedRefusalAccuracy: `${refusalCorrect}/${unsupported.length} (${((refusalCorrect / unsupported.length) * 100).toFixed(1)}%)`,
    statusAccuracy: `${statusCorrect}/${statusCases.length} (${statusCases.length ? ((statusCorrect / statusCases.length) * 100).toFixed(1) : "0.0"}%)`,
    sourceRelevance: `${sourceRelevant}/${sourceCases.length} (${sourceCases.length ? ((sourceRelevant / sourceCases.length) * 100).toFixed(1) : "0.0"}%)`,
    liveGroqCalls: liveCalls.length,
    medianLatencyMs: percentile(timedCalls, 0.5),
    p95LatencyMs: percentile(timedCalls, 0.95),
    usageRecords: usages.length,
    averageInputTokens: liveRequestCount ? inputTokens / liveRequestCount : 0,
    averageOutputTokens: liveRequestCount ? outputTokens / liveRequestCount : 0,
    averageTotalTokens: liveRequestCount ? totalTokens / liveRequestCount : 0,
    estimatedCostPerRequest: averageCost,
    estimatedCostPer100Requests: averageCost * 100,
    estimatedCostPer1000Requests: averageCost * 1_000,
    pricing: { inputPerMillion: INPUT_PRICE_PER_MILLION, outputPerMillion: OUTPUT_PRICE_PER_MILLION },
  };
  const report = { summary, results };

  const fs = await import("node:fs/promises");
  await fs.mkdir("reports", { recursive: true });
  await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.log("\nEnd-to-end Assistant Evaluation");
  console.log(`Questions: ${summary.questionCount} (${summary.supportedCount} supported, ${summary.unsupportedCount} unsupported)`);
  console.log(`Grounded answer PASS: ${summary.groundedAnswerPassRate}`);
  console.log(`Unsupported refusal accuracy: ${summary.unsupportedRefusalAccuracy}`);
  console.log(`Status accuracy: ${summary.statusAccuracy}`);
  console.log(`Source relevance and validity: ${summary.sourceRelevance}`);
  console.log(`Live Groq calls: ${summary.liveGroqCalls}; median latency: ${summary.medianLatencyMs}ms; p95: ${summary.p95LatencyMs}ms`);
  console.log(`Tokens (averages per live request): input ${summary.averageInputTokens.toFixed(1)}, output ${summary.averageOutputTokens.toFixed(1)}, total ${summary.averageTotalTokens.toFixed(1)}`);
  console.log(`Estimated cost: $${summary.estimatedCostPerRequest.toFixed(6)}/request, $${summary.estimatedCostPer100Requests.toFixed(4)}/100, $${summary.estimatedCostPer1000Requests.toFixed(4)}/1,000`);
  console.log(`Report written to ${reportPath}`);

  const failures = results.filter((result) => result.classification === "FAIL");
  if (failures.length > 0) {
    console.log("\nFailures for manual review:");
    for (const failure of failures) {
      console.log(`- ${failure.id}: ${failure.failureReasons.join("; ")}`);
      console.log(`  Question: ${failure.question}`);
      console.log(`  Retrieved: ${failure.retrievedEvidenceIds.join(", ") || "(empty)"}`);
      console.log(`  Answer: ${failure.answer || "(no answer)"}`);
      console.log(`  Sources: ${failure.sources.map((source) => source.href).join(", ") || "(none)"}`);
    }
  }

  if (refusalCorrect !== unsupported.length || statusCorrect !== statusCases.length || groundedPasses / supported.length < 0.9) process.exitCode = 1;
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
