import type { KnowledgeItem } from "@/data/knowledge/types";
import { expandQuery, normalizeText } from "@/lib/retrieval/normalize";
import type { RetrievalMatches, RetrievalResult } from "@/lib/retrieval/types";

function normalizedTokens(value: string) {
  return new Set(normalizeText(value).split(" ").filter(Boolean));
}

function fieldMatches(value: string, terms: string[]) {
  const normalizedValue = ` ${normalizeText(value)} `;
  const tokens = normalizedTokens(value);

  return terms.filter((term) => {
    const normalizedTerm = normalizeText(term);
    if (!normalizedTerm) return false;
    if (normalizedTerm.includes(" ")) return normalizedValue.includes(` ${normalizedTerm} `);
    return tokens.has(normalizedTerm);
  });
}

export function scoreItem(item: KnowledgeItem, queryTerms: string[]): RetrievalResult {
  const terms = expandQuery(queryTerms);
  const matches: RetrievalMatches = {
    tags: fieldMatches(item.tags.join(" "), terms),
    title: fieldMatches(item.title, terms),
    content: fieldMatches(item.content, terms),
  };

  const score = matches.tags.length * 4 + matches.title.length * 3 + matches.content.length;

  return { item, score, matches };
}

