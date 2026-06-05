import type { Metadata } from 'next';
import { AeoChrome } from '@/components/aeo/Chrome';
import {
  Breadcrumbs,
  CompactLakeCard,
  FaqBlock,
  JsonLd,
  MapCTA,
} from '@/components/aeo/ui';
import { hubBestLakesMN, lakesByState } from '@/lib/aeo/data';
import { CANONICAL_BASE, canonicalHubUrl, MN_HUB_PATH } from '@/lib/aeo/links';
import { breadcrumbSchema, faqSchema, hubItemListSchema } from '@/lib/aeo/schema';

const hub = hubBestLakesMN;
const lakes = lakesByState('MN');

export const metadata: Metadata = {
  title: `${hub.title} | Omnia Fishing`,
  description:
    'The best fishing lakes in Minnesota for 2026 — the most active waters by Omnia angler reports across walleye, bass, muskie, pike, and crappie, with DNR survey data plus live reports and a seasonal pattern guide for each.',
  alternates: { canonical: canonicalHubUrl(MN_HUB_PATH) },
  // Prototype lives on mjcreativelogic.com; canonical + indexable copy is the
  // production omniafishing.com page. Keep this copy out of the index.
  robots: { index: false, follow: true },
};

export default function BestFishingLakesMinnesota() {
  return (
    <AeoChrome>
      <JsonLd
        data={[
          hubItemListSchema(lakes, 'The Best Fishing Lakes in Minnesota 2026'),
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

        {/* Compact ranked grid (denser layout for a longer state list) */}
        <ol className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {lakes.map((l) => (
            <li key={l.slug}>
              <CompactLakeCard lake={l} />
            </li>
          ))}
        </ol>
        <p className="mt-3 text-xs text-slate-400">
          Showing {lakes.length} Minnesota{' '}
          {lakes.length === 1 ? 'lake' : 'lakes'} from Omnia&apos;s current prototype
          dataset. Drop in the full Minnesota top-20 (slugs + DNR data) and this grid
          fills out automatically.
        </p>

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
      </div>
    </AeoChrome>
  );
}
