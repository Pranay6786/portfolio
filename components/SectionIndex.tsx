"use client";

import { useEffect, useState } from "react";
import type { Section } from "@/lib/content";

/**
 * Scroll-following list of the article's sections. The only client component in
 * the project: it needs IntersectionObserver and local state, both browser-only.
 *
 * The observer's rootMargin narrows the viewport to a band below the top, so a
 * heading counts as current once it reaches reading position rather than the
 * moment it appears at the bottom. When the band is empty - a section longer
 * than the band, for instance - the last match stays active rather than
 * clearing, so the list never goes blank mid-scroll.
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

    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.add(entry.target.id);
          } else {
            visible.delete(entry.target.id);
          }
        }

        const current = sections.find((section) => visible.has(section.id));
        if (current) {
          setActiveId(current.id);
        }
      },
      { rootMargin: "-80px 0px -65% 0px", threshold: 0 },
    );

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
