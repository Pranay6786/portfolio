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

/**
 * Elements whose top is in the bottom quarter of the first screen or lower
 * float in; anything higher renders plainly on load.
 */
const FIRST_SCREEN_CUTOFF = 0.75;

/**
 * Siblings arriving together start this far apart, up to the cap: slower on
 * the homepage, quicker in case study articles, where every paragraph reveals.
 */
const HOME_STAGGER_MS = 110;
const HOME_STAGGER_CAP_MS = 550;
const ARTICLE_STAGGER_MS = 80;
const ARTICLE_STAGGER_CAP_MS = 400;

/**
 * Entrance reveals for the whole site: one IntersectionObserver over every
 * [data-reveal] element, re-created on each route change because this sits in
 * the persistent layout. Renders nothing; the animation is in globals.css.
 *
 * Case study articles are MDX output, which cannot carry the attribute, so
 * their block children ([data-article] > *) get it here first.
 *
 * Only elements whose top is in the bottom quarter of the viewport or below
 * are hidden ("pending") and watched. Anything higher on first paint is never
 * touched, so the top of a page never fades in. When a watched element
 * intersects, it gets its stagger delay (by context: homepage or article),
 * switches to "in" (which plays the animation once) and is unobserved. Under
 * reduced motion nothing is hidden or watched: everything stays in its
 * default, visible state.
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
        element.dataset.reveal === "" &&
        element.getBoundingClientRect().top >= viewportHeight * FIRST_SCREEN_CUTOFF,
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

          const inArticle = element.closest("[data-article]") !== null;
          const step = inArticle ? ARTICLE_STAGGER_MS : HOME_STAGGER_MS;
          const cap = inArticle ? ARTICLE_STAGGER_CAP_MS : HOME_STAGGER_CAP_MS;
          element.style.setProperty("--reveal-delay", `${Math.min(index * step, cap)}ms`);
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
