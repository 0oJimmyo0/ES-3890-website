import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { featuredResearch } from "@/data/research";
import { ResearchCard } from "@/components/research/ResearchCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function FeaturedResearch() {
  return (
    <section id="featured-research" aria-labelledby="featured-research-heading" className="py-12 sm:py-14">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeader
          id="featured-research-heading"
          title="Featured Research"
          description="Selected projects at the intersection of AI and healthcare."
        />
        <Link
          className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-accent-dark transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4"
          href="/research"
        >
          View All Research <ArrowRight aria-hidden="true" size={16} />
        </Link>
      </div>
      <div className="mt-7 grid gap-4 md:grid-cols-3">
        {featuredResearch.map((project) => (
          <ResearchCard key={project.title} project={project} />
        ))}
      </div>
    </section>
  );
}

