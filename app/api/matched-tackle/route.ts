import type { NextRequest } from 'next/server';
import { getMatchedTackle, parseTackleQuery } from '@/lib/aeo/tackle';

// Headless matched-tackle endpoint — the contract every surface shares.
//
// Two modes:
//   1. Structured:  /api/matched-tackle?waterbody_slug=…&species=…&season_group=…
//   2. Natural language:  /api/matched-tackle?q=smallmouth on mille lacs in summer
//
// In production this wraps Omnia's real recommendation API (rank by technique,
// sort baits by report mentions on the waterbody). The `q` parse is deterministic
// here; production routes it through an LLM (Vercel AI Gateway) before matching.
export const dynamic = 'force-dynamic';

export function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const q = sp.get('q');

  if (q) {
    const parsed = parseTackleQuery(q);
    if (!parsed.waterbodySlug || !parsed.species) {
      return Response.json(
        { parsed, error: 'Could not resolve a lake and species from the query.' },
        { status: 422 },
      );
    }
    const result = getMatchedTackle({
      waterbodySlug: parsed.waterbodySlug,
      species: parsed.species,
      seasonGroup: parsed.seasonGroup,
    });
    return Response.json({ parsed, result });
  }

  const waterbodySlug = sp.get('waterbody_slug');
  const species = sp.get('species');
  if (!waterbodySlug || !species) {
    return Response.json(
      { error: 'Provide either q=… or waterbody_slug=… & species=…' },
      { status: 400 },
    );
  }
  const result = getMatchedTackle({
    waterbodySlug,
    species,
    seasonGroup: sp.get('season_group') ?? undefined,
  });
  return Response.json({ result });
}
