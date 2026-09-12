export type ResearchCategory = "EEG / NeuroAI" | "Clinical NLP" | "LLM Evaluation";

export type ResearchProject = {
  category: ResearchCategory;
  description: string;
  tags: string[];
  title: string;
};

export const featuredResearch: ResearchProject[] = [
  {
    category: "EEG / NeuroAI",
    title: "TRACE: EEG Foundation Model",
    description:
      "Research on large-scale EEG foundation modeling across heterogeneous recording settings, with emphasis on downstream representation learning and adaptation.",
    tags: ["EEG", "Foundation Model", "Transfer Learning"],
  },
  {
    category: "Clinical NLP",
    title: "Clinical NLP for Medication Safety",
    description:
      "Research on note-grounded and structured EHR medication evidence, deterministic normalization, and reliable clinical information integration.",
    tags: ["Clinical NLP", "Information Extraction", "Healthcare AI"],
  },
  {
    category: "LLM Evaluation",
    title: "Evaluating LLMs in Healthcare",
    description:
      "Research contribution to multilingual and multimodal benchmarks and the evaluation of domain-specific language-model behavior.",
    tags: ["LLM Evaluation", "Factuality", "Clinical AI"],
  },
];
