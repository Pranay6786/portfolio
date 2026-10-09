import { isValidElement, type ReactNode } from "react";
import { slugify } from "@/lib/content";

/** Flattens a heading's children to plain text so the id matches the index. */
function toText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") {
    return "";
  }
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(toText).join("");
  }
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return toText(node.props.children);
  }
  return "";
}

/**
 * The `h2` the MDX components map renders. The id is derived from the heading
 * text with the same slugify the section index uses, so the two agree. The
 * scroll margin keeps a linked heading clear of the site header and the case
 * study bar, 192px together, with room to spare.
 */
export default function ArticleHeading({ children }: { children?: ReactNode }) {
  return (
    <h2 id={slugify(toText(children))} className="scroll-mt-[17rem]">
      {children}
    </h2>
  );
}
