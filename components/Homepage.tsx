'use client';

import Link from 'next/link';
import { useState } from 'react';

type Lake = {
  name: string;
  state: string;
  href: string;
};

type TackleCategory = {
  title: string;
  href: string;
  items: { label: string; href: string }[];
};

const followedLakes: Lake[] = [
  { name: 'Lake Minnetonka', state: 'MN', href: '/map' },
  { name: 'Mille Lacs', state: 'MN', href: '/map' },
  { name: 'Leech Lake', state: 'MN', href: '/map' },
  { name: 'Table Rock', state: 'MO', href: '/map' },
  { name: 'Guntersville', state: 'AL', href: '/map' },
];

const tackleIndex: TackleCategory[] = [
  {
    title: 'Baits',
    href: '/shop',
    items: [
      { label: 'Jigs', href: '/shop' },
      { label: 'Soft Baits', href: '/shop' },
      { label: 'Hard Baits', href: '/shop' },
      { label: 'Wire Baits', href: '/shop' },
      { label: 'Rigs', href: '/shop' },
    ],
  },
  {
    title: 'Line',
    href: '/shop',
    items: [
      { label: 'Braid / Super Line', href: '/shop' },
      { label: 'Braid to Fluorocarbon Leader', href: '/shop' },
      { label: 'Fluorocarbon', href: '/shop' },
      { label: 'Monofilament', href: '/shop' },
      { label: 'Lead Core', href: '/shop' },
      { label: 'Ice Line', href: '/shop' },
    ],
  },
  {
    title: 'Rods',
    href: '/shop',
    items: [
      { label: 'Casting Rods', href: '/shop' },
      { label: 'Spinning Rods', href: '/shop' },
      { label: 'Ice Fishing Rods', href: '/shop' },
      { label: 'Travel Rods', href: '/shop' },
      { label: 'Combos', href: '/shop' },
    ],
  },
  {
    title: 'Reels',
    href: '/shop',
    items: [
      { label: 'Casting Reels', href: '/shop' },
      { label: 'Spinning Reels', href: '/shop' },
      { label: 'Ice Fishing Reels', href: '/shop' },
    ],
  },
  {
    title: 'Terminal',
    href: '/c/terminal',
    items: [
      { label: 'Beads', href: '/c/terminal' },
      { label: 'Blades', href: '/c/terminal' },
      { label: 'Bobbers', href: '/c/terminal' },
      { label: 'Hooks', href: '/c/terminal' },
      { label: 'Leaders', href: '/c/terminal' },
      { label: 'Skirts', href: '/c/terminal' },
      { label: 'Swivels, Snaps, Clevises', href: '/c/terminal' },
      { label: 'Weights', href: '/c/terminal' },
      { label: 'Pegs', href: '/c/terminal' },
      { label: 'Rattles', href: '/c/terminal' },
    ],
  },
  {
    title: 'Accessories',
    href: '/shop',
    items: [
      { label: 'Gift Cards', href: '/shop' },
      { label: 'Tackle Management', href: '/shop' },
      { label: 'Tools', href: '/shop' },
      { label: 'Tournament Accessories', href: '/shop' },
      { label: 'Scents', href: '/shop' },
      { label: 'Bags', href: '/shop' },
      { label: 'Coffee', href: '/shop' },
      { label: 'Coolers', href: '/shop' },
      { label: 'Decals', href: '/shop' },
      { label: 'Knives', href: '/shop' },
      { label: 'Rod Racks', href: '/shop' },
      { label: 'Trolling', href: '/shop' },
      { label: 'Sunscreen', href: '/shop' },
      { label: 'Kits', href: '/shop' },
    ],
  },
  {
    title: 'Apparel',
    href: '/shop',
    items: [
      { label: 'Rain Gear', href: '/shop' },
      { label: 'Sun Protection', href: '/shop' },
      { label: 'Sunglasses', href: '/shop' },
      { label: 'Hats', href: '/shop' },
      { label: 'Omnia Gear', href: '/shop' },
      { label: "Women's Apparel", href: '/shop' },
      { label: 'Footwear', href: '/shop' },
      { label: 'Gloves', href: '/shop' },
      { label: 'Layering', href: '/shop' },
      { label: 'Waders', href: '/shop' },
      { label: 'Ice Fishing', href: '/shop' },
    ],
  },
  {
    title: 'Marine',
    href: '/shop',
    items: [
      { label: 'Boat', href: '/shop' },
      { label: 'Cameras & Accessories', href: '/shop' },
      { label: 'Electronics', href: '/shop' },
      { label: 'Flotation & Safety', href: '/shop' },
      { label: 'Trolling Motors', href: '/shop' },
    ],
  },
  {
    title: 'Ice',
    href: '/shop',
    items: [
      { label: 'Ice Augers', href: '/shop' },
      { label: 'Ice Shelters', href: '/shop' },
      { label: 'Ice Fishing Accessories', href: '/shop' },
    ],
  },
];

const condensedTackleIndex: TackleCategory[] = [
  {
    title: 'Baits',
    href: '/shop',
    items: [
      { label: 'Jigs', href: '/shop' },
      { label: 'Hard Baits', href: '/shop' },
      { label: 'Wire Baits', href: '/shop' },
      { label: 'Soft Baits', href: '/shop' },
    ],
  },
  {
    title: 'Rods',
    href: '/shop',
    items: [
      { label: 'Casting Rods', href: '/shop' },
      { label: 'Spinning Rods', href: '/shop' },
      { label: 'Travel Rods', href: '/shop' },
    ],
  },
  {
    title: 'Reels',
    href: '/shop',
    items: [
      { label: 'Casting Reels', href: '/shop' },
      { label: 'Spinning Reels', href: '/shop' },
      { label: 'Ice Fishing Reels', href: '/shop' },
    ],
  },
  {
    title: 'Line',
    href: '/shop',
    items: [
      { label: 'Braid / Super Line', href: '/shop' },
      { label: 'Fluorocarbon', href: '/shop' },
      { label: 'Monofilament', href: '/shop' },
    ],
  },
  {
    title: 'Terminal',
    href: '/c/terminal',
    items: [
      { label: 'Hooks', href: '/c/terminal' },
      { label: 'Weights', href: '/c/terminal' },
      { label: 'Bobbers', href: '/c/terminal' },
      { label: 'Skirts', href: '/c/terminal' },
    ],
  },
  {
    title: 'Accessories',
    href: '/shop',
    items: [
      { label: 'Gift Cards', href: '/shop' },
      { label: 'Tools', href: '/shop' },
      { label: 'Tackle Management', href: '/shop' },
      { label: 'Nets', href: '/shop' },
    ],
  },
];

const homepageCards = [
  {
    title: 'Plan a day around followed lakes',
    description:
      'Put map entry points and recently followed waters at the top of the experience so repeat users can resume instantly.',
    cta: 'View Lakes',
  },
  {
    title: 'Open tackle categories without leaving the shell',
    description:
      'Keep the Omnia product index visible while the content area explains the best next action for the angler.',
    cta: 'Shop Tackle',
  },
];

export default function Homepage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <div className="mx-auto flex max-w-[1600px]">
        <Sidebar />
        <div className="min-w-0 flex-1">
          <MobileTopBar />
          <HeroSection />
          <UtilitySections />
        </div>
      </div>
    </main>
  );
}

function Sidebar() {
  const [mapOpen, setMapOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);

  return (
    <aside className="sticky top-0 hidden h-screen w-[308px] shrink-0 border-r border-black/10 bg-[#f6f7f8] xl:block">
      <div className="flex h-full flex-col px-14 py-10">
        <div className="flex items-center justify-between">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-black/15 text-sm font-semibold">
            O
          </div>
          <div className="rounded-md border border-black/10 px-2 py-1 text-[11px] text-slate-500">
            [ ]
          </div>
        </div>

        <div className="mt-14">
          <p className="text-[17px] font-medium text-slate-950">Omnia Fishing</p>
        </div>

        <nav className="mt-12 min-h-0 flex-1 overflow-y-auto pr-2">
          <div className="space-y-11">
            <PrimaryNav label="Dashboard" href="/app" active />
            <ExpandableNav
              label="Map"
              href="/map"
              open={mapOpen}
              onToggle={() => setMapOpen((value) => !value)}
            >
              <IndentedLinks
                items={followedLakes.map((lake) => ({ label: lake.name, href: lake.href }))}
              />
            </ExpandableNav>
            <ExpandableNav
              label="Shop Tackle"
              href="/shop"
              open={shopOpen}
              onToggle={() => setShopOpen((value) => !value)}
            >
              <div className="border-l-2 border-slate-200 pl-5">
                {tackleIndex.map((category) => (
                  <div key={category.title} className="py-3">
                    <Link href={category.href} className="block text-[16px] text-slate-600 hover:text-slate-950">
                      {category.title}
                    </Link>
                    <div className="mt-2 pl-4">
                      {category.items.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          className="block py-1.5 text-[14px] text-slate-500 hover:text-slate-900"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ExpandableNav>
          </div>
        </nav>
      </div>
    </aside>
  );
}

function PrimaryNav({
  label,
  href,
  active = false,
}: {
  label: string;
  href: string;
  active?: boolean;
}) {
  return (
    <div className="relative">
      {active ? (
        <span className="absolute -left-14 top-1/2 h-11 w-2 -translate-y-1/2 rounded-r-full bg-cyan-400" />
      ) : null}
      <Link
        href={href}
        className={`block text-[16px] ${active ? 'font-medium text-slate-950' : 'text-slate-600 hover:text-slate-950'}`}
      >
        {label}
      </Link>
    </div>
  );
}

function ExpandableNav({
  label,
  href,
  open,
  onToggle,
  children,
}: {
  label: string;
  href: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <Link href={href} className="text-[16px] text-slate-600 hover:text-slate-950">
          {label}
        </Link>
        <button
          type="button"
          aria-expanded={open}
          aria-label={`Toggle ${label}`}
          onClick={onToggle}
          className="text-slate-500 transition hover:text-slate-900"
        >
          <span className={`block transition ${open ? 'rotate-180' : ''}`}>⌄</span>
        </button>
      </div>
      {open ? <div className="mt-3">{children}</div> : null}
    </div>
  );
}

function IndentedLinks({
  items,
}: {
  items: { label: string; href: string }[];
}) {
  return (
    <div className="border-l-2 border-slate-200 pl-8">
      {items.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="block py-2 text-[16px] text-slate-500 hover:text-slate-950"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}

function MobileTopBar() {
  return (
    <section className="border-b border-black/10 bg-[#f6f7f8] px-6 py-5 xl:hidden">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
        Omnia shell study
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link href="/map" className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold">
          Map
        </Link>
        <Link href="/shop" className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold">
          Shop Tackle
        </Link>
        <Link href="/app" className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold">
          Dashboard
        </Link>
      </div>
    </section>
  );
}

function HeroSection() {
  return (
    <section className="bg-white">
      <div className="container-shell px-8 py-10 lg:px-14 lg:py-12">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-5xl font-semibold leading-none md:text-6xl">Omnia Fishing</h1>
            <p className="mt-3 text-lg font-medium text-slate-700 underline underline-offset-4">
              Left rail homepage concept
            </p>
          </div>
          <p className="hidden pt-2 text-lg text-slate-700 lg:block">Hire an expert</p>
        </div>

        <div className="mt-10 overflow-hidden rounded-[26px] border border-[#dfd6dd] bg-white shadow-[0_4px_18px_rgba(0,0,0,0.04)]">
          <div className="border-t-[4px] border-t-[#f0139a] px-6 py-7">
            <p className="text-center text-lg text-slate-800">
              You currently have a homepage prototype. Pick a path to continue.
            </p>
          </div>

          <div className="border-t border-black/10 px-6 py-8">
            <div className="flex items-center gap-3">
              <span className="text-xl text-[#7c3aed]">✦</span>
              <h2 className="text-2xl font-semibold">
                Everything generated for the new Omnia homepage
              </h2>
            </div>

            <div className="mt-7 grid gap-6 xl:grid-cols-2">
              {homepageCards.map((card) => (
                <article
                  key={card.title}
                  className="rounded-[24px] border border-black/10 bg-white p-6 shadow-[0_10px_24px_rgba(0,0,0,0.04)]"
                >
                  <div className="h-48 rounded-[18px] border border-black/10 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)]" />
                  <h3 className="mx-auto mt-8 max-w-[14ch] text-center text-[28px] font-semibold leading-9">
                    {card.title}
                  </h3>
                  <p className="mx-auto mt-4 max-w-[28rem] text-center text-[17px] leading-8 text-slate-600">
                    {card.description}
                  </p>
                  <div className="mt-7 text-center">
                    <button className="rounded-[10px] border border-black/20 px-4 py-2 text-lg font-medium">
                      {card.cta}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function UtilitySections() {
  return (
    <section className="container-shell px-8 pb-14 lg:px-14">
      <div className="grid gap-6 pt-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <article className="rounded-[24px] border border-black/10 bg-[#fafafa] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Followed Lakes
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-10">
              Quick map links live directly below the main navigation item.
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {followedLakes.map((lake) => (
                <Link
                  key={lake.name}
                  href={lake.href}
                  className="rounded-[20px] border border-black/10 bg-white px-5 py-4"
                >
                  <p className="text-lg font-semibold">{lake.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{lake.state}</p>
                </Link>
              ))}
            </div>
          </article>

          <article className="rounded-[24px] border border-black/10 bg-[#fafafa] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Tackle Taxonomy
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-10">
              Product categories and subcategories stay visible as a utility layer.
            </h2>
            <div className="mt-6 grid gap-4 xl:grid-cols-2">
              {condensedTackleIndex.map((category) => (
                <div key={category.title} className="rounded-[20px] border border-black/10 bg-white p-5">
                  <div className="flex items-center justify-between">
                    <Link href={category.href} className="text-xl font-semibold">
                      {category.title}
                    </Link>
                    <Link href={category.href} className="text-sm font-semibold text-slate-600">
                      View
                    </Link>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {category.items.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="rounded-full border border-black/10 bg-[#fafafa] px-3 py-2 text-xs font-medium text-slate-700"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>

        <aside className="rounded-[24px] border border-black/10 bg-[#f6f7f8] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Handoff Notes
          </p>
          <div className="mt-5 space-y-4 text-sm leading-7 text-slate-700">
            <p>Desktop keeps the utility rail fixed on the left.</p>
            <p>Spacing and grouping are based on your GoDaddy reference screenshot.</p>
            <p>Map uses a followed-lake list as the first nested layer.</p>
            <p>Shop Tackle exposes categories and subcategories for recall speed.</p>
            <p>Mobile collapses to a simpler top shortcut bar.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
