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
