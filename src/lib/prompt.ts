import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { RetrievalResult } from "@/lib/retrieval";

// Read the canonical prompt file on the server so edits to the text file are
// the instructions used by both the API route and the assistant test scripts.
export const SYSTEM_PROMPT = readFileSync(
  join(process.cwd(), "docs", "academic-assistant-system-prompt.txt"),
  "utf8",
).trim();

export function buildContext(results: RetrievalResult[]) {
  return results
    .map(
      ({ item }, index) =>
        `[RECORD ${index + 1}]\nTitle: ${item.title}\nSource: ${item.sourceLabel}\nEvidence:\n${item.content}`,
    )
    .join("\n\n");
}

export function buildGroundedPrompt(question: string, results: RetrievalResult[]) {
  const statuses = results
    .map(({ item }) => {
      const status = item.content.match(/^Status:\s*(.+)$/m)?.[1];
      return status ? `- ${item.title}: ${status}` : undefined;
    })
    .filter((line): line is string => Boolean(line));

  return `PORTFOLIO EVIDENCE
------------------
${buildContext(results)}

CANONICAL STATUS VALUES FROM THE EVIDENCE
-----------------------------------------
${statuses.length > 0 ? statuses.join("\n") : "No status field is present in the retrieved records."}

USER QUESTION
-------------
${question}

INSTRUCTIONS
------------
Follow the ROLE, SCOPE, WHAT TO DECLINE, and FORMAT rules in the system prompt. Use only the evidence above to make factual claims. Preserve all publication and project statuses exactly, and treat record type labels as authoritative. Do not generate citations or URLs; the server supplies source links separately.`;
}
