import type { Metadata } from "next";

import { PageFrame } from "@/components/layout/PageFrame";
import { PageHeader } from "@/components/layout/PageHeader";
import { PublicationRow } from "@/components/publications/PublicationRow";
import { publications } from "@/data/publications";

export const metadata: Metadata = {
  title: "Publications | Mingyang Jiang",
  description: "Publications, preprints, and manuscripts by Mingyang Jiang.",
};

export default function PublicationsPage() {
  return (
    <PageFrame pageContext="publications">
      <PageHeader
        eyebrow="Publications"
        title="Publications"
        description="Selected papers, posters, and manuscripts across clinical NLP, EEG / NeuroAI, and language-model evaluation."
      />
      <section aria-labelledby="publication-list-heading" className="py-12 sm:py-14">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="publication-list-heading" className="font-serif text-2xl font-semibold tracking-[-0.03em] text-ink">
              Selected Work
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Status labels reflect the current CV and distinguish submissions, review, and acceptance.
            </p>
          </div>
        </div>
        <div className="mt-7 divide-y divide-line rounded-lg border border-line bg-paper">
          {publications.map((publication) => (
            <PublicationRow key={publication.id} publication={publication} />
          ))}
        </div>
      </section>
    </PageFrame>
  );
}
