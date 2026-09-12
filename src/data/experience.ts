export type ExperienceType = "Research" | "Teaching";

export type ExperienceItem = {
  id: string;
  type: ExperienceType;
  institution: string;
  lab?: string;
  role: string;
  startDate: string;
  endDate?: string;
  dateLabel: string;
  location?: string;
  summary: string;
  contributions: string[];
  tags: string[];
};

export const experience: ExperienceItem[] = [
  {
    id: "yale-clinic-nlp-lab",
    type: "Research",
    institution: "Yale School of Medicine (BIDS)",
    lab: "Clinic NLP Lab",
    role: "Research Intern",
    startDate: "2025-06",
    dateLabel: "June 2025 – Present",
    location: "New Haven, CT",
    summary: "Research across EEG foundation models and source-grounded clinical transition-note generation.",
    contributions: [
      "Contributed to TRACE, an autoregressive EEG foundation model for representation learning across heterogeneous montages and recording settings.",
      "Collected, cleaned, and preprocessed multi-source EEG data and implemented baseline foundation models for comparison.",
      "Developed provenance-preserving extraction, medication atomization, patient-disjoint evaluation, and refusal rules for clinical transition notes.",
      "Designed held-out evaluation for factual faithfulness, clinically material omissions, representation support, and downstream utility.",
    ],
    tags: ["Clinical NLP", "EEG", "EHR Data Curation", "LLM Evaluation"],
  },
  {
    id: "neurdy-lab",
    type: "Research",
    institution: "Vanderbilt University",
    lab: "Neurdy Lab",
    role: "VUSE Research Fellow",
    startDate: "2026-02",
    dateLabel: "February 2026 – Present",
    location: "Nashville, TN",
    summary: "EEG foundation-model research focused on efficient downstream adaptation across heterogeneous transfer tasks.",
    contributions: [
      "Conducted EEG foundation-model research under PI Dr. Catie Chang.",
      "Developed and evaluated depth-aware selective adaptation methods using lightweight specialist modules and task-aware routing.",
      "Contributed to the CBraMod fine-tuning paper submitted to ICASSP 2027 and completed experiments for the TMLR submission.",
    ],
    tags: ["EEG", "Foundation Models", "Transfer Learning", "NeuroAI"],
  },
  {
    id: "sphere-lab",
    type: "Research",
    institution: "Vanderbilt University Medical Center",
    lab: "SPHERE Lab",
    role: "Research Assistant",
    startDate: "2026-02",
    dateLabel: "February 2026 – Present",
    location: "Nashville, TN",
    summary: "Clinic-note and structured EHR medication concordance research under PI Dr. Zhijun Yin.",
    contributions: [
      "Studied note-grounded normalization and cross-source comparison for treatment-context medication evidence.",
      "Developed a deterministic normalization and evaluation framework combining candidate generation with semantic and temporal mismatch analysis.",
      "Wrote the manuscript submitted to BIBM 2026 and produced an AMIA 2026 accepted poster.",
    ],
    tags: ["Clinical NLP", "EHR", "Medication Evidence"],
  },
  {
    id: "the-fin-ai",
    type: "Research",
    institution: "The Fin AI",
    role: "Research Contributor",
    startDate: "2025-04",
    endDate: "2026-06",
    dateLabel: "April 2025 – June 2026",
    summary: "Contributions to multilingual, multimodal, and Japanese financial language-model benchmarks.",
    contributions: [
      "Processed financial reports and bilingual financial news for cross-lingual question-answering task construction.",
      "Evaluated language models on PolyFiQA subsets and built comparative analyses of multilingual reasoning performance.",
      "Collected Japanese corporate disclosure data to support dataset construction and annotation for Ebisu.",
    ],
    tags: ["Financial NLP", "Multilingual", "Benchmarking"],
  },
  {
    id: "vanderbilt-ai-summer-school",
    type: "Teaching",
    institution: "Vanderbilt University",
    role: "Invited Speaker",
    startDate: "2026-06",
    dateLabel: "Summer 2026",
    location: "Nashville, TN",
    summary: "Delivered a 15-minute talk on transformers, transfer learning, and EEG time-series intelligence.",
    contributions: ["Presented “From Attention to Brain Foundation Models” at Vanderbilt AI Summer School 2026."],
    tags: ["Teaching", "EEG", "Communication"],
  },
  {
    id: "cs-2281",
    type: "Teaching",
    institution: "Vanderbilt University",
    role: "Teaching Assistant, CS 2281: Computer Architecture",
    startDate: "2025-08",
    endDate: "2025-12",
    dateLabel: "Fall 2025",
    location: "Nashville, TN",
    summary: "Supported laboratory instruction, assessment, and student troubleshooting in computer architecture.",
    contributions: [
      "Supervised laboratory sessions and provided technical guidance on processor design, memory systems, and instruction set architecture.",
      "Evaluated in-lab assessments and laboratory reports and coordinated make-up sessions.",
      "Collaborated with the course instructor to align laboratory activities with course objectives.",
    ],
    tags: ["Teaching", "Computer Architecture", "Mentoring"],
  },
];

export const researchExperience = experience.filter((item) => item.type === "Research");
export const teachingExperience = experience.filter((item) => item.type === "Teaching");

