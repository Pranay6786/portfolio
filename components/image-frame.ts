/**
 * The frame treatment shared by the two image content components, BeforeAfter
 * (client) and Screen (server). Plain constants rather than a component, so a
 * server and a client component can both import them without either changing
 * kind. Change the frame here, once.
 *
 * A fixed 9:16 frame, capped at 20rem and centred, with a hairline border and
 * surface background so letterboxing reads as deliberate. Images inside use
 * `fill` with `object-contain`, so no screenshot is cropped and the frame's
 * height never depends on the image.
 */
export const IMAGE_FRAME_CLASS =
  "relative mx-auto aspect-[9/16] w-full max-w-[20rem] border border-border bg-surface";

/** `next/image` `sizes` for an image filling the frame. */
export const IMAGE_FRAME_SIZES = "(max-width: 22.5rem) 100vw, 20rem";

export const IMAGE_CAPTION_CLASS =
  "mx-auto mt-3 max-w-[20rem] font-sans text-[0.8125rem] leading-5 text-faint";
