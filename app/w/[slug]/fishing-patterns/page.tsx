import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { AeoChrome } from '@/components/aeo/Chrome';
import {
  Breadcrumbs,
  FaqBlock,
  FreshnessLine,
  JsonLd,
  MapCTA,
  ProUpsell,
  SampleDataNotice,
  SeasonSection,
  TopActiveLakes,
} from '@/components/aeo/ui';
import { LAKES, getLake, siblingLakes } from '@/lib/aeo/data';
import type { FaqItem, Lake, Pattern, Season } from '@/lib/aeo/types';
import { buildAnswerText, seasonLabel } from '@/lib/aeo/format';
import { canonicalGuideUrl, lakeMapUrl, lakeTabUrl } from '@/lib/aeo/links';
import {
  breadcrumbSchema,
  faqSchema,
  lakeArticleSchema,
  lakeBreadcrumb,
  lakeDatasetSchema,
} from '@/lib/aeo/schema';

export const dynamicParams = false;

export function generateStaticParams() {
  return LAKES.map((l) => ({ slug: l.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const lake = getLake(params.slug);
  if (!lake) return {};
  return {
    title: `How to Fish ${lake.name}: Best Patterns & Techniques | Omnia Fishing`,
    description: `Season-by-season fishing patterns for ${lake.name}, ${lake.state} — best baits, techniques, depths, and bait colors by species, synthesized from ${lake.reportCount}+ angler reports.`,
    alternates: { canonical: canonicalGuideUrl(lake.slug) },
    robots: { index: false, follow: true },
  };
}

const SEASON_ORDER: Season[] = ['Spring', 'Summer', 'Fall', 'Winter', 'Ice'];

function groupBySeason(patterns: Pattern[]): { season: Season; patterns: Pattern[] }[] {
  return SEASON_ORDER.map((season) => ({
    season,
    patterns: patterns.filter((p) => p.season === season),
  })).filter((g) => g.patterns.length > 0);
}

function buildLakeFaq(lake: Lake): FaqItem[] {
  return lake.patterns.slice(0, 3).map((p) => ({
    question: `What's the best way to catch ${p.species.toLowerCase()} on ${lake.name} in ${seasonLabel(p.season, p.phase).toLowerCase()}?`,
    answerHtml: buildAnswerText(p, lake.name),
  }));
}

function toplineAnswer(lake: Lake): string {
  const headline = lake.stats.topSpecies[0]?.toLowerCase() ?? 'bass';
  return (
    `${lake.summary} The most productive stretch is ${lake.peakSeason.toLowerCase()} ` +
    `(${lake.stats.bestMonths.join(', ')}), with ${headline} the headline species. ` +
    `Below are season-by-season patterns by species, synthesized from ${lake.reportCount.toLocaleString()} angler reports.`
  );
}

const TABS = [
  { key: 'fishing-reports', label: 'Reports' },
  { key: 'fishing-patterns', label: 'Patterns' },
  { key: 'fish-species', label: 'Species' },
  { key: 'boat-ramps', label: 'Boat Ramps' },
] as const;

export default function LakeFishingPatterns({ params }: { params: { slug: string } }) {
  const lake = getLake(params.slug);
  if (!lake) notFound();

  const grouped = groupBySeason(lake.patterns);
  const faq = buildLakeFaq(lake);
  const siblings = siblingLakes(lake.slug);

  return (
    <AeoChrome>
      <JsonLd
        data={[
          lakeArticleSchema(lake),
          lakeDatasetSchema(lake),
          faqSchema(faq),
          breadcrumbSchema(lakeBreadcrumb(lake)),
        ]}
      />

      <div className="mx-auto max-w-container px-[var(--gutter)] py-8">
        <Breadcrumbs
          trail={[
            { name: 'Home', href: '/' },
            { name: 'Best Bass Lakes 2026', href: '/a/best-bass-lakes-2026' },
            { name: lake.name },
          ]}
        />

        {/* Lake tabs */}
        <nav aria-label="Lake sections" className="mt-4 flex flex-wrap gap-1 border-b border-slate-200">
          {TABS.map((tab) => {
            const active = tab.key === 'fishing-patterns';
            return active ? (
              <span
                key={tab.key}
                aria-current="page"
                className="border-b-2 border-brand px-4 py-2 text-sm font-semibold text-brand"
              >
                {tab.label}
              </span>
            ) : (
              <a
                key={tab.key}
                href={lakeTabUrl(lake.slug, tab.key)}
                className="border-b-2 border-transparent px-4 py-2 text-sm font-medium text-slate-500 hover:border-slate-300 hover:text-slate-800"
              >
                {tab.label}
              </a>
            );
          })}
        </nav>

        {/* Header + direct answer */}
        <header className="mt-6 max-w-3xl">
          <h1 className="text-3xl font-semibold leading-tight text-slate-900 md:text-4xl">
            How to Fish {lake.name}: Best Patterns &amp; Techniques
          </h1>
          <div className="mt-3">
            <FreshnessLine
              updatedAt={lake.updatedAt}
              reportCount={lake.reportCount}
              reportCountTrailing30={lake.reportCountTrailing30}
            />
          </div>
          <p className="mt-4 text-lg leading-8 text-slate-700">{toplineAnswer(lake)}</p>
          {lake.dataStatus === 'sample' && (
            <div className="mt-4">
              <SampleDataNotice />
            </div>
          )}
        </header>

        {/* Season TOC */}
        <nav
          aria-label="Jump to a season"
          className="mt-6 flex flex-wrap items-center gap-2 border-y border-slate-200 py-4"
        >
          <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Seasons:
          </span>
          {grouped.map((g) => (
            <a
              key={g.season}
              href={`#season-${g.season.toLowerCase()}`}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:border-brand hover:text-brand"
            >
              {g.season}
            </a>
          ))}
        </nav>

        {/* Season sections (answer block + detail table per species) */}
        <div className="mt-8 space-y-12">
          {grouped.map((g) => (
            <SeasonSection
              key={g.season}
              season={seasonLabel(g.season, g.patterns[0]?.phase ?? null)}
              patterns={g.patterns}
              lake={lake}
            />
          ))}
        </div>

        {/* Summary table */}
        <section className="mt-12 scroll-mt-24" id="summary">
          <h2 className="text-2xl font-semibold text-slate-900">Pattern summary</h2>
          <div className="mt-4 overflow-x-auto rounded-card border border-slate-200">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th scope="col" className="px-4 py-2.5">Season</th>
                  <th scope="col" className="px-4 py-2.5">Species</th>
                  <th scope="col" className="px-4 py-2.5">Structure</th>
                  <th scope="col" className="px-4 py-2.5">Forage</th>
                  <th scope="col" className="px-4 py-2.5">Bait colors</th>
                </tr>
              </thead>
              <tbody>
                {lake.patterns.map((p) => (
                  <tr key={p.anchorId} className="border-t border-slate-100">
                    <td className="px-4 py-2.5 text-slate-700">
                      {seasonLabel(p.season, p.phase)}
                    </td>
                    <td className="px-4 py-2.5 font-medium text-slate-800">
                      <a href={`#${p.anchorId}`} className="hover:text-brand hover:underline">
                        {p.species}
                      </a>
                    </td>
                    <td className="px-4 py-2.5 text-slate-700">{p.structures.primary}</td>
                    <td className="px-4 py-2.5 text-slate-700">{p.forage.primary}</td>
                    <td className="px-4 py-2.5 text-slate-700">{p.baitColors.join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {lake.patterns.some((p) => p.isPro) && (
            <div className="mt-4 max-w-xl">
              <ProUpsell context="Live water temp, clarity, wind, and Navionics / C-MAP layers for this lake are an Omnia PRO feature." />
            </div>
          )}
        </section>

        {/* Internal links to sibling lakes */}
        <div className="mt-12">
          <TopActiveLakes lakes={siblings} />
        </div>

        {/* Map CTA */}
        <div className="mt-8 flex flex-col items-start gap-3">
          <MapCTA variant="banner" mapUrl={lakeMapUrl(lake)} />
        </div>

        {/* FAQ */}
        <div className="mt-12">
          <FaqBlock items={faq} heading={`${lake.name} fishing FAQ`} />
        </div>

        {/* Back to hub */}
        <div className="mt-10 border-t border-slate-200 pt-6">
          <Link
            href="/a/best-bass-lakes-2026"
            className="text-sm font-semibold text-brand hover:text-brand-dark"
          >
            ← Back to the Best Bass Lakes of 2026
          </Link>
        </div>
      </div>
    </AeoChrome>
  );
}
