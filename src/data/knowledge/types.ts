export type KnowledgeType =
  | "profile"
  | "education"
  | "research"
  | "publication"
  | "experience"
  | "teaching"
  | "skills";

export interface KnowledgeItem {
  id: string;
  type: KnowledgeType;
  title: string;
  tags: string[];
  content: string;
  sourceLabel: string;
  sourceHref: string;
  scope?: string;
}
