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
 * On the homepage the pill is capped at 52rem and centred: narrower than the
 * content on wide screens, the full content width on smaller ones. On other
 * pages it shrinks to wrap its two icon buttons, centred by the same margin.
 * The pill is 48px tall and sits at the bottom of the band (`items-end pb-1`):
 * 24px from the top of the viewport, 4px above the band's bottom edge. The band itself starts at
 * the top, so on inner pages its solid background covers the space above the
 * pill too.
 *
 * On the homepage the contents spread across the pill: an icon button at each
 * end and the section links filling the space between, spaced with
 * justify-evenly so every gap - between links, and between the end links and
 * the buttons - is the same. On other pages the pill holds only the two icon
 * buttons, centred together.
 *
 * On the homepage the band is transparent and ignores pointer events, so the
 * page shows around the pill and stays clickable beside it. Below `md` the
 * section links hide, leaving the home mark and the toggle. Everywhere else
 * the band keeps a solid background, because the case study bar sits directly
 * under it at `top-[4.75rem]` and article text must not show between the two.
 */
export default function SiteHeader({ navItems }: { navItems: HomepageNavItem[] }) {
  const isHome = usePathname() === "/";

  return (
    <header
      className={`sticky top-0 z-50 h-[4.75rem] w-full ${isHome ? "pointer-events-none" : "bg-bg"}`}
    >
      <div className="mx-auto flex h-full w-full max-w-[61rem] items-end px-5 pb-1 sm:px-6">
        <div
          className={`pointer-events-auto mx-auto flex h-12 items-center rounded-full border border-border bg-surface px-1.5 ${
            isHome ? "w-full max-w-[52rem] justify-between" : "w-auto justify-center gap-2"
          }`}
        >
          {isHome ? (
            <HomeNav items={navItems} />
          ) : (
            <Link href="/" aria-label="Home" className={ICON_BUTTON_CLASS}>
              <HomeIcon />
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

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
      <nav aria-label="Homepage sections" className="hidden flex-1 md:block">
        <ul className="flex items-center justify-evenly">
          {items.map((item) => {
            const isActive = item.id === activeId;

            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={`block rounded-full px-2 py-2 font-sans text-[0.875rem] font-semibold ${
                    isActive ? "text-accent" : "text-muted hover:text-text"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
