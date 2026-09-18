import type { ReactNode } from "react";

export default function Callout({
  title,
  children,
}: {
  title?: string;
  children?: ReactNode;
}) {
  return (
    <section data-callout="">
      {title ? <h3>{title}</h3> : null}
      {children}
    </section>
  );
}
