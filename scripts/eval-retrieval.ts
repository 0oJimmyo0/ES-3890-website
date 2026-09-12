import { retrievalQuestions } from "@/data/evaluation/retrievalQuestions";
import { retrieve } from "@/lib/retrieval";

const supportedQuestions = retrievalQuestions.filter((test) => !test.expectNoResults);
const unsupportedQuestions = retrievalQuestions.filter((test) => test.expectNoResults);

function expectedIds(test: (typeof retrievalQuestions)[number]) {
  return new Set([...(test.expectedTopIds ?? []), ...(test.expectedAnyOf ?? [])]);
}

function hasHit(test: (typeof retrievalQuestions)[number], ids: string[]) {
  const expected = expectedIds(test);
  return ids.some((id) => expected.has(id));
}

function formatResults(results: ReturnType<typeof retrieve>) {
  return results
    .map((result) => `${result.item.id} (${result.score}; tags=${result.matches.tags.join(",") || "-"}; title=${result.matches.title.join(",") || "-"}; content=${result.matches.content.join(",") || "-"})`)
    .join("\n    ");
}

let topOneHits = 0;
let topThreeHits = 0;
let topFiveHits = 0;
let reciprocalRankTotal = 0;
let unsupportedEmpty = 0;
const failures: string[] = [];

for (const test of supportedQuestions) {
  const results = retrieve(test.question, undefined, 5);
  const ids = results.map((result) => result.item.id);
  const rank = ids.findIndex((id) => expectedIds(test).has(id));

  if (hasHit(test, ids.slice(0, 1))) topOneHits += 1;
  if (hasHit(test, ids.slice(0, 3))) topThreeHits += 1;
  if (hasHit(test, ids.slice(0, 5))) topFiveHits += 1;
  if (rank >= 0) reciprocalRankTotal += 1 / (rank + 1);

  if (rank < 0) {
    failures.push([
      `Question: ${test.question}`,
      `Expected: ${[...expectedIds(test)].join(", ")}`,
      `Returned top 5: ${formatResults(results) || "(empty)"}`,
    ].join("\n  "));
  }
}

for (const test of unsupportedQuestions) {
  const results = retrieve(test.question, undefined, 5);
  if (results.length === 0) {
    unsupportedEmpty += 1;
  } else {
    failures.push([
      `Unsupported question: ${test.question}`,
      `Expected: empty result`,
      `Returned top 5: ${formatResults(results)}`,
    ].join("\n  "));
  }
}

const percent = (value: number, total: number) => `${((value / total) * 100).toFixed(1)}%`;
const mrr = reciprocalRankTotal / supportedQuestions.length;

console.log("Retrieval Evaluation");
console.log(`Questions: ${retrievalQuestions.length} (${supportedQuestions.length} supported, ${unsupportedQuestions.length} unsupported)`);
console.log(`Top-1: ${topOneHits}/${supportedQuestions.length} (${percent(topOneHits, supportedQuestions.length)})`);
console.log(`Top-3: ${topThreeHits}/${supportedQuestions.length} (${percent(topThreeHits, supportedQuestions.length)})`);
console.log(`Top-5: ${topFiveHits}/${supportedQuestions.length} (${percent(topFiveHits, supportedQuestions.length)})`);
console.log(`MRR: ${mrr.toFixed(3)}`);
console.log(`Unsupported correctly empty: ${unsupportedEmpty}/${unsupportedQuestions.length} (${percent(unsupportedEmpty, unsupportedQuestions.length)})`);

if (failures.length > 0) {
  console.log("\nFailures:");
  console.log(failures.join("\n\n"));
}

if (topFiveHits / supportedQuestions.length < 0.9 || unsupportedEmpty !== unsupportedQuestions.length) {
  process.exitCode = 1;
}

