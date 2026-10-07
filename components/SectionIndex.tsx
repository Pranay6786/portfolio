"use client";

import { useEffect, useState } from "react";
import type { Section } from "@/lib/content";

/** Headings above this line in the viewport count as the section being read. */
const ACTIVATION_LINE = 96;

/**
 * Scroll-following list of the article's sections. The only client component in
 * the project: it needs IntersectionObserver and local state, both browser-only.
 *
 * The observer is the trigger, not the answer. It fires whenever a heading
 * crosses the top of the viewport, and the handler then resolves the current
 * section from the headings' actual positions: the last one whose top has
 * passed the activation line. Reading positions rather than intersection state
 * keeps the highlight correct when several headings are skipped at once - a
 * flick scroll, an anchor jump, End - which a set of currently-intersecting
 * entries cannot represent, since the skipped headings never enter the band.
 */
export default function SectionIndex({ sections }: { sections: Section[] }) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");

  useEffect(() => {
    const headings = sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => element !== null);

    if (headings.length === 0) {
      return;
    }

    const resolveActive = () => {
      let current = headings[0].id;

      for (const heading of headings) {
        if (heading.getBoundingClientRect().top > ACTIVATION_LINE) {
          break;
        }
        current = heading.id;
      }

      setActiveId(current);
    };

    const observer = new IntersectionObserver(resolveActive, {
      rootMargin: `-${ACTIVATION_LINE}px 0px 0px 0px`,
      threshold: 0,
    });

    for (const heading of headings) {
      observer.observe(heading);
    }

    return () => observer.disconnect();
  }, [sections]);

  if (sections.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Sections in this case study"
      className="sticky top-20 max-h-[calc(100vh-7rem)] overflow-y-auto overflow-x-hidden"
    >
      <ul className="flex flex-col gap-3">
        {sections.map((section) => {
          const isActive = section.id === activeId;

          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={isActive ? "true" : undefined}
                className={`block font-sans text-[0.8125rem] leading-5 ${
                  isActive ? "text-accent" : "text-faint"
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
