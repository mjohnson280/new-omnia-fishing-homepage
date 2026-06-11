# AEO Canonical SOP — How Omnia Becomes the Cited Authority for Lakes & States

**Audience:** Omnia devs + external content partners (e.g. a Tackle Warehouse or
Wired2Fish building lake content off Omnia data).
**Purpose:** one repeatable structure that makes Omnia the answer-engine citation for
*"where, when, how, and what to fish"* on any lake — and that any partner can scale to
thousands of waters without forking the layout.

This is the playbook. The implementation handoffs it points at:
`aeo-lake-content-system.md` (hub + guides), `matched-tackle-and-nl-portal.md` (the
technique→bait engine), `mn-fishing-and-dnr.md` (state hub + DNR spoke),
`lake-centroid-tool.md` (slug→map deep-link).

---

## 0. The one-paragraph version

A user (or an answer engine) asks *"what baits and how should I fish Lake
Minnetonka?"* We answer it with **server-rendered, citable prose** on canonical pages,
and route the click into the map + shop. Every lake gets the **same four canonical
destinations**, cross-linked the same way, with the same structured data. The map is
*not* a canonical answer surface — it's the interactive experience users get *after*
discovery. The indexable answer lives in the **patterns guide** and the **shop
collection**, both powered by the **same ranked-technique engine**.

---

## 1. The core principle: lake-first structure, swappable editorial lens

- **Structure is always lake-first.** Hubs rank lakes by **all-site activity**
  (report + favorites volume across every species — species-agnostic). The ranking
  input never changes between hubs.
- **Editorial focus is a layer on top.** An article can read multi-species (the
  national hub) or single-species (the Minnesota hub reads *bass-focused*, because
  that's where the reports concentrate today) **without re-ordering the lakes**.
  Focus drives the headline, intro/answer prose, and per-lake blurbs — not the rank.
- **One component, config-driven.** The lake list/card is shared. It takes an optional
  `focus` config (`{ species, blurbBy(lake) }`). National passes none; Minnesota
  passes bass. A future "Best Walleye Waters" article is the same component with a
  walleye lens — never a forked layout.

> This is the harmony rule: **same skeleton everywhere; only the lens changes.**

---

## 2. The canonical URL taxonomy

All canonical/JSON-LD URLs use the production origin `https://www.omniafishing.com`.
Lake slugs carry the prod convention suffix `-fishing-reports`
(e.g. `lake-minnetonka-fishing-reports`).

### 2.1 Hubs (the discovery + citation entry points)

| Hub | Path | Ranking | Lens |
| --- | --- | --- | --- |
| National | `/a/best-fishing-lakes-2026` | all-site activity, US-wide | multi-species |
| State | `/a/best-fishing-lakes-{state}` | all-site activity, state-scoped | per-article (MN = bass) |
| State directory (long tail) | `/a/best-fishing-lakes-{state}/all-lakes` | full searchable list | — |

Add a state by adding one hub path constant — same component, new data slice + lens.

### 2.2 Per-lake destination cluster (the four canonical destinations)

Every lake, on every hub, links to the **same four destinations in this priority
order**:

| # | Intent | Canonical URL | Indexable? | Helper |
| --- | --- | --- | --- | --- |
| 1 (lead) | **How / when** to fish | `/w/{slug}/fishing-patterns` | ✅ the AEO unit | `guidePath()` |
| 2 | **What's in it** (DNR + species) | `/w/{slug}/fish-species` | ✅ | `lakeTabUrl(slug,'fish-species')` |
| 3 | **Where** (map) | `/map?lat={lat}&lng={lng}&waterbody_slug={slug}&zoom={z}` | ❌ post-discovery UX | `mapDeepLink()` |
| 4 | **What to fish with** | `/shop/lake/{slug}/{species}?...` | ✅ (when API live) | `shopBaitsUrl()` |

Sibling lake tabs that already exist on prod and round out the cluster:
`/w/{slug}/fishing-reports`, `/w/{slug}/boat-ramps`.

### 2.3 Param vocabulary (must match the live map exactly)

- `species` — snake_case: `largemouth_bass`, `smallmouth_bass`, `walleye`
- `season_group` — lowercase: `spring` | `summer` | `fall` | `winter`
- `waterbody_slug` — kebab, with the `-fishing-reports` suffix
- `technique` — canonical snake_case slug, **shared between the map and the shop
  facet taxonomy** (`drop_shot`, `ned_rig`, `jig`, …)
- `zoom` — overview `10`, technique/tight view `12`

Rule: links emit `technique`/`color` **only** when the source carries a canonical tag.
Never kebab free-text prose into a facet that matches nothing. The store must **ignore
unknown params and progressively relax** to `(waterbody_slug + species)` rather than
ever return zero results.

---

## 3. The technique→bait ranking — the spine that answers "how + what"

This is the asset that makes Omnia citable where DNR-only sites can't be. It is the
**same data, surfaced two ways**:

```
(lake, season, species)
   └─► techniques ranked 1..n          ← "HOW to fish it"  (prose in the patterns guide)
         └─► baits sorted by reportMentions on THIS waterbody   ← "WHAT to throw"  (shop collection)
```

**Technique is the join key.** It's the link between the *how* (patterns) and the
*what* (shop), and it's the shop's primary **sort/filter axis**. A top-ranked technique
for a lake+season+species is both a sentence in the guide and a sortable section in the
store.

### 3.1 The engine contract (single source of truth)

One headless resolver serves the map's `top_techniques` tab, the shop collection, the
guide answer block, and the NL portal — so no surface forks the ranking.

```ts
getMatchedTackle({ waterbodySlug, species, seasonGroup }) -> {
  context: { waterbodySlug, lakeName, species, speciesParam, seasonGroup,
             source: 'pattern' | 'species-default' },
  techniques: [{
    slug,            // canonical snake_case, shared with shop facet taxonomy
    label,
    rank,            // 1 = top technique for this (lake, season, species)
    products: [{ id, name, brand, priceUsd, productUrl,
                 reportMentions /* mentions in reports for THIS waterbody — the sort key */ }]
  }]
}
```

Prototype uses a mock catalog + deterministic mentions in `lib/aeo/tackle.ts`. In
production this is a thin wrapper over Omnia's real recommendation API.

### 3.2 Where each surface puts it

| Surface | Role | Indexable |
| --- | --- | --- |
| `/w/{slug}/fishing-patterns` answer block | "On Minnetonka in summer, the top smallmouth technique is the drop shot…" — server-rendered prose, the citation target | ✅ |
| `/shop/lake/{slug}/{species}` | shoppable list, **sorted by technique then report-mentions**, filterable by species/season; `Product` + `ItemList` JSON-LD | ✅ (gate until API live) |
| `/map?tab=top_techniques&...` | the **interactive** version users explore after discovery | ❌ (not a canonical answer) |
| `/tackle` NL portal | parses "what should I throw on Minnetonka?" → the same result | ✅ entry |

---

## 4. Structured-data requirements per page type

Non-negotiable; this is what gets us cited.

| Page | JSON-LD | Must server-render |
| --- | --- | --- |
| Hub | `ItemList` + `FAQPage` + `BreadcrumbList` | ranked lake list, methodology, FAQ |
| Lake guide (`fishing-patterns`) | `Article` + `Dataset` + `FAQPage` + `BreadcrumbList` | **answer block above the table**, season/species sections with stable anchors (`#summer-smallmouth-bass`), top-technique prose, sibling-lake links, map + shop CTA, FAQ |
| Fish-species spoke | answer block + structured DNR species/abundance/size table fused with Omnia activity | answer block + table |
| Shop collection | `Product` + `ItemList` | technique-sorted, report-ranked baits |

Invariants (do not break):

- Answer blocks are **server-rendered prose, above the table**, with a **stable
  `anchorId` that is never regenerated**.
- Expanders use native `<details>` so tables stay in the DOM/crawlable when collapsed.
- All canonical + JSON-LD URLs point to production regardless of where deployed.
- The map URL is never a `<link rel=canonical>` target — it isn't an answer surface.

---

## 5. The self-service "page kit" (for partners + automated generation)

So a partner (Tackle Warehouse, Wired2Fish) or an internal batch job can generate the
full canonical page set for any lake from a single input — **no layout work, no forked
ranking.**

### 5.1 Input

```json
{
  "slug": "lake-minnetonka-fishing-reports",   // required
  "centroid": { "lat": 44.929, "lng": -93.552 },// optional; else resolved from waterbody table
  "focus": { "species": "largemouth_bass" },    // optional editorial lens; omit for multi-species
  "blurbs": { "<lake-slug>": "…" }              // optional partner-supplied editorial prose
}
```

### 5.2 Output (the canonical cluster, generated)

1. `fishing-patterns` guide — answer block (from `getMatchedTackle` + pattern
   synthesis), anchors, FAQ, `Article`+`Dataset`+`FAQPage`+`BreadcrumbList`.
2. `fish-species` spoke — DNR table fused with Omnia activity (when DNR present).
3. `map` deep-link — from the centroid (`mapDeepLink`), the post-discovery handoff.
4. `shop/lake/{slug}/{species}` — technique-ranked baits (gated on API).
5. Cross-links wiring all four together + the hub backlink.

### 5.3 Contract surfaces the kit calls (already modeled in this repo)

- `getMatchedTackle()` — the ranking engine (§3).
- `mapDeepLink()` / centroid tool — slug → canonical map URL.
- `guidePath()`, `lakeTabUrl()`, `shopBaitsUrl()`, `mapTechniquesUrl()` — URL helpers
  (`lib/aeo/links.ts`); the single source of truth for every URL shape.

A partner integration is therefore: *feed a lake list → receive the canonical page set
+ JSON-LD.* The same generator powers Omnia's own batch publishing.

---

## 6. Go-live checklist (per the lake-content handoff)

1. `PROD_BASE = ''` in `lib/aeo/links.ts` (same-origin links on omniafishing.com).
2. Remove `robots: { index: false }` from the page templates (noindex only in the
   prototype so mjcreativelogic.com never competes with prod).
3. Replace `lib/aeo/data.ts` / `patterns.ts` with the report→pattern synthesis output.
4. Join `slug` → waterbody table for real centroids.
5. **Merge, don't replace** existing live `/w/{slug}/*` pages — this is a retrofit.
6. Wire `getMatchedTackle()` to the real recommendation API, then un-gate the shop
   links (§2.2 #4) and the shop JSON-LD.

---

## 7. What "canonical" means when you communicate this externally

When you tell a partner *"build on our canonical structure,"* you mean exactly:

- Lake-first, ranked by all-site activity; editorial lens optional.
- The four destinations, in priority order, cross-linked, with the required JSON-LD.
- The shared param vocabulary (§2.3) so links resolve against the live map + shop.
- The technique→bait ranking as the answer to "how + what," surfaced as prose +
  shoppable list — never as a bare map link.

If a page follows §1–§4, it is a canonical Omnia AEO page. If it doesn't, it isn't —
that's the whole bar, and it's the thing that scales.
