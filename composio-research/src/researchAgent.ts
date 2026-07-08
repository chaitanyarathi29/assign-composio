import { Composio } from "@composio/core";
import * as fs from "fs";
import { config } from "dotenv";
import { apps, AppEntry } from "./apps.js";
import { aliasMap } from "./aliasMap.js";

config(); // Load .env file

const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });

export interface ResearchRecord {
  id: number;
  appName: string;
  categoryGiven: string;
  slugsTried: string[];
  matchMethod: "direct-slug" | "alias" | "not-found";
  foundInComposio: boolean;
  composioSlug?: string;
  composioName?: string;
  composioCategories?: string[];
  authSchemes?: string[];
  toolCount?: number;
  triggerCount?: number;
  description?: string;
  baseUrl?: string;
  verdict: string;
  blocker?: string;
  evidenceUrl: string;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/\(.*?\)/g, "")   // drop parenthetical
    .replace(/[^a-z0-9]+/g, "") // keep only alphanum
    .trim();
}

async function tryGetToolkit(slug: string): Promise<any | null> {
  if (!slug) return null;
  try {
    return await composio.toolkits.getToolkitBySlug(slug);
  } catch {
    return null;
  }
}

async function researchApp(app: AppEntry): Promise<ResearchRecord> {
  const naiveSlug = slugify(app.name);
  const aliasCandidates = aliasMap[app.name] || [];
  const candidates = [naiveSlug, ...aliasCandidates];
  const slugsTried: string[] = [];

  let toolkit: any = null;
  let matchedSlug = "";
  let matchMethod: ResearchRecord["matchMethod"] = "not-found";

  for (let i = 0; i < candidates.length; i++) {
    const slug = candidates[i];
    if (slugsTried.includes(slug)) continue;
    slugsTried.push(slug);
    toolkit = await tryGetToolkit(slug);
    if (toolkit) {
      matchedSlug = slug;
      matchMethod = i === 0 ? "direct-slug" : "alias";
      break;
    }
  }

  if (!toolkit) {
    return {
      id: app.id,
      appName: app.name,
      categoryGiven: app.categoryGiven,
      slugsTried,
      matchMethod: "not-found",
      foundInComposio: false,
      verdict: "Not in Composio today",
      blocker: "No matching Composio toolkit found",
      evidenceUrl: `https://docs.composio.dev/toolkits`,
    };
  }

  // Real fields from getToolkitBySlug response
  const authSchemes: string[] = (toolkit.composioManagedAuthSchemes || []);
  // Fallback: parse from authConfigDetails if composioManagedAuthSchemes is empty
  if (authSchemes.length === 0 && toolkit.authConfigDetails?.length) {
    for (const detail of toolkit.authConfigDetails) {
      const mode = detail.mode || detail.authScheme;
      if (mode && !authSchemes.includes(mode)) authSchemes.push(mode);
    }
  }

  const categories: string[] = (toolkit.meta?.categories || []).map((c: any) => c.name || c.slug);
  const toolCount: number = toolkit.meta?.toolsCount ?? 0;
  const triggerCount: number = toolkit.meta?.triggersCount ?? 0;
  const description: string = toolkit.meta?.description || "";
  const baseUrl: string = toolkit.baseUrl || "";

  const buildable = toolCount > 0;
  const verdict = buildable
    ? `Buildable today — ${toolCount} tools, ${triggerCount} triggers`
    : "Toolkit exists but 0 tools listed";

  return {
    id: app.id,
    appName: app.name,
    categoryGiven: app.categoryGiven,
    slugsTried,
    matchMethod,
    foundInComposio: true,
    composioSlug: matchedSlug,
    composioName: toolkit.name,
    composioCategories: categories,
    authSchemes: authSchemes.length ? authSchemes : ["UNKNOWN"],
    toolCount,
    triggerCount,
    description,
    baseUrl,
    verdict,
    blocker: buildable ? undefined : "0 tools exposed in Composio toolkit",
    evidenceUrl: `https://docs.composio.dev/toolkits/${matchedSlug}`,
  };
}

async function main() {
  console.log(`Starting research on ${apps.length} apps...\n`);
  const results: ResearchRecord[] = [];

  for (const app of apps) {
    process.stdout.write(`[${String(app.id).padStart(3, " ")}/${apps.length}] ${app.name.padEnd(32, " ")} ... `);
    try {
      const record = await researchApp(app);
      if (record.foundInComposio) {
        console.log(`FOUND  slug=${record.composioSlug}  auth=${record.authSchemes?.join(",")}  tools=${record.toolCount}`);
      } else {
        console.log(`NOT FOUND  tried=[${record.slugsTried.join(", ")}]`);
      }
      results.push(record);
    } catch (err: any) {
      console.log(`ERROR: ${err.message}`);
      results.push({
        id: app.id,
        appName: app.name,
        categoryGiven: app.categoryGiven,
        slugsTried: [],
        matchMethod: "not-found",
        foundInComposio: false,
        verdict: "Error during research",
        blocker: err.message,
        evidenceUrl: "",
      });
    }
    // Gentle pacing — stay well under rate limits
    await new Promise((r) => setTimeout(r, 300));
  }

  fs.mkdirSync("output", { recursive: true });
  fs.writeFileSync("output/research-results.json", JSON.stringify(results, null, 2));

  const found = results.filter((r) => r.foundInComposio).length;
  console.log(`\n${"=".repeat(60)}`);
  console.log(`Done. ${found}/${results.length} apps matched to a Composio toolkit.`);
  console.log(`Results → output/research-results.json`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
