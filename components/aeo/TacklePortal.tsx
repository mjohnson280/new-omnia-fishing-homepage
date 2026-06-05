'use client';

import { useState } from 'react';
import { MatchedTackle } from './MatchedTackle';
import type { MatchedTackleResult, ParsedTackleQuery } from '@/lib/aeo/tackle';

// Natural-language front door to the matched-tackle engine. Sends free text to
// /api/matched-tackle?q=… (the server parses + matches) and renders the result.
// The parse is deterministic today; production routes `q` through an LLM (Vercel
// AI Gateway) so it handles typos, paraphrase, and environmental phrasing.

const EXAMPLES = [
  'Smallmouth on Mille Lacs in summer',
  'What should I throw for largemouth on Guntersville in spring?',
  'Fall walleye baits for Mille Lacs',
  'Muskie on Lake Minnetonka',
];

interface ApiResponse {
  parsed?: ParsedTackleQuery;
  result?: MatchedTackleResult;
  error?: string;
}

export function TacklePortal() {
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MatchedTackleResult | null>(null);
  const [parsed, setParsed] = useState<ParsedTackleQuery | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run(query: string) {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/matched-tackle?q=${encodeURIComponent(query)}`);
      const data: ApiResponse = await res.json();
      setParsed(data.parsed ?? null);
      if (!res.ok || !data.result) {
        setResult(null);
        setError(data.error ?? 'Something went wrong.');
      } else {
        setResult(data.result);
      }
    } catch {
      setError('Network error — try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-container px-[var(--gutter)] py-10">
      <header className="max-w-3xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">
          Tackle Match
        </p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">
          Tell us where you&apos;re fishing.
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-700">
          Describe your trip in plain language — species, lake, and season — and we&apos;ll
          match the techniques and baits Omnia anglers are using there, ranked by what&apos;s
          working in real reports.
        </p>
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          run(q);
        }}
        className="mt-7 flex max-w-2xl flex-col gap-3 sm:flex-row"
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="e.g. smallmouth on Mille Lacs in summer"
          aria-label="Describe your fishing trip"
          className="flex-1 rounded-[10px] border border-black/15 px-4 py-3 text-sm text-slate-800 outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
        />
        <button
          type="submit"
          disabled={loading}
          data-event="tackle_portal_submit"
          className="rounded-[10px] bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50"
        >
          {loading ? 'Matching…' : 'Match my tackle'}
        </button>
      </form>

      <div className="mt-3 flex flex-wrap gap-2">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            onClick={() => {
              setQ(ex);
              run(ex);
            }}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-brand hover:text-brand"
          >
            {ex}
          </button>
        ))}
      </div>

      {/* Interpreted query */}
      {parsed && (
        <div className="mt-8 rounded-card border border-slate-200 bg-slate-50 p-4 text-sm">
          <span className="font-semibold text-slate-500">Interpreted as: </span>
          {[
            parsed.species,
            parsed.lakeName,
            parsed.seasonGroup ? cap(parsed.seasonGroup) : null,
          ]
            .filter(Boolean)
            .map((v, i) => (
              <span
                key={i}
                className="mr-2 inline-flex rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200"
              >
                {v}
              </span>
            ))}
          {parsed.missing.length > 0 && (
            <p className="mt-2 text-slate-500">
              Couldn&apos;t identify a {parsed.missing.join(' or ')} — try naming a specific
              lake and species.
            </p>
          )}
        </div>
      )}

      {error && !result && (
        <p className="mt-6 rounded-btn border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900">
            {result.context.species} on {result.context.lakeName} —{' '}
            {cap(result.context.seasonGroup)}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Ranked by technique, then by report mentions on this lake.
          </p>
          <div className="mt-5">
            <MatchedTackle result={result} />
          </div>
        </div>
      )}

      <p className="mt-10 border-t border-slate-200 pt-6 text-xs text-slate-400">
        Prototype: the query parser is deterministic (matches known lakes + species).
        Production routes the query through an LLM (Vercel AI Gateway) and the match
        through Omnia&apos;s real recommendation API.
      </p>
    </div>
  );
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
