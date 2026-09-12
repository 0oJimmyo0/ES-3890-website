import type { AssistantSource } from "@/lib/assistant/client";

import { SourceChips } from "@/components/assistant/SourceChips";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: AssistantSource[];
};

type AssistantMessagesProps = {
  messages: ChatMessage[];
};

export function AssistantMessages({ messages }: AssistantMessagesProps) {
  return (
    <div className="space-y-4 px-5 py-5">
      {messages.map((message) => (
        <div className={message.role === "user" ? "flex justify-end" : "flex justify-start"} key={message.id}>
          {message.role === "user" ? (
            <p className="max-w-[88%] rounded-lg bg-accent px-3.5 py-2.5 text-sm leading-6 text-white whitespace-pre-wrap">
              {message.content}
            </p>
          ) : (
            <div className="max-w-[94%] rounded-lg border border-accent/10 bg-accent-soft/65 px-3.5 py-3 text-sm leading-6 text-ink">
              <p className="whitespace-pre-wrap">{message.content}</p>
              {message.sources && <SourceChips sources={message.sources} />}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
