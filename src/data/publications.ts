export type PublicationStatus =
  | "Submitted"
  | "Under Review"
  | "Accepted"
  | "Published"
  | "Manuscript in Preparation"
  | "Major Revision Invited";

export type Publication = {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year?: number;
  status: PublicationStatus;
  topics: string[];
  pdfHref?: string;
  externalHref?: string;
  citation?: string;
  featured?: boolean;
};

export const publications: Publication[] = [
  {
    id: "medication-evidence-bibm",
    title: "Characterizing Treatment-Context Medication Evidence Across Clinic Notes and Structured EHR Medication History",
    authors: ["M. Jiang", "C. Ni", "W. Liu", "Z. Yin"],
    venue: "IEEE International Conference on Bioinformatics and Biomedicine (BIBM)",
    year: 2026,
    status: "Submitted",
    topics: ["Clinical NLP", "EHR", "Medication Evidence"],
    externalHref: "https://arxiv.org/abs/2608.01570",
    featured: true,
  },
  {
    id: "clinical-transition-notes-npjdigitalmedicine",
    title: "Source-Grounded and Auditable Contract-First Generation of Clinical Transition Notes from Electronic Health Records",
    authors: ["M. Jiang", "B. Ondov", "C.-H. Chang", "H. Xu"],
    venue: "Manuscript in preparation; intended submission to npj Digital Medicine",
    status: "Manuscript in Preparation",
    topics: ["Clinical NLP", "Provenance", "Clinical Generation"],
  },
  {
    id: "cbra-mod-icassp",
    title: "Heterogeneous Effects of Cross-Depth Aggregation and Soft-Routed Expert Capacity in CBraMod Fine-Tuning",
    authors: ["M. Jiang", "Y. Li", "D. Moyer", "H. Xu", "C. Chang"],
    venue: "IEEE International Conference on Acoustics, Speech, and Signal Processing (ICASSP)",
    year: 2027,
    status: "Submitted",
    topics: ["EEG", "Foundation Models", "Fine-Tuning"],
    featured: true,
  },
  {
    id: "backbone-adapters-tmlr",
    title: "Testing Backbone-Informed Interaction Adapters for EEG Foundation Models: A Capacity-Controlled Study",
    authors: ["M. Jiang", "Y. Li", "D. Moyer", "F. Ma", "H. Xu", "C. Chang"],
    venue: "Transactions on Machine Learning Research",
    status: "Submitted",
    topics: ["EEG", "Adapters", "Transfer Learning"],
  },
  {
    id: "ehr-concordance-amia",
    title: "Note-to-Structured EHR Concordance: Pipeline and Drug Normalization",
    authors: ["M. Jiang", "C. Ni", "Z. Yin"],
    venue: "AMIA 2026",
    year: 2026,
    status: "Accepted",
    topics: ["Clinical NLP", "EHR", "Medication Normalization"],
  },
  {
    id: "multifinben-acl",
    title: "MultiFinBen: Benchmarking Large Language Models for Multilingual and Multimodal Financial Application",
    authors: ["X. Peng et al."],
    venue: "ACL 2026 Main Conference",
    year: 2026,
    status: "Accepted",
    topics: ["LLM Evaluation", "Financial NLP", "Multimodal"],
    externalHref: "https://arxiv.org/abs/2506.14028",
  },
  {
    id: "hypothetico-deductive-nature",
    title: "A Safety-Oriented Hypothetico-Deductive Framework for AI-Assisted Differential Diagnosis",
    authors: ["F. Ma et al."],
    venue: "Nature Communications",
    status: "Major Revision Invited",
    topics: ["Healthcare AI", "Safety", "Clinical Reasoning"],
    externalHref: "https://arxiv.org/abs/2607.08038",
  },
  {
    id: "trace-neurips",
    title: "TRACE: Temporal Routing with Autoregressive Cross-channel Experts for EEG Representation Learning",
    authors: ["F. Ma et al."],
    venue: "NeurIPS 2026",
    year: 2026,
    status: "Under Review",
    topics: ["EEG", "Foundation Models", "Representation Learning"],
    externalHref: "https://arxiv.org/abs/2605.11380",
  },
  {
    id: "ebisu-acl-arr",
    title: "Ebisu: Benchmarking Large Language Models in Japanese Finance",
    authors: ["X. Peng et al."],
    venue: "ACL ARR",
    year: 2026,
    status: "Under Review",
    topics: ["LLM Evaluation", "Japanese", "Financial NLP"],
    externalHref: "https://arxiv.org/abs/2602.01479",
  },
  {
    id: "herculean-acl-arr",
    title: "HERCULEAN: An Agentic Benchmark for Financial Intelligence",
    authors: ["X. Peng et al."],
    venue: "ACL ARR",
    year: 2026,
    status: "Under Review",
    topics: ["LLM Evaluation", "Financial NLP", "Agents"],
    externalHref: "https://arxiv.org/abs/2605.14355",
  },
];

export const latestPublications = publications.filter((publication) => publication.featured);
