import type { ReactNode } from "react";

/**
 * Wrapper for markdown tables. Mapped onto the `table` element produced by
 * GitHub-flavoured markdown table syntax, so it receives the thead and tbody
 * rows as children. Styling is added in a later stage.
 */
export default function ContentTable({ children }: { children?: ReactNode }) {
  return <table data-content-table="">{children}</table>;
}
