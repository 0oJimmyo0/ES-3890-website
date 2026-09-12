import { ArrowUpRight } from "lucide-react";

type SuggestedQuestionsProps = {
  questions: string[];
  disabled?: boolean;
  onSelect: (question: string) => void;
};

export function SuggestedQuestions({ questions, disabled = false, onSelect }: SuggestedQuestionsProps) {
  return (
    <div className="px-5 py-5">
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">Try asking</p>
      <div className="mt-3 space-y-2">
        {questions.map((question) => (
          <button
            key={question}
            className="group flex w-full items-start justify-between gap-3 rounded-md border border-line bg-paper px-3 py-2.5 text-left text-xs leading-5 text-ink transition-colors hover:border-accent/45 hover:bg-accent-soft/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            disabled={disabled}
            onClick={() => onSelect(question)}
            type="button"
          >
            <span>{question}</span>
            <ArrowUpRight aria-hidden="true" className="mt-0.5 shrink-0 text-accent-dark opacity-60 transition-opacity group-hover:opacity-100" size={14} />
          </button>
        ))}
      </div>
    </div>
  );
}
