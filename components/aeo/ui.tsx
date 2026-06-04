// AEO presentational components (build-spec Section 7).
//
// IMPORTANT: every one of these is a server component (no "use client"). All
// indexable content — answer blocks, tables, FAQ text, the ranked list, the
// internal lake links — must be in the initial server-rendered HTML. Native
// <details>/<summary> provides the "expand" affordance without client JS, so the
// detail tables stay crawlable even when collapsed.

import Link from 'next/link';
import type { FaqItem, Lake, Pattern } from '@/lib/aeo/types';
import { buildAnswerText, patternHeading } from '@/lib/aeo/format';
import {
  guidePath,
  lakeMapUrl,
  productLinks,
  shopBaitsUrl,
} from '@/lib/aeo/links';

// ── JSON-LD ──────────────────────────────────────────────────────────────────

export function JsonLd({ data }: { data: object | object[] }) {
  const blocks = Array.isArray(data) ? data : [data];
  return (
    <>
      {blocks.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  );
}

// ── Breadcrumbs ────────────────────────────────────────────────────────────

export function Breadcrumbs({ trail }: { trail: { name: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-slate-500">
      <ol className="flex flex-wrap items-center gap-1">
        {trail.map((c, i) => (
          <li key={c.name} className="flex items-center gap-1">
            {c.href ? (
              <Link href={c.href} className="hover:text-brand hover:underline">
                {c.name}
              </Link>
            ) : (
              <span className="text-slate-700">{c.name}</span>
            )}
            {i < trail.length - 1 && <span className="text-slate-300">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// ── Freshness line ───────────────────────────────────────────────────────────

export function FreshnessLine({
  updatedAt,
  reportCount,
  reportCountTrailing30,
}: {
  updatedAt: string;
  reportCount: number;
  reportCountTrailing30: number;
}) {
  return (
    <p className="text-sm text-slate-500">
      Updated{' '}
      <time dateTime={updatedAt} className="font-medium text-slate-700">
        {formatDate(updatedAt)}
      </time>{' '}
      · Synthesized from {reportCount.toLocaleString()} angler reports
      {reportCountTrailing30 > 0 && (
        <> ({reportCountTrailing30} in the last 30 days)</>
      )}
    </p>
  );
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  if (!y || !m || !d) return iso;
  return `${months[m - 1]} ${d}, ${y}`;
}

// ── Map CTA (required everywhere — spec Section 9.5) ──────────────────────────

export function MapCTA({
  variant = 'banner',
  mapUrl = productLinks.map,
}: {
  variant?: 'banner' | 'inline';
  mapUrl?: string;
}) {
  if (variant === 'inline') {
    return (
      <a
        href={mapUrl}
        data-event="aeo_click_map_inline"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-dark"
      >
        View this lake on the map →
      </a>
    );
  }

  return (
    <section className="rounded-card bg-brand px-6 py-8 text-white shadow-soft sm:px-10">
      <div className="mx-auto flex max-w-3xl flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Don&apos;t see your lake?</h2>
          <p className="mt-1 text-sm text-white/85">
            Pull up seasonal patterns for any of 100,000+ waterbodies.
          </p>
        </div>
        <a
          href={mapUrl}
          data-event="aeo_click_map_banner"
          className="shrink-0 rounded-btn bg-white px-5 py-3 text-sm font-semibold text-brand transition hover:bg-brand-light"
        >
          View your lake on the map →
        </a>
      </div>
    </section>
  );
}

// ── PRO upsell (shown only over gated content — spec Section 10) ──────────────

export function ProUpsell({ context }: { context?: string }) {
  return (
    <div className="rounded-btn border border-amber-200 bg-amber-50 px-4 py-3 text-sm">
      <p className="font-semibold text-amber-900">
        Unlock live water temp, clarity &amp; Navionics maps
      </p>
      <p className="mt-0.5 text-amber-800/80">
        {context ?? 'Real-time conditions and map layers are an Omnia PRO feature.'}
      </p>
      <a
        href={productLinks.pro}
        data-event="aeo_click_pro_upsell"
        className="mt-2 inline-flex font-semibold text-amber-900 underline underline-offset-4 hover:text-amber-700"
      >
        Start a PRO trial →
      </a>
    </div>
  );
}

// ── Detail table (one per pattern) ────────────────────────────────────────────

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr className="border-b border-slate-100 last:border-0">
      <th
        scope="row"
        className="w-40 py-2 pr-4 text-left align-top text-xs font-semibold uppercase tracking-wide text-slate-500"
      >
        {label}
      </th>
      <td className="py-2 text-sm text-slate-800">{children}</td>
    </tr>
  );
}

export function PatternTable({ pattern, lake }: { pattern: Pattern; lake: Lake }) {
  const forage = [pattern.forage.primary, pattern.forage.secondary]
    .filter(Boolean)
    .join(', ');
  const structures = [pattern.structures.primary, pattern.structures.secondary]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="mt-3 overflow-hidden rounded-btn border border-slate-200">
      <table className="w-full border-collapse">
        <caption className="sr-only">
          {patternHeading(pattern, lake.name)} — full pattern detail
        </caption>
        <tbody>
          <Row label="Water temp">
            {pattern.waterTempF.min}–{pattern.waterTempF.max}°F
          </Row>
          <Row label="Behavior">{capitalize(pattern.behavior)}</Row>
          <Row label="Key locations">{pattern.locations.join('; ')}</Row>
          <Row label="Best techniques">{pattern.techniques.join('; ')}</Row>
          <Row label="Forage">{forage}</Row>
          <Row label="Structure">{structures}</Row>
          <Row label="Bait colors">{pattern.baitColors.join(', ')}</Row>
          {pattern.isPro && (
            <tr>
              <th
                scope="row"
                className="w-40 py-2 pr-4 text-left align-top text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                Live data
              </th>
              <td className="py-3">
                <ProUpsell context="Current water temp, clarity, and wind for this lake update live for PRO members." />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ── Answer block (the core AEO unit — spec Section 5) ────────────────────────

export function AnswerBlock({ pattern, lake }: { pattern: Pattern; lake: Lake }) {
  const heading = patternHeading(pattern, lake.name);
  const answer = buildAnswerText(pattern, lake.name);

  return (
    <section
      id={pattern.anchorId}
      className="scroll-mt-24 rounded-card border border-slate-200 bg-white p-5 shadow-soft"
    >
      <h3 className="text-lg font-semibold capitalize text-slate-900">{heading}</h3>
      <p className="mt-2 leading-7 text-slate-700">{answer}</p>

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
        <a
          href={shopBaitsUrl(lake, pattern.species)}
          data-event="aeo_click_shop_baits"
          className="text-sm font-semibold text-brand hover:text-brand-dark"
        >
          Shop these baits →
        </a>
      </div>

      <details className="group mt-3">
        <summary className="cursor-pointer list-none text-sm font-semibold text-slate-600 hover:text-slate-900">
          <span className="inline-flex items-center gap-1">
            See full pattern
            <span className="transition group-open:rotate-180">▾</span>
          </span>
        </summary>
        <PatternTable pattern={pattern} lake={lake} />
      </details>
    </section>
  );
}

// ── Season section (groups answer blocks by species under one season) ─────────

export function SeasonSection({
  season,
  patterns,
  lake,
}: {
  season: string;
  patterns: Pattern[];
  lake: Lake;
}) {
  if (patterns.length === 0) return null;
  return (
    <section className="scroll-mt-24" id={`season-${season.toLowerCase()}`}>
      <h2 className="border-b border-slate-200 pb-2 text-2xl font-semibold text-slate-900">
        {season}
      </h2>
      <div className="mt-5 space-y-5">
        {patterns.map((p) => (
          <AnswerBlock key={p.anchorId} pattern={p} lake={lake} />
        ))}
      </div>
    </section>
  );
}

// ── Top active lakes (internal links, server-rendered) ───────────────────────

export function TopActiveLakes({ lakes }: { lakes: Lake[] }) {
  return (
    <section className="rounded-card border border-slate-200 bg-slate-50 p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        More top bass lakes
      </h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {lakes.map((l) => (
          <li key={l.slug}>
            <Link
              href={guidePath(l)}
              data-event="aeo_click_sibling_lake"
              className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-brand hover:text-brand"
            >
              {l.name}, {l.state}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ── Hub rank card (spec Section 7) ───────────────────────────────────────────

export function LakeRankCard({ lake }: { lake: Lake }) {
  return (
    <article
      id={`rank-${lake.rank}`}
      className="scroll-mt-24 rounded-card border border-slate-200 bg-white p-5 shadow-soft transition hover:border-brand/40"
    >
      <div className="flex gap-4">
        <div className="shrink-0 text-2xl font-bold tabular-nums text-brand">
          {String(lake.rank).padStart(2, '0')}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-slate-900">
            {lake.name}, {lake.state}
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">{lake.summary}</p>

          <dl className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
            <div className="flex gap-1.5">
              <dt className="font-semibold text-slate-500">Top species:</dt>
              <dd className="text-slate-700">{lake.stats.topSpecies.join(', ')}</dd>
            </div>
            <div className="flex gap-1.5">
              <dt className="font-semibold text-slate-500">Peak:</dt>
              <dd className="text-slate-700">{lake.peakSeason}</dd>
            </div>
            <div className="flex gap-1.5">
              <dt className="font-semibold text-slate-500">Best months:</dt>
              <dd className="text-slate-700">{lake.stats.bestMonths.join(', ')}</dd>
            </div>
            <div className="flex gap-1.5">
              <dt className="font-semibold text-slate-500">Based on:</dt>
              <dd className="text-slate-700">{lake.reportCount.toLocaleString()} reports</dd>
            </div>
          </dl>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link
              href={guidePath(lake)}
              data-event="aeo_click_guide_from_hub"
              className="text-sm font-semibold text-brand hover:text-brand-dark"
            >
              Read the {lake.name} guide →
            </Link>
            <a
              href={lakeMapUrl(lake)}
              data-event="aeo_click_map_from_hub_card"
              className="text-sm font-medium text-slate-500 hover:text-slate-800"
            >
              Open on the map
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

// ── FAQ block (renders Q/A; FAQPage JSON-LD emitted by the page) ──────────────

export function FaqBlock({ items, heading = 'FAQ' }: { items: FaqItem[]; heading?: string }) {
  return (
    <section className="scroll-mt-24" id="faq">
      <h2 className="text-2xl font-semibold text-slate-900">{heading}</h2>
      <dl className="mt-5 space-y-5">
        {items.map((it) => (
          <div key={it.question} className="rounded-card border border-slate-200 bg-white p-5">
            <dt className="font-semibold text-slate-900">{it.question}</dt>
            <dd
              className="mt-2 leading-7 text-slate-700"
              dangerouslySetInnerHTML={{ __html: it.answerHtml }}
            />
          </div>
        ))}
      </dl>
    </section>
  );
}

// ── Prototype/sample-data notice (handoff transparency) ──────────────────────

export function SampleDataNotice() {
  return (
    <p className="rounded-btn border border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-500">
      Prototype note: pattern data on this page is illustrative. In production,
      Omnia&apos;s synthesis pipeline replaces it with real per-lake patterns from
      angler reports.
    </p>
  );
}
