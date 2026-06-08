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
│   ├── layout.tsx                              # Root layout, metadata, global font
│   ├── page.tsx                                # Thin entry point — renders <Homepage />
│   ├── globals.css                             # Tailwind base + CSS custom properties
│   ├── sitemap.ts                              # AEO: national + MN hub + 20 guide entries
│   ├── llms.txt/route.ts                       # AEO: /llms.txt hub + lake index
│   ├── a/best-fishing-lakes-2026/page.tsx      # AEO: Top Fishing Lakes hub (national, multi-species)
│   ├── a/best-fishing-lakes-minnesota/page.tsx # AEO: MN hub — 500-lake directory (vs minnesotafishing.guide)
│   ├── w/[slug]/fishing-patterns/page.tsx      # AEO: 20 lake guide pages (SSG)
│   ├── w/[slug]/fish-species/page.tsx          # AEO: per-lake DNR fish-species spoke
│   ├── shop/lake/[slug]/[species]/page.tsx     # Contextual-commerce collection (matched tackle)
│   ├── tackle/page.tsx                         # Natural-language tackle portal
│   └── api/matched-tackle/route.ts             # Headless matched-tackle endpoint
├── components/
│   ├── Homepage.tsx                            # All homepage sections in one file (prototype convention)
│   └── aeo/                                    # ui, Chrome, MatchedTackle, TacklePortal, MnLakeBrowser, FishSpeciesSurvey
├── lib/
│   └── aeo/                                    # data, patterns, schema, links, format, types, tackle, centroid, dnr, mn-lakes
├── docs/
│   ├── aeo-lake-content-system.md              # AEO hub+guides handoff
│   ├── matched-tackle-and-nl-portal.md         # Matched-tackle engine + NL portal handoff
│   ├── mn-fishing-and-dnr.md                   # MN hub + DNR spoke handoff
│   └── lake-centroid-tool.md                   # slug→centroid→map deep-link tool
├── public/
│   └── images/                                 # Static assets
├── AGENTS.md                               # Workspace approval mode + Vercel best practices
├── CLAUDE.md                               # This file
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

## AEO Lake Content System

A hub-and-spoke content system (implements `omnia-lake-aeo-build-spec.md`) that
makes Omnia the cited answer for lake-specific fishing-strategy queries in answer
engines (Google AI Overviews/AI Mode, ChatGPT, Perplexity, Gemini) and routes that
traffic to lake guides, the map, and PRO. Built in this repo, handed off to devs to
deploy on omniafishing.com.

- **Hub** `/a/best-fishing-lakes-2026` — "Top Fishing Lakes in America": ranked
  20-lake list of the most active waters by Omnia report/favorites volume across all
  species (`ItemList` + `FAQPage` JSON-LD), methodology, map CTA.
- **Lake guides** `/w/{slug}/fishing-patterns` — server-rendered **answer block**
  above each detail table (the core AEO unit), season/species sections with stable
  anchors (`#summer-smallmouth-bass`), pattern summary, sibling-lake internal links,
  map CTA, FAQ. `Article` + `Dataset` + `FAQPage` + `BreadcrumbList` JSON-LD. All 20
  prerender as static HTML so indexable content is in the initial response.
- **Code:** `lib/aeo/` (data + helpers), `components/aeo/` (UI), routes under `app/`.
- **Full handoff:** `docs/aeo-lake-content-system.md`.

**Key invariants (don't break):**
- Every answer block must be server-rendered prose, above its table, with a stable
  `anchorId` that is never regenerated. Expanders use native `<details>` so detail
  tables stay in the DOM/crawlable when collapsed.
- All JSON-LD URLs and `<link rel="canonical">` point to production
  (`www.omniafishing.com`), regardless of where deployed.
- **Prototype is `noindex`** (both page templates) so mjcreativelogic.com never
  competes with the real Omnia pages. Devs remove the `robots` noindex on prod.

**Data status:** only **Mille Lacs** has real worked-example data
(`dataStatus: 'reference'`). The other 19 use illustrative templates in
`lib/aeo/patterns.ts` (`dataStatus: 'sample'`) and render a visible "prototype note";
the synthesis pipeline replaces these in production. Product links (map/shop/PRO) use
`PROD_BASE` in `lib/aeo/links.ts` — set to `''` for same-origin links on prod.

---

## Matched-Tackle Engine + NL Portal

Omnia's "rank techniques, sort baits by report mentions on the lake" engine — today
buried in the map app — modeled as a single **shared headless service** so every
surface renders the same result (no forked ranking). Full handoff:
`docs/matched-tackle-and-nl-portal.md`.

- **Engine** `lib/aeo/tackle.ts` — `getMatchedTackle()` single source of truth (mock
  catalog + deterministic report-mentions now; wire to the real recommendation API).
  `parseTackleQuery()` is a deterministic NL stand-in (prod: LLM via Vercel AI Gateway).
- **Contract** `/api/matched-tackle` — structured params or free-text `q=`.
- **Renderer** `components/aeo/MatchedTackle.tsx` — props-only, used in every surface.
- **Surfaces:** shop collection `/shop/lake/{slug}/{species}` (indexable, `Product`/
  `ItemList` JSON-LD), inline compact embed in the AEO answer blocks, and the NL
  portal `/tackle`. `shopBaitsUrl` targets the collection; `mapTechniquesUrl`
  deep-links the map's `top_techniques` tab.
- **Param vocabulary matches Omnia's live map URLs:** snake_case `species`
  (`largemouth_bass`), lowercase `season_group`, kebab `waterbody_slug`.
- **Centroid tool** `lib/aeo/centroid.ts` (+ `docs/lake-centroid-tool.md`): slug →
  basin centroid → canonical map deep-link, for 3rd parties. NOTE: the data.ts
  coordinates were hand-seeded, not geocoded; the MN dataset has real centroids.

## Minnesota Hub + DNR Spoke

State-scoped sibling of the national hub, built to out-rank DNR-only directories
(minnesotafishing.guide). Full handoff: `docs/mn-fishing-and-dnr.md`.

- **Hub** `/a/best-fishing-lakes-minnesota` — **BASS-FOCUSED** (Omnia's focus), redesigned
  2026-06-08 away from a flat 500-row table toward citable content. Leads with
  **"Best Largemouth/Smallmouth Bass Lakes in Minnesota"** ranked sections
  (`components/aeo/MnSpeciesRanking.tsx` + `lib/aeo/mn-species.ts`) — the AEO unit that
  answers real queries with quotable passages — then a server-rendered **top-50 most
  active** list, an "other species → map" strip, methodology + FAQ. **Favorites are no
  longer displayed anywhere** (internal signal; still feeds the score). The full 500-lake
  searchable directory (`MnLakeBrowser.tsx`) moved to the linked sub-page
  **`/a/best-fishing-lakes-minnesota/all-lakes`**.
- **Species rankings are reusable:** `<MnSpeciesRankings rankings={...}>` is config-driven,
  so a future `/a/best-walleye-lakes-minnesota` is the same component fed a walleye config
  — no forked layout. The MN hub instantiates it with `MN_BASS_RANKINGS`. The bass picks
  are CURATED from well-known MN bass waters (`isSample`), not yet DNR-verified; report
  counts + centroids are real (joined from `MN_LAKES` by slug).
- **Data** `lib/aeo/mn-lakes.ts` — **AUTO-GENERATED** from the MN top-500 TSV export
  (name, slug, real centroid, reports, favorites, score). Do not hand-edit; re-import
  to refresh.
- **DNR spoke** `/w/{slug}/fish-species` (`components/aeo/FishSpeciesSurvey.tsx`) —
  answer block + structured DNR survey table fused with Omnia activity. Renders DNR
  when present, an explicit "coming soon" state otherwise.
- **DNR contract** `lib/aeo/dnr.ts` — `DnrSurvey`/`DnrSpeciesRow`, **joined to lake
  metadata by slug** so generated + DNR data stay independent. Currently ONE
  illustrative example (Lake Minnetonka, `isSample`); dev replaces `DNR_BY_SLUG` with
  the real DNR source.

**AEO question — partially resolved 2026-06-08 (Matt's call):** *Has the MN work
helped AEO?* Diagnosis confirmed: the flat 500-lake directory ranked for *navigation*,
but answer engines cite *substantive passages*. **Action taken:** redesigned the hub
around citable content — the **"Best [species] Bass Lakes in Minnesota" ranked sections
with per-lake blurbs** are now the lead AEO unit (addresses (c)); the full directory was
demoted to the `/all-lakes` sub-page; top-50 + species lists link to the fish-species
spokes (addresses (b)). **Still open:** (a) do Omnia's existing prod
`/w/{slug}/fish-species` pages already hold DNR data — if so RESTRUCTURE, don't rebuild
(still pending dev input #2); (d) how to MEASURE AEO lift (AI-overview citations,
referral traffic, indexed spokes). The deeper AEO payoff remains **gated on populating
the spokes with real DNR + report data**. See the session log memory.

## Pending dev inputs (blocking production lift)

1. ~~**Is the tackle matcher a headless API or locked in the map client?**~~
   **RESOLVED (Matt, 2026-06-08): it's headless** — already serves the map *and* the
   legacy lake pages, "wide open for use." So lifting matched-tackle to prod is
   **wiring, not extraction.** Two specifics still pending the engineer (Matt's eng
   call): (Q1) the exact endpoint/resolver name to call, and (Q2) whether the response
   already includes the report-mention bait sort or the client does it. Stubbed in
   `docs/matched-tackle-and-nl-portal.md` until answered.
2. **A sample of the real DNR fields** per lake (which metrics: CPUE? abundance
   rating? lengths? survey year?) — to align `DnrSurvey` to Omnia's real DNR model.
3. ~~**Which branch the demo URL deploys from**~~ **RESOLVED (Matt, 2026-06-08): keep
   pushing directly to `main`; no stage sync needed.** (Matches the direct-push-to-main
   note in the Git Workflow section.)

---

## Git Workflow

- Working branch: `stage`
- Main branch: `main`
- Push to `stage` triggers Vercel preview deploy to stage.mjcreativelogic.com
- PRs to `main` are used for production promotion
- Commit messages should describe *why*, not just what changed

> **Note (this dev environment):** Mike has asked to push directly to `main`
> (skipping the stage→PR promotion) when working in this sandbox. Honor that when
> stated; the documented stage→PR flow is the default elsewhere.
