import type { Metadata } from 'next';
import Link from 'next/link';
import { AeoChrome } from '@/components/aeo/Chrome';
import { Breadcrumbs, JsonLd } from '@/components/aeo/ui';
import { FishSpeciesSurvey } from '@/components/aeo/FishSpeciesSurvey';
import { MN_LAKES } from '@/lib/aeo/mn-lakes';
import { getDnr } from '@/lib/aeo/dnr';
import { parseSlug } from '@/lib/aeo/centroid';
import { CANONICAL_BASE, MN_HUB_PATH, mapDeepLink } from '@/lib/aeo/links';
import { breadcrumbSchema, faqSchema } from '@/lib/aeo/schema';

// Per-lake fish-species page (the DNR spoke). Reference structure for the dev:
// it joins generated lake metadata (mn-lakes.ts) with DNR survey data (dnr.ts) by
// slug and renders the answer block + table. dynamicParams=true so any lake works;
// a handful prerender for the demo. DEV: drop the noindex + wire real DNR on prod.

export const dynamicParams = true;

// Prebuild the illustrative example + the top MN lakes; everything else renders
// on demand. DEV: on prod, generate from your full waterbody set.
export function generateStaticParams() {
  return MN_LAKES.slice(0, 8).map((l) => ({ slug: l.slug }));
}

function resolveLake(slug: string): { name: string; reports?: number; favorites?: number } {
  const mn = MN_LAKES.find((l) => l.slug === slug);
  if (mn) return { name: mn.name, reports: mn.reports, favorites: mn.favorites };
  return { name: parseSlug(slug).name };
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const { name } = resolveLake(params.slug);
  return {
    title: `${name} Fish Species: Minnesota DNR Survey & What's Biting | Omnia Fishing`,
    description: `Fish species in ${name} from the Minnesota DNR survey — abundance and size by species — paired with live Omnia angler reports and matched tackle.`,
    alternates: { canonical: `${CANONICAL_BASE}/w/${params.slug}/fish-species` },
    robots: { index: false, follow: true },
  };
}

export default function FishSpeciesPage({ params }: { params: { slug: string } }) {
  const { name, reports, favorites } = resolveLake(params.slug);
  const dnr = getDnr(params.slug);

  const faqAnswer = dnr
    ? `Minnesota DNR surveys show ${dnr.species
        .map((s) => s.species.toLowerCase())
        .slice(0, 6)
        .join(', ')} in ${name}.`
    : `${name} holds a range of game and panfish species; the Minnesota DNR survey detail is being added.`;

  const datasetSchema = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `${name} fish species (Minnesota DNR survey)`,
    description: `Fish species present in ${name} from Minnesota DNR survey data, with relative abundance and size structure, paired with Omnia angler reports.`,
    creator: { '@type': 'Organization', name: 'Minnesota DNR / Omnia Fishing' },
    variableMeasured: ['species', 'relative abundance', 'gill-net CPUE', 'trap-net CPUE', 'average length', 'max length'],
    ...(dnr?.lastSurveyYear ? { temporalCoverage: String(dnr.lastSurveyYear) } : {}),
  };

  return (
    <AeoChrome>
      <JsonLd
        data={[
          datasetSchema,
          faqSchema([{ question: `What fish are in ${name}?`, answerHtml: faqAnswer }]),
          breadcrumbSchema([
            { name: 'Home', url: `${CANONICAL_BASE}/` },
            { name: 'Best Fishing Lakes in Minnesota', url: `${CANONICAL_BASE}${MN_HUB_PATH}` },
            { name: name, url: `${CANONICAL_BASE}/w/${params.slug}/fish-species` },
          ]),
        ]}
      />

      <div className="mx-auto max-w-container px-[var(--gutter)] py-8">
        <Breadcrumbs
          trail={[
            { name: 'Home', href: '/' },
            { name: 'Best Fishing Lakes in Minnesota', href: MN_HUB_PATH },
            { name },
          ]}
        />

        <header className="mt-6 max-w-3xl">
          <h1 className="text-3xl font-semibold leading-tight text-slate-900 md:text-4xl">
            {name} Fish Species
          </h1>
          <p className="mt-3 text-lg leading-8 text-slate-700">
            What the Minnesota DNR survey shows, paired with what Omnia anglers are actually
            catching — the data a DNR-only directory can&apos;t give you.
          </p>
        </header>

        <div className="mt-8">
          <FishSpeciesSurvey
            lakeName={name}
            slug={params.slug}
            reports={reports}
            favorites={favorites}
            dnr={dnr}
          />
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap gap-3 border-t border-slate-200 pt-6">
          <a
            href={mapDeepLink({
              slug: params.slug,
              lat: MN_LAKES.find((l) => l.slug === params.slug)?.lat ?? 46.0,
              lng: MN_LAKES.find((l) => l.slug === params.slug)?.lng ?? -94.0,
            })}
            target="_blank"
            rel="noopener"
            data-event="fish_species_click_map"
            className="inline-flex items-center gap-1.5 rounded-btn bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Open {name} on the map ↗
          </a>
          <Link
            href={MN_HUB_PATH}
            data-event="fish_species_click_hub"
            className="inline-flex items-center rounded-btn border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            ← All Minnesota fishing lakes
          </Link>
        </div>
      </div>
    </AeoChrome>
  );
}
