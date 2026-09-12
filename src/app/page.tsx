import { FeaturedResearch } from "@/components/home/FeaturedResearch";
import { Hero } from "@/components/home/Hero";
import { LatestPublications } from "@/components/home/LatestPublications";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PageContainer } from "@/components/layout/PageContainer";
import { PortfolioShell } from "@/components/layout/PortfolioShell";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <PageContainer className="flex-1">
        <PortfolioShell>
          <Hero />
          <FeaturedResearch />
          <LatestPublications />
        </PortfolioShell>
      </PageContainer>
      <Footer />
    </div>
  );
}
