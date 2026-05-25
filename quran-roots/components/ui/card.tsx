import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/10 bg-white/80 p-6 shadow-2xl shadow-emerald-950/5 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70",
        className,
      )}
    >
      {children}
    </div>
  );
}
