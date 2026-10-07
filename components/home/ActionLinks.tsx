import TextLink from "@/components/home/TextLink";
import type { HomepageLink } from "@/lib/homepage";

/** A row of links that wraps on narrow screens. Used by the hero and contact. */
export default function ActionLinks({ actions }: { actions: HomepageLink[] }) {
  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-3">
      {actions.map((action) => (
        <li key={`${action.label}-${action.href}`}>
          <TextLink href={action.href}>{action.label}</TextLink>
        </li>
      ))}
    </ul>
  );
}
