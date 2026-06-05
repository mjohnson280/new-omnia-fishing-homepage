# Minnesota Hub + DNR Fish-Species — Dev Handoff

Goal: out-rank DNR-only directories (e.g. minnesotafishing.guide) for Minnesota
fishing queries by pairing the **same DNR survey data** with **Omnia angler activity**
and matched tackle, in the hub-and-spoke AEO structure.

## What's built

| Piece | Route / file | Status |
| --- | --- | --- |
| MN hub (directory) | `/a/best-fishing-lakes-minnesota` | **Real data** — all 500 lakes |
| 500-lake dataset | `lib/aeo/mn-lakes.ts` | **Auto-generated** from the TSV export — do not hand-edit |
| Directory UI | `components/aeo/MnLakeBrowser.tsx` | Server-rendered list + client search/sort |
| DNR contract | `lib/aeo/dnr.ts` | **Shape defined**, 1 illustrative example — populate this |
| Fish-species spoke | `/w/[slug]/fish-species` | Structure built; renders DNR when present, pending state otherwise |
| Spoke UI | `components/aeo/FishSpeciesSurvey.tsx` | Answer block + DNR table fused with Omnia activity |

## The two data sources, joined by slug

```
lib/aeo/mn-lakes.ts   (AUTO-GENERATED)        lib/aeo/dnr.ts   (DEV-OWNED)
  name, slug, lat/lng,                          DnrSurvey keyed by slug:
  reports, favorites, score        ── slug ──▶    species[], abundance, CPUE,
  (the ranking + map links)                       length, survey year, acreage…
```

Keep them separate: re-importing the TSV regenerates `mn-lakes.ts` without touching
DNR data, and DNR data updates without regenerating the lake list.

## To wire real DNR data (the one thing left)

1. **Replace `DNR_BY_SLUG`** in `lib/aeo/dnr.ts` with your real DNR source (CMS
   collection, `lakes/{slug}/dnr.json`, or a DB query), keyed by the Omnia
   waterbody `slug`. Delete the illustrative Lake Minnetonka example.
2. **Map your fields onto `DnrSpeciesRow` / `DnrSurvey`.** Every metric is optional;
   the table renders only what's present. Adjust the field set to Omnia's real DNR
   model — the shape mirrors MN DNR survey reports (abundance, gill/trap-net CPUE,
   avg/max length, survey year, acreage, clarity).
3. **`speciesParam` must be snake_case** matching the map/shop/tackle vocabulary
   (`largemouth_bass`), so each row's "Baits ↗" link resolves to the right matched-
   tackle collection (`/shop/lake/{slug}/{speciesParam}`).
4. **Drop the `noindex`** on the fish-species page and the MN hub on prod, and set
   `lib/aeo/links.ts` `PROD_BASE=''` (same-origin links). Canonicals already point
   at production.
5. **Generate fish-species params** from the full waterbody set on prod (the
   prototype prebuilds only the top 8 + renders the rest on demand).

When DNR data is absent for a lake, the spoke shows an explicit "DNR survey data
coming soon" state — so it's safe to ship incrementally as lakes are populated.

## Why this beats DNR-only directories

- **Same DNR data** (species, abundance, size) in a clean indexable table + answer
  block — what they rank for.
- **Plus Omnia signal** they structurally can't have: report volume, favorites, and
  matched tackle ("what's biting and what to throw"), all from one engine
  (`getMatchedTackle`, see `docs/matched-tackle-and-nl-portal.md`).
- **Hub + spoke:** the 500-lake hub competes for "best lakes to fish in Minnesota";
  each `/w/{slug}/fish-species` page competes for "what fish are in {lake}".
