# Build log

Running record of significant build decisions for this portfolio, newest entries appended below.

## 2026-09-18 - Scaffold

- Stack chosen: Next.js App Router, TypeScript, Tailwind CSS.
- Versions installed: Next.js 16.3.5, React 19.2.8, React DOM 19.2.8, TypeScript ^5, Tailwind CSS ^4 (via @tailwindcss/postcss), ESLint ^9 with eslint-config-next 16.3.5. Node v24.18.0.
- Hosted agent builders were evaluated and rejected: they add platform-specific dependencies that would lock the project to one host and conflict with the minimal-dependency rule.
- Scaffold created locally with create-next-app, then reduced to a placeholder page: starter markup, starter SVG assets in public/ and starter metadata removed.
- Directory structure prepared for later stages: content/ for all portfolio copy, components/ for UI, lib/ for helpers. Each holds a .gitkeep until real files land.

## 2026-09-18 - Content layer

MDX approach chosen: read `.mdx` files from `content/case-studies/` with `fs`, split frontmatter with `gray-matter`, and compile the body with `@mdx-js/mdx` `evaluate` against `react/jsx-runtime`, injecting the four content components through the `components` prop. Compilation happens during prerendering only.

Rejected alternative: the `@next/mdx` plugin documented in `node_modules/next/dist/docs/01-app/02-guides/mdx.md`. It does not support frontmatter, requires a root `mdx-components.tsx` and a `next.config.ts` change, and would have needed five new production dependencies (`@next/mdx`, `@mdx-js/loader`, `@mdx-js/react`, `gray-matter`, `remark-gfm`), over the three-dependency budget for this stage.

Dependencies added, three in total:

- `@mdx-js/mdx` ^3.1.1 - compiles MDX source into a React component. This is the compiler `@next/mdx` wraps, used directly so content can live outside `app/`.
- `remark-gfm` ^4.0.1 - GitHub-flavoured markdown, needed for table syntax in case study bodies.
- `gray-matter` ^4.0.3 - parses YAML frontmatter, which MDX does not handle itself.

Frontmatter schema, enforced by `validateFrontmatter` in `lib/content.ts`, which throws an error naming the file and the offending field and therefore fails the build rather than a request:

- `slug: string`
- `title: string`
- `subtitle: string`
- `kind: "featured" | "library"`
- `order: number`
- `badges: string[]`
- `metricStrip: string | null`
- `summary: string`
- `disclaimer: string | null`

Routing: `app/work/[slug]/page.tsx` uses `generateStaticParams` with `dynamicParams = false`, so every case study is prerendered at build time and unknown slugs return a 404. `notFound()` from `next/navigation` covers the same case defensively.

Components: four fixed content components in `components/` (`Confidence`, `MetricStrip`, `ContentTable`, `Callout`). All are server components with no client hooks and no styling; `ContentTable` is mapped onto the markdown `table` element.
## 2026-10-06 - Design tokens and fonts

Typography and colour tokens only. No component, page or article styling yet.

Fonts, all loaded through `next/font/google` in `app/layout.tsx` with no package installed. Each is exposed as a CSS custom property and the three classes sit together on the `html` element:

- Source Serif 4 (`--font-source-serif`) - case study body prose and article headings. Variable weight, normal and italic.
- Geist Sans (`--font-geist-sans`) - interface text.
- Geist Mono (`--font-geist-mono`) - confidence labels, metric strips and table contents.

The roles are recorded here but not yet applied; `body` still carries the starter `font-family` until the next stage.

Colour tokens, defined once in `app/globals.css` and nowhere else. Dark is the default on `:root`, light applies under `:root[data-theme="light"]`, and `color-scheme` is set to match in each so form controls and scrollbars follow the theme. The starter `--background`/`--foreground` pair and the `prefers-color-scheme` block were removed; nothing referenced them outside that file.

| Token | Dark | Light |
| --- | --- | --- |
| `--bg` | `#0F0F0F` | `#FBFAF7` |
| `--surface` | `#17171A` | `#F2F0EA` |
| `--text` | `#EDEAE4` | `#1A1A18` |
| `--text-muted` | `#A8A29A` | `#57544E` |
| `--text-faint` | `#858078` | `#6E6A62` |
| `--accent` | `#D99A4E` | `#8A5A12` |
| `--accent-dim` | `#7A5526` | `#C9A97A` |
| `--border` | `#2A2A28` | `#DEDAD1` |

Every token is mapped into the Tailwind v4 theme in the same file with `@theme inline`, so colour utilities resolve through `var()` and follow the active theme rather than baking in a value. `--font-serif` was added alongside the existing `--font-sans` and `--font-mono` mappings. `body` takes `var(--bg)` and `var(--text)`.
## 2026-10-06 - Case study styling

Type scale and font roles for the case study pages. No header, footer, navigation or homepage yet.

Fonts by element:

- Source Serif 4 (`--font-serif`): case study title, subtitle, summary, all article prose, article headings h2/h3/h4 and the callout title.
- Geist Sans (`--font-sans`): `body` default and the disclaimer.
- Geist Mono (`--font-mono`): confidence labels, metric strips, badge pills, table contents and inline code.

Type scale:

| Element | Size | Line height |
| --- | --- | --- |
| Case study title | 2rem, 2.375rem from the `sm` breakpoint | 1.15 |
| Subtitle | 1.1875rem, 1.3125rem from `sm` | snug |
| Article h2 | 1.75rem | 1.25 |
| Article h3 | 1.3125rem | 1.35 |
| Article h4 | 1.125rem | 1.4 |
| Callout title | 1.1875rem | 1.35 |
| Body prose, summary | 1.0625rem | 1.7 |
| Metric strip, table, disclaimer | 0.8125rem | 1.5 |
| Confidence label, badge pill | 0.6875rem | inherited |

Headings take more space above than below (h2 3rem above, 0.875rem below) so sections read as breaks rather than floating labels.

Measure: `[data-article]` is capped at 68ch and centred, and the page frame is set to 36.5rem to match it at the prose size, with 1.25rem of page padding that rises to 1.5rem from the `sm` breakpoint.

Colour discipline: accent is used only for confidence labels and prose links. Badges and the disclaimer use `--border`, `--text-muted` and `--text-faint`, keeping the accent rare enough to stay a signal.

The prose rules live in `@layer base` rather than unlayered. Unlayered CSS outranks every Tailwind layer regardless of specificity, which would have made the page header's utilities unusable inside the same `[data-article]` element; in the base layer the utilities win and the header can opt out of a prose rule by setting its own.

`ContentTable` renders a scroll container around the table, so a wide table scrolls inside its own box instead of widening the page on narrow screens.
## 2026-10-07 - Section index

Case study pages gained a scroll-following section index, listing the article's `##` headings to the left of the prose on wide screens.

`SectionIndex` is the project's first and only client component. It needs `IntersectionObserver` and local state, neither of which exists on the server. Everything else - the page, the article, the other five components - stays server-rendered. It disconnects the observer on unmount.

The observer is the trigger, not the answer. It fires whenever a heading crosses the activation line 96px below the top of the viewport, and the handler then resolves the current section from the headings' measured positions: the last one whose top has passed that line. A first pass tracked the set of currently-intersecting headings inside a narrow band instead, which went stale whenever several headings were skipped at once - a flick scroll, an anchor jump, End - because the skipped headings never entered the band to be recorded. Reading positions on each callback is correct under those jumps and needs no scroll listener.

Heading ids: `slugify` in `lib/content.ts` lowercases, strips diacritics and apostrophes, and joins words with hyphens, giving ASCII-safe anchors. `getSections` reads the raw MDX body, collects every line starting with `## ` outside fenced code blocks, and appends a numeric suffix to repeated headings so ids stay unique. The matching `h2` markup comes from `ArticleHeading`, which runs the same `slugify` over its own text content and adds a scroll margin so a linked heading is not flush against the viewport edge.

Known limit: `ArticleHeading` sees only its own children, so it cannot apply the duplicate suffix that `getSections` does. If a case study ever repeats an `##` heading word for word, the index's second entry would point at an id that the second heading does not carry, and the link would land on the first. No current case study repeats a heading. Worth revisiting if one does.

The MDX components map is now five entries: `Callout`, `Confidence`, `MetricStrip`, `h2` mapped to `ArticleHeading`, and `table` mapped to `ContentTable`.

Layout: the index column (13rem) and the article (40rem) are centred together as a 56rem group with a 3rem gap. Below the `lg` breakpoint the index is hidden with `display: none`, which also removes it from the accessibility tree, and the article reads exactly as it did before. Anchor jumps scroll smoothly only under `prefers-reduced-motion: no-preference`.
## 2026-10-07 - Site header and theme toggle

Every page now carries a sticky site header, 56px tall (`h-14`), full width, with a `--border` hairline along the bottom and a solid `--bg` background so article prose does not show through as it scrolls under. It sits at `z-50`, above the section index. Its inner row matches `main`: `max-w-[56rem]` with the same horizontal padding, so the site title lines up with the content below it. Left: "Pranay Patil" linking to `/`. Right: the theme toggle.

`ThemeToggle` is the project's second and last client component, for the click handler and local state. It is text only, no icon. `SiteHeader` itself stays a server component.

Theme persistence uses the single `localStorage` key `portfolio-theme`, holding `"dark"` or `"light"`. Every read and write is wrapped in try/catch, since `localStorage` throws outright in some privacy modes; the toggle still switches the theme when persistence fails.

Anti-flash: an inline script in `<head>` in the root layout reads that key and sets `data-theme="light"` on the document element when that is the stored value. It runs synchronously during HTML parsing, before first paint, which is the approach the framework documents in `02-guides/preventing-flash-before-hydration.md`. Dark is the default and carries no attribute, so only a saved "light" needs applying. `<html>` takes `suppressHydrationWarning` because the script changes it before React hydrates. The toggle re-reads the key in a `useLayoutEffect`, which runs before paint: that syncs the button's own label and, per the same guide, re-applies the attribute after React's Strict Mode remount clears it in development.

Three values moved to clear the new header:

- `ArticleHeading` scroll margin: `scroll-mt-24` to `scroll-mt-[8.5rem]` (96px to 136px)
- `SectionIndex` `ACTIVATION_LINE`: 112 to 152
- The index nav: `sticky top-20 max-h-[calc(100vh-7rem)]` to `sticky top-[5.5rem] max-h-[calc(100vh-9rem)]`

`main`'s top padding dropped from `py-14 sm:py-20` to `pt-8 sm:pt-12`, keeping the bottom padding, so the page does not open with a large empty band under the header.

## 2026-10-07 - Light accent from amber to rust

The light-theme accent moved from amber to rust: `--accent` from `#7a4a08` to `#9a3412`, and `--accent-dim` from `#a8822f` to `#c2714a`. Dark tokens are unchanged.

The darkened amber already had enough contrast against the background (7.16:1 on `--bg`), but it looked too close to the near-black body text, so confidence labels and links did not stand out at a glance. The problem was telling accent apart from body text, not contrast. Rust is a distinctly different hue, and it still clears the thresholds: `--accent` 7.00:1 on `--bg` and 6.41:1 on `--surface`, and `--accent-dim` 3.50:1 on `--bg`.

## 2026-10-07 - Light accent to orange, confidence tint, centred section index

The light-theme accent moved from rust to orange: `--accent` from `#9a3412` to `#c2410c`, and `--accent-dim` from `#c2714a` to `#e09a72`. Measured in light mode: `--accent` is 4.96:1 on `--bg` and 4.52:1 on `--accent-tint`. `--accent-dim` is 2.03:1 on `--accent-tint` and 2.23:1 on `--bg`, below 3:1. It is kept as specified by the author's decision, and it only draws the confidence label's border, not text.

New token `--accent-tint`, mapped to `--color-accent-tint`: `#fbede5` in light, `transparent` in dark. `Confidence` now takes it as its background and renders at weight 600, so in light mode the label reads as orange on a faint warm tint. In dark mode the background is transparent and the text and border tokens are unchanged, so only the weight differs.

The section index column is now the sticky element: `sticky top-14` (below the 56px header), `h-[calc(100vh-3.5rem)]`, a flex column with `justify-center`, so the nav sits in the vertical middle of the viewport once the column is stuck. Centring uses flexbox, not transforms. The `<nav>` lost its own sticky positioning and now uses `max-h-full` with `overflow-y-auto`, so a long list still scrolls inside the box and never exceeds it.

Known trade-off: before the column sticks, it sits at its natural position below the masthead, so at 1440x900 the nav starts near or just below the bottom of the viewport on page load. It reaches the centred position after roughly 500px of scrolling. Accepted as specified.

## 2026-10-07 - Light accent-dim correction, section index back to top-anchored

Light `--accent-dim` moved from `#e09a72` to `#d1692e`, the same hue and saturation, darker. The earlier value was 2.03:1 on `--accent-tint` and 2.23:1 on `--bg`. The new one is 3.18:1 on `--accent-tint`, 3.49:1 on `--bg` and 3.19:1 on `--surface`, all above 3:1.

The vertically centred index is reverted. The column is back to `hidden w-52 shrink-0 lg:block`, and the `<nav>` is again `sticky top-[5.5rem] max-h-[calc(100vh-9rem)] overflow-y-auto overflow-x-hidden`. Reason: before the column stuck, the centred nav sat at its natural position under the masthead, which at 1440x900 put it at or just below the bottom of the viewport on page load. It only reached the middle after roughly 500px of scrolling.

Spacing: the gap between the index and the article went from `gap-12` to `gap-20` (3rem to 5rem), and `main` widened from `max-w-[56rem]` to `max-w-[61rem]` to keep the group centred: 13rem + 5rem + 40rem = 58rem, plus 3rem of horizontal padding at `sm` and above = 61rem. Index items went from `gap-3` to `gap-5` (12px to 20px).

The active index item now scales to 1.06 from its left edge (`origin-left`), with a 150ms transition on `color` and `scale`. All of it sits behind `motion-safe:`, so under `prefers-reduced-motion: reduce` there is no scaling and no transition, and the active item is marked by colour alone. It uses the CSS `scale` property, Tailwind v4's form of `transform: scale()`, which honours `transform-origin` the same way. This is the only animation in the project.

## 2026-10-07 - Section index at natural height

The section index `<nav>` lost its `max-h-[calc(100vh-9rem)]` and `overflow-y-auto`, which removes the scrollbar that showed beside it. It is now `sticky top-[5.5rem] overflow-x-clip`, at natural height. It uses `overflow-x-clip` rather than `overflow-x-hidden`: CSS turns `overflow-y: visible` into `auto` whenever the other axis is `hidden`, so `hidden` would have kept the nav a vertical scroll box. The active item's 1.06 scale reaches about 0.6-1.2px below the nav when the last section is active, which could bring the scrollbar back on systems that always show scrollbars. `clip` clips the same way without making the nav scrollable.

Trade-off: with no height limit and no scrolling, a case study with enough sections to be taller than the viewport would have its lower index items unreachable while the nav is stuck. The longest current index is nine items, OutLoud's. Calculated at `gap-5` with wrapped headings, it is about 420-460px tall, ending at 508-548px from the top of a 900px viewport.

Index links gained `pr-3`, so text wraps at 196px and the 1.06 scale stays inside the 208px column: 196 x 1.06 = 207.76px.

`SiteHeader`'s inner container widened from `max-w-[56rem]` to `max-w-[61rem]` to match `main`, so the site title lines up with the content below it again.

## 2026-10-07 - Case study bar

Case study pages gain a sticky bar that works as a condensed masthead, appearing once the masthead has scrolled out of view. `CaseStudyBar` is the project's third client component and takes `title`, `subtitle` and `badges`. It is 112px tall (`h-28`), sticky at `top-14` directly under the site header, full width with a `--border` hairline and a solid `--bg` background, at `z-40` so it sits under the header (`z-50`) and over the article. Its inner container matches `main`: `max-w-[61rem]`, `px-5 sm:px-6`.

It has two lines, centred vertically. The first holds the title, serif at 1.0625rem in `--text`, truncated if needed, with the badges on the right. The badges use the masthead's pill styling at a smaller size: mono at 0.625rem, `--border` border, `--surface` background, `--text-muted` text. The second line holds the subtitle, serif at 0.875rem in `--text-muted`, one line with an ellipsis. Badges and subtitle both hide below `sm`, which leaves only the title there. A first version was a single 64px line with the title and subtitle side by side. It was expanded so the bar reads as a condensed masthead rather than a different element.

Why a condensed bar rather than pinning the full masthead: the masthead is roughly 400px tall, and pinning it would take nearly half of a 900px viewport on a page built for reading. The bar keeps the title, subtitle and badges in view for 112px.

Visibility uses an IntersectionObserver, not a scroll listener. The page places an empty sentinel `<div id="masthead-end">` straight after the masthead `<header>`. The observer's root is inset by the 56px header, and the bar shows only while the sentinel is not intersecting and sits above that line. The second check keeps the bar hidden when the sentinel is still below the viewport, for example under a masthead taller than the screen. While hidden, the component renders nothing, so the server HTML carries no bar. The id lives in `lib/case-study-bar.ts`, for the same reason as `THEME_STORAGE_KEY` in `lib/theme.ts`: a constant imported from a `"use client"` module into a server component is a client reference, not the value.

The bar renders outside `main` so it spans the full width, with `-mb-28` cancelling its own height. It overlays the page when it appears instead of pushing the content down 112px mid-read. It repeats the masthead, so it carries `aria-hidden`. Under `prefers-reduced-motion: no-preference` it fades in over 200ms using `@starting-style` (Tailwind's `starting:` variant). Under `reduce` it appears with no transition. Nothing moves or transforms.

Three offsets moved to clear the fixed region, 56px header + 112px bar = 168px:

- `ArticleHeading` scroll margin: `scroll-mt-[8.5rem]` to `scroll-mt-[15.5rem]` (136px to 248px, 80px below the bar)
- `SectionIndex` `ACTIVATION_LINE`: 152 to 264, 16px below where a linked heading lands
- The index nav: `sticky top-[5.5rem]` to `sticky top-[12rem]` (88px to 192px, 24px below the bar)

The masthead's h1 and subtitle also gained `text-balance` (`text-wrap: balance`), so a title or subtitle that wraps splits its lines evenly instead of leaving a short last line. Browsers without support wrap as before.

## 2026-10-07 - Homepage

`/` replaces the scaffold heading with the homepage: a hero, then seven numbered sections - work, decide, background, skills, certifications, education, contact. It is fully static, with no client components, hooks, event handlers or animation. The page sits in `max-w-[61rem]` with the header's padding, and the sections are separated by `--border` hairlines (`divide-y`) with `py-16 sm:py-24` each.

Content split: the work cards are built from case study frontmatter, filtered to `kind: "featured"` and kept in `order`. Each card shows the subtitle as its heading, then the title, summary, badges and metric strip, and links whole to `/work/{slug}`. Editing a case study's frontmatter changes its card with nothing else to touch. Everything else on the page comes from `content/homepage.json`, which carries no copy of any case study field. The page metadata comes from the same JSON: the hero subhead as the title, the hero lines as the description.

`lib/homepage.ts` defines `HomepageContent`, matching the JSON's shape, plus `validateHomepage` and the loader `getHomepageContent`. Validation is as strict as `validateFrontmatter`, and it also rejects any key the type does not define, so a misspelt field is reported by name instead of silently not rendering. Errors name the field by its full path. For example, a number in place of a link fails the build with: `Invalid content in content/homepage.json: field "decide.steps[2].href" must be a string, received number.` Lists must be non-empty, and invalid JSON fails with the parser's message.

Section components, all server components in `components/home/`:

- `HeroSection`, `WorkSection`, `DecideSection`, `BackgroundSection`, `SkillsSection`, `CertificationsSection`, `EducationSection`, `ContactSection`: one per section, each taking its slice of `HomepageContent` as typed props (`WorkSection` also takes the featured frontmatter).
- `SectionHeader`: the shared mono kicker line ("{kicker} / {number}") and serif title, with optional subtitle and intro. The JSON's `work.intro`, `decide.intro` and `background.subtitle` render through it.
- `Pill`: the masthead badge styling, used for card badges and skill items, never in the accent.
- `TextLink` and `ActionLinks`: accent links underlined like article links, using `next/link` for app routes and a plain `<a>` for anchors, files, `mailto:` and external sites.

Work cards reuse the existing `MetricStrip`. `/work` and `/about` are linked but not built yet, so they 404 for now. The résumé is committed as `public/resume.pdf`, the path the JSON links to; it was supplied as `PranayPatil_Resume.pdf` and renamed to match.
