import { ArrowRight, BookOpen } from "lucide-react";

import type { Publication } from "@/data/publications";

type PublicationRowProps = {
  publication: Publication;
};

export function PublicationRow({ publication }: PublicationRowProps) {
  return (
    <article className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex min-w-0 items-start gap-3">
        <BookOpen aria-hidden="true" className="mt-0.5 shrink-0 text-accent-dark" size={18} strokeWidth={1.8} />
        <div className="min-w-0">
          <h3 className="text-sm font-semibold leading-6 text-ink">{publication.title}</h3>
          <p className="mt-1 text-xs leading-5 text-muted">
            {publication.authors} · {publication.venue} · {publication.status}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-4 pl-8 text-xs font-semibold text-muted sm:pl-4">
        <span aria-disabled="true" className="cursor-not-allowed">PDF</span>
        <span aria-disabled="true" className="cursor-not-allowed">Cite</span>
        <ArrowRight aria-hidden="true" className="text-line" size={16} />
      </div>
    </article>
  );
}

