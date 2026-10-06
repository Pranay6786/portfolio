import type { ReactNode } from "react";

export default function Callout({
  title,
  children,
}: {
  title?: string;
  children?: ReactNode;
}) {
  return (
    <section
      data-callout=""
      className="my-8 border-l-2 border-accent-dim bg-surface px-5 py-4"
    >
      {/* The title is styled in globals.css, next to the article heading scale
          it has to override. */}
      {title ? <h3>{title}</h3> : null}
      {children}
    </section>
  );
}
