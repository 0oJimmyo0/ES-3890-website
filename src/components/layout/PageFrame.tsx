import type { ReactNode } from "react";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PageContainer } from "@/components/layout/PageContainer";

type PageFrameProps = {
  children: ReactNode;
};

export function PageFrame({ children }: PageFrameProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <PageContainer>{children}</PageContainer>
      </main>
      <Footer />
    </div>
  );
}

