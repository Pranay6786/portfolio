"use client";

import Image from "next/image";
import { useId, useState } from "react";

type Side = "before" | "after";

const SIDES: readonly Side[] = ["before", "after"];

const LABELS: Record<Side, string> = {
  before: "Before",
  after: "After",
};

/**
 * Toggles between two screenshots of the same screen. The toggle is a pair of
 * native radio inputs, visually hidden behind their labels, so arrow keys move
 * between the options and the checked state is announced without any custom
 * key handling.
 *
 * Both images stay mounted, stacked in one fixed-ratio frame. The inactive one
 * is `visibility: hidden`, which removes it from the accessibility tree but
 * keeps its layout box, so lazy loading still fetches it as the frame nears
 * the viewport and it is ready before it is shown. `display: none` would stop
 * a lazy image loading at all. `object-contain` keeps either proportion whole
 * in the 9:16 frame, so switching never changes the figure's height.
 */
export default function BeforeAfter({
  before,
  after,
  beforeAlt,
  afterAlt,
  caption,
}: {
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
  caption?: string;
}) {
  const [active, setActive] = useState<Side>("before");
  const name = useId();

  const images: Record<Side, { src: string; alt: string }> = {
    before: { src: before, alt: beforeAlt },
    after: { src: after, alt: afterAlt },
  };

  return (
    <figure className="my-8">
      <fieldset className="flex justify-center gap-2">
        <legend className="sr-only">Show the before or after version</legend>
        {SIDES.map((side) => (
          <label key={side} className="cursor-pointer">
            <input
              type="radio"
              name={name}
              value={side}
              checked={active === side}
              onChange={() => setActive(side)}
              className="peer sr-only"
            />
            <span
              className={`block rounded-[2px] border px-[0.6em] py-[0.25em] font-mono text-[0.6875rem] uppercase tracking-[0.09em] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent ${
                active === side
                  ? "border-accent-dim bg-accent-tint font-semibold text-accent"
                  : "border-border text-muted"
              }`}
            >
              {LABELS[side]}
            </span>
          </label>
        ))}
      </fieldset>

      <div className="relative mx-auto mt-4 aspect-[9/16] w-full max-w-[20rem] border border-border bg-surface">
        {SIDES.map((side) => (
          <Image
            key={side}
            src={images[side].src}
            alt={images[side].alt}
            fill
            sizes="(max-width: 22.5rem) 100vw, 20rem"
            aria-hidden={active === side ? undefined : true}
            className={active === side ? "object-contain" : "object-contain invisible"}
          />
        ))}
      </div>

      {caption ? (
        <figcaption className="mx-auto mt-3 max-w-[20rem] font-sans text-[0.8125rem] leading-5 text-faint">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
