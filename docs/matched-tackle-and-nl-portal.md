# Matched Tackle + Natural-Language Portal

**Purpose:** turn Omnia's existing "what should I throw here" engine (rank by
technique, sort baits by report mentions on the waterbody) — today buried inside the
map app — into a **shared headless service** that every surface renders from, and put
a **natural-language front door** on it.

This is a working reference built in the homepage-redesign prototype. The catalog and
report-mention counts are **mock**; production swaps the resolver for Omnia's real
recommendation API and the NL parser for an LLM.

---

## The architecture: one engine, many surfaces

```
                    ┌─────────────────────────────┐
   NL query  ──▶    │   getMatchedTackle(query)    │   ◀── the single source of truth
   (LLM parse)      │  rank techniques, sort baits │       (lib/aeo/tackle.ts)
                    │  by report mentions on lake  │
                    └──────────────┬──────────────┘
                                   │  MatchedTackleResult
        ┌──────────────┬───────────┼───────────────┬──────────────────┐
        ▼              ▼           ▼                ▼                  ▼
   map top_techniques  /shop/lake  AEO answer block  /tackle (NL)   /api/matched-tackle
   (existing)          collection  (inline, indexed)  portal         (headless contract)
```

The rule: **never fork the ranking.** The map, shop, answer blocks, and portal all
call the same resolver, so they can never disagree.

---

## The contract

`getMatchedTackle({ waterbodySlug, species, seasonGroup? })` → `MatchedTackleResult`:

```ts
{
  context: { waterbodySlug, lakeName, species, speciesParam, seasonGroup, source },
  techniques: [
    { slug, label, rank, products: [
      { id, name, brand, priceUsd, productUrl, reportMentions }  // sorted by reportMentions desc
    ]}
  ]
}
```

Same contract over HTTP at **`/api/matched-tackle`**:
- Structured: `?waterbody_slug=…&species=…&season_group=…`
- Natural language: `?q=smallmouth on mille lacs in summer` (server parses, then matches)

Params use Omnia's live vocabulary: snake_case `species` (`smallmouth_bass`),
lowercase `season_group`, kebab `waterbody_slug`.

---

## Render targets (files)

| Surface | File | Notes |
| --- | --- | --- |
| Shared engine | `lib/aeo/tackle.ts` | Resolver, mock catalog, NL parser. **Replace internals with the real API.** |
| Headless API | `app/api/matched-tackle/route.ts` | The contract devs wire to the recommendation service |
| Renderer | `components/aeo/MatchedTackle.tsx` | Props-only; `full` + `compact` variants; used in every surface |
| Shop collection | `app/shop/lake/[slug]/[species]/page.tsx` | Indexable contextual-commerce page; `ItemList`/`Product` JSON-LD |
| Answer-block embed | `components/aeo/ui.tsx` (`AnswerBlock`) | Compact matched tackle inline = part of the cited answer |
| NL portal | `app/tackle/page.tsx` + `components/aeo/TacklePortal.tsx` | Free-text → API → render |
| Map tab | *(map app, out of repo)* | Refactor to consume the same service |

`shopBaitsUrl()` (in `lib/aeo/links.ts`) now targets the path-based collection
`/shop/lake/{slug}/{species}?season_group=…`; `mapTechniquesUrl()` deep-links the
map's `top_techniques` tab.

---

## What production needs to do

> **Confirmed (Matt, 2026-06-08):** the ranking engine **is already headless** — it
> serves both the map *and* the legacy lake pages and is "wide open for use." So
> lifting matched-tackle onto our surfaces is **wiring, not a backend extraction.**
> Two specifics still need the engineer (for Matt's eng call) before the wrapper is
> exact — Matt is product, not the engineer, so these are stubbed pending that call:
>
> - **Q1 — How is the service addressed?** The exact endpoint / resolver name the map
>   and legacy lake pages already call (e.g. `/api/...` route or GraphQL resolver).
>   That one string is all `getMatchedTackle()`'s production body needs to call.
> - **Q2 — Does the response already include the report-mention sort?** i.e. does the
>   service return baits *already ordered* by mentions on that waterbody, or does it
>   return ranked techniques + bait lists and the **client** does the report-mention
>   sort? Decides whether the `reportMentions` sort in `tackle.ts` (line ~269) stays in
>   our wrapper or is redundant.
>
> Until answered, `getMatchedTackle()` keeps its mock body; the contract/return shape
> below is the stub the real call must satisfy.

1. **Wire `getMatchedTackle`** to the real (confirmed-headless) recommendation API —
   rank by technique, sort baits by report mentions on the waterbody. Endpoint name =
   **Q1 above**; whether to keep our local sort = **Q2 above**. Keep the return shape
   and everything downstream is unchanged.
2. **Canonical technique/color slugs.** The resolver expects canonical tags
   (`Pattern.techniqueTags`, `colorFamily`) from the store taxonomy; the synthesis
   pipeline should emit them. Sample lakes fall back to a per-species default today.
3. **Swap the NL parser for an LLM** via Vercel AI Gateway (e.g.
   `anthropic/claude-sonnet-4.6`): extract `{species, waterbody_slug, season_group}`
   from free text, then call the same resolver. This is also where **environmental
   variables** (water temp, clarity, wind, cold fronts) get parsed and fed in as the
   feature expands.
4. **Make `/shop/lake/...` indexable** (drop the prototype `noindex`) — a server-
   rendered "best baits for {species} on {lake}" page is itself an AEO asset that can
   own those queries *and* convert.
5. **PRO gating:** keep the matched product list **free + indexable** (it's the
   conversion path); gate only live conditions/personalization. A citation must never
   dead-end on a paywall.

---

## The roadmap this sets up

The NL portal is the seed of the feature you described: a conversational tackle
advisor keyed on **species → lake → state → season → environmental variables**.
Because every surface already runs on one contract, expanding the inputs (add
`water_temp`, `clarity`, `wind`, `front` to the query + resolver) lights up all
surfaces at once — the map tab, the shop pages, the answer blocks, and the portal.
