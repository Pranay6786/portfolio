import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import { isRoute, opensNewTab } from "@/components/home/TextLink";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

/**
 * A link drawn as an icon in a bordered circle with a small mono label, muted
 * until hovered, when it takes the accent. `stacked` puts the label under the
 * icon (the contact row); `inline` puts it beside the icon (the hero actions
 * and the "all work" link).
 *
 * App routes go through next/link. Files and other sites open in a new tab
 * with a visually hidden warning, by the same rule as TextLink. The icon is
 * hidden from assistive technology, so the label names the link.
 */
export default function IconLink({
  href,
  label,
  icon: Icon,
  layout,
}: {
  href: string;
  label: string;
  icon: IconComponent;
  layout: "stacked" | "inline";
}) {
  const newTab = opensNewTab(href);
  const stacked = layout === "stacked";
  const className = stacked
    ? "flex flex-col items-center gap-2 text-muted hover:text-accent"
    : "inline-flex items-center gap-3 text-muted hover:text-accent";

  const content = (
    <>
      <span
        className={`inline-flex shrink-0 items-center justify-center rounded-full border border-border bg-surface ${
          stacked ? "h-11 w-11" : "h-9 w-9"
        }`}
      >
        <Icon width={stacked ? 20 : 18} height={stacked ? 20 : 18} />
      </span>
      <span className="font-mono text-[0.6875rem] uppercase tracking-[0.08em]">
        {label}
        {newTab ? <span className="sr-only"> (opens in new tab)</span> : null}
      </span>
    </>
  );

  if (isRoute(href)) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <a
      href={href}
      {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={className}
    >
      {content}
    </a>
  );
}
