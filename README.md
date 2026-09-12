# Mingyang Jiang Academic Portfolio

Academic portfolio with a server-side grounded research assistant.

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
| Grounded answer checks | 31/31 (100.0%) |
| Unsupported refusal accuracy | 6/6 (100.0%) |
| Status accuracy | 11/11 (100.0%) |
| Source relevance and validity | 31/31 (100.0%) |
| Median / p95 live latency | 2,824 ms / 7,632 ms |
| Average tokens per live request | 929.7 input / 138.5 output / 1,068.2 total |
| Estimated cost | $0.000111/request; $0.0111/100; $0.1113/1,000 |

These are results from one local live run and are not a guarantee of future model behavior. The evaluator checks evidence IDs, exact refusal behavior, canonical statuses, required facts, and source-link integrity deterministically; generated answers still benefit from manual review. It does not yet compare GPT-OSS 20B with 120B, and latency can vary with provider queueing and rate limits. The 38-case retrieval baseline remains Top-5 100.0%, Top-3 93.9%, Top-1 75.8%, MRR 0.848, with 5/5 unsupported queries empty.
