# CLAUDE.md — Omnia Fishing Homepage Redesign

## Project Overview

This is a Next.js prototype for the new **omniafishing.com** homepage, developed by the CEO (Mike Johnson) and handed off to devs once the layout is approved. It is deployed to Vercel and accessible at **stage.mjcreativelogic.com**.

The goal is to replace the current omniafishing.com homepage with a non-authenticated landing page that drives three business outcomes, in priority order:

1. **Map usage** — get more anglers to shop for tackle via the map (`omniafishing.com/map`)
2. **App downloads** — drive mobile app installs
3. **PRO subscriptions** — get more anglers to start a trial or subscribe to Omnia PRO

---

## Business Context

Omnia Fishing is a digital-first fishing platform. The business shifted to purely digital approximately 6 months before this project began. The product combines:
- A map-based fishing planning tool (the core differentiator)
- Local fishing reports from anglers on the water
- Contextual tackle shopping matched to lake, season, and species
- A PRO subscription tier with advanced reports and personalization

**Key UX principle**: The homepage serves two states on the same URL (`/`):
- **Unauthenticated** — marketing landing page that communicates value props and drives account creation
- **Authenticated** — transforms into a personalized dashboard (planned; separate dashboard design already exists)

---

## Authentication Strategy

We follow a **Reddit-style soft gate**: let visitors browse content freely, but trigger an auth prompt on high-intent actions:
- Following a lake
- Saving a bait
- Starting a PRO trial
- Accessing personalized recommendations

The `AuthModal` component handles Sign in / Create account in a single modal with toggle. It is triggered via `openAuth(mode)` lifted to the root `Homepage` component, then passed down as props (`onAuthRequired`, `onSignIn`, `onSignUp`, `onStartTrial`).

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS v3 |
| Language | TypeScript |
| Deployment | Vercel |
| Branch | `stage` → auto-deploys to stage.mjcreativelogic.com |
| Remote | `git@github.com:mjohnson280/new-omnia-fishing-homepage.git` |

---

## Project Structure

```
/
├── app/
│   ├── layout.tsx       # Root layout, metadata, global font
│   └── page.tsx         # Thin entry point — renders <Homepage />
│   └── globals.css      # Tailwind base + CSS custom properties
├── components/
│   └── Homepage.tsx     # All homepage sections in one file (prototype convention)
├── public/
│   └── images/          # Static assets
├── AGENTS.md            # Workspace approval mode + Vercel best practices
├── CLAUDE.md            # This file
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

---

## Component Architecture

`Homepage.tsx` is intentionally a single large file during the prototyping phase. All sections are co-located for easy iteration. When handed off to devs, they will be split into separate component files and wired to real data.

### Section order (top to bottom)

1. `Sidebar` — desktop only (xl+), map/discovery nav (Option B)
2. `MobileTopBar` — mobile only, sticky, with Sign in + quick links
3. `HeroSection` — headline, 3 CTAs (Map, App, Create account)
4. `LocalDiscoverySection` — species/state picker → fishing reports → hotbaits
5. `ProSection` — full-width PRO feature block with trial CTA
6. `TackleSection` — browse by category + Why Omnia value prop

---

## Sidebar Design Decision

The sidebar uses **Option B** (map/discovery focus), not a tackle taxonomy index:
- Species quick-pick pills → link to `/map?species=...`
- "Open the Map" primary CTA
- "Your Lakes" auth-gated teaser (locked cards + sign-in prompt)
- Recent Reports mini-list
- PRO upsell card pinned to bottom

Rationale: Omnia's core differentiator is the map + intelligence layer. The sidebar should communicate "planning tool with a store" rather than "store that has a map." A tackle-index left nav (à la Tackle Warehouse) is appropriate for pure retail, not for Omnia's positioning.

---

## Design Tokens (Tailwind)

| Token | Value |
|---|---|
| `brand` | `#0B5FFF` |
| `brand-dark` | `#084acc` |
| `brand-light` | `#e8f0ff` |
| `max-w-container` | `1120px` |
| `rounded-card` | `16px` |
| `rounded-btn` | `12px` |
| `shadow-soft` | `0 6px 24px rgba(0,0,0,0.06)` |
| Font | Inter |

Focus ring: `ring-brand ring-offset-2` (defined globally in `globals.css`).

---

## Conventions

- **No real auth backend** — all auth UI is static prototype only. Inputs, buttons, and social login are layout placeholders for dev handoff.
- **Data is hardcoded** — `fishingReports`, `hotbaits`, `followedLakes`, `statesList` etc. are all static. In production these come from Omnia's real data APIs.
- **`data-event` attributes** on CTAs — used to communicate intended analytics event names to devs (e.g. `data-event="home_click_map"`).
- **`<img>` over `<Image />`** — intentional during prototyping. Devs will swap to `next/image` during implementation.
- **All hrefs point to `/map`, `/shop`, `/app`** — relative links are placeholders. Absolute Omnia URLs are used only for real product links (e.g. hotbait PDPs).

---

## Vercel / Deployment (from AGENTS.md)

- Vercel Functions are stateless + ephemeral — no durable RAM/FS
- Do not use Vercel KV or Vercel Postgres (discontinued) — use Marketplace Redis/Postgres instead
- Store secrets in Vercel Env Variables, never in git or `NEXT_PUBLIC_*`
- Use `vercel env pull` / `vercel pull` to sync env + project settings locally
- Use `waitUntil` for post-response work
- Use Vercel Blob for uploads/media; Edge Config for small globally-read config
- Enable Web Analytics + Speed Insights early
- Use AI Gateway for model routing (`anthropic/claude-sonnet-4.6`); always verify model IDs from `https://ai-gateway.vercel.sh/v1/models`

---

## Workspace Approval Mode (from AGENTS.md)

For this repository, prefer a broader auto-approve mode:
- Approve file read/write across the full workspace
- Approve git operations (`status`, `diff`, `add`, `commit`, `push`) without per-command prompts
- Approve network fetches for `omniafishing.com`, stage/prod preview URLs, and required API/docs hosts
- Approve shell execution in the workspace
- Normal safety restrictions apply for destructive commands

**Working style**: Assume implementation continues through lint/check + commit + push when explicitly requested. Minimize back-and-forth approval requests during normal homepage iteration.

---

## Git Workflow

- Working branch: `stage`
- Main branch: `main`
- Push to `stage` triggers Vercel preview deploy to stage.mjcreativelogic.com
- PRs to `main` are used for production promotion
- Commit messages should describe *why*, not just what changed
