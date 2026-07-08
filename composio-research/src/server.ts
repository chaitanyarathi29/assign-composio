import * as http from "http";
import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";

const PORT = 3000;

interface PipelineStatus {
  running: boolean;
  stage: string;
  progress: number;
  message: string;
  error?: string;
  completedAt?: string;
}

// Mutable status object — mutate properties directly so closures always see latest
const status: PipelineStatus = {
  running: false,
  stage: "idle",
  progress: 0,
  message: "Ready — click Run Fresh Pipeline to start",
};

function setStatus(patch: Partial<PipelineStatus>) {
  Object.assign(status, patch);
}

let ticker: ReturnType<typeof setInterval> | null = null;

function startTicker(from: number, to: number, durationMs: number) {
  if (ticker) clearInterval(ticker);
  const step = (to - from) / (durationMs / 500);
  ticker = setInterval(() => {
    if (status.progress < to - 1) {
      setStatus({ progress: Math.min(to - 1, status.progress + step) });
    }
  }, 500);
}

function stopTicker() {
  if (ticker) { clearInterval(ticker); ticker = null; }
}

function runPipelineInBackground() {
  if (status.running) return;

  setStatus({
    running: true,
    stage: "research",
    progress: 5,
    message: "Stage 1/3 — Querying Composio SDK for all 100 apps...",
  });

  console.log("\n▶ Pipeline started");
  const cwd = process.cwd();

  // Ticker slowly moves bar from 5 → 38 while research runs (takes ~2-3 min)
  startTicker(5, 38, 180000);

  // ── Step 1: research ──────────────────────────────────────────────────────
  const step1 = exec("npx tsx src/researchAgent.ts", { cwd });

  // Parse stdout lines to show which app is being checked
  let appCount = 0;
  step1.stdout?.on("data", (chunk: string) => {
    process.stdout.write(chunk);
    // Lines look like: "[ 42/100] Stripe  ... FOUND"
    const match = chunk.match(/\[\s*(\d+)\/100\]/);
    if (match) {
      appCount = parseInt(match[1]);
      const pct = 5 + Math.round((appCount / 100) * 33); // 5 → 38
      setStatus({
        progress: pct,
        message: `Stage 1/3 — Querying app ${appCount}/100 from Composio SDK...`,
      });
    }
  });
  step1.stderr?.on("data", (d: string) => process.stderr.write(d));

  step1.on("close", (code: number | null) => {
    stopTicker();
    if (code !== 0) {
      setStatus({ running: false, stage: "error", progress: status.progress, message: "Research step failed", error: `exit code ${code}` });
      return;
    }
    console.log("✓ research done");
    setStatus({ stage: "browser-verify", progress: 40, message: "Stage 2/3 — Verifying docs pages in browser..." });

    // Ticker from 40 → 78 while browser-verify runs
    startTicker(40, 78, 90000);

    // ── Step 2: browser-verify ──────────────────────────────────────────────
    const step2 = exec("npx tsx src/browserVerify.ts", { cwd });

    let verifyCount = 0;
    step2.stdout?.on("data", (chunk: string) => {
      process.stdout.write(chunk);
      // Lines look like: "[12/58] Slack  ... ✓ confirmed"
      const match = chunk.match(/\[\s*(\d+)\/\d+\]/);
      if (match) {
        verifyCount = parseInt(match[1]);
        const pct = 40 + Math.round((verifyCount / 58) * 38); // 40 → 78
        setStatus({
          progress: pct,
          message: `Stage 2/3 — Browser-verifying app ${verifyCount}/58...`,
        });
      }
    });
    step2.stderr?.on("data", (d: string) => process.stderr.write(d));

    step2.on("close", (code2: number | null) => {
      stopTicker();
      if (code2 !== 0) {
        setStatus({ running: false, stage: "error", progress: status.progress, message: "Browser verify failed", error: `exit code ${code2}` });
        return;
      }
      console.log("✓ browser-verify done");
      setStatus({ stage: "report", progress: 80, message: "Stage 3/3 — Merging data and generating report..." });

      // ── Step 3: generate report ─────────────────────────────────────────
      const step3 = exec("npx tsx src/generateReport.ts", { cwd });
      step3.stdout?.on("data", (d: string) => process.stdout.write(d));
      step3.stderr?.on("data", (d: string) => process.stderr.write(d));

      step3.on("close", (code3: number | null) => {
        if (code3 !== 0) {
          setStatus({ running: false, stage: "error", progress: status.progress, message: "Report generation failed", error: `exit code ${code3}` });
          return;
        }
        console.log("✓ report done");
        setStatus({
          running: false,
          stage: "complete",
          progress: 100,
          message: "Pipeline complete! Live data from Composio SDK.",
          completedAt: new Date().toISOString(),
        });
        console.log("✓ Pipeline complete\n");
      });
    });
  });
}

function getMergedData() {
  try {
    const merged = JSON.parse(fs.readFileSync("output/merged-results.json", "utf-8"));
    const loop = fs.existsSync("output/loop-comparison.json")
      ? JSON.parse(fs.readFileSync("output/loop-comparison.json", "utf-8"))
      : null;
    return { merged, loop, timestamp: new Date().toISOString() };
  } catch (e: any) {
    return { error: e.message };
  }
}

// ── HTTP server ───────────────────────────────────────────────────────────────
const server = http.createServer((req, res) => {
  const url = req.url ?? "/";

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") { res.writeHead(204); res.end(); return; }

  // POST /api/run
  if (url === "/api/run" && req.method === "POST") {
    if (status.running) {
      res.writeHead(409, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Already running" }));
      return;
    }
    runPipelineInBackground();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ started: true }));
    return;
  }

  // GET /api/status
  if (url === "/api/status" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ...status, progress: Math.round(status.progress) }));
    return;
  }

  // GET /api/data
  if (url === "/api/data" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(getMergedData()));
    return;
  }

  // Serve interactive HTML at /
  if (url === "/" || url === "/index.html") {
    const htmlPath = path.join(process.cwd(), "output", "report-interactive.html");
    if (fs.existsSync(htmlPath)) {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(fs.readFileSync(htmlPath));
    } else {
      res.writeHead(404);
      res.end("report-interactive.html not found — run: npm run report-interactive");
    }
    return;
  }

  // Static fallback
  const filePath = path.join(process.cwd(), url);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    const mime: Record<string, string> = { ".html": "text/html", ".json": "application/json", ".js": "text/javascript" };
    res.writeHead(200, { "Content-Type": mime[ext] || "text/plain" });
    res.end(fs.readFileSync(filePath));
  } else {
    res.writeHead(404);
    res.end("Not found");
  }
});

server.listen(PORT, () => {
  console.log(`\n✓ Server ready at http://localhost:${PORT}/`);
  console.log("  Open that URL, then click 'Run Fresh Pipeline'\n");
});
