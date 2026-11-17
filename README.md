# Mingyang Jiang Academic Portfolio

Academic portfolio with a server-side grounded research assistant.

## November chatbot improvements

The chat panel now includes **Short** and **Detailed** response controls. Short is the UI default and asks for at most 70 words; Detailed asks for 120–180 words on broad research questions when the evidence supports it. Simple facts and unavailable/private information still receive brief answers. The server validates the preference and adjusts both instructions and the completion budget. Existing API clients that omit `responseMode` keep the standard behavior.

Pronoun follow-ups such as “What is its current status?” now use recent user questions to restore the topic before retrieving portfolio evidence. Assistant replies are not treated as a source of retrieval context or facts. A standalone question starts a new topic. History remains limited to six messages; reference resolution uses a small phrase heuristic and can still be ambiguous.

The new assignment report is in `docs/course-chatbot-improvement-report.md` and its PDF. Browser screenshots, original API responses, and reviewed results are saved under `reports/chatbot-improvement/`. The before screenshots were captured from the unchanged local MVP before source edits, using the live Groq service. The new feature and fix were deployed to https://es-3890-website.vercel.app/ on November 17, 2026. An anonymous-browser check confirmed both response modes and the TRACE follow-up on the public site.

`npm run test:assistant` includes targeted checks for pronoun follow-ups, topic changes, chained context, untrusted assistant history, and response-mode validation. Use `npm run dev` to demonstrate the updated chat locally, open the assistant, choose Short or Detailed, and send a portfolio question.

## Local development

```bash
npm install
npm run dev
```

Validation commands:

```bash
npm run lint
npm run typecheck
npm run build
npm run eval:retrieval
npm run test:assistant
npm run eval:assistant
```

## Content architecture

Canonical portfolio data is rendered by the website and transformed deterministically into `KnowledgeItem` records. Retrieval selects the evidence; the server then constructs the grounded prompt and calls Groq. The assistant frontend uses the same server-generated source metadata.

```text
canonical portfolio data → website pages
                        → KnowledgeItem layer
                        → deterministic retrieval
                        → top-k public evidence
                        → server-side grounded prompt
                        → Groq
                        → answer + deterministic source metadata
```

## Environment configuration

Copy the example values into the local-only `.env.local` file:

```env
GROQ_API_KEY=your_key_here
GROQ_MODEL=openai/gpt-oss-20b
```

`.env.local` is ignored by Git. Never use `NEXT_PUBLIC_` for the API key or commit the file.

Stage 6 includes the server-side `/api/assistant` route. Stage 7 adds the assistant UI; embeddings and a vector database are intentionally out of scope.

## Assistant evaluation

`npm run eval:assistant` runs the complete route in-process over the checked-in end-to-end evaluation set. It tests profile, education, research, publications, experience, cross-project synthesis, unsupported/private questions, prompt injection, status preservation, source integrity, and bounded multi-turn history. The evaluator uses deterministic checks for evidence, refusal, status, required facts, and source links; generated answers and failures are saved to `reports/assistant-evaluation.latest.json` for manual review.

The production configuration is `openai/gpt-oss-20b` with `reasoning_effort: "low"`, `include_reasoning: false`, `temperature: 0.15`, and `max_completion_tokens: 400`. The illustrative cost calculation uses Groq's documented rates of $0.075 per million input tokens and $0.30 per million output tokens for this model; current account limits and pricing should be checked in the [Groq model documentation](https://console.groq.com/docs/model/openai/gpt-oss-20b) and [rate-limit documentation](https://console.groq.com/docs/rate-limits).

The evaluation does not run a 120B comparison by default, to avoid unnecessary API usage. Current retrieval regression remains separate in `npm run eval:retrieval`.

Latest local Stage 8 snapshot:

| Measure | Result |
| --- | --- |
| End-to-end cases | 37 (31 supported, 6 unsupported) |
| Grounded answer checks | 29/31 (93.5%) in the last completed live run |
| Unsupported refusal accuracy | 6/6 (100.0%) |
| Status accuracy | 11/11 (100.0%) |
| Source relevance and validity | 31/31 (100.0%) |
| Median / p95 live latency | 1,612 ms / 7,678 ms |
| Average tokens per live request | 1,047.0 input / 134.2 output / 1,181.1 total |
| Estimated cost | $0.000119/request; $0.0119/100; $0.1188/1,000 |

These are results from one local live run before the final pronoun/completeness hardening and are not a guarantee of future model behavior. The evaluator checks evidence IDs, exact refusal behavior, canonical statuses, required facts, and source-link integrity deterministically; generated answers still benefit from manual review. A subsequent live rerun was blocked by Groq rate limiting, so the final hardening should be re-measured with `npm run eval:assistant` after the quota window clears. It does not yet compare GPT-OSS 20B with 120B, and latency can vary with provider queueing and rate limits. The 38-case retrieval baseline remains Top-5 100.0%, Top-3 93.9%, Top-1 75.8%, MRR 0.848, with 5/5 unsupported queries empty.

Stage 8.1 adds project-scoped derived experience records from explicit canonical contribution associations. Named-project prompts use those records to prevent unrelated methods from being attributed across projects; broad prompts retain the original experience records for synthesis. The evaluator explicitly checks TRACE contributions and rejects clinical-transition concepts when they are attached to TRACE.
