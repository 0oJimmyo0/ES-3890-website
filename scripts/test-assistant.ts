import { knowledgeBase } from "@/data/knowledge";
import { validateAssistantRequest } from "@/lib/assistant/validation";
import { buildContext, buildGroundedPrompt, SYSTEM_PROMPT } from "@/lib/prompt";
import { retrieve } from "@/lib/retrieval";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const supportedResults = retrieve("What clinical NLP work has Mingyang done?", knowledgeBase, 5);
assert(supportedResults.length > 0, "Supported retrieval should return evidence.");
assert(buildContext(supportedResults).includes("[RECORD 1]"), "Context should delimit records.");
assert(buildGroundedPrompt("What clinical NLP work has Mingyang done?", supportedResults).includes("USER QUESTION"), "Grounded prompt should include the question section.");
assert(SYSTEM_PROMPT.includes("only from the supplied portfolio evidence"), "System prompt should enforce grounding.");

const unsupportedResults = retrieve("What is Mingyang's favorite movie?", knowledgeBase, 5);
assert(unsupportedResults.length === 0, "Unsupported retrieval should be empty.");

const validRequest = validateAssistantRequest({
  question: "What is his GPA?",
  history: [{ role: "user", content: "Tell me about his education." }],
});
assert(validRequest.ok, "Valid assistant request should pass validation.");

const invalidRequest = validateAssistantRequest({ question: "" });
assert(!invalidRequest.ok, "Empty question should fail validation.");

console.log("Assistant development checks passed.");
console.log(`Knowledge records: ${knowledgeBase.length}`);
console.log(`Supported evidence records: ${supportedResults.length}`);
console.log("Unsupported evidence records: 0");

