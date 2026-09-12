import { ArrowRight, BarChart3, Brain, FileText } from "lucide-react";

import type { ResearchProject } from "@/data/research";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";

const icons = {
  "EEG / NeuroAI": Brain,
  "Clinical NLP": FileText,
  "LLM Evaluation": BarChart3,
};

type ResearchCardProps = {
  project: ResearchProject;
};

export function ResearchCard({ project }: ResearchCardProps) {
  const Icon = icons[project.category];

  return (
    <article className="flex h-full flex-col rounded-lg border border-line bg-paper p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-accent-dark">
          <Icon aria-hidden="true" size={20} strokeWidth={1.8} />
        </div>
        <span className="rounded-full border border-line px-2.5 py-1 text-[0.68rem] font-medium text-muted">
          Featured
        </span>
      </div>
      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.15em] text-muted">{project.category}</p>
      <h3 className="mt-2 font-serif text-xl font-semibold leading-snug tracking-[-0.03em] text-ink">
        {project.title}
      </h3>
      <p className="mt-3 text-sm leading-6 text-muted">{project.description}</p>
      <div className="mt-5 flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>
      <Button
        aria-label={`Ask AI about ${project.title}; available in a later stage`}
        className="mt-5 w-full justify-between border border-line bg-surface text-left text-ink hover:bg-surface"
        disabled
        variant="secondary"
      >
        Ask AI about this work <ArrowRight aria-hidden="true" size={16} />
      </Button>
    </article>
  );
}

