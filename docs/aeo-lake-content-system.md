# AEO Lake Content System — Dev Handoff

**Status:** Prototype, built and deployed in the homepage-redesign repo
(stage.mjcreativelogic.com / production main).
**Spec:** implements `omnia-lake-aeo-build-spec.md`.
**Goal:** make Omnia the cited answer for lake-specific fishing-strategy queries in
answer engines (Google AI Overviews/AI Mode, ChatGPT, Perplexity, Gemini) and route
that traffic to lake guides, the map, and PRO.

This document is the single source of truth for lifting the system into the Omnia
codebase. A shorter copy lives at `lib/aeo/README.md` next to the code.

---

## 1. TL;DR — what a dev must do to ship this

1. **Set `PROD_BASE = ''`** in `lib/aeo/links.ts` so product links (`/map`, `/shop`,
   `/pro`) are same-origin relative on omniafishing.com.
2. **Remove `robots: { index: false }`** from both page templates (hub + guide) so
   the production pages actually index. (They are noindex in the prototype on
   purpose — see §6.)
3. **Replace the data** in `lib/aeo/data.ts` + `lib/aeo/patterns.ts` with output from
   the report→pattern synthesis pipeline. Only Mille Lacs has real data today.
4. **Resolve real coordinates** by joining `slug` → waterbody table (the values in
   the data file are approximate seeds; see §5).
5. **Merge, don't replace** the existing live `/w/{slug}/fishing-patterns` pages —
   this is a retrofit (add answer blocks, FAQ schema, freshness line, internal links,
   map CTA to the existing template).
6. **Confirm PRO gating line** (which fields are free vs. PRO) and current PRO price.

Everything else (components, JSON-LD, routing, anchors, sitemap, llms.txt) is built
and validated.

---

## 2. What was built

| Page | Route | Notes |
| --- | --- | --- |
| Bass hub | `/a/best-bass-lakes-2026` | Ranked list of 20 lakes, `ItemList` + `FAQPage` JSON-LD, methodology, map CTA |
| Lake guide | `/w/{slug}/fishing-patterns` | Answer blocks + tables by season/species, `Article` + `Dataset` + `FAQPage` + `BreadcrumbList` JSON-LD. All 20 prerender as static HTML |
| Sitemap | `/sitemap.xml` | Hub + 20 guide URLs (production-canonical) |
| LLM index | `/llms.txt` | Hub + lake index for answer engines |
| Homepage entry | `/` | Hero button + promo-bar entry linking to the hub |

Validated with `tsc --noEmit` (clean), `next lint` (clean apart from the repo's
intentional `<img>` warnings), and `next build` (27 static pages, all 20 guides SSG).

---

## 3. File map

| Path | Purpose | Touch on ship? |
| --- | --- | --- |
| `lib/aeo/types.ts` | `Lake`, `Pattern`, `HubConfig`, `FaqItem` (spec §4) | Keep |
| `lib/aeo/data.ts` | 20-lake dataset + hub config | **Replace with real data** |
| `lib/aeo/patterns.ts` | Illustrative season×species templates | **Delete once data is real** |
| `lib/aeo/format.ts` | Anchor ids, answer-prose generator (spec §5) | Keep |
| `lib/aeo/schema.ts` | JSON-LD builders (spec §8) | Keep |
| `lib/aeo/links.ts` | URL helpers + `lakeMapUrl` (spec §9.5) | **Set `PROD_BASE=''`** |
| `components/aeo/ui.tsx` | All presentational components (spec §7), server-rendered | Keep / restyle |
| `components/aeo/Chrome.tsx` | Prototype header/footer | **Replace with real Omnia chrome** |
| `app/a/best-bass-lakes-2026/page.tsx` | Hub (spec §6.1) | **Drop noindex** |
| `app/w/[slug]/fishing-patterns/page.tsx` | Lake guide (spec §6.2) | **Drop noindex; merge into existing page** |
| `app/sitemap.ts` | Sitemap generation | Merge into main sitemap |
| `app/llms.txt/route.ts` | `/llms.txt` | Keep / merge into root llms.txt |
| `docs/aeo-lake-content-system.md` | This doc | — |

---

## 4. Hard requirements met (spec §0)

1. **Answer block above every detail table**, server-rendered prose — `AnswerBlock`
   in `components/aeo/ui.tsx`. This is the passage answer engines lift.
2. **All indexable content in the initial HTML.** No client injection. The
   "See full pattern" expander is a native `<details>` element, so the detail table
   stays in the DOM (and crawlable) even when collapsed. Verified in the prerendered
   `.html` output.
3. **Valid JSON-LD** on the hub and every lake page via `schema.ts` + the `<JsonLd>`
   component. Run them through Google's Rich Results test before launch.
4. **A `/map` CTA** on the hub and every lake page (`MapCTA`, spec §9.5). Lake pages
   deep-link via `lakeMapUrl`; the hub banner links to plain `/map`.

---

## 5. Data model & data sourcing

The shape is in `lib/aeo/types.ts` (`Lake`, `Pattern`) and mirrors spec §4. Notes:

- **Patterns drive answer blocks.** One `Pattern` = one season-phase × species =
  one answer block with a stable `anchorId` (e.g. `summer-smallmouth-bass`,
  `spring-pre-spawn-smallmouth-bass`). Anchor ids are generated in `format.ts` and
  must **not** be regenerated on rebuild (spec §3) — they are linkable fragments.
- **Answer prose** is generated from `Pattern` fields by `buildAnswerText`
  (spec §5, 40–60 words). A `Pattern` may set `answerOverride` for hand-written copy;
  Mille Lacs uses this for its two worked examples.
- **Coordinates are seeds only.** `Lake.coordinates` are approximate basin centers
  (spec §11). In production, resolve the authoritative centroid from the waterbody
  table by `slug` before passing into `lakeMapUrl` (spec §9.5). Large waters
  (Lake Erie, Lake Michigan, St. Lawrence River) carry a `zoom: 8` override and
  especially must use the DB point.
- **Freshness.** `updatedAt`, `reportCount`, `reportCountTrailing30` render via
  `FreshnessLine` and must stay in sync with `Article.dateModified` (handled in
  `schema.ts`). Keep them genuinely updating as the pipeline ingests reports.

**Today's data:** Mille Lacs = real worked-example data from the spec
(`dataStatus: 'reference'`). The other 19 lakes carry real *metadata* (rank, state,
report counts from spec §11) plus *illustrative* pattern templates
(`dataStatus: 'sample'`) and render a visible "prototype note" (`SampleDataNotice`).
Replace with synthesis output and the notice disappears automatically.

---

## 6. Indexing strategy (why the prototype is noindex)

The prototype lives on **mjcreativelogic.com** but the real AEO target is
**omniafishing.com**. So both page templates set:

- `robots: { index: false, follow: true }` — keeps the prototype out of the index.
- `alternates.canonical` → `https://www.omniafishing.com/...` — points all ranking
  signals at the real page.

This prevents the prototype from competing with or duplicating the eventual Omnia
pages, and prevents the illustrative (non-real) pattern data from being indexed
anywhere. **On omniafishing.com, remove the `robots` noindex** so the real pages
index. The canonical is already correct for production.

---

## 7. PRO gating (spec §10)

Gating must not break AEO: expose the core answer layer, gate the live layer.

- **Always free + indexable:** all answer blocks, core pattern fields (species,
  season, technique, key location/depth, general bait-color family), the ranked hub
  list, and the FAQ.
- **Gated behind PRO** (`Pattern.isPro`): live/near-real-time data (current water
  temp, clarity, wind), Navionics/C-MAP layers, real-time report feeds. Rendered as a
  teaser + `ProUpsell` *below* the always-free answer block, so a citation never
  lands a user on a pure paywall.

In the prototype, summer patterns are flagged `isPro` to demonstrate the teaser.
Confirm the real free-vs-gated line and current PRO price before launch.

---

## 8. URL & linking conventions

- **Internal (hub ↔ guides):** relative Next routes (`/a/...`, `/w/...`) so the
  system is navigable.
- **Product links (map, shop, PRO):** absolute to `www.omniafishing.com` in the
  prototype; set `PROD_BASE=''` to make them relative in the Omnia codebase.
- **Canonical / JSON-LD URLs:** always production (`CANONICAL_BASE`), regardless of
  where deployed.
- **Map deep-link format** (`lakeMapUrl`, spec §9.5):
  `/map?lat={lat}&lng={lng}&waterbody_slug={slug}&zoom={zoom}` (default `zoom=10`).

---

## 9. Inputs still needed from Omnia (spec §13)

1. Validated centroid lat/lng per lake from the waterbody table (+ per-lake `zoom`
   override for large waters if framing needs it).
2. Current PRO price and the exact free-vs-gated line for live data.
3. The synthesis output shape, if it differs from the §4 data model, so the mapping
   can be adjusted.
4. Hub ranking criteria and the public-facing methodology sentence.
5. Brand/component styling tokens (or point at the existing design system) to replace
   the prototype `Chrome` and Tailwind tokens.

---

## 10. Out of scope (spec §14)

- The report→pattern synthesis pipeline (this system consumes its output).
- Checkout/fulfillment (Thorne Bros).
- The map application itself (the CTA links to the existing `/map`).

---

## 11. Future phases (spec §12, not built)

- Sibling species hubs (`/a/best-walleye-lakes-2026`, etc.) reusing the same guides —
  the data model is already species-agnostic.
- A filter/UX layer over the server-rendered patterns.
- A measurement dashboard for citations and referral traffic.
