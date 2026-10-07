export type ConfidenceType =
  | "primary"
  | "secondary"
  | "assumed"
  | "desk"
  | "target"
  | "built";

const LABELS: Record<ConfidenceType, string> = {
  primary: "PRIMARY",
  secondary: "SECONDARY",
  assumed: "ASSUMED",
  desk: "DESK ANALYSIS",
  built: "BUILT & MEASURED",
  target: "TARGET",
};

export default function Confidence({
  type,
  detail,
}: {
  type: ConfidenceType;
  detail?: string;
}) {
  return (
    // `display: inline` is deliberate: padding on an inline box does not grow
    // the line box, so the label sits inside a sentence without opening up the
    // surrounding leading.
    <span
      data-confidence={type}
      className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.09em] text-accent bg-accent-tint border border-accent-dim rounded-[2px] px-[0.4em] py-[0.1em] align-baseline whitespace-nowrap"
    >
      {LABELS[type]}
      {detail ? ` ${detail}` : ""}
    </span>
  );
}
