// Species-scoped lake rankings for the Minnesota hub — the citable AEO unit.
//
// WHY THIS EXISTS: the 500-lake directory ranks for *navigation* ("minnesota lakes
// list"), but answer engines cite substantive *passages* — a ranked answer to a real
// query like "best largemouth bass lakes in Minnesota". This module is that passage,
// as structured data: a short, ranked, blurb-per-lake list per species.
//
// REUSABLE BY DESIGN: a ranking is just `{ species, title, answer, picks[] }`. The MN
// hub renders the BASS rankings below (Omnia's focus). A future
// /a/best-walleye-lakes-minnesota is the SAME <MnSpeciesRankings> component fed a
// walleye config — no new component, no forked layout.
//
// DATA STATUS: the per-species lake picks + blurbs are CURATED from well-known
// Minnesota bass waters (all real lakes that exist in MN_LAKES), marked `isSample`.
// They are plausible but NOT yet verified against DNR survey data. Production replaces
// the `picks` with lakes selected by real per-lake species presence/abundance (DNR)
// blended with Omnia report volume for that species. Report counts + centroids are
// already real (joined from MN_LAKES by slug).

import { getLake } from './data';
import { speciesParam } from './format';
import { MN_LAKES, type MnLake } from './mn-lakes';
import type { LakeCardData } from './types';

const BY_SLUG = new Map<string, MnLake>(MN_LAKES.map((l) => [l.slug, l]));

export interface SpeciesLakePick {
  slug: string;
  /** One-line, citable reason this lake ranks for the species. */
  blurb: string;
}

export interface SpeciesRanking {
  /** snake_case species param, shared with the map/shop vocabulary. */
  speciesKey: string;
  /** Display species, e.g. "Largemouth Bass". */
  speciesLabel: string;
  /** H2 / section title, e.g. "Best Largemouth Bass Lakes in Minnesota". */
  title: string;
  /** The direct, quotable answer sentence an engine can lift verbatim. */
  answer: string;
  /** Ranked picks (order = rank). */
  picks: SpeciesLakePick[];
  /** True while picks are curated, not DNR-verified (drives the prototype note). */
  isSample: boolean;
}

/** A pick joined to its real MN_LAKES record (name, centroid, reports). */
export interface ResolvedSpeciesLake {
  rank: number;
  slug: string;
  name: string;
  lat: number;
  lng: number;
  reports: number;
  blurb: string;
  /** True when a /w/{slug}/fishing-patterns guide exists for this lake — drives the
   *  primary "Read the guide" CTA. In prod this is true for any lake with a pattern
   *  page; in the prototype it's the 20 built guides (3 of which are MN top lakes). */
  hasGuide: boolean;
}

/** Join a ranking's picks to real lake metadata, dropping any unknown slug. */
export function resolveRanking(r: SpeciesRanking): ResolvedSpeciesLake[] {
  return r.picks
    .map((p, i) => {
      const lake = BY_SLUG.get(p.slug);
      if (!lake) return null;
      return {
        rank: i + 1,
        slug: lake.slug,
        name: lake.name.trim(),
        lat: lake.lat,
        lng: lake.lng,
        reports: lake.reports,
        blurb: p.blurb,
        hasGuide: Boolean(getLake(lake.slug)),
      };
    })
    .filter((x): x is ResolvedSpeciesLake => x !== null);
}

/**
 * The MN hub's PRIMARY list — lake-first, ranked by all-site activity (MN_LAKES
 * order), adapted into the shared <CanonicalLakeCard> shape. This mirrors the national
 * hub's structure exactly. The bass EDITORIAL LENS rides on top without reordering:
 * where a lake also appears in a bass ranking we attach that pick's blurb + a species
 * badge; lakes without a bass pick render a neutral card. The species-ranked bass
 * sections live BELOW this list (the "bass content after lake-first" the article wants).
 * See docs/aeo-canonical-sop.md §1.
 */
export function mnHubLakes(topN: number): LakeCardData[] {
  const bassBySlug = new Map<string, { blurb: string; species: string }>();
  for (const r of MN_BASS_RANKINGS) {
    for (const p of r.picks) {
      if (!bassBySlug.has(p.slug)) {
        bassBySlug.set(p.slug, { blurb: p.blurb, species: r.speciesLabel });
      }
    }
  }

  return MN_LAKES.slice(0, topN).map((l) => {
    const bass = bassBySlug.get(l.slug);
    return {
      rank: l.rank,
      name: l.name.trim(),
      slug: l.slug,
      lat: l.lat,
      lng: l.lng,
      reports: l.reports,
      hasGuide: Boolean(getLake(l.slug)),
      blurb: bass?.blurb,
      focusBadge: bass?.species,
      shopSpecies: bass ? speciesParam(bass.species) : undefined,
    };
  });
}

// ── Minnesota BASS rankings (Omnia's focus) ──────────────────────────────────

export const MN_BASS_RANKINGS: SpeciesRanking[] = [
  {
    speciesKey: 'largemouth_bass',
    speciesLabel: 'Largemouth Bass',
    title: 'Best Largemouth Bass Lakes in Minnesota',
    answer:
      'The best largemouth bass lakes in Minnesota are Lake Minnetonka, Lake Waconia, and Forest Lake — sprawling, weed-rich waters in the Twin Cities metro that carry the heaviest largemouth report volume on Omnia.',
    isSample: true,
    picks: [
      {
        slug: 'lake-minnetonka-fishing-reports',
        blurb:
          "Minnesota's most-reported bass water — a 14,000-acre maze of weed edges, docks, and reefs that grows giant largemouth across the metro.",
      },
      {
        slug: 'lake-waconia-fishing-reports',
        blurb:
          'Shallow, fertile, and weedy with abundant largemouth on the cabbage and slop — a metro favorite a short drive west.',
      },
      {
        slug: 'forest-lake-44-fishing-reports',
        blurb:
          'Three connected basins with deep weed lines and dock-lined shorelines that hold largemouth all summer.',
      },
      {
        slug: 'lake-minnewashta-fishing-reports',
        blurb:
          'Clear metro lake with sharp weed edges and standing timber — a consistent numbers-and-quality largemouth bite.',
      },
      {
        slug: 'medicine-lake-fishing-reports',
        blurb:
          'Heavily fished metro lake with broad bulrush and lily flats that funnel largemouth to predictable cover.',
      },
      {
        slug: 'chisago-lake-fishing-reports',
        blurb:
          'Chain-of-lakes largemouth fishery north of the metro with weed flats and connecting channels worth working.',
      },
      {
        slug: 'lake-independence-fishing-reports',
        blurb:
          'Fertile west-metro lake with thick summer weed growth that concentrates largemouth on the edges.',
      },
      {
        slug: 'big-marine-lake-fishing-reports',
        blurb:
          'Clearer water and defined weed lines make this a quality largemouth lake on the metro fringe.',
      },
    ],
  },
  {
    speciesKey: 'smallmouth_bass',
    speciesLabel: 'Smallmouth Bass',
    title: 'Best Smallmouth Bass Lakes in Minnesota',
    answer:
      'Minnesota’s best smallmouth bass lakes are Mille Lacs, Lake Vermilion, and Lake Pepin — clear rock-and-reef waters (and the smallmouth-rich border lakes) that produce trophy-class smallmouth.',
    isSample: true,
    picks: [
      {
        slug: 'mille-lacs-lake-fishing-reports',
        blurb:
          'A world-class trophy smallmouth fishery — vast rock and gravel reefs over 130,000 acres routinely give up 20-inch-plus brown bass.',
      },
      {
        slug: 'lake-vermilion-fishing-reports-2',
        blurb:
          'Endless rock structure, islands, and reefs across 40,000 acres make this one of the North Country’s premier smallmouth lakes.',
      },
      {
        slug: 'lake-pepin-fishing-reports',
        blurb:
          'A natural Mississippi River widening with current-swept rock and wing dams that hold strong, hard-pulling smallmouth.',
      },
      {
        slug: 'rainy-lake-fishing-reports',
        blurb:
          'Sprawling border water with limitless rocky shoreline and reef structure producing trophy smallmouth.',
      },
      {
        slug: 'lake-of-the-woods-fishing-reports',
        blurb:
          'Beyond its walleye fame, the rocky islands and reefs of the south basin grow surprisingly big smallmouth.',
      },
      {
        slug: 'lake-saint-croix-fishing-reports',
        blurb:
          'The St. Croix’s current breaks, rock, and wood hold a strong river-smallmouth population on the Wisconsin border.',
      },
      {
        slug: 'lake-kabetogama-fishing-reports',
        blurb:
          'Voyageurs-country rock reefs and island shorelines make Kabetogama a quietly excellent smallmouth lake.',
      },
      {
        slug: 'leech-lake-fishing-reports',
        blurb:
          'Best known for walleye, but its rock bars and gravel humps also support a healthy smallmouth fishery.',
      },
    ],
  },
];
