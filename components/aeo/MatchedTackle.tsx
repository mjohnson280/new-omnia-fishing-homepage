// Presentational renderer for a MatchedTackleResult. PROPS-ONLY (no data fetching,
// no client hooks) so the exact same component renders in every surface: the shop
// collection page (server), the AEO answer block (server, inline + indexable), and
// the natural-language portal (client). Parents supply the data via the shared
// getMatchedTackle() resolver or the /api/matched-tackle endpoint.

import type { MatchedTackleResult } from '@/lib/aeo/tackle';

export function MatchedTackle({
  result,
  variant = 'full',
  heading,
}: {
  result: MatchedTackleResult;
  variant?: 'full' | 'compact';
  heading?: string;
}) {
  const { context, techniques } = result;
  if (techniques.length === 0) return null;

  // ── Compact: a tight "top baits from reports" block for the answer block ──
  if (variant === 'compact') {
    const items = techniques
      .flatMap((t) => t.products.map((p) => ({ ...p, technique: t.label })))
      .sort((a, b) => b.reportMentions - a.reportMentions)
      .slice(0, 3);
    return (
      <div className="rounded-btn border border-slate-200 bg-slate-50/70 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {heading ?? 'Top baits from reports'}
        </p>
        <ul className="mt-2 space-y-1.5">
          {items.map((p) => (
            <li key={p.id} className="flex items-baseline justify-between gap-3 text-sm">
              <a
                href={p.productUrl}
                target="_blank"
                rel="noopener"
                data-event="aeo_click_matched_product"
                className="font-medium text-slate-800 hover:text-brand"
              >
                {p.brand} {p.name}
              </a>
              <span className="shrink-0 text-xs text-slate-400">
                {p.technique} · {p.reportMentions} reports
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // ── Full: techniques ranked, products sorted by report mentions ──
  return (
    <div className="space-y-5">
      {heading && (
        <h2 className="text-2xl font-semibold text-slate-900">{heading}</h2>
      )}
      {techniques.map((t) => (
        <section key={t.slug}>
          <div className="flex items-baseline gap-2">
            <span className="text-xs font-bold tabular-nums text-brand">#{t.rank}</span>
            <h3 className="text-base font-semibold text-slate-900">{t.label}</h3>
          </div>
          <ul className="mt-2 divide-y divide-slate-100 overflow-hidden rounded-card border border-slate-200 bg-white">
            {t.products.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-4 px-4 py-2.5">
                <div className="min-w-0">
                  <a
                    href={p.productUrl}
                    target="_blank"
                    rel="noopener"
                    data-event="aeo_click_matched_product"
                    className="text-sm font-medium text-slate-800 hover:text-brand"
                  >
                    {p.brand} {p.name}
                  </a>
                  <p className="text-xs text-slate-400">
                    {p.reportMentions} mentions in {context.lakeName ?? 'this lake'} reports
                  </p>
                </div>
                <div className="shrink-0 text-sm font-semibold text-slate-700">
                  ${p.priceUsd.toFixed(2)}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
