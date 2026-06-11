// AEO content system — data model (mirrors build-spec Section 4).
// The report-to-pattern synthesis pipeline is out of scope; this consumes its output.

export type Season = 'Spring' | 'Summer' | 'Fall' | 'Winter' | 'Ice';
export type SpawnPhase = 'Pre-Spawn' | 'Spawn' | 'Post-Spawn' | null;

export interface Pattern {
  season: Season;
  phase: SpawnPhase;
  species: string;
  /** Stable anchor id, e.g. "summer-smallmouth-bass". Never regenerate on rebuild. */
  anchorId: string;
  waterTempF: { min: number; max: number };
  behavior: string;
  locations: string[];
  techniques: string[];
  forage: { primary: string; secondary?: string };
  baitColors: string[];
  structures: { primary: string; secondary?: string };
  /** true = gate the premium live layer behind PRO (see spec Section 10). */
  isPro?: boolean;
  /** Optional hand-written answer block; falls back to generated prose (Section 5). */
  answerOverride?: string;
  // ── Shop linkout enrichment (optional) ──────────────────────────────────
  // The synthesis pipeline should emit CANONICAL shop-facet slugs here, drawn
  // from the store's existing taxonomy — NOT kebab'd prose. snake_case to match
  // Omnia's live param vocabulary (e.g. species=largemouth_bass). Omitting these
  // yields a clean (waterbody_slug, season_group, species) link, which matches
  // the live map/shop convention exactly.
  /** Canonical technique slugs, e.g. ['drop_shot', 'ned_rig']. */
  techniqueTags?: string[];
  /** Canonical bait-color family slug, e.g. 'natural_craw'. */
  colorFamily?: string;
  /** Optional curated hotbaits collection id; if set, the shop link uses it
   *  instead of the faceted form (merchandising controls exactly what shows). */
  shopCollection?: string;
}

export interface LakeStats {
  topSpecies: string[];
  bestMonths: string[];
  typicalSize?: string;
}

export interface Lake {
  slug: string;
  name: string;
  state: string;
  /** Position in the bass hub (1-20). */
  rank: number;
  /** 2-3 sentence verdict for the hub card. */
  summary: string;
  /** One-line hook, e.g. "rock-pile smallmouth". */
  signaturePattern: string;
  peakSeason: string;
  stats: LakeStats;
  reportCount: number;
  /** Reports in the last 30 days (freshness signal). */
  reportCountTrailing30: number;
  /** ISO date, kept in sync with JSON-LD dateModified. */
  updatedAt: string;
  /**
   * Approximate seed coordinates ONLY (build-spec Section 11). Production must
   * resolve the authoritative centroid from the waterbody table by slug.
   */
  coordinates: { lat: number; lng: number };
  /** Per-lake map zoom override; large waters frame better at a lower value. */
  zoom?: number;
  patterns: Pattern[];
  /**
   * 'reference' = real worked data (Mille Lacs). 'sample' = illustrative
   * pattern data for the prototype; production replaces it with synthesis output.
   */
  dataStatus: 'reference' | 'sample';
}

export interface FaqItem {
  question: string;
  answerHtml: string;
}

export interface HubConfig {
  slug: string;
  title: string;
  /** Direct answer intro paragraph (2-3 sentences). */
  intro: string;
  methodology: string;
  updatedAt: string;
  faq: FaqItem[];
}

/**
 * Normalized input for the shared <CanonicalLakeCard> — the one lake card both the
 * national and state hubs render (the harmony primitive). Every hub maps its own
 * source shape (national `Lake`, state `MnLake`) into this so the four canonical
 * destinations (patterns → fish-species → map → shop) render identically everywhere.
 * Editorial "focus" (e.g. a bass lens on the MN hub) rides as optional fields and
 * never changes the lake ordering. See docs/aeo-canonical-sop.md §1–§2.
 */
export interface LakeCardData {
  rank: number;
  name: string;
  /** Shown on the national (multi-state) hub; omit on single-state hubs. */
  state?: string;
  slug: string;
  lat: number;
  lng: number;
  zoom?: number;
  reports: number;
  /** A /w/{slug}/fishing-patterns guide exists → the lead "Read the guide" CTA. */
  hasGuide: boolean;
  /** Verdict (national) or editorial-lens blurb (state). Optional. */
  blurb?: string;
  /** Multi-species meta (national); usually absent on state lake-first lists. */
  topSpecies?: string[];
  peakSeason?: string;
  bestMonths?: string[];
  /** Short editorial focus badge, e.g. "Largemouth Bass" (MN bass lens). */
  focusBadge?: string;
  /** snake_case species for the (gated) shop link; falls back to topSpecies[0]. */
  shopSpecies?: string;
}
