# Composio App Research

**Live:** https://composio-research.onrender.com

100 apps researched against Composio SDK — auth patterns, coverage, verification loops.

## Run locally

```bash
npm install
echo "COMPOSIO_API_KEY=your_key" > .env
npm run serve        # → open http://localhost:3000
```

Click **Run Fresh Pipeline** to query live Composio SDK data.

## Scripts

| Command | Does |
|---|---|
| `npm run serve` | Live demo with pipeline button |
| `npm run auto-loop` | Full Pass 1 → Pass 2 verification |
| `npm run report` | Generate static `output/report.html` |

## Findings

- 56/100 buildable in Composio · 65% OAuth2 · 90% verified accuracy
- Not in Composio: 42 apps (most have public APIs — gap opportunities)
- Honest misses: Stripe auth framing, NotebookLM has no public API, Front has 0 tools exposed
