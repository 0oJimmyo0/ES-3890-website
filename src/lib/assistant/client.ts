export type AssistantRole = "user" | "assistant";

export type AssistantSource = {
  title: string;
  href: string;
};

export type AssistantHistoryMessage = {
  role: AssistantRole;
  content: string;
};

export type AssistantResponse = {
  answer: string;
  sources: AssistantSource[];
};

export type AssistantErrorPayload = {
  error?: {
    code?: string;
    message?: string;
  };
};

export class AssistantClientError extends Error {
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = "AssistantClientError";
    this.code = code;
  }
}

export async function askAssistant(
  question: string,
  history: AssistantHistoryMessage[],
): Promise<AssistantResponse> {
  const response = await fetch("/api/assistant", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, history }),
  });

  const data = (await response.json().catch(() => null)) as AssistantResponse | AssistantErrorPayload | null;
  if (!response.ok) {
    const error = data && "error" in data ? data.error : undefined;
    throw new AssistantClientError(
      error?.message ?? "The research assistant could not complete the request.",
      error?.code ?? "UNKNOWN",
    );
  }

  if (!data || !("answer" in data) || !Array.isArray(data.sources)) {
    throw new AssistantClientError("The research assistant returned an invalid response.", "INVALID_RESPONSE");
  }

  return data;
}
