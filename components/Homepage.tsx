import Link from 'next/link';

type Feature = { title: string; description: string; cta: string; href: string };
type Resource = { title: string; description: string; href: string; example: string };
type Product = {
  name: string;
  price: string;
  worksFor: string;
  href: string;
  reportHref: string;
};

const navItems = [
  { label: 'Maps', href: '/map' },
  { label: 'Shop', href: '/shop' },
  { label: 'Reports', href: '/fishing-reports' },
  { label: 'Lakes', href: '/states' },
  { label: 'App', href: '/app' },
];

const features: Feature[] = [
  {
    title: 'Map Layers',
    description: 'Water temp, clarity, contours, weather, and reports layered in one place.',
    cta: 'Explore Maps',
    href: '/map',
  },
  {
    title: 'Local Fishing Reports',
    description: 'See what is working right now and which baits produced the bite.',
    cta: 'Browse Reports',
    href: '/fishing-reports',
  },
  {
    title: 'Contextual Tackle Picks',
    description: 'Shop baits tied to lake, season, species, and technique in a click.',
    cta: 'See Picks on Map',
    href: '/map',
  },
  {
    title: 'PRO Layers + Perks',
    description: 'Unlock advanced map tools and member-only benefits as you pattern fish.',
    cta: 'Try PRO',
    href: '/map',
  },
];

const resources: Resource[] = [
  { title: 'Fishing Reports', description: 'Fresh local intel and lure details.', href: '/fishing-reports', example: 'Latest: Metro bass update' },
  { title: 'Techniques', description: 'Pattern breakdowns by season and water conditions.', href: '/fishing-techniques', example: 'Guide: Cold-front jerkbaiting' },
  { title: 'Species', description: 'Target behavior and bait recommendations by species.', href: '/fishing-species', example: 'Smallmouth spring transitions' },
  { title: 'Lakes by State', description: 'Explore fisheries and map coverage nationwide.', href: '/states', example: 'Trending: Minnesota waters' },
];

const categories = ['Baits', 'Rods', 'Reels', 'Line', 'Terminal Tackle', 'Accessories', 'Electronics', 'Ice'];

const products: Product[] = [
  { name: 'Vision 110 Jerkbait', price: '$24.99', worksFor: 'Prespawn • Smallmouth • Jerkbait', href: '/map', reportHref: '/fishing-reports' },
  { name: 'Finesse Swimbait Kit', price: '$18.99', worksFor: 'Postspawn • Largemouth • Swimbait', href: '/map', reportHref: '/fishing-reports' },
  { name: 'Football Jig Pack', price: '$9.49', worksFor: 'Summer • Spotted Bass • Offshore', href: '/map', reportHref: '/fishing-reports' },
  { name: 'Dropshot Starter Set', price: '$32.00', worksFor: 'Clear Water • Smallmouth • Finesse', href: '/map', reportHref: '/fishing-reports' },
];

const testimonials = [
  '“I open the map first every trip. It shortens my learning curve instantly.”',
  '“Reports + tackle context helped me dial in a new lake in one afternoon.”',
  '“Finally a fishing app where planning and shopping connect.”',
];

export default function Homepage() {
  return (
    <main>
      <HeaderNav />
      <Hero />
      <PathTiles />
      <FeatureCards />
      <HowItWorks />
      <ResourceGrid />
      <ContextualProductShelf />
      <CategoryGrid />
      <AppPromo />
      <TestimonialsRow />
      <Footer />
    </main>
  );
}

function HeaderNav() {
  return (
    <header className="sticky top-0 z-50 h-[72px] border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="container-shell flex h-full items-center justify-between gap-6">
        <Link href="/" className="text-xl font-semibold tracking-tight">OmniaFishing</Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className="text-sm font-medium text-slate-700 hover:text-slate-900">{item.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/app" className="hidden rounded-btn border border-slate-300 px-4 py-2 text-sm font-semibold md:inline-flex">Download App</Link>
          <Link href="/map" data-event="home_click_map" className="rounded-btn bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">Open Map</Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="pb-16 pt-[72px] lg:pb-16 lg:pt-24">
      <div className="container-shell grid items-center gap-10 lg:grid-cols-2">
        <div className="max-w-[560px]">
          <h1 className="text-4xl font-semibold leading-[44px] md:text-5xl md:leading-[56px]">Plan smarter. Fish better. Shop what works.</h1>
          <p className="mt-4 text-base leading-6 text-slate-600">Map-based fishing planning + local reports + tackle curated by lake, season, species, and technique.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/map" data-event="home_click_map" className="rounded-btn bg-brand px-5 py-3 font-semibold text-white hover:bg-brand-dark">Open the Map</Link>
            <Link href="/app" data-event="home_click_app" className="rounded-btn border border-slate-300 px-5 py-3 font-semibold">Download the App</Link>
            <Link href="/shop" data-event="home_click_shop_categories" className="self-center text-sm font-semibold text-brand underline-offset-4 hover:underline">Shop by Category</Link>
          </div>
          <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-700">
            <span className="rounded-full bg-slate-100 px-3 py-1">Massive lake coverage</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">Thousands of reports</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">Huge tackle selection</span>
          </div>
        </div>
        <div className="rounded-card border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-6 shadow-soft">
          <div className="rounded-card border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand">Map preview</p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="col-span-2 h-40 rounded-xl bg-brand-light" />
              <div className="h-40 rounded-xl bg-slate-100" />
            </div>
            <div className="mt-4 rounded-xl border border-slate-200 p-3">
              <p className="text-sm font-semibold">Recommended tackle</p>
              <p className="mt-1 text-xs text-slate-600">Matched to lake + season + species.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PathTiles() {
  return (
    <section className="section-space bg-slate-50">
      <div className="container-shell grid gap-6 md:grid-cols-2">
        {[
          { title: 'Start with a lake', desc: 'See conditions, reports, and best baits on the map.', cta: 'Go to Map', href: '/map' },
          { title: 'Start with tackle', desc: 'Shop categories first, then refine by lake and species.', cta: 'Shop Categories', href: '/shop' },
        ].map((tile) => (
          <article key={tile.title} className="rounded-card border border-slate-200 bg-white p-6 shadow-soft">
            <h2 className="text-2xl font-semibold leading-8">{tile.title}</h2>
            <p className="mt-3 text-slate-600">{tile.desc}</p>
            <Link href={tile.href} className="mt-4 inline-flex rounded-btn border border-slate-300 px-4 py-2 text-sm font-semibold">{tile.cta}</Link>
          </article>
        ))}
      </div>
    </section>
  );
}

function FeatureCards() {
  return (
    <section className="section-space">
      <div className="container-shell">
        <h2 className="text-3xl font-semibold leading-10">Everything you need to plan, learn, and gear up.</h2>
        <p className="mt-3 text-slate-600">Fast feature snapshots to get you into the right flow.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-card border border-slate-200 p-6 shadow-soft">
              <h3 className="text-xl font-semibold leading-7">{feature.title}</h3>
              <p className="mt-2 text-slate-600">{feature.description}</p>
              <Link href={feature.href} className="mt-4 inline-flex text-sm font-semibold text-brand hover:underline">{feature.cta}</Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="section-space bg-slate-50">
      <div className="container-shell">
        <h2 className="text-3xl font-semibold leading-10">Open the map—then everything else gets easier.</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {['Pick your lake', 'See conditions + reports', 'Shop baits that match the pattern'].map((step, idx) => (
            <article key={step} className="rounded-card border border-slate-200 bg-white p-6">
              <p className="text-sm font-semibold text-brand">Step {idx + 1}</p>
              <h3 className="mt-2 text-xl font-semibold">{step}</h3>
            </article>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/map" data-event="home_click_map" className="rounded-btn bg-brand px-5 py-3 font-semibold text-white hover:bg-brand-dark">Open Map</Link>
          <Link href="/app" data-event="home_click_app" className="rounded-btn border border-slate-300 px-5 py-3 font-semibold">Get the App</Link>
        </div>
      </div>
    </section>
  );
}

function ResourceGrid() {
  return (
    <section className="section-space">
      <div className="container-shell">
        <h2 className="text-3xl font-semibold leading-10">Resources that keep you one step ahead.</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {resources.map((resource) => (
            <article key={resource.title} className="rounded-card border border-slate-200 p-6 shadow-soft">
              <h3 className="text-xl font-semibold">{resource.title}</h3>
              <p className="mt-2 text-slate-600">{resource.description}</p>
              <p className="mt-3 text-sm text-slate-500">{resource.example}</p>
              <Link href={resource.href} className="mt-4 inline-flex text-sm font-semibold text-brand hover:underline">Explore</Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContextualProductShelf() {
  return (
    <section className="section-space bg-slate-50">
      <div className="container-shell">
        <h2 className="text-3xl font-semibold leading-10">Tackle with context (not an endless catalog).</h2>
        <div className="mt-6 flex flex-wrap gap-2">
          {['Season', 'Species', 'Technique', 'Lake'].map((chip) => (
            <button key={chip} className="rounded-full border border-slate-300 px-3 py-2 text-sm">{chip}</button>
          ))}
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <article key={product.name} className="rounded-card border border-slate-200 bg-white p-5">
              <div className="h-28 rounded-xl bg-slate-100" />
              <h3 className="mt-3 text-base font-semibold">{product.name}</h3>
              <p className="text-sm font-semibold text-slate-800">{product.price}</p>
              <p className="mt-2 text-xs text-slate-600">Works for: {product.worksFor}</p>
              <div className="mt-3 flex gap-3 text-sm font-semibold">
                <Link href={product.href} data-event="home_contextual_product_click" className="text-brand hover:underline">See on Map</Link>
                <Link href={product.reportHref} data-event="home_contextual_product_click" className="text-slate-700 hover:underline">Reports using this</Link>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/shop" className="rounded-btn bg-brand px-5 py-3 font-semibold text-white">Shop these picks</Link>
          <Link href="/map" className="rounded-btn border border-slate-300 px-5 py-3 font-semibold">See the pattern on the map</Link>
        </div>
      </div>
    </section>
  );
}

function CategoryGrid() {
  return (
    <section className="section-space">
      <div className="container-shell">
        <h2 className="text-3xl font-semibold leading-10">Shop by category</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link key={category} href="/shop" className="rounded-card border border-slate-200 p-5 text-lg font-semibold shadow-soft hover:bg-slate-50">{category}</Link>
          ))}
        </div>
        <Link href="/shop" className="mt-6 inline-flex text-sm font-semibold text-brand hover:underline">Shop All Categories</Link>
      </div>
    </section>
  );
}

function AppPromo() {
  return (
    <section className="section-space bg-slate-50">
      <div className="container-shell grid items-center gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-semibold leading-10">Everything works better in the app.</h2>
          <ul className="mt-4 space-y-2 text-slate-600">
            <li>• Save waypoints and patterns</li>
            <li>• Use layers on the water</li>
            <li>• Shop faster with your map context</li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/app" className="rounded-btn bg-slate-900 px-5 py-3 font-semibold text-white">Apple App Store</Link>
            <Link href="/app" className="rounded-btn bg-slate-900 px-5 py-3 font-semibold text-white">Google Play</Link>
          </div>
          <Link href="/app" className="mt-4 inline-flex text-sm font-semibold text-brand hover:underline">Learn more</Link>
        </div>
        <div className="rounded-card border border-slate-200 bg-white p-8 shadow-soft">
          <div className="mx-auto h-72 w-44 rounded-[32px] border-8 border-slate-900 bg-gradient-to-b from-brand-light to-slate-100" />
        </div>
      </div>
    </section>
  );
}

function TestimonialsRow() {
  return (
    <section className="section-space">
      <div className="container-shell">
        <h2 className="text-3xl font-semibold leading-10">Trusted by anglers nationwide.</h2>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {testimonials.map((quote, idx) => (
            <article key={idx} className="rounded-card border border-slate-200 p-6 shadow-soft">
              <p className="text-slate-700">{quote}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const columns = {
    Explore: [
      ['Map', '/map'],
      ['App', '/app'],
      ['Reports', '/fishing-reports'],
      ['Lakes', '/states'],
    ],
    Shop: [
      ['Shop Categories', '/shop'],
      ['Best Sellers', '/shop'],
      ['New Arrivals', '/shop'],
      ['Deals', '/shop'],
    ],
    Support: [
      ['Shipping & Returns', '/shipping-returns'],
      ['FAQs', '/faqs'],
      ['Contact', '/contact'],
    ],
  } as const;

  return (
    <footer className="border-t border-slate-200 bg-slate-50 pt-16">
      <div className="container-shell grid gap-10 pb-10 md:grid-cols-3">
        {Object.entries(columns).map(([title, links]) => (
          <div key={title}>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
            <ul className="mt-3 space-y-3">
              {links.map(([label, href]) => (
                <li key={label}><Link href={href} className="text-slate-700 hover:text-slate-900">{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-200 py-6">
        <div className="container-shell flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
          <div className="flex gap-4"><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div>
          <p>© {new Date().getFullYear()} Omnia Fishing • Chanhassen, MN</p>
        </div>
      </div>
    </footer>
  );
}
