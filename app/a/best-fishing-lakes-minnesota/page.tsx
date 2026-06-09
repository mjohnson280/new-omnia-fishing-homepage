import type { Metadata } from 'next';
import { AeoChrome } from '@/components/aeo/Chrome';
import { Breadcrumbs, FaqBlock, JsonLd, MapCTA } from '@/components/aeo/ui';
import { MnSpeciesRankings } from '@/components/aeo/MnSpeciesRanking';
import { getLake, hubBestLakesMN } from '@/lib/aeo/data';
import { MN_LAKES } from '@/lib/aeo/mn-lakes';
import { MN_BASS_RANKINGS, resolveRanking } from '@/lib/aeo/mn-species';
import {
  CANONICAL_BASE,
  canonicalHubUrl,
  guidePath,
  lakeTabUrl,
  mapDeepLink,
  MN_HUB_PATH,
  productLinks,
} from '@/lib/aeo/links';
import { breadcrumbSchema, faqSchema } from '@/lib/aeo/schema';

const hub = hubBestLakesMN;
const ALL_LAKES_PATH = `${MN_HUB_PATH}/all-lakes`;
const TOP_N = 50;

// Other species we cover but don't yet feature with their own page. Each links into
// the map filtered by species; dedicated /a/best-{species}-lakes-minnesota pages reuse
// the same <MnSpeciesRankings> component when we build them.
const OTHER_SPECIES: { label: string; param: string }[] = [
  { label: 'Walleye', param: 'walleye' },
  { label: 'Muskie', param: 'muskie' },
  { label: 'Northern Pike', param: 'northern_pike' },
  { label: 'Crappie & Panfish', param: 'crappie' },
];

// Featured bass lakes (union across both bass rankings, deduped) — the structured
// ItemList for the page points at each lake's fish-species spoke.
const featuredBassLakes = (() => {
  const seen = new Set<string>();
  const out: { slug: string; name: string }[] = [];
  for (const ranking of MN_BASS_RANKINGS) {
    for (const lake of resolveRanking(ranking)) {
      if (seen.has(lake.slug)) continue;
      seen.add(lake.slug);
      out.push({ slug: lake.slug, name: lake.name });
    }
  }
  return out;
})();

export const metadata: Metadata = {
  title: `Best Bass Lakes in Minnesota 2026 | Omnia Fishing`,
  description:
    'The best bass fishing lakes in Minnesota — ranked largemouth and smallmouth waters from real Omnia angler reports, each paired with Minnesota DNR fish-species data and the map. Plus the 50 most active lakes statewide.',
  alternates: { canonical: canonicalHubUrl(MN_HUB_PATH) },
  robots: { index: false, follow: true },
};

export default function BestFishingLakesMinnesota() {
  const topLakes = MN_LAKES.slice(0, TOP_N);

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Best Bass Lakes in Minnesota 2026',
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: featuredBassLakes.length,
    itemListElement: featuredBassLakes.map((l, i) => ({
      '@type': 'ListItem',
      position: i + 1,
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
            { name: 'Best Bass Lakes in Minnesota' },
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
          <em>where the bass are really biting</em> and what to throw.
        </p>

        {/* Bass rankings — the citable AEO core */}
        <section className="mt-10 scroll-mt-24" id="best-bass-lakes">
          <MnSpeciesRankings rankings={MN_BASS_RANKINGS} />
        </section>

        {/* Other species — same structure, separate pages (coming) */}
        <section className="mt-10 scroll-mt-24" id="other-species">
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

        {/* Map CTA banner */}
        <div className="mt-12">
          <MapCTA variant="banner" />
        </div>

        {/* Top 50 most active lakes — the "popular lakes" index, server-rendered */}
        <section className="mt-12 scroll-mt-24" id="most-active">
          <h2 className="text-2xl font-semibold text-slate-900">
            The {TOP_N} most active fishing lakes in Minnesota
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Ranked across all species by Omnia angler report volume. Each links to its DNR
            fish-species data and the map.
          </p>
          <ol className="mt-5 grid gap-2 sm:grid-cols-2">
            {topLakes.map((l) => {
              // Prefer the seasonal pattern guide when one exists; otherwise the
              // name falls back to the lake's DNR survey tab.
              const hasGuide = Boolean(getLake(l.slug));
              return (
                <li
                  key={l.slug}
                  className="flex items-center gap-3 rounded-btn border border-slate-200 bg-white px-3 py-2.5 text-sm transition hover:border-brand/40"
                >
                  <span className="w-7 shrink-0 text-right font-bold tabular-nums text-brand">
                    {l.rank}
                  </span>
                  <a
                    href={hasGuide ? guidePath({ slug: l.slug }) : lakeTabUrl(l.slug, 'fish-species')}
                    target="_blank"
                    rel="noopener"
                    data-event={hasGuide ? 'mn_click_guide' : 'mn_click_dnr'}
                    className="min-w-0 flex-1 truncate font-medium text-slate-800 hover:text-brand"
                  >
                    {l.name.trim()}
                    {hasGuide && <span className="ml-1.5 text-xs font-normal text-brand">· Guide</span>}
                  </a>
                  <span className="shrink-0 text-xs tabular-nums text-slate-400">
                    {l.reports.toLocaleString()} reports
                  </span>
                  <a
                    href={mapDeepLink({ slug: l.slug, lat: l.lat, lng: l.lng })}
                    target="_blank"
                    rel="noopener"
                    data-event="mn_click_map"
                    className="shrink-0 text-xs font-semibold text-slate-500 hover:text-slate-800"
                  >
                    Map ↗
                  </a>
                </li>
              );
            })}
          </ol>

          <a
            href={ALL_LAKES_PATH}
            data-event="mn_click_all_lakes"
            className="mt-5 inline-flex items-center gap-1.5 rounded-btn bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Browse all {MN_LAKES.length} Minnesota lakes →
          </a>
        </section>

        {/* Methodology */}
        <section id="methodology" className="mt-12 scroll-mt-24 max-w-3xl">
          <h2 className="text-2xl font-semibold text-slate-900">
            How we ranked Minnesota&apos;s bass lakes
          </h2>
          <p className="mt-3 leading-7 text-slate-700">{hub.methodology}</p>
        </section>

        {/* FAQ */}
        <div className="mt-10">
          <FaqBlock items={hub.faq} heading="Minnesota bass fishing FAQ" />
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
