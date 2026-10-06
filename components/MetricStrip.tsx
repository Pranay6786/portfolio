import type { ReactNode } from "react";

export default function MetricStrip({ children }: { children: ReactNode }) {
  return (
    <p
      data-metric-strip=""
      className="font-mono text-[0.8125rem] leading-6 tracking-[0.04em] text-muted [word-spacing:0.2em]"
    >
      {children}
    </p>
  );
}
