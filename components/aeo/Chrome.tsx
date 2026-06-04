// Minimal page chrome for the AEO pages so they read as real Omnia pages while
// living in the prototype. Nav links point at omniafishing.com production; the
// "Homepage" link returns to the prototype homepage redesign.

import Link from 'next/link';
import { productLinks, HUB_PATH } from '@/lib/aeo/links';

export function AeoChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-container items-center gap-6 px-[var(--gutter)] py-3">
          <Link href="/" aria-label="Omnia Fishing Home" className="shrink-0">
            <img
              src="https://www.omniafishing.com/logo.svg"
              alt="Omnia Fishing"
              className="h-8 w-8 object-contain"
            />
          </Link>
          <nav className="hidden items-center gap-5 text-sm font-medium text-slate-600 sm:flex">
            <a href={productLinks.shop} className="hover:text-brand">Shop</a>
            <Link href={HUB_PATH} className="hover:text-brand">Explore</Link>
            <a href={productLinks.map} className="hover:text-brand">Map</a>
          </nav>
          <div className="ml-auto flex items-center gap-3 text-sm font-semibold">
            <Link href="/" className="text-slate-500 hover:text-slate-800">
              Homepage
            </Link>
            <a
              href={productLinks.pro}
              className="rounded-btn bg-brand px-4 py-2 text-white transition hover:bg-brand-dark"
            >
              PRO
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-black/10 bg-white">
        <div className="mx-auto flex max-w-container flex-col gap-2 px-[var(--gutter)] py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {2026} Omnia Fishing</p>
          <p className="text-xs">
            AEO content prototype · stage.mjcreativelogic.com
          </p>
        </div>
      </footer>
    </div>
  );
}
