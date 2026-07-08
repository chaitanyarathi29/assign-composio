import * as fs from "fs";
import { ResearchRecord } from "./researchAgent.js";

function loadResults(): ResearchRecord[] {
  const raw = fs.readFileSync("output/research-results.json", "utf-8");
  return JSON.parse(raw);
}

function countBy<T>(items: T[], keyFn: (item: T) => string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of items) {
    const key = keyFn(item);
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

function main() {
  const results = loadResults();
  const total = results.length;
  const found = results.filter((r) => r.foundInComposio);
  const notFound = results.filter((r) => !r.foundInComposio);

  // 1. Overall coverage
  const coverage = {
    totalApps: total,
    foundInComposio: found.length,
    notFound: notFound.length,
    coveragePct: Math.round((found.length / total) * 1000) / 10,
  };

  // 2. Auth scheme distribution (across found apps)
  const authFlat: string[] = [];
  for (const r of found) {
    for (const scheme of r.authSchemes || ["UNKNOWN"]) authFlat.push(scheme);
  }
  const authDistribution = countBy(authFlat, (s) => s);

  // 3. Coverage by category (given categories from the assignment, not Composio's own)
  const byCategory: Record<string, { total: number; found: number }> = {};
  for (const r of results) {
    if (!byCategory[r.categoryGiven]) byCategory[r.categoryGiven] = { total: 0, found: 0 };
    byCategory[r.categoryGiven].total++;
    if (r.foundInComposio) byCategory[r.categoryGiven].found++;
  }
  const categoryCoverage = Object.entries(byCategory)
    .map(([category, v]) => ({
      category,
      total: v.total,
      found: v.found,
      coveragePct: Math.round((v.found / v.total) * 1000) / 10,
    }))
    .sort((a, b) => a.coveragePct - b.coveragePct);

  // 4. Blocker distribution (for not-found + deprecated apps)
  const blockers = results.filter((r) => r.blocker).map((r) => r.blocker as string);
  const blockerDistribution = countBy(blockers, (b) => b);

  // 5. API surface breadth: bucket by tool count
  const breadthBuckets = { "0-5 actions": 0, "6-20 actions": 0, "21-50 actions": 0, "50+ actions": 0, unknown: 0 };
  for (const r of found) {
    const c = r.toolCount ?? -1;
    if (c < 0) breadthBuckets.unknown++;
    else if (c <= 5) breadthBuckets["0-5 actions"]++;
    else if (c <= 20) breadthBuckets["6-20 actions"]++;
    else if (c <= 50) breadthBuckets["21-50 actions"]++;
    else breadthBuckets["50+ actions"]++;
  }

  // 6. Easy wins: found, not deprecated, OAUTH2 or API_KEY scheme, 10+ actions
  const easyWins = found
    .filter(
      (r) =>
        !r.isDeprecated &&
        (r.toolCount ?? 0) >= 10 &&
        (r.authSchemes || []).some((s) => s === "OAUTH2" || s === "API_KEY")
    )
    .map((r) => r.appName);

  // 7. Match method distribution (transparency on how confident each match is)
  const matchMethodDistribution = countBy(results, (r) => r.matchMethod);

  const summary = {
    coverage,
    authDistribution,
    categoryCoverage,
    blockerDistribution,
    breadthBuckets,
    easyWinsCount: easyWins.length,
    easyWins,
    matchMethodDistribution,
  };

  fs.writeFileSync("output/pattern-summary.json", JSON.stringify(summary, null, 2));
  console.log(JSON.stringify(summary, null, 2));
  console.log("\nWritten to output/pattern-summary.json");
}

main();
