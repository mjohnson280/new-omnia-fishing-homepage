// Pure formatting helpers shared by the data layer and components.

import type { Pattern, Season, SpawnPhase } from './types';

export function kebab(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** snake_case, matching Omnia's live param vocabulary (e.g. species=largemouth_bass). */
export function snake(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

/** Species param value, snake_case: "Smallmouth Bass" -> "smallmouth_bass". */
export function speciesParam(species: string): string {
  return snake(species);
}

/** Omnia's season filter param is `season_group`, lowercased: "Summer" -> "summer". */
export function seasonGroupParam(season: Season): string {
  return season.toLowerCase();
}

/** Stable cross-lake pattern key for attribution/curation: "{slug}__{anchorId}". */
export function patternKey(slug: string, anchorId: string): string {
  return `${slug}__${anchorId}`;
}

/** Anchor id = "{season-phase}-{species}", kebab-case. Stable across rebuilds. */
export function anchorFor(season: Season, phase: SpawnPhase, species: string): string {
  const parts = [season, phase ?? '', species].filter(Boolean).join(' ');
  return kebab(parts);
}

/** Human-readable season label, including spawn phase when present. */
export function seasonLabel(season: Season, phase: SpawnPhase): string {
  return phase ? `${season} (${phase})` : season;
}

/** H3 heading for an answer block: "Summer smallmouth bass on Mille Lacs Lake". */
export function patternHeading(p: Pattern, lakeName: string): string {
  const phase = p.phase ? ` ${p.phase.toLowerCase()}` : '';
  return `${p.season}${phase} ${p.species.toLowerCase()} on ${lakeName}`;
}

/**
 * Generate the 40-60 word answer block from Pattern fields (build-spec Section 5).
 * Leads with the direct answer; names lake + species explicitly for entity clarity.
 */
export function buildAnswerText(p: Pattern, lakeName: string): string {
  if (p.answerOverride) return p.answerOverride;

  const seasonPart = p.phase
    ? `${p.season.toLowerCase()} (${p.phase.toLowerCase()})`
    : p.season.toLowerCase();
  const technique = p.techniques[0] ?? 'proven presentations';
  const location = p.locations[0] ?? p.structures.primary;
  const color = (p.baitColors[0] ?? 'natural').toLowerCase();
  const behavior = p.behavior.replace(/\.$/, '');

  return (
    `For ${seasonPart} ${p.species.toLowerCase()} on ${lakeName}, ${technique} on ${location.toLowerCase()} ` +
    `using ${color}. Water temps run ${p.waterTempF.min} to ${p.waterTempF.max}°F, and ${behavior}.`
  );
}
