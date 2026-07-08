# How to Run Verification Loops - Simple Guide

This is the exact sequence of commands you run. Copy-paste each block.

## LOOP 1: First Pass (Baseline - Before Any Fixes)

### Step 1: Run the research agent
```bash
npm run research
```
**What this does:** Queries Composio SDK for all 100 apps, writes `output/research-results.json`

**Wait for it to finish** (takes ~5 minutes)

---

### Step 2: Save Pass 1 research results
```bash
cp output/research-results.json output/pass1-research-results.json
```

---

### Step 3: Run browser verification
```bash
npm run browser-verify
```
**What this does:** Fetches real Composio docs pages, checks if app names appear in HTML

**Wait for it to finish** (takes ~3 minutes)

---

### Step 4: Save Pass 1 browser check
```bash
cp output/browser-check-results.json output/pass1-browser-check.json
```

---

### Step 5: Look at what needs manual checking

Open these files in VS Code:
- `output/pass1-browser-check.json` — look at the `suspiciousApps` section
- `output/pass1-research-results.json` — scroll through all 100 apps

**Pick 15-20 apps to manually verify.** Write them down:
- 5-7 apps marked `foundInComposio: true`
- 5-7 apps marked `foundInComposio: false`
- All apps from `suspiciousApps` list
- Mix of categories

---

### Step 6: Manually verify each app (THIS IS YOUR WORK)

For each of your 15-20 picked apps:

1. Open **https://docs.composio.dev/apps** in Chrome
2. Use browser search (Ctrl+F) to find the app name
3. If found, click on it and note:
   - The slug (from URL: `docs.composio.dev/apps/[slug]`)
   - Auth methods listed on the page
4. If not found, confirm it's genuinely absent

**Take screenshots** as you do 5-7 of these searches (proof you did it yourself)

---

### Step 7: Record your findings in code

Open `src/verify.ts` in VS Code.

Replace the `manualTruth` array with YOUR findings:

```typescript
export const manualTruth: ManualTruth[] = [
  // Example format - replace with YOUR actual checks:
  
  { 
    appName: "Slack", 
    actuallyExistsInComposio: true, 
    actualSlug: "slack", 
    actualAuthSchemes: ["OAUTH2"],
    note: "Verified on docs.composio.dev 2025-07-09"
  },
  
  { 
    appName: "Zoho Cliq", 
    actuallyExistsInComposio: false, 
    actualSlug: undefined, 
    actualAuthSchemes: undefined,
    note: "Searched docs.composio.dev/apps - not in registry despite having OAuth2 API"
  },
  
  // Add your other 13-18 apps here...
];
```

**Important:** Each entry MUST be something YOU looked up yourself on the real Composio docs site.

---

### Step 8: Run verification scorecard
```bash
npm run verify
```

**What this does:** Compares what the pipeline said vs what YOU found manually

---

### Step 9: Save Pass 1 verification results
```bash
cp output/verification-scorecard.json output/pass1-verification-scorecard.json
```

---

### Step 10: Check your Pass 1 accuracy

Open `output/pass1-verification-scorecard.json`

You'll see something like:
```json
{
  "sampleSize": 18,
  "correct": 13,
  "incorrect": 5,
  "accuracyPct": 72.2,
  "misses": [
    {
      "app": "Help Scout",
      "pipelineSaid": { "found": false },
      "actuallyIs": { "actuallyExistsInComposio": true, "actualSlug": "help_scout" }
    },
    // ... more misses
  ]
}
```

**Write down your Pass 1 numbers:**
- Accuracy: 72.2% (13/18 correct)
- Coverage: 58/100 apps found
- Browser-verified: 85%

---

## LOOP 2: Fix Issues and Re-run (Pass 2)

### Step 11: Diagnose what went wrong

Look at the `misses` array in `pass1-verification-scorecard.json`.

For each miss, identify the problem:

| If the pipeline said... | But you found... | Fix needed |
|------------------------|------------------|------------|
| "not found" | It actually exists | Add correct slug to `aliasMap.ts` |
| Found with wrong slug | Different slug in docs | Update `aliasMap.ts` |
| Found but wrong auth | Different auth on docs page | Note as Composio SDK data issue |

---

### Step 12: Fix the issues in aliasMap.ts

Open `src/aliasMap.ts`

Add the correct slugs for apps that were wrong:

```typescript
export const aliasMap: Record<string, string[]> = {
  // BEFORE FIX:
  // "Help Scout": ["helpscout"],
  
  // AFTER FIX (you add the correct slug first in the array):
  "Help Scout": ["help_scout", "helpscout"],  // ← you add this line
  
  "Google Ads": ["googleads", "google_ads"],  // ← you add this
  "Meta Ads": ["metaads", "facebookads"],     // ← you add this
  
  // ... add fixes for all the apps in your misses list
};
```

**Save the file.**

---

### Step 13: Re-run the research (Pass 2)
```bash
npm run research
```

This overwrites `output/research-results.json` with new results using your fixed aliases.

---

### Step 14: Re-run browser verification
```bash
npm run browser-verify
```

This overwrites `output/browser-check-results.json`.

---

### Step 15: Re-run manual verification
```bash
npm run verify
```

**Important:** Do NOT change the `manualTruth` array in `src/verify.ts`. You're grading against the same sample.

This overwrites `output/verification-scorecard.json` with Pass 2 results.

---

### Step 16: Compare Pass 1 vs Pass 2
```bash
npm run loop-compare
```

**What this does:** Reads the saved Pass 1 files and current Pass 2 files, prints a comparison table:

```
┌─────────────────────────────────┬──────────────┬──────────────┬─────────┐
│ Metric                          │ Pass 1       │ Pass 2       │ Δ       │
├─────────────────────────────────┼──────────────┼──────────────┼─────────┤
│ Apps found in Composio          │ 58/100       │ 63/100       │ +5      │
│ Coverage %                      │ 58%          │ 63%          │ +5%     │
│ Browser-verified correct        │ 49 (85%)     │ 58 (92%)     │ +7%     │
│ Manual verification accuracy    │ 13/18 (72%)  │ 17/18 (94%)  │ +22%    │
└─────────────────────────────────┴──────────────┴──────────────┴─────────┘
```

This comparison table is what you show in your HTML report as proof of the verification loop.

---

## Summary: All commands in order

**Pass 1 (baseline):**
```bash
npm run research
cp output/research-results.json output/pass1-research-results.json
npm run browser-verify
cp output/browser-check-results.json output/pass1-browser-check.json

# (YOU manually check 15-20 apps and fill src/verify.ts)

npm run verify
cp output/verification-scorecard.json output/pass1-verification-scorecard.json
```

**Fix issues:**
```typescript
// Edit src/aliasMap.ts with correct slugs
```

**Pass 2 (after fixes):**
```bash
npm run research
npm run browser-verify
npm run verify
npm run loop-compare
```

---

## What proves it's YOUR work?

1. ✅ The `manualTruth` array entries in `src/verify.ts` — YOU typed these after checking real docs
2. ✅ Screenshots of your browser searches on docs.composio.dev
3. ✅ The fixes you made in `aliasMap.ts` — YOU decided what to fix based on the misses
4. ✅ You can explain in an interview WHY each fix was needed

The scripts just automate the comparison — the **judgment calls** are yours.

---

## Next step RIGHT NOW:

Run this:
```bash
npm run research
```

Then come back when it's done and I'll help you with the next step.
