import type { ComponentType, SVGProps } from "react";
import IconLink from "@/components/home/IconLink";
import { FileIcon, FolderIcon } from "@/components/icons";
import type { HomepageContent } from "@/lib/homepage";

/** Each hero action's icon, matched by its label in homepage.json. */
const ACTION_ICONS: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  "View work": FolderIcon,
  "Résumé": FileIcon,
};

/**
 * The opening: the name as the page's one h1, then the three-line statement,
 * the role line and the actions. Each arrives in that order on load: see
 * [data-hero-name] and [data-hero-lines] in globals.css. No kicker.
 */
export default function HeroSection({ content }: { content: HomepageContent["hero"] }) {
  return (
    <section aria-labelledby="hero-title" className="pt-12 pb-16 sm:pt-20 sm:pb-24">
      <h1
        id="hero-title"
        data-hero-name=""
        className="font-serif text-[2.75rem] font-semibold leading-[1.05] tracking-[-0.015em] text-text sm:text-[4rem]"
      >
        {content.name}
      </h1>
      <p
        data-hero-lines=""
        className="mt-6 font-serif text-[1.3125rem] leading-[1.35] text-text sm:text-[1.5rem]"
      >
        {content.lines.map((line) => (
          <span key={line} className="block text-balance">
            {line}
          </span>
        ))}
      </p>
      <p
        data-hero-subhead=""
        className="mt-6 font-sans text-[1.0625rem] text-muted sm:text-[1.1875rem]"
      >
        {content.subhead}
      </p>
      <ul data-hero-actions="" className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
        {content.actions.map((action) => {
          const icon = ACTION_ICONS[action.label];
          if (!icon) {
            throw new Error(
              `No hero icon for the action labelled "${action.label}" in content/homepage.json. ` +
                `Known labels: ${Object.keys(ACTION_ICONS).join(", ")}.`,
            );
          }
          return (
            <li key={`${action.label}-${action.href}`}>
              <IconLink href={action.href} label={action.label} icon={icon} layout="inline" />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
