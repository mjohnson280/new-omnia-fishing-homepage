# AEO Lake Content System — Dev Handoff (quick reference)

> **Full handoff doc:** [`docs/aeo-lake-content-system.md`](../../docs/aeo-lake-content-system.md).
> This file is the short, code-adjacent version.

Implementation of `omnia-lake-aeo-build-spec.md`. Built as a self-contained,
server-rendered prototype in the homepage-redesign repo. Lift it into the Omnia
codebase and wire it to real data.

## What's here

| Path | Purpose |
| --- | --- |
| `lib/aeo/types.ts` | `Lake`, `Pattern`, `HubConfig`, `FaqItem` (spec §4) |
| `lib/aeo/data.ts` | 20-lake dataset + hub config. Source of truth in the prototype |
| `lib/aeo/patterns.ts` | Illustrative season×species templates (prototype only) |
| `lib/aeo/format.ts` | Anchor ids, answer-block prose generator (spec §5) |
| `lib/aeo/schema.ts` | JSON-LD builders: Article, Dataset, FAQPage, BreadcrumbList, ItemList (spec §8) |
| `lib/aeo/links.ts` | URL helpers, incl. canonical map deep-link `lakeMapUrl` (spec §9.5) |
| `components/aeo/ui.tsx` | All presentational components (spec §7), server-rendered |
| `components/aeo/Chrome.tsx` | Lightweight header/footer for the prototype pages |
| `app/a/best-fishing-lakes-2026/page.tsx` | Hub (spec §6.1) — "Top Fishing Lakes in America", multi-species |
| `app/w/[slug]/fishing-patterns/page.tsx` | Lake guide (spec §6.2), static for 20 lakes |
| `app/sitemap.ts` | Hub + 20 guide sitemap entries (spec §9.4) |
| `app/llms.txt/route.ts` | `/llms.txt` hub + lake index (spec §9.4) |

## Hard requirements met (spec §0)

1. Answer block above every detail table, server-rendered prose (`AnswerBlock`).
2. All indexable content in the initial HTML — no client injection. Expandable
   detail tables use native `<details>`, so content stays in the DOM when collapsed.
3. Valid JSON-LD on the hub and every lake page (`schema.ts` + `<JsonLd>`).
4. A `/map` CTA on the hub and every lake page (`MapCTA`, spec §9.5).

## Things to change when you ship to omniafishing.com

1. **Base URLs** — `lib/aeo/links.ts`: set `PROD_BASE = ''` so every product link
   (`/map`, `/shop`, `/pro`) is same-origin relative. `CANONICAL_BASE` already
   points at `https://www.omniafishing.com`.
2. **Indexing** — the prototype sets `robots: { index: false }` and a canonical to
   production on both page templates (hub `page.tsx`, guide `page.tsx`) so the
   mjcreativelogic.com copy never competes with the real pages. **Remove the
   `robots` noindex** when this is the production page.
3. **Real data** — replace `lib/aeo/data.ts` + `lib/aeo/patterns.ts` with output
   from the report→pattern synthesis pipeline (spec §4, §13). Only Mille Lacs
   carries real worked-example data today; the other 19 use generic templates and
   render a "prototype note" via `SampleDataNotice`. Drop that notice once data is real.
4. **Coordinates** — `Lake.coordinates` are approximate seeds (spec §11). Resolve
   the authoritative centroid from the waterbody table by `slug` at build/request
   time before passing into `lakeMapUrl` (spec §9.5). Large waters (Erie, Michigan,
   St. Lawrence) carry a `zoom: 8` override; tune per-lake as needed.
5. **Existing guides** — these 20 `/w/{slug}/fishing-patterns` pages already exist
   live; this is a retrofit. Merge the answer blocks, FAQ schema, freshness line,
   `TopActiveLakes`, and `MapCTA` into the existing template rather than replacing it.
6. **PRO gating** — `Pattern.isPro` gates the live-data row only; the free answer
   block always fully answers the question (spec §10). Confirm the exact free-vs-gated
   line and current PRO price.
