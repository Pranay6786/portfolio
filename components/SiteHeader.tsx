"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon } from "@/components/icons";
import ThemeToggle from "@/components/ThemeToggle";
import type { HomepageNavItem } from "@/lib/homepage";
import { useActiveSection } from "@/lib/use-active-section";

/**
 * Homepage sections land 100px from the top (`scroll-mt-[6.25rem]`), 24px clear
 * of the 76px header band. A section counts as being read once its top passes this
 * line, 16px below where a clicked section lands, so the clicked one is active.
 */
const ACTIVATION_LINE = 116;

const ICON_BUTTON_CLASS =
  "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted hover:text-text";

/**
 * Site header: a pill in a sticky 76px band. A client component only to read
 * the pathname and track the active section.
 *
 * The band's inner wrapper copies main's frame exactly - `max-w-[61rem]`,
 * centred, `px-5 sm:px-6` - so the pill is measured against the content frame.
 * The pill is capped at 52rem and centred: narrower than the content on wide
 * screens, the full content width on smaller ones. It is 48px tall and sits at
 * the bottom of the band (`items-end pb-1`): 24px from the top of the
 * viewport, 4px above the band's bottom edge.
 *
 * Every route shows the same pill: the home mark, the seven homepage section
 * links and the theme toggle, spread with justify-evenly so every gap is the
 * same. Below `md` the section links hide, leaving the home mark and toggle.
 *
 * On the homepage the links are in-page anchors (`#work`), the home mark goes
 * back to the top, and the link for the section being read is marked active.
 * The band is transparent there and ignores pointer events, so the page shows
 * around the pill and stays clickable beside it.
 *
 * On every other route the links lead home to the section (`/#work`) and the
 * home mark links to `/`. Nothing is tracked - there are no sections to
 * follow - so the scroll-tracking hook is never called. The band keeps a solid
 * background, because the case study bar sits directly under it at
 * `top-[4.75rem]` and article text must not show between the two.
 */
export default function SiteHeader({ navItems }: { navItems: HomepageNavItem[] }) {
  const isHome = usePathname() === "/";

  return (
    // Named for view transitions so the header stays put and on top while the
    // page beneath it cross-fades; see `site-header` in globals.css.
    <header
      style={{ viewTransitionName: "site-header" }}
      className={`sticky top-0 z-50 h-[4.75rem] w-full ${isHome ? "pointer-events-none" : "bg-bg"}`}
    >
      <div className="mx-auto flex h-full w-full max-w-[61rem] items-end px-5 pb-1 sm:px-6">
        <div className="pointer-events-auto mx-auto flex h-12 w-full max-w-[52rem] items-center justify-between rounded-full border border-border bg-surface px-1.5">
          {isHome ? <HomeNav items={navItems} /> : <AwayNav items={navItems} />}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

/** The homepage: in-page anchors, with the section being read marked active. */
function HomeNav({ items }: { items: HomepageNavItem[] }) {
  const activeId = useActiveSection(
    items.map((item) => item.id),
    ACTIVATION_LINE,
    false,
  );

  return (
    <>
      <a href="#" aria-label="Back to top" className={ICON_BUTTON_CLASS}>
        <HomeIcon />
      </a>
      <SectionLinks items={items} activeId={activeId} away={false} />
    </>
  );
}

/** Any other route: links home and to each homepage section, nothing tracked. */
function AwayNav({ items }: { items: HomepageNavItem[] }) {
  return (
    <>
      <Link href="/" aria-label="Home" className={ICON_BUTTON_CLASS}>
        <HomeIcon />
      </Link>
      <SectionLinks items={items} activeId={null} away />
    </>
  );
}

/**
 * The seven section links. On the homepage they are plain anchors, so the jump
 * keeps its smooth glide. Elsewhere they are `next/link` to `/#id`, a
 * client-side navigation home that lands on the section.
 */
function SectionLinks({
  items,
  activeId,
  away,
}: {
  items: HomepageNavItem[];
  activeId: string | null;
  away: boolean;
}) {
  return (
    <nav aria-label="Homepage sections" className="hidden flex-1 md:block">
      <ul className="flex items-center justify-evenly">
        {items.map((item) => {
          const isActive = item.id === activeId;
          const className = `block rounded-full px-2 py-2 font-sans text-[0.875rem] font-semibold ${
            isActive ? "text-accent" : "text-muted hover:text-text"
          }`;

          return (
            <li key={item.id}>
              {away ? (
                <Link href={`/#${item.id}`} className={className}>
                  {item.label}
                </Link>
              ) : (
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={className}
                >
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
