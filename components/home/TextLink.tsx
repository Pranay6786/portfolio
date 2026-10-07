import Link from "next/link";

/** An app route, as opposed to an anchor, a file in public/ or another site. */
function isRoute(href: string): boolean {
  return href.startsWith("/") && !/\.[a-z0-9]+$/i.test(href);
}

const CLASS_NAME =
  "font-sans text-[0.875rem] text-accent underline decoration-accent-dim underline-offset-[0.2em] hover:decoration-accent";

/**
 * An inline link in the accent, underlined like article links. App routes go
 * through next/link; anchors, files, mailto and external links are plain <a>.
 */
export default function TextLink({ href, children }: { href: string; children: string }) {
  if (isRoute(href)) {
    return (
      <Link href={href} className={CLASS_NAME}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={CLASS_NAME}>
      {children}
    </a>
  );
}
