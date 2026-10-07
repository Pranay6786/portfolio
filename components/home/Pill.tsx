import type { ReactNode } from "react";

/**
 * A mono pill matching the case study masthead badges. Used for the work cards'
 * badges and the skill items. Deliberately never in the accent.
 */
export default function Pill({ children }: { children: ReactNode }) {
  return (
    <li className="rounded-full border border-border bg-surface px-2.5 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.08em] whitespace-nowrap text-muted">
      {children}
    </li>
  );
}
