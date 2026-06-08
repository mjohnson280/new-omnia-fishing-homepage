import type { Metadata } from 'next';
import { AeoChrome } from '@/components/aeo/Chrome';
import { Breadcrumbs, JsonLd, MapCTA } from '@/components/aeo/ui';
import { MnLakeBrowser } from '@/components/aeo/MnLakeBrowser';
import { MN_LAKES } from '@/lib/aeo/mn-lakes';
import { CANONICAL_BASE, canonicalHubUrl, MN_HUB_PATH } from '@/lib/aeo/links';
import { breadcrumbSchema } from '@/lib/aeo/schema';

const ALL_LAKES_PATH = `${MN_HUB_PATH}/all-lakes`;

// The full directory is the indexed *index* (ItemList over all 500); the curated hub
// at MN_HUB_PATH holds the citable per-species answers. Each lake's own
// /w/{slug}/fish-species page is the indexed spoke.
const SCHEMA_CAP = 100;

export const metadata: Metadata = {
  title: 'All 500 Minnesota Fishing Lakes (Full Directory) | Omnia Fishing',
  description:
    'The complete, searchable directory of the 500 most active fishing lakes in Minnesota, ranked by Omnia angler report volume. Each lake links to its Minnesota DNR fish-species data and the map.',
  alternates: { canonical: canonicalHubUrl(ALL_LAKES_PATH) },
  robots: { index: false, follow: true },
};

export default function AllMinnesotaLakes() {
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'All Minnesota Fishing Lakes, Ranked by Activity',
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    numberOfItems: MN_LAKES.length,
    itemListElement: MN_LAKES.slice(0, SCHEMA_CAP).map((l) => ({
      '@type': 'ListItem',
      position: l.rank,
      name: l.name.trim(),
      url: `${CANONICAL_BASE}/w/${l.slug}/fish-species`,
    })),
  };

  return (
    <AeoChrome>
      <JsonLd
        data={[
          itemList,
          breadcrumbSchema([
            { name: 'Home', url: `${CANONICAL_BASE}/` },
            { name: 'Articles', url: `${CANONICAL_BASE}/a` },
            { name: 'Best Fishing Lakes in Minnesota', url: canonicalHubUrl(MN_HUB_PATH) },
            { name: 'All 500 lakes', url: canonicalHubUrl(ALL_LAKES_PATH) },
          ]),
        ]}
      />

      <div className="mx-auto max-w-container px-[var(--gutter)] py-10">
        <Breadcrumbs
          trail={[
            { name: 'Home', href: '/' },
            { name: 'Articles' },
            { name: 'Best Fishing Lakes in Minnesota', href: MN_HUB_PATH },
            { name: 'All 500 lakes' },
          ]}
        />

        <header className="mt-5 max-w-3xl">
          <h1 className="text-3xl font-semibold leading-tight text-slate-900 md:text-4xl">
            All {MN_LAKES.length} Minnesota Fishing Lakes
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-700">
            The complete directory behind{' '}
            <a href={MN_HUB_PATH} className="font-semibold text-brand hover:text-brand-dark">
              the best fishing lakes in Minnesota
            </a>
            , ranked by real Omnia angler report volume. Search any lake to jump to its
            Minnesota DNR fish-species data and open it on the map.
          </p>
        </header>

        <section className="mt-8 scroll-mt-24" id="directory">
          <MnLakeBrowser lakes={MN_LAKES} />
        </section>

        <div className="mt-10">
          <MapCTA variant="banner" />
        </div>
      </div>
    </AeoChrome>
  );
}
