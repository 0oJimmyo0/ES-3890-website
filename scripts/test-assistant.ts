import { knowledgeBase } from "@/data/knowledge";
import { validateAssistantRequest } from "@/lib/assistant/validation";
import { buildContext, buildGroundedPrompt, SYSTEM_PROMPT } from "@/lib/prompt";
import { retrieve } from "@/lib/retrieval";
import { resolveRetrievalQuery } from "@/lib/assistant/context";

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

const traceExperience = knowledgeBase.find((item) => item.id === "experience-yale-clinic-nlp-lab-trace-eeg-foundation-model");
assert(Boolean(traceExperience), "TRACE should have a project-scoped experience record.");
assert(!traceExperience?.content.includes("patient-disjoint"), "TRACE-scoped experience should exclude clinical-transition methods.");

const validRequest = validateAssistantRequest({
  question: "What is his GPA?",
  history: [{ role: "user", content: "Tell me about his education." }],
});
assert(validRequest.ok, "Valid assistant request should pass validation.");

const invalidRequest = validateAssistantRequest({ question: "" });
assert(!invalidRequest.ok, "Empty question should fail validation.");

const traceHistory = [
  { role: "user" as const, content: "Tell me about TRACE." },
  { role: "assistant" as const, content: "TRACE was accepted. (Deliberately incorrect history.)" },
];
const followUpQuery = resolveRetrievalQuery("What is its current status?", traceHistory);
const followUpResults = retrieve(followUpQuery, knowledgeBase, 5);
assert(followUpResults.some(({ item }) => item.id === "publication-trace-neurips"), "A pronoun-only follow-up must retrieve TRACE publication evidence.");
assert(!followUpQuery.includes("accepted"), "Incorrect assistant claims must not become retrieval context.");
assert(resolveRetrievalQuery("Tell me about Ebisu.", traceHistory) === "Tell me about Ebisu.", "An explicit topic change must not inherit TRACE.");
assert(resolveRetrievalQuery("What is Mingyang's private home address?", traceHistory) === "What is Mingyang's private home address?", "An unrelated private-information request must not inherit a project.");
const chainedQuery = resolveRetrievalQuery("Which lab was that work associated with?", [
  ...traceHistory,
  { role: "user", content: "What is its current status?" },
  { role: "assistant", content: "Under Review." },
]);
assert(retrieve(chainedQuery, knowledgeBase, 5).some(({ item }) => item.id === "experience-yale-clinic-nlp-lab-trace-eeg-foundation-model"), "A chained follow-up must retain project-scoped lab evidence.");
assert(resolveRetrievalQuery("What is its status?", []) === "What is its status?", "An empty history must not invent a topic.");

for (const responseMode of ["short", "detailed", "standard"] as const) {
  assert(validateAssistantRequest({ question: "Tell me about TRACE.", responseMode }).ok, `Valid ${responseMode} mode should be accepted.`);
}
assert(!validateAssistantRequest({ question: "Tell me about TRACE.", responseMode: "unlimited" }).ok, "Unknown response modes must be rejected.");
assert(validRequest.ok && validRequest.value.responseMode === "standard", "Existing clients without a mode keep the standard behavior.");
assert(buildGroundedPrompt("Tell me about TRACE.", followUpResults, "short").includes("at most 70 words"), "Short-mode requests must carry the concise-answer instruction.");
assert(buildGroundedPrompt("Tell me about TRACE.", followUpResults, "detailed").includes("Do not pad"), "Detailed mode must retain the no-fabrication length boundary.");

console.log("Assistant development checks passed.");
console.log(`Knowledge records: ${knowledgeBase.length}`);
console.log(`Supported evidence records: ${supportedResults.length}`);
console.log("Unsupported evidence records: 0");
