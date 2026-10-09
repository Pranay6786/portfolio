/**
 * The frame treatment shared by the two image content components, BeforeAfter
 * (client) and Screen (server). Plain constants rather than a component, so a
 * server and a client component can both import them without either changing
 * kind. Change the frame here, once.
 *
 * The frame is an invisible box: no border, no background. It exists only to
 * hold a stable height - a fixed 9:16 ratio, capped at 20rem and centred - so
 * the figure is the same size whichever image is inside it, and BeforeAfter
 * never shifts the page when toggled. Images use `fill` with `object-contain`,
 * so none is cropped. One narrower or wider than 9:16 sits inside the box with
 * empty space beside or above it.
 */
export const IMAGE_FRAME_CLASS = "relative mx-auto aspect-[9/16] w-full max-w-[20rem]";

/** `next/image` `sizes` for an image filling the frame. */
export const IMAGE_FRAME_SIZES = "(max-width: 22.5rem) 100vw, 20rem";

export const IMAGE_CAPTION_CLASS =
  "mx-auto mt-3 max-w-[20rem] font-sans text-[0.8125rem] leading-5 text-faint";
