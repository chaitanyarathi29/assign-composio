# 🔴 LIVE DEMO — Interactive HTML with Real-Time Pipeline

## What This Does

This creates an **interactive HTML page** with a **"Run Fresh Pipeline" button** that:

1. Triggers the full research pipeline (SDK queries → browser-verify → report generation)
2. Shows real-time progress (10% → 40% → 80% → 100%)
3. Updates the HTML with fresh live data from Composio SDK
4. Runs **genuine queries** against the Composio API every time you click the button

**No dummy data. No mocked responses. Real API calls every time.**

---

## How to Use

### 1. Start the Server

```bash
npm run serve
```

This starts an HTTP server at `http://localhost:3000` that:
- Serves the interactive HTML
- Provides API endpoints to trigger the pipeline
- Polls pipeline status and updates the UI

### 2. Open in Browser

Open `http://localhost:3000/` in your browser.

You'll see:
- Hero section with current stats
- **"🔄 Run Fresh Pipeline" button** in the top-right
- All 100 apps table with current data
- Verification section with Pass 1 vs Pass 2

### 3. Click "Run Fresh Pipeline"

When you click the button:

1. **Stage 1 (10%)**: "Querying Composio SDK for 100 apps..."
   - Runs `npm run research`
   - Queries Composio API for all 100 apps
   - Extracts tool counts, auth schemes, categories

2. **Stage 2 (40%)**: "Verifying docs pages in browser..."
   - Runs `npm run browser-verify`
   - Fetches real docs.composio.dev pages
   - Flags suspicious mismatches

3. **Stage 3 (80%)**: "Generating HTML report..."
   - Runs `npm run report`
   - Merges SDK + enrichment data
   - Generates updated HTML

4. **Complete (100%)**: "Pipeline complete! Refreshing data..."
   - Page auto-refreshes
   - Shows updated stats and tool counts
   - All data is fresh from Composio API

---

## What's Genuine vs Static

### Genuine (Fetched Live Every Run):
✅ **Tool counts** — from Composio SDK `getToolkitBySlug()`  
✅ **Auth schemes** — from SDK `composioManagedAuthSchemes`  
✅ **App exists in Composio** — live SDK query  
✅ **Composio slug** — discovered via SDK  
✅ **Browser verification** — fetches real docs pages  

### Static (Pre-Researched):
📋 **Self-serve status** — hand-researched (Yes/Partial/No)  
📋 **MCP existence** — hand-researched from MCP registry  
📋 **API surface assessment** — from official docs  
📋 **Docs URLs** — official developer docs links  
📋 **One-liner descriptions** — what each app does  

**Why static?** The SDK doesn't provide self-serve status, MCP info, or API surface depth — that requires manual research.

---

## API Endpoints

The server exposes:

### `POST /api/run-pipeline`
Triggers the full pipeline:
```bash
curl -X POST http://localhost:3000/api/run-pipeline
```

Returns:
```json
{
  "success": true,
  "status": {
    "running": true,
    "stage": "research",
    "progress": 10,
    "message": "Querying Composio SDK..."
  }
}
```

### `GET /api/pipeline-status`
Gets current pipeline status:
```bash
curl http://localhost:3000/api/pipeline-status
```

Returns:
```json
{
  "running": false,
  "stage": "complete",
  "progress": 100,
  "message": "Pipeline complete!"
}
```

### `GET /api/data`
Gets latest research data:
```bash
curl http://localhost:3000/api/data
```

Returns:
```json
{
  "research": [...],  // research-results.json
  "merged": [...],    // merged-results.json
  "loop": {...},      // loop-comparison.json
  "timestamp": "2026-07-09T..."
}
```

---

## Demo Flow for Reviewers

### Show the Live Demo:

1. **Open `http://localhost:3000/`**
   - Point out the "Run Fresh Pipeline" button
   - Show current stats (56 buildable, 42 not in Composio, etc.)

2. **Click "Run Fresh Pipeline"**
   - Watch the status bar at the top: "Querying Composio SDK..." → "Verifying docs pages..." → "Generating report..."
   - Progress bar moves: 10% → 40% → 80% → 100%
   - Takes ~30-60 seconds (depending on API speed)

3. **Page auto-refreshes**
   - Stats update with fresh data
   - Tool counts are live from Composio SDK
   - "Last updated" timestamp shows current time

4. **Explain what's happening**:
   - "Every click triggers real API calls to Composio"
   - "Tool counts come from live SDK queries, not hardcoded"
   - "Browser-verify fetches actual docs pages to cross-check"
   - "Static enrichment data (self-serve, MCP) is hand-researched because SDK doesn't provide it"

---

## For Interview

**If asked "How do we know this data is real?"**

> "Click the button — it runs the full pipeline against Composio's live API. The tool counts and auth schemes come directly from SDK responses. I've also included a timestamp showing when data was last refreshed. The enrichment layer (self-serve status, MCP) is hand-researched because the SDK doesn't expose that, but everything from Composio is queried live every time you run it."

**If asked "What if Composio adds a new app?"**

> "Click 'Run Fresh Pipeline' — if they added it to their registry and it matches one of the 100 app names, the pipeline will detect it. The slug guessing + alias map will find it, and the report will update to show it as buildable with the tool count."

**If asked "Is the MCP data accurate?"**

> "The MCP data is from manual research, not the SDK — Composio's SDK doesn't expose MCP info. I marked 28 apps as having MCP servers based on checking the Model Context Protocol registry and vendor announcements. For full accuracy, each would need to be re-verified against the official MCP server list. The SDK data (tool counts, auth) is 100% live and verifiable by clicking 'Run Fresh Pipeline'."

---

## Files Created

```
src/
├── server.ts                    ← HTTP server with /api endpoints
├── generateReportInteractive.ts ← Interactive HTML generator
output/
└── report-interactive.html      ← Interactive page with "Run Pipeline" button
```

---

## Deployment Options

### Local Demo (What You Have Now):
```bash
npm run serve
# Open http://localhost:3000/
```

### For Submission:
The interactive version needs a server running, so for static deployment (GitHub Pages, Vercel), use the regular `output/report.html`.

**For the interview/demo**: Run the local server and show the live pipeline trigger.

**For submission**: Deploy the static `output/report.html` (no server needed).

---

## Troubleshooting

**"Server not running" button shows**
→ The page is trying to connect to `http://localhost:3000` but server isn't running
→ Run `npm run serve` in a terminal

**Pipeline fails with "API key not found"**
→ Check `.env` file has `COMPOSIO_API_KEY=your_key_here`

**Pipeline takes too long**
→ Composio API might be rate-limiting or slow
→ Normal time: 30-60 seconds for full pipeline

**Stats don't update after pipeline completes**
→ Page should auto-refresh after 2 seconds
→ If not, manually refresh to see new data

---

## Stopping the Server

```bash
# Press Ctrl+C in the terminal where npm run serve is running
```

Or from another terminal:
```bash
# Windows
taskkill /F /IM node.exe

# Mac/Linux
killall node
```

---

**You now have a fully interactive demo that proves the data is live!** 🚀

Click the button, watch the progress bar, see the stats update — all genuine API calls.
