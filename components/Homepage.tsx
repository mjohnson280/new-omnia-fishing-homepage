'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

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

type AuthMode = 'signin' | 'signup';

const fallbackState = 'Minnesota';

const statesList = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
  'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada',
  'New Hampshire','New Jersey','New Mexico','New York','North Carolina',
  'North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island',
  'South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont',
  'Virginia','Washington','West Virginia','Wisconsin','Wyoming',
];

const topSpecies = ['Largemouth Bass', 'Smallmouth Bass'];

const additionalSpecies = [
  'Spotted Bass','Walleye','Northern Pike','Muskie','Crappie',
  'Bluegill','Trout','Catfish','Perch','Striped Bass',
];

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

const sharedHotbaitImage =
  'https://omnia-fishing.imgix.net/production/styles/20220127172323.Swim_Jigs.jpg?auto=format';
const sharedFishingReportImage =
  'https://omnia-fishing.imgix.net/production/fishing_reports/45962/bc4fa4a78d44ca4f834623f7f5042a31.jpg?auto=format&crop=faces&w=478';

const fishingReports: FishingReport[] = [
  {
    title: 'Early morning weedline bite is active',
    lake: 'Lake Minnetonka',
    summary: 'Topwater and swim jigs are producing in 5–9 ft near cabbage edges.',
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

// ─── Root ────────────────────────────────────────────────────────────────────

export default function Homepage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('signin');

  function openAuth(mode: AuthMode = 'signup') {
    setAuthMode(mode);
    setShowAuthModal(true);
  }

  return (
    <main className="min-h-screen bg-white text-slate-950">
      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onModeChange={setAuthMode}
          onClose={() => setShowAuthModal(false)}
        />
      )}
      <div className="mx-auto flex max-w-[1600px]">
        <Sidebar onSignIn={() => openAuth('signin')} onSignUp={() => openAuth('signup')} />
        <div className="min-w-0 flex-1">
          <MobileTopBar onSignIn={() => openAuth('signin')} />
          <HeroSection onGetStarted={() => openAuth('signup')} />
          <LocalDiscoverySection onAuthRequired={() => openAuth('signup')} />
          <ProSection onStartTrial={() => openAuth('signup')} />
          <TackleSection />
        </div>
      </div>
    </main>
  );
}

// ─── Auth Modal ──────────────────────────────────────────────────────────────

function AuthModal({
  mode,
  onModeChange,
  onClose,
}: {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onClose: () => void;
}) {
  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-[420px] rounded-[24px] bg-white p-8 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-[#f6f7f8] p-1">
              <img
                src="https://www.omniafishing.com/logo.svg"
                alt="Omnia Fishing"
                className="h-5 w-5 object-contain"
              />
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              ✕
            </button>
          </div>

          <h2 className="mt-6 text-2xl font-semibold text-slate-950">
            {mode === 'signin' ? 'Sign in to Omnia' : 'Create your account'}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {mode === 'signin'
              ? 'Access your followed lakes, saved baits, and personalized reports.'
              : 'Follow lakes, save baits, and unlock personalized tackle recommendations.'}
          </p>

          <div className="mt-6 space-y-3">
            <button className="flex w-full items-center justify-center gap-3 rounded-[12px] border border-black/10 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>
            <button className="flex w-full items-center justify-center gap-3 rounded-[12px] border border-black/10 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.56-1.32 3.1-2.54 3.99zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              Continue with Apple
            </button>
          </div>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-black/10" />
            <span className="text-xs text-slate-400">or</span>
            <div className="h-px flex-1 bg-black/10" />
          </div>

          <div className="space-y-3">
            <input
              type="email"
              placeholder="Email address"
              className="w-full rounded-[12px] border border-black/10 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-[12px] border border-black/10 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>

          {mode === 'signin' && (
            <div className="mt-2 text-right">
              <button className="text-xs text-slate-400 hover:text-slate-700">
                Forgot password?
              </button>
            </div>
          )}

          <button className="mt-4 w-full rounded-[12px] bg-brand px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark">
            {mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>

          {mode === 'signup' && (
            <p className="mt-4 text-center text-[11px] leading-5 text-slate-400">
              By creating an account you agree to our{' '}
              <Link href="/terms" className="underline hover:text-slate-600">Terms</Link> and{' '}
              <Link href="/privacy" className="underline hover:text-slate-600">Privacy Policy</Link>.
            </p>
          )}

          <p className="mt-5 text-center text-sm text-slate-500">
            {mode === 'signin' ? (
              <>
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => onModeChange('signup')}
                  className="font-semibold text-brand hover:underline"
                >
                  Sign up free
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => onModeChange('signin')}
                  className="font-semibold text-brand hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </>
  );
}

// ─── Sidebar (Option B — Map / Discovery focus) ───────────────────────────────

function Sidebar({ onSignIn, onSignUp }: { onSignIn: () => void; onSignUp: () => void }) {
  return (
    <aside className="sticky top-0 hidden h-screen w-[280px] shrink-0 flex-col overflow-y-auto border-r border-black/10 bg-[#f6f7f8] xl:flex 2xl:w-[300px]">
      <div className="flex flex-1 flex-col px-7 py-8">

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            aria-label="Omnia Fishing Home"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/15 bg-white p-1"
          >
            <img
              src="https://www.omniafishing.com/logo.svg"
              alt="Omnia Fishing"
              className="h-5 w-5 object-contain"
            />
          </Link>
          <span className="text-[15px] font-semibold text-slate-900">Omnia Fishing</span>
        </div>

        {/* Auth CTA */}
        <div className="mt-5 flex gap-2">
          <button
            onClick={onSignIn}
            className="flex-1 rounded-[10px] border border-black/10 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Sign in
          </button>
          <button
            onClick={onSignUp}
            className="flex-1 rounded-[10px] bg-brand px-3 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            Sign up
          </button>
        </div>

        {/* Plan Your Trip */}
        <div className="mt-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Plan Your Trip
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Select a lake to see top techniques, survey data, and fishing reports.
          </p>
          <Link
            href="/map"
            data-event="sidebar_click_map"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-[12px] bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
              <line x1="9" y1="3" x2="9" y2="18" />
              <line x1="15" y1="6" x2="15" y2="21" />
            </svg>
            Open the Map
          </Link>
        </div>

        <div className="my-6 h-px bg-black/[0.07]" />

        {/* Your Lakes — auth gated */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Your Lakes
          </p>
          <div className="mt-3 space-y-2">
            {followedLakes.slice(0, 3).map((lake) => (
              <div
                key={lake.name}
                className="flex items-center justify-between rounded-[10px] border border-black/[0.07] bg-white/60 px-4 py-3 opacity-60 select-none"
              >
                <div>
                  <p className="text-sm font-medium text-slate-700">{lake.name}</p>
                  <p className="text-[11px] text-slate-400">{lake.state}</p>
                </div>
                <svg className="h-4 w-4 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
            ))}
          </div>
          <button
            onClick={onSignIn}
            className="mt-3 w-full rounded-[10px] border border-dashed border-black/15 px-4 py-2.5 text-xs font-semibold text-slate-500 transition hover:border-brand/50 hover:text-brand"
          >
            + Sign in to follow lakes
          </button>
        </div>

        <div className="my-6 h-px bg-black/[0.07]" />

        {/* Recent Reports */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Recent Reports
          </p>
          <div className="mt-3 space-y-2">
            {fishingReports.slice(0, 2).map((report) => (
              <Link
                key={report.title}
                href={report.href}
                className="block rounded-[10px] border border-black/[0.07] bg-white p-3 transition hover:border-black/15"
              >
                <p className="text-[13px] font-semibold leading-5 text-slate-800">{report.title}</p>
                <p className="mt-0.5 text-[11px] text-slate-400">{report.lake}</p>
              </Link>
            ))}
          </div>
          <Link
            href="/map"
            className="mt-3 block text-center text-xs font-semibold text-slate-500 hover:text-brand"
          >
            View all reports →
          </Link>
        </div>

        {/* PRO upsell — pinned to bottom */}
        <div className="mt-auto pt-8">
          <div className="rounded-[16px] bg-brand-light p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
              Omnia PRO
            </p>
            <p className="mt-1 text-sm font-semibold leading-5 text-slate-900">
              Advanced reports &amp; personalized tackle
            </p>
            <button
              onClick={onSignUp}
              className="mt-3 w-full rounded-[10px] bg-brand px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-brand-dark"
            >
              Start free trial
            </button>
          </div>
        </div>

      </div>
    </aside>
  );
}

// ─── Mobile Top Bar ───────────────────────────────────────────────────────────

function MobileTopBar({ onSignIn }: { onSignIn: () => void }) {
  return (
    <section className="sticky top-0 z-20 border-b border-black/10 bg-[#f6f7f8]/95 px-5 py-4 backdrop-blur xl:hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full border border-black/10 bg-white p-1">
            <img src="https://www.omniafishing.com/logo.svg" alt="Omnia Fishing" className="h-4 w-4 object-contain" />
          </div>
          <span className="text-[13px] font-semibold text-slate-800">Omnia Fishing</span>
        </div>
        <button
          onClick={onSignIn}
          className="rounded-full border border-black/10 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          Sign in
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link
          href="/map"
          className="rounded-full border border-black/10 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          Map
        </Link>
        <Link
          href="/shop"
          className="rounded-full border border-black/10 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          Shop Tackle
        </Link>
        <Link
          href="/app"
          className="rounded-full border border-black/10 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          Download App
        </Link>
      </div>
    </section>
  );
}

// ─── Hero Carousel ────────────────────────────────────────────────────────────

const heroSlides = [
  {
    imageUrl: 'https://omnia-fishing.imgix.net/67e80d143eb27b6cd5b65d007b1406dd.webp?auto=format&w=800',
    label: 'The Omnia Map',
    desc: 'Search any lake. See what\'s biting right now.',
  },
  {
    imageUrl: 'https://omnia-fishing.imgix.net/cd331c54132f9c074e9bb8ca564adcfd.webp?auto=format&w=800',
    label: 'Map-Based Shopping',
    desc: 'Tackle matched to your exact lake and conditions.',
  },
  {
    imageUrl: 'https://omnia-fishing.imgix.net/9fe61069d4dbd3fcdd6055e4f2120c09.webp?auto=format&w=800',
    label: 'Local Fishing Reports',
    desc: 'Real intel from anglers who were just there.',
  },
  {
    imageUrl: 'https://omnia-fishing.imgix.net/d94a5bbe86c9dffa19b6fd11b84357ab.webp?auto=format&w=800',
    label: 'Real-Time Lake Intel',
    desc: 'Scout smarter before you ever hit the water.',
  },
  {
    imageUrl: 'https://omnia-fishing.imgix.net/4226f91adb29e91b1104ae7a7f8ace22.webp?auto=format&w=800',
    label: 'AI Report Summaries',
    desc: 'The key patterns, surfaced instantly.',
  },
];

function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-[24px] shadow-[0_10px_28px_rgba(0,0,0,0.08)]">
      {heroSlides.map((slide, i) => (
        <div
          key={slide.label}
          className={`transition-opacity duration-700 ${i === current ? 'opacity-100' : 'pointer-events-none absolute inset-0 opacity-0'}`}
        >
          <img
            src={slide.imageUrl}
            alt={slide.label}
            className="h-full w-full object-cover"
            style={{ aspectRatio: '4/3' }}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-6 pb-5 pt-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
              {slide.label}
            </p>
            <p className="mt-1 text-sm font-medium text-white">{slide.desc}</p>
          </div>
        </div>
      ))}

      {/* Dot indicators */}
      <div className="absolute bottom-4 right-5 flex gap-1.5">
        {heroSlides.map((slide, i) => (
          <button
            key={slide.label}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === current ? 'w-5 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="bg-white px-8 py-10 lg:px-14 lg:py-14">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div className="max-w-[560px]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">
            Map-based fishing intelligence
          </p>
          <h1 className="mt-3 text-4xl font-semibold leading-[1.15] md:text-5xl">
            Plan smarter.<br />Fish better.
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Search your lake, pick your species, and get local fishing reports plus
            tackle recommendations that actually match the conditions.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/map"
              data-event="home_click_map"
              className="rounded-[10px] bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Open the Map
            </Link>
            <Link
              href="/app"
              data-event="home_click_app"
              className="rounded-[10px] border border-black/15 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Download the App
            </Link>
            <button
              onClick={onGetStarted}
              data-event="home_click_signup_hero"
              className="text-sm font-semibold text-brand underline underline-offset-4 hover:text-brand-dark"
            >
              Create free account
            </button>
          </div>
        </div>

        {/* Map preview card */}
        <div className="rounded-[24px] border border-black/10 bg-gradient-to-br from-slate-50 to-slate-100 p-6 shadow-[0_10px_28px_rgba(0,0,0,0.05)]">
          <div className="rounded-[18px] border border-black/10 bg-white p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">
              Live on the map
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="col-span-2 flex h-40 items-end rounded-xl bg-cyan-50 p-3">
                <div className="w-full space-y-1.5">
                  <div className="h-2 w-3/4 rounded-full bg-cyan-200" />
                  <div className="h-2 w-1/2 rounded-full bg-cyan-100" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex-1 rounded-xl bg-slate-100" />
                <div className="flex-1 rounded-xl border border-black/5 bg-slate-50" />
              </div>
            </div>
            <div className="mt-3 rounded-xl border border-black/[0.07] bg-[#fafafa] p-3">
              <p className="text-xs font-semibold text-slate-800">Top bait this week</p>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Matched to lake, season &amp; species
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Local Discovery (species + state picker, reports, hotbaits) ──────────────

function LocalDiscoverySection({ onAuthRequired }: { onAuthRequired: () => void }) {
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
    <section className="px-8 pb-8 lg:px-14">

      {/* Picker */}
      <div className="rounded-[24px] border border-black/10 bg-[#f7f8fa] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.03)] md:p-5">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">

          {/* Species */}
          <div className="relative">
            <button
              type="button"
              onClick={() => { setSpeciesOpen((v) => !v); setStateOpen(false); }}
              className="w-full rounded-[14px] border border-black/10 bg-white px-4 py-3 text-left transition hover:border-black/20"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Species</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{selectedSpecies}</p>
            </button>
            {speciesOpen && (
              <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 rounded-[14px] border border-black/10 bg-white p-3 shadow-xl">
                <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Top suggested</p>
                {topSpecies.map((s) => (
                  <button key={s} type="button" onClick={() => { setSelectedSpecies(s); setSpeciesOpen(false); }}
                    className="block w-full rounded-md px-2 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-950">
                    {s}
                  </button>
                ))}
                <p className="px-2 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Other species</p>
                {additionalSpecies.map((s) => (
                  <button key={s} type="button" onClick={() => { setSelectedSpecies(s); setSpeciesOpen(false); }}
                    className="block w-full rounded-md px-2 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-950">
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* State */}
          <div className="relative">
            <button
              type="button"
              onClick={() => { setStateOpen((v) => !v); setSpeciesOpen(false); }}
              className="w-full rounded-[14px] border border-black/10 bg-white px-4 py-3 text-left transition hover:border-black/20"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">State</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{selectedState}</p>
            </button>
            {stateOpen && (
              <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 max-h-[320px] overflow-y-auto rounded-[14px] border border-black/10 bg-white p-3 shadow-xl">
                <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Suggested near you</p>
                {suggestedStates.map((s) => (
                  <button key={s} type="button" onClick={() => { setSelectedState(s); setStateOpen(false); }}
                    className="block w-full rounded-md px-2 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-950">
                    {s}
                  </button>
                ))}
                <p className="px-2 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">All states (A–Z)</p>
                {availableStates.map((s) => (
                  <button key={`all-${s}`} type="button" onClick={() => { setSelectedState(s); setStateOpen(false); }}
                    className="block w-full rounded-md px-2 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-950">
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link
            href={`/map?state=${encodeURIComponent(selectedState)}&species=${encodeURIComponent(selectedSpecies)}`}
            data-event="home_search_near_me"
            className="inline-flex items-center justify-center rounded-[14px] bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            See Reports &amp; Baits
          </Link>
        </div>
      </div>

      {/* Fishing Reports */}
      <div className="mt-10">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold leading-tight md:text-3xl">
              Recent Reports in {selectedState}
            </h2>
            <p className="mt-1 text-sm text-slate-500">Anglers filing reports from the water this week</p>
          </div>
          <Link
            href={`/map?state=${encodeURIComponent(selectedState)}&species=${encodeURIComponent(selectedSpecies)}`}
            className="shrink-0 text-sm font-semibold text-slate-600 underline underline-offset-4 hover:text-slate-900"
          >
            View all
          </Link>
        </div>
        <div className="mt-5 flex gap-4 overflow-x-auto pb-2">
          {fishingReports.map((report) => (
            <article
              key={report.title}
              className="min-w-[280px] max-w-[320px] shrink-0 rounded-[20px] border border-black/10 bg-white p-5 shadow-[0_6px_18px_rgba(0,0,0,0.04)]"
            >
              <img
                src={report.imageUrl}
                alt={`${report.lake} fishing report`}
                className="h-40 w-full rounded-[14px] object-cover"
              />
              <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-700">Report</p>
              <h3 className="mt-2 text-base font-semibold leading-6">{report.title}</h3>
              <p className="mt-1 text-sm font-medium text-slate-600">{report.lake}</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">{report.summary}</p>
              <div className="mt-4 flex items-center gap-2">
                <Link
                  href={report.href}
                  data-event="home_click_recent_report_lake"
                  className="rounded-[10px] bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-700"
                >
                  Open Lake Report
                </Link>
                <button
                  onClick={onAuthRequired}
                  data-event="home_click_follow_lake"
                  className="rounded-[10px] border border-black/10 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-brand/40 hover:text-brand"
                >
                  + Follow Lake
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Hotbaits */}
      <div className="mt-10">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold leading-tight md:text-3xl">
              Hotbaits in {selectedState}
            </h2>
            <p className="mt-1 text-sm text-slate-500">What&apos;s working right now, matched to your area</p>
          </div>
          <Link
            href="/shop"
            className="shrink-0 text-sm font-semibold text-slate-600 underline underline-offset-4 hover:text-slate-900"
          >
            View all
          </Link>
        </div>
        <div className="mt-5 flex gap-4 overflow-x-auto pb-2">
          {hotbaits.map((bait) => (
            <article
              key={bait.name}
              className="min-w-[280px] max-w-[320px] shrink-0 rounded-[20px] border border-black/10 bg-white p-5 shadow-[0_6px_18px_rgba(0,0,0,0.04)]"
            >
              <img
                src={bait.imageUrl}
                alt={bait.name}
                className="h-40 w-full rounded-[14px] bg-slate-50 object-contain p-2"
              />
              <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-fuchsia-700">Hotbait</p>
              <h3 className="mt-2 text-base font-semibold leading-6">{bait.name}</h3>
              <p className="mt-1 text-sm font-medium text-slate-600">{bait.brand} · {bait.price}</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">{bait.summary}</p>
              <div className="mt-4 flex items-center gap-2">
                <Link
                  href={bait.href}
                  data-event="home_click_hotbait_pdp"
                  className="rounded-[10px] bg-fuchsia-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-fuchsia-700"
                >
                  View Details
                </Link>
                <button
                  onClick={onAuthRequired}
                  data-event="home_click_save_bait"
                  className="rounded-[10px] border border-black/10 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-fuchsia-400/50 hover:text-fuchsia-700"
                >
                  + Save Bait
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── PRO Section ──────────────────────────────────────────────────────────────

function ProSection({ onStartTrial }: { onStartTrial: () => void }) {
  return (
    <section className="px-8 pb-10 lg:px-14">
      <div className="rounded-[24px] bg-gradient-to-br from-brand to-brand-dark p-8 text-white md:p-10">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-200">
              Omnia PRO
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-[1.2]">
              The full picture, for serious anglers
            </h2>
            <p className="mt-4 text-base leading-7 text-blue-100">
              Advanced reports, personalized tackle, and the full planning suite —
              built for anglers who want every edge on the water.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={onStartTrial}
                data-event="home_click_pro_trial"
                className="rounded-[10px] bg-white px-5 py-3 text-sm font-semibold text-brand transition hover:bg-blue-50"
              >
                Start free trial
              </button>
              <Link
                href="/pro"
                className="rounded-[10px] border border-white/25 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                What&apos;s included in PRO
              </Link>
            </div>
          </div>

          <HeroCarousel />
        </div>
      </div>
    </section>
  );
}

// ─── Tackle Section ───────────────────────────────────────────────────────────

function TackleSection() {
  return (
    <section className="px-8 pb-14 lg:px-14">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
            Shop Tackle
          </p>
          <h2 className="mt-2 text-2xl font-semibold leading-tight">
            Browse by category
          </h2>
          <div className="mt-5 grid gap-4 xl:grid-cols-2">
            {condensedTackleIndex.map((category) => (
              <div
                key={category.title}
                className="rounded-[20px] border border-black/10 bg-white p-5"
              >
                <div className="flex items-center justify-between">
                  <Link href={category.href} className="text-lg font-semibold hover:text-brand">
                    {category.title}
                  </Link>
                  <Link href={category.href} className="text-xs font-semibold text-slate-500 hover:text-brand">
                    View all →
                  </Link>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {category.items.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="rounded-full border border-black/10 bg-[#fafafa] px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-brand/30 hover:text-brand"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-[24px] border border-black/10 bg-[#f6f7f8] p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
            Why Omnia
          </p>
          <div className="mt-5 space-y-5">
            {[
              {
                title: 'Start on the map',
                desc: 'Plan around your exact lake and current conditions before you buy anything.',
              },
              {
                title: 'Local intel first',
                desc: 'Real reports from anglers on the water so your first cast is intentional.',
              },
              {
                title: 'Tackle that fits',
                desc: 'Categories and recommendations matched to species, season, and technique.',
              },
              {
                title: 'One place, full flow',
                desc: 'Plan, shop, and track everything without bouncing between apps and tabs.',
              },
            ].map((item) => (
              <div key={item.title}>
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
