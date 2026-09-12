import { PageContainer } from "@/components/layout/PageContainer";

export function Footer() {
  return (
    <footer id="cv-download" className="border-t border-line bg-surface">
      <PageContainer className="flex flex-col gap-3 py-7 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 Mingyang Jiang</p>
        <p>Research · Publications · CV</p>
      </PageContainer>
    </footer>
  );
}

