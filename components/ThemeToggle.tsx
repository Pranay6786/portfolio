"use client";

import { useLayoutEffect, useState } from "react";
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

/**
 * Switches between the dark and light token sets. The inline script in the root
 * layout has already applied the stored choice before first paint; this syncs
 * the button's own label to it in a layout effect, which runs before paint, so
 * the label never shows the wrong state. The same effect re-applies the
 * attribute, which React's Strict Mode remount clears in development.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useLayoutEffect(() => {
    const stored = readStoredTheme();
    if (stored) {
      setTheme(stored);
      applyTheme(stored);
    }
  }, []);

  const next: Theme = theme === "dark" ? "light" : "dark";

  function toggle() {
    setTheme(next);
    applyTheme(next);

    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Preference cannot be persisted here; the switch still applies.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next} theme`}
      className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-muted"
    >
      {theme}
    </button>
  );
}
