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
  desk: "DESK",
  target: "TARGET",
  built: "BUILT",
};

export default function Confidence({
  type,
  detail,
}: {
  type: ConfidenceType;
  detail?: string;
}) {
  return (
    <span data-confidence={type}>
      {LABELS[type]}
      {detail ? ` ${detail}` : ""}
    </span>
  );
}
