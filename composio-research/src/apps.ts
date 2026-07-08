export interface AppEntry {
  id: number;
  name: string;
  hint: string;
  categoryGiven: string;
}

export const apps: AppEntry[] = [
  // 1. CRM and Sales
  { id: 1, name: "Salesforce", hint: "salesforce.com", categoryGiven: "CRM and Sales" },
  { id: 2, name: "HubSpot", hint: "hubspot.com", categoryGiven: "CRM and Sales" },
  { id: 3, name: "Pipedrive", hint: "pipedrive.com", categoryGiven: "CRM and Sales" },
  { id: 4, name: "Attio", hint: "attio.com", categoryGiven: "CRM and Sales" },
  { id: 5, name: "Twenty", hint: "twenty.com (open-source CRM)", categoryGiven: "CRM and Sales" },
  { id: 6, name: "Podio", hint: "podio.com", categoryGiven: "CRM and Sales" },
  { id: 7, name: "Zoho CRM", hint: "zoho.com/crm", categoryGiven: "CRM and Sales" },
  { id: 8, name: "Close", hint: "close.com", categoryGiven: "CRM and Sales" },
  { id: 9, name: "Copper", hint: "copper.com", categoryGiven: "CRM and Sales" },
  { id: 10, name: "DealCloud", hint: "api.docs.dealcloud.com", categoryGiven: "CRM and Sales" },

  // 2. Support and Helpdesk
  { id: 11, name: "Zendesk", hint: "zendesk.com", categoryGiven: "Support and Helpdesk" },
  { id: 12, name: "Intercom", hint: "intercom.com", categoryGiven: "Support and Helpdesk" },
  { id: 13, name: "Freshdesk", hint: "freshdesk.com", categoryGiven: "Support and Helpdesk" },
  { id: 14, name: "Front", hint: "front.com", categoryGiven: "Support and Helpdesk" },
  { id: 15, name: "Pylon", hint: "usepylon.com", categoryGiven: "Support and Helpdesk" },
  { id: 16, name: "LiveAgent", hint: "liveagent.com", categoryGiven: "Support and Helpdesk" },
  { id: 17, name: "Plain", hint: "plain.com", categoryGiven: "Support and Helpdesk" },
  { id: 18, name: "Help Scout", hint: "helpscout.com", categoryGiven: "Support and Helpdesk" },
  { id: 19, name: "Gorgias", hint: "gorgias.com", categoryGiven: "Support and Helpdesk" },
  { id: 20, name: "Gladly", hint: "gladly.com", categoryGiven: "Support and Helpdesk" },

  // 3. Communications and Messaging
  { id: 21, name: "Slack", hint: "slack.com", categoryGiven: "Communications and Messaging" },
  { id: 22, name: "Twilio", hint: "twilio.com", categoryGiven: "Communications and Messaging" },
  { id: 23, name: "Zoho Cliq", hint: "zoho.com/cliq", categoryGiven: "Communications and Messaging" },
  { id: 24, name: "Lark (Larksuite)", hint: "open.larksuite.com", categoryGiven: "Communications and Messaging" },
  { id: 25, name: "Pumble", hint: "pumble.com", categoryGiven: "Communications and Messaging" },
  { id: 26, name: "Discord", hint: "discord.com", categoryGiven: "Communications and Messaging" },
  { id: 27, name: "Telegram", hint: "core.telegram.org", categoryGiven: "Communications and Messaging" },
  { id: 28, name: "WhatsApp Business", hint: "developers.facebook.com/docs/whatsapp", categoryGiven: "Communications and Messaging" },
  { id: 29, name: "Aircall", hint: "aircall.io", categoryGiven: "Communications and Messaging" },
  { id: 30, name: "Vonage", hint: "developer.vonage.com", categoryGiven: "Communications and Messaging" },

  // 4. Marketing, Ads, Email and Social
  { id: 31, name: "Google Ads", hint: "developers.google.com/google-ads", categoryGiven: "Marketing, Ads, Email and Social" },
  { id: 32, name: "Meta Ads", hint: "developers.facebook.com/docs/marketing-apis", categoryGiven: "Marketing, Ads, Email and Social" },
  { id: 33, name: "LinkedIn Ads", hint: "learn.microsoft.com/linkedin/marketing", categoryGiven: "Marketing, Ads, Email and Social" },
  { id: 34, name: "GoHighLevel", hint: "highlevel.stoplight.io", categoryGiven: "Marketing, Ads, Email and Social" },
  { id: 35, name: "Mailchimp", hint: "mailchimp.com/developer", categoryGiven: "Marketing, Ads, Email and Social" },
  { id: 36, name: "Klaviyo", hint: "developers.klaviyo.com", categoryGiven: "Marketing, Ads, Email and Social" },
  { id: 37, name: "systeme.io", hint: "systeme.io (funnel builder)", categoryGiven: "Marketing, Ads, Email and Social" },
  { id: 38, name: "Pinterest", hint: "developers.pinterest.com", categoryGiven: "Marketing, Ads, Email and Social" },
  { id: 39, name: "Threads (Meta)", hint: "developers.facebook.com/docs/threads", categoryGiven: "Marketing, Ads, Email and Social" },
  { id: 40, name: "SendGrid", hint: "sendgrid.com", categoryGiven: "Marketing, Ads, Email and Social" },

  // 5. Ecommerce
  { id: 41, name: "Shopify", hint: "shopify.dev", categoryGiven: "Ecommerce" },
  { id: 42, name: "WooCommerce", hint: "woocommerce.com/document/woocommerce-rest-api", categoryGiven: "Ecommerce" },
  { id: 43, name: "BigCommerce", hint: "developer.bigcommerce.com", categoryGiven: "Ecommerce" },
  { id: 44, name: "Salesforce Commerce Cloud", hint: "developer.salesforce.com/docs/commerce", categoryGiven: "Ecommerce" },
  { id: 45, name: "Magento (Adobe Commerce)", hint: "developer.adobe.com/commerce", categoryGiven: "Ecommerce" },
  { id: 46, name: "Squarespace", hint: "developers.squarespace.com", categoryGiven: "Ecommerce" },
  { id: 47, name: "Ecwid", hint: "api-docs.ecwid.com", categoryGiven: "Ecommerce" },
  { id: 48, name: "Gumroad", hint: "gumroad.com/api", categoryGiven: "Ecommerce" },
  { id: 49, name: "Amazon Selling Partner", hint: "developer-docs.amazon.com/sp-api", categoryGiven: "Ecommerce" },
  { id: 50, name: "fanbasis", hint: "fanbasis.com", categoryGiven: "Ecommerce" },

  // 6. Data, SEO and Scraping
  { id: 51, name: "DataForSEO", hint: "docs.dataforseo.com", categoryGiven: "Data, SEO and Scraping" },
  { id: 52, name: "SE Ranking", hint: "seranking.com/api", categoryGiven: "Data, SEO and Scraping" },
  { id: 53, name: "Ahrefs", hint: "ahrefs.com/api", categoryGiven: "Data, SEO and Scraping" },
  { id: 54, name: "MrScraper", hint: "docs.mrscraper.com", categoryGiven: "Data, SEO and Scraping" },
  { id: 55, name: "Apify", hint: "docs.apify.com", categoryGiven: "Data, SEO and Scraping" },
  { id: 56, name: "Firecrawl", hint: "firecrawl.dev", categoryGiven: "Data, SEO and Scraping" },
  { id: 57, name: "Bright Data", hint: "brightdata.com", categoryGiven: "Data, SEO and Scraping" },
  { id: 58, name: "Sherlock", hint: "github.com/sherlock-project/sherlock", categoryGiven: "Data, SEO and Scraping" },
  { id: 59, name: "Waterfall.io", hint: "waterfall.io (contact/company intel)", categoryGiven: "Data, SEO and Scraping" },
  { id: 60, name: "Clay", hint: "clay.com", categoryGiven: "Data, SEO and Scraping" },

  // 7. Developer, Infra and Data platforms
  { id: 61, name: "GitHub", hint: "docs.github.com/rest", categoryGiven: "Developer, Infra and Data platforms" },
  { id: 62, name: "Vercel", hint: "vercel.com/docs/rest-api", categoryGiven: "Developer, Infra and Data platforms" },
  { id: 63, name: "Netlify", hint: "docs.netlify.com/api", categoryGiven: "Developer, Infra and Data platforms" },
  { id: 64, name: "Cloudflare", hint: "developers.cloudflare.com/api", categoryGiven: "Developer, Infra and Data platforms" },
  { id: 65, name: "Supabase", hint: "supabase.com/docs", categoryGiven: "Developer, Infra and Data platforms" },
  { id: 66, name: "Neo4j", hint: "neo4j.com/docs/api", categoryGiven: "Developer, Infra and Data platforms" },
  { id: 67, name: "Snowflake", hint: "docs.snowflake.com", categoryGiven: "Developer, Infra and Data platforms" },
  { id: 68, name: "MongoDB Atlas", hint: "mongodb.com/docs/atlas/api", categoryGiven: "Developer, Infra and Data platforms" },
  { id: 69, name: "Datadog", hint: "docs.datadoghq.com/api", categoryGiven: "Developer, Infra and Data platforms" },
  { id: 70, name: "Sentry", hint: "docs.sentry.io/api", categoryGiven: "Developer, Infra and Data platforms" },

  // 8. Productivity and Project Management
  { id: 71, name: "Notion", hint: "developers.notion.com", categoryGiven: "Productivity and Project Management" },
  { id: 72, name: "Airtable", hint: "airtable.com/developers", categoryGiven: "Productivity and Project Management" },
  { id: 73, name: "Linear", hint: "developers.linear.app", categoryGiven: "Productivity and Project Management" },
  { id: 74, name: "Jira", hint: "developer.atlassian.com", categoryGiven: "Productivity and Project Management" },
  { id: 75, name: "Asana", hint: "developers.asana.com", categoryGiven: "Productivity and Project Management" },
  { id: 76, name: "Monday.com", hint: "developer.monday.com", categoryGiven: "Productivity and Project Management" },
  { id: 77, name: "ClickUp", hint: "clickup.com/api", categoryGiven: "Productivity and Project Management" },
  { id: 78, name: "Coda", hint: "coda.io/developers", categoryGiven: "Productivity and Project Management" },
  { id: 79, name: "Smartsheet", hint: "smartsheet.com/developers", categoryGiven: "Productivity and Project Management" },
  { id: 80, name: "Harvest", hint: "harvestapp.com (help.getharvest.com/api-v2)", categoryGiven: "Productivity and Project Management" },

  // 9. Finance and Fintech
  { id: 81, name: "Stripe", hint: "stripe.com/docs/api", categoryGiven: "Finance and Fintech" },
  { id: 82, name: "Plaid", hint: "plaid.com/docs", categoryGiven: "Finance and Fintech" },
  { id: 83, name: "Binance", hint: "binance-docs.github.io", categoryGiven: "Finance and Fintech" },
  { id: 84, name: "Paygent Connect", hint: "paygent (NMI-powered)", categoryGiven: "Finance and Fintech" },
  { id: 85, name: "iPayX", hint: "ipayx.ai/docs", categoryGiven: "Finance and Fintech" },
  { id: 86, name: "QuickBooks", hint: "developer.intuit.com", categoryGiven: "Finance and Fintech" },
  { id: 87, name: "Xero", hint: "developer.xero.com", categoryGiven: "Finance and Fintech" },
  { id: 88, name: "Brex", hint: "developer.brex.com", categoryGiven: "Finance and Fintech" },
  { id: 89, name: "Ramp", hint: "docs.ramp.com", categoryGiven: "Finance and Fintech" },
  { id: 90, name: "PitchBook", hint: "pitchbook.com (research API)", categoryGiven: "Finance and Fintech" },

  // 10. AI, Research and Media-native
  { id: 91, name: "NotebookLM", hint: "cloud.google.com/gemini (Enterprise API)", categoryGiven: "AI, Research and Media-native" },
  { id: 92, name: "Otter AI", hint: "help.otter.ai (MCP server)", categoryGiven: "AI, Research and Media-native" },
  { id: 93, name: "Fathom", hint: "fathom.video", categoryGiven: "AI, Research and Media-native" },
  { id: 94, name: "Consensus", hint: "consensus.app (OAuth requested)", categoryGiven: "AI, Research and Media-native" },
  { id: 95, name: "Reducto", hint: "reducto.ai (document parsing)", categoryGiven: "AI, Research and Media-native" },
  { id: 96, name: "Devin", hint: "docs.devin.ai (MCP)", categoryGiven: "AI, Research and Media-native" },
  { id: 97, name: "higgsfield", hint: "higgsfield.ai/cli (content suite)", categoryGiven: "AI, Research and Media-native" },
  { id: 98, name: "Mermaid CLI", hint: "github.com/mermaid-js/mermaid-cli", categoryGiven: "AI, Research and Media-native" },
  { id: 99, name: "YouTube Transcript", hint: "transcriptapi.com", categoryGiven: "AI, Research and Media-native" },
  { id: 100, name: "Grain", hint: "grain.com (meeting notes)", categoryGiven: "AI, Research and Media-native" },
];
