const STOP_WORDS = new Set([
  "a",
  "about",
  "an",
  "and",
  "at",
  "are",
  "be",
  "been",
  "can",
  "did",
  "does",
  "do",
  "for",
  "from",
  "has",
  "have",
  "he",
  "her",
  "his",
  "i",
  "in",
  "is",
  "it",
  "me",
  "my",
  "of",
  "on",
  "or",
  "the",
  "their",
  "them",
  "there",
  "they",
  "this",
  "to",
  "was",
  "were",
  "what",
  "which",
  "who",
  "why",
  "with",
  "would",
  "you",
  "your",
  "mingyang",
  "done",
  "main",
  "work",
  "project",
  "projects",
  "paper",
  "papers",
  "summarize",
  "tell",
  "about",
]);

const KNOWN_PHRASES = [
  "brain signals",
  "clinical nlp",
  "health ai",
  "medication evidence",
  "llm evaluation",
  "computer science",
  "foundation models",
  "foundation model",
  "language model",
  "financial nlp",
  "research interests",
  "transfer learning",
  "parameter efficient adaptation",
  "source grounded",
  "machine learning",
  "natural language processing",
  "under review",
  "major revision invited",
  "vanderbilt university",
  "yale school of medicine",
  "neurdy lab",
  "sphere lab",
  "transactions on machine learning research",
];

export const DOMAIN_ALIASES: Record<string, string[]> = {
  brain: ["eeg", "neuroai"],
  "brain signals": ["eeg", "neuroai"],
  medical: ["clinical nlp", "health ai", "ehr"],
  clinical: ["clinical nlp", "health ai"],
  medication: ["medication evidence", "ehr"],
  publication: ["publication"],
  publications: ["publication"],
  research: ["research interests"],
  foundation: ["foundation model"],
  "foundation models": ["foundation model"],
  "language model": ["llm"],
  llm: ["language model", "llm evaluation"],
  financial: ["financial nlp"],
  finance: ["financial nlp"],
  teaching: ["teaching"],
  ta: ["teaching"],
  vanderbilt: ["vanderbilt university"],
  yale: ["yale school of medicine"],
  sphere: ["sphere lab"],
  neurdy: ["neurdy lab"],
  tmlr: ["transactions on machine learning research"],
  icassp: ["international conference on acoustics speech and signal processing"],
  graduate: ["graduation"],
};

export function normalizeText(value: string) {
  return value
    .toLocaleLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/[‐‑‒–—-]/g, " ")
    .replace(/[^a-z0-9+#.\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeQuery(query: string): string[] {
  const normalized = normalizeText(query);
  const tokens = normalized
    .split(" ")
    .map((token) => token.replace(/'s$/g, "").replace(/^[.'+]+|[.'+]+$/g, ""))
    .filter((token) => token.length > 0 && !STOP_WORDS.has(token));

  const phrases = KNOWN_PHRASES.filter((phrase) => {
    const normalizedPhrase = normalizeText(phrase);
    return normalized === normalizedPhrase || normalized.includes(` ${normalizedPhrase} `) || normalized.startsWith(`${normalizedPhrase} `) || normalized.endsWith(` ${normalizedPhrase}`);
  });

  return Array.from(new Set([...tokens, ...phrases]));
}

export function expandQuery(terms: string[]): string[] {
  const expanded = new Set(terms);

  for (const term of terms) {
    for (const alias of DOMAIN_ALIASES[term] ?? []) {
      expanded.add(normalizeText(alias));
    }
  }

  // Keep the generic term useful for broad profile questions, but do not let
  // it outrank specific concepts such as EEG or clinical NLP.
  if (expanded.size > 1) expanded.delete("research");

  return Array.from(expanded);
}
