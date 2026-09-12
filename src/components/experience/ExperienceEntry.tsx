import { MapPin } from "lucide-react";

import type { ExperienceItem } from "@/data/experience";
import { Tag } from "@/components/ui/Tag";

type ExperienceEntryProps = {
  item: ExperienceItem;
};

export function ExperienceEntry({ item }: ExperienceEntryProps) {
  return (
    <li className="relative pl-7 sm:pl-10">
      <span aria-hidden="true" className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-accent bg-paper sm:left-1" />
      <article>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-dark">
              {item.lab ? `${item.lab} · ` : ""}{item.institution}
            </p>
            <h3 className="mt-2 font-serif text-xl font-semibold tracking-[-0.03em] text-ink">{item.role}</h3>
          </div>
          <time dateTime={item.startDate} className="shrink-0 text-sm text-muted">{item.dateLabel}</time>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-muted">
          {item.location && <><MapPin aria-hidden="true" size={14} />{item.location}</>}
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-muted">{item.summary}</p>
        <ul className="mt-4 max-w-3xl space-y-2 text-sm leading-6 text-ink">
          {item.contributions.map((contribution) => (
            <li key={contribution} className="relative pl-5 before:absolute before:left-0 before:top-[0.65rem] before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent">
              {contribution}
            </li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap gap-1.5">
          {item.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
        </div>
      </article>
    </li>
  );
}

