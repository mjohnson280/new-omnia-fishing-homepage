// Slug → centroid → map deep-link.
//
// A standalone, dependency-free utility for turning an Omnia waterbody slug
// (e.g. "lake-minnetonka-fishing-reports") into a basin centroid and a canonical
// /map deep-link. Intended to be lifted out for a 3rd-party-facing tool — the only
// in-repo import is `mapDeepLink`, which guarantees the URL shape matches the app.
//
// IMPORTANT CONTEXT: the coordinates hardcoded in lib/aeo/data.ts are hand-entered
// APPROXIMATE basin centers (seeds for the prototype demo), not the output of this
// tool. This module is the honest, automatable replacement. See
// docs/lake-centroid-tool.md for the full write-up, data-source comparison, and
// the gotchas (label-point vs polygon centroid, duplicate names, rivers/big water).

import { mapDeepLink } from './links';

// ── Types ────────────────────────────────────────────────────────────────────

export interface LatLng {
  lat: number;
  lng: number;
}

export interface ParsedSlug {
  /** The original slug, unchanged. */
  slug: string;
  /** Best-effort human name, e.g. "Lake Minnetonka". */
  name: string;
  /** True for rivers / connecting waters where a polygon centroid is meaningless
   *  and the map should open zoomed out on a representative point. */
  isRiverOrConnecting: boolean;
}

export interface Centroid extends LatLng {
  /** Suggested map zoom. 10 for a typical lake, 8 for big/linear water. */
  zoom: number;
  /** Where this point came from, for auditing (e.g. "omnia-waterbody-table"). */
  source: string;
  /** How much to trust it. Polygon centroids are 'high'; geocoder label points
   *  are 'medium'; bounding-box centers are 'low'. */
  confidence: 'high' | 'medium' | 'low';
}

export interface ResolvedLake extends Centroid {
  slug: string;
  name: string;
  /** Canonical /map deep-link, identical shape to the in-app lakeMapUrl(). */
  mapUrl: string;
}

/** A pluggable strategy for turning a parsed slug into a centroid. Swap the
 *  resolver to change the data source without touching the rest of the pipeline. */
export interface CentroidResolver {
  readonly name: string;
  resolve(parsed: ParsedSlug, stateHint?: string): Promise<Centroid | null>;
}

// ── Slug parsing ───────────────────────────────────────────────────────────

// Suffixes Omnia appends to waterbody slugs that are not part of the name.
const SLUG_SUFFIXES = ['-fishing-reports', '-fish-species', '-boat-ramps', '-fishing-patterns'];

// Tokens that signal a non-lake water type (centroid framing differs).
const RIVER_TOKENS = ['river', 'creek', 'channel', 'flowage', 'thoroughfare'];

const SMALL_WORDS = new Set(['of', 'the', 'and', 'on', 'at']);

/** Strip Omnia's tab suffix, title-case the rest, and flag rivers/connecting water. */
export function parseSlug(slug: string): ParsedSlug {
  let core = slug.toLowerCase().trim();
  for (const suffix of SLUG_SUFFIXES) {
    if (core.endsWith(suffix)) {
      core = core.slice(0, -suffix.length);
      break;
    }
  }
  // Drop a trailing descriptive segment some slugs carry (e.g. "-great-lakes").
  core = core.replace(/-great-lakes$/, '');

  const words = core.split('-').filter(Boolean);
  const name = words
    .map((w, i) =>
      i > 0 && SMALL_WORDS.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1),
    )
    .join(' ');

  const isRiverOrConnecting = words.some((w) => RIVER_TOKENS.includes(w));
  return { slug, name, isRiverOrConnecting };
}

/** Default zoom: linear/big water reads better zoomed out than a tight lake basin. */
export function defaultZoom(parsed: ParsedSlug): number {
  return parsed.isRiverOrConnecting ? 8 : 10;
}

// ── Geometry helpers ─────────────────────────────────────────────────────────

/**
 * Area-weighted centroid of a polygon ring (the basin center you actually want),
 * via the shoelace formula. Ring is [lng, lat] pairs (GeoJSON order); the last
 * point may or may not repeat the first. Falls back to the vertex average for
 * degenerate (zero-area) rings.
 *
 * NOTE: planar formula on lon/lat. Fine at lake scale; for very large waters,
 * project first or just use the bounding-box center.
 */
export function polygonCentroid(ring: [number, number][]): LatLng {
  const pts = ring.length > 1 && samedPoint(ring[0], ring[ring.length - 1])
    ? ring.slice(0, -1)
    : ring;
  if (pts.length === 0) return { lat: 0, lng: 0 };
  if (pts.length < 3) return vertexAverage(pts);

  let twiceArea = 0;
  let cx = 0;
  let cy = 0;
  for (let i = 0; i < pts.length; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[(i + 1) % pts.length];
    const cross = x0 * y1 - x1 * y0;
    twiceArea += cross;
    cx += (x0 + x1) * cross;
    cy += (y0 + y1) * cross;
  }
  if (twiceArea === 0) return vertexAverage(pts);
  const area6 = twiceArea * 3; // 6 * (area = twiceArea / 2)
  return { lng: cx / area6, lat: cy / area6 };
}

function samedPoint(a: [number, number], b: [number, number]): boolean {
  return a[0] === b[0] && a[1] === b[1];
}

function vertexAverage(pts: [number, number][]): LatLng {
  const sum = pts.reduce((acc, [x, y]) => ({ lng: acc.lng + x, lat: acc.lat + y }), {
    lng: 0,
    lat: 0,
  });
  return { lng: sum.lng / pts.length, lat: sum.lat / pts.length };
}

/** Center of a [minLng, minLat, maxLng, maxLat] bounding box (low-confidence fallback). */
export function bboxCenter(bbox: [number, number, number, number]): LatLng {
  return { lng: (bbox[0] + bbox[2]) / 2, lat: (bbox[1] + bbox[3]) / 2 };
}

// ── Resolvers ──────────────────────────────────────────────────────────────

/**
 * RECOMMENDED. Resolve from Omnia's own waterbody table — the slug is already the
 * join key and Omnia owns authoritative centroids for 100k+ waterbodies. Pass a
 * `lookup` that hits your DB / internal endpoint; this resolver just normalizes the
 * result. Don't make 3rd parties geocode data you already have.
 */
export function omniaTableResolver(
  lookup: (slug: string) => Promise<({ zoom?: number } & LatLng) | null>,
): CentroidResolver {
  return {
    name: 'omnia-waterbody-table',
    async resolve(parsed) {
      const hit = await lookup(parsed.slug);
      if (!hit) return null;
      return {
        lat: hit.lat,
        lng: hit.lng,
        zoom: hit.zoom ?? defaultZoom(parsed),
        source: 'omnia-waterbody-table',
        confidence: 'high',
      };
    },
  };
}

interface NominatimResult {
  lat: string;
  lon: string;
  boundingbox?: [string, string, string, string]; // [minLat, maxLat, minLng, maxLng]
  geojson?: { type: string; coordinates: unknown };
}

/**
 * 3rd-party fallback when there's no DB access: geocode via OpenStreetMap Nominatim
 * (free, no API key). Returns a polygon centroid when OSM has the water polygon
 * (confidence 'high'), otherwise the label point (confidence 'medium').
 *
 * USAGE POLICY: Nominatim allows max 1 req/sec and REQUIRES a real User-Agent /
 * contact. For production volume, self-host Nominatim or use a paid geocoder. For
 * higher accuracy on US waters, prefer USGS GNIS (names) + NHD (polygons) — see the
 * doc. This resolver is the "works today, no setup" option.
 */
export function nominatimResolver(opts: {
  userAgent: string;
  endpoint?: string;
  countryCodes?: string;
}): CentroidResolver {
  const endpoint = opts.endpoint ?? 'https://nominatim.openstreetmap.org/search';
  return {
    name: 'osm-nominatim',
    async resolve(parsed, stateHint) {
      const query = [parsed.name, stateHint, 'USA'].filter(Boolean).join(', ');
      const params = new URLSearchParams({
        q: query,
        format: 'jsonv2',
        limit: '1',
        polygon_geojson: '1',
        countrycodes: opts.countryCodes ?? 'us',
      });
      const res = await fetch(`${endpoint}?${params.toString()}`, {
        headers: { 'User-Agent': opts.userAgent, 'Accept-Language': 'en' },
      });
      if (!res.ok) return null;
      const hits = (await res.json()) as NominatimResult[];
      const hit = hits[0];
      if (!hit) return null;

      const zoom = defaultZoom(parsed);

      // Prefer the polygon centroid when OSM returns a (multi)polygon.
      const ring = firstPolygonRing(hit.geojson);
      if (ring) {
        const c = polygonCentroid(ring);
        return { ...c, zoom, source: 'osm-nominatim:polygon', confidence: 'high' };
      }
      // Else fall back to the label point (often offset toward shore/town).
      return {
        lat: Number(hit.lat),
        lng: Number(hit.lon),
        zoom,
        source: 'osm-nominatim:point',
        confidence: 'medium',
      };
    },
  };
}

/** Pull the outer ring of the first polygon out of a GeoJSON geometry, if any. */
function firstPolygonRing(geo: NominatimResult['geojson']): [number, number][] | null {
  if (!geo) return null;
  if (geo.type === 'Polygon') {
    const coords = geo.coordinates as [number, number][][];
    return coords[0] ?? null;
  }
  if (geo.type === 'MultiPolygon') {
    const coords = geo.coordinates as [number, number][][][];
    return coords[0]?.[0] ?? null;
  }
  return null;
}

// ── Pipeline ─────────────────────────────────────────────────────────────────

/** Resolve a single slug to a centroid + canonical map deep-link. */
export async function resolveLake(
  slug: string,
  resolver: CentroidResolver,
  opts: { stateHint?: string; base?: string } = {},
): Promise<ResolvedLake | null> {
  const parsed = parseSlug(slug);
  const centroid = await resolver.resolve(parsed, opts.stateHint);
  if (!centroid) return null;
  return {
    slug,
    name: parsed.name,
    ...centroid,
    mapUrl: mapDeepLink(
      { slug, lat: centroid.lat, lng: centroid.lng, zoom: centroid.zoom },
      opts.base,
    ),
  };
}

/**
 * Resolve many slugs with a small concurrency cap (default 1 — Nominatim's rate
 * limit). Bump `concurrency` when using your own table / a paid geocoder. Failures
 * resolve to null so one bad slug never sinks the batch.
 */
export async function resolveMany(
  slugs: string[],
  resolver: CentroidResolver,
  opts: { stateHint?: string; base?: string; concurrency?: number } = {},
): Promise<(ResolvedLake | null)[]> {
  const concurrency = Math.max(1, opts.concurrency ?? 1);
  const out: (ResolvedLake | null)[] = new Array(slugs.length).fill(null);
  let cursor = 0;

  async function worker() {
    while (cursor < slugs.length) {
      const i = cursor++;
      try {
        out[i] = await resolveLake(slugs[i], resolver, opts);
      } catch {
        out[i] = null;
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, slugs.length) }, worker));
  return out;
}
