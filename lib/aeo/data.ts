// Source of truth for the bass hub + lake guides.
//
// In production this is a CMS collection / versioned lakes/{slug}.json fed by the
// synthesis pipeline. Here it is a typed module so the prototype is self-contained
// and the shape is obvious at handoff. Metadata (rank, reports, favorites, coords)
// comes from build-spec Section 11. Mille Lacs carries the real worked-example
// patterns; the other 19 use illustrative templates (see patterns.ts).

import type { HubConfig, Lake, Pattern } from './types';
import { anchorFor } from './format';
import { buildSamplePatterns } from './patterns';

const UPDATED = '2026-05-15';

// ── Mille Lacs: the real worked reference (build-spec Sections 5, 8) ─────────

const milleLacsPatterns: Pattern[] = [
  {
    season: 'Spring',
    phase: 'Pre-Spawn',
    species: 'Smallmouth Bass',
    anchorId: anchorFor('Spring', 'Pre-Spawn', 'Smallmouth Bass'),
    waterTempF: { min: 48, max: 58 },
    behavior:
      'fish pull onto warming rock and gravel near spawning bays and feed up before the spawn',
    locations: ['Rock-to-gravel transitions', 'Wind-protected spawning bays'],
    techniques: ['suspending jerkbaits paused', 'tubes and hair jigs dragged'],
    forage: { primary: 'crawfish' },
    baitColors: ['Natural Craw Colors', 'Smoke'],
    structures: { primary: 'Rock transitions', secondary: 'Gravel flats' },
  },
  {
    season: 'Summer',
    phase: null,
    species: 'Smallmouth Bass',
    anchorId: anchorFor('Summer', null, 'Smallmouth Bass'),
    waterTempF: { min: 68, max: 75 },
    behavior:
      'fish scatter from 4 to 17 feet after the crawfish hatch, favoring subtle presentations under pressure',
    locations: ['Rock reefs in 12-17 feet', 'Mud-to-rock edges'],
    techniques: ['drop shot worked slowly', 'Ned rig'],
    forage: { primary: 'crawfish', secondary: 'perch' },
    baitColors: ['Natural Craw Colors', 'Dark Neutrals'],
    structures: { primary: 'Rock reefs', secondary: 'Mud basin edges' },
    isPro: true,
    answerOverride:
      'For summer smallmouth bass on Mille Lacs Lake, work a drop shot or Ned rig slowly across rock reefs in 12 to 17 feet using natural craw colors. Water temps run 68 to 75°F, and fish scatter from 4 to 17 feet after the crawfish hatch, favoring subtle presentations under pressure.',
  },
  {
    season: 'Summer',
    phase: null,
    species: 'Walleye',
    anchorId: anchorFor('Summer', null, 'Walleye'),
    waterTempF: { min: 68, max: 74 },
    behavior:
      'fish relate to mud-basin edges and mid-lake rock, sliding shallow to feed at low light',
    locations: ['Mud-basin edges in 22-32 feet', 'Mid-lake rock humps'],
    techniques: ['live-bait rigs with leeches', 'spinner rigs trolled'],
    forage: { primary: 'perch', secondary: 'tullibee' },
    baitColors: ['Gold', 'Firetiger'],
    structures: { primary: 'Mud-basin edges', secondary: 'Mid-lake humps' },
    isPro: true,
  },
  {
    season: 'Fall',
    phase: null,
    species: 'Walleye',
    anchorId: anchorFor('Fall', null, 'Walleye'),
    waterTempF: { min: 38, max: 50 },
    behavior:
      'fish move onto shallow rock with strong low-light and night activity as water cools into the 30s and 40s',
    locations: ['Shallow rock in 7-12 feet', 'Shoreline rock points'],
    techniques: ['blade baits ripped', 'slow vertical jigs'],
    forage: { primary: 'baitfish', secondary: 'perch' },
    baitColors: ['Natural Baitfish', 'Metallic'],
    structures: { primary: 'Shallow rock', secondary: 'Rock points' },
    answerOverride:
      'In fall, Mille Lacs walleye hit blade baits and slow vertical jigs on shallow rock in 7 to 12 feet, with strong low-light and night activity. Natural baitfish and metallic colors work best as water cools into the 30s and 40s.',
  },
  {
    season: 'Summer',
    phase: null,
    species: 'Muskie',
    anchorId: anchorFor('Summer', null, 'Muskie'),
    waterTempF: { min: 70, max: 76 },
    behavior: 'fish patrol deep rock bars and weed edges, keying on tullibee and perch',
    locations: ['Main-lake rock bars in 10-20 feet', 'Deep weed edges'],
    techniques: ['bucktails burned', 'large glide baits'],
    forage: { primary: 'tullibee', secondary: 'perch' },
    baitColors: ['Natural Sucker', 'Perch'],
    structures: { primary: 'Rock bars', secondary: 'Weed edges' },
    isPro: true,
  },
];

// ── Lake seeds (Section 11 metadata + verdict copy) ──────────────────────────

interface LakeSeed {
  rank: number;
  name: string;
  state: string;
  slug: string;
  reports: number;
  coordinates: { lat: number; lng: number };
  zoom?: number;
  peakSeason: string;
  bestMonths: string[];
  topSpecies: string[];
  signaturePattern: string;
  summary: string;
}

const SEEDS: LakeSeed[] = [
  {
    rank: 1,
    name: 'Guntersville Lake',
    state: 'AL',
    slug: 'guntersville-lake-fishing-reports',
    reports: 266,
    coordinates: { lat: 34.5204, lng: -86.1394 },
    peakSeason: 'Spring',
    bestMonths: ['Mar', 'Apr', 'Oct'],
    topSpecies: ['Largemouth Bass', 'Crappie'],
    signaturePattern: 'grass-mat largemouth',
    summary:
      'The Tennessee River grass factory and a perennial big-bass destination. Milfoil and hydrilla mats plus offshore ledges produce giant largemouth, with the pre-spawn window the most famous.',
  },
  {
    rank: 2,
    name: 'Mille Lacs Lake',
    state: 'MN',
    slug: 'mille-lacs-lake-fishing-reports',
    reports: 363,
    coordinates: { lat: 46.2381, lng: -93.6601 },
    peakSeason: 'Summer',
    bestMonths: ['Jun', 'Jul', 'Sep'],
    topSpecies: ['Smallmouth Bass', 'Walleye', 'Muskie'],
    signaturePattern: 'rock-reef smallmouth',
    summary:
      'One of the best big-smallmouth fisheries on the planet, built on endless rock reefs and mud-basin edges. World-class walleye and muskie share the same water, making it a true multi-species giant.',
  },
  {
    rank: 3,
    name: 'Lake Minnetonka',
    state: 'MN',
    slug: 'lake-minnetonka-fishing-reports',
    reports: 484,
    coordinates: { lat: 44.94, lng: -93.63 },
    peakSeason: 'Summer',
    bestMonths: ['Jun', 'Jul', 'Aug'],
    topSpecies: ['Largemouth Bass', 'Smallmouth Bass', 'Muskie'],
    signaturePattern: 'multi-species metro lake',
    summary:
      'A sprawling, structure-rich metro lake that grows quality largemouth, smallmouth, muskie and pike. Heavy report volume makes its patterns some of the best-documented in the Midwest.',
  },
  {
    rank: 4,
    name: 'Lake Erie',
    state: 'OH/PA/NY/MI',
    slug: 'lake-erie-great-lakes-fishing-reports',
    reports: 271,
    coordinates: { lat: 42.2, lng: -81.2 },
    zoom: 8,
    peakSeason: 'Summer',
    bestMonths: ['Jun', 'Jul', 'Sep'],
    topSpecies: ['Smallmouth Bass', 'Walleye'],
    signaturePattern: 'giant offshore smallmouth',
    summary:
      'The smallmouth and walleye capital of the Great Lakes. Vast open water and goby-rich rock produce trophy brown bass and limits of walleye, with electronics-driven offshore fishing the name of the game.',
  },
  {
    rank: 5,
    name: 'Lake of the Ozarks',
    state: 'MO',
    slug: 'lake-of-the-ozarks-fishing-reports',
    reports: 231,
    coordinates: { lat: 38.15, lng: -92.75 },
    peakSeason: 'Spring',
    bestMonths: ['Apr', 'May', 'Oct'],
    topSpecies: ['Largemouth Bass', 'Spotted Bass', 'Crappie'],
    signaturePattern: 'dock-skipping largemouth',
    summary:
      'A highland reservoir wrapped in boat docks, bluffs and creek arms. Dock-skipping for largemouth and spotted bass defines the bite, with strong spring and fall windows.',
  },
  {
    rank: 6,
    name: 'Lake Norman',
    state: 'NC',
    slug: 'lake-norman-fishing-reports',
    reports: 234,
    coordinates: { lat: 35.5, lng: -80.95 },
    peakSeason: 'Spring',
    bestMonths: ['Mar', 'Apr', 'Oct'],
    topSpecies: ['Largemouth Bass', 'Spotted Bass', 'Striped Bass'],
    signaturePattern: 'blueback-herring spots',
    summary:
      "North Carolina's largest man-made lake, ruled by blueback herring. Spotted and largemouth bass chase bait on offshore humps and points, with stripers adding a strong open-water option.",
  },
  {
    rank: 7,
    name: 'Toledo Bend Reservoir',
    state: 'TX/LA',
    slug: 'toledo-bend-reservoir-fishing-reports',
    reports: 191,
    coordinates: { lat: 31.4, lng: -93.75 },
    peakSeason: 'Spring',
    bestMonths: ['Feb', 'Mar', 'Apr'],
    topSpecies: ['Largemouth Bass', 'Crappie'],
    signaturePattern: 'hydrilla-edge largemouth',
    summary:
      'A perennial top-ranked bass factory on the Texas-Louisiana line. Deep hydrilla edges, timber and ledges grow heavy largemouth, with a famous late-winter and spring trophy window.',
  },
  {
    rank: 8,
    name: 'Sam Rayburn Reservoir',
    state: 'TX',
    slug: 'sam-rayburn-fishing-reports',
    reports: 135,
    coordinates: { lat: 31.06, lng: -94.1 },
    peakSeason: 'Spring',
    bestMonths: ['Feb', 'Mar', 'Apr'],
    topSpecies: ['Largemouth Bass', 'Crappie'],
    signaturePattern: 'grass-and-timber largemouth',
    summary:
      'East Texas&apos;s big-bass mainstay, loaded with hydrilla, standing timber and offshore ledges. Tournament-caliber largemouth and a famous pre-spawn punch bite headline the year.',
  },
  {
    rank: 9,
    name: 'Lake Champlain',
    state: 'VT/NY',
    slug: 'lake-champlain-fishing-reports',
    reports: 147,
    coordinates: { lat: 44.5, lng: -73.33 },
    peakSeason: 'Summer',
    bestMonths: ['Jun', 'Jul', 'Aug'],
    topSpecies: ['Largemouth Bass', 'Smallmouth Bass'],
    signaturePattern: 'two-bass tournament lake',
    summary:
      "A legendary dual-species tournament fishery. Grassy bays grow heavy largemouth while the main lake's rock holds elite smallmouth, making 20-pound mixed bags routine.",
  },
  {
    rank: 10,
    name: 'Lake Lanier',
    state: 'GA',
    slug: 'lake-lanier-fishing-reports',
    reports: 136,
    coordinates: { lat: 34.22, lng: -84.07 },
    peakSeason: 'Winter',
    bestMonths: ['Jan', 'Feb', 'Nov'],
    topSpecies: ['Spotted Bass', 'Striped Bass'],
    signaturePattern: 'deep spotted bass',
    summary:
      'A clear, deep North Georgia lake that grows oversized spotted bass on blueback herring. Offshore brush, points and humps fish well year-round, with a strong cold-water bite.',
  },
  {
    rank: 11,
    name: 'Kentucky Lake',
    state: 'KY/TN',
    slug: 'kentucky-lake-fishing-reports',
    reports: 264,
    coordinates: { lat: 36.5, lng: -88.05 },
    peakSeason: 'Summer',
    bestMonths: ['May', 'Jun', 'Jul'],
    topSpecies: ['Largemouth Bass', 'Crappie'],
    signaturePattern: 'offshore ledge largemouth',
    summary:
      'The classic Tennessee River ledge fishery. Summer schools of largemouth set up on offshore ledges and shell beds, and the crappie fishing is nationally renowned.',
  },
  {
    rank: 12,
    name: 'Table Rock Lake',
    state: 'MO',
    slug: 'table-rock-lake-fishing-reports',
    reports: 204,
    coordinates: { lat: 36.6, lng: -93.3 },
    peakSeason: 'Spring',
    bestMonths: ['Apr', 'May', 'Oct'],
    topSpecies: ['Largemouth Bass', 'Smallmouth Bass', 'Spotted Bass'],
    signaturePattern: 'three-species Ozark bite',
    summary:
      'A clear Ozark highland reservoir holding all three black bass species. Bluffs, chunk-rock points and brush piles drive a finesse-heavy bite that shines in spring and fall.',
  },
  {
    rank: 13,
    name: 'Lake Hartwell',
    state: 'GA/SC',
    slug: 'lake-hartwell-fishing-reports',
    reports: 166,
    coordinates: { lat: 34.45, lng: -82.85 },
    peakSeason: 'Fall',
    bestMonths: ['Oct', 'Nov', 'Mar'],
    topSpecies: ['Largemouth Bass', 'Spotted Bass', 'Striped Bass'],
    signaturePattern: 'blueback-herring schools',
    summary:
      'A Bassmaster Classic mainstay on the Savannah River chain. Largemouth and spotted bass chase blueback herring on points and humps, with a strong fall and winter pattern.',
  },
  {
    rank: 14,
    name: 'Chickamauga Lake',
    state: 'TN',
    slug: 'chickamauga-lake-fishing-reports',
    reports: 189,
    coordinates: { lat: 35.4, lng: -85.1 },
    peakSeason: 'Spring',
    bestMonths: ['Feb', 'Mar', 'Apr'],
    topSpecies: ['Largemouth Bass'],
    signaturePattern: 'giant grass largemouth',
    summary:
      'A Tennessee River trophy lake that has produced multiple state-record-class largemouth. Offshore grass, ledges and current seams grow giants, with a famous late-winter big-fish window.',
  },
  {
    rank: 15,
    name: 'Leech Lake',
    state: 'MN',
    slug: 'leech-lake-fishing-reports',
    reports: 121,
    coordinates: { lat: 47.15, lng: -94.38 },
    peakSeason: 'Summer',
    bestMonths: ['Jun', 'Jul', 'Sep'],
    topSpecies: ['Walleye', 'Muskie', 'Smallmouth Bass'],
    signaturePattern: 'big-water walleye',
    summary:
      'A sprawling northern Minnesota walleye and muskie water with vast cabbage flats and rock bars. Strong report volume makes its seasonal walleye movements well-documented.',
  },
  {
    rank: 16,
    name: 'Lake St. Clair',
    state: 'MI',
    slug: 'lake-saint-clair-fishing-reports',
    reports: 218,
    coordinates: { lat: 42.45, lng: -82.7 },
    peakSeason: 'Summer',
    bestMonths: ['Jun', 'Jul', 'Aug'],
    topSpecies: ['Smallmouth Bass', 'Muskie'],
    signaturePattern: 'drift-and-drop smallmouth',
    summary:
      'A shallow Great Lakes connecting water widely called the best smallmouth fishery in the country. Endless grass and sand flats hold giant brown bass plus a trophy muskie population.',
  },
  {
    rank: 17,
    name: 'Lake Winnebago',
    state: 'WI',
    slug: 'lake-winnebago-fishing-reports',
    reports: 179,
    coordinates: { lat: 44.0, lng: -88.42 },
    peakSeason: 'Summer',
    bestMonths: ['May', 'Jun', 'Jul'],
    topSpecies: ['Walleye', 'Smallmouth Bass'],
    signaturePattern: 'big-water trolling walleye',
    summary:
      "Wisconsin's largest inland lake and a walleye trolling mecca. Open-water mudline and reef patterns dominate, with a strong and growing smallmouth fishery on the rock.",
  },
  {
    rank: 18,
    name: 'Lake Michigan',
    state: 'MI/WI/IL/IN',
    slug: 'lake-michigan-fishing-reports',
    reports: 114,
    coordinates: { lat: 43.5, lng: -87.0 },
    zoom: 8,
    peakSeason: 'Summer',
    bestMonths: ['Jun', 'Jul', 'Aug'],
    topSpecies: ['Smallmouth Bass', 'Walleye'],
    signaturePattern: 'harbor and reef smallmouth',
    summary:
      'A Great Lakes giant whose harbors, breakwalls and nearshore reefs hold trophy smallmouth. Conditions-dependent and electronics-driven, with a short but explosive prime window.',
  },
  {
    rank: 19,
    name: 'St. Lawrence River',
    state: 'NY',
    slug: 'st-lawrence-river-fishing-reports',
    reports: 115,
    coordinates: { lat: 44.3, lng: -75.9 },
    zoom: 8,
    peakSeason: 'Summer',
    bestMonths: ['Jul', 'Aug', 'Sep'],
    topSpecies: ['Smallmouth Bass', 'Largemouth Bass', 'Muskie'],
    signaturePattern: 'current-driven smallmouth',
    summary:
      'A current-driven trophy smallmouth fishery in the Thousand Islands. Deep current seams, shoals and weed edges hold giant brown bass, plus muskie and quality largemouth in the bays.',
  },
  {
    rank: 20,
    name: 'Cayuga Lake',
    state: 'NY',
    slug: 'cayuga-lake-fishing-reports',
    reports: 119,
    coordinates: { lat: 42.7, lng: -76.7 },
    peakSeason: 'Summer',
    bestMonths: ['Jun', 'Jul', 'Sep'],
    topSpecies: ['Smallmouth Bass', 'Largemouth Bass'],
    signaturePattern: 'Finger Lakes dual-bass',
    summary:
      'The largest Finger Lake and a sleeper dual-species bass fishery. Deep clear water holds strong smallmouth on the rock while weedy shallows and inlets grow quality largemouth.',
  },
];

function trailing30(reports: number): number {
  return Math.max(3, Math.round(reports / 11));
}

export const LAKES: Lake[] = SEEDS.map((seed): Lake => {
  const isMilleLacs = seed.slug === 'mille-lacs-lake-fishing-reports';
  return {
    slug: seed.slug,
    name: seed.name,
    state: seed.state,
    rank: seed.rank,
    summary: seed.summary,
    signaturePattern: seed.signaturePattern,
    peakSeason: seed.peakSeason,
    stats: {
      topSpecies: seed.topSpecies,
      bestMonths: seed.bestMonths,
    },
    reportCount: seed.reports,
    reportCountTrailing30: trailing30(seed.reports),
    updatedAt: UPDATED,
    coordinates: seed.coordinates,
    zoom: seed.zoom,
    patterns: isMilleLacs ? milleLacsPatterns : buildSamplePatterns(seed.topSpecies),
    dataStatus: isMilleLacs ? 'reference' : 'sample',
  };
});

export function getLake(slug: string): Lake | undefined {
  return LAKES.find((l) => l.slug === slug);
}

export function lakesByRank(): Lake[] {
  return [...LAKES].sort((a, b) => a.rank - b.rank);
}

/** Sibling lakes for a guide's internal link block (excludes the current lake). */
export function siblingLakes(slug: string, count = 6): Lake[] {
  return lakesByRank()
    .filter((l) => l.slug !== slug)
    .slice(0, count);
}

// ── Hub config (build-spec Sections 6.1, 8.2) ────────────────────────────────

export const hubBass2026: HubConfig = {
  slug: 'best-bass-lakes-2026',
  title: 'The Best Bass Lakes of 2026',
  intro:
    'These are the 20 best bass lakes in the country for 2026, ranked by Omnia using 20,000+ angler fishing reports plus favorites data. Guntersville, Mille Lacs and Lake Minnetonka top the list, but every lake below links to a full seasonal pattern guide built from real reports.',
  methodology:
    'Lakes are ranked by a blended score combining angler report volume and favorites in the Omnia system, then tie-broken by export order. Pattern guides are synthesized from the underlying reports and refreshed as new reports come in.',
  updatedAt: UPDATED,
  faq: [
    {
      question: 'What is the best bass lake in America in 2026?',
      answerHtml:
        'Guntersville Lake in Alabama tops Omnia&rsquo;s 2026 ranking as the best overall bass lake, driven by its Tennessee River grass, ledge fishing, and consistent big-largemouth reports. Mille Lacs Lake (MN) and Lake Minnetonka (MN) round out the top three.',
    },
    {
      question: 'How were these bass lakes ranked?',
      answerHtml:
        'Each lake earns a blended score from its angler report volume and favorites in the Omnia system across 20,000+ reports. Lakes that tie at the top are broken by export order. The ranking refreshes as new reports come in.',
    },
    {
      question: 'When is the best time to fish Guntersville Lake?',
      answerHtml:
        'The pre-spawn through spring window (roughly February to April) is the most famous big-bass period on Guntersville, when largemouth stage outside grass flats. Fall is a strong second window as bass follow shad into the creeks.',
    },
    {
      question: "My lake isn't on the list — can I still get patterns?",
      answerHtml:
        'Yes. Omnia has seasonal patterns and reports for 100,000+ waterbodies. Open the map and search any lake to pull up its fishing patterns, reports, and matched tackle.',
    },
  ],
};
