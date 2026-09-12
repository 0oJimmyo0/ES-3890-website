import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { latestPublications } from "@/data/publications";
import { PublicationRow } from "@/components/publications/PublicationRow";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function LatestPublications() {
  return (
    <section id="latest-publications" aria-labelledby="latest-publications-heading" className="border-t border-line py-12 sm:py-14">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeader
          id="latest-publications-heading"
          title="Latest Publications"
          description="Selected publications and preprints."
        />
        <Link
          className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-accent-dark transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4"
          href="/publications"
        >
          View All Publications <ArrowRight aria-hidden="true" size={16} />
        </Link>
      </div>
      <div className="mt-7 divide-y divide-line rounded-lg border border-line bg-paper">
        {latestPublications.map((publication) => (
          <PublicationRow key={publication.id} compact publication={publication} />
        ))}
      </div>
    </section>
  );
}
