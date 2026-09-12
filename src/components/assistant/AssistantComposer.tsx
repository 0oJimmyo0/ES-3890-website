import { Send } from "lucide-react";
import { FormEvent, useState } from "react";

type AssistantComposerProps = {
  disabled?: boolean;
  onSubmit: (question: string) => void;
};

const MAX_QUESTION_LENGTH = 500;

export function AssistantComposer({ disabled = false, onSubmit }: AssistantComposerProps) {
  const [value, setValue] = useState("");
  const trimmedValue = value.trim();
  const isTooLong = value.length > MAX_QUESTION_LENGTH;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (disabled || !trimmedValue || isTooLong) return;
    onSubmit(trimmedValue);
    setValue("");
  }

  return (
    <form className="shrink-0 border-t border-line px-5 py-4" onSubmit={submit}>
      <div className="flex items-end gap-2 rounded-md border border-line bg-paper p-2 transition-colors focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20">
        <textarea
          aria-label="Ask a question about my research"
          className="max-h-28 min-h-10 min-w-0 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm leading-5 text-ink outline-none placeholder:text-muted/80"
          disabled={disabled}
          maxLength={MAX_QUESTION_LENGTH + 1}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              event.currentTarget.form?.requestSubmit();
            }
          }}
          placeholder="Ask a question about my research..."
          value={value}
        />
        <button
          aria-label="Send question"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent text-white transition-colors hover:bg-accent-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-line"
          disabled={disabled || !trimmedValue || isTooLong}
          type="submit"
        >
          <Send aria-hidden="true" size={16} />
        </button>
      </div>
      <div className="mt-2 flex min-h-4 justify-between gap-3 text-[0.68rem] text-muted">
        <span>{disabled ? "Thinking..." : "Enter to send · Shift + Enter for a new line"}</span>
        <span className={isTooLong ? "text-red-700" : ""}>{value.length}/500</span>
      </div>
    </form>
  );
}
