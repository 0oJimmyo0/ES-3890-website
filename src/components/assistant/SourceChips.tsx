import Link from "next/link";

import type { AssistantSource } from "@/lib/assistant/client";

type SourceChipsProps = {
  sources: AssistantSource[];
};

export function SourceChips({ sources }: SourceChipsProps) {
  if (sources.length === 0) return null;

  return (
    <div className="mt-4">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted">Sources</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {sources.map((source) => {
          const className = "block max-w-full truncate rounded-full border border-accent/20 bg-paper px-2.5 py-1 text-[0.68rem] font-medium text-accent-dark transition-colors hover:border-accent/50 hover:bg-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2";

          return source.href.startsWith("/") ? (
            <Link className={className} href={source.href} key={`${source.href}-${source.title}`} title={source.title}>
              {source.title}
            </Link>
          ) : (
            <a className={className} href={source.href} key={`${source.href}-${source.title}`} rel="noreferrer" target="_blank" title={source.title}>
              {source.title}
            </a>
          );
        })}
      </div>
    </div>
  );
}
