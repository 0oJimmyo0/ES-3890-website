import type { Metadata } from "next";

import { PageFrame } from "@/components/layout/PageFrame";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { profile } from "@/data/profile";

export const metadata: Metadata = {
  title: "About | Mingyang Jiang",
  description: "About Mingyang Jiang and his academic interests.",
};

export default function AboutPage() {
  return (
    <PageFrame>
      <PageHeader
        eyebrow="About"
        title="About"
        description="A short professional overview of my background, interests, and approach to research."
      />

      <div className="grid gap-12 py-12 sm:py-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.7fr)] lg:gap-16">
        <section id="about-overview" aria-labelledby="about-narrative-heading">
          <h2 id="about-narrative-heading" className="font-serif text-2xl font-semibold tracking-[-0.03em] text-ink">A research-first perspective</h2>
          <div className="mt-5 space-y-4 text-base leading-7 text-muted">
            {profile.shortBio.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button href="/research">View Research</Button>
            <Button href="/cv" variant="secondary">View CV</Button>
          </div>
        </section>

        <section aria-labelledby="interests-heading" className="border-t border-line pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <h2 id="interests-heading" className="font-serif text-2xl font-semibold tracking-[-0.03em] text-ink">Research Interests</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {profile.researchInterests.map((interest) => <Tag key={interest}>{interest}</Tag>)}
          </div>
        </section>
      </div>

      <section id="education" aria-labelledby="education-heading" className="border-t border-line py-12 sm:py-14">
        <h2 id="education-heading" className="font-serif text-3xl font-semibold tracking-[-0.035em] text-ink">Education</h2>
        <div className="mt-7 rounded-lg border border-line bg-paper p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="font-serif text-xl font-semibold text-ink">{profile.education.institution}</h3>
              <p className="mt-1 text-sm text-muted">{profile.education.degree}</p>
            </div>
            <p className="text-sm text-muted">{profile.education.location}</p>
          </div>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
            <span>{profile.education.expected}</span>
            <span>GPA: {profile.education.gpa}</span>
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-accent-dark">Selected coursework</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {profile.education.coursework.map((course) => <Tag key={course}>{course}</Tag>)}
          </div>
        </div>
      </section>

      <section id="skills" aria-labelledby="skills-heading" className="border-t border-line py-12 sm:py-14">
        <h2 id="skills-heading" className="font-serif text-3xl font-semibold tracking-[-0.035em] text-ink">Technical Interests and Skills</h2>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {profile.skills.map((group) => (
            <div key={group.label} className="rounded-lg border border-line bg-paper p-5">
              <h3 className="text-sm font-semibold text-ink">{group.label}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.items.map((skill) => <Tag key={skill}>{skill}</Tag>)}
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageFrame>
  );
}
