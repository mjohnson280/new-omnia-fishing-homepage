import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { AeoChrome } from '@/components/aeo/Chrome';
import { Breadcrumbs, JsonLd } from '@/components/aeo/ui';
import { MatchedTackle } from '@/components/aeo/MatchedTackle';
import { LAKES, getLake } from '@/lib/aeo/data';
import { speciesParam } from '@/lib/aeo/format';
import { getMatchedTackle } from '@/lib/aeo/tackle';
import {
  CANONICAL_BASE,
  canonicalGuideUrl,
  guidePath,
  mapTechniquesUrl,
} from '@/lib/aeo/links';

// Reference contextual-commerce page — the same matched-tackle engine the map's
// top_techniques tab uses, rendered as an indexable shop collection. Devs wire
// getMatchedTackle() to the real recommendation API and drop the noindex.

type Params = { slug: string; species: string };
type Search = { season_group?: string };

export function generateStaticParams(): Params[] {
  return LAKES.flatMap((l) =>
    l.stats.topSpecies.map((s) => ({ slug: l.slug, species: speciesParam(s) })),
  );
}

export function generateMetadata({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Search;
}): Metadata {
  const lake = getLake(params.slug);
  if (!lake) return {};
  const seasonGroup = (searchParams.season_group ?? lake.peakSeason).toLowerCase();
  const { context } = getMatchedTackle({
    waterbodySlug: lake.slug,
    species: params.species,
    seasonGroup,
  });
  const season = cap(seasonGroup);
  return {
    title: `Best Baits for ${context.species} on ${lake.name} — ${season} | Omnia Fishing`,
    description: `The top baits and techniques for ${context.species.toLowerCase()} on ${lake.name}, ${lake.state} in ${season.toLowerCase()}, ranked by Omnia angler report mentions.`,
    alternates: {
      canonical: `${CANONICAL_BASE}/shop/lake/${lake.slug}/${context.speciesParam}?season_group=${seasonGroup}`,
    },
    robots: { index: false, follow: true },
  };
}

export default function ShopLakeSpecies({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Search;
}) {
  const lake = getLake(params.slug);
  if (!lake) notFound();

  const seasonGroup = (searchParams.season_group ?? lake.peakSeason).toLowerCase();
  const result = getMatchedTackle({
    waterbodySlug: lake.slug,
    species: params.species,
    seasonGroup,
  });
  const { context, techniques } = result;
  const season = cap(seasonGroup);

  const products = techniques.flatMap((t) => t.products);
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Best baits for ${context.species} on ${lake.name} (${season})`,
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: `${p.brand} ${p.name}`,
        brand: { '@type': 'Brand', name: p.brand },
        url: p.productUrl,
        offers: {
          '@type': 'Offer',
          price: p.priceUsd,
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
        },
      },
    })),
  };

  return (
    <AeoChrome>
      <JsonLd data={itemList} />

      <div className="mx-auto max-w-container px-[var(--gutter)] py-8">
        <Breadcrumbs
          trail={[
            { name: 'Home', href: '/' },
            { name: 'Top Fishing Lakes in America', href: '/a/best-fishing-lakes-2026' },
            { name: lake.name, href: guidePath(lake) },
            { name: `${context.species} baits` },
          ]}
        />

        <header className="mt-6 max-w-3xl">
          <h1 className="text-3xl font-semibold leading-tight text-slate-900 md:text-4xl">
            Best Baits for {context.species} on {lake.name}
          </h1>
          <p className="mt-3 text-lg leading-8 text-slate-700">
            The top techniques for {context.species.toLowerCase()} on {lake.name} in{' '}
            {season.toLowerCase()}, with the baits Omnia anglers mention most in their
            reports for this lake — ranked by technique, then by report mentions.
          </p>
          <p className="mt-2 text-xs text-slate-400">
            Prototype note: catalog and report-mention counts are mock data. In
            production this renders Omnia&apos;s real recommendation API
            {context.source === 'species-default' && (
              <> (techniques here use a species default — this lake has no tagged pattern yet)</>
            )}
            .
          </p>
        </header>

        {/* Season switcher */}
        <nav
          aria-label="Season"
          className="mt-6 flex flex-wrap items-center gap-2 border-y border-slate-200 py-4"
        >
          <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Season:
          </span>
          {['spring', 'summer', 'fall', 'winter'].map((s) => {
            const active = s === seasonGroup;
            return (
              <Link
                key={s}
                href={`/shop/lake/${lake.slug}/${context.speciesParam}?season_group=${s}`}
                className={
                  active
                    ? 'rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white'
                    : 'rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:border-brand hover:text-brand'
                }
              >
                {cap(s)}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8">
          <MatchedTackle result={result} />
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap gap-3 border-t border-slate-200 pt-6">
          <a
            href={mapTechniquesUrl(lake, {
              species: context.species,
              seasonGroup: context.seasonGroup,
            })}
            target="_blank"
            rel="noopener"
            data-event="shop_click_map_techniques"
            className="inline-flex items-center gap-1.5 rounded-btn bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            See these techniques on the map ↗
          </a>
          <Link
            href={guidePath(lake)}
            data-event="shop_click_guide"
            className="inline-flex items-center rounded-btn border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Read the {lake.name} pattern guide →
          </Link>
        </div>

        <p className="mt-6 text-xs text-slate-400">
          Canonical (production):{' '}
          <code className="text-slate-500">{canonicalGuideUrl(lake.slug)}</code>
        </p>
      </div>
    </AeoChrome>
  );
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
