import type { Metadata } from "next";

import { PageFrame } from "@/components/layout/PageFrame";
import { PageHeader } from "@/components/layout/PageHeader";
import { ResearchProjectDetail } from "@/components/research/ResearchProjectDetail";
import { researchProjects, researchThemes } from "@/data/research";

export const metadata: Metadata = {
  title: "Research | Mingyang Jiang",
  description: "Research themes and projects by Mingyang Jiang.",
};

const themeAnchors = {
  "EEG / NeuroAI": "eeg-neuroai",
  "Clinical NLP / Health AI": "clinical-nlp-health-ai",
  "LLM Evaluation": "llm-evaluation",
};

export default function ResearchPage() {
  return (
    <PageFrame pageContext="research">
      <PageHeader
        eyebrow="Research"
        title="Research"
        description="My work spans EEG / NeuroAI, clinical NLP and health AI, and evaluation of large language models."
      />

      <section aria-labelledby="research-themes-heading" className="py-12 sm:py-14">
        <h2 id="research-themes-heading" className="font-serif text-3xl font-semibold tracking-[-0.035em] text-ink">
          Research Themes
        </h2>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {researchThemes.map((theme, index) => (
            <a
              key={theme.category}
              className="rounded-lg border border-line bg-paper p-5 transition-colors hover:border-accent/40 hover:bg-accent-soft/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              href={`#${themeAnchors[theme.category]}`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-dark">0{index + 1}</p>
              <h3 className="mt-4 font-serif text-xl font-semibold tracking-[-0.03em] text-ink">{theme.category}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{theme.description}</p>
            </a>
          ))}
        </div>
      </section>

      <div className="pb-10 sm:pb-14">
        {researchThemes.map((theme, index) => (
          <section
            key={theme.category}
            id={themeAnchors[theme.category]}
            aria-labelledby={`${themeAnchors[theme.category]}-heading`}
            className="scroll-mt-6 border-t border-line py-10 sm:py-12"
          >
            <div className="flex items-baseline gap-4">
              <span className="font-serif text-xl text-accent-dark">0{index + 1}</span>
              <h2 id={`${themeAnchors[theme.category]}-heading`} className="font-serif text-2xl font-semibold tracking-[-0.03em] text-ink">
                {theme.category}
              </h2>
            </div>
            <div className="mt-8 space-y-8">
              {researchProjects
                .filter((project) => project.category === theme.category)
                .map((project) => (
                  <ResearchProjectDetail key={project.id} project={project} />
                ))}
            </div>
          </section>
        ))}
      </div>
    </PageFrame>
  );
}
