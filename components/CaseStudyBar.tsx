"use client";

import { useEffect, useState } from "react";
import { MASTHEAD_SENTINEL_ID } from "@/lib/case-study-bar";

/** Height of the site header the bar sits under: `h-14`. */
const HEADER_HEIGHT = 56;

/**
 * Compact title bar for a case study, shown once the masthead has scrolled out
 * of view. Visibility follows an IntersectionObserver on a sentinel the page
 * places after the masthead, not a scroll listener. The root is inset by the
 * header height, so "out of view" means passed under the site header.
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
}: {
  title: string;
  subtitle: string;
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
      className="sticky top-14 z-40 -mb-16 h-16 w-full border-b border-border bg-bg motion-safe:transition-opacity motion-safe:duration-200 motion-safe:starting:opacity-0"
    >
      <div className="mx-auto flex h-full w-full max-w-[61rem] items-center px-5 sm:px-6">
        <div className="flex min-w-0 items-baseline gap-3">
          <p className="my-0 max-w-full shrink-0 truncate font-serif text-[0.9375rem] text-text">
            {title}
          </p>
          <p className="my-0 hidden min-w-0 truncate font-sans text-[0.8125rem] text-muted sm:block">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
