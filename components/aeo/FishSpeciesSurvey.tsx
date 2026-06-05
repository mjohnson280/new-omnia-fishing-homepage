// Per-lake fish-species spoke — the head-to-head answer vs. DNR-only directories.
// Renders a server-side answer block + a structured DNR species table, FUSED with
// Omnia angler activity (reports/favorites). Props-only; the page supplies the DNR
// survey (lib/aeo/dnr.ts) and the activity numbers (lib/aeo/mn-lakes.ts).
//
// DEV: when DNR data is absent the component shows an explicit pending state, so
// it's safe to ship before every lake's DNR is wired. Per-species links point at
// the matched-tackle shop collection (the "what to throw" spoke).

import { SampleDataNotice } from './ui';
import type { DnrSurvey } from '@/lib/aeo/dnr';

export function FishSpeciesSurvey({
  lakeName,
  slug,
  reports,
  favorites,
  dnr,
}: {
  lakeName: string;
  slug: string;
  reports?: number;
  favorites?: number;
  dnr?: DnrSurvey;
}) {
  const activity =
    reports != null
      ? ` Omnia anglers have filed ${reports.toLocaleString()} fishing reports${
          favorites != null ? ` and saved it ${favorites.toLocaleString()} times` : ''
        }.`
      : '';

  const answer = dnr
    ? `Minnesota DNR surveys of ${lakeName}${
        dnr.lastSurveyYear ? ` (${dnr.lastSurveyYear})` : ''
      } show ${joinSpecies(dnr.species.map((s) => s.species))}.${activity}`
    : `${lakeName} holds a range of game and panfish species.${activity} Minnesota DNR survey detail for this lake is being added.`;

  return (
    <div>
      {/* Answer block (the passage answer engines lift) */}
      <section className="scroll-mt-24 rounded-card border border-slate-200 bg-white p-5 shadow-soft">
        <h2 className="text-lg font-semibold text-slate-900">
          What fish are in {lakeName}?
        </h2>
        <p className="mt-2 leading-7 text-slate-700">{answer}</p>
        {dnr?.isSample && (
          <div className="mt-3">
            <SampleDataNotice />
          </div>
        )}
      </section>

      {/* Survey summary + species table */}
      {dnr ? (
        <section className="mt-6">
          <dl className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-600">
            {dnr.surveyType && <SummaryItem label="Survey" value={dnr.surveyType} />}
            {dnr.lastSurveyYear && (
              <SummaryItem label="Year" value={String(dnr.lastSurveyYear)} />
            )}
            {dnr.acreage && (
              <SummaryItem label="Acreage" value={dnr.acreage.toLocaleString()} />
            )}
            {dnr.maxDepthFt && (
              <SummaryItem label="Max depth" value={`${dnr.maxDepthFt} ft`} />
            )}
            {dnr.waterClarityFt && (
              <SummaryItem label="Clarity" value={`${dnr.waterClarityFt} ft`} />
            )}
          </dl>

          <div className="mt-4 overflow-x-auto rounded-card border border-slate-200">
            <table className="w-full border-collapse text-sm">
              <caption className="sr-only">
                {lakeName} fish species from Minnesota DNR survey
              </caption>
              <thead>
                <tr className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th scope="col" className="px-3 py-2.5">Species</th>
                  <th scope="col" className="px-3 py-2.5">Abundance</th>
                  <th scope="col" className="px-3 py-2.5 text-right">Gill-net CPUE</th>
                  <th scope="col" className="px-3 py-2.5 text-right">Trap-net CPUE</th>
                  <th scope="col" className="px-3 py-2.5 text-right">Avg / max length</th>
                  <th scope="col" className="px-3 py-2.5 text-right">Tackle</th>
                </tr>
              </thead>
              <tbody>
                {dnr.species.map((s) => (
                  <tr key={s.speciesParam} className="border-t border-slate-100">
                    <td className="px-3 py-2.5 font-medium text-slate-800">{s.species}</td>
                    <td className="px-3 py-2.5 text-slate-700">{s.abundanceRating ?? '—'}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-slate-700">
                      {s.gillNetCpue ?? '—'}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-slate-700">
                      {s.trapNetCpue ?? '—'}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-slate-700">
                      {fmtLen(s.avgLengthIn)} / {fmtLen(s.maxLengthIn)}
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <a
                        href={`/shop/lake/${slug}/${s.speciesParam}`}
                        target="_blank"
                        rel="noopener"
                        data-event="fish_species_click_tackle"
                        className="font-semibold text-brand hover:text-brand-dark"
                      >
                        Baits ↗
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {dnr.source && (
            <p className="mt-2 text-xs text-slate-400">Source: {dnr.source}</p>
          )}
        </section>
      ) : (
        <section className="mt-6 rounded-card border border-dashed border-slate-300 bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-700">DNR survey data coming soon</p>
          <p className="mt-1 text-sm text-slate-500">
            The Minnesota DNR fish-species survey for {lakeName} (species, abundance, and
            size structure) wires in here. The structure above renders it automatically
            once the data is supplied for this lake.
          </p>
        </section>
      )}
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-1.5">
      <dt className="font-semibold text-slate-500">{label}:</dt>
      <dd className="text-slate-700">{value}</dd>
    </div>
  );
}

function fmtLen(n?: number): string {
  return n != null ? `${n}"` : '—';
}

function joinSpecies(list: string[]): string {
  const names = list.map((s) => s.toLowerCase());
  if (names.length <= 1) return names[0] ?? 'multiple species';
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`;
}
