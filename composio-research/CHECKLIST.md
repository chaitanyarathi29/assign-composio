# Verification Loop Checklist

Use this to track your progress. Check off each step as you complete it.

## Pass 1: Baseline Run

- [ ] Run `npm run research` (wait ~5 min)
- [ ] Run `cp output/research-results.json output/pass1-research-results.json`
- [ ] Run `npm run browser-verify` (wait ~3 min)
- [ ] Run `cp output/browser-check-results.json output/pass1-browser-check.json`

## Manual Verification (YOUR WORK)

- [ ] Open `output/pass1-browser-check.json` and note suspicious apps
- [ ] Pick 15-20 apps to manually verify (write list below)
- [ ] For each app: open docs.composio.dev/apps in browser
- [ ] Search for each app, note: exists? slug? auth?
- [ ] Take 5-7 screenshots of your searches
- [ ] Open `src/verify.ts` in VS Code
- [ ] Type your findings into the `manualTruth` array (15-20 entries)
- [ ] Save `src/verify.ts`

### My manual verification sample (write your 15-20 apps here):
1. Slack - [ ] checked
2. Zoho Cliq - [ ] checked
3. ___________
4. ___________
5. ___________
6. ___________
7. ___________
8. ___________
9. ___________
10. ___________
11. ___________
12. ___________
13. ___________
14. ___________
15. ___________

## Pass 1 Verification

- [ ] Run `npm run verify`
- [ ] Run `cp output/verification-scorecard.json output/pass1-verification-scorecard.json`
- [ ] Open `output/pass1-verification-scorecard.json`
- [ ] Write down Pass 1 accuracy: ____% (___/___correct)

## Fix Issues

- [ ] Look at `misses` array in `pass1-verification-scorecard.json`
- [ ] Open `src/aliasMap.ts`
- [ ] For each miss, add correct slug to aliasMap
- [ ] Save `src/aliasMap.ts`

### Fixes I made (document what you changed):
- Help Scout: changed __________ to __________
- Google Ads: changed __________ to __________
- ___________: ____________________________
- ___________: ____________________________

## Pass 2: Re-run After Fixes

- [ ] Run `npm run research`
- [ ] Run `npm run browser-verify`
- [ ] Run `npm run verify` (same manualTruth sample!)
- [ ] Run `npm run loop-compare`
- [ ] Check Pass 2 accuracy: ____% (___/___correct)

## Results

Pass 1 accuracy: ____%
Pass 2 accuracy: ____%
Improvement: +___%

Coverage Pass 1: ___/100 apps
Coverage Pass 2: ___/100 apps

## Files to include in case study

- [ ] Screenshots folder with 5-7 manual verification searches
- [ ] `output/pass1-verification-scorecard.json`
- [ ] `output/verification-scorecard.json` (Pass 2)
- [ ] `output/loop-comparison.json`
- [ ] `src/verify.ts` (showing your manualTruth entries)
- [ ] `src/aliasMap.ts` (showing your fixes)
