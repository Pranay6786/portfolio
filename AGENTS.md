<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project rules

- This is a personal product management portfolio for Pranay Patil, targeting APM and Junior PM roles.
- Never add a production dependency without explicit approval. The six current ones are `next`, `react`, `react-dom`, `@mdx-js/mdx`, `gray-matter` and `remark-gfm`.
- No backend, no database, no API routes, no authentication, no analytics, no animation library, no icon library, no state management library.
- All portfolio copy lives in `content/`. Do not hardcode portfolio copy into components.
- Copy rule: use hyphens, never em dashes.
- Never invent research findings, metrics, user numbers, testimonials or outcomes. All content is supplied by the author.
- Preserve existing functionality unless a change explicitly requires modifying it.
- Priorities, in order: maintainability, accessibility, responsive design, performance.
- Record every significant build decision in `BUILDLOG.md`.
- All colours come from tokens. No raw hex may appear outside `app/globals.css`.
## Content and components

- All case study content lives in `content/case-studies/` as `.mdx` files, one file per case study. Nothing else reads or writes that directory.
- Every case study file starts with YAML frontmatter matching `CaseStudyFrontmatter` in `lib/content.ts`: `slug` (string), `title` (string), `subtitle` (string), `kind` ("featured" or "library"), `order` (number), `badges` (array of strings), `metricStrip` (string or null), `summary` (string), `disclaimer` (string or null). Every field is required; the two nullable fields take an explicit `null` when they do not apply. `validateFrontmatter` throws at build time on anything else, naming the file and the field.
- Case studies are loaded through `getAllCaseStudies` and `getCaseStudyBySlug` in `lib/content.ts`, sorted by `order`, and rendered by the static route `app/work/[slug]/page.tsx`.
- Homepage copy lives in `content/homepage.json`, loaded and validated by `getHomepageContent` in `lib/homepage.ts`. Homepage work cards derive from case study frontmatter (`kind: "featured"`) and are never duplicated into `homepage.json`: no case study title, subtitle, summary, badge or metric strip appears there. The homepage sections live in `components/home/` and are all server components.
- `/work` (`app/work/page.tsx`) lists both tiers, featured then library, each in `order`; its copy lives in `content/work.json`, validated by `lib/work-index.ts`. The work card (`components/WorkCard.tsx`) is shared between the homepage and `/work`; change it once, not per page.
- The content components are a fixed set of seven: `Confidence`, `MetricStrip`, `ContentTable`, `Callout`, `ArticleHeading`, `BeforeAfter` and `Screen`. Do not add an eighth, and do not extend or split these seven, without explicit approval. Six are server components, `Screen` among them: no `useState`, no `useEffect`, no client hooks. `BeforeAfter` is the exception: a client component, for its toggle state. `Screen` and `BeforeAfter` share one frame treatment, the class constants in `components/image-frame.ts`; change the frame there, not in either component. The chrome components are `SiteHeader` (server) and `SectionIndex`, `ThemeToggle` and `CaseStudyBar`. With `BeforeAfter`, those three are the project's only four client components. Do not add a fifth without explicit approval.
- Case study images live in `public/images/<slug>/` and must have descriptive alt text.