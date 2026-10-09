import { useEffect, useState } from "react";

/**
 * How close to the end of the page, in pixels, counts as the bottom. The
 * maximum scroll position can land a fraction short of the exact end on zoomed
 * or high-density screens, so an exact comparison would sometimes miss.
 */
const BOTTOM_TOLERANCE = 2;

/**
 * The id of the element being read: the last one whose top has passed the
 * activation line, measured from the top of the viewport. At the bottom of the
 * page the last element wins, because a short final section runs the page out
 * of scroll before its top reaches the line. Null when none has passed yet.
 */
export function resolveActiveId(elements: HTMLElement[], activationLine: number): string | null {
  if (elements.length === 0) {
    return null;
  }

  // The furthest the page can scroll. Zero or less means it does not scroll.
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

  if (maxScroll > BOTTOM_TOLERANCE && window.scrollY >= maxScroll - BOTTOM_TOLERANCE) {
    return elements[elements.length - 1].id;
  }

  let current: string | null = null;

  for (const element of elements) {
    if (element.getBoundingClientRect().top > activationLine) {
      break;
    }
    current = element.id;
  }

  return current;
}

/**
 * Tracks which of the given element ids is being read, for the case study
 * section index and the homepage nav. Recalculated from a passive scroll
 * listener throttled to one pass per animation frame, and on resize and hash
 * changes. Reading positions, rather than tracking intersections, keeps the
 * answer right when several sections are skipped at once: a flick scroll, an
 * anchor jump, End.
 *
 * `fallbackToFirst` decides what counts as active before any element has
 * passed the line: the first one (an article, which opens on its first
 * section) or none (the homepage, which opens on a hero outside the nav).
 */
export function useActiveSection(
  ids: readonly string[],
  activationLine: number,
  fallbackToFirst: boolean,
): string | null {
  // A string key keeps the effect stable when callers pass a fresh array.
  const key = ids.join("\n");
  const [activeId, setActiveId] = useState<string | null>(
    fallbackToFirst ? (ids[0] ?? null) : null,
  );

  useEffect(() => {
    const elements = key
      .split("\n")
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) {
      return;
    }

    const fallback = fallbackToFirst ? elements[0].id : null;
    const update = () => {
      setActiveId(resolveActiveId(elements, activationLine) ?? fallback);
    };

    // Throttle to one recalculation per frame: scroll fires far more often.
    let frame = 0;
    const schedule = () => {
      if (frame !== 0) {
        return;
      }
      frame = requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };

    update();
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
  }, [key, activationLine, fallbackToFirst]);

  return activeId;
}
