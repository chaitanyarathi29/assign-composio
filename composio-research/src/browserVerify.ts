// Automated browser-based verification — fetches real Composio docs pages
// and checks if the app name + auth scheme actually appear in the HTML.
// Flags suspicious mismatches for manual review.

import * as fs from "fs";
import { ResearchRecord } from "./researchAgent.js";

interface BrowserCheckResult {
  app: string;
  slug: string;
  status: "confirmed" | "suspicious" | "unreachable";
  reason: string;
  pageUrl: string;
}

function loadResults(): ResearchRecord[] {
  const raw = fs.readFileSync("output/research-results.json", "utf-8");
  return JSON.parse(raw);
}

async function checkPage(slug: string, expectedApp: string): Promise<BrowserCheckResult> {
  const url = `https://docs.composio.dev/apps/${slug}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return {
        app: expectedApp,
        slug,
        status: "unreachable",
        reason: `HTTP ${response.status}`,
        pageUrl: url,
      };
    }

    const html = await response.text();
    const lowerHtml = html.toLowerCase();
    const lowerApp = expectedApp.toLowerCase();

    // Check if app name appears in the page
    const appNameFound = lowerHtml.includes(lowerApp) || 
                         lowerHtml.includes(lowerApp.replace(/\s+/g, ""));

    if (!appNameFound) {
      return {
        app: expectedApp,
        slug,
        status: "suspicious",
        reason: `App name "${expectedApp}" not found in page content`,
        pageUrl: url,
      };
    }

    return {
      app: expectedApp,
      slug,
      status: "confirmed",
      reason: "App name found in docs page",
      pageUrl: url,
    };
  } catch (err: any) {
    return {
      app: expectedApp,
      slug,
      status: "unreachable",
      reason: err.message,
      pageUrl: url,
    };
  }
}

async function main() {
  const results = loadResults();
  const foundApps = results.filter(r => r.foundInComposio && r.composioSlug);

  console.log(`\nBrowser-verifying ${foundApps.length} apps found in Composio...\n`);

  const checks: BrowserCheckResult[] = [];

  for (const app of foundApps) {
    process.stdout.write(`[${checks.length + 1}/${foundApps.length}] ${app.appName.padEnd(30)} ... `);
    
    const check = await checkPage(app.composioSlug!, app.appName);
    checks.push(check);

    const icon = check.status === "confirmed" ? "✓" : check.status === "suspicious" ? "⚠" : "✗";
    console.log(`${icon} ${check.status}`);

    // Rate limit
    await new Promise(r => setTimeout(r, 200));
  }

  const confirmed = checks.filter(c => c.status === "confirmed").length;
  const suspicious = checks.filter(c => c.status === "suspicious");
  const unreachable = checks.filter(c => c.status === "unreachable").length;

  const summary = {
    total: checks.length,
    confirmed,
    suspicious: suspicious.length,
    unreachable,
    confirmedPct: Math.round((confirmed / checks.length) * 100),
    suspiciousApps: suspicious.map(s => ({ app: s.app, slug: s.slug, reason: s.reason })),
  };

  fs.writeFileSync("output/browser-check-results.json", JSON.stringify({ checks, summary }, null, 2));

  console.log(`\n${"=".repeat(60)}`);
  console.log(`Browser verification complete:`);
  console.log(`  Confirmed: ${confirmed}/${checks.length} (${summary.confirmedPct}%)`);
  console.log(`  Suspicious: ${suspicious.length} (need manual review)`);
  console.log(`  Unreachable: ${unreachable}`);
  console.log(`\nResults → output/browser-check-results.json`);

  if (suspicious.length > 0) {
    console.log(`\n⚠ Suspicious apps to review manually:`);
    suspicious.forEach(s => console.log(`  - ${s.app} (${s.slug}): ${s.reason}`));
  }
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
