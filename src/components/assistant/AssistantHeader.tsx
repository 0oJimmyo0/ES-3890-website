import { Sparkles, X } from "lucide-react";

type AssistantHeaderProps = {
  onClose?: () => void;
};

export function AssistantHeader({ onClose }: AssistantHeaderProps) {
  return (
    <header className="flex shrink-0 items-start justify-between gap-4 border-b border-line px-5 py-5">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-accent/15 bg-accent-soft text-accent-dark">
          <Sparkles aria-hidden="true" size={17} strokeWidth={1.8} />
        </div>
        <div>
          <h2 className="font-serif text-lg font-semibold leading-6 tracking-[-0.025em] text-ink">
            Ask About My Research
          </h2>
          <p className="mt-1 text-xs leading-5 text-muted">
            Ask about my research, publications, experience, or academic background.
          </p>
        </div>
      </div>
      {onClose && (
        <button
          aria-label="Close research assistant"
          className="-mr-2 -mt-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted transition-colors hover:bg-accent-soft hover:text-accent-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          onClick={onClose}
          type="button"
        >
          <X aria-hidden="true" size={18} />
        </button>
      )}
    </header>
  );
}
