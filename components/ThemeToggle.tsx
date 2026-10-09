"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";
import { MoonIcon, SunIcon } from "@/components/icons";
import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

/** Dark is the default: light is the only theme carrying a data attribute. */
function applyTheme(theme: Theme) {
  if (theme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
}

function readStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    // localStorage throws in some privacy modes. Fall back to the default.
    return null;
  }
}

/*
 * The theme as an external store, read with useSyncExternalStore instead of
 * copied into state from an effect. The stored preference is the source of
 * truth. `chosen` holds a choice made on this page, so a switch still applies
 * when localStorage cannot be written. Listeners are the mounted toggles.
 */
let chosen: Theme | null = null;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): Theme {
  return chosen ?? readStoredTheme() ?? "dark";
}

/** The server cannot see localStorage, so it renders the default. */
function getServerSnapshot(): Theme {
  return "dark";
}

function setTheme(theme: Theme) {
  chosen = theme;
  applyTheme(theme);

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Preference cannot be persisted here; the switch still applies.
  }

  listeners.forEach((listener) => listener());
}

/**
 * Switches between the dark and light token sets. The inline script in the root
 * layout has already applied the stored choice before first paint, so the
 * colours never flash; this component only owns the button.
 *
 * The button shows the sun while light is active and the moon while dark is.
 * The icons are hidden from assistive technology; the aria-label names the
 * control and says what pressing it does.
 *
 * The icon reads the store. During hydration React uses the server snapshot,
 * matching the server HTML, then re-renders with the stored theme straight
 * after. The layout effect re-applies the stored attribute before paint, which
 * React's Strict Mode remount clears in development. It reads the store rather
 * than the rendered value, which is still the server default at that point.
 */
export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useLayoutEffect(() => {
    applyTheme(getSnapshot());
  }, []);

  const next: Theme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} theme`}
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted hover:text-text"
    >
      {theme === "light" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
