"use client";

import { MessageCircle, Sparkles } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { AssistantComposer } from "@/components/assistant/AssistantComposer";
import { AssistantHeader } from "@/components/assistant/AssistantHeader";
import { AssistantMessages, type ChatMessage } from "@/components/assistant/AssistantMessages";
import { SuggestedQuestions } from "@/components/assistant/SuggestedQuestions";
import { AssistantClientError, askAssistant, type AssistantHistoryMessage } from "@/lib/assistant/client";

export type AssistantPageContext = "home" | "research" | "publications" | "experience" | "about" | "cv";
export type AssistantPanelVariant = "home" | "launcher";

type AssistantPanelProps = {
  pageContext: AssistantPageContext;
  variant: AssistantPanelVariant;
};

const suggestions: Record<AssistantPageContext, string[]> = {
  home: [
    "What are Mingyang’s main research interests?",
    "Summarize his EEG research.",
    "What clinical NLP work has he done?",
    "Which publications involve EEG?",
  ],
  research: [
    "Summarize Mingyang’s EEG research.",
    "What clinical NLP projects has he worked on?",
    "What is the SPHERE project?",
    "How does his work evaluate language models?",
  ],
  publications: [
    "Which publications involve EEG?",
    "What is the status of the TMLR paper?",
    "Which papers involve LLM evaluation?",
    "What publications involve clinical NLP?",
  ],
  experience: [
    "Where has Mingyang conducted research?",
    "What did he work on at SPHERE?",
    "Tell me about his LLM evaluation experience.",
    "What teaching experience does he have?",
  ],
  about: [
    "What are Mingyang’s main research interests?",
    "Where did he study and what is his GPA?",
    "When does he expect to graduate?",
    "What technical skills does he have?",
  ],
  cv: [
    "Give me a concise academic background summary.",
    "What are Mingyang’s main research interests?",
    "Summarize his research experience.",
    "Which publications are currently submitted?",
  ],
};

function createMessageId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
}

function errorMessage(error: unknown) {
  if (!(error instanceof AssistantClientError)) return "The research assistant is temporarily unavailable.";
  if (error.code === "RATE_LIMITED") return "Too many requests right now. Please try again shortly.";
  if (error.code === "SERVICE_UNAVAILABLE") return "The research assistant is temporarily unavailable.";
  if (error.code === "CONFIGURATION_ERROR") return "The research assistant is not available right now.";
  if (error.code === "INVALID_REQUEST") return error.message;
  return "The research assistant could not complete the request.";
}

export function AssistantPanel({ pageContext, variant }: AssistantPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [lastQuestion, setLastQuestion] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const submitQuestion = useCallback(async (question: string) => {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || loading) return;

    const history: AssistantHistoryMessage[] = messages.slice(-6).map(({ role, content }) => ({ role, content }));
    setMessages((current) => [...current, { id: createMessageId(), role: "user", content: trimmedQuestion }]);
    setLastQuestion(trimmedQuestion);
    setError(null);
    setLoading(true);

    try {
      const response = await askAssistant(trimmedQuestion, history);
      setMessages((current) => [
        ...current,
        { id: createMessageId(), role: "assistant", content: response.answer, sources: response.sources },
      ]);
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, [loading, messages]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, loading, error]);

  useEffect(() => {
    function handleAsk(event: Event) {
      const question = (event as CustomEvent<{ question?: unknown }>).detail?.question;
      if (typeof question !== "string" || !question.trim()) return;
      if (variant === "launcher" || window.matchMedia("(max-width: 1099px)").matches) setDrawerOpen(true);
      void submitQuestion(question);
    }

    window.addEventListener("assistant:ask", handleAsk);
    return () => window.removeEventListener("assistant:ask", handleAsk);
  }, [submitQuestion, variant]);

  useEffect(() => {
    if (!drawerOpen) return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setDrawerOpen(false);
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [drawerOpen]);

  useEffect(() => {
    if (!drawerOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [drawerOpen]);

  function renderPanel(close?: () => void) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <AssistantHeader onClose={close} />
        <div aria-live="polite" className="min-h-0 flex-1 overflow-y-auto" role="log">
          {messages.length === 0 ? (
            <SuggestedQuestions disabled={loading} onSelect={submitQuestion} questions={suggestions[pageContext]} />
          ) : (
            <AssistantMessages messages={messages} />
          )}
          {loading && <p aria-live="polite" className="px-5 pb-4 text-xs italic text-muted">Thinking...</p>}
          {error && (
            <div aria-live="polite" className="mx-5 mb-4 rounded-md border border-red-200 bg-red-50 px-3.5 py-3 text-sm leading-5 text-red-900">
              <p>{error}</p>
              {lastQuestion && (
                <button className="mt-2 font-semibold underline underline-offset-2" onClick={() => void submitQuestion(lastQuestion)} type="button">
                  Try again
                </button>
              )}
            </div>
          )}
          <div ref={endRef} />
        </div>
        <AssistantComposer disabled={loading} onSubmit={submitQuestion} />
        <p className="shrink-0 px-5 pb-4 text-[0.68rem] leading-4 text-muted">
          Answers are grounded in the public portfolio and may be incomplete.
        </p>
      </div>
    );
  }

  const drawer = drawerOpen ? (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/25 p-2 sm:items-center sm:p-6" role="presentation">
      <button aria-label="Close research assistant" className="absolute inset-0 cursor-default" onClick={() => setDrawerOpen(false)} type="button" />
      <section
        aria-label="Research assistant"
        aria-modal="true"
        className="relative flex h-[min(90vh,48rem)] max-h-[calc(100vh-1rem)] w-full max-w-md flex-col overflow-hidden rounded-lg border border-line bg-surface shadow-xl sm:max-h-[calc(100vh-3rem)]"
        role="dialog"
      >
        {renderPanel(() => setDrawerOpen(false))}
      </section>
    </div>
  ) : null;

  if (variant === "home") {
    return (
      <>
        <aside aria-label="Research assistant" className="hidden min-[1100px]:block">
          <div className="sticky top-6 flex max-h-[calc(100vh-6rem)] min-h-[36rem] flex-col overflow-hidden border-l border-line bg-surface/70">
            {renderPanel()}
          </div>
        </aside>
        <div className="pointer-events-none min-[1100px]:hidden">
          <button
            aria-expanded={drawerOpen}
            className="pointer-events-auto fixed bottom-5 right-5 z-40 inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-4 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-accent-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            onClick={() => setDrawerOpen(true)}
            type="button"
          >
            <Sparkles aria-hidden="true" size={16} /> Ask About My Research
          </button>
          {drawer}
        </div>
      </>
    );
  }

  return (
    <div>
      <button
        aria-expanded={drawerOpen}
        className="fixed bottom-5 right-5 z-40 inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-4 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-accent-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        onClick={() => setDrawerOpen(true)}
        type="button"
      >
        <MessageCircle aria-hidden="true" size={16} /> Ask About My Research
      </button>
      {drawer}
    </div>
  );
}
