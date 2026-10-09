import Link from "next/link";

/** An app route, as opposed to an anchor, a file in public/ or another site. */
function isRoute(href: string): boolean {
  return href.startsWith("/") && !/\.[a-z0-9]+$/i.test(href);
}

/**
 * Another site or a file in public/, which opens in a new tab. App routes,
 * mailto: and in-page anchors stay in the current tab.
 */
function opensNewTab(href: string): boolean {
  return !isRoute(href) && !href.startsWith("mailto:") && !href.startsWith("#");
}

const CLASS_NAME =
  "font-sans text-[0.875rem] text-accent underline decoration-accent-dim underline-offset-[0.2em] hover:decoration-accent";

/**
 * An inline link in the accent, underlined like article links. App routes go
 * through next/link; anchors, files, mailto and external links are plain <a>,
 * and files and external links open in a new tab.
 */
export default function TextLink({ href, children }: { href: string; children: string }) {
  if (isRoute(href)) {
    return (
      <Link href={href} className={CLASS_NAME}>
        {children}
      </Link>
    );
  }

  if (opensNewTab(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={CLASS_NAME}>
        {children}
      </a>
    );
  }

  return (
    <a href={href} className={CLASS_NAME}>
      {children}
    </a>
  );
}
