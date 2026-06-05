import type { Metadata } from 'next';
import { AeoChrome } from '@/components/aeo/Chrome';
import { Breadcrumbs, FaqBlock, JsonLd, MapCTA } from '@/components/aeo/ui';
import { MnLakeBrowser } from '@/components/aeo/MnLakeBrowser';
import { hubBestLakesMN } from '@/lib/aeo/data';
import { MN_LAKES } from '@/lib/aeo/mn-lakes';
import {
  CANONICAL_BASE,
  canonicalHubUrl,
  lakeTabUrl,
  MN_HUB_PATH,
} from '@/lib/aeo/links';
import { breadcrumbSchema, faqSchema } from '@/lib/aeo/schema';

const hub = hubBestLakesMN;

// Structured data: cap the ItemList at the top 100 (the full 500 are listed and
// crawlable in the page body; each lake's own fish-species page is the indexed spoke).
const SCHEMA_CAP = 100;

export const metadata: Metadata = {
  title: `${hub.title} | Omnia Fishing`,
  description:
    'The 500 most active fishing lakes in Minnesota, ranked by Omnia angler reports and favorites — each with Minnesota DNR fish-species survey data, live reports, and the map. Walleye, muskie, bass, pike, and panfish waters statewide.',
  alternates: { canonical: canonicalHubUrl(MN_HUB_PATH) },
  robots: { index: false, follow: true },
};

export default function BestFishingLakesMinnesota() {
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'The Best Fishing Lakes in Minnesota 2026',
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    numberOfItems: MN_LAKES.length,
    itemListElement: MN_LAKES.slice(0, SCHEMA_CAP).map((l) => ({
      '@type': 'ListItem',
      position: l.rank,
      name: l.name,
      url: `${CANONICAL_BASE}/w/${l.slug}/fish-species`,
    })),
  };

  return (
    <AeoChrome>
      <JsonLd
        data={[
          itemList,
          faqSchema(hub.faq),
          breadcrumbSchema([
            { name: 'Home', url: `${CANONICAL_BASE}/` },
            { name: 'Articles', url: `${CANONICAL_BASE}/a` },
            { name: hub.title, url: canonicalHubUrl(MN_HUB_PATH) },
          ]),
        ]}
      />

      <div className="mx-auto max-w-container px-[var(--gutter)] py-10">
        <Breadcrumbs
          trail={[
            { name: 'Home', href: '/' },
            { name: 'Articles' },
            { name: 'Best Fishing Lakes in Minnesota' },
          ]}
        />

        {/* Hero / direct answer */}
        <header className="mt-5 max-w-3xl">
          <h1 className="text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">
            {hub.title}
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-700">{hub.intro}</p>
        </header>

        {/* The differentiator vs. DNR-only directories */}
        <p className="mt-6 max-w-3xl rounded-card border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
          Other Minnesota fishing sites republish the DNR&apos;s survey data alone. Omnia
          pairs that same DNR data with live angler reports and favorites — so every lake
          below shows not just <em>what&apos;s in it</em>, but <em>how active it is</em> and{' '}
          <em>what&apos;s biting now</em>.
        </p>

        {/* The 500-lake directory (server-rendered list + client search/sort) */}
        <section className="mt-8 scroll-mt-24" id="directory">
          <MnLakeBrowser lakes={MN_LAKES} />
        </section>

        {/* Map CTA banner */}
        <div className="mt-10">
          <MapCTA variant="banner" />
        </div>

        {/* Methodology */}
        <section id="methodology" className="mt-10 scroll-mt-24 max-w-3xl">
          <h2 className="text-2xl font-semibold text-slate-900">
            How we ranked Minnesota&apos;s lakes
          </h2>
          <p className="mt-3 leading-7 text-slate-700">{hub.methodology}</p>
        </section>

        {/* FAQ */}
        <div className="mt-10">
          <FaqBlock items={hub.faq} heading="Minnesota fishing FAQ" />
        </div>

        {/* Spoke handoff note */}
        <p className="mt-10 border-t border-slate-200 pt-6 text-xs text-slate-400">
          Each &ldquo;Fish species&rdquo; link goes to that lake&apos;s DNR survey page
          ({lakeTabUrl('lake-minnetonka-fishing-reports', 'fish-species')}). The per-lake
          DNR table retrofit (answer block + structured species/abundance/size + JSON-LD)
          is the next build — it needs the DNR survey fields, which aren&apos;t in the lake
          export.
        </p>
      </div>
    </AeoChrome>
  );
}
