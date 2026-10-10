"use client";

import { useEffect } from "react";

/** Largest shift of the background grid, in px, when the cursor is at an edge. */
const MAX_SHIFT_X = 10;
const MAX_SHIFT_Y = 6;

/** Fraction of the remaining distance covered each frame. */
const LERP = 0.08;

/** Below this distance from the target on both axes, in px, the loop stops. */
const SETTLE = 0.05;

/**
 * Drifts the background grid (body::before in globals.css) against the
 * cursor, for a sense of depth. Renders nothing: it only writes
 * --grid-shift-x and --grid-shift-y on <html>.
 *
 * It does nothing at all - no listener, no frame - while the reader prefers
 * reduced motion or the primary input cannot hover, and it re-checks when
 * either changes. The pointer handler reads only the event's coordinates and
 * a cached viewport size, never element geometry. One requestAnimationFrame
 * loop eases the current shift towards the target and stops as soon as both
 * axes are within 0.05px, so nothing runs while the cursor is still.
 */
export default function GridParallax() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const noHover = window.matchMedia("(hover: none)");
    const root = document.documentElement;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let frame = 0;
    let active = false;

    const write = () => {
      root.style.setProperty("--grid-shift-x", `${currentX.toFixed(2)}px`);
      root.style.setProperty("--grid-shift-y", `${currentY.toFixed(2)}px`);
    };

    const step = () => {
      currentX += (targetX - currentX) * LERP;
      currentY += (targetY - currentY) * LERP;

      if (Math.abs(targetX - currentX) < SETTLE && Math.abs(targetY - currentY) < SETTLE) {
        currentX = targetX;
        currentY = targetY;
        write();
        frame = 0;
        return;
      }

      write();
      frame = requestAnimationFrame(step);
    };

    const onPointerMove = (event: PointerEvent) => {
      // Offset from the centre as a fraction from -1 to 1, inverted so the grid
      // moves against the cursor.
      const fx = Math.max(-1, Math.min(1, (event.clientX - width / 2) / (width / 2)));
      const fy = Math.max(-1, Math.min(1, (event.clientY - height / 2) / (height / 2)));
      targetX = -fx * MAX_SHIFT_X;
      targetY = -fy * MAX_SHIFT_Y;

      if (frame === 0) {
        frame = requestAnimationFrame(step);
      }
    };

    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
    };

    const start = () => {
      if (active) {
        return;
      }
      active = true;
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("resize", onResize, { passive: true });
    };

    const stop = () => {
      if (active) {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("resize", onResize);
        active = false;
      }
      if (frame !== 0) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
      targetX = targetY = currentX = currentY = 0;
      root.style.removeProperty("--grid-shift-x");
      root.style.removeProperty("--grid-shift-y");
    };

    const update = () => {
      if (reducedMotion.matches || noHover.matches) {
        stop();
      } else {
        start();
      }
    };

    update();
    reducedMotion.addEventListener("change", update);
    noHover.addEventListener("change", update);

    return () => {
      reducedMotion.removeEventListener("change", update);
      noHover.removeEventListener("change", update);
      stop();
    };
  }, []);

  return null;
}
