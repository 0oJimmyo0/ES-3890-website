import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import type { ButtonVariant } from "@/types";

type ButtonProps = {
  children: ReactNode;
  className?: string;
  href?: string;
  variant?: ButtonVariant;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const baseStyles =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-accent text-white hover:bg-accent-dark",
  secondary: "border border-line bg-paper text-ink hover:border-accent hover:bg-accent-soft",
};

export function Button({ children, className = "", href, variant = "primary", ...props }: ButtonProps) {
  const classes = `${baseStyles} ${variantStyles[variant]} ${className}`;

  if (href) {
    return (
      <Link className={classes} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} type="button" {...props}>
      {children}
    </button>
  );
}
