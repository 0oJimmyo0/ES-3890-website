import type { KnowledgeItem } from "@/data/knowledge/types";

export type RetrievalMatches = {
  tags: string[];
  title: string[];
  content: string[];
};

export interface RetrievalResult {
  item: KnowledgeItem;
  score: number;
  matches: RetrievalMatches;
}

