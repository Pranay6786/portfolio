# Portfolio

Personal product management portfolio for Pranay Patil - case studies, decisions and evidence.

## Stack

- Next.js 16.3.5 (App Router)
- React 19.2.8
- TypeScript 5
- Tailwind CSS 4

## Prerequisites

- Node.js v24.18.0 (the version currently installed and used for this project)
- npm (bundled with Node.js)

## Running locally

```bash
npm install
npm run dev
```

The site is then served at http://localhost:3000.

Other scripts:

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # ESLint
```

## Directory layout

- `app/` - routes, the root layout and global styles. Files here are Next.js App Router conventions: `layout.tsx` wraps every route, `page.tsx` is the home route, `globals.css` holds global styles.
- `content/` - all portfolio copy. Nothing user-facing is hardcoded into components.
- `components/` - reusable UI components.
- `lib/` - helpers and shared logic that is not a React component.
- `public/` - static assets served at the site root.
- `AGENTS.md` - rules for agents and contributors working in this repo.
- `BUILDLOG.md` - dated record of significant build decisions.
