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

## 2026-10-09 - Salon case study and the /work index

`content/case-studies/salon.mdx` adds the first `kind: "library"` study, placed as supplied (`order: 5`). It routes through the existing `app/work/[slug]/page.tsx` with no code change. Its section index lists its five `##` headings, and it is not on the homepage, whose cards stay limited to `kind: "featured"`.

The work card moved out of `WorkSection` into `components/WorkCard.tsx`, unchanged, so the homepage and `/work` render the same card from frontmatter: subtitle as an h3, then title, summary, badges as `Pill`s and the metric strip, with the whole card linking to `/work/{slug}`. `WorkSection` now renders `<WorkCard>` per list item.

`app/work/page.tsx` is a static index of every case study, framed like the homepage (`max-w-[61rem]`, same padding). A header with a mono kicker, a serif h1 and a one-line intro sits above two groups, featured then library, each under a mono heading in `--text-faint` and kept in `order`. A group with no studies is omitted with its heading. The page's copy - kicker, title, intro and the two group headings - lives in `content/work.json`, not the component, per the rule that all portfolio copy lives in `content/`. `lib/work-index.ts` validates it with the same strictness as `homepage.json`: every field is required and non-empty, unknown keys are rejected, and errors name the field. The metadata title and description come from the same file.

Two values in `content/homepage.json` changed, nothing else: `background.linkHref` from `/about` to `/work/salon`, and `work.allWorkLabel` from "All work, including five shorter pieces" to "All work". With `/work` and `/work/salon` built, every internal link on the homepage now resolves.

## 2026-10-09 - Three library studies and case study page titles

Three `kind: "library"` case studies were added as supplied: `zepto.mdx` (`order: 6`), `twitter.mdx` (`order: 7`) and `altacad.mdx` (`order: 10`). Orders 8 and 9 are reserved for pieces not yet written. They route through the existing `app/work/[slug]/page.tsx` with no code change, appear in the `/work` library group after the salon study, and stay off the homepage. Their markdown tables render through `ContentTable`, and their `Confidence` and `Callout` tags use the existing components and props.

`app/work/[slug]/page.tsx` gained `generateMetadata`, returning the study's frontmatter `title` and `summary` as the page title and description. With the root layout's `%s - Pranay Patil` template, a case study's tab reads, for example, "Salon - Pranay Patil" instead of the bare site name. For an unknown slug it returns empty metadata instead of throwing. The page's own `notFound()` handles the 404, and the layout's default title applies.

## 2026-10-09 - Strava case study and BeforeAfter

`content/case-studies/strava.mdx` adds a `kind: "library"` study at `order: 8`, placed as supplied. It sits between Twitter (7) and AltAcad (10) in the `/work` library group and stays off the homepage. It is the first study with images. Its six screenshots live in `public/images/strava/`, the first use of `public/images/`. From now on, case study images go in `public/images/<slug>/` and need descriptive alt text.

`components/BeforeAfter.tsx` is the sixth content component and the fourth client component, approved for this study. It takes `before`, `after`, `beforeAlt`, `afterAlt` and an optional `caption`, and is registered in the MDX components map.

- The toggle is a pair of native radio inputs, visually hidden behind "Before" and "After" labels, inside a `fieldset` with a visually hidden legend. Arrow keys move between the options, and the browser announces the checked state, with no custom key handling. The active label uses the `Confidence` accent treatment (`text-accent bg-accent-tint border-accent-dim`, weight 600). The inactive one uses `--border` and `--text-muted`. Only the colour changes, with no transition.
- Both images stay mounted, stacked with `next/image` `fill` in one frame. The inactive one is `visibility: hidden` (`invisible`), plus `aria-hidden`, so it is out of the accessibility tree but keeps its layout box. That matters because `next/image` lazy-loads by default: a `display: none` image would never load until shown, while a hidden one loads alongside the visible one as the frame nears the viewport. That way the second image is ready before the toggle, without eager-loading all six at page start.
- The frame is a fixed 9:16 (0.5625), capped at `max-w-[20rem]` and centred, with a `--border` hairline and `--surface` background, so letterboxing reads as deliberate. The full 75ch measure would make a portrait frame over 1,000px tall. Measured from the files, the befores are 0.508-0.510 wide-to-tall (650-653 x 1280) and the afters 0.558-0.560 (768 x 1376, and 376 x 671 for `sheet-after`). With `object-contain` neither is cropped. At 320px wide the frame is 569px tall. An after fills it to within about 1px. A before shows at about 290px wide with roughly 15px bands either side. The frame's height never changes when toggled. 9:16 was chosen because it is the common phone screen proportion and sits on the afters, which carry the detail.
- `sheet-after.png` is 376px wide. At 320 CSS px on a 2x display it is upscaled, so it may look soft beside the others. A wider export would fix it.

## 2026-10-09 - VitaFit case study, Screen and the shared image frame

`content/case-studies/vitafit.mdx` adds a `kind: "library"` study at `order: 9`, placed as supplied, with three screenshots in `public/images/vitafit/` (`home.png`, `reward.png`, `challenge.png`). It sits between Strava (8) and AltAcad (10) in the `/work` library group and stays off the homepage. That fills one of the two reserved orders.

`components/Screen.tsx` is the seventh content component: a single captioned screenshot. It is a server component, with no state or client code. It takes `src`, `alt` and an optional `caption`, renders a `<figure>` with the caption as `<figcaption>`, and uses `next/image` with `fill` and `object-contain`. The image lazy-loads, the `next/image` default. Screen is registered in the MDX components map. Client components stay at four.

Shared frame: the frame and caption treatment that `BeforeAfter` introduced moved into `components/image-frame.ts` as class constants - `IMAGE_FRAME_CLASS` (9:16, `max-w-[20rem]`, centred, `--border` hairline, `--surface` background), `IMAGE_CAPTION_CLASS` and the matching `IMAGE_FRAME_SIZES`. Both components import them. They are constants rather than a component, so a server component and a client component can share them without either one changing kind and without adding to the component count. The `mt-4` gap under BeforeAfter's toggle stayed in `BeforeAfter`, because it belongs to the toggle, not the frame. BeforeAfter's rendered classes and behaviour are otherwise unchanged.

The VitaFit screenshots measure 0.458-0.516 wide-to-tall (374-412 x 787-823), all narrower than the 9:16 frame. They show uncropped, with bands either side: at 320px wide, `reward.png` (0.458) is about 261px wide with roughly 30px bands. All three are under 420px wide, so on a 2x display they upscale and may look soft. Wider exports would fix that.

Known lint finding, not from this change: `eslint components` reports `react-hooks/set-state-in-effect` in `ThemeToggle.tsx`'s layout effect. The file is unchanged since the theme toggle landed, and this stage did not touch it.

## 2026-10-09 - Invisible image frame and the fictional-scenario badge

AltAcad and VitaFit's second badge changed from "ASSIGNMENT BRIEF" to "FICTIONAL SCENARIO", in their frontmatter only. It shows on their mastheads, case study bars and `/work` cards.

The image frame no longer draws anything. `border border-border bg-surface` was removed from `IMAGE_FRAME_CLASS` in `components/image-frame.ts`. The box keeps its 9:16 ratio, centring and `max-w-[20rem]`, and exists only to hold a stable height, so a BeforeAfter toggle never shifts the page. `Screen` and `BeforeAfter` pick this up through the shared constant, with no change to either component.

A taller ratio was considered, so every image would fit by width and render at the full 320px, and rejected on cost. Measured from the files (width x height, w/h, height at 320px wide):

- strava/countdown-before 652 x 1280, 0.5094, 628.2px; countdown-after 768 x 1376, 0.5581, 573.3px
- strava/save-before 653 x 1280, 0.5102, 627.3px; save-after 768 x 1376, 0.5581, 573.3px
- strava/sheet-before 297 x 591, 0.5025, 636.8px; sheet-after 376 x 671, 0.5604, 571.1px
- vitafit/home 412 x 799, 0.5156, 620.6px; challenge 374 x 787, 0.4752, 673.4px; reward 377 x 823, 0.4581, 698.6px

Fitting the tallest, `reward.png` (0.4581), needs a box of 320 x 698.6px. The shortest, `sheet-after.png` (0.5604), would then sit 571.1px tall in it, leaving 127.5px empty, about 64px above and below, well over the roughly 80px budget. 9:16 stays (a 568.9px box). Images narrower than 0.5625 fit by height and show 260.6-293.3px wide. The afters (0.558-0.560) show at 317.5-318.8px.

The better fix, not applied: size each figure to its own content. `Screen` holds one image and needs no fixed box, so it can render at the image's intrinsic ratio, full width, with no empty space. `BeforeAfter` only needs a stable height across its own pair, so its box can match the taller of the two. That leaves 53.9-65.7px of space under the shorter image in each Strava pair, all under 80px. It needs the image dimensions at build time, which neither component has today.

## 2026-10-09 - Case studies reframed around the problem

Four case studies were replaced with revised versions as supplied: `strava.mdx`, `vitafit.mdx`, `altacad.mdx` and `uber.mdx`. Three disclaimers were edited by one phrase each: Twitter's now opens "Independent analysis. Not affiliated with X.", Emburse's scenario "is a constructed scenario" instead of being "supplied by the assignment brief", and Zomato's framework note opens "RICE is the standard tool for this." instead of "The brief asked for RICE."

Why: the studies now open on the problem rather than on the task that produced them, so they read as product work, not coursework. The disclaimers still say plainly what is fictional (VitaFit, AltAcad, Emburse's scenario) and what is independent and unaffiliated (Strava, Uber, Twitter, Emburse). Uber's subtitle became "Finding out the problem was narrower than it looked" and its first heading "It looks like a universal problem. It isn't.", with the heading count unchanged at five. The subtitle reaches the homepage and `/work` cards through frontmatter with no other edit.

A case-insensitive search of `content/` for "brief", "assignment" and "programme" still finds four uses that refer to the original task. `zomato.mdx` line 100 ("because the brief presented them as consecutive parts") and `homepage.json` lines 34 and 35 ("Briefs arrive pre-framed", "Uber: the brief said universal, research said concentrated") are left as they are for the author to decide. Line 35 no longer matches Uber's reframed opening. The other three hits are unrelated senses: "briefly", and a loyalty "points programme" twice.

## 2026-10-09 - Last section activates in the index, four small edits

Section index fix: the last section never became active when it was short. The page ran out of scroll before its heading could rise past the 264px activation line, so the position rule never selected it. `resolveActive` in `SectionIndex` now checks the bottom first. `maxScroll = document.documentElement.scrollHeight - window.innerHeight` is the furthest the page can scroll. If the page scrolls at all (`maxScroll > 2`) and `window.scrollY >= maxScroll - 2`, the last heading is set active and the function returns. The 2px tolerance (`BOTTOM_TOLERANCE`) covers zoomed and high-density screens, where the maximum scroll position can stop a fraction short. Every other position uses the existing rule. Clicking the last index item asks the browser to scroll its heading to 248px from the top. On a short final section it cannot, so the scroll stops at the bottom, and the scroll and `hashchange` handlers then select the last section through the same check.

Four edits:

- Uber's frontmatter `title` changed from "Uber Find My Ride" to "Uber". That reaches the masthead, the page title, the case study bar and both work cards.
- The grades were removed from the homepage education details: "B.E. Computer Engineering with Honors in AI & ML", "HSC" and "SSC".
- `TextLink` opens files and other sites in a new tab with `target="_blank"` and `rel="noopener noreferrer"`. App routes, `mailto:` links and in-page anchors such as `#work` stay in the current tab. The anchors are left out because opening an in-page jump in a new tab would be wrong.
- `WorkCard` shows the study title in `--accent` instead of `--text-muted`. Only the colour changed.

## 2026-10-09 - Floating pill nav, icons, and two small fixes

The site header is now a pill floating in a sticky 56px band. `SiteHeader` became a client component, the fifth, to read `usePathname()` and track the active section. The pill is 40px tall (`h-10`), fully rounded, with a `--surface` background and a `--border` hairline, centred in the band with 8px above and below.

- On `/` the pill holds a home mark (`href="#"`, named "Back to top"), a hairline divider, links to the seven homepage sections, and the theme toggle. The band is transparent and ignores pointer events, so the page shows around the pill and stays clickable beside it. Below `md` the divider and section links are hidden, leaving the home mark and toggle.
- Elsewhere the pill holds "Pranay Patil" linking to `/`, and the toggle. The band keeps a solid `--bg` background there, because the case study bar sits directly under it at `top-14` and article text must not show between them. The band is 56px on every page, so the case study offsets (bar at 56px, headings landing at 248px, activation at 264px, index at 192px) are unchanged.

The section link labels are the section kickers from `content/homepage.json`. `getHomepageNav` in `lib/homepage.ts` maps the seven content keys to `{ id, label }`, and the root layout reads it on the server and passes it to `SiteHeader` as props. No label appears in component source. Each homepage section now has an `id` matching its content key, with `work` unchanged so the hero's "View work" link still resolves, and `scroll-mt-16` (64px), so a clicked section lands 8px below the band. Its link is active once the section's top passes 80px, 16px below where it lands.

Active-section tracking is shared, not duplicated. The section index and the homepage nav need the same algorithm: positions read on a passive scroll listener throttled to one pass per animation frame, plus resize and hash changes, with the last element whose top has passed an activation line winning, and the last element winning outright at the bottom of the page. That moved into `useActiveSection` and `resolveActiveId` in `lib/use-active-section.ts`. The only real difference is a parameter: before anything has passed the line, the index falls back to its first section and the nav to none, since the homepage opens on a hero that is not in the nav. `SectionIndex` now calls the hook with its existing 264px line and the fallback on, and its behaviour is unchanged. That one change to `SectionIndex` was the cost of sharing the logic.

Icons arrive for the first time, in `components/icons.tsx` only: a home mark, a sun and a moon, hand-written on a 24-unit grid, rendered at 16px in `currentColor` with one shared 1.75 stroke width, `aria-hidden` and `focusable="false"`. `ThemeToggle` shows the sun while light is active and the moon while dark is, in place of the text label. Its `aria-label` ("Switch to light theme" or "Switch to dark theme") still names the control. The toggle and home mark are 32px hit areas. Hover changes colour only.

Two small fixes: the first background paragraph on the homepage gained one sentence naming the two engineering-degree projects, and `TextLink` adds a visually hidden " (opens in new tab)" to links that open in a new tab, so screen reader users are warned.

Watch item: the nav labels are the kickers as written, so "Build" links to the Work section and "Work" links to Background.

## 2026-10-09 - Larger pill nav aligned to the content, offsets moved

The header pill grew and now spans the content width. The band went from 56px to 64px (`h-14` to `h-16`) and the pill from 40px to 48px (`h-10` to `h-12`), keeping 8px above and below. The band's inner wrapper copies `main`'s frame exactly (`mx-auto max-w-[61rem] px-5 sm:px-6`) and the pill fills it (`w-full`), so the pill's edges sit on the content's edges below at every width. A `max-w-[61rem]` on the pill itself would have matched `main`'s outer box instead and overhung the text by 1.5rem each side on wide screens. Contents are spread with `justify-between`: an icon button at each end and, on the homepage, the section links between. The two ends are both 36px icon buttons (`h-9 w-9`, up from 32px), so the links sit centred. The divider between the home mark and the links was dropped, since the spacing now separates them. Links went from 0.8125rem to 0.875rem with `px-3.5 py-2`.

On every page except `/`, the "Pranay Patil" text link became the home icon linking to `/`, with `aria-label="Home"` and the homepage home mark's styling.

Offsets moved with the taller band:

- Homepage sections: `scroll-mt-16` to `scroll-mt-20`, so a clicked section lands at 80px, 16px under the band. The nav's activation line went from 80 to 96, 16px below that.
- Case study bar: `top-14` to `top-16`, and its observer's `HEADER_HEIGHT` from 56 to 64, so it still shows once the masthead passes under the band. The band and bar together are now 64 + 112 = 176px.
- `ArticleHeading` scroll margin: `scroll-mt-[15.5rem]` to `scroll-mt-[16rem]` (256px), 80px below the bar. The `SectionIndex` activation line went from 264 to 272, 16px below that.
- Section index nav: `top-[12rem]` to `top-[12.5rem]` (200px), 24px below the bar.

`background.kicker` in `content/homepage.json` changed from "Work" to "About". The nav link and the Background section's kicker now read "About" instead of a second "Work" beside the "Build" link to the work section.

## 2026-10-09 - Spread and enlarged pill nav, two content edits

On the homepage the section links now spread across the pill instead of clumping in the middle. The `<nav>` takes `flex-1` between the two `shrink-0` icon buttons, and its list uses `justify-evenly`. The brief offered `justify-between` or `justify-around`. `justify-between` would put the end links 8px from the buttons with about 60px between links. `justify-around` gives the ends half a gap. `justify-evenly` makes every gap equal, between links and between an end link and its button, which reads as one even row. On other pages the pill holds only the two icon buttons and centres them together (`justify-center gap-2`), still spanning the content width.

Sizes: band `h-16` to `h-20` (80px), pill `h-12` to `h-16` (64px, 8px clear above and below), icon buttons `h-9 w-9` to `h-11 w-11` (44px), pill padding `px-1.5` to `px-2`, links 0.875rem to 0.9375rem with `px-2 py-2.5`, since the even spacing now supplies the gaps. Calculated fit at the `md` breakpoint (768px): the pill is 720px wide and 702px inside, the buttons take 88px, leaving 614px for links that need about 450-481px (41 characters at 15px plus 7 x 16px padding), so they fit on one line with 133-164px to spare.

Offsets moved with the 80px band:

- Homepage sections: `scroll-mt-20` to `scroll-mt-24`, so a clicked section lands at 96px, 16px under the band. Nav activation line: 96 to 112, 16px below that.
- `CaseStudyBar`: `top-16` to `top-20`, and `HEADER_HEIGHT` from 64 to 80. Band and bar together: 80 + 112 = 192px.
- `ArticleHeading`: `scroll-mt-[16rem]` to `scroll-mt-[17rem]` (272px), 80px below the bar. `SectionIndex` activation line: 272 to 288, 16px below that.
- Section index nav: `top-[12.5rem]` to `top-[13.5rem]` (216px), 24px below the bar. That leaves 684px on a 900px screen for an index of about 460px.

Content: `skills.kicker` changed from "Stack" to "Skill", and `education.publication` now opens "Publication:" instead of "Published:". The publication line takes the institution's type treatment - serif, 1.0625rem, `leading-snug` - in italic and `--text-muted` instead of 0.875rem in `--text-faint`, with its position and `mt-10` unchanged. It keeps regular weight, not the institutions' semibold, so it reads as a note under the list rather than a fourth entry.

## 2026-10-09 - Pill nav scaled to 0.75x and narrowed

The header pill was scaled down by roughly 0.75x. Band `h-20` to `h-14` (56px), pill `h-16` to `h-12` (48px, now 4px clear above and below), icon buttons `h-11 w-11` to `h-9 w-9` (36px), links 0.9375rem to 0.8125rem with `py-2`, pill padding `px-2` to `px-1.5`. The pill is also narrower: the band's inner wrapper still copies `main`'s frame (`max-w-[61rem] px-5 sm:px-6`), and inside it the pill is `mx-auto w-full max-w-[52rem]`. It is centred and narrower than the content on wide screens, and still shrinks with the frame on small ones. `justify-evenly` on the links and the centred two-icon layout on other pages are unchanged.

The icon glyphs went from 16px to 18px through the shared `Icon` wrapper's `width` and `height` defaults, so they do not look lost in the 36px buttons. Paths, viewBox and stroke width are unchanged.

Offsets back to the 56px band:

- Homepage sections: `scroll-mt-24` to `scroll-mt-20`, so a clicked section lands at 80px, 24px under the band. Nav activation line: 112 to 96, 16px below that.
- `CaseStudyBar`: `top-20` to `top-14`, `HEADER_HEIGHT` 80 to 56. Band and bar together: 56 + 112 = 168px.
- `ArticleHeading`: `scroll-mt-[17rem]` to `scroll-mt-[15.5rem]` (248px), 80px below the bar. `SectionIndex` activation line: 288 to 264, 16px below that.
- Section index nav: `top-[13.5rem]` to `top-[12rem]` (192px), 24px below the bar, leaving 708px on a 900px screen.

Calculated fit at `md` (768px): the pill is min(720px, 52rem = 832px) = 720px wide and 706px inside. The two 36px buttons leave 634px, and the seven links need about 405-432px (41 characters at 13px plus 7 x 16px padding), so they fit on one line with about 200px to spare.

## 2026-10-09 - Pill lowered, bolder labels and icons

The pill sits lower without a gap above the header. The header stays `sticky top-0`, the band grew from `h-14` to `h-[4.75rem]` (76px), and the band's inner wrapper aligns the pill to the bottom with `items-end pb-1`. The 48px pill now runs from 24px to 72px, 4px above the band's bottom edge, about half a centimetre lower than before. The band still starts at 0, so on inner pages its solid `--bg` covers the full 76px, including the 24px above the pill.

Weight and size: the nav links are `font-semibold` and grew from 0.8125rem to 0.875rem. The shared icon `strokeWidth` went from 1.75 to 2.25, with paths, viewBox and the 18px size unchanged. `skills.kicker` became "Skills".

Calculated fit at `md` (768px): the pill is 720px wide and 706px inside, and the two 36px buttons leave 634px. The labels are now 42 characters at 14px semibold, about 0.6-0.65em each, so 353-382px, plus 7 x 16px padding is 465-494px. They fit on one line with 140-169px to spare.

Offsets for the 76px band:

- Homepage sections: `scroll-mt-20` to `scroll-mt-[6.25rem]`, so a clicked section lands at 100px, 24px under the band and 28px under the pill. Nav activation line: 96 to 116, 16px below that.
- `CaseStudyBar`: `top-14` to `top-[4.75rem]`, `HEADER_HEIGHT` 56 to 76. Band and bar together: 76 + 112 = 188px.
- `ArticleHeading`: `scroll-mt-[15.5rem]` to `scroll-mt-[16.75rem]` (268px), 80px below the bar. `SectionIndex` activation line: 264 to 284, 16px below that.
- Section index nav: `top-[12rem]` to `top-[13.25rem]` (212px), 24px below the bar, leaving 688px on a 900px screen.

- 2026-10-10: On every page except `/`, the header pill shrinks to wrap its two icon buttons (`w-auto`, no max width), centred by `mx-auto`. That makes it 94px wide: 36 + 8 gap + 36, plus 6px padding and a 1px border on each side. The homepage pill keeps `w-full max-w-[52rem]`.

## 2026-10-10 - Skills expansion, Formspree contact form, contact icons

Skills: `skills.groups` grew to five groups and 27 items. Business Analysis is new, and Analytics & Data, Technical and Tools gained items. The two-column grid would have left the fifth group alone on a row, so the section now lays out one group per row: the mono group title in an 11rem left column and its pills wrapping beside it, stacked below `sm`. One row per group can never leave an orphan, whatever the count, and it matches the label-and-values rows already used by the "Now" block and the education list. A three-column grid would still split five groups three and two, and CSS columns would read down then across.

Contact form: `contact.form` in `homepage.json` holds the Formspree endpoint and the field labels. `lib/homepage.ts` validates it with the same strictness as the rest of the file, and also requires the endpoint to be an absolute `https://` URL. `ContactSection` renders a plain HTML `<form method="POST" action={endpoint}>`, not a client component: Formspree accepts a normal form post and answers with its own thank-you page, so the form needs no JavaScript, no state and no sixth client component, and it works with JavaScript disabled. The form has three required fields - `name` (text), `email` (email) and `message` (textarea, four rows) - each with a visible `<label>` bound by `htmlFor` and `id`. It also has a hidden `_subject` ("Portfolio contact form") so messages arrive with a useful subject line, and Formspree's `_gotcha` honeypot, removed from layout, the tab order and the accessibility tree. The fields use `--surface`, a `--border` hairline, `--text`, sans at 1.0625rem (above the 16px below which iOS zooms in on focus) and a 2px `--accent` focus outline. The submit button uses the accent treatment. Name and email sit side by side from `sm` up. The form sits in a bordered `--surface` card matching the "Now" card. The `_subject` value is the one string set in code, since it never appears on the page.

Contact icons: four hand-written line marks joined `components/icons.tsx` on the shared wrapper and stroke width - an envelope (`MailIcon`), a rounded square with a stroked "in" (`LinkedInIcon`), a three-commit branch (`GitHubIcon`) and a page with a folded corner (`FileIcon`). They are not brand logos. The contact section's text link row became icon links matched by label: a 44px bordered circle holding a 20px icon, with a mono uppercase label below. Each keeps its href, its new-tab behaviour and the visually hidden "(opens in new tab)", using the `opensNewTab` rule now exported from `TextLink`. An action label with no icon fails the build with the label named. The hero's link row is unchanged.

## 2026-10-10 - Education timeline

The education list became a vertical timeline. Each entry has a 10px marker column, a 1.5rem gap (`gap-6`), then the period, institution and detail stacked. The text and its font, size and colour are unchanged. The period dropped its `pt-1`, which only aligned it in the old two-column grid. The institution gained `mt-1` now that it sits under the period.

The marker is a 10px dot with a 2px `--accent-dim` ring on `--bg`, so it reads as a bead on the line. That ring is the only accent in the section. The line is 1px in `--border`, drawn per entry and left off the last. Each segment is absolutely positioned in its entry's marker column from 0.6rem down (the dot's centre) to 0.6rem past the entry's bottom edge (the next dot's centre). Entries are spaced with `pb-10` instead of a flex gap, so a segment's bottom edge lands exactly on the next entry. The line therefore never runs above the first dot or below the last, and the dots, drawn above it, hide the segment ends. The marker column is `aria-hidden`, so screen readers hear a plain three-item list. It uses bordered elements only: no SVG, transforms, shadows or gradients. The publication line sits below the list, outside the timeline, with no marker.

Calculated width at 375px: `main`'s `px-5` leaves 335px, and the 10px marker plus the 24px gap leave 301px for the text. The longest line, the A. P. Shah institution name, wraps within that, and the content column is `min-w-0`, so there is no horizontal scroll.

## 2026-10-10 - Homepage section entrance, CSS only

The homepage's seven numbered sections now fade up as they scroll into view. It is pure CSS, using scroll-driven animations (`animation-timeline: view()`), with no JavaScript, no client component and no IntersectionObserver. The Next.js docs in `node_modules/next/dist/docs/` cover View Transitions but nothing on scroll-driven animations, so there was no framework guidance to follow. `app/page.tsx` marks the section wrapper `data-reveal-sections`, and the rule in `globals.css` targets `[data-reveal-sections] > section:not(:first-child)`, so the hero, the first child and on screen at load, never animates. Nothing else on the site carries the attribute, so the nav, case study pages and `/work` are untouched.

Why CSS over an observer: the effect needs no state, so it costs no client component and no JavaScript, and it cannot fail half-loaded. It also degrades on its own, since a browser that does not understand it ignores the whole block.

The motion: opacity 0 to 1 and `translate: 0 12px` to `0 0`, `ease-out`. Only opacity and vertical translate animate - no scale, blur or horizontal movement, and no stagger. Progress follows scroll, not time, so there is no duration in seconds (`animation-duration: auto`). `animation-range: entry 0% entry 160px` runs the whole effect over the first 160px of scrolling after a section's top edge enters the bottom of the viewport. The section is fully visible before it has risen a fifth of the way up a typical screen, and well before its heading, below 64-96px of section padding, is being read. A fixed 160px, rather than a percentage of the entry range, keeps the run the same for short and tall sections. `animation-fill-mode: both` holds the end state for the rest of the page, so nothing changes as a section leaves through the top.

Fallbacks, both read from the built stylesheet, where the keyframes and the rule appear only inside `@supports (animation-timeline:view()){@media (prefers-reduced-motion:no-preference){...}}`:

- A browser without scroll-driven animations fails the `@supports` test and skips the block entirely. No rule outside it sets `opacity: 0` or `translate` on these sections, so they render at full opacity in place, exactly as before.
- A reader with `prefers-reduced-motion: reduce` fails the inner media query, with the same result: no starting opacity, no movement, content visible at once.

Known limits of scroll-linked animation: the effect is tied to position, not played once. Scrolling back up until a section's top drops below the bottom of the viewport runs it backwards in that bottom 160px strip, and a section resting with its top inside that strip shows its first lines partly faded. Making it play once would need JavaScript, which this feature rules out.

## 2026-10-10 - Stronger section reveal; masthead padding checked and left alone

The homepage section reveal was strengthened so it reads as motion: `translate` from `0 12px` to `0 24px`, and `animation-range` from `entry 0% entry 160px` to `entry 0% entry 420px`. Everything else stays as it was: `ease-out`, `fill-mode: both`, both guards (`@supports (animation-timeline: view())` and `prefers-reduced-motion: no-preference`) and the hero exclusion. Trade-off: a section whose top edge sits inside the bottom 420px of the viewport is partly faded and lowered while at rest, and in the 160px version that band was only 160px. On a laptop-height screen the first section after the hero is likely to start inside it at load, so it may sit partly faded until the reader scrolls.

The brief said the case study masthead loads behind the 76px header band because `main`'s top padding (`pt-8 sm:pt-12`, 32px and 48px) is less than the band. Checked against the build, that premise does not hold, so the padding was not changed. The header is `position: sticky`, and a sticky element stays in normal flow: on every route the built HTML has `<body class="min-h-full flex flex-col">` with the 76px `<header>` first and `<main>` straight after it, so `main` starts 76px down at scroll 0. Its top padding is added below the band, not under it. Measured to the top of the first line's box at scroll 0:

- `/work/[slug]`: 76 + 32 = 108px, or 76 + 48 = 124px from `sm`. That is 32-48px clear of the band.
- `/work`: 76 + 48 = 124px, or 76 + 80 = 156px from `sm`.
- `/`: the hero's own `pt-12 sm:pt-20` gives the same 124px or 156px.

Client-side navigation lands at the same place. Next's layout router sets `document.documentElement.scrollTop = 0` and only calls `scrollIntoView()` on the page if its top is still off screen, which with an in-flow header it is not. Raising the padding to clear 76px on its own terms would push the title to about 172px at load without fixing anything. If the overlap shows up somewhere, the route and how it was reached (link, back button, reload mid-page, a `#` link) will locate it.

## 2026-10-10 - Masthead under the header after navigation; reveal range tied to coverage

Fixed: navigating from a scrolled page to a case study left the masthead's top under the 76px header. The scroll chain, read from Next 16's layout router and its upgrade guide, since there was no browser here to measure in:

1. The site sets `html { scroll-behavior: smooth }` for readers without reduced motion, so in-page anchor jumps glide.
2. Next 16 no longer switches smooth scrolling off during route transitions unless `<html>` carries `data-scroll-behavior="smooth"`. The site did not have it.
3. On navigation the router sets `scrollTop = 0`, then checks whether the new page's top is on screen. Under smooth scrolling the assignment only starts an animation, so the check still sees the old position, finds the page top off screen and falls back to `scrollIntoView()`.
4. `scrollIntoView()` puts `<main>`'s top at the viewport top. `<main>` starts 76px down, below the in-flow sticky header, so the page settles at `scrollY` 76 with `<main>` under the header. The masthead then begins only its own padding (32px, or 48px from `sm`) below the viewport top, leaving 44px or 28px of it hidden.

The fix is the attribute, `data-scroll-behavior="smooth"` on `<html>` in `app/layout.tsx`. Next then turns smooth scrolling off for the transition, `scrollTop = 0` takes effect at once, the page top is on screen when checked, and the `scrollIntoView()` fallback never runs. In-page anchors keep their smooth glide. More top padding was not the fix: at scroll 0 the masthead already clears the band (108px or 124px down). The fault was the scroll position after navigation, and padding at least 76px would only have pushed every case study's title down on a normal load. Readers with reduced motion never hit the bug, because smooth scrolling was already off for them.

Reveal: `animation-range` changed from `entry 0% entry 420px` to `entry 0% cover 30%`. The end now depends on the section's own coverage rather than a fixed length. The cover range spans the viewport height plus the section height, so on a 900px screen a 600px section finishes after about 450px of scroll and a 1,200px one after about 630px. The effect scales with the section. The 24px rise, `ease-out`, `fill-mode: both`, both guards and the hero exclusion are unchanged.

Side effect recorded separately: running `next dev` to look for Next's smooth-scroll warning regenerated the Next-managed block at the top of `AGENTS.md`, changing its first heading from `#` to `##`. That change is committed on its own, as the block's own note advises, so the tree stays clean. The warning itself is browser-console only (`warnOnce` in Next's client router, in development), so the dev server's terminal cannot show it either way. With the attribute present, the branch that would print it is never reached.

## 2026-10-10 - Route cross-fade with React ViewTransition; full nav on every route

View Transitions, as found in this install. The guide, `node_modules/next/dist/docs/01-app/02-guides/view-transitions.md`, says view transitions "work in the App Router with no configuration" through React's `<ViewTransition>` component, which it says ships in React 19.3. Next's config schema and docs have no `viewTransition` option, so no `next.config` flag is needed. The installed `react` package is 19.2.8 and does not export it, but the App Router uses Next's own bundled React, `19.3.0-canary-278794d7-20261002`, whose `react` export includes `ViewTransition`. `@types/react` 19.3 declares it. So the API is not behind an experimental flag and needs no new dependency, and it was enabled. One caveat: React's side is the canary build Next ships with, not a stable npm release of React.

Cross-fade: `app/page.tsx`, `app/work/page.tsx` and `app/work/[slug]/page.tsx` each wrap their content in `<ViewTransition enter="page-fade" exit="page-fade" default="none">`, per page rather than in the layout, because the guide notes that layouts persist and never enter or exit. On navigation the old page exits and the new one enters as separate, unpaired snapshots, so they run only the browser's default fade keyframes. Those animate opacity only, with no movement or resizing. `globals.css` sets 200ms on the `.page-fade` and `root` pseudo-elements. The header carries `view-transition-name: site-header` with its animation turned off, its old snapshot hidden and `z-index: 100`, so it switches instantly and the fading pages never draw over it. `::view-transition { pointer-events: none }` lets clicks through during the 200ms. Under `prefers-reduced-motion: reduce`, every view-transition pseudo-element gets `animation: none`, so the swap is instant. Browsers without the API swap instantly too. The transition uses no JavaScript of our own: React starts the browser transition because Next navigations already run as transitions. Scrolling is unchanged: `data-scroll-behavior="smooth"` stays on `<html>`, so Next still turns smooth scrolling off for the route change and lands at scroll 0. There was no browser here to watch it run.

Full nav everywhere: `SiteHeader` renders the same 52rem pill on every route, with the home mark, the seven section links and the theme toggle. The two-icon variant and its `w-auto` branch are gone. On `/` the links are plain `#id` anchors, so the jump keeps its smooth glide. Elsewhere they are `next/link` to `/#id`, a client-side navigation home that lands on the section via its `scroll-mt-[6.25rem]`. Off the homepage the home mark is a `next/link` to `/` named "Home". On `/` it stays `#`, named "Back to top". Active tracking runs only on `/`: the header renders `HomeNav`, the only caller of `useActiveSection`, when the pathname is `/`, and `AwayNav`, which never calls it, everywhere else. So no other route attaches a scroll listener or marks a link active. Below `md` the section links hide on every route.

## 2026-10-10 - Timeline draw-in, hero stagger, card hover lift

Three CSS-only effects, with no JavaScript and no new client component.

Timeline draw-in: each education segment, the absolutely positioned line between two dots, now carries `data-timeline-segment` and grows downward from its own dot (`transform: scaleY(0)` to `scaleY(1)`, `transform-origin: top`) on its own scroll-driven `view()` timeline. The range is `entry 100% cover 50%`: drawing starts once the whole segment is inside the viewport and finishes when its middle reaches the middle of the viewport, so the line draws while the entry rises through the lower half of the screen, where it is being read. It is linear, because the line should track the scroll exactly. View timelines measure the layout box and ignore transforms, so scaling the segment does not move its own timeline. It sits inside both existing guards, `@supports (animation-timeline: view())` and `prefers-reduced-motion: no-preference`. A browser without scroll-driven animations, or a reader with reduced motion, sees the full static line.

Hero stagger: the three hero lines, under `[data-hero-lines] > span`, play `hero-line-in` once on load: opacity 0 to 1 and `translate` 12px to 0 over 400ms, `ease-out`, with `animation-delay` 0, 120ms and 240ms through `:nth-child(2)` and `:nth-child(3)`, and `fill-mode: both` so the later lines stay hidden until their turn. The third line is fully visible 640ms after the hero first paints (240ms + 400ms). It is a time-based animation every browser supports, so it sits only inside `@media (prefers-reduced-motion: no-preference)`. With reduced motion the rule never applies and the lines show at once. LCP cost: the browser does not record a fully transparent element as the largest paint, so if the largest hero line is the LCP element, it registers when that line first becomes visible. That is about 0ms, 120ms or 240ms plus a frame after first paint, depending on which line is largest, not the full 640ms.

Card hover lift: `WorkCard` turns its border `--accent-dim` on hover and now also on keyboard focus (`focus-visible`), and under `motion-safe:` rises 2px (`-translate-y-0.5`, the `translate` property, not `transform`) with a 150ms transition on `border-color` and `translate` only. With reduced motion the border still changes, instantly, and the card stays put. The hover lift additionally sits in Tailwind's `@media (hover: hover)`, so touch screens do not get a stuck lift after a tap.

## 2026-10-10 - Bolder education timeline with a tail; longer draw-in

The timeline is heavier: the marker column went from 10px to 16px (`w-4`), the dot from 10px to 14px (`h-3.5 w-3.5`, same 2px `--accent-dim` ring on `--bg`) and the line from 1px to 2px (`w-0.5`, still `--border`). The gap to the text stays `gap-6`, and the column stays `aria-hidden`.

Recentring: the period's first line box is 13px x 1.5 = 19.5px, so its centre is 0.609375rem (9.75px) down. The dot's top margin is that less half the dot, 0.609375 - 0.4375 = 0.171875rem (2.75px), which puts its centre on the period line. `mx-auto` centres the 14px dot in the 16px column, 1px each side, and the 2px segment sits at `calc(50% - 1px)`, 7px to 9px, so both are centred on the column's 8px line. Each segment runs from `top-[0.609375rem]` to `-bottom-[0.609375rem]`, from its own dot's centre to the next dot's centre.

Tail: the last entry, which had no segment, now has a closing one carrying `data-timeline-segment` like the others. It runs from the dot's centre for `h-[2.4375rem]`: 0.4375rem to the dot's lower edge plus 2rem, ending 3.046875rem (48.75px) below the entry's top. The last entry's text is about 75px tall (period 19.5 + 4 + institution 23.4 + 4 + detail 24), so the tail ends inside the entry, about 26px above its bottom and about 66px above the publication line, which follows `mt-10`.

Draw-in range: from `entry 100% cover 50%` to `entry 0% cover 60%`. The old range started only once a segment was fully on screen and ended at the viewport middle, about (V - h) / 2 of scroll, roughly 390px for a 115px segment on a 900px screen. The new one starts as soon as a segment's top edge appears at the bottom and ends 60% of the way through crossing, about 0.6 x (V + h), roughly 610px for the same segment. The line therefore visibly draws from its first appearance up past the middle instead of in a short burst. It is still linear, with `transform-origin: top`, `scaleY` only, inside both guards.
