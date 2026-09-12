export type Publication = {
  authors: string;
  status: string;
  title: string;
  venue: string;
};

export const latestPublications: Publication[] = [
  {
    title: "Characterizing Treatment-Context Medication Evidence Across Clinic Notes and Structured EHR Medication History",
    authors: "Mingyang Jiang et al.",
    venue: "IEEE BIBM 2026",
    status: "Submitted",
  },
  {
    title: "Heterogeneous Effects of Cross-Depth Aggregation and Soft-Routed Expert Capacity in CBraMod Fine-Tuning",
    authors: "Mingyang Jiang et al.",
    venue: "ICASSP 2027",
    status: "Submitted",
  },
  {
    title: "MultiFinBen: Benchmarking Large Language Models for Multilingual and Multimodal Financial Application",
    authors: "X. Peng et al.",
    venue: "ACL 2026 Main Conference",
    status: "Accepted",
  },
];

