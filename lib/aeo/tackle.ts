// Matched-tackle service — the shared "what should I throw here" engine.
//
// THE BIG PICTURE: Omnia already ranks techniques per (lake, season, species) and
// sorts baits by how often they're mentioned in reports for that lake. Today that
// logic lives only inside the map app. This module models that engine as a single,
// headless source of truth so EVERY surface renders the same result:
//   - the map's top_techniques tab
//   - the /shop/lake/{slug}/{species} collection page
//   - the AEO answer blocks (inline, server-rendered = indexable)
//   - the natural-language tackle portal (/tackle)
//
// PROTOTYPE STATUS: the catalog + report-mention counts here are MOCK. In
// production, getMatchedTackle() is a thin wrapper over Omnia's real recommendation
// API (rank by technique, then sort baits by report mentions on that waterbody).
// parseTackleQuery() is a deterministic stand-in for the LLM parse (see the doc:
// production uses Vercel AI Gateway, e.g. anthropic/claude-sonnet-4.6).

import { getLake, LAKES } from './data';
import { seasonGroupParam, speciesParam } from './format';
import { PROD_BASE } from './links';

// ── Contract (what the headless service returns) ─────────────────────────────

export interface MatchedProduct {
  id: string;
  name: string;
  brand: string;
  priceUsd: number;
  productUrl: string;
  /** Mentions of this bait in reports for THIS waterbody — the sort signal. */
  reportMentions: number;
}

export interface MatchedTechnique {
  /** Canonical technique slug (snake_case), shared with the shop facet taxonomy. */
  slug: string;
  label: string;
  /** Technique rank for this (lake, season, species). 1 = top. */
  rank: number;
  /** Products mapped to this technique, sorted by reportMentions desc. */
  products: MatchedProduct[];
}

export interface MatchedTackleContext {
  waterbodySlug: string;
  lakeName: string | null;
  /** Display species, e.g. "Smallmouth Bass". */
  species: string;
  /** snake_case species param, e.g. "smallmouth_bass". */
  speciesParam: string;
  /** lowercased season group, e.g. "summer". */
  seasonGroup: string;
  /** Whether techniques came from real pattern tags vs a species default. */
  source: 'pattern' | 'species-default';
}

export interface MatchedTackleResult {
  context: MatchedTackleContext;
  techniques: MatchedTechnique[];
}

export interface MatchedTackleQuery {
  waterbodySlug: string;
  /** Display or param form; normalized internally. */
  species: string;
  /** Season group; defaults to the lake's peak season if omitted. */
  seasonGroup?: string;
}

// ── Mock catalog (technique -> products). Production: the real product API. ──

interface CatalogProduct {
  id: string;
  name: string;
  brand: string;
  priceUsd: number;
}

const TECHNIQUE_CATALOG: Record<string, { label: string; products: CatalogProduct[] }> = {
  jerkbait: {
    label: 'Jerkbait',
    products: [
      { id: 'rapala-husky-jerk', name: 'Husky Jerk', brand: 'Rapala', priceUsd: 8.99 },
      { id: 'megabass-vision-110', name: 'Vision 110', brand: 'Megabass', priceUsd: 25.99 },
    ],
  },
  tube_jig: {
    label: 'Tube Jig',
    products: [
      { id: 'strike-king-coffee-tube', name: 'Coffee Tube', brand: 'Strike King', priceUsd: 4.49 },
      { id: 'zman-trd-tubez', name: 'TRD TubeZ', brand: 'Z-Man', priceUsd: 4.99 },
    ],
  },
  drop_shot: {
    label: 'Drop Shot',
    products: [
      { id: 'roboworm-straight-tail', name: 'Straight Tail Worm', brand: 'Roboworm', priceUsd: 4.29 },
      { id: 'berkley-maxscent-flatworm', name: 'MaxScent Flat Worm', brand: 'Berkley', priceUsd: 6.49 },
    ],
  },
  ned_rig: {
    label: 'Ned Rig',
    products: [
      { id: 'zman-finesse-trd', name: 'Finesse TRD', brand: 'Z-Man', priceUsd: 4.99 },
      { id: 'strike-king-ned-ocho', name: 'Ned Ocho', brand: 'Strike King', priceUsd: 4.49 },
    ],
  },
  live_bait_rig: {
    label: 'Live-Bait Rig',
    products: [
      { id: 'northland-roach-rig', name: 'Roach Rig', brand: 'Northland', priceUsd: 3.29 },
      { id: 'lindy-rig', name: 'Lindy Rig', brand: 'Lindy', priceUsd: 2.99 },
    ],
  },
  spinner_rig: {
    label: 'Spinner Rig',
    products: [
      { id: 'northland-baitfish-harness', name: 'Baitfish Spinner Harness', brand: 'Northland', priceUsd: 4.99 },
      { id: 'macks-smile-blade', name: 'Smile Blade Slow Death', brand: "Mack's Lure", priceUsd: 5.49 },
    ],
  },
  blade_bait: {
    label: 'Blade Bait',
    products: [
      { id: 'damiki-vault', name: 'Vault Blade Bait', brand: 'Damiki', priceUsd: 6.99 },
      { id: 'heddon-sonar', name: 'Sonar', brand: 'Heddon', priceUsd: 5.99 },
    ],
  },
  jigging: {
    label: 'Jigging',
    products: [
      { id: 'northland-fireball-jig', name: 'Fire-Ball Jig', brand: 'Northland', priceUsd: 3.99 },
      { id: 'vmc-tungsten-jig', name: 'Tungsten Football Jig', brand: 'VMC', priceUsd: 5.49 },
    ],
  },
  bucktail: {
    label: 'Bucktail',
    products: [
      { id: 'musky-mayhem-double-cowgirl', name: 'Double Cowgirl', brand: 'Musky Mayhem', priceUsd: 26.99 },
      { id: 'llungen-dc9', name: 'DC-9', brand: 'Llungen Lures', priceUsd: 22.99 },
    ],
  },
  glide_bait: {
    label: 'Glide Bait',
    products: [
      { id: 'phantom-softail', name: 'Softail', brand: 'Phantom Lures', priceUsd: 34.99 },
      { id: 'savage-gear-glide-swimmer', name: 'Glide Swimmer', brand: 'Savage Gear', priceUsd: 29.99 },
    ],
  },
  jig: {
    label: 'Jig',
    products: [
      { id: 'strike-king-tour-grade-jig', name: 'Tour Grade Football Jig', brand: 'Strike King', priceUsd: 4.99 },
      { id: 'booyah-boo-jig', name: 'Boo Jig', brand: 'BOOYAH', priceUsd: 3.99 },
    ],
  },
  crankbait: {
    label: 'Crankbait',
    products: [
      { id: 'strike-king-5xd', name: 'Pro-Model 5XD', brand: 'Strike King', priceUsd: 7.99 },
      { id: 'rapala-dt-series', name: 'DT Series', brand: 'Rapala', priceUsd: 8.49 },
    ],
  },
  spinnerbait: {
    label: 'Spinnerbait',
    products: [
      { id: 'war-eagle-spinnerbait', name: 'Gold Frame Spinnerbait', brand: 'War Eagle', priceUsd: 6.49 },
      { id: 'strike-king-hack-attack', name: 'Hack Attack Heavy Cover', brand: 'Strike King', priceUsd: 7.99 },
    ],
  },
  swimbait: {
    label: 'Swimbait',
    products: [
      { id: 'keitech-swing-impact', name: 'Swing Impact FAT', brand: 'Keitech', priceUsd: 6.99 },
      { id: 'megabass-magdraft', name: 'Magdraft', brand: 'Megabass', priceUsd: 19.99 },
    ],
  },
  topwater: {
    label: 'Topwater',
    products: [
      { id: 'river2sea-whopper-plopper', name: 'Whopper Plopper', brand: 'River2Sea', priceUsd: 13.99 },
      { id: 'heddon-zara-spook', name: 'Zara Spook', brand: 'Heddon', priceUsd: 8.49 },
    ],
  },
};

// Fallback technique sets when a pattern carries no canonical techniqueTags
// (the 19 sample lakes). Keyed by lowercased display species.
const SPECIES_DEFAULT_TECHNIQUES: Record<string, string[]> = {
  'largemouth bass': ['jig', 'crankbait', 'spinnerbait'],
  'smallmouth bass': ['drop_shot', 'ned_rig', 'tube_jig'],
  'spotted bass': ['drop_shot', 'jig', 'crankbait'],
  'striped bass': ['swimbait', 'topwater', 'jigging'],
  walleye: ['live_bait_rig', 'jigging', 'crankbait'],
  muskie: ['bucktail', 'glide_bait', 'swimbait'],
  crappie: ['jig', 'live_bait_rig'],
  'northern pike': ['spinnerbait', 'swimbait'],
};

const GENERIC_DEFAULT_TECHNIQUES = ['jig', 'crankbait', 'drop_shot'];

// ── Deterministic mock "report mentions" (stable across renders) ─────────────

function hashInt(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Mock mentions of a product in reports for a given waterbody (4..61). */
function mentionsFor(waterbodySlug: string, productId: string): number {
  return 4 + (hashInt(`${waterbodySlug}|${productId}`) % 58);
}

// ── Resolver (single source of truth) ────────────────────────────────────────

/**
 * Resolve matched tackle for a (lake, season, species). Mirrors the real engine:
 * pick the ranked techniques, then for each, sort products by report mentions on
 * THIS waterbody. Always returns something (never an empty/zero state).
 */
export function getMatchedTackle(query: MatchedTackleQuery): MatchedTackleResult {
  const lake = getLake(query.waterbodySlug);
  const speciesDisplay = resolveSpeciesDisplay(query.species, lake);
  const seasonGroup = (query.seasonGroup ?? lake?.peakSeason ?? 'summer').toLowerCase();

  // Prefer the canonical technique tags from the matching pattern; else fall back
  // to a species default. (Production: the recommendation API returns the ranking.)
  const pattern = lake?.patterns.find(
    (p) =>
      p.species.toLowerCase() === speciesDisplay.toLowerCase() &&
      p.season.toLowerCase() === seasonGroup,
  );
  const speciesPatternAnySeason = lake?.patterns.find(
    (p) => p.species.toLowerCase() === speciesDisplay.toLowerCase(),
  );

  let techniqueSlugs: string[];
  let source: MatchedTackleContext['source'];
  if (pattern?.techniqueTags?.length) {
    techniqueSlugs = pattern.techniqueTags;
    source = 'pattern';
  } else if (speciesPatternAnySeason?.techniqueTags?.length) {
    techniqueSlugs = speciesPatternAnySeason.techniqueTags;
    source = 'pattern';
  } else {
    techniqueSlugs =
      SPECIES_DEFAULT_TECHNIQUES[speciesDisplay.toLowerCase()] ?? GENERIC_DEFAULT_TECHNIQUES;
    source = 'species-default';
  }

  const slug = lake?.slug ?? query.waterbodySlug;
  const techniques: MatchedTechnique[] = techniqueSlugs
    .map((tslug, i) => {
      const entry = TECHNIQUE_CATALOG[tslug];
      if (!entry) return null;
      const products: MatchedProduct[] = entry.products
        .map((p) => ({
          id: p.id,
          name: p.name,
          brand: p.brand,
          priceUsd: p.priceUsd,
          productUrl: `${PROD_BASE}/shop/p/${p.id}`,
          reportMentions: mentionsFor(slug, p.id),
        }))
        .sort((a, b) => b.reportMentions - a.reportMentions);
      return { slug: tslug, label: entry.label, rank: i + 1, products };
    })
    .filter((t): t is MatchedTechnique => t !== null);

  return {
    context: {
      waterbodySlug: slug,
      lakeName: lake?.name ?? null,
      species: speciesDisplay,
      speciesParam: speciesParam(speciesDisplay),
      seasonGroup,
      source,
    },
    techniques,
  };
}

/** Map a species param/display to a display name, validated against the lake. */
function resolveSpeciesDisplay(species: string, lake: ReturnType<typeof getLake>): string {
  const param = speciesParam(species);
  const fromLake = lake?.stats.topSpecies.find((s) => speciesParam(s) === param);
  if (fromLake) return fromLake;
  // Title-case the param as a last resort ("smallmouth_bass" -> "Smallmouth Bass").
  return param
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// ── Natural-language parse (deterministic stand-in for the LLM) ──────────────

const SEASON_KEYWORDS: Record<string, string> = {
  spring: 'spring',
  'pre-spawn': 'spring',
  prespawn: 'spring',
  spawn: 'spring',
  summer: 'summer',
  fall: 'fall',
  autumn: 'fall',
  winter: 'winter',
  ice: 'winter',
};

// Species aliases -> canonical display name.
const SPECIES_KEYWORDS: { match: RegExp; species: string }[] = [
  { match: /largemouth|lmb|bucketmouth|green\s?bass/i, species: 'Largemouth Bass' },
  { match: /smallmouth|smallie|smb|brown\s?bass/i, species: 'Smallmouth Bass' },
  { match: /spotted\s?bass|spots?\b/i, species: 'Spotted Bass' },
  { match: /striped\s?bass|striper/i, species: 'Striped Bass' },
  { match: /walleye|eye\b/i, species: 'Walleye' },
  { match: /musky|muskie|muskellunge/i, species: 'Muskie' },
  { match: /crappie|panfish|slab/i, species: 'Crappie' },
  { match: /\bpike\b|northern/i, species: 'Northern Pike' },
  { match: /\bbass\b/i, species: 'Largemouth Bass' }, // generic fallback
];

export interface ParsedTackleQuery {
  waterbodySlug?: string;
  lakeName?: string;
  species?: string;
  seasonGroup?: string;
  /** Fields we couldn't resolve from the text — drives the UI's follow-up prompt. */
  missing: ('lake' | 'species')[];
}

/**
 * Parse free text into the structured contract. Deterministic: matches against the
 * known lake names + species/season vocabulary. PRODUCTION swaps this for an LLM
 * call via Vercel AI Gateway, which also handles typos, paraphrase, and (later)
 * environmental phrasing like "muddy water after a cold front".
 */
export function parseTackleQuery(text: string): ParsedTackleQuery {
  const q = text.toLowerCase();

  // Lake: longest matching lake name wins (so "lake of the ozarks" beats "lake").
  let lakeMatch: { slug: string; name: string } | null = null;
  for (const l of LAKES) {
    const bareName = l.name.toLowerCase().replace(/\s+lake$|^lake\s+/g, '');
    if (q.includes(l.name.toLowerCase()) || (bareName.length > 3 && q.includes(bareName))) {
      if (!lakeMatch || l.name.length > lakeMatch.name.length) {
        lakeMatch = { slug: l.slug, name: l.name };
      }
    }
  }

  const speciesMatch = SPECIES_KEYWORDS.find((s) => s.match.test(q))?.species;

  let seasonGroup: string | undefined;
  for (const [kw, group] of Object.entries(SEASON_KEYWORDS)) {
    if (q.includes(kw)) {
      seasonGroup = group;
      break;
    }
  }

  const missing: ('lake' | 'species')[] = [];
  if (!lakeMatch) missing.push('lake');
  if (!speciesMatch) missing.push('species');

  return {
    waterbodySlug: lakeMatch?.slug,
    lakeName: lakeMatch?.name,
    species: speciesMatch,
    seasonGroup,
    missing,
  };
}
