import type { HTMLAttributes } from "react";

type PageContainerProps = HTMLAttributes<HTMLDivElement>;

export function PageContainer({ className = "", ...props }: PageContainerProps) {
  return (
    <div
      className={`mx-auto w-full max-w-content px-4 sm:px-6 lg:px-10 ${className}`}
      {...props}
    />
  );
}

