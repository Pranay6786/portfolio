import type { Metadata } from "next";
import { Geist, Geist_Mono, Source_Serif_4 } from "next/font/google";
import GridParallax from "@/components/GridParallax";
import Reveal from "@/components/Reveal";
import SiteHeader from "@/components/SiteHeader";
import { getHomepageNav } from "@/lib/homepage";
import { THEME_STORAGE_KEY } from "@/lib/theme";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  // Open Graph and Twitter images need an absolute URL; this is the live site.
  metadataBase: new URL("https://pranaypatil.in"),
  title: {
    default: "Pranay Patil",
    template: "%s - Pranay Patil",
  },
  description:
    "Product management portfolio - case studies, decisions and evidence",
};

// Runs synchronously while the browser parses the head, so the stored theme is
// on the document before anything paints. Dark is the default and carries no
// attribute, so only a saved "light" needs applying. It also sets data-js, which
// lets reveal targets start hidden (see components/Reveal.tsx), and removes it
// again after 2s unless Reveal has marked <html> data-reveal-ready, so the page
// can never stay blank if hydration fails.
const themeScript = `(function(){var d=document.documentElement;try{if(localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)})==="light")d.setAttribute("data-theme","light")}catch(e){}d.setAttribute("data-js","1");setTimeout(function(){if(!d.hasAttribute("data-reveal-ready"))d.removeAttribute("data-js")},2000)})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${sourceSerif.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        {/* Decorative scroll progress bar, fixed and out of flow: see
            [data-scroll-progress] in globals.css. */}
        <div aria-hidden="true" data-scroll-progress="">
          <div data-scroll-progress-fill="" />
        </div>
        {/* The homepage nav labels are read here, on the server, from homepage.json. */}
        <SiteHeader navItems={getHomepageNav()} />
        {children}
        <GridParallax />
        <Reveal />
      </body>
    </html>
  );
}
