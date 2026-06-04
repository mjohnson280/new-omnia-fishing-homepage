import type { MetadataRoute } from 'next';
import { lakesByRank } from '@/lib/aeo/data';
import { canonicalGuideUrl, canonicalHubUrl } from '@/lib/aeo/links';

// Sitemap entries for the AEO system (build-spec Section 9.4). URLs are the
// production-canonical omniafishing.com targets, which is where these pages
// index. Devs can merge this generation logic into the main Omnia sitemap.
export default function sitemap(): MetadataRoute.Sitemap {
  const lakes = lakesByRank();
  return [
    {
      url: canonicalHubUrl(),
      lastModified: lakes[0]?.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...lakes.map((lake) => ({
      url: canonicalGuideUrl(lake.slug),
      lastModified: lake.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}
