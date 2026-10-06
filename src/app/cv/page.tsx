import type { Metadata } from "next";

import { PageFrame } from "@/components/layout/PageFrame";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { profile } from "@/data/profile";

const CV_URL = "/cv/Mingyang_Jiang_CV.pdf";

export const metadata: Metadata = {
  title: "CV | Mingyang Jiang",
  description: "Curriculum vitae and academic profile of Mingyang Jiang.",
};

export default function CVPage() {
  return (
    <PageFrame pageContext="cv">
      <PageHeader
        eyebrow="Curriculum Vitae"
        title="CV"
        description="View or download the current academic curriculum vitae."
      />
      <section aria-labelledby="cv-status-heading" className="max-w-2xl py-12 sm:py-14">
        <div className="rounded-lg border border-line bg-surface p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-dark">Public document</p>
          <h2 id="cv-status-heading" className="mt-3 font-serif text-2xl font-semibold tracking-[-0.03em] text-ink">
            {profile.name}&apos;s academic CV
          </h2>
          <p className="mt-4 text-sm leading-6 text-muted">
            View or download the current academic CV, including research experience, publications, education, and skills.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href={CV_URL} variant="secondary">Open CV</Button>
            <a
              href={CV_URL}
              download
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-accent px-4 text-sm font-semibold text-white transition-colors hover:bg-accent-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              Download PDF
            </a>
            <Button href="/about" variant="secondary">View About</Button>
          </div>
        </div>
      </section>
    </PageFrame>
  );
}
