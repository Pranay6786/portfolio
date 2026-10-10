import type { Metadata } from "next";
import { Geist, Geist_Mono, Source_Serif_4 } from "next/font/google";
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
  title: {
    default: "Pranay Patil",
    template: "%s - Pranay Patil",
  },
  description:
    "Product management portfolio - case studies, decisions and evidence",
};

// Runs synchronously while the browser parses the head, so the stored theme is
// on the document before anything paints. Dark is the default and carries no
// attribute, so only a saved "light" needs applying.
const themeScript = `(function(){try{if(localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)})==="light")document.documentElement.setAttribute("data-theme","light")}catch(e){}})()`;

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
        {/* The homepage nav labels are read here, on the server, from homepage.json. */}
        <SiteHeader navItems={getHomepageNav()} />
        {children}
      </body>
    </html>
  );
}
