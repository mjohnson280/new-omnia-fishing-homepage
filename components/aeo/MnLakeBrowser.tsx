'use client';

import { useMemo, useState } from 'react';
import type { MnLake } from '@/lib/aeo/mn-lakes';
import { lakeTabUrl, mapDeepLink } from '@/lib/aeo/links';

// Searchable / sortable directory of all 500 MN lakes. The initial (unfiltered,
// rank-sorted) render is server-rendered into the HTML, so the full list is
// crawlable for AEO; the search + sort are client-only refinements after hydration.
//
// The competitive wedge vs. DNR-only directories: every row links to the lake's
// DNR fish-species page AND shows Omnia angler activity (reports + favorites) that
// a static DNR republisher doesn't have.

type SortKey = 'rank' | 'reports' | 'favorites' | 'name';

export function MnLakeBrowser({ lakes }: { lakes: MnLake[] }) {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('rank');

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q ? lakes.filter((l) => l.name.toLowerCase().includes(q)) : lakes;
    const sorted = [...filtered].sort((a, b) => {
      switch (sortKey) {
        case 'reports':
          return b.reports - a.reports;
        case 'favorites':
          return b.favorites - a.favorites;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return a.rank - b.rank;
      }
    });
    return sorted;
  }, [lakes, query, sortKey]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search 500 Minnesota lakes…"
          aria-label="Search Minnesota lakes"
          className="w-full rounded-[10px] border border-black/15 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-brand focus:ring-2 focus:ring-brand/30 sm:max-w-xs"
        />
        <div className="flex items-center gap-1.5 text-xs">
          <span className="font-semibold text-slate-500">Sort:</span>
          {(['rank', 'reports', 'favorites', 'name'] as SortKey[]).map((k) => (
            <button
              key={k}
              onClick={() => setSortKey(k)}
              className={
                k === sortKey
                  ? 'rounded-full bg-slate-900 px-2.5 py-1 font-semibold text-white'
                  : 'rounded-full border border-slate-200 bg-white px-2.5 py-1 font-medium text-slate-600 hover:border-brand hover:text-brand'
              }
            >
              {k === 'rank' ? 'Activity score' : k.charAt(0).toUpperCase() + k.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-400">
        Showing {visible.length} of {lakes.length} lakes
      </p>

      <div className="mt-3 overflow-x-auto rounded-card border border-slate-200">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th scope="col" className="px-3 py-2.5 w-12">#</th>
              <th scope="col" className="px-3 py-2.5">Lake</th>
              <th scope="col" className="px-3 py-2.5 text-right">Reports</th>
              <th scope="col" className="px-3 py-2.5 text-right">Favorites</th>
              <th scope="col" className="px-3 py-2.5 text-right">DNR &amp; map</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((l) => (
              <tr key={l.slug} className="border-t border-slate-100 hover:bg-slate-50/60">
                <td className="px-3 py-2.5 tabular-nums text-slate-400">{l.rank}</td>
                <td className="px-3 py-2.5 font-medium text-slate-800">{l.name}</td>
                <td className="px-3 py-2.5 text-right tabular-nums text-slate-700">
                  {l.reports.toLocaleString()}
                </td>
                <td className="px-3 py-2.5 text-right tabular-nums text-slate-700">
                  {l.favorites.toLocaleString()}
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center justify-end gap-3 whitespace-nowrap">
                    <a
                      href={lakeTabUrl(l.slug, 'fish-species')}
                      target="_blank"
                      rel="noopener"
                      data-event="mn_click_fish_species"
                      className="font-semibold text-brand hover:text-brand-dark"
                    >
                      Fish species ↗
                    </a>
                    <a
                      href={mapDeepLink({ slug: l.slug, lat: l.lat, lng: l.lng })}
                      target="_blank"
                      rel="noopener"
                      data-event="mn_click_map"
                      className="font-medium text-slate-500 hover:text-slate-800"
                    >
                      Map ↗
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
