// Minnesota DNR survey data — the contract the per-lake fish-species spoke renders.
//
// ─────────────────────────────────────────────────────────────────────────────
// DEV HANDOFF — how to wire real DNR data on omniafishing.com
// ─────────────────────────────────────────────────────────────────────────────
// The lake metadata + ranking lives in the AUTO-GENERATED lib/aeo/mn-lakes.ts
// (name, slug, centroid, reports, favorites, score). DO NOT hand-edit that file.
// DNR survey data is JOINED BY SLUG here so the two sources stay independent.
//
// To go live:
//   1. Replace DNR_BY_SLUG with your real DNR data source — a CMS collection, a
//      lakes/{slug}/dnr.json feed, or a DB query. Keep the join key = the Omnia
//      waterbody `slug` used everywhere else (map, shop, patterns).
//   2. Map your DNR fields onto DnrSpeciesRow / DnrSurvey below. Every metric is
//      OPTIONAL on purpose — not every lake/species has every value; render only
//      what's present (the component already does). Adjust the field set to match
//      Omnia's actual DNR model; this shape mirrors MN DNR survey reports.
//   3. The single illustrative example below (Lake Minnetonka) is CLEARLY MARKED
//      placeholder so the structure renders. Delete it once real data flows; the
//      `isSample` flag drives the visible "sample data" notice.
//   4. speciesParam on each row MUST match the snake_case species vocabulary used
//      by the map/shop/tackle engine (e.g. "largemouth_bass") so the per-species
//      links resolve to the right matched-tackle collection.

export interface DnrSpeciesRow {
  /** Display name, e.g. "Walleye". */
  species: string;
  /** snake_case param — joins to the tackle/shop/map vocabulary ("largemouth_bass"). */
  speciesParam: string;
  // ── DNR survey metrics (all optional — render what exists) ──────────────────
  /** DNR relative-abundance wording or rating, e.g. "Abundant", "Common", or a 1–5. */
  abundanceRating?: string;
  /** Gill-net catch-per-net (walleye, pike, etc.). DEV: map from DNR gill-net CPUE. */
  gillNetCpue?: number;
  /** Trap-net catch-per-net (panfish, bass, crappie). DEV: map from DNR trap-net CPUE. */
  trapNetCpue?: number;
  /** Average length in inches from the survey. */
  avgLengthIn?: number;
  /** Notable/large length in inches (e.g. the survey's max or a quality-size note). */
  maxLengthIn?: number;
}

export interface DnrSurvey {
  /** Year of the most recent DNR survey used. Drives the freshness line. */
  lastSurveyYear?: number;
  /** DNR survey type, e.g. "Standard Survey", "Population Assessment". */
  surveyType?: string;
  /** Lake surface acreage. */
  acreage?: number;
  /** Max depth in feet. */
  maxDepthFt?: number;
  /** Water clarity (Secchi) in feet. */
  waterClarityFt?: number;
  /** Species rows, ordered by prominence (most surveyed/abundant first). */
  species: DnrSpeciesRow[];
  /** Attribution / DNR survey identifier for the source line. */
  source?: string;
  /**
   * true while this is illustrative placeholder data (drives the visible notice).
   * DEV: set false / omit once the row is backed by real DNR data.
   */
  isSample?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// PLACEHOLDER STORE — replace with the real DNR source (see header). The one
// example exists so the fish-species page renders a realistic target structure.
// Numbers here are ILLUSTRATIVE, not real DNR survey results.
// ─────────────────────────────────────────────────────────────────────────────
export const DNR_BY_SLUG: Record<string, DnrSurvey> = {
  'lake-minnetonka-fishing-reports': {
    lastSurveyYear: 2024,
    surveyType: 'Standard Survey',
    acreage: 14004,
    maxDepthFt: 113,
    waterClarityFt: 9,
    source: 'MN DNR LakeFinder (illustrative)',
    isSample: true,
    species: [
      { species: 'Walleye', speciesParam: 'walleye', abundanceRating: 'Common', gillNetCpue: 4.2, avgLengthIn: 15.1, maxLengthIn: 27 },
      { species: 'Largemouth Bass', speciesParam: 'largemouth_bass', abundanceRating: 'Abundant', trapNetCpue: 6.8, avgLengthIn: 13.4, maxLengthIn: 21 },
      { species: 'Northern Pike', speciesParam: 'northern_pike', abundanceRating: 'Common', gillNetCpue: 5.6, avgLengthIn: 21.2, maxLengthIn: 38 },
      { species: 'Bluegill', speciesParam: 'bluegill', abundanceRating: 'Abundant', trapNetCpue: 22.4, avgLengthIn: 6.8, maxLengthIn: 9 },
      { species: 'Black Crappie', speciesParam: 'crappie', abundanceRating: 'Common', trapNetCpue: 5.1, avgLengthIn: 8.9, maxLengthIn: 13 },
      { species: 'Muskellunge', speciesParam: 'muskie', abundanceRating: 'Present', gillNetCpue: 0.4, avgLengthIn: 38.0, maxLengthIn: 52 },
    ],
  },
};

/** DNR survey for a lake, or undefined until the dev wires real data for it. */
export function getDnr(slug: string): DnrSurvey | undefined {
  return DNR_BY_SLUG[slug];
}
