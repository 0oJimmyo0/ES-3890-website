export type AssistantHistoryMessage = {
  role: "user" | "assistant";
  content: string;
};

export type AssistantRequest = {
  question: string;
  history: AssistantHistoryMessage[];
};

type ValidationResult =
  | { ok: true; value: AssistantRequest }
  | { ok: false; message: string };

const MAX_QUESTION_LENGTH = 500;
const MAX_HISTORY_LENGTH = 6;
const MAX_HISTORY_MESSAGE_LENGTH = 2_000;

export function validateAssistantRequest(payload: unknown): ValidationResult {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return { ok: false, message: "Request body must be a JSON object." };
  }

  const body = payload as { question?: unknown; history?: unknown };
  if (typeof body.question !== "string") {
    return { ok: false, message: "Question must be a string." };
  }

  const question = body.question.trim();
  if (!question) return { ok: false, message: "Question cannot be empty." };
  if (question.length > MAX_QUESTION_LENGTH) {
    return { ok: false, message: `Question must be ${MAX_QUESTION_LENGTH} characters or fewer.` };
  }

  if (body.history !== undefined && !Array.isArray(body.history)) {
    return { ok: false, message: "History must be an array when provided." };
  }

  const rawHistory = Array.isArray(body.history) ? body.history : [];
  const history: AssistantHistoryMessage[] = [];

  for (const message of rawHistory.slice(-MAX_HISTORY_LENGTH)) {
    if (!message || typeof message !== "object" || Array.isArray(message)) {
      return { ok: false, message: "Every history message must be an object." };
    }

    const candidate = message as { role?: unknown; content?: unknown };
    if (candidate.role !== "user" && candidate.role !== "assistant") {
      return { ok: false, message: "History roles must be user or assistant." };
    }
    if (typeof candidate.content !== "string" || !candidate.content.trim()) {
      return { ok: false, message: "Every history message needs non-empty text." };
    }
    if (candidate.content.length > MAX_HISTORY_MESSAGE_LENGTH) {
      return { ok: false, message: `History messages must be ${MAX_HISTORY_MESSAGE_LENGTH} characters or fewer.` };
    }

    history.push({ role: candidate.role, content: candidate.content.trim() });
  }

  return { ok: true, value: { question, history } };
}

