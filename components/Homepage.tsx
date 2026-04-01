'use client';

import Link from 'next/link';
import { useId, useMemo, useState } from 'react';

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

type FishingReport = {
  title: string;
  lake: string;
  summary: string;
  imageUrl: string;
  href: string;
};

type Hotbait = {
  name: string;
  brand: string;
  price: string;
  summary: string;
  imageUrl: string;
  href: string;
};

const fallbackState = 'Minnesota';

const statesList = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming',
];

const topSpecies = ['Largemouth Bass', 'Smallmouth Bass'];

const additionalSpecies = [
  'Spotted Bass',
  'Walleye',
  'Northern Pike',
  'Muskie',
  'Crappie',
  'Bluegill',
  'Trout',
  'Catfish',
  'Perch',
  'Striped Bass',
];

// NOTE: This is the species/state availability gate. In production this should come
// from our real data source so states without matching species data are removed.
const speciesAvailabilityByState: Record<string, string[]> = {
  'Largemouth Bass': statesList,
  'Smallmouth Bass': statesList,
  'Spotted Bass': statesList,
  Walleye: statesList,
  'Northern Pike': statesList,
  Muskie: statesList,
  Crappie: statesList,
  Bluegill: statesList,
  Trout: statesList,
  Catfish: statesList,
  Perch: statesList,
  'Striped Bass': statesList,
};

const sharedHotbaitImage = 'https://omnia-fishing.imgix.net/production/omnia_videos/935/fa4e3767271aa800faf37096078fe47b.jpg?auto=format';
const sharedFishingReportImage = 'https://omnia-fishing.imgix.net/production/styles/20220127172323.Swim_Jigs.jpg?auto=format';

const fishingReports: FishingReport[] = [
  {
    title: 'Early morning weedline bite is active',
    lake: 'Lake Minnetonka',
    summary: 'Topwater and swim jigs are producing in 5-9 ft near cabbage edges.',
    imageUrl: sharedFishingReportImage,
    href: '/map',
  },
  {
    title: 'Wind-blown points heating up this week',
    lake: 'Leech Lake',
    summary: 'Dragging football jigs and a finesse worm around rock transitions.',
    imageUrl: sharedFishingReportImage,
    href: '/map',
  },
  {
    title: 'Post-front finesse pattern still holding',
    lake: 'Mille Lacs',
    summary: 'Drop shot around isolated boulders remains consistent by midday.',
    imageUrl: sharedFishingReportImage,
    href: '/map',
  },
  {
    title: 'Dock fish are sliding shallow at sunset',
    lake: 'Table Rock',
    summary: 'Skipping compact jigs and weightless plastics under shady slips.',
    imageUrl: sharedFishingReportImage,
    href: '/map',
  },
];

const hotbaits: Hotbait[] = [
  {
    name: 'Vision 110 Jerkbait',
    brand: 'Megabass',
    price: '$24.99',
    summary: 'A proven clear-water trigger when fish suspend off breaks.',
    imageUrl: sharedHotbaitImage,
    href: 'https://www.omniafishing.com/p/megabass-vision-110-jerkbait',
  },
  {
    name: 'Thunder Cricket',
    brand: 'Z-Man',
    price: '$14.99',
    summary: 'Strong vibration and profile for windy banks and stained water.',
    imageUrl: sharedHotbaitImage,
    href: 'https://www.omniafishing.com/p/strike-king-thunder-cricket',
  },
  {
    name: 'Finesse TRD',
    brand: 'Z-Man',
    price: '$5.49',
    summary: 'Go-to Ned option for pressured bass in calm conditions.',
    imageUrl: sharedHotbaitImage,
    href: 'https://www.omniafishing.com/p/zman-finesse-trd',
  },
  {
    name: 'Keitech Swing Impact',
    brand: 'Keitech',
    price: '$6.79',
    summary: 'Reliable swimbait profile for chasing fish over grass flats.',
    imageUrl: sharedHotbaitImage,
    href: 'https://www.omniafishing.com/p/keitech-swing-impact',
  },
];

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

export default function Homepage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <div className="mx-auto flex max-w-[1600px]">
        <Sidebar />
        <div className="min-w-0 flex-1">
          <MobileTopBar />
          <HeroSection />
          <LocalDiscoverySection />
          <UtilitySections />
        </div>
      </div>
    </main>
  );
}

function Sidebar() {
  const [mapOpen, setMapOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const mapPanelId = useId();
  const shopPanelId = useId();

  return (
    <aside className="sticky top-0 hidden h-screen w-[292px] shrink-0 border-r border-black/10 bg-[#f6f7f8] xl:block 2xl:w-[308px]">
      <div className="flex h-full flex-col px-14 py-10">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            aria-label="Omnia Fishing Home"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-black/15 bg-white p-1"
          >
            <img src="https://www.omniafishing.com/logo.svg" alt="Omnia Fishing" className="h-5 w-5 object-contain" />
          </Link>
          <div className="rounded-md border border-black/10 px-2 py-1 text-[11px] text-slate-500">
            [ ]
          </div>
        </div>

        <div className="mt-14">
          <p className="text-[17px] font-medium text-slate-950">Omnia Fishing</p>
        </div>

        <nav aria-label="Primary" className="mt-12 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-2">
          <div className="space-y-11">
            <PrimaryNav label="Dashboard" href="/app" active />
            <ExpandableNav
              label="Map"
              href="/map"
              panelId={mapPanelId}
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
              panelId={shopPanelId}
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
                          className="block rounded-sm py-1.5 text-[14px] text-slate-500 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70"
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
        aria-current={active ? 'page' : undefined}
        className={`block rounded-sm text-[16px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 ${active ? 'font-medium text-slate-950' : 'text-slate-600 hover:text-slate-950'}`}
      >
        {label}
      </Link>
    </div>
  );
}

function ExpandableNav({
  label,
  href,
  panelId,
  open,
  onToggle,
  children,
}: {
  label: string;
  href: string;
  panelId: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <Link
          href={href}
          className="rounded-sm text-[16px] text-slate-600 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70"
        >
          {label}
        </Link>
        <button
          type="button"
          aria-controls={panelId}
          aria-expanded={open}
          aria-label={`Toggle ${label}`}
          onClick={onToggle}
          className="rounded-sm text-slate-500 transition hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70"
        >
          <span className={`block transition ${open ? 'rotate-180' : ''}`}>⌄</span>
        </button>
      </div>
      {open ? (
        <div id={panelId} className="mt-3">
          {children}
        </div>
      ) : null}
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
          className="block rounded-sm py-2 text-[16px] text-slate-500 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}

function MobileTopBar() {
  return (
    <section className="sticky top-0 z-20 border-b border-black/10 bg-[#f6f7f8]/95 px-6 py-5 backdrop-blur xl:hidden">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
        Omnia Fishing
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href="/map"
          className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70"
        >
          Map
        </Link>
        <Link
          href="/shop"
          className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70"
        >
          Shop Tackle
        </Link>
        <Link
          href="/app"
          className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70"
        >
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
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="max-w-[560px]">
            <h1 className="text-4xl font-semibold leading-[44px] md:text-5xl md:leading-[56px]">
              Plan smarter. Fish better. Shop what works.
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Map-based fishing planning plus local reports and tackle curated by lake, season,
              species, and technique.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/map"
                data-event="home_click_map"
                className="rounded-[10px] bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70"
              >
                Open the Map
              </Link>
              <Link
                href="/app"
                data-event="home_click_app"
                className="rounded-[10px] border border-black/15 px-5 py-3 font-semibold hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70"
              >
                Download the App
              </Link>
              <Link
                href="/shop"
                data-event="home_click_shop_categories"
                className="self-center text-sm font-semibold text-slate-700 underline underline-offset-4 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70"
              >
                Shop by Category
              </Link>
            </div>
          </div>

          <div className="rounded-[24px] border border-black/10 bg-gradient-to-br from-slate-50 to-slate-100 p-6 shadow-[0_10px_24px_rgba(0,0,0,0.04)]">
            <div className="rounded-[18px] border border-black/10 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
                Map preview
              </p>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="col-span-2 h-40 rounded-xl bg-cyan-100" />
                <div className="h-40 rounded-xl bg-slate-100" />
              </div>
              <div className="mt-4 rounded-xl border border-black/10 p-3">
                <p className="text-sm font-semibold">Recommended tackle</p>
                <p className="mt-1 text-xs text-slate-600">
                  Matched to lake, season, and species.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LocalDiscoverySection() {
  const [selectedSpecies, setSelectedSpecies] = useState(topSpecies[0]);
  const [selectedState, setSelectedState] = useState(fallbackState);
  const [speciesOpen, setSpeciesOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);

  const availableStates = useMemo(() => {
    const states = speciesAvailabilityByState[selectedSpecies] ?? statesList;
    return [...states].sort((a, b) => a.localeCompare(b));
  }, [selectedSpecies]);

  const suggestedStates = useMemo(() => {
    if (availableStates.includes(selectedState)) return [selectedState];
    return [fallbackState];
  }, [availableStates, selectedState]);

  return (
    <section className="container-shell px-8 pb-6 lg:px-14">
      <div className="rounded-[24px] border border-black/10 bg-[#f7f8fa] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.03)] md:p-5">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setSpeciesOpen((value) => !value);
                setStateOpen(false);
              }}
              className="w-full rounded-[14px] border border-black/10 bg-white px-4 py-3 text-left transition hover:border-black/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Species</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{selectedSpecies}</p>
            </button>
            {speciesOpen ? (
              <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 rounded-[14px] border border-black/10 bg-white p-3 shadow-xl">
                <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Top suggested
                </p>
                {topSpecies.map((species) => (
                  <button
                    key={species}
                    type="button"
                    onClick={() => {
                      setSelectedSpecies(species);
                      setSpeciesOpen(false);
                    }}
                    className="block w-full rounded-md px-2 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                  >
                    {species}
                  </button>
                ))}
                <p className="px-2 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Other species
                </p>
                {additionalSpecies.map((species) => (
                  <button
                    key={species}
                    type="button"
                    onClick={() => {
                      setSelectedSpecies(species);
                      setSpeciesOpen(false);
                    }}
                    className="block w-full rounded-md px-2 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                  >
                    {species}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setStateOpen((value) => !value);
                setSpeciesOpen(false);
              }}
              className="w-full rounded-[14px] border border-black/10 bg-white px-4 py-3 text-left transition hover:border-black/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">State</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{selectedState}</p>
            </button>
            {stateOpen ? (
              <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 max-h-[320px] overflow-y-auto rounded-[14px] border border-black/10 bg-white p-3 shadow-xl">
                <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Suggested near you
                </p>
                {suggestedStates.map((state) => (
                  <button
                    key={state}
                    type="button"
                    onClick={() => {
                      setSelectedState(state);
                      setStateOpen(false);
                    }}
                    className="block w-full rounded-md px-2 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                  >
                    {state}
                  </button>
                ))}
                <p className="px-2 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  All states (A-Z)
                </p>
                {availableStates.map((state) => (
                  <button
                    key={`all-${state}`}
                    type="button"
                    onClick={() => {
                      setSelectedState(state);
                      setStateOpen(false);
                    }}
                    className="block w-full rounded-md px-2 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                  >
                    {state}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <Link
            href={`/map?state=${encodeURIComponent(selectedState)}&species=${encodeURIComponent(selectedSpecies)}`}
            data-event="home_search_near_me"
            className="inline-flex items-center justify-center rounded-[14px] bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70"
          >
            See Reports and Baits
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold leading-tight md:text-3xl">
            Recently Filed Fishing Reports in {selectedState}
          </h2>
          <Link
            href={`/map?state=${encodeURIComponent(selectedState)}&species=${encodeURIComponent(selectedSpecies)}`}
            className="mt-2 inline-flex text-sm font-semibold text-slate-700 underline underline-offset-4 hover:text-slate-950"
          >
            View all reports
          </Link>
        </div>
        <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
          {fishingReports.map((report) => (
            <article
              key={report.title}
              className="min-w-[280px] max-w-[320px] rounded-[20px] border border-black/10 bg-white p-5 shadow-[0_6px_18px_rgba(0,0,0,0.04)]"
            >
              <img
                src={report.imageUrl}
                alt={`${report.lake} fishing report`}
                className="h-40 w-full rounded-[14px] object-cover"
              />
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">Report</p>
              <h3 className="mt-3 text-lg font-semibold leading-6">{report.title}</h3>
              <p className="mt-2 text-sm font-medium text-slate-700">{report.lake}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{report.summary}</p>
              <Link
                href={report.href}
                data-event="home_click_recent_report_lake"
                className="mt-4 inline-flex rounded-[10px] bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70"
              >
                Open Lake Report
              </Link>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold leading-tight md:text-3xl">Hotbaits in Your Area</h2>
          <Link href="/shop" className="mt-2 inline-flex text-sm font-semibold text-slate-700 underline underline-offset-4 hover:text-slate-950">
            View all hotbaits
          </Link>
        </div>
        <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
          {hotbaits.map((bait) => (
            <article
              key={bait.name}
              className="min-w-[280px] max-w-[320px] rounded-[20px] border border-black/10 bg-white p-5 shadow-[0_6px_18px_rgba(0,0,0,0.04)]"
            >
              <img src={bait.imageUrl} alt={bait.name} className="h-40 w-full rounded-[14px] bg-slate-50 object-contain p-2" />
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fuchsia-700">Hotbait</p>
              <h3 className="mt-3 text-lg font-semibold leading-6">{bait.name}</h3>
              <p className="mt-2 text-sm font-medium text-slate-700">
                {bait.brand} - {bait.price}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{bait.summary}</p>
              <Link
                href={bait.href}
                data-event="home_click_hotbait_pdp"
                className="mt-4 inline-flex rounded-[10px] bg-fuchsia-600 px-4 py-2 text-sm font-semibold text-white hover:bg-fuchsia-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300/80"
              >
                View Product Details
              </Link>
            </article>
          ))}
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
            Why anglers use Omnia
          </p>
          <div className="mt-5 space-y-4 text-sm leading-7 text-slate-700">
            <p>Start on the map to plan around your exact lake and current conditions.</p>
            <p>Use reports for local patterns so first casts are more intentional.</p>
            <p>Jump straight into tackle categories matched to season and species.</p>
            <p>Keep everything in one flow instead of bouncing between tools and tabs.</p>
            <p>On mobile, key actions stay one tap away from the top shortcut bar.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
