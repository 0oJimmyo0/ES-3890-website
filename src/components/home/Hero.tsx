import { ArrowRight, Download, FileText, Globe2, GraduationCap } from "lucide-react";

import { Button } from "@/components/ui/Button";

const summaryItems = [
  {
    icon: GraduationCap,
    label: "Undergraduate",
    value: "Computer Science",
  },
  {
    icon: FileText,
    label: "Research Focus",
    value: "EEG · Clinical NLP · LLM Evaluation",
  },
  {
    icon: Globe2,
    label: "Goal",
    value: "Better AI for a healthier, more human future",
  },
];

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="border-b border-line bg-[#f7faff] px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.88fr)] lg:items-center lg:gap-12">
        <div className="max-w-2xl">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-accent-dark">
            Student · Researcher · Life-long learner
          </p>
          <h1 id="hero-heading" className="mt-4 font-serif text-[2.65rem] font-semibold leading-[1.08] tracking-[-0.05em] text-ink sm:text-5xl lg:text-[3.4rem]">
            Mingyang Jiang
          </h1>
          <p className="mt-4 text-base font-medium leading-7 text-ink sm:text-lg">
            Computer Science Student | Research in EEG, Clinical NLP, and LLM Evaluation.
          </p>
          <p className="mt-4 max-w-xl text-sm leading-6 text-muted sm:text-base sm:leading-7">
            I&apos;m an undergraduate computer science student interested in building reliable,
            human-centered AI systems for healthcare. My research spans EEG / NeuroAI, clinical NLP,
            and evaluation of large language models.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button href="/research">
              View Research <ArrowRight aria-hidden="true" size={16} />
            </Button>
            <Button href="/cv" variant="secondary">
              <Download aria-hidden="true" size={16} />
              Download CV
            </Button>
          </div>
          <p className="mt-3 text-xs text-muted">The current CV page will provide the public download when available.</p>
        </div>

        <div className="relative">
          <div
            role="img"
            aria-label="Placeholder for a public-safe Vanderbilt campus image"
            className="relative aspect-[1.35] min-h-64 overflow-hidden rounded-lg border border-line bg-[#eaf3ff]"
          >
            <div className="absolute inset-x-0 bottom-0 flex h-1/2 items-end justify-center gap-1.5 px-8 opacity-40" aria-hidden="true">
              <span className="h-12 w-5 bg-[#9bbce5]" />
              <span className="h-20 w-8 bg-[#7fa7d7]" />
              <span className="h-14 w-10 bg-[#abc9eb]" />
              <span className="h-28 w-12 bg-[#6d97c9]" />
              <span className="h-16 w-7 bg-[#8bb1dd]" />
              <span className="h-24 w-10 bg-[#709bcd]" />
              <span className="h-11 w-6 bg-[#a4c2e8]" />
            </div>
            <div className="absolute left-6 top-6 max-w-[12rem] border-l-2 border-accent pl-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-dark">
                Campus image placeholder
              </p>
              <p className="mt-2 text-sm leading-6 text-muted">
                A public-safe academic image can be added to this frame later.
              </p>
            </div>
          </div>
          <p className="mt-3 text-right font-serif text-sm italic text-muted">
            Better AI for a healthier, more human future.
          </p>
        </div>
      </div>

      <div className="mt-10 grid border-t border-line/80 pt-6 sm:grid-cols-3 sm:divide-x sm:divide-line/80">
        {summaryItems.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex gap-3 py-3 sm:px-5 sm:first:pl-0 sm:last:pr-0">
            <Icon aria-hidden="true" className="mt-0.5 shrink-0 text-accent-dark" size={20} strokeWidth={1.7} />
            <div>
              <p className="text-xs font-semibold text-ink">{label}</p>
              <p className="mt-1 text-xs leading-5 text-muted">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
