import type { ReactNode } from "react";

type PortfolioShellProps = {
  children: ReactNode;
};

export function PortfolioShell({ children }: PortfolioShellProps) {
  return (
    <div className="grid min-w-0 gap-8 min-[1100px]:grid-cols-[minmax(0,1fr)_22rem] min-[1100px]:gap-10">
      <main className="min-w-0">{children}</main>
      <aside className="hidden min-[1100px]:block" aria-label="Future research assistant">
        <div className="sticky top-6 border-l border-line bg-surface/70 px-6 py-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-md border border-accent/15 bg-accent-soft text-accent-dark">
            <span aria-hidden="true" className="text-lg">✦</span>
          </div>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-accent-dark">
            Coming later
          </p>
          <h2 className="mt-2 font-serif text-2xl font-semibold tracking-[-0.03em] text-ink">
            Ask About My Research
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            The grounded research assistant will be added in a later stage.
          </p>
        </div>
      </aside>
    </div>
  );
}

