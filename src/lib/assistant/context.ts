import type { AssistantHistoryMessage } from "@/lib/assistant/validation";

// Resolve follow-ups from user messages, never from potentially incorrect
// assistant claims. The route still retrieves facts from the canonical data.
const FOLLOW_UP_REFERENCE = /\b(?:its|that (?:work|project|paper|model)|this (?:project|paper|model)|those(?: (?:projects|papers|models))?|these(?: (?:projects|papers|models))?)\b|\bit\b/i;

export function resolveRetrievalQuery(question: string, history: AssistantHistoryMessage[]) {
  if (!FOLLOW_UP_REFERENCE.test(question)) return question;

  const previousQuestions = history.filter((message) => message.role === "user");
  const context: string[] = [];

  for (let index = previousQuestions.length - 1; index >= 0; index -= 1) {
    const previous = previousQuestions[index].content;
    context.unshift(previous);
    if (!FOLLOW_UP_REFERENCE.test(previous)) break;
  }

  return context.length > 0 ? [...context, question].join("\n") : question;
}
