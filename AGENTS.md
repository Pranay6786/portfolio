<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project rules

- This is a personal product management portfolio for Pranay Patil, targeting APM and Junior PM roles.
- Never add a production dependency without explicit approval. The three current ones are `next`, `react` and `react-dom`.
- No backend, no database, no API routes, no authentication, no analytics, no animation library, no icon library, no state management library.
- All portfolio copy lives in `content/`. Do not hardcode portfolio copy into components.
- Copy rule: use hyphens, never em dashes.
- Never invent research findings, metrics, user numbers, testimonials or outcomes. All content is supplied by the author.
- Preserve existing functionality unless a change explicitly requires modifying it.
- Priorities, in order: maintainability, accessibility, responsive design, performance.
- Record every significant build decision in `BUILDLOG.md`.