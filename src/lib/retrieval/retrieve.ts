import { knowledgeBase } from "@/data/knowledge";
import { normalizeQuery } from "@/lib/retrieval/normalize";
import { scoreItem } from "@/lib/retrieval/score";
import type { KnowledgeItem } from "@/data/knowledge/types";
import type { RetrievalResult } from "@/lib/retrieval/types";

const MIN_K = 1;
const MAX_K = 10;

function compareResults(left: RetrievalResult, right: RetrievalResult) {
  return (
    right.score - left.score ||
    right.matches.tags.length - left.matches.tags.length ||
    right.matches.title.length - left.matches.title.length ||
    left.item.id.localeCompare(right.item.id)
  );
}

export function retrieve(query: string, documents: KnowledgeItem[] = knowledgeBase, k = 5): RetrievalResult[] {
  const queryTerms = normalizeQuery(query);
  if (queryTerms.length === 0) return [];

  const limit = Math.min(MAX_K, Math.max(MIN_K, Math.floor(k)));

  return documents
    .map((item) => scoreItem(item, queryTerms))
    .filter((result) => result.score > 0)
    .sort(compareResults)
    .slice(0, limit);
}

