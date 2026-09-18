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