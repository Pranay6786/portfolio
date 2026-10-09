"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon } from "@/components/icons";
import ThemeToggle from "@/components/ThemeToggle";
import type { HomepageNavItem } from "@/lib/homepage";
import { useActiveSection } from "@/lib/use-active-section";

/**
 * Homepage sections land 80px from the top (`scroll-mt-20`), 24px clear of the
 * 56px header band. A section counts as being read once its top passes this
 * line, 16px below where a clicked section lands, so the clicked one is active.
 */
const ACTIVATION_LINE = 96;

const ICON_BUTTON_CLASS =
  "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted hover:text-text";

/**
 * Site header: a pill in a sticky 56px band. A client component only to read
 * the pathname and track the active section.
 *
 * The band's inner wrapper copies main's frame exactly - `max-w-[61rem]`,
 * centred, `px-5 sm:px-6` - so the pill is measured against the content frame.
 * Inside it the pill is capped at 52rem and centred: narrower than the content
 * on wide screens, the full content width on smaller ones. The pill is 48px
 * tall, leaving 4px above and below it in the band.
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
 * under it at `top-14` and article text must not show between the two.
 */
export default function SiteHeader({ navItems }: { navItems: HomepageNavItem[] }) {
  const isHome = usePathname() === "/";

  return (
    <header
      className={`sticky top-0 z-50 h-14 w-full ${isHome ? "pointer-events-none" : "bg-bg"}`}
    >
      <div className="mx-auto flex h-full w-full max-w-[61rem] items-center px-5 sm:px-6">
        <div
          className={`pointer-events-auto mx-auto flex h-12 w-full max-w-[52rem] items-center rounded-full border border-border bg-surface px-1.5 ${
            isHome ? "justify-between" : "justify-center gap-2"
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
                  className={`block rounded-full px-2 py-2 font-sans text-[0.8125rem] ${
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
