import Image from "next/image";
import {
  IMAGE_CAPTION_CLASS,
  IMAGE_FRAME_CLASS,
  IMAGE_FRAME_SIZES,
} from "@/components/image-frame";

/**
 * A single captioned screenshot in the same frame BeforeAfter uses. A server
 * component: it has no state. The image lazy-loads, next/image's default.
 */
export default function Screen({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  return (
    <figure className="my-8">
      <div className={IMAGE_FRAME_CLASS}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={IMAGE_FRAME_SIZES}
          className="object-contain"
        />
      </div>

      {caption ? <figcaption className={IMAGE_CAPTION_CLASS}>{caption}</figcaption> : null}
    </figure>
  );
}
