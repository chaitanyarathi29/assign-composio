# Verification Loop — Step-by-Step Instructions

This document walks you through running the **before/after verification loop** that the assignment asks for. Follow these steps exactly in order.

## What you'll produce

- **Pass 1** (baseline) numbers: coverage %, browser-verify %, manual accuracy %
- **Pass 2** (after fixes) numbers: improved versions of the same metrics
- A comparison table showing the delta

---

## STEP 1 — Run Pass 1 (Baseline)

Start fresh. Don't touch `aliasMap.ts` or fix anything yet.

```bash
npm run research
```

This queries the Composio SDK for all 100 apps and writes `output/research-results.json`.

**Save Pass 1 research results:**

```bash
cp output/research-results.json output/pass1-research-results.json
```

---

## STEP 2 — Browser verification (automated)

This fetches the actual Composio docs page for each matched app and checks if the app name appears in the HTML. Flags suspicious mismatches.

```bash
npm run browser-verify
```

Writes `output/browser-check-results.json` with a `confirmed` count and a `suspicious` list.

**Save Pass 1 browser check:**

```bash
cp output/browser-check-results.json output/pass1-browser-check.json
```

Look at the `suspiciousApps` section — these are apps where the pipeline said "found" but the docs page doesn't mention that app name. You'll fix these in Step 4.

---

## STEP 3 — Manual verification (human-in-the-loop)

This is the **critical step** — you manually cross-check a sample against real docs.

### 3a. Pick your sample (15-20 apps)

Open `output/pass1-research-results.json` and pick:
- 5-7 apps marked `foundInComposio: true`
- 3-5 apps marked `foundInComposio: false`
- All apps flagged `suspicious` in Step 2 (if any)
- Spread across multiple categories

### 3b. Manually check each one

For each app in your sample:

1. Go to **https://docs.composio.dev/apps** in your browser
2. Search for the app name
3. Note down:
   - Does it actually exist? (Yes/No)
   - What's the real slug? (from the URL)
   - What auth methods does the docs page list?

### 3c. Record your findings in `src/verify.ts`

Open `src/verify.ts` and fill in the `manualTruth` array:

```typescript
export const manualTruth: ManualTruth[] = [
  { 
    appName: "Slack", 
    actuallyExistsInComposio: true, 
    actualSlug: "slack", 
    actualAuthSchemes: ["OAUTH2"],
    note: "" 
  },
  { 
    appName: "Twilio", 
    actuallyExistsInComposio: false, 
    actualSlug: undefined, 
    actualAuthSchemes: undefined,
    note: "Confirmed absent from Composio registry" 
  },
  // ... add your 15-20 samples here
];
```

**Important:** Do this yourself, by hand, looking at the real docs. This is your ground truth.

### 3d. Run the verification scorecard

```bash
npm run verify
```

This diffs your manual findings against the pipeline's claims and writes `output/verification-scorecard.json` with:
- `correct` / `incorrect` counts
- `accuracyPct`
- `misses` — detailed list of what was wrong

**Save Pass 1 verification scorecard:**

```bash
cp output/verification-scorecard.json output/pass1-verification-scorecard.json
```

**Write down your Pass 1 numbers:**
- Coverage: X/100 apps found
- Browser-verify: Y% confirmed
- Manual accuracy: Z% correct (N/M sample)

---

## STEP 4 — Diagnose and fix

Look at your `misses` list from `pass1-verification-scorecard.json` and your `suspiciousApps` from `pass1-browser-check.json`.

For each failure, fix the root cause:

| Problem | Fix |
|---------|-----|
| App shows "not found" but you confirmed it exists | Add the real slug to `src/aliasMap.ts` |
| App matched to wrong toolkit | Add an explicit alias so it hits the right one first |
| Auth scheme is wrong | Check if Composio data vs docs differ — note the discrepancy |
| Browser check says "suspicious" | Verify the slug is correct; if wrong, update aliasMap |

**Most fixes go in `src/aliasMap.ts`** — just add the correct slug as the first entry for that app.

Example:

```typescript
export const aliasMap: Record<string, string[]> = {
  "Help Scout": ["help_scout", "helpscout"],  // ← help_scout was the real slug
  "Google Ads": ["googleads", "google_ads"],  // ← googleads (no space) was correct
  // ... etc
};
```

---

## STEP 5 — Run Pass 2 (After fixes)

After making your fixes:

```bash
npm run research
npm run browser-verify
npm run verify
```

**Important:** Use the **same `manualTruth` sample** in `src/verify.ts`. Don't change what you're grading against — that would invalidate the comparison.

These overwrite `output/research-results.json`, `output/browser-check-results.json`, and `output/verification-scorecard.json` with the new Pass 2 data.

---

## STEP 6 — Compare Pass 1 vs Pass 2

```bash
npm run loop-compare
```

This reads both Pass 1 and Pass 2 saved files and prints a comparison table:

```
┌─────────────────────────────────┬──────────────┬──────────────┬─────────┐
│ Metric                          │ Pass 1       │ Pass 2       │ Δ       │
├─────────────────────────────────┼──────────────┼──────────────┼─────────┤
│ Apps found in Composio          │ 53/100       │ 58/100       │ +5      │
│ Coverage %                      │ 53%          │ 58%          │ +5%     │
│ Browser-verified correct        │ 45 (85%)     │ 55 (95%)     │ +10%    │
│ Manual verification accuracy    │ 13/18 (72%)  │ 17/18 (94%)  │ +22%    │
└─────────────────────────────────┴──────────────┴──────────────┴─────────┘
```

The delta column shows your improvement.

---

## STEP 7 — Document the loop in your case study

Include these sections in `output/report.html`:

### Before/After Verification Loop

**Pass 1 (Baseline — no fixes):**
- Coverage: X/100 apps found (X%)
- Browser-verified: Y% confirmed
- Manual spot-check: Z% accurate (N/M correct)
- **Issues found:** List 3-5 specific misses (e.g., "Help Scout mapped to wrong slug")

**Fixes applied:**
- Updated `aliasMap.ts` with correct slugs for: Help Scout, Google Ads, Meta Ads, Devin
- Fixed 2 apps that were matching the wrong toolkit due to substring collision

**Pass 2 (After fixes):**
- Coverage: A/100 apps found (A%)
- Browser-verified: B% confirmed
- Manual spot-check: C% accurate (P/Q correct)

**Improvement:** 
- +X apps found
- +Y% browser-verify accuracy
- +Z% manual accuracy

### Known remaining misses

List 1-2 apps that are **still wrong after Pass 2** — this shows honesty. Example:
- "Stripe auth: Composio reports OAUTH2 but Stripe's primary method is API Key — this is a Composio SDK framing difference, not a pipeline bug."

---

## Quick reference: All commands in order

```bash
# Pass 1 baseline
npm run research
cp output/research-results.json output/pass1-research-results.json

npm run browser-verify
cp output/browser-check-results.json output/pass1-browser-check.json

# (Manually fill src/verify.ts with your sample)
npm run verify
cp output/verification-scorecard.json output/pass1-verification-scorecard.json

# Fix issues in src/aliasMap.ts

# Pass 2 after fixes
npm run research
npm run browser-verify
npm run verify

# Compare
npm run loop-compare
```

---

## What if I want a Pass 3?

If Pass 2 accuracy is already 90%+, **stop** — two passes is enough to show the loop. If there's still a clear systemic bug, fix it and do one more cycle. Don't iterate more than 3 times total.

---

## Output files you'll reference

| File | What it is |
|------|------------|
| `output/pass1-research-results.json` | Raw Pass 1 SDK results |
| `output/pass1-browser-check.json` | Pass 1 browser verification |
| `output/pass1-verification-scorecard.json` | Pass 1 manual accuracy |
| `output/research-results.json` | Latest run (Pass 2 after loop-compare) |
| `output/browser-check-results.json` | Latest browser check |
| `output/verification-scorecard.json` | Latest manual accuracy |
| `output/loop-comparison.json` | Before/after delta |

All of these get referenced in your final HTML report.
