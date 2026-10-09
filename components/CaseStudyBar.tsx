"use client";

import { useEffect, useState } from "react";
import { MASTHEAD_SENTINEL_ID } from "@/lib/case-study-bar";

/** Height of the site header band the bar sits under: `h-20`. */
const HEADER_HEIGHT = 80;

/**
 * Condensed masthead for a case study - title, subtitle and badges - shown once
 * the masthead has scrolled out of view. Visibility follows an
 * IntersectionObserver on a sentinel the page places after the masthead, not a
 * scroll listener. The root is inset by the header height, so "out of view"
 * means passed under the site header.
 *
 * The bar is shown only while the sentinel is above that line. Not intersecting
 * also covers a sentinel still below the viewport - a masthead taller than the
 * screen - which must keep the bar hidden. While hidden, nothing renders.
 *
 * It takes no layout space: the negative bottom margin cancels its height, so
 * appearing overlays the page instead of pushing content down mid-read. It
 * repeats the h1, so it is hidden from assistive technology.
 */
export default function CaseStudyBar({
  title,
  subtitle,
  badges,
}: {
  title: string;
  subtitle: string;
  badges: string[];
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById(MASTHEAD_SENTINEL_ID);

    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(
          !entry.isIntersecting &&
            entry.boundingClientRect.top < HEADER_HEIGHT,
        );
      },
      { rootMargin: `-${HEADER_HEIGHT}px 0px 0px 0px` },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="sticky top-20 z-40 -mb-28 h-28 w-full border-b border-border bg-bg motion-safe:transition-opacity motion-safe:duration-200 motion-safe:starting:opacity-0"
    >
      <div className="mx-auto flex h-full w-full max-w-[61rem] items-center px-5 sm:px-6">
        <div className="flex w-full min-w-0 flex-col gap-1">
          <div className="flex min-w-0 items-center justify-between gap-4">
            <p className="my-0 min-w-0 truncate font-serif text-[1.0625rem] leading-snug text-text">
              {title}
            </p>

            {badges.length > 0 ? (
              <ul className="my-0 hidden shrink-0 list-none gap-1.5 ps-0 sm:flex">
                {badges.map((badge) => (
                  <li
                    key={badge}
                    className="my-0 rounded-full border border-border bg-surface px-2 py-0.5 font-mono text-[0.625rem] uppercase tracking-[0.08em] text-muted"
                  >
                    {badge}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <p className="my-0 hidden truncate font-serif text-[0.875rem] leading-snug text-muted sm:block">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
