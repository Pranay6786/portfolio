"use client";

import type { Section } from "@/lib/content";
import { useActiveSection } from "@/lib/use-active-section";

/**
 * Headings above this line in the viewport count as the section being read. It
 * sits just below the 272px scroll margin on the headings, which itself clears
 * the 80px header and the 112px case study bar, so a heading landed on by an
 * anchor click is unambiguously past the line and highlights itself rather than
 * the section before it.
 */
const ACTIVATION_LINE = 288;

/**
 * Scroll-following list of the article's sections. A client component: it
 * needs browser geometry and local state.
 *
 * The active section comes from `useActiveSection`, shared with the homepage
 * nav: the last heading whose top has passed the activation line, recalculated
 * once per animation frame while scrolling, with the last section winning at
 * the bottom of the page. Before any heading has passed the line, the first
 * section is active.
 */
export default function SectionIndex({ sections }: { sections: Section[] }) {
  const activeId = useActiveSection(
    sections.map((section) => section.id),
    ACTIVATION_LINE,
    true,
  );

  if (sections.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Sections in this case study"
      className="sticky top-[13.5rem] overflow-x-clip"
    >
      <ul className="flex flex-col gap-5">
        {sections.map((section) => {
          const isActive = section.id === activeId;

          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={isActive ? "true" : undefined}
                className={`block origin-left pr-3 font-sans text-[0.8125rem] leading-5 motion-safe:transition-[color,scale] motion-safe:duration-150 ${
                  isActive
                    ? "text-accent motion-safe:scale-[1.06]"
                    : "text-faint motion-safe:scale-100"
                }`}
              >
                {section.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
