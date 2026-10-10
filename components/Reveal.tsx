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
 * Siblings arriving together start this far apart, up to the cap: slower on
 * the homepage, quicker in case study articles, where every paragraph reveals.
 */
const HOME_STAGGER_MS = 110;
const HOME_STAGGER_CAP_MS = 550;
const ARTICLE_STAGGER_MS = 80;
const ARTICLE_STAGGER_CAP_MS = 400;

/**
 * Starts the reveal of a batch of elements arriving together, in document
 * order: each gets its stagger delay, counted per parent and by context
 * (homepage or article), and switches to "in", which plays the animation once.
 */
function reveal(elements: HTMLElement[]) {
  const arrived = new Map<Element | null, number>();

  for (const element of elements) {
    const index = arrived.get(element.parentElement) ?? 0;
    arrived.set(element.parentElement, index + 1);

    const inArticle = element.closest("[data-article]") !== null;
    const step = inArticle ? ARTICLE_STAGGER_MS : HOME_STAGGER_MS;
    const cap = inArticle ? ARTICLE_STAGGER_CAP_MS : HOME_STAGGER_CAP_MS;
    element.style.setProperty("--reveal-delay", `${Math.min(index * step, cap)}ms`);
    element.dataset.reveal = "in";
  }
}

/**
 * Entrance reveals for the whole site: one IntersectionObserver over every
 * [data-reveal="pending"] element, re-created on each route change because
 * this sits in the persistent layout. Renders nothing; the animation is in
 * globals.css.
 *
 * Reveal targets arrive from the server already "pending". That state is only
 * hidden while <html> carries data-js, which the inline head script sets before
 * first paint, so nothing is ever hidden after the reader has seen it, and
 * without JavaScript everything shows. Case study articles are MDX output,
 * which cannot carry the attribute, so their block children ([data-article] >
 * *) are tagged "pending" here; until then the stylesheet holds them hidden
 * the same way.
 *
 * On each route, elements already in the viewport are revealed at once, so
 * first-screen content floats in on arrival. The rest are watched and revealed
 * as they intersect, then unobserved, and the only change is ever pending to
 * in. Under reduced motion every pending element goes straight to "in" with no
 * delay, which carries no styles there: the content simply appears.
 *
 * data-reveal-ready on <html> tells the head script's fallback timer that this
 * has run, so it leaves data-js in place.
 */
export default function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.setAttribute("data-reveal-ready", "");

    document.querySelectorAll<HTMLElement>("[data-article] > *").forEach((element) => {
      if (!element.hasAttribute("data-reveal")) {
        element.dataset.reveal = "pending";
      }
    });

    const pending = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reveal="pending"]'),
    );

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      for (const element of pending) {
        element.dataset.reveal = "in";
      }
      return;
    }

    const viewportHeight = window.innerHeight;
    const inView = pending.filter((element) => {
      const { top, bottom } = element.getBoundingClientRect();
      return top < viewportHeight && bottom > 0;
    });
    reveal(inView);

    const observer = new IntersectionObserver(
      (entries) => {
        // Entries arrive in document order.
        const arriving = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => entry.target as HTMLElement);
        reveal(arriving);
        for (const element of arriving) {
          observer.unobserve(element);
        }
      },
      { rootMargin: ROOT_MARGIN, threshold: THRESHOLD },
    );

    for (const element of pending) {
      if (element.dataset.reveal === "pending") {
        observer.observe(element);
      }
    }

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
