import type { ReactNode } from "react";

import { AssistantPanel, type AssistantPageContext } from "@/components/assistant/AssistantPanel";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PageContainer } from "@/components/layout/PageContainer";

type PageFrameProps = {
  children: ReactNode;
  pageContext: Exclude<AssistantPageContext, "home">;
};

export function PageFrame({ children, pageContext }: PageFrameProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="relative flex-1">
        <PageContainer>{children}</PageContainer>
        <AssistantPanel pageContext={pageContext} variant="launcher" />
      </main>
      <Footer />
    </div>
  );
}
