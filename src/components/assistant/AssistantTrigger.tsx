"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type AssistantTriggerProps = {
  question: string;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function AssistantTrigger({ question, children, onClick, ...props }: AssistantTriggerProps) {
  return (
    <button
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          window.dispatchEvent(new CustomEvent("assistant:ask", { detail: { question } }));
        }
      }}
      type="button"
    >
      {children}
    </button>
  );
}
