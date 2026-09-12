import type { ReactNode } from "react";

import { AssistantPanel } from "@/components/assistant/AssistantPanel";

type PortfolioShellProps = {
  children: ReactNode;
};

export function PortfolioShell({ children }: PortfolioShellProps) {
  return (
    <div className="grid min-w-0 gap-8 min-[1100px]:grid-cols-[minmax(0,1fr)_22rem] min-[1100px]:gap-10">
      <main className="min-w-0">{children}</main>
      <AssistantPanel pageContext="home" variant="home" />
    </div>
  );
}
