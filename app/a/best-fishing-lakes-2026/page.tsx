import type { Metadata } from 'next';
import { AeoChrome } from '@/components/aeo/Chrome';
import {
  Breadcrumbs,
  FaqBlock,
  JsonLd,
  LakeRankCard,
  MapCTA,
} from '@/components/aeo/ui';
import { hubTopLakes2026, lakesByRank } from '@/lib/aeo/data';
import { canonicalHubUrl, HUB_PATH } from '@/lib/aeo/links';
import {
  breadcrumbSchema,
  faqSchema,
  hubBreadcrumb,
  hubItemListSchema,
} from '@/lib/aeo/schema';

const hub = hubTopLakes2026;
const lakes = lakesByRank();

export const metadata: Metadata = {
  title: `${hub.title} | Omnia Fishing`,
  description:
    'The top fishing lakes in America for 2026 — the most active waters by Omnia angler reports across every species, ranked from 20,000+ reports, with full seasonal pattern guides and matched tackle for each.',
  alternates: { canonical: canonicalHubUrl() },
  // Prototype lives on mjcreativelogic.com; the canonical + indexable copy is the
  // production omniafishing.com page. Keep this copy out of the index.
  robots: { index: false, follow: true },
};

export default function TopFishingLakesHub() {
  return (
    <AeoChrome>
      <JsonLd
        data={[
          hubItemListSchema(lakes),
          faqSchema(hub.faq),
          breadcrumbSchema(hubBreadcrumb(hub)),
        ]}
      />

      <div className="mx-auto max-w-container px-[var(--gutter)] py-10">
        <Breadcrumbs
          trail={[
            { name: 'Home', href: '/' },
            { name: 'Articles' },
            { name: 'Top Fishing Lakes in America' },
          ]}
        />

        {/* Hero / direct answer */}
        <header className="mt-5 max-w-3xl">
          <h1 className="text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">
            {hub.title}
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-700">{hub.intro}</p>
        </header>

        {/* Jump nav */}
        <nav
          aria-label="Jump to a lake"
          className="mt-6 flex flex-wrap items-center gap-2 border-y border-slate-200 py-4"
        >
          <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Jump to:
          </span>
          {lakes.map((l) => (
            <a
              key={l.slug}
              href={`#rank-${l.rank}`}
              className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 hover:border-brand hover:text-brand"
            >
              {l.rank}
            </a>
          ))}
          <a
            href="#methodology"
            className="ml-1 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white hover:bg-slate-700"
          >
            Methodology
          </a>
        </nav>

        {/* Ranked list */}
        <ol className="mt-8 space-y-4">
          {lakes.map((l) => (
            <li key={l.slug}>
              <LakeRankCard lake={l} />
            </li>
          ))}
        </ol>

        {/* Map CTA banner */}
        <div className="mt-10">
          <MapCTA variant="banner" />
        </div>

        {/* Methodology */}
        <section id="methodology" className="mt-10 scroll-mt-24 max-w-3xl">
          <h2 className="text-2xl font-semibold text-slate-900">How we ranked these lakes</h2>
          <p className="mt-3 leading-7 text-slate-700">{hub.methodology}</p>
        </section>

        {/* FAQ */}
        <div className="mt-10">
          <FaqBlock items={hub.faq} />
        </div>
      </div>
    </AeoChrome>
  );
}
