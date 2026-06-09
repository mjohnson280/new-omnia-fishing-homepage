// Renders one or more species-scoped lake rankings — the citable AEO unit of the
// Minnesota hub. SERVER COMPONENT (no "use client"): every ranking, blurb, and link
// is in the initial HTML so answer engines can read and cite the passage directly.
//
// Reusable: feed it MN_BASS_RANKINGS here, or a walleye config on a future page. The
// layout never forks.

import { guidePath, lakeTabUrl, mapDeepLink } from '@/lib/aeo/links';
import {
  resolveRanking,
  type SpeciesRanking,
} from '@/lib/aeo/mn-species';

function SpeciesSection({ ranking }: { ranking: SpeciesRanking }) {
  const lakes = resolveRanking(ranking);
  if (lakes.length === 0) return null;

  return (
    <section id={`best-${ranking.speciesKey}-lakes`} className="scroll-mt-24">
      <h2 className="text-2xl font-semibold text-slate-900">{ranking.title}</h2>

      {/* The quotable answer sentence — first prose under the H2, by design. */}
      <p className="mt-3 max-w-3xl leading-7 text-slate-700">{ranking.answer}</p>

      <ol className="mt-5 space-y-3">
        {lakes.map((l) => (
          <li
            key={l.slug}
            className="flex gap-4 rounded-card border border-slate-200 bg-white p-4 shadow-soft transition hover:border-brand/40"
          >
            <div className="shrink-0 pt-0.5 text-xl font-bold tabular-nums text-brand">
              {String(l.rank).padStart(2, '0')}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <h3 className="text-base font-semibold text-slate-900">{l.name}</h3>
                <span className="text-xs font-medium text-slate-400">
                  {l.reports.toLocaleString()} angler reports
                </span>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">{l.blurb}</p>
              <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                {/* Primary CTA: the seasonal pattern guide — but only when one exists. */}
                {l.hasGuide && (
                  <a
                    href={guidePath({ slug: l.slug })}
                    target="_blank"
                    rel="noopener"
                    data-event="mn_click_guide"
                    className="text-sm font-semibold text-brand hover:text-brand-dark"
                  >
                    Read the {l.name} guide →
                  </a>
                )}
                <a
                  href={mapDeepLink({ slug: l.slug, lat: l.lat, lng: l.lng })}
                  target="_blank"
                  rel="noopener"
                  data-event="mn_click_map"
                  className="inline-flex items-center gap-1.5 rounded-btn bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                >
                  Open on the map ↗
                </a>
                {/* Secondary: DNR survey data (every lake has this tab on prod). */}
                <a
                  href={lakeTabUrl(l.slug, 'fish-species')}
                  target="_blank"
                  rel="noopener"
                  data-event="mn_click_dnr"
                  className="text-sm font-medium text-slate-500 hover:text-slate-800"
                >
                  DNR survey data ↗
                </a>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function MnSpeciesRankings({ rankings }: { rankings: SpeciesRanking[] }) {
  const anySample = rankings.some((r) => r.isSample);
  return (
    <div className="space-y-12">
      {rankings.map((r) => (
        <SpeciesSection key={r.speciesKey} ranking={r} />
      ))}
      {anySample && (
        <p className="rounded-btn border border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-500">
          Prototype note: these per-species lake picks are curated from well-known
          Minnesota bass waters and are not yet verified against DNR survey data. In
          production, Omnia selects each list from real per-lake species data (DNR)
          blended with that species&apos; report volume. Report counts and map links are
          already live.
        </p>
      )}
    </div>
  );
}
