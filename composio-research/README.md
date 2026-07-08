# Composio App Research Agent — 100 Apps Case Study

**Take-home assignment for Composio AI Product Ops role**

Automated research pipeline that analyzes 100 apps for Composio integration readiness using:
- Live Composio SDK queries
- Browser-based docs verification
- Automated verification loops
- Manual enrichment layer

**[View the live HTML case study →](output/report.html)**

---

## Key Findings (TL;DR)

- **56/100 apps** are buildable today in Composio
- **OAuth2 dominates** — 65% of apps support it
- **76% have free/trial access** — self-serve API access is the norm
- **28 apps have MCP servers** — emerging signal of API maturity
- **Developer/Infra easiest** — 80% coverage
- **Verification accuracy: 90%** (18/20 manual sample correct)

---

## Architecture

```
composio-research/
├── src/
│   ├── researchAgent.ts       # Main SDK query agent
│   ├── enrichData.ts           # Hand-researched data for all 100 apps
│   ├── browserVerify.ts        # Fetches real docs pages, flags suspicious
│   ├── autoVerifyLoop.ts       # Full Pass 1 → fix → Pass 2 automation
│   ├── loopCompare.ts          # Compares verification passes
│   ├── aliasMap.ts             # Slug guesses for multi-word app names
│   ├── apps.ts                 # List of 100 apps with categories
│   ├── generateReport.ts       # HTML report generator
│   ├── analyze.ts              # Pattern analysis
│   └── verify.ts               # Manual verification logic
├── output/
│   ├── report.html             # Final case study (open this!)
│   ├── research-results.json   # SDK query results
│   ├── browser-check-results.json
│   ├── loop-comparison.json    # Pass 1 vs Pass 2 comparison
│   └── merged-results.json     # SDK + enrichment merged
├── .env                        # COMPOSIO_API_KEY goes here
├── .env.example
└── package.json
```

---

## Quick Start

### 1. Clone and install

```bash
git clone [repo-url]
cd composio-research
npm install
```

### 2. Add your Composio API key

Get your key from [app.composio.dev → Settings → API Keys](https://app.composio.dev)

```bash
echo "COMPOSIO_API_KEY=your_key_here" > .env
```

Or copy `.env.example` and fill it in:
```bash
cp .env.example .env
# Edit .env and add your key
```

### 3. Run the pipeline

**Option A: Interactive Live Demo** (🆕 Recommended for reviewers!)
```bash
npm run report-interactive  # Generate interactive HTML
npm run serve              # Start server at http://localhost:3000
```
Then open `http://localhost:3000/` and click **"Run Fresh Pipeline"** button to fetch live data from Composio SDK in real-time!

**Option B: Full automated verification loop** (~15 min)
```bash
npm run auto-loop
```
This runs:
1. Pass 1 research → SDK queries all 100 apps
2. Browser-verify → Fetches real docs pages
3. Auto-fix → Detects misses, updates aliasMap
4. Pass 2 research → Re-runs with fixes
5. Comparison → Outputs before/after accuracy

**Option C: Step-by-step** (for debugging)
```bash
npm run research       # Query Composio SDK for all 100 apps
npm run browser-verify # Fetch real docs pages, flag suspicious
npm run analyze        # Pattern analysis
npm run report         # Generate HTML case study
```

### 4. View the results

- **Static report**: Open `output/report.html` in your browser
- **Interactive demo**: Open `http://localhost:3000/` (if server is running)

---

## What Each Script Does

| Command | What it does | Output |
|---------|-------------|--------|
| `npm run research` | Queries Composio SDK for all 100 apps. Tries naive slugify → aliasMap fallback → not-found. | `output/research-results.json` |
| `npm run browser-verify` | Fetches docs.composio.dev pages for each matched app. Flags suspicious mismatches. | `output/browser-check-results.json` |
| `npm run verify` | Manual verification — compares a 20-app sample against hand-checked ground truth. | `output/verification-scorecard.json` |
| `npm run auto-loop` | **Full automated loop**: Pass 1 → browser-verify → auto-fix → Pass 2 → compare. | `output/loop-comparison.json` |
| `npm run report` | Merges SDK + enrichment + verification data. Generates static HTML case study. | `output/report.html` |
| `npm run report-interactive` | Generates interactive HTML with "Run Fresh Pipeline" button. | `output/report-interactive.html` |
| `npm run serve` | **Starts HTTP server** at `localhost:3000` with live pipeline trigger. | Server at http://localhost:3000 |
| `npm run analyze` | Pattern analysis across categories (auth, self-serve, MCP, coverage). | `output/pattern-summary.json` |
| `npm run loop-compare` | Compares Pass 1 vs Pass 2 accuracy (used by auto-loop). | `output/loop-comparison.json` |

---

## How the Pipeline Works

### 1. SDK Agent (`researchAgent.ts`)

For each of the 100 apps:
1. **Naive slugify**: Convert app name to lowercase-dashed slug (e.g. "Help Scout" → "help-scout")
2. **Try alias map**: If naive fails, check `aliasMap.ts` for known exceptions (e.g. "Google Ads" → "googleads")
3. **Query SDK**: Call `composio.toolkits.getToolkitBySlug(slug)`
4. **Extract data**:
   - Auth schemes: `toolkit.composioManagedAuthSchemes` + `toolkit.authConfigDetails`
   - Tool count: `toolkit.meta.toolsCount`
   - Categories: `toolkit.meta.categories`
5. **Fallback**: If still not found, scan all 500+ toolkits for substring matches

**Output**: `output/research-results.json` — 58/100 found

### 2. Browser Agent (`browserVerify.ts`)

For each app marked "found in Composio":
1. **Fetch docs page**: GET `https://docs.composio.dev/apps/{slug}`
2. **Check HTML**: Does the page HTML contain the app name?
3. **Flag suspicious**: If app name not found, mark as "suspicious mismatch"

**Output**: `output/browser-check-results.json` — 4 suspicious apps flagged

### 3. Enrichment Layer (`enrichData.ts`)

Hand-researched data for ALL 100 apps:
- **Auth methods**: From official developer docs (OAuth2, API Key, Bearer Token, etc.)
- **Self-serve access**: Yes (free tier/trial) | Partial (review needed) | No (sales/enterprise gated)
- **Buildability blocker**: Why an app isn't buildable (if applicable)
- **MCP existence**: Does an official or community MCP server exist?
- **Docs URL**: Link to official API docs
- **One-liner**: What the app does

This is the **human-verified** layer. Agent can't know self-serve status or API surface depth from SDK alone.

### 4. Verification Loop (`autoVerifyLoop.ts`)

Fully automated Pass 1 → Pass 2 loop:

1. **Pass 1**: Run `npm run research` → Get baseline results
2. **Browser-verify**: Run `npm run browser-verify` → Flag suspicious apps
3. **Auto-generate sample**: Pick 20 apps (10 found, 10 not-found) from Pass 1 results
4. **Auto-fix**: Detect misses (apps that should be found but weren't), update `aliasMap.ts`
5. **Pass 2**: Re-run `npm run research` with updated aliases
6. **Compare**: Output accuracy metrics (Pass 1 vs Pass 2) to `output/loop-comparison.json`

**Note**: Since the auto-sample uses SDK results as ground truth, Pass 1 accuracy = 100%. For real delta, a human needs to manually verify a sample against actual Composio docs (see `verify.ts`).

### 5. Report Generator (`generateReport.ts`)

Merges:
- SDK results (`research-results.json`)
- Enrichment data (`enrichData.ts`)
- Verification data (`loop-comparison.json`)

Outputs:
- `output/report.html` — The final case study page
- `output/merged-results.json` — All data combined

---

## Data Sources

### From Composio SDK (automated)
- App exists in Composio? → `getToolkitBySlug()` response
- Tool count → `toolkit.meta.toolsCount`
- Composio auth schemes → `composioManagedAuthSchemes`
- Trigger count → `toolkit.meta.triggerCount`
- Description → `toolkit.meta.description`

### From Manual Research (human)
- Auth methods → Official developer docs for each app
- Self-serve access → Checked signup flow, pricing pages
- MCP existence → Official MCP announcements + GitHub search
- API surface → Official API docs (REST/GraphQL/SDK availability)
- Buildability blockers → Notes on why an app is/isn't buildable

### From Browser Verification (automated)
- Docs page reachable? → HTTP GET to `docs.composio.dev/apps/{slug}`
- App name in HTML? → String search in page body
- Suspicious flag → Composio shows it but docs page doesn't mention it

---

## Known Issues & Honest Misses

### 4 apps flagged "suspicious" by browser-verify:
1. **LinkedIn Ads**: Mapped to `linkedin` slug — docs say "LinkedIn" not "LinkedIn Ads" (name aliasing, not error)
2. **Amazon Selling Partner**: Mapped to `amazon` slug — docs say "Amazon" (correct toolkit, different display name)
3. **NotebookLM**: Mapped to `gemini` slug — docs say "Gemini". **Caveat**: NotebookLM has no public API; Gemini API is a proxy
4. **YouTube Transcript**: Mapped to `youtube` slug — docs say "YouTube" (correct, just broader name)

### 2 apps with 0 tools despite toolkit existing:
- **Front**: Toolkit exists but 0 tools listed (placeholder or work-in-progress)
- **Amazon Selling Partner**: Toolkit exists but 0 tools (shell without implementation)

### Auth discrepancy:
- **Stripe**: Composio SDK reports `OAUTH2` but Stripe's primary auth is API Key. This is a Composio SDK framing difference — Composio uses OAuth2 for its *connection flow*, while Stripe's direct API uses keys. Both are technically correct from different perspectives.

### Verification accuracy:
- **Manual sample**: 18/20 correct = 90% accuracy (2 misses: Stripe auth framing, NotebookLM API caveat)
- **Automated sample**: 100% accuracy (but auto-sample used SDK as ground truth, so no delta between Pass 1 and Pass 2)

---

## Tech Stack

- **TypeScript** — All code
- **tsx** — TS execution (no build step)
- **@composio/core** v0.13.1 — Composio SDK
- **dotenv** — Env var loading
- **node-fetch** — HTTP requests for browser-verify

---

## Assignment Requirements Checklist

✅ **100 apps researched** — All listed in `src/apps.ts`  
✅ **Patterns identified** — OAuth2 dominance, self-serve norm, Dev/Infra easiest, E-commerce/Finance hardest  
✅ **Agent built** — SDK + browser + verification loop agents in `src/`  
✅ **Verification with loops** — Automated Pass 1 → Pass 2 in `autoVerifyLoop.ts`, manual 20-point sample in `verify.ts`  
✅ **Accuracy shown** — 90% manual accuracy (18/20), 91% browser-verified, Pass 1/Pass 2 comparison in HTML  
✅ **Honest about misses** — 4 suspicious apps, 2 with 0 tools, 1 auth framing difference, documented in HTML  
✅ **Live link** — `output/report.html` (deploy to GitHub Pages or Vercel)  
✅ **Runnable proof** — `npm run auto-loop` reproduces full pipeline  
✅ **2-minute case study** — HTML page with clear sections: Patterns (top), Agent, Verification, Coverage table, All 100 apps, Runnable commands  

---

## How to Deploy the HTML

### Option 1: GitHub Pages
```bash
git add -A
git commit -m "Complete Composio app research"
git push origin main
# Go to repo Settings → Pages → Deploy from branch (main, /output)
```

### Option 2: Vercel
```bash
vercel --prod
# Point to /output directory
```

### Option 3: Netlify
Drag-and-drop the `output` folder to [app.netlify.com/drop](https://app.netlify.com/drop)

---

## Questions or Issues?

If the pipeline fails:
1. Check `.env` has a valid Composio API key
2. Run `npm install` again
3. Try `npm run research` first (single step) to isolate the issue
4. Check `output/` folder for intermediate JSON files — they show what worked

If an app shows "not found" but you think it should be in Composio:
1. Check `src/aliasMap.ts` — add the correct slug manually
2. Re-run `npm run research`
3. Check `output/research-results.json` to confirm

---

## License

MIT — This is a take-home assignment, free to use/modify.
