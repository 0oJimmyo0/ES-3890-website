export type ResearchCategory = "EEG / NeuroAI" | "Clinical NLP / Health AI" | "LLM Evaluation";

export type ResearchProject = {
  id: string;
  category: ResearchCategory;
  title: string;
  shortDescription: string;
  problem: string;
  approach: string;
  contribution: string;
  myRole: string;
  status: string;
  tags: string[];
  featured?: boolean;
  links?: { label: string; href: string }[];
};

export const researchThemes: { category: ResearchCategory; description: string }[] = [
  {
    category: "EEG / NeuroAI",
    description: "Foundation models and efficient downstream adaptation for heterogeneous EEG data.",
  },
  {
    category: "Clinical NLP / Health AI",
    description: "Source-grounded language systems and structured evidence for clinical workflows.",
  },
  {
    category: "LLM Evaluation",
    description: "Evaluation of factuality, reliability, and domain-specific behavior in language models.",
  },
];

export const researchProjects: ResearchProject[] = [
  {
    id: "trace-eeg-foundation-model",
    category: "EEG / NeuroAI",
    title: "TRACE: EEG Foundation Model",
    shortDescription:
      "Large-scale EEG foundation-model research across heterogeneous recording settings, with emphasis on downstream representation learning and adaptation.",
    problem:
      "EEG datasets vary across montages and recording settings, making transferable representation learning difficult.",
    approach:
      "TRACE investigates temporal routing and cross-channel expert sharing for autoregressive EEG representation learning.",
    contribution:
      "The project studies a foundation-model approach for cross-dataset and cross-task EEG learning.",
    myRole:
      "Collected, cleaned, and preprocessed multi-source EEG data; implemented baseline models; and contributed to downstream evaluation.",
    status: "Under Review",
    tags: ["EEG", "Foundation Model", "Transfer Learning"],
    featured: true,
  },
  {
    id: "cbra-mod-fine-tuning",
    category: "EEG / NeuroAI",
    title: "CBraMod Fine-Tuning and Capacity",
    shortDescription:
      "A study of cross-depth aggregation and soft-routed expert capacity for adapting pretrained EEG backbones.",
    problem:
      "Efficiently adapting EEG foundation models requires understanding how model depth and expert capacity affect transfer tasks.",
    approach:
      "The study evaluates depth-aware selective adaptation with lightweight specialist modules and task-aware routing.",
    contribution:
      "The work characterizes heterogeneous effects of cross-depth aggregation and soft-routed expert capacity during fine-tuning.",
    myRole:
      "Developed and evaluated depth-aware selective adaptation methods and contributed to the submitted manuscript.",
    status: "Submitted",
    tags: ["EEG", "Parameter-Efficient Adaptation", "Transfer Learning"],
  },
  {
    id: "backbone-informed-adapters",
    category: "EEG / NeuroAI",
    title: "Backbone-Informed Interaction Adapters",
    shortDescription:
      "A capacity-controlled study of interaction adapters for efficient EEG foundation-model adaptation.",
    problem:
      "Adapter design needs to preserve useful backbone information while controlling the capacity added for downstream tasks.",
    approach:
      "The study tests backbone-informed interaction adapters under controlled capacity settings.",
    contribution:
      "The work evaluates an efficient adaptation strategy for pretrained EEG models across transfer tasks.",
    myRole:
      "Completed experiments and contributed to the manuscript submitted to Transactions on Machine Learning Research.",
    status: "Submitted",
    tags: ["EEG", "Adapters", "Efficient Adaptation"],
  },
  {
    id: "medication-evidence-concordance",
    category: "Clinical NLP / Health AI",
    title: "Clinical NLP for Medication Safety",
    shortDescription:
      "Note-grounded and structured EHR medication evidence, deterministic normalization, and reliable clinical information integration.",
    problem:
      "Medication evidence can differ between clinic notes and structured EHR medication history, complicating treatment-context analysis.",
    approach:
      "The project combines candidate generation with deterministic normalization and semantic and temporal mismatch analysis.",
    contribution:
      "It establishes a pipeline for comparing treatment-context medication evidence across clinical sources.",
    myRole:
      "Studied medication concordance, developed the normalization and evaluation framework, and wrote the manuscript.",
    status: "Submitted",
    tags: ["Clinical NLP", "Information Extraction", "Healthcare AI"],
  },
  {
    id: "clinical-transition-notes",
    category: "Clinical NLP / Health AI",
    title: "Source-Grounded Clinical Transition Note Generation",
    shortDescription:
      "A contract-first pipeline for auditable clinical transition notes from de-identified EHR discharge records.",
    problem:
      "Clinical transition notes must preserve high-risk discharge information and remain faithful to their source records.",
    approach:
      "The pipeline uses provenance-preserving extraction, medication atomization, deterministic rendering, patient-disjoint evaluation, and refusal rules.",
    contribution:
      "The project defines evaluations for factual faithfulness, material omissions, representation support, and downstream utility.",
    myRole:
      "Developed the extraction, rendering, evaluation, and refusal components and am preparing blinded clinician evaluation.",
    status: "Ongoing",
    tags: ["Clinical NLP", "Provenance", "Factuality"],
  },
  {
    id: "multifinben",
    category: "LLM Evaluation",
    title: "MultiFinBen",
    shortDescription:
      "An expert-annotated multilingual and multimodal benchmark for evaluating financial language models.",
    problem:
      "Financial language-model performance needs evaluation across languages, modalities, and domain-specific reasoning tasks.",
    approach:
      "The benchmark combines financial reports, bilingual financial news, cross-lingual question answering, and comparative model evaluation.",
    contribution:
      "The project provides a benchmark for analyzing multilingual and multimodal financial LLM behavior.",
    myRole:
      "Processed financial reports and bilingual news data, supported task construction, and evaluated models on PolyFiQA subsets.",
    status: "Accepted",
    tags: ["Financial NLP", "Multilingual", "Multimodal"],
    featured: true,
    links: [{ label: "arXiv", href: "https://arxiv.org/abs/2506.14028" }],
  },
  {
    id: "ebisu",
    category: "LLM Evaluation",
    title: "Ebisu",
    shortDescription:
      "A benchmark for Japanese financial language understanding grounded in corporate communication.",
    problem:
      "Financial language understanding includes pragmatic and terminology phenomena that are not captured by generic benchmarks.",
    approach:
      "The project uses Japanese corporate disclosures, including IPO materials and financial reports, for dataset construction and annotation.",
    contribution:
      "The benchmark evaluates model weaknesses on pragmatic inference and term extraction tasks.",
    myRole:
      "Collected Japanese corporate disclosure data and supported dataset construction, annotation, evaluation, and analysis.",
    status: "Under Review",
    tags: ["Financial NLP", "Japanese", "Benchmarking"],
    links: [{ label: "arXiv", href: "https://arxiv.org/abs/2602.01479" }],
  },
];

export const featuredResearch = researchProjects.filter((project) => project.featured);
