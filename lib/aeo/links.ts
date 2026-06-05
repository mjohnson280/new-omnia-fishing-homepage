// URL helpers for the AEO system.
//
// HANDOFF NOTE FOR OMNIA DEVS:
// On omniafishing.com these should all be same-origin relative paths. Set
// PROD_BASE to '' (empty string) when you lift this into the Omnia codebase and
// every product link below becomes a clean relative URL (/map, /shop, ...).
// In this prototype (mjcreativelogic.com) we point product links at the real
// production site so the demo actually goes somewhere useful, while the hub<->guide
// navigation stays internal so you can click through the system itself.

import type { Lake } from './types';

/** Production origin. Devs: set to '' for same-origin links in the Omnia codebase. */
export const PROD_BASE = 'https://www.omniafishing.com';

/** Canonical origin used in JSON-LD and <link rel="canonical">. Always production. */
export const CANONICAL_BASE = 'https://www.omniafishing.com';

/** Real Omnia product destinations (absolute in the prototype, relative in prod). */
export const productLinks = {
  map: `${PROD_BASE}/map`,
  shop: `${PROD_BASE}/shop`,
  pro: `${PROD_BASE}/pro`,
  app: `${PROD_BASE}/app`,
};

/**
 * Canonical map deep-link from a bare point (build-spec Section 9.5). The single
 * source of truth for the URL shape so every link — in-app and from the standalone
 * centroid tool (lib/aeo/centroid.ts) — is identical. Defaults to zoom=10.
 */
export function mapDeepLink(
  point: { slug: string; lat: number; lng: number; zoom?: number },
  base: string = PROD_BASE,
): string {
  const zoom = point.zoom ?? 10;
  return `${base}/map?lat=${point.lat}&lng=${point.lng}&waterbody_slug=${point.slug}&zoom=${zoom}`;
}

/** Map deep-link for a Lake record (delegates to mapDeepLink). */
export function lakeMapUrl(lake: Lake, base: string = PROD_BASE): string {
  return mapDeepLink(
    { slug: lake.slug, lat: lake.coordinates.lat, lng: lake.coordinates.lng, zoom: lake.zoom },
    base,
  );
}

/** A lake's "shop these baits" link, scoped to species/lake where the store supports it. */
export function shopBaitsUrl(lake: Lake, species: string): string {
  const params = new URLSearchParams({ waterbody_slug: lake.slug, species });
  return `${PROD_BASE}/shop?${params.toString()}`;
}

// ── Internal prototype routes (hub <-> guide navigation) ─────────────────────
// These stay relative so the demo is navigable on mjcreativelogic.com.

export const HUB_PATH = '/a/best-fishing-lakes-2026';

/** State-scoped hub paths. Add one line per new state hub. */
export const MN_HUB_PATH = '/a/best-fishing-lakes-minnesota';

export function guidePath(lake: Pick<Lake, 'slug'>): string {
  return `/w/${lake.slug}/fishing-patterns`;
}

/** The sibling lake tabs (Reports / Species / Boat ramps) live on production. */
export function lakeTabUrl(
  slug: string,
  tab: 'fishing-reports' | 'fish-species' | 'boat-ramps',
): string {
  return `${PROD_BASE}/w/${slug}/${tab}`;
}

/** Canonical (production) URL for a lake guide — used in JSON-LD + canonical tag. */
export function canonicalGuideUrl(slug: string): string {
  return `${CANONICAL_BASE}/w/${slug}/fishing-patterns`;
}

export function canonicalHubUrl(path: string = HUB_PATH): string {
  return `${CANONICAL_BASE}${path}`;
}
