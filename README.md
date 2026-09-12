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
```

## Content architecture

Canonical portfolio data is rendered by the website and transformed deterministically into `KnowledgeItem` records. Retrieval selects the evidence; the server then constructs the grounded prompt and calls Groq. The assistant frontend is reserved for a later stage.

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

Stage 6 includes the server-side `/api/assistant` route. The assistant UI, retrieval changes, embeddings, and vector database are not included yet.
