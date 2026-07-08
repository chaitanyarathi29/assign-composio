// Compares Pass 1 vs Pass 2 results and shows the improvement delta.
// This is the "before/after" verification loop output.

import * as fs from "fs";
import { ResearchRecord } from "./researchAgent.js";

interface PassSummary {
  passName: string;
  totalApps: number;
  foundInComposio: number;
  notFound: number;
  coveragePct: number;
  browserConfirmed?: number;
  browserConfirmedPct?: number;
  manualVerifyCorrect?: number;
  manualVerifyTotal?: number;
  manualAccuracyPct?: number;
}

function loadPass(filename: string): ResearchRecord[] {
  if (!fs.existsSync(filename)) {
    throw new Error(`Missing file: ${filename}. Run 'npm run research' first.`);
  }
  const raw = fs.readFileSync(filename, "utf-8");
  return JSON.parse(raw);
}

function loadBrowserCheck(filename: string) {
  if (!fs.existsSync(filename)) return null;
  const raw = fs.readFileSync(filename, "utf-8");
  return JSON.parse(raw);
}

function loadVerifyScorecard(filename: string) {
  if (!fs.existsSync(filename)) return null;
  const raw = fs.readFileSync(filename, "utf-8");
  return JSON.parse(raw);
}

function summarizePass(passName: string, results: ResearchRecord[]): PassSummary {
  const found = results.filter(r => r.foundInComposio).length;
  const notFound = results.length - found;
  const coveragePct = Math.round((found / results.length) * 100);

  return {
    passName,
    totalApps: results.length,
    foundInComposio: found,
    notFound,
    coveragePct,
  };
}

function main() {
  console.log("\n" + "=".repeat(70));
  console.log("VERIFICATION LOOP COMPARISON — Pass 1 vs Pass 2");
  console.log("=".repeat(70) + "\n");

  // Load Pass 1
  let pass1: PassSummary;
  try {
    const pass1Results = loadPass("output/pass1-research-results.json");
    pass1 = summarizePass("Pass 1 (Baseline)", pass1Results);

    const pass1Browser = loadBrowserCheck("output/pass1-browser-check.json");
    if (pass1Browser?.summary) {
      pass1.browserConfirmed = pass1Browser.summary.confirmed;
      pass1.browserConfirmedPct = pass1Browser.summary.confirmedPct;
    }

    const pass1Verify = loadVerifyScorecard("output/pass1-verification-scorecard.json");
    if (pass1Verify) {
      pass1.manualVerifyCorrect = pass1Verify.correct;
      pass1.manualVerifyTotal = pass1Verify.sampleSize;
      pass1.manualAccuracyPct = pass1Verify.accuracyPct;
    }
  } catch (err: any) {
    console.error("❌ Pass 1 data missing. Run baseline first:");
    console.error("   npm run research");
    console.error("   cp output/research-results.json output/pass1-research-results.json");
    console.error("   npm run browser-verify");
    console.error("   cp output/browser-check-results.json output/pass1-browser-check.json");
    console.error("   npm run verify");
    console.error("   cp output/verification-scorecard.json output/pass1-verification-scorecard.json\n");
    process.exit(1);
  }

  // Load Pass 2
  let pass2: PassSummary;
  try {
    const pass2Results = loadPass("output/research-results.json");
    pass2 = summarizePass("Pass 2 (After fixes)", pass2Results);

    const pass2Browser = loadBrowserCheck("output/browser-check-results.json");
    if (pass2Browser?.summary) {
      pass2.browserConfirmed = pass2Browser.summary.confirmed;
      pass2.browserConfirmedPct = pass2Browser.summary.confirmedPct;
    }

    const pass2Verify = loadVerifyScorecard("output/verification-scorecard.json");
    if (pass2Verify) {
      pass2.manualVerifyCorrect = pass2Verify.correct;
      pass2.manualVerifyTotal = pass2Verify.sampleSize;
      pass2.manualAccuracyPct = pass2Verify.accuracyPct;
    }
  } catch (err: any) {
    console.error("❌ Pass 2 data missing. After fixing aliasMap, run:");
    console.error("   npm run research");
    console.error("   npm run browser-verify");
    console.error("   npm run verify\n");
    process.exit(1);
  }

  // Print comparison table
  console.log("┌─────────────────────────────────┬──────────────┬──────────────┬─────────┐");
  console.log("│ Metric                          │ Pass 1       │ Pass 2       │ Δ       │");
  console.log("├─────────────────────────────────┼──────────────┼──────────────┼─────────┤");

  const formatRow = (label: string, val1: string, val2: string, delta: string) => {
    return `│ ${label.padEnd(31)} │ ${val1.padEnd(12)} │ ${val2.padEnd(12)} │ ${delta.padEnd(7)} │`;
  };

  console.log(formatRow("Apps found in Composio", 
    `${pass1.foundInComposio}/${pass1.totalApps}`, 
    `${pass2.foundInComposio}/${pass2.totalApps}`,
    pass2.foundInComposio > pass1.foundInComposio ? `+${pass2.foundInComposio - pass1.foundInComposio}` : "—"
  ));

  console.log(formatRow("Coverage %", 
    `${pass1.coveragePct}%`, 
    `${pass2.coveragePct}%`,
    pass2.coveragePct > pass1.coveragePct ? `+${pass2.coveragePct - pass1.coveragePct}%` : "—"
  ));

  if (pass1.browserConfirmed != null && pass2.browserConfirmed != null) {
    console.log(formatRow("Browser-verified correct", 
      `${pass1.browserConfirmed} (${pass1.browserConfirmedPct}%)`, 
      `${pass2.browserConfirmed} (${pass2.browserConfirmedPct}%)`,
      pass2.browserConfirmedPct! > pass1.browserConfirmedPct! ? `+${pass2.browserConfirmedPct! - pass1.browserConfirmedPct!}%` : "—"
    ));
  }

  if (pass1.manualAccuracyPct != null && pass2.manualAccuracyPct != null) {
    console.log(formatRow("Manual verification accuracy", 
      `${pass1.manualVerifyCorrect}/${pass1.manualVerifyTotal} (${pass1.manualAccuracyPct}%)`, 
      `${pass2.manualVerifyCorrect}/${pass2.manualVerifyTotal} (${pass2.manualAccuracyPct}%)`,
      pass2.manualAccuracyPct > pass1.manualAccuracyPct ? `+${pass2.manualAccuracyPct - pass1.manualAccuracyPct}%` : "—"
    ));
  }

  console.log("└─────────────────────────────────┴──────────────┴──────────────┴─────────┘\n");

  const comparison = { pass1, pass2 };
  fs.writeFileSync("output/loop-comparison.json", JSON.stringify(comparison, null, 2));
  console.log("Comparison saved to output/loop-comparison.json\n");
}

main();
