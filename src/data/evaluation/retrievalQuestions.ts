export type RetrievalEvaluationCase = {
  category: string;
  question: string;
  expectedTopIds?: string[];
  expectedAnyOf?: string[];
  expectNoResults?: boolean;
};

export const retrievalQuestions: RetrievalEvaluationCase[] = [
  { category: "Research focus", question: "What are Mingyang's main research interests?", expectedTopIds: ["profile-overview"] },
  { category: "Research focus", question: "What does Mingyang research?", expectedAnyOf: ["profile-overview", "research-trace-eeg-foundation-model", "research-medication-evidence-concordance"] },
  { category: "Research focus", question: "Summarize his EEG research.", expectedAnyOf: ["research-trace-eeg-foundation-model", "research-cbra-mod-fine-tuning", "research-backbone-informed-adapters"] },
  { category: "Research focus", question: "What clinical NLP work has he done?", expectedAnyOf: ["research-medication-evidence-concordance", "research-clinical-transition-notes"] },
  { category: "Research focus", question: "What work involves medication evidence?", expectedAnyOf: ["research-medication-evidence-concordance", "publication-medication-evidence-bibm", "experience-sphere-lab"] },
  { category: "Research focus", question: "How are his EEG projects related?", expectedAnyOf: ["research-trace-eeg-foundation-model", "research-cbra-mod-fine-tuning", "research-backbone-informed-adapters", "experience-yale-clinic-nlp-lab-trace-eeg-foundation-model", "experience-neurdy-lab-cbra-mod-fine-tuning", "experience-neurdy-lab-backbone-informed-adapters"] },
  { category: "Research focus", question: "What research involves provenance?", expectedAnyOf: ["research-clinical-transition-notes", "experience-yale-clinic-nlp-lab-clinical-transition-notes"] },
  { category: "Research focus", question: "What work evaluates factuality?", expectedAnyOf: ["research-clinical-transition-notes"] },
  { category: "Publications", question: "Which publications involve EEG?", expectedAnyOf: ["publication-cbra-mod-icassp", "publication-backbone-adapters-tmlr", "publication-trace-neurips"] },
  { category: "Publications", question: "Which paper was submitted to TMLR?", expectedTopIds: ["publication-backbone-adapters-tmlr"] },
  { category: "Publications", question: "What work was submitted to ICASSP 2027?", expectedTopIds: ["publication-cbra-mod-icassp"] },
  { category: "Publications", question: "Does he have an ACL 2026 paper?", expectedAnyOf: ["publication-multifinben-acl"] },
  { category: "Publications", question: "Tell me about MultiFinBen.", expectedAnyOf: ["research-multifinben", "publication-multifinben-acl", "experience-the-fin-ai-multifinben"] },
  { category: "Publications", question: "What is the status of Ebisu?", expectedAnyOf: ["research-ebisu", "publication-ebisu-acl-arr"] },
  { category: "Publications", question: "What publications has he worked on?", expectedAnyOf: ["publication-medication-evidence-bibm", "publication-cbra-mod-icassp", "publication-multifinben-acl"] },
  { category: "Publications", question: "Which paper was an accepted AMIA poster?", expectedTopIds: ["publication-ehr-concordance-amia"] },
  { category: "Publications", question: "Which paper received a major revision invitation?", expectedTopIds: ["publication-hypothetico-deductive-nature"] },
  { category: "Experience", question: "What did he do at the SPHERE Lab?", expectedTopIds: ["experience-sphere-lab"] },
  { category: "Experience", question: "What did he work on at Yale?", expectedTopIds: ["experience-yale-clinic-nlp-lab"] },
  { category: "Experience", question: "What did he do at Neurdy?", expectedTopIds: ["experience-neurdy-lab"] },
  { category: "Experience", question: "What experience does he have with LLM evaluation?", expectedAnyOf: ["experience-yale-clinic-nlp-lab", "research-multifinben", "publication-multifinben-acl"] },
  { category: "Experience", question: "What research roles does he have at Vanderbilt?", expectedAnyOf: ["experience-neurdy-lab", "experience-sphere-lab"] },
  { category: "Experience", question: "What teaching experience does he have?", expectedAnyOf: ["teaching-vanderbilt-ai-summer-school", "teaching-cs-2281"] },
  { category: "Experience", question: "What did he teach in computer architecture?", expectedTopIds: ["teaching-cs-2281"] },
  { category: "Education and skills", question: "What programming languages does he use?", expectedTopIds: ["skills-programming"] },
  { category: "Education and skills", question: "What machine learning tools does he use?", expectedTopIds: ["skills-machine-learning"] },
  { category: "Education and skills", question: "What is his GPA?", expectedTopIds: ["education-vanderbilt"] },
  { category: "Education and skills", question: "When does he graduate?", expectedTopIds: ["education-vanderbilt"] },
  { category: "Education and skills", question: "What did he study at Vanderbilt?", expectedTopIds: ["education-vanderbilt"] },
  { category: "Education and skills", question: "What computer science skills does he have?", expectedAnyOf: ["skills-programming", "education-vanderbilt"] },
  { category: "Research concepts", question: "What are his foundation model projects?", expectedAnyOf: ["research-trace-eeg-foundation-model", "research-cbra-mod-fine-tuning", "research-backbone-informed-adapters", "experience-yale-clinic-nlp-lab-trace-eeg-foundation-model", "experience-neurdy-lab-cbra-mod-fine-tuning", "experience-neurdy-lab-backbone-informed-adapters"] },
  { category: "Research concepts", question: "What work uses EHR data?", expectedAnyOf: ["research-medication-evidence-concordance", "research-clinical-transition-notes", "experience-sphere-lab"] },
  { category: "Research concepts", question: "What financial NLP work has he done?", expectedAnyOf: ["research-multifinben", "research-ebisu", "experience-the-fin-ai", "publication-multifinben-acl", "publication-ebisu-acl-arr"] },
  { category: "Unsupported", question: "What is Mingyang's favorite movie?", expectNoResults: true },
  { category: "Unsupported", question: "What are his political views?", expectNoResults: true },
  { category: "Unsupported", question: "Who will be his future employer?", expectNoResults: true },
  { category: "Unsupported", question: "What is his salary?", expectNoResults: true },
  { category: "Unsupported", question: "Tell me about his family.", expectNoResults: true },
];
