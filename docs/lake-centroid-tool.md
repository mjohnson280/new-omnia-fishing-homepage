# Lake Centroid Tool — slug → map deep-link

**Purpose:** turn an Omnia waterbody **slug** (e.g. `lake-minnetonka-fishing-reports`)
into a **basin centroid** (`lat`/`lng` + a sensible `zoom`) and a canonical
`/map` deep-link, in a way that's safe to hand to a 3rd party.

**Reference implementation:** [`lib/aeo/centroid.ts`](../lib/aeo/centroid.ts). It is
dependency-free except for `mapDeepLink` (so the URL shape can't drift from the app).

> **Honest note on the prototype data.** The coordinates currently hardcoded in
> `lib/aeo/data.ts` are **hand-entered approximate basin centers** — demo seeds, not
> the output of any geocoder. This tool is the automatable, auditable replacement.
> Don't treat the seed coordinates as ground truth.

---

## The deep-link format (single source of truth)

Every map link — in-app and from this tool — has the same shape, defined once in
`lib/aeo/links.ts` as `mapDeepLink()`:

```
{base}/map?lat={lat}&lng={lng}&waterbody_slug={slug}&zoom={zoom}
```

- `zoom` defaults to **10** (a typical lake). Big or linear water (Great Lakes,
  rivers, connecting waters) uses **8**.
- `waterbody_slug` is passed through so the map can confirm/snap to the right
  waterbody even if the point is slightly off.

---

## How to resolve a slug → centroid (best option first)

### 1. Use Omnia's own waterbody table — RECOMMENDED

Omnia already stores authoritative centroids for 100k+ waterbodies, and **the slug
is the join key**. The right "tool" for 3rd parties is therefore a thin lookup, not
a geocoder:

```
GET /api/waterbody/{slug}  ->  { lat, lng, zoom? }
```

In code:

```ts
import { omniaTableResolver, resolveMany } from '@/lib/aeo/centroid';

const resolver = omniaTableResolver(async (slug) => {
  const res = await fetch(`/api/waterbody/${slug}`);
  return res.ok ? res.json() : null; // { lat, lng, zoom? }
});

const results = await resolveMany(slugs, resolver, { concurrency: 8 });
// each result: { slug, name, lat, lng, zoom, source, confidence, mapUrl }
```

Don't make outside tools geocode data you can hand them directly and accurately.

### 2. Geocode externally (when there's no DB access)

For a genuinely external tool, resolve from public sources. Quality order:

| Source | What it gives | Notes |
| --- | --- | --- |
| **USGS GNIS** | Authoritative US named-feature point | Free. Best for "official" name → point. Match on name **+ state**. |
| **USGS NHD** | Water **polygons** | Compute the **centroid** (`polygonCentroid`) for the true basin center. Highest accuracy. |
| **OSM / Nominatim** | Point, sometimes polygon | Free, no key, but rate-limited (1 req/s) and requires a real User-Agent. Good "works today" option. |

The included `nominatimResolver` does #3 and automatically prefers the polygon
centroid when OSM has the water polygon:

```ts
import { nominatimResolver, resolveLake } from '@/lib/aeo/centroid';

const resolver = nominatimResolver({ userAgent: 'YourTool/1.0 (you@example.com)' });
const lake = await resolveLake('lake-minnetonka-fishing-reports', resolver, {
  stateHint: 'Minnesota', // strongly recommended to disambiguate
});
```

---

## The gotchas (why naive geocoding fails)

1. **Label point ≠ centroid.** A plain geocoder returns a *label* point — often on
   the shoreline or in a nearby town. The map should open on the **polygon
   centroid** (the basin center). `polygonCentroid()` computes it (area-weighted
   shoelace); `bboxCenter()` is a low-confidence fallback.
2. **Duplicate names.** "Long Lake," "Mud Lake," etc. exist many times per state.
   Always pass a **state hint** (and ideally county) to disambiguate.
3. **Rivers / connecting waters.** A centroid is meaningless for a river. `parseSlug`
   flags these (`isRiverOrConnecting`) and `defaultZoom` widens to 8 so the map
   frames a representative reach instead of a misleading mid-river point.
4. **Big water.** Lake Erie/Michigan/St. Lawrence need a wider zoom regardless of
   centroid quality.
5. **Trust, but record it.** Every result carries `source` and `confidence`
   (`high` = polygon centroid or Omnia table, `medium` = geocoder label point,
   `low` = bbox center) so you can flag low-confidence rows for manual review.

---

## API surface (`lib/aeo/centroid.ts`)

| Export | Purpose |
| --- | --- |
| `parseSlug(slug)` | Strip Omnia's tab suffix, title-case the name, flag rivers |
| `defaultZoom(parsed)` | 10 for lakes, 8 for linear/big water |
| `polygonCentroid(ring)` | Area-weighted centroid of a polygon ring (`[lng,lat][]`) |
| `bboxCenter(bbox)` | Center of a bounding box (fallback) |
| `omniaTableResolver(lookup)` | Resolve from Omnia's waterbody table (recommended) |
| `nominatimResolver(opts)` | Resolve via OSM Nominatim (external fallback) |
| `resolveLake(slug, resolver, opts)` | One slug → `{ …centroid, mapUrl }` |
| `resolveMany(slugs, resolver, opts)` | Batch, with a concurrency cap |

Implement `CentroidResolver` to plug in any other source (a paid geocoder, a cached
GNIS/NHD extract, etc.) without changing the pipeline.
