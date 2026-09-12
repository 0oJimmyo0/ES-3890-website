import type { ReactNode } from "react";

type TagProps = {
  children: ReactNode;
};

export function Tag({ children }: TagProps) {
  return (
    <span className="inline-flex items-center rounded-full border border-accent/15 bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent-dark">
      {children}
    </span>
  );
}

