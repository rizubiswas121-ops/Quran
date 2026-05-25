import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "secondary";
}

export function Button({
  variant,
  className,
  children,
  ...props
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        variant === "secondary"
          ? "bg-slate-800 text-white hover:bg-slate-700"
          : "bg-emerald-600 text-white hover:bg-emerald-500",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
