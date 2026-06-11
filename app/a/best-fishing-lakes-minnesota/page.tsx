import type { Metadata } from 'next';
import { AeoChrome } from '@/components/aeo/Chrome';
import {
  Breadcrumbs,
  CanonicalLakeCard,
  FaqBlock,
  JsonLd,
  MapCTA,
} from '@/components/aeo/ui';
import { MnSpeciesRankings } from '@/components/aeo/MnSpeciesRanking';
import { hubBestLakesMN } from '@/lib/aeo/data';
import { MN_LAKES } from '@/lib/aeo/mn-lakes';
import { MN_BASS_RANKINGS, mnHubLakes } from '@/lib/aeo/mn-species';
import {
  CANONICAL_BASE,
  canonicalHubUrl,
  lakeTabUrl,
  MN_HUB_PATH,
  productLinks,
} from '@/lib/aeo/links';
import { breadcrumbSchema, faqSchema } from '@/lib/aeo/schema';

const hub = hubBestLakesMN;
const ALL_LAKES_PATH = `${MN_HUB_PATH}/all-lakes`;
const TOP_N = 20;

// Other species we cover but don't yet feature with their own page. Each links into
// the map filtered by species; dedicated /a/best-{species}-lakes-minnesota pages reuse
// the same <MnSpeciesRankings> component when we build them.
const OTHER_SPECIES: { label: string; param: string }[] = [
  { label: 'Walleye', param: 'walleye' },
  { label: 'Muskie', param: 'muskie' },
  { label: 'Northern Pike', param: 'northern_pike' },
  { label: 'Crappie & Panfish', param: 'crappie' },
];

export const metadata: Metadata = {
  title: `Best Fishing Lakes in Minnesota 2026 | Omnia Fishing`,
  description:
    "Minnesota's most active fishing lakes, ranked from real Omnia angler reports across every species and paired with Minnesota DNR fish-species data and the map. Plus Omnia's best largemouth and smallmouth bass lakes in the state.",
  alternates: { canonical: canonicalHubUrl(MN_HUB_PATH) },
  robots: { index: false, follow: true },
};

export default function BestFishingLakesMinnesota() {
  // PRIMARY list — lake-first, ranked by all-site activity (mirrors the national hub).
  const primaryLakes = mnHubLakes(TOP_N);

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Best Fishing Lakes in Minnesota 2026',
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: primaryLakes.length,
    itemListElement: primaryLakes.map((l, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: l.name,
      url: l.hasGuide
        ? `${CANONICAL_BASE}/w/${l.slug}/fishing-patterns`
        : `${CANONICAL_BASE}/w/${l.slug}/fish-species`,
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
          ranks each lake by what anglers actually report catching, then pairs it with the
          same DNR data — so you get not just <em>what&apos;s in the lake</em>, but{' '}
          <em>where it&apos;s really biting</em> and what to throw.
        </p>

        {/* PRIMARY: lake-first ranked list — same CanonicalLakeCard as the national hub */}
        <section className="mt-10 scroll-mt-24" id="most-active">
          <h2 className="text-2xl font-semibold text-slate-900">
            The {TOP_N} most active fishing lakes in Minnesota
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Ranked across all species by Omnia angler activity. Each lake links to its
            seasonal pattern guide, its Minnesota DNR fish-species data, and the map.
          </p>
          <ol className="mt-6 space-y-4">
            {primaryLakes.map((l) => (
              <li key={l.slug}>
                <CanonicalLakeCard data={l} />
              </li>
            ))}
          </ol>

          <a
            href={ALL_LAKES_PATH}
            data-event="mn_click_all_lakes"
            className="mt-6 inline-flex items-center gap-1.5 rounded-btn bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Browse all {MN_LAKES.length} Minnesota lakes →
          </a>
        </section>

        {/* Map CTA banner */}
        <div className="mt-12">
          <MapCTA variant="banner" />
        </div>

        {/* BASS-FOCUSED CONTENT — the editorial lens, AFTER the lake-first structure.
            Citable per-species answer passages; reuses the config-driven component. */}
        <section className="mt-12 scroll-mt-24" id="best-bass-lakes">
          <h2 className="text-2xl font-semibold text-slate-900">
            Minnesota&apos;s best bass lakes, by species
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Bass is where Minnesota&apos;s report volume concentrates, so here&apos;s the
            detail: Omnia&apos;s top largemouth and smallmouth waters, each with a
            one-line read and a link into the lake.
          </p>
          <div className="mt-6">
            <MnSpeciesRankings rankings={MN_BASS_RANKINGS} />
          </div>
        </section>

        {/* Other species — same structure, separate pages (coming) */}
        <section className="mt-12 scroll-mt-24" id="other-species">
          <h2 className="text-xl font-semibold text-slate-900">
            Fishing for something other than bass?
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Bass is our focus, but Minnesota&apos;s lakes run deep across every species.
            Jump into the map filtered by what you&apos;re after — dedicated
            best-of-Minnesota guides for these are on the way.
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {OTHER_SPECIES.map((s) => (
              <li key={s.param}>
                <a
                  href={`${productLinks.map}?species=${s.param}`}
                  target="_blank"
                  rel="noopener"
                  data-event="mn_click_other_species"
                  className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-brand hover:text-brand"
                >
                  {s.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* Methodology */}
        <section id="methodology" className="mt-12 scroll-mt-24 max-w-3xl">
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
