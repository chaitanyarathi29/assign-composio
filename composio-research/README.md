# Composio App Research — 100 Apps

**Live demo:** https://composio-research.onrender.com

Research pipeline that checks 100 apps against the Composio SDK, extracts auth patterns, verifies accuracy, and generates a live HTML case study.

---

## Run it yourself

```bash
git clone https://github.com/chaitanyarathi29/assign-composio.git
cd assign-composio/composio-research
npm install
echo "COMPOSIO_API_KEY=your_key_here" > .env
```

Get your key at [app.composio.dev](https://app.composio.dev) → Settings → API Keys.

**View the case study (static):**
```bash
npm run report
# open output/report.html
```

**Run the live interactive demo:**
```bash
npm run serve
# open http://localhost:3000 → click "Run Fresh Pipeline"
```

**Run the full verification loop:**
```bash
npm run auto-loop   # Pass 1 → browser-verify → fix → Pass 2
```

---

## What each script does

| Command | Does |
|---|---|
| `npm run research` | Queries Composio SDK for all 100 apps |
| `npm run browser-verify` | Fetches real docs pages to cross-check results |
| `npm run auto-loop` | Full automated Pass 1 → Pass 2 verification loop |
| `npm run report` | Generates `output/report.html` (static case study) |
| `npm run serve` | Starts server at `localhost:3000` with live pipeline button |

---

## How it works

1. **SDK Agent** — queries `composio.toolkits.getToolkitBySlug()` for each app. Tries slug guessing → alias map → marks not found.
2. **Browser verify** — fetches `docs.composio.dev/apps/{slug}` and checks the page confirms the app name.
3. **Verification loop** — auto-generates a 20-app sample, compares SDK results vs ground truth, auto-fixes misses, reruns.
4. **Enrichment layer** — hand-researched auth methods, self-serve status, MCP existence, and docs URLs for all 100 apps (the SDK doesn't expose this).
5. **Report** — merges everything into a single HTML page.

---

## Key findings

- **56/100** apps buildable in Composio today
- **OAuth2 dominates** — 65% of apps
- **Self-serve is the norm** — 76% have free/trial API access
- **Developer/Infra easiest** — 80% coverage
- **Verified accuracy: 90%** on 20-point manual sample

### Honest misses
- **Stripe** — Composio shows OAuth2, but Stripe's primary auth is API Key
- **NotebookLM** — mapped to `gemini` slug; NotebookLM has no public API
- **Front / Amazon SP** — toolkit exists in Composio but 0 tools exposed
