import Link from "next/link";

/** An app route, as opposed to an anchor, a file in public/ or another site. */
export function isRoute(href: string): boolean {
  return href.startsWith("/") && !/\.[a-z0-9]+$/i.test(href);
}

/**
 * Another site or a file in public/, which opens in a new tab. App routes,
 * mailto: and in-page anchors stay in the current tab.
 */
export function opensNewTab(href: string): boolean {
  return !isRoute(href) && !href.startsWith("mailto:") && !href.startsWith("#");
}

const CLASS_NAME =
  "font-sans text-accent underline decoration-accent-dim underline-offset-[0.2em] hover:decoration-accent";

/** `base` is 14px, the inline size; `lg` is 16px, for a link that closes a section. */
const SIZE_CLASS = { base: "text-[0.875rem]", lg: "text-[1rem]" } as const;

/**
 * An inline link in the accent, underlined like article links. App routes go
 * through next/link; anchors, files, mailto and external links are plain <a>,
 * and files and external links open in a new tab, with a visually hidden
 * warning for screen reader users.
 */
export default function TextLink({
  href,
  children,
  size = "base",
}: {
  href: string;
  children: string;
  size?: keyof typeof SIZE_CLASS;
}) {
  const className = `${CLASS_NAME} ${SIZE_CLASS[size]}`;

  if (isRoute(href)) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  if (opensNewTab(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
        <span className="sr-only"> (opens in new tab)</span>
      </a>
    );
  }

  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}
