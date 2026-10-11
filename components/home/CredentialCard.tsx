import Image from "next/image";
import Link from "next/link";
import { isRoute, opensNewTab } from "@/components/home/TextLink";
import { ExternalLinkIcon } from "@/components/icons";
import type { Credential, CredentialLogoSize } from "@/lib/credentials";

/**
 * md:col-span-* classes for every span the validator allows (4 to 8), written
 * out in full so Tailwind generates them.
 */
const SPAN_CLASS: Record<number, string> = {
  4: "md:col-span-4",
  5: "md:col-span-5",
  6: "md:col-span-6",
  7: "md:col-span-7",
  8: "md:col-span-8",
};

/** The logo tile at each stated size, and the matching next/image `sizes`. */
const LOGO_TILE: Record<CredentialLogoSize, { className: string; sizes: string }> = {
  base: { className: "h-16 w-16", sizes: "64px" },
  md: { className: "h-[4.75rem] w-[4.75rem]", sizes: "76px" },
  lg: { className: "h-[5.5rem] w-[5.5rem]", sizes: "88px" },
};

/** Cards this many columns wide or wider set the logo beside the text at `md`. */
const HORIZONTAL_MIN_SPAN = 7;

const CARD_CLASS =
  "flex h-full flex-col gap-5 rounded-[4px] border border-border bg-bg p-6 sm:p-8";

const LINK_CLASS =
  "inline-flex items-center gap-1.5 font-sans text-[0.875rem] text-accent underline decoration-accent-dim underline-offset-[0.2em] hover:decoration-accent";

/**
 * A credential's link in the site's accent link treatment, with the external
 * link icon. By the same rule as TextLink, files and other sites open in a new
 * tab with a visually hidden warning, and app routes go through next/link.
 */
export function CredentialLink({ href, label }: { href: string; label: string }) {
  const content = (
    <>
      {label}
      <ExternalLinkIcon width={16} height={16} />
    </>
  );

  if (isRoute(href)) {
    return (
      <Link href={href} className={LINK_CLASS}>
        {content}
      </Link>
    );
  }

  if (opensNewTab(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
        {content}
        <span className="sr-only"> (opens in new tab)</span>
      </a>
    );
  }

  return (
    <a href={href} className={LINK_CLASS}>
      {content}
    </a>
  );
}

/**
 * One credential as a grid card: the issuer's logo in a tile of its stated
 * size (64, 76 or 88px), then the
 * issuer, title, blurb and link. The <li> takes the card's span of the
 * 12-column grid at `md` and up. Wide cards (span 7 or more) set the logo to
 * the left of the text from `md`; the rest, and every card below `md`, stack
 * the logo above it. The card is opaque (`bg-bg`) so the background grid does
 * not show through, and full height so cards in a row match.
 *
 * The logo is decorative - the issuer is named in text beside it - so it has
 * empty alt text and is hidden from assistive technology.
 */
export default function CredentialCard({
  credential,
  headingLevel = 3,
}: {
  credential: Credential;
  headingLevel?: 2 | 3;
}) {
  const horizontal = credential.span >= HORIZONTAL_MIN_SPAN;
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const tile = LOGO_TILE[credential.logoSize];

  return (
    <li className={SPAN_CLASS[credential.span]}>
      <div
        className={horizontal ? `${CARD_CLASS} md:flex-row md:gap-6` : CARD_CLASS}
      >
        <div
          className={`relative ${tile.className} shrink-0 overflow-hidden rounded-[4px] border border-border`}
        >
          <Image
            src={credential.logo}
            alt=""
            aria-hidden="true"
            fill
            sizes={tile.sizes}
            className="object-cover"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-faint">
            {credential.issuer}
          </p>
          <Heading className="mt-2 font-serif text-[1.3125rem] font-semibold leading-[1.35] text-balance text-text">
            {credential.title}
          </Heading>
          <p className="mt-3 font-serif text-[1.0625rem] leading-[1.7] text-muted">
            {credential.blurb}
          </p>
          <p className="mt-auto pt-5">
            <CredentialLink href={credential.href} label={credential.linkLabel} />
          </p>
        </div>
      </div>
    </li>
  );
}
