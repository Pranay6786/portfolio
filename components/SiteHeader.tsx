import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

/**
 * Sticky site header, 56px tall. The z-index keeps it above article content as
 * the page scrolls under it, and the solid background stops prose showing
 * through. The inner row matches main's width and horizontal padding so the
 * title lines up with the content below.
 */
export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 h-14 w-full border-b border-border bg-bg">
      <div className="mx-auto flex h-full w-full max-w-[56rem] items-center justify-between px-5 sm:px-6">
        <Link href="/" className="font-sans text-sm text-text">
          Pranay Patil
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
