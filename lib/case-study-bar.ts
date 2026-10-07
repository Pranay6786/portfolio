/**
 * Shared between the case study page (server), which renders the sentinel, and
 * CaseStudyBar (client), which observes it. It lives here rather than in the
 * client component for the same reason as THEME_STORAGE_KEY in lib/theme.ts: a
 * constant imported from a "use client" module into a server component is a
 * client reference, not the value.
 */
export const MASTHEAD_SENTINEL_ID = "masthead-end";
