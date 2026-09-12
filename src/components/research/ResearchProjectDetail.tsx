import { ArrowUpRight } from "lucide-react";

import type { ResearchProject } from "@/data/research";
import { Tag } from "@/components/ui/Tag";

type ResearchProjectDetailProps = {
  project: ResearchProject;
};

const fields = [
  ["Problem", "problem"],
  ["Approach", "approach"],
  ["Contribution", "contribution"],
  ["My Role", "myRole"],
] as const;

export function ResearchProjectDetail({ project }: ResearchProjectDetailProps) {
  return (
    <article id={project.id} className="scroll-mt-6 border-t border-line py-8 first:border-t-0 first:pt-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-dark">{project.category}</p>
          <h3 className="mt-2 font-serif text-2xl font-semibold tracking-[-0.03em] text-ink">{project.title}</h3>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">{project.shortDescription}</p>
        </div>
        <Tag>{project.status}</Tag>
      </div>
      <dl className="mt-7 grid gap-x-8 gap-y-6 border-y border-line/80 py-6 sm:grid-cols-2">
        {fields.map(([label, key]) => (
          <div key={label}>
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{label}</dt>
            <dd className="mt-2 text-sm leading-6 text-ink">{project[key]}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-5 flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>
      {project.links && (
        <div className="mt-5 flex flex-wrap gap-4">
          {project.links.map((link) => (
            <a
              key={link.href}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-dark hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4"
              href={link.href}
              rel="noreferrer"
              target="_blank"
            >
              {link.label} <ArrowUpRight aria-hidden="true" size={15} />
            </a>
          ))}
        </div>
      )}
    </article>
  );
}

