import type { ReactNode } from "react";

export default function MetricStrip({ children }: { children: ReactNode }) {
  return <p data-metric-strip="">{children}</p>;
}
