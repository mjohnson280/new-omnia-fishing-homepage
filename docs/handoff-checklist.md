# AEO Harmonization — Handoff Checklist

**Last worked:** 2026-06-11 · **Branch:** everything on `main` (HEAD `7bed073`) · **Status:** prototype complete, ready to test → hand to devs.
Pick this up here tomorrow.

---

## 1. Where things stand (what shipped 2026-06-11)

- ✅ **Both AEO hubs harmonized on one lake-first structure**, rendered by a single shared
  `CanonicalLakeCard` (`components/aeo/ui.tsx`).
  - National `/a/best-fishing-lakes-2026` — multi-species lens.
  - Minnesota `/a/best-fishing-lakes-minnesota` — **lake-first** (all-site activity), with
    **bass as a content lens** + the per-species bass sections moved *below* the primary list.
- ✅ **Four-destination cluster** on every lake card, fixed priority: **patterns guide →
  fish-species (DNR) → map centroid → shop**.
- ✅ **Shop links wired but gated** — `SHOP_LINKS_ENABLED = false` in `lib/aeo/links.ts`.
- ✅ **SOP written** — `docs/aeo-canonical-sop.md` (governing playbook).
- ✅ **`/shop` filtered+sorted API contract** consolidated in `docs/matched-tackle-and-nl-portal.md`.
- ✅ `tsc --noEmit` + `next lint` clean. `CLAUDE.md` updated.

---

## 2. To do tomorrow — TEST (before hand-off)

Open the live preview (stage.mjcreativelogic.com / main demo) and eyeball:

- [ ] **National hub** `/a/best-fishing-lakes-2026` — lake cards show guide + fish-species + map
      links; jump-nav anchors (`#rank-N`) still scroll correctly.
- [ ] **MN hub** `/a/best-fishing-lakes-minnesota` — lake-first list is the primary section; bass
      "by species" sections render *below* it; "Browse all 500" link works.
- [ ] **Editorial lens** — MN cards show the bass blurb + species badge where a lake has one;
      neutral cards otherwise; ranking order is unchanged (all-activity).
- [ ] **Confirm the MN H1 rename** — it now reads **"The Best Fishing Lakes in Minnesota"**
      (was "Best Bass Lakes"). Decide: keep, or revert the H1 to defend the bass query. (Ask
      Claude to revert just the title if so — structure stays lake-first either way.)
- [ ] Shop CTA correctly **absent** (gated) on all cards — expected until the API is live.

---

## 3. To do — HAND OFF (the dev bundle)

Deliver these five docs (in order) so devs can integrate + make API changes:

1. [ ] **`docs/aeo-canonical-sop.md`** — read first; the canonical structure + self-service page kit.
2. [ ] **`docs/matched-tackle-and-nl-portal.md`** — the `/shop` + tackle **API-change doc**
       (engine wiring + the consolidated filtered/sorted store contract).
3. [ ] **`docs/aeo-lake-content-system.md`** — hub + lake-guide go-live steps.
4. [ ] **`docs/mn-fishing-and-dnr.md`** — MN hub + DNR spoke; DNR fields still needed.
5. [ ] **`docs/lake-centroid-tool.md`** — slug→centroid→map deep-link tool.

Plus the code: `lib/aeo/*`, `components/aeo/*`, routes under `app/`.

---

## 4. Blocking dev inputs (the production lift waits on these)

Get these answers from the engineer before the `/shop` + spoke work can be wired:

- [ ] **Q1 (endpoint):** the exact headless endpoint/resolver name `getMatchedTackle()` should call.
- [ ] **Q2 (sort):** does that service already return baits sorted by report-mentions, or does the
      client sort? (Decides whether the local sort in `tackle.ts` stays.)
- [ ] **DNR fields:** a sample of the real per-lake DNR metrics (CPUE? abundance rating? lengths?
      survey year?) to align the `DnrSurvey` model.
- [ ] **Open AEO item (a):** do Omnia's existing prod `/w/{slug}/fish-species` pages already hold
      DNR data? If yes → **restructure those, don't rebuild.**

---

## 5. Dev go-live switches (for when devs are ready — not for the prototype)

- [ ] Set `PROD_BASE = ''` in `lib/aeo/links.ts` (same-origin links).
- [ ] Remove `robots: { index: false }` from the page templates (drop the prototype `noindex`).
- [ ] Wire `getMatchedTackle()` to the real recommendation API (Q1/Q2 above).
- [ ] Flip `SHOP_LINKS_ENABLED = true` once the `/shop` API is live + `/shop/lake/...` is indexable.
- [ ] Replace `lib/aeo/data.ts` / `patterns.ts` with synthesis output; join real centroids.
- [ ] **Merge, don't replace** existing live `/w/{slug}/*` pages — this is a retrofit.

---

## 6. Still open (product/strategy, not blocking the hand-off)

- [ ] How to **measure** AEO lift (AI-overview citations, referral traffic, indexed spokes).
- [ ] When MN walleye/muskie report volume justifies it, spin up `/a/best-walleye-lakes-minnesota`
      — same `MnSpeciesRankings` component, new config (no new layout).
