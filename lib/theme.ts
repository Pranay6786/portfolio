/**
 * Shared between the root layout's inline script (server) and ThemeToggle
 * (client). It lives here rather than in the client component because a plain
 * constant imported from a "use client" module into a server component is a
 * client reference, not the value: the script would serialise it as undefined.
 */
export const THEME_STORAGE_KEY = "portfolio-theme";

export type Theme = "dark" | "light";
