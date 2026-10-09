"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon } from "@/components/icons";
import ThemeToggle from "@/components/ThemeToggle";
import type { HomepageNavItem } from "@/lib/homepage";
import { useActiveSection } from "@/lib/use-active-section";

/**
 * Homepage sections land 64px from the top (`scroll-mt-16`), 8px clear of the
 * 56px header band. A section counts as being read once its top passes this
 * line, 16px below where a clicked section lands, so the clicked one is active.
 */
const ACTIVATION_LINE = 80;

const ICON_BUTTON_CLASS =
  "inline-flex h-8 w-8 items-center justify-center rounded-full text-muted hover:text-text";

/**
 * Site header: a pill floating in a sticky 56px band. A client component only
 * to read the pathname and track the active section.
 *
 * On the homepage the pill holds a home mark, the section links and the theme
 * toggle, and the band is transparent, so the page shows around the pill. The
 * band ignores pointer events there, so it does not block clicks beside the
 * pill. Below `md` only the home mark and the toggle show.
 *
 * Everywhere else the pill holds the site name and the toggle, and the band
 * keeps a solid background. The case study bar sits directly under it at
 * `top-14`, and the band stops article text showing between the two. The band
 * is 56px on every page, so the offsets below it hold.
 */
export default function SiteHeader({ navItems }: { navItems: HomepageNavItem[] }) {
  const isHome = usePathname() === "/";

  return (
    <header
      className={`sticky top-0 z-50 flex h-14 w-full items-center justify-center px-5 ${
        isHome ? "pointer-events-none" : "bg-bg"
      }`}
    >
      <div className="pointer-events-auto flex h-10 items-center gap-1 rounded-full border border-border bg-surface px-1">
        {isHome ? (
          <HomeNav items={navItems} />
        ) : (
          <Link href="/" className="px-3 font-sans text-sm text-text">
            Pranay Patil
          </Link>
        )}
        <ThemeToggle />
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
      <span aria-hidden="true" className="mx-1 hidden h-4 w-px bg-border md:block" />
      <nav aria-label="Homepage sections" className="hidden md:block">
        <ul className="flex items-center">
          {items.map((item) => {
            const isActive = item.id === activeId;

            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={`block rounded-full px-2.5 py-1 font-sans text-[0.8125rem] ${
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
