import { experience } from "@/data/experience";
import { publications } from "@/data/publications";
import { profile } from "@/data/profile";
import { researchProjects } from "@/data/research";

import type { KnowledgeItem } from "@/data/knowledge/types";

function uniqueTags(...groups: (string | string[] | undefined)[]) {
  return Array.from(
    new Set(
      groups
        .flatMap((group) => (Array.isArray(group) ? group : [group]))
        .filter((tag): tag is string => Boolean(tag?.trim())),
    ),
  );
}

function buildProfileItem(): KnowledgeItem {
  return {
    id: "profile-overview",
    type: "profile",
    title: profile.name,
    tags: uniqueTags("Computer Science", "research interests", "EEG", "NeuroAI", "Clinical NLP", "Health AI", "LLM Evaluation"),
    content: [
      `Name: ${profile.name}`,
      `Headline: ${profile.headline}`,
      `Short bio: ${profile.shortBio.join(" ")}`,
      `Research interests: ${profile.researchInterests.join(", ")}`,
    ].join("\n\n"),
    sourceLabel: "About — Overview",
    sourceHref: "/about#about-overview",
  };
}

function buildEducationItem(): KnowledgeItem {
  const education = profile.education;

  return {
    id: "education-vanderbilt",
    type: "education",
    title: `${education.institution} — ${education.degree}`,
    tags: uniqueTags("Vanderbilt University", "Computer Science", education.location),
    content: [
      `Institution: ${education.institution}`,
      `Location: ${education.location}`,
      `Degree: ${education.degree}`,
      `Expected graduation: ${education.expected}`,
      `GPA: ${education.gpa}`,
      `Selected coursework: ${education.coursework.join(", ")}`,
    ].join("\n\n"),
    sourceLabel: "About — Education",
    sourceHref: "/about#education",
  };
}

function buildSkillsItems(): KnowledgeItem[] {
  return profile.skills.map((group) => ({
    id: `skills-${group.label.toLowerCase().replaceAll(" ", "-")}`,
    type: "skills" as const,
    title: group.label,
    tags: uniqueTags(group.label, group.items),
    content: [`Skill area: ${group.label}`, `Skills: ${group.items.join(", ")}`].join("\n\n"),
    sourceLabel: `About — Skills (${group.label})`,
    sourceHref: "/about#skills",
  }));
}

function buildResearchItems(): KnowledgeItem[] {
  return researchProjects.map((project) => ({
    id: `research-${project.id}`,
    type: "research" as const,
    title: project.title,
    tags: uniqueTags(project.category, project.title, project.tags),
    content: [
      `Title: ${project.title}`,
      `Theme: ${project.category}`,
      `Status: ${project.status}`,
      `Summary:\n${project.shortDescription}`,
      `Problem:\n${project.problem}`,
      `Approach:\n${project.approach}`,
      `Contribution:\n${project.contribution}`,
      `Mingyang's role:\n${project.myRole}`,
    ].join("\n\n"),
    sourceLabel: `Research — ${project.title}`,
    sourceHref: `/research#${project.id}`,
  }));
}

function buildPublicationItems(): KnowledgeItem[] {
  return publications.map((publication) => ({
    id: `publication-${publication.id}`,
    type: "publication" as const,
    title: publication.title,
    tags: uniqueTags("publication", publication.topics, publication.venue, publication.status, publication.year?.toString()),
    content: [
      `Title: ${publication.title}`,
      `Authors: ${publication.authors.join(", ")}`,
      `Venue: ${publication.venue}`,
      publication.year ? `Year: ${publication.year}` : undefined,
      `Status: ${publication.status}`,
      `Topics: ${publication.topics.join(", ")}`,
    ]
      .filter((line): line is string => Boolean(line))
      .join("\n\n"),
    sourceLabel: `Publications — ${publication.title}`,
    sourceHref: `/publications#${publication.id}`,
  }));
}

function buildExperienceItems(): KnowledgeItem[] {
  return experience.map((item) => ({
    id: `${item.type === "Research" ? "experience" : "teaching"}-${item.id}`,
    type: item.type === "Research" ? "experience" : "teaching",
    title: item.role,
    tags: uniqueTags(item.tags, item.institution, item.lab),
    content: [
      `Institution: ${item.institution}`,
      item.lab ? `Lab: ${item.lab}` : undefined,
      `Role: ${item.role}`,
      `Dates: ${item.dateLabel}`,
      item.location ? `Location: ${item.location}` : undefined,
      `Summary:\n${item.summary}`,
      `Contributions:\n- ${item.contributions
        .map((contribution, index) => {
          const projects = item.contributionProjects?.[index] ?? [];
          return projects.length > 0 ? `[Project association: ${projects.join(", ")}] ${contribution}` : contribution;
        })
        .join("\n- ")}`,
    ]
      .filter((line): line is string => Boolean(line))
      .join("\n\n"),
    sourceLabel: item.lab ? `Experience — ${item.lab}` : `Experience — ${item.institution}`,
    sourceHref: `/experience#${item.id}`,
  }));
}

function buildProjectExperienceItems(): KnowledgeItem[] {
  return experience.flatMap((item) => {
    const projectIds = Array.from(new Set(item.contributionProjects?.flat() ?? []));

    return projectIds.flatMap((projectId) => {
      const project = researchProjects.find((candidate) => candidate.id === projectId);
      if (!project) return [];

      const linkedContributions = item.contributions.filter((_, index) => item.contributionProjects?.[index]?.includes(projectId));
      if (linkedContributions.length === 0) return [];

      return [{
        id: `experience-${item.id}-${projectId}`,
        type: item.type === "Research" ? "experience" as const : "teaching" as const,
        title: `${item.role} — ${project.title}`,
        scope: projectId,
        tags: uniqueTags(item.institution, item.lab, project.category, project.title, project.tags),
        content: [
          `Institution: ${item.institution}`,
          item.lab ? `Lab: ${item.lab}` : undefined,
          `Role: ${item.role}`,
          `Project: ${project.title}`,
          `Contributions explicitly associated with this project:\n- ${linkedContributions.join("\n- ")}`,
        ]
          .filter((line): line is string => Boolean(line))
          .join("\n\n"),
        sourceLabel: item.lab ? `Experience — ${item.lab}` : `Experience — ${item.institution}`,
        sourceHref: `/experience#${item.id}`,
      }];
    });
  });
}

const validSourceHrefs = new Set([
  "/about#about-overview",
  "/about#education",
  "/about#skills",
  ...researchProjects.map((project) => `/research#${project.id}`),
    ...publications.map((publication) => `/publications#${publication.id}`),
    ...experience.map((item) => `/experience#${item.id}`),
]);

export function buildKnowledgeBase(): KnowledgeItem[] {
  return [
    buildProfileItem(),
    buildEducationItem(),
    ...buildSkillsItems(),
    ...buildResearchItems(),
    ...buildPublicationItems(),
    ...buildExperienceItems(),
    ...buildProjectExperienceItems(),
  ];
}

export function validateKnowledgeBase(items: KnowledgeItem[]) {
  const ids = new Set<string>();

  for (const item of items) {
    if (ids.has(item.id)) {
      throw new Error(`Knowledge item IDs must be unique: ${item.id}`);
    }
    ids.add(item.id);

    if (!item.title.trim()) throw new Error(`Knowledge item title is empty: ${item.id}`);
    if (!item.content.trim()) throw new Error(`Knowledge item content is empty: ${item.id}`);
    if (!item.sourceLabel.trim()) throw new Error(`Knowledge item source label is empty: ${item.id}`);
    if (!item.sourceHref.startsWith("/")) throw new Error(`Knowledge item source must be internal: ${item.id}`);
    if (!validSourceHrefs.has(item.sourceHref)) throw new Error(`Knowledge item source anchor is missing: ${item.sourceHref}`);
    if (!item.tags.some((tag) => tag.trim().length >= 2)) {
      throw new Error(`Knowledge item needs a meaningful tag: ${item.id}`);
    }
  }

  return items;
}
