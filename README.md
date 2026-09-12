# Mingyang Jiang Academic Portfolio

Stage 1 foundation for an academic portfolio with a future grounded research assistant.

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
```

The current page intentionally contains visual placeholders only. Portfolio content and the AI assistant are reserved for later stages.

## Content architecture

Canonical portfolio data is rendered by the website and transformed deterministically into `KnowledgeItem` records for future retrieval. The planned flow is:

```text
canonical portfolio data → website pages
                        → KnowledgeItem layer
                        → retrieval in a future stage
                        → grounded assistant in a future stage
```

The knowledge layer does not call an LLM, contain embeddings, or expose a public navigation page.
