import { buildKnowledgeBase, validateKnowledgeBase } from "@/data/knowledge/buildKnowledgeBase";
import type { KnowledgeItem, KnowledgeType } from "@/data/knowledge/types";

export const knowledgeBase: KnowledgeItem[] = validateKnowledgeBase(buildKnowledgeBase());

const emptyCounts: Record<KnowledgeType, number> = {
  profile: 0,
  education: 0,
  research: 0,
  publication: 0,
  experience: 0,
  teaching: 0,
  skills: 0,
};

export const knowledgeBaseCounts = knowledgeBase.reduce<Record<KnowledgeType, number>>(
  (counts, item) => {
    counts[item.type] += 1;
    return counts;
  },
  { ...emptyCounts },
);

