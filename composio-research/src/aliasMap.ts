// Composio toolkit slug candidates for apps where naive slugify won't hit.
// Derived from: (a) Composio docs browsing, (b) known rebrands/parent-company names,
// (c) common slug patterns observed in the Composio toolkit registry.
//
// Format: the first slug in each array is the most likely match.
// After running the agent, check output/research-results.json for "not-found" entries,
// look them up on https://docs.composio.dev/toolkits, and add the real slug here.

export const aliasMap: Record<string, string[]> = {
  // CRM and Sales
  "Zoho CRM":                   ["zohocrm", "zoho_crm", "zoho"],
  "Twenty":                     ["twenty", "twentycrm"],
  "DealCloud":                  ["dealcloud", "intapp"],

  // Support and Helpdesk
  "Help Scout":                 ["helpscout", "help_scout"],
  "LiveAgent":                  ["liveagent", "live_agent"],

  // Communications
  "Zoho Cliq":                  ["zohocliq", "zoho_cliq", "zoho-cliq"],
  "Lark (Larksuite)":           ["lark", "larksuite", "lark-suite"],
  "WhatsApp Business":          ["whatsapp", "whatsappbusiness", "whatsapp_business"],

  // Marketing, Ads, Email and Social
  "Google Ads":                 ["googleads", "google_ads", "google-ads"],
  "Meta Ads":                   ["metaads", "facebookads", "facebook_ads", "meta_ads"],
  "LinkedIn Ads":               ["linkedin", "linkedinads", "linkedin_ads"],
  "GoHighLevel":                ["gohighlevel", "highlevel", "go_high_level"],
  "systeme.io":                 ["systemeio", "systeme"],
  "Threads (Meta)":             ["threads", "threads_meta"],
  "SendGrid":                   ["sendgrid", "send_grid"],

  // Ecommerce
  "WooCommerce":                ["woocommerce", "woo_commerce"],
  "BigCommerce":                ["bigcommerce", "big_commerce"],
  "Salesforce Commerce Cloud":  ["salesforcecommercecloud", "sfcc", "salesforce_commerce"],
  "Magento (Adobe Commerce)":   ["magento", "adobe_commerce", "adobecommerce"],
  "Squarespace":                ["squarespace", "square_space"],
  "Ecwid":                      ["ecwid"],
  "Gumroad":                    ["gumroad"],
  "Amazon Selling Partner":     ["amazon", "amazonsellingpartner", "amazon_sp_api", "amazonsp"],
  "fanbasis":                   ["fanbasis", "fan_basis"],

  // Data, SEO and Scraping
  "DataForSEO":                 ["dataforseo", "data_for_seo"],
  "SE Ranking":                 ["seranking", "se_ranking"],
  "Ahrefs":                     ["ahrefs"],
  "MrScraper":                  ["mrscraper", "mr_scraper"],
  "Apify":                      ["apify"],
  "Firecrawl":                  ["firecrawl", "fire_crawl"],
  "Bright Data":                ["brightdata", "bright_data", "luminati"],
  "Sherlock":                   ["sherlock"],
  "Waterfall.io":               ["waterfall", "waterfalldata"],
  "Clay":                       ["clay", "clayhq"],

  // Developer, Infra and Data platforms
  "MongoDB Atlas":              ["mongodb", "mongodbatlas", "mongo"],
  "Monday.com":                 ["monday", "mondaycom"],
  "Snowflake":                  ["snowflake"],
  "Neo4j":                      ["neo4j"],

  // Productivity and Project Management
  "Coda":                       ["coda", "codaio"],
  "Smartsheet":                 ["smartsheet"],
  "Harvest":                    ["harvest", "harvestapp"],

  // Finance and Fintech
  "Paygent Connect":            ["paygent", "nmi", "paygentconnect"],
  "iPayX":                      ["ipayx"],
  "QuickBooks":                 ["quickbooks", "quickbooks_online", "intuit"],
  "Brex":                       ["brex"],
  "Ramp":                       ["ramp"],
  "PitchBook":                  ["pitchbook", "pitch_book"],

  // AI, Research and Media-native
  "NotebookLM":                 ["notebooklm", "googlegemini", "gemini"],
  "Otter AI":                   ["otter", "otterai", "otter_ai"],
  "Fathom":                     ["fathom", "fathomvideo"],
  "Consensus":                  ["consensus", "consensusapp"],
  "Reducto":                    ["reducto"],
  "Devin":                      ["devin_mcp", "devin", "cognition"],
  "higgsfield":                 ["higgsfield"],
  "Mermaid CLI":                ["mermaid", "mermaidcli"],
  "YouTube Transcript":         ["youtube", "youtubetranscript", "youtube_transcript"],
  "Grain":                      ["grain"],
};
