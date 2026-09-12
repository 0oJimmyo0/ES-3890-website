import { ArrowRight, BookOpen, Layers3, Sparkles } from "lucide-react";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Tag } from "@/components/ui/Tag";

const foundationCards = [
  {
    icon: Layers3,
    label: "Research theme placeholder",
    title: "EEG / NeuroAI",
    text: "A future research overview will introduce foundation models, transfer learning, and brain-signal intelligence.",
  },
  {
    icon: BookOpen,
    label: "Research theme placeholder",
    title: "Clinical NLP",
    text: "A future research overview will introduce source-grounded healthcare language systems and evaluation.",
  },
  {
    icon: Sparkles,
    label: "Research theme placeholder",
    title: "LLM Evaluation",
    text: "A future research overview will introduce multilingual, multimodal, and domain-specific benchmarking.",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <PageContainer>
          <section
            aria-labelledby="hero-heading"
            className="grid gap-10 border-b border-line py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(19rem,0.62fr)] lg:gap-16 lg:py-24"
          >
            <div className="flex max-w-3xl flex-col justify-center">
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-accent-dark">
                Academic portfolio · Stage 1 foundation
              </p>
              <h1
                id="hero-heading"
                className="max-w-3xl font-serif text-[2.75rem] font-semibold leading-[1.08] tracking-[-0.045em] text-ink sm:text-5xl lg:text-[3.625rem]"
              >
                Mingyang Jiang
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-muted sm:text-xl">
                A visual foundation for an academic portfolio centered on research in EEG / NeuroAI,
                clinical NLP, and reliable language-model evaluation.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="#featured-research">
                  Explore the structure <ArrowRight aria-hidden="true" size={16} />
                </Button>
                <Button href="#latest-publications" variant="secondary">
                  View placeholder sections
                </Button>
              </div>
            </div>

            <div
              aria-label="Reserved visual area for future homepage artwork or assistant rail"
              className="relative min-h-64 overflow-hidden rounded-xl border border-line bg-surface p-6 sm:min-h-72 lg:min-h-full"
            >
              <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-accent-soft" />
              <div className="absolute bottom-6 left-6 right-6 border-l-2 border-accent pl-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-dark">
                  Reserved layout space
                </p>
                <p className="mt-2 max-w-xs font-serif text-2xl leading-tight text-ink">
                  Future visual identity and assistant rail can live here.
                </p>
              </div>
            </div>
          </section>

          <section
            id="featured-research"
            aria-labelledby="featured-research-heading"
            className="py-16 sm:py-20 lg:py-24"
          >
            <SectionHeader
              eyebrow="Section placeholder"
              id="featured-research-heading"
              title="Featured Research"
              description="This section establishes the card grid, typography, and spacing that later research content will reuse."
            />
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {foundationCards.map(({ icon: Icon, label, title, text }) => (
                <article
                  key={title}
                  className="rounded-xl border border-line bg-paper p-6 shadow-subtle transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent-dark">
                      <Icon aria-hidden="true" size={21} strokeWidth={1.8} />
                    </div>
                    <Tag>Placeholder</Tag>
                  </div>
                  <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                    {label}
                  </p>
                  <h3 className="mt-2 font-serif text-2xl font-semibold tracking-[-0.03em] text-ink">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted">{text}</p>
                </article>
              ))}
            </div>
          </section>

          <section
            id="latest-publications"
            aria-labelledby="latest-publications-heading"
            className="border-t border-line py-16 sm:py-20 lg:py-24"
          >
            <SectionHeader
              eyebrow="Section placeholder"
              id="latest-publications-heading"
              title="Latest Publications"
              description="Publication records, statuses, links, and filters will be added in a later stage."
            />
            <div className="mt-8 divide-y divide-line rounded-xl border border-line bg-paper">
              {["Publication item placeholder", "Publication item placeholder", "Publication item placeholder"].map(
                (item, index) => (
                  <div
                    key={`${item}-${index}`}
                    className="flex flex-col gap-3 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                  >
                    <div className="flex items-start gap-3">
                      <BookOpen aria-hidden="true" className="mt-0.5 shrink-0 text-accent-dark" size={18} />
                      <div>
                        <p className="text-sm font-semibold text-ink">{item}</p>
                        <p className="mt-1 text-xs text-muted">Metadata and publication status will be connected later.</p>
                      </div>
                    </div>
                    <span className="w-fit rounded-full border border-line px-2.5 py-1 text-xs font-medium text-muted">
                      Stage 2
                    </span>
                  </div>
                ),
              )}
            </div>
          </section>
        </PageContainer>
      </main>

      <Footer />
    </div>
  );
}
