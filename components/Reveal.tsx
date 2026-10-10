"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Start a reveal once an element is 40px inside the bottom of the viewport,
 * so the whole float plays in view rather than partly below the fold.
 */
const ROOT_MARGIN = "0px 0px -40px 0px";

/** Any overlap at all counts, so tall blocks start as soon as their top shows. */
const THRESHOLD = 0;

/** Siblings arriving together start this far apart, up to the cap. */
const STAGGER_MS = 110;
const STAGGER_CAP_MS = 550;

/**
 * Entrance reveals for the whole site: one IntersectionObserver over every
 * [data-reveal] element, re-created on each route change because this sits in
 * the persistent layout. Renders nothing; the animation is in globals.css.
 *
 * Case study articles are MDX output, which cannot carry the attribute, so
 * their block children ([data-article] > *) get it here first.
 *
 * Only elements wholly below the viewport are hidden ("pending") and watched.
 * Anything on screen or above it on first paint is never touched, so the top
 * of a page never fades in. When a watched element intersects, it gets its
 * stagger delay, switches to "in" (which plays the animation once) and is
 * unobserved. Under reduced motion nothing is hidden or watched: everything
 * stays in its default, visible state.
 */
export default function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    document.querySelectorAll<HTMLElement>("[data-article] > *").forEach((element) => {
      if (!element.hasAttribute("data-reveal")) {
        element.setAttribute("data-reveal", "");
      }
    });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const viewportHeight = window.innerHeight;
    const pending = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]")).filter(
      (element) =>
        element.dataset.reveal === "" && element.getBoundingClientRect().top >= viewportHeight,
    );

    const observer = new IntersectionObserver(
      (entries) => {
        // Entries arrive in document order; count per parent for the stagger.
        const arrived = new Map<Element | null, number>();

        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue;
          }
          const element = entry.target as HTMLElement;
          const index = arrived.get(element.parentElement) ?? 0;
          arrived.set(element.parentElement, index + 1);

          element.style.setProperty(
            "--reveal-delay",
            `${Math.min(index * STAGGER_MS, STAGGER_CAP_MS)}ms`,
          );
          element.dataset.reveal = "in";
          observer.unobserve(element);
        }
      },
      { rootMargin: ROOT_MARGIN, threshold: THRESHOLD },
    );

    for (const element of pending) {
      element.dataset.reveal = "pending";
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
