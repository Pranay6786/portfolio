"use client";

import { useEffect, useState } from "react";
import type { Section } from "@/lib/content";

/**
 * Headings above this line in the viewport count as the section being read. It
 * sits just below the 248px scroll margin on the headings, which itself clears
 * the 56px header and the 112px case study bar, so a heading landed on by an
 * anchor click is unambiguously past the line and highlights itself rather than
 * the section before it.
 */
const ACTIVATION_LINE = 264;

/**
 * How close to the end of the page, in pixels, counts as the bottom. The
 * maximum scroll position can land a fraction short of the exact end on zoomed
 * or high-density screens, so an exact comparison would sometimes miss.
 */
const BOTTOM_TOLERANCE = 2;

/**
 * Scroll-following list of the article's sections. The only client component in
 * the project: it needs browser geometry and local state.
 *
 * The current section is resolved from the headings' measured positions - the
 * last one whose top has passed the activation line - recalculated from a
 * passive scroll listener, throttled to one pass per animation frame. Position
 * reading is what keeps the highlight correct when several headings are skipped
 * at once: a flick scroll, an anchor jump, End.
 *
 * At the bottom of the page the last section wins. A short final section runs
 * the page out of scroll before its heading reaches the activation line, so the
 * position rule alone would never select it.
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
      // The furthest the page can scroll. Zero or less means it does not
      // scroll at all, and the first section stays active.
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

      if (maxScroll > BOTTOM_TOLERANCE && window.scrollY >= maxScroll - BOTTOM_TOLERANCE) {
        setActiveId(headings[headings.length - 1].id);
        return;
      }

      let current = headings[0].id;

      for (const heading of headings) {
        if (heading.getBoundingClientRect().top > ACTIVATION_LINE) {
          break;
        }
        current = heading.id;
      }

      setActiveId(current);
    };

    // Throttle to one recalculation per frame: scroll fires far more often.
    let frame = 0;
    const schedule = () => {
      if (frame !== 0) {
        return;
      }
      frame = requestAnimationFrame(() => {
        frame = 0;
        resolveActive();
      });
    };

    resolveActive();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("hashchange", schedule);

    return () => {
      if (frame !== 0) {
        cancelAnimationFrame(frame);
      }
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("hashchange", schedule);
    };
  }, [sections]);

  if (sections.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Sections in this case study"
      className="sticky top-[12rem] overflow-x-clip"
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
