import { PageContainer } from "@/components/layout/PageContainer";

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <PageContainer className="flex flex-col gap-3 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 Mingyang Jiang</p>
        <p>Academic portfolio foundation · Stage 1</p>
      </PageContainer>
    </footer>
  );
}

