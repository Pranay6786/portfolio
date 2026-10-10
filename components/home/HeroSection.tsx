import type { ComponentType, SVGProps } from "react";
import IconLink from "@/components/home/IconLink";
import { FileIcon, FolderIcon } from "@/components/icons";
import type { HomepageContent } from "@/lib/homepage";

/** Each hero action's icon, matched by its label in homepage.json. */
const ACTION_ICONS: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  "View work": FolderIcon,
  "Résumé": FileIcon,
};

/** The opening statement: stacked serif lines, a subhead and the actions. No kicker. */
export default function HeroSection({ content }: { content: HomepageContent["hero"] }) {
  return (
    <section aria-labelledby="hero-title" className="pt-12 pb-16 sm:pt-20 sm:pb-24">
      {/* The lines, then the subhead and the actions, arrive one after another
          on load: see [data-hero-lines] in globals.css. */}
      <h1
        id="hero-title"
        data-hero-lines=""
        className="font-serif text-[2rem] font-semibold leading-[1.15] text-text sm:text-[2.375rem]"
      >
        {content.lines.map((line) => (
          <span key={line} className="block text-balance">
            {line}
          </span>
        ))}
      </h1>
      {/* Between the body size and the h1: the case study subtitle's sizes. */}
      <p
        data-hero-subhead=""
        className="mt-6 font-sans text-[1.1875rem] leading-snug text-muted sm:text-[1.3125rem]"
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
