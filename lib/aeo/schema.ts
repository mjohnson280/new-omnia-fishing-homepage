// JSON-LD builders (build-spec Section 8). Pure functions returning plain objects;
// a server component serializes them into <script type="application/ld+json">.
// All URLs are production-canonical so the structured data is correct wherever
// it is crawled.

import type { FaqItem, HubConfig, Lake } from './types';
import { canonicalGuideUrl, canonicalHubUrl, HUB_PATH, CANONICAL_BASE } from './links';

const ORG = {
  '@type': 'Organization',
  name: 'Omnia Fishing',
  logo: {
    '@type': 'ImageObject',
    url: 'https://www.omniafishing.com/logo.png',
  },
};

export interface Crumb {
  name: string;
  url: string;
}

export function breadcrumbSchema(trail: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  };
}

export function faqSchema(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.question,
      acceptedAnswer: {
        '@type': 'Answer',
        // Strip tags for the schema text value; rich text stays in the rendered HTML.
        text: it.answerHtml.replace(/<[^>]+>/g, ''),
      },
    })),
  };
}

export function lakeArticleSchema(lake: Lake) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `How to Fish ${lake.name}: Best Patterns & Techniques`,
    about: {
      '@type': 'Place',
      name: lake.name,
      address: { '@type': 'PostalAddress', addressRegion: lake.state },
    },
    datePublished: '2018-11-01',
    dateModified: lake.updatedAt,
    author: ORG,
    publisher: ORG,
    mainEntityOfPage: canonicalGuideUrl(lake.slug),
  };
}

export function lakeDatasetSchema(lake: Lake) {
  const hasGated = lake.patterns.some((p) => p.isPro);
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `${lake.name} seasonal fishing patterns`,
    description: `Seasonal fishing patterns for ${lake.name} by species, synthesized from angler fishing reports.`,
    creator: { '@type': 'Organization', name: 'Omnia Fishing' },
    dateModified: lake.updatedAt,
    isAccessibleForFree: !hasGated,
    variableMeasured: [
      'species',
      'season',
      'water temperature',
      'technique',
      'location',
      'forage',
      'bait color',
    ],
  };
}

export function hubItemListSchema(lakes: Lake[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Best Bass Lakes of 2026',
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    numberOfItems: lakes.length,
    itemListElement: lakes.map((lake) => ({
      '@type': 'ListItem',
      position: lake.rank,
      name: lake.name,
      url: canonicalGuideUrl(lake.slug),
    })),
  };
}

export function hubBreadcrumb(hub: HubConfig): Crumb[] {
  return [
    { name: 'Home', url: `${CANONICAL_BASE}/` },
    { name: 'Articles', url: `${CANONICAL_BASE}/a` },
    { name: hub.title, url: canonicalHubUrl() },
  ];
}

export function lakeBreadcrumb(lake: Lake): Crumb[] {
  return [
    { name: 'Home', url: `${CANONICAL_BASE}/` },
    { name: 'Best Bass Lakes 2026', url: `${CANONICAL_BASE}${HUB_PATH}` },
    { name: lake.name, url: canonicalGuideUrl(lake.slug) },
  ];
}
