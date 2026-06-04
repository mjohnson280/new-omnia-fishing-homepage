// Illustrative season x species pattern templates for the prototype.
//
// HANDOFF NOTE: These templates produce PLAUSIBLE-BUT-GENERIC patterns so every
// lake page renders fully. They are NOT lake-specific synthesized data. In
// production, Omnia's report-to-pattern synthesis pipeline replaces these with
// real per-lake patterns (build-spec Sections 4 + 14). The one exception is
// Mille Lacs, which carries the real worked-example data from the spec.

import type { Pattern, Season, SpawnPhase } from './types';
import { anchorFor } from './format';

type Template = Omit<Pattern, 'species' | 'anchorId'>;

// Keyed by `${species}|${season}`.
const TEMPLATES: Record<string, Template> = {
  'Largemouth Bass|Spring': {
    season: 'Spring',
    phase: 'Pre-Spawn',
    waterTempF: { min: 48, max: 58 },
    behavior: 'fish stage on the first drop outside spawning flats and feed up as the water warms',
    locations: ['Protected creek arms and bays', 'First drop off spawning flats'],
    techniques: ['lipless cranks and bladed jigs worked', 'jerkbaits paused'],
    forage: { primary: 'shad', secondary: 'crawfish' },
    baitColors: ['Red Craw', 'Natural Shad'],
    structures: { primary: 'Shallow flats', secondary: 'Creek channels' },
  },
  'Largemouth Bass|Summer': {
    season: 'Summer',
    phase: null,
    waterTempF: { min: 78, max: 86 },
    behavior: 'fish school on offshore structure and chase shad early and late',
    locations: ['Offshore ledges in 12-20 feet', 'Deep grass edges'],
    techniques: ['deep crankbaits and Carolina rigs dragged', 'big worms'],
    forage: { primary: 'shad', secondary: 'bluegill' },
    baitColors: ['Green Pumpkin', 'Sexy Shad'],
    structures: { primary: 'Offshore ledges', secondary: 'Grass lines' },
  },
  'Largemouth Bass|Fall': {
    season: 'Fall',
    phase: null,
    waterTempF: { min: 55, max: 68 },
    behavior: 'fish follow shad into the backs of creeks and feed aggressively as water cools',
    locations: ['Backs of creeks', 'Secondary points'],
    techniques: ['squarebill cranks and spinnerbaits burned', 'topwater'],
    forage: { primary: 'shad' },
    baitColors: ['Sexy Shad', 'White'],
    structures: { primary: 'Creek backs', secondary: 'Points' },
  },
  'Smallmouth Bass|Spring': {
    season: 'Spring',
    phase: 'Pre-Spawn',
    waterTempF: { min: 46, max: 56 },
    behavior: 'fish cruise warming rock transitions near gravel and feed up before the spawn',
    locations: ['Rock-to-gravel transitions', 'Staging flats near spawning bays'],
    techniques: ['suspending jerkbaits and tubes worked', 'hair jigs'],
    forage: { primary: 'crawfish' },
    baitColors: ['Natural Craw', 'Smoke'],
    structures: { primary: 'Rock transitions', secondary: 'Gravel flats' },
  },
  'Smallmouth Bass|Summer': {
    season: 'Summer',
    phase: null,
    waterTempF: { min: 68, max: 76 },
    behavior: 'fish relate to offshore rock and chase gobies or crawfish',
    locations: ['Deep rock humps in 14-25 feet', 'Main-lake reefs'],
    techniques: ['drop shots and Ned rigs fished', 'tubes'],
    forage: { primary: 'gobies', secondary: 'crawfish' },
    baitColors: ['Green Pumpkin', 'Goby'],
    structures: { primary: 'Rock humps', secondary: 'Reefs' },
  },
  'Smallmouth Bass|Fall': {
    season: 'Fall',
    phase: null,
    waterTempF: { min: 50, max: 62 },
    behavior: 'fish group up on wind-blown structure and feed heavily before winter',
    locations: ['Wind-blown points', 'Rock shoreline breaks'],
    techniques: ['jerkbaits and swimbaits worked', 'blade baits'],
    forage: { primary: 'baitfish' },
    baitColors: ['Natural Shad', 'Pearl'],
    structures: { primary: 'Wind-blown points', secondary: 'Rock' },
  },
  'Walleye|Spring': {
    season: 'Spring',
    phase: 'Pre-Spawn',
    waterTempF: { min: 42, max: 52 },
    behavior: 'fish stage near spawning rock and feed in low light',
    locations: ['River mouths', 'Shallow rock shorelines in 4-10 feet'],
    techniques: ['jigs tipped with minnows', 'shallow cranks'],
    forage: { primary: 'minnows' },
    baitColors: ['Glow', 'Chartreuse'],
    structures: { primary: 'River mouths', secondary: 'Rock shorelines' },
  },
  'Walleye|Summer': {
    season: 'Summer',
    phase: null,
    waterTempF: { min: 68, max: 74 },
    behavior: 'fish suspend over basins and relate to mid-lake humps',
    locations: ['Mid-lake humps in 18-30 feet', 'Basin edges'],
    techniques: ['live-bait rigs and crawler harnesses trolled', 'deep cranks'],
    forage: { primary: 'perch', secondary: 'shad' },
    baitColors: ['Gold', 'Firetiger'],
    structures: { primary: 'Mid-lake humps', secondary: 'Basin edges' },
  },
  'Walleye|Fall': {
    season: 'Fall',
    phase: null,
    waterTempF: { min: 40, max: 52 },
    behavior: 'fish feed shallow in low light and at night as water cools',
    locations: ['Shallow rock in 7-14 feet', 'Shoreline breaks'],
    techniques: ['blade baits and jigs fished', 'crankbaits'],
    forage: { primary: 'baitfish' },
    baitColors: ['Metallic', 'Natural Baitfish'],
    structures: { primary: 'Shallow rock', secondary: 'Shoreline breaks' },
  },
  'Muskie|Summer': {
    season: 'Summer',
    phase: null,
    waterTempF: { min: 70, max: 78 },
    behavior: 'fish patrol deep weed lines and follow ciscoes and panfish',
    locations: ['Deep weed edges in 8-18 feet', 'Main-lake rock bars'],
    techniques: ['bucktails and glide baits worked', 'topwater'],
    forage: { primary: 'ciscoes', secondary: 'panfish' },
    baitColors: ['Natural Sucker', 'Black/Orange'],
    structures: { primary: 'Weed edges', secondary: 'Rock bars' },
  },
  'Muskie|Fall': {
    season: 'Fall',
    phase: null,
    waterTempF: { min: 48, max: 60 },
    behavior: 'fish feed up on big forage over deep structure before winter',
    locations: ['Deep rock in 12-25 feet', 'Basin edges near forage'],
    techniques: ['large rubber baits and glide baits worked', 'live suckers'],
    forage: { primary: 'suckers', secondary: 'ciscoes' },
    baitColors: ['Sucker', 'Perch'],
    structures: { primary: 'Deep rock', secondary: 'Basin edges' },
  },
  'Northern Pike|Summer': {
    season: 'Summer',
    phase: null,
    waterTempF: { min: 70, max: 78 },
    behavior: 'fish ambush from deep weed lines near cooler water',
    locations: ['Deep weed edges in 8-16 feet', 'Main-lake points'],
    techniques: ['spinnerbaits and large swimbaits burned', 'spoons'],
    forage: { primary: 'panfish', secondary: 'ciscoes' },
    baitColors: ['Firetiger', 'White'],
    structures: { primary: 'Weed edges', secondary: 'Points' },
  },
  'Striped Bass|Summer': {
    season: 'Summer',
    phase: null,
    waterTempF: { min: 78, max: 85 },
    behavior: 'fish school and chase shad early and late on main-lake structure',
    locations: ['Main-lake humps in 18-35 feet', 'Channel swings'],
    techniques: ['live shad fished', 'topwater and bucktails'],
    forage: { primary: 'shad' },
    baitColors: ['Shad', 'White'],
    structures: { primary: 'Main-lake humps', secondary: 'Channels' },
  },
  'Spotted Bass|Summer': {
    season: 'Summer',
    phase: null,
    waterTempF: { min: 78, max: 85 },
    behavior: 'fish suspend near bait over deep points and brush',
    locations: ['Deep points in 18-35 feet', 'Offshore brush'],
    techniques: ['drop shots and jigs worked', 'spoons'],
    forage: { primary: 'shad', secondary: 'crawfish' },
    baitColors: ['Green Pumpkin', 'Shad'],
    structures: { primary: 'Deep points', secondary: 'Brush' },
  },
  'Crappie|Spring': {
    season: 'Spring',
    phase: null,
    waterTempF: { min: 55, max: 65 },
    behavior: 'fish stage near cover and move shallow to spawn',
    locations: ['Brushy banks in 2-8 feet', 'Boat docks'],
    techniques: ['small jigs and minnows fished', 'slip floats'],
    forage: { primary: 'minnows' },
    baitColors: ['Chartreuse', 'Black/Chartreuse'],
    structures: { primary: 'Brush', secondary: 'Docks' },
  },
};

const DEFAULT_SEASONS: Season[] = ['Spring', 'Summer', 'Fall'];

/**
 * Build illustrative patterns for a lake from its top species across the default
 * seasons. Skips combos with no template. Marks Summer live-data rows as PRO to
 * demonstrate gating without paywalling the answer block (spec Section 10).
 */
export function buildSamplePatterns(species: string[]): Pattern[] {
  const out: Pattern[] = [];
  for (const sp of species) {
    for (const season of DEFAULT_SEASONS) {
      const tpl = TEMPLATES[`${sp}|${season}`];
      if (!tpl) continue;
      out.push({
        ...tpl,
        species: sp,
        anchorId: anchorFor(tpl.season, tpl.phase as SpawnPhase, sp),
        isPro: season === 'Summer',
      });
    }
  }
  return out;
}
