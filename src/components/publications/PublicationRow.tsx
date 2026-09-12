import { ArrowRight, BookOpen } from "lucide-react";

import type { Publication } from "@/data/publications";

type PublicationRowProps = {
  publication: Publication;
  compact?: boolean;
};

export function PublicationRow({ publication, compact = false }: PublicationRowProps) {
  const actions = [
    publication.pdfHref ? { label: "PDF", href: publication.pdfHref } : null,
    publication.externalHref
      ? { label: publication.externalHref.includes("arxiv.org") ? "arXiv" : "Source", href: publication.externalHref }
      : null,
  ].filter((action): action is { label: string; href: string } => Boolean(action));

  return (
    <article id={publication.id} className="scroll-mt-6 flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex min-w-0 items-start gap-3">
        <BookOpen aria-hidden="true" className="mt-0.5 shrink-0 text-accent-dark" size={18} strokeWidth={1.8} />
        <div className="min-w-0">
          <h3 className="text-sm font-semibold leading-6 text-ink">{publication.title}</h3>
          <p className="mt-1 text-xs leading-5 text-muted">
            {publication.authors.join(", ")} · {publication.venue}
            {publication.year ? ` · ${publication.year}` : ""} · {publication.status}
          </p>
          {!compact && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {publication.topics.map((topic) => (
                <span key={topic} className="rounded-full border border-line px-2.5 py-1 text-[0.68rem] font-medium text-muted">
                  {topic}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      {actions.length > 0 && (
        <div className="flex shrink-0 items-center gap-4 pl-8 text-xs font-semibold text-muted sm:pl-4">
          {actions.map((action) => (
            <a
              className="transition-colors hover:text-accent-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4"
              href={action.href}
              key={action.href}
              rel="noreferrer"
              target="_blank"
            >
              {action.label}
            </a>
          ))}
          <ArrowRight aria-hidden="true" className="text-accent-dark" size={16} />
        </div>
      )}
    </article>
  );
}
