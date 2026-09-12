import type { Metadata } from "next";

import { ExperienceEntry } from "@/components/experience/ExperienceEntry";
import { PageFrame } from "@/components/layout/PageFrame";
import { PageHeader } from "@/components/layout/PageHeader";
import { researchExperience, teachingExperience } from "@/data/experience";

export const metadata: Metadata = {
  title: "Experience | Mingyang Jiang",
  description: "Research and teaching experience of Mingyang Jiang.",
};

export default function ExperiencePage() {
  return (
    <PageFrame>
      <PageHeader
        eyebrow="Experience"
        title="Experience"
        description="Research contributions across EEG / NeuroAI, clinical NLP, and language-model evaluation, alongside teaching and communication experience."
      />

      <section aria-labelledby="research-experience-heading" className="py-12 sm:py-14">
        <h2 id="research-experience-heading" className="font-serif text-3xl font-semibold tracking-[-0.035em] text-ink">Research Experience</h2>
        <ol className="mt-8 space-y-10 border-l border-line pb-2">
          {researchExperience.map((item) => <ExperienceEntry key={item.id} item={item} />)}
        </ol>
      </section>

      <section aria-labelledby="teaching-experience-heading" className="border-t border-line py-12 sm:py-14">
        <h2 id="teaching-experience-heading" className="font-serif text-3xl font-semibold tracking-[-0.035em] text-ink">Teaching Experience</h2>
        <ol className="mt-8 space-y-10 border-l border-line pb-2">
          {teachingExperience.map((item) => <ExperienceEntry key={item.id} item={item} />)}
        </ol>
      </section>
    </PageFrame>
  );
}

