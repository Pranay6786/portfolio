import type { ReactNode } from "react";

/**
 * Wrapper for markdown tables. Mapped onto the `table` element produced by
 * GitHub-flavoured markdown table syntax, so it receives the thead and tbody
 * rows as children. The scroll container keeps a wide table inside its own box
 * on narrow screens instead of widening the page. Cell borders and padding live
 * in globals.css, since the th and td elements come from MDX.
 */
export default function ContentTable({ children }: { children?: ReactNode }) {
  return (
    <div className="my-7 max-w-full overflow-x-auto border border-border">
      <table
        data-content-table=""
        className="w-full min-w-[34rem] border-collapse font-mono text-[0.8125rem] leading-6"
      >
        {children}
      </table>
    </div>
  );
}
