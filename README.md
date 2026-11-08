# GDGoC UGM Website

A responsive, multi-page website for **Google Developer Groups on Campus UGM**, built for the GDGoC UGM 2026 recruitment study case (Hacker track, Frontend).

The Figma design was sliced into a fully functional Next.js application that consumes the official GDGoC UGM REST API.

## Pages

| Route | What it does |
| --- | --- |
| `/` | Landing page: interactive hero, drifting ribbon, stats, track cards, learning formats, project preview, journey, FAQ and call to action |
| `/about` | The story, mission, values and numbers behind GDGoC UGM |
| `/overview` | Tracks explorer with search, sort, a detail dialog, outcomes, formats and the learning journey |
| `/contact` | Inquiry form with category selection, validation and a saved draft |

## Features

- **API consumption** for navigation, stats, tracks, roles, formats, journey, values, FAQs and inquiry categories, each with **loading (skeletons), error (with retry) and empty states**.
- **Tracks explorer**: search, sort and the open track dialog are stored in the URL (`?q=`, `?sort=`, `?track=`), so any view can be shared as a link and survives a reload.
- **Deep links between pages**: a track card on Home opens `/overview?track=<id>` with the dialog already open, and "Ask about this track" opens the contact form with the matching category preselected.
- **Contact form** with per field validation, a draft that is saved to local storage and a success state.
- **Interactive hero**: a canvas dot grid that reacts to the cursor (tap on mobile) and reveals code like symbols.
- **Motion** with Framer Motion: sliding navbar pill, scroll reveals, a ribbon whose speed and direction follow the scroll, and a count up for the stats. Reduced motion preferences are respected.
- **Scroll aware sub navigation** on the Overview page that highlights the section being read.
- **Responsive layout** from small phones to wide desktops, including a mobile menu.

## Tech stack

- [Next.js](https://nextjs.org/) 16 (App Router, Turbopack) with React 19
- TypeScript (strict)
- [Tailwind CSS](https://tailwindcss.com/) v4
- [Framer Motion](https://www.framer.com/motion/) for animation
- [Lucide](https://lucide.dev/) for icons
- shadcn style components on top of [Radix UI](https://www.radix-ui.com/) primitives (`Dialog`, `Slot`), with `class-variance-authority`, `clsx` and `tailwind-merge`
- Google Sans Flex and Inter through `@fontsource-variable`
- Deployed on [Vercel](https://vercel.com/)

## Getting started

Requirements: Node.js 20 or newer.

```bash
git clone https://github.com/YOUR-USERNAME/gdgoc-ugm.git
cd gdgoc-ugm
npm install
npm run dev
```

Open <http://localhost:3000>.

Other scripts:

```bash
npm run build   # production build
npm start       # serve the production build
npm run lint    # ESLint
```

### Environment variables

Everything is optional. Copy `.env.example` to `.env.local` to change a value.

| Variable | Default | Purpose |
| --- | --- | --- |
| `GDGOC_API_UPSTREAM` | `https://gdgoc-ugm-api.vercel.app/api` | Upstream API used by the rewrite. Read at build time. |
| `NEXT_PUBLIC_API_BASE_URL` | `/gdgoc-api` | Base URL the browser calls. The default goes through the rewrite. |
| `NEXT_PUBLIC_INQUIRY_ENDPOINT` | empty | If set, the contact form POSTs JSON to this URL. |

## Architecture

```
src/
  app/                 Routes (home, about, overview, contact), layout, error and not-found pages
  components/
    layout/            Navbar, footer, providers
    sections/          Page specific sections (hero, tracks explorer, FAQ, contact form, ...)
    shared/            Reusable pieces (data states, reveal, callout, illustrations, logo, ...)
    ui/                Primitive components (button, badge, card, dialog)
  hooks/
    use-api.ts         Data fetching hook with cache, de-duplication and revalidation
    use-draft.ts       Local storage backed draft for the contact form
  lib/
    api.ts             Typed API client, one small function per endpoint
    types.ts           API types
    content.ts         Static copy and mappings
    inquiry.ts         Contact form submission
public/                Logo and illustrations
```

### API layer

All requests go through `lib/api.ts`: one generic `request` function plus a typed function for each endpoint (`getTracks`, `getFaqs`, and so on). Requests are sent to `/gdgoc-api/*` on the site's own origin and forwarded to the real API by a rewrite in `next.config.ts`. This avoids CORS entirely and lets the upstream URL change with a single environment variable.

### Data fetching and state

`hooks/use-api.ts` is a small data fetching layer without extra dependencies. It keeps a shared cache, de-duplicates simultaneous requests, revalidates after five minutes, and exposes `loading`, `error`, `success` and the data. Every list handles the empty case, so no section ever renders a blank area.

State management is intentionally simple:

- local React state for the interface
- URL search parameters for filters, sort and the open dialog
- local storage for the contact draft

## Notes

- The provided API only exposes read only (`GET`) endpoints, so there is nowhere to post an inquiry to. By default the contact form **simulates** the submission, which exercises the full flow (validation, pending state, success and clearing the draft). Set `NEXT_PUBLIC_INQUIRY_ENDPOINT` to send it to a real backend.
- The `GDGOC_API_UPSTREAM` variable is baked in at build time. Changing it requires a rebuild.

## Additional challenges

- Animation and micro interactions with Framer Motion, with reduced motion support.
- Shareable UI state stored in the URL.
- Cached data fetching with request de-duplication.
- Keyboard and screen reader considerations: semantic landmarks, visible focus, accessible dialog and tabs.

## Links

- [**Live Demo**](https://gdgoc-study-case-fe.vercel.app/)
- [**Video Walkthrough**](https://drive.google.com/drive/folders/1NyVwVy2SlSzQhP4J-S-aWIUxIrN1NwVR?usp=sharing)
- [**API**](<https://gdgoc-ugm-api.vercel.app/api>)

## Acknowledgements

This project was built for the GDGoC UGM 2026 recruitment study case.