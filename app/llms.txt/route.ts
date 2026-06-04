import { lakesByRank, hubBass2026 } from '@/lib/aeo/data';
import { canonicalGuideUrl, canonicalHubUrl } from '@/lib/aeo/links';

// /llms.txt — points answer engines at the hub and the full lake index
// (build-spec Section 9.4). Served as text/plain.
export const dynamicParams = false;

export function GET(): Response {
  const lakes = lakesByRank();
  const lines = [
    '# Omnia Fishing',
    '',
    '> Map-based fishing planning, local angler reports, and seasonal fishing patterns for 100,000+ waterbodies, with contextual tackle matched to lake, season, and species.',
    '',
    '## Best Bass Lakes 2026',
    `- [${hubBass2026.title}](${canonicalHubUrl()}): Ranked list of the 20 best bass lakes in America for 2026, from 20,000+ angler reports.`,
    '',
    '## Lake fishing pattern guides',
    ...lakes.map(
      (l) => `- [${l.name}, ${l.state} fishing patterns](${canonicalGuideUrl(l.slug)}): Season-by-season patterns by species (${l.stats.topSpecies.join(', ')}).`,
    ),
    '',
    '## Tools',
    '- [Interactive map](https://www.omniafishing.com/map): Pull up seasonal patterns and reports for any waterbody.',
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}
