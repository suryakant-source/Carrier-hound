import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { SourceConfig, SourceType } from './types';
import { slugify } from './utils/sanitizer';

// Load environment variables
dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envLocalPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath, override: true });
}

// CLI argument parsing
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry') || args.includes('-d');
const targetArgIdx = args.findIndex((a) => a === '--target' || a === '-t');
const TARGET_COMPANIES = targetArgIdx !== -1 && args[targetArgIdx + 1] ? parseInt(args[targetArgIdx + 1], 10) : 500;
const concArgIdx = args.findIndex((a) => a === '--concurrency' || a === '-c');
const CONCURRENCY = concArgIdx !== -1 && args[concArgIdx + 1] ? parseInt(args[concArgIdx + 1], 10) : 10;

// Rate limiting state per hostname
const lastCallMap = new Map<string, number>();
const DOMAIN_DELAY_MS = 250; // polite 250ms spacing per domain

async function throttle(domain: string): Promise<void> {
  const now = Date.now();
  const last = lastCallMap.get(domain) || 0;
  const diff = now - last;
  if (diff < DOMAIN_DELAY_MS) {
    await new Promise((r) => setTimeout(r, DOMAIN_DELAY_MS - diff));
  }
  lastCallMap.set(domain, Date.now());
}

interface DiscoveredBoard {
  id: string;
  name: string;
  type: SourceType;
  target: string;
  enabled: boolean;
  jobCount: number;
}

// Top tech candidate slugs to complement GitHub repos
const CURATED_CANDIDATES: Array<{ name: string; slug: string; preferredAts?: SourceType }> = [
  // AI & ML
  { name: 'Anthropic', slug: 'anthropic', preferredAts: 'greenhouse' },
  { name: 'OpenAI', slug: 'openai', preferredAts: 'ashby' },
  { name: 'Cohere', slug: 'cohere', preferredAts: 'greenhouse' },
  { name: 'Scale AI', slug: 'scaleai', preferredAts: 'greenhouse' },
  { name: 'Runway', slug: 'runway', preferredAts: 'ashby' },
  { name: 'Midjourney', slug: 'midjourney' },
  { name: 'Mistral AI', slug: 'mistral' },
  { name: 'Hugging Face', slug: 'huggingface' },
  { name: 'Character.ai', slug: 'character' },
  { name: 'Together AI', slug: 'together' },
  { name: 'Groq', slug: 'groq' },
  { name: 'Harvey', slug: 'harvey', preferredAts: 'ashby' },
  { name: 'Sierra', slug: 'sierra', preferredAts: 'ashby' },
  { name: 'ElevenLabs', slug: 'elevenlabs', preferredAts: 'ashby' },
  { name: 'Baseten', slug: 'baseten', preferredAts: 'ashby' },
  { name: 'Modal', slug: 'modal', preferredAts: 'ashby' },
  { name: 'Perplexity', slug: 'perplexity', preferredAts: 'ashby' },
  { name: 'Anyscale', slug: 'anyscale', preferredAts: 'greenhouse' },
  { name: 'LangChain', slug: 'langchain', preferredAts: 'ashby' },
  { name: 'LlamaIndex', slug: 'llamaindex' },
  { name: 'Weights & Biases', slug: 'wandb', preferredAts: 'greenhouse' },
  { name: 'Deepgram', slug: 'deepgram' },
  { name: 'Synthesia', slug: 'synthesia' },
  { name: 'Replit', slug: 'replit', preferredAts: 'ashby' },
  { name: 'Cursor', slug: 'cursor', preferredAts: 'ashby' },
  { name: 'Warp', slug: 'warp', preferredAts: 'ashby' },

  // Dev Tools & Infrastructure
  { name: 'Vercel', slug: 'vercel', preferredAts: 'greenhouse' },
  { name: 'Supabase', slug: 'supabase', preferredAts: 'ashby' },
  { name: 'PostHog', slug: 'posthog', preferredAts: 'ashby' },
  { name: 'Pinecone', slug: 'pinecone', preferredAts: 'ashby' },
  { name: 'Neon', slug: 'neon', preferredAts: 'ashby' },
  { name: 'PlanetScale', slug: 'planetscale', preferredAts: 'ashby' },
  { name: 'Upstash', slug: 'upstash' },
  { name: 'Sentry', slug: 'sentry', preferredAts: 'greenhouse' },
  { name: 'LaunchDarkly', slug: 'launchdarkly', preferredAts: 'greenhouse' },
  { name: 'Temporal', slug: 'temporal', preferredAts: 'greenhouse' },
  { name: 'Tailscale', slug: 'tailscale', preferredAts: 'greenhouse' },
  { name: '1Password', slug: '1password', preferredAts: 'lever' },
  { name: 'Bitwarden', slug: 'bitwarden' },
  { name: 'Grafana Labs', slug: 'grafanalabs', preferredAts: 'greenhouse' },
  { name: 'Honeycomb', slug: 'honeycomb' },
  { name: 'Better Stack', slug: 'betterstack' },
  { name: 'Doppler', slug: 'doppler' },
  { name: 'Infisical', slug: 'infisical' },
  { name: 'ClickHouse', slug: 'clickhouse', preferredAts: 'greenhouse' },
  { name: 'Starburst Data', slug: 'starburst', preferredAts: 'greenhouse' },
  { name: 'dbt Labs', slug: 'dbtlabs', preferredAts: 'greenhouse' },
  { name: 'Docker', slug: 'docker', preferredAts: 'greenhouse' },
  { name: 'HashiCorp', slug: 'hashicorp', preferredAts: 'greenhouse' },
  { name: 'Pulumi', slug: 'pulumi' },
  { name: 'Datadog', slug: 'datadog', preferredAts: 'greenhouse' },
  { name: 'Cloudflare', slug: 'cloudflare', preferredAts: 'greenhouse' },
  { name: 'Fastly', slug: 'fastly', preferredAts: 'greenhouse' },
  { name: 'Akamai', slug: 'akamai' },
  { name: 'MongoDB', slug: 'mongodb', preferredAts: 'greenhouse' },
  { name: 'Elastic', slug: 'elastic', preferredAts: 'greenhouse' },
  { name: 'Confluent', slug: 'confluent', preferredAts: 'greenhouse' },
  { name: 'Snowflake', slug: 'snowflake', preferredAts: 'greenhouse' },
  { name: 'Databricks', slug: 'databricks', preferredAts: 'greenhouse' },
  { name: 'Fivetran', slug: 'fivetran', preferredAts: 'greenhouse' },
  { name: 'Cockroach Labs', slug: 'cockroachlabs', preferredAts: 'greenhouse' },

  // SaaS & Productivity
  { name: 'Canva', slug: 'canva', preferredAts: 'greenhouse' },
  { name: 'Retool', slug: 'retool', preferredAts: 'greenhouse' },
  { name: 'Webflow', slug: 'webflow', preferredAts: 'greenhouse' },
  { name: 'Loom', slug: 'loom' },
  { name: 'Zapier', slug: 'zapier', preferredAts: 'greenhouse' },
  { name: 'Miro', slug: 'miro', preferredAts: 'greenhouse' },
  { name: 'Grammarly', slug: 'grammarly', preferredAts: 'greenhouse' },
  { name: 'Airtable', slug: 'airtable', preferredAts: 'greenhouse' },
  { name: 'ClickUp', slug: 'clickup', preferredAts: 'greenhouse' },
  { name: 'Coda', slug: 'coda', preferredAts: 'lever' },
  { name: 'Notion', slug: 'notion', preferredAts: 'ashby' },
  { name: 'Figma', slug: 'figma', preferredAts: 'greenhouse' },
  { name: 'Monday.com', slug: 'monday', preferredAts: 'greenhouse' },
  { name: 'Asana', slug: 'asana', preferredAts: 'greenhouse' },
  { name: 'HubSpot', slug: 'hubspot', preferredAts: 'greenhouse' },
  { name: 'Box', slug: 'box', preferredAts: 'greenhouse' },
  { name: 'Dropbox', slug: 'dropbox', preferredAts: 'greenhouse' },
  { name: 'Atlassian', slug: 'atlassian', preferredAts: 'lever' },
  { name: 'Zendesk', slug: 'zendesk', preferredAts: 'smartrecruiters' },
  { name: 'Intercom', slug: 'intercom', preferredAts: 'greenhouse' },
  { name: 'Freshworks', slug: 'freshworks' },
  { name: 'Braze', slug: 'braze', preferredAts: 'greenhouse' },
  { name: 'Klaviyo', slug: 'klaviyo', preferredAts: 'greenhouse' },
  { name: 'Amplitude', slug: 'amplitude', preferredAts: 'greenhouse' },
  { name: 'Mixpanel', slug: 'mixpanel', preferredAts: 'greenhouse' },
  { name: 'Linear', slug: 'linear', preferredAts: 'ashby' },

  // Fintech & Commerce
  { name: 'Stripe', slug: 'stripe', preferredAts: 'greenhouse' },
  { name: 'Plaid', slug: 'plaid', preferredAts: 'greenhouse' },
  { name: 'Robinhood', slug: 'robinhood', preferredAts: 'greenhouse' },
  { name: 'Affirm', slug: 'affirm', preferredAts: 'greenhouse' },
  { name: 'Klarna', slug: 'klarna' },
  { name: 'Chime', slug: 'chime', preferredAts: 'greenhouse' },
  { name: 'Revolut', slug: 'revolut', preferredAts: 'lever' },
  { name: 'Monzo', slug: 'monzo', preferredAts: 'greenhouse' },
  { name: 'Brex', slug: 'brex', preferredAts: 'greenhouse' },
  { name: 'Ramp', slug: 'ramp', preferredAts: 'ashby' },
  { name: 'Mercury', slug: 'mercury', preferredAts: 'ashby' },
  { name: 'Carta', slug: 'carta', preferredAts: 'lever' },
  { name: 'Toast', slug: 'toast', preferredAts: 'greenhouse' },
  { name: 'Block / Square', slug: 'square', preferredAts: 'smartrecruiters' },
  { name: 'Shopify', slug: 'shopify', preferredAts: 'smartrecruiters' },
  { name: 'BigCommerce', slug: 'bigcommerce', preferredAts: 'greenhouse' },
  { name: 'Etsy', slug: 'etsy', preferredAts: 'greenhouse' },
  { name: 'Coinbase', slug: 'coinbase', preferredAts: 'greenhouse' },
  { name: 'Rippling', slug: 'rippling' },
  { name: 'Deel', slug: 'deel', preferredAts: 'ashby' },
  { name: 'Remote', slug: 'remote', preferredAts: 'greenhouse' },
  { name: 'Gusto', slug: 'gusto', preferredAts: 'greenhouse' },
  { name: 'Lattice', slug: 'lattice', preferredAts: 'greenhouse' },
  { name: 'Culture Amp', slug: 'cultureamp', preferredAts: 'greenhouse' },

  // Security & Cloud
  { name: 'CrowdStrike', slug: 'crowdstrike' },
  { name: 'SentinelOne', slug: 'sentinelone', preferredAts: 'greenhouse' },
  { name: 'Zscaler', slug: 'zscaler' },
  { name: 'Wiz', slug: 'wiz', preferredAts: 'greenhouse' },
  { name: 'Snyk', slug: 'snyk', preferredAts: 'greenhouse' },
  { name: 'Vanta', slug: 'vanta', preferredAts: 'ashby' },
  { name: 'Drata', slug: 'drata', preferredAts: 'lever' },
  { name: 'Secureframe', slug: 'secureframe', preferredAts: 'ashby' },
  { name: 'Chainguard', slug: 'chainguard', preferredAts: 'ashby' },
  { name: 'Teleport', slug: 'teleport', preferredAts: 'greenhouse' },
  { name: 'Okta', slug: 'okta', preferredAts: 'greenhouse' },
  { name: 'Palantir', slug: 'palantir', preferredAts: 'greenhouse' },

  // Consumer & Media
  { name: 'Airbnb', slug: 'airbnb', preferredAts: 'greenhouse' },
  { name: 'Reddit', slug: 'reddit', preferredAts: 'greenhouse' },
  { name: 'Discord', slug: 'discord', preferredAts: 'greenhouse' },
  { name: 'Pinterest', slug: 'pinterest', preferredAts: 'greenhouse' },
  { name: 'Spotify', slug: 'spotify', preferredAts: 'lever' },
  { name: 'Lyft', slug: 'lyft', preferredAts: 'greenhouse' },
  { name: 'DoorDash', slug: 'doordash', preferredAts: 'greenhouse' },
  { name: 'Instacart', slug: 'instacart', preferredAts: 'greenhouse' },
  { name: 'Duolingo', slug: 'duolingo', preferredAts: 'greenhouse' },
  { name: 'Coursera', slug: 'coursera', preferredAts: 'greenhouse' },
  { name: 'Udemy', slug: 'udemy', preferredAts: 'greenhouse' },
  { name: 'GitLab', slug: 'gitlab', preferredAts: 'greenhouse' },
  { name: 'Twilio', slug: 'twilio', preferredAts: 'greenhouse' },
  { name: 'Flexport', slug: 'flexport', preferredAts: 'greenhouse' },
  { name: 'Watershed', slug: 'watershed', preferredAts: 'ashby' },

  // Gaming & Entertainment
  { name: 'Unity', slug: 'unity3d', preferredAts: 'greenhouse' },
  { name: 'Roblox', slug: 'roblox', preferredAts: 'greenhouse' },
  { name: 'Niantic', slug: 'niantic', preferredAts: 'greenhouse' },
  { name: 'Riot Games', slug: 'riotgames', preferredAts: 'greenhouse' },
  { name: 'Twitch', slug: 'twitch', preferredAts: 'greenhouse' },
  { name: 'Epic Games', slug: 'epicgames', preferredAts: 'greenhouse' },
  { name: 'Scopely', slug: 'scopely', preferredAts: 'greenhouse' },

  // Travel, Mobility & Logistics
  { name: 'Navan', slug: 'navan', preferredAts: 'greenhouse' },
  { name: 'Motive', slug: 'motive', preferredAts: 'greenhouse' },
  { name: 'ShipBob', slug: 'shipbob', preferredAts: 'greenhouse' },
  { name: 'Hopper', slug: 'hopper', preferredAts: 'workable' },
  { name: 'Deliveroo', slug: 'deliveroo', preferredAts: 'greenhouse' },
  { name: 'Swiggy', slug: 'swiggy' },
  { name: 'Zomato', slug: 'zomato' },

  // E-Commerce & Marketplaces
  { name: 'Faire', slug: 'faire', preferredAts: 'greenhouse' },
  { name: 'Whatnot', slug: 'whatnot', preferredAts: 'ashby' },
  { name: 'StockX', slug: 'stockx', preferredAts: 'greenhouse' },
  { name: 'GOAT', slug: 'goat', preferredAts: 'greenhouse' },
  { name: 'SeatGeek', slug: 'seatgeek', preferredAts: 'greenhouse' },
  { name: 'Eventbrite', slug: 'eventbrite', preferredAts: 'greenhouse' },
  { name: 'Wayfair', slug: 'wayfair', preferredAts: 'greenhouse' },
  { name: 'Chewy', slug: 'chewy', preferredAts: 'greenhouse' },

  // Additional Fintech & Crypto
  { name: 'SoFi', slug: 'sofi', preferredAts: 'greenhouse' },
  { name: 'Betterment', slug: 'betterment', preferredAts: 'greenhouse' },
  { name: 'Wealthfront', slug: 'wealthfront', preferredAts: 'greenhouse' },
  { name: 'Wise', slug: 'wise', preferredAts: 'smartrecruiters' },
  { name: 'Checkout.com', slug: 'checkout', preferredAts: 'smartrecruiters' },
  { name: 'Marqeta', slug: 'marqeta', preferredAts: 'greenhouse' },
  { name: 'Alloy', slug: 'alloy', preferredAts: 'greenhouse' },
  { name: 'Modern Treasury', slug: 'moderntreasury', preferredAts: 'ashby' },
  { name: 'Unit', slug: 'unit', preferredAts: 'ashby' },
  { name: 'Melio', slug: 'melio', preferredAts: 'greenhouse' },
  { name: 'Bill.com', slug: 'bill', preferredAts: 'greenhouse' },

  // Databases & Cloud Infrastructure
  { name: 'Netlify', slug: 'netlify', preferredAts: 'greenhouse' },
  { name: 'Render', slug: 'render', preferredAts: 'ashby' },
  { name: 'Railway', slug: 'railway', preferredAts: 'ashby' },
  { name: 'Fly.io', slug: 'flyio', preferredAts: 'ashby' },
  { name: 'Sourcegraph', slug: 'sourcegraph', preferredAts: 'greenhouse' },
  { name: 'Timescale', slug: 'timescale', preferredAts: 'greenhouse' },
  { name: 'Qdrant', slug: 'qdrant', preferredAts: 'workable' },
  { name: 'Weaviate', slug: 'weaviate', preferredAts: 'ashby' },
  { name: 'Turso', slug: 'turso', preferredAts: 'ashby' },
  { name: 'Redis', slug: 'redis', preferredAts: 'greenhouse' },
  { name: 'Neo4j', slug: 'neo4j', preferredAts: 'greenhouse' },

  // Observability & Developer Tools
  { name: 'New Relic', slug: 'newrelic', preferredAts: 'greenhouse' },
  { name: 'Dynatrace', slug: 'dynatrace', preferredAts: 'smartrecruiters' },
  { name: 'Sumo Logic', slug: 'sumologic', preferredAts: 'greenhouse' },
  { name: 'Chronosphere', slug: 'chronosphere', preferredAts: 'greenhouse' },
  { name: 'Axiom', slug: 'axiom', preferredAts: 'ashby' },
  { name: 'Coralogix', slug: 'coralogix', preferredAts: 'greenhouse' },
  { name: 'Workato', slug: 'workato', preferredAts: 'greenhouse' },
  { name: 'Tray.io', slug: 'trayio', preferredAts: 'greenhouse' },

  // Additional Cybersecurity
  { name: 'Netskope', slug: 'netskope', preferredAts: 'greenhouse' },
  { name: 'Abnormal Security', slug: 'abnormalsecurity', preferredAts: 'greenhouse' },
  { name: 'Orca Security', slug: 'orcasecurity', preferredAts: 'greenhouse' },
  { name: 'Axonius', slug: 'axonius', preferredAts: 'greenhouse' },
  { name: 'Huntress', slug: 'huntress', preferredAts: 'greenhouse' },
  { name: 'Expel', slug: 'expel', preferredAts: 'greenhouse' },
  { name: 'Arctic Wolf', slug: 'arcticwolf', preferredAts: 'greenhouse' },
  { name: 'Cato Networks', slug: 'catonetworks', preferredAts: 'greenhouse' },

  // Healthtech & Life Sciences
  { name: 'Tempus', slug: 'tempus', preferredAts: 'greenhouse' },
  { name: 'Oscar Health', slug: 'oscar', preferredAts: 'greenhouse' },
  { name: 'Ro', slug: 'ro', preferredAts: 'greenhouse' },
  { name: 'Hims & Hers', slug: 'hims', preferredAts: 'greenhouse' },
  { name: 'Maven Clinic', slug: 'mavenclinic', preferredAts: 'greenhouse' },
  { name: 'Flatiron Health', slug: 'flatiron', preferredAts: 'greenhouse' },
  { name: 'Benchling', slug: 'benchling', preferredAts: 'greenhouse' },
  { name: 'Ginkgo Bioworks', slug: 'ginkgobioworks', preferredAts: 'greenhouse' },
  { name: 'Color Health', slug: 'color', preferredAts: 'greenhouse' },
  { name: 'Komodo Health', slug: 'komodohealth', preferredAts: 'greenhouse' },

  // Consumer, Community & Creator Tech
  { name: 'Snap', slug: 'snap', preferredAts: 'greenhouse' },
  { name: 'Strava', slug: 'strava', preferredAts: 'greenhouse' },
  { name: 'Calm', slug: 'calm', preferredAts: 'greenhouse' },
  { name: 'Headspace', slug: 'headspace', preferredAts: 'greenhouse' },
  { name: 'Substack', slug: 'substack', preferredAts: 'ashby' },
  { name: 'Patreon', slug: 'patreon', preferredAts: 'greenhouse' },
  { name: 'Medium', slug: 'medium', preferredAts: 'greenhouse' },
  { name: 'Bumble', slug: 'bumble', preferredAts: 'greenhouse' },
  { name: 'Match Group', slug: 'matchgroup', preferredAts: 'greenhouse' },
  { name: 'AllTrails', slug: 'alltrails', preferredAts: 'greenhouse' },
  { name: 'Quizlet', slug: 'quizlet', preferredAts: 'greenhouse' },
  { name: 'Codecademy', slug: 'codecademy', preferredAts: 'greenhouse' },
  { name: 'Guild Education', slug: 'guildeducation', preferredAts: 'greenhouse' },
  { name: 'MasterClass', slug: 'masterclass', preferredAts: 'greenhouse' },
  { name: 'Skillshare', slug: 'skillshare', preferredAts: 'greenhouse' },

  // Generative AI & Next-Gen Intelligence
  { name: 'Cognition', slug: 'cognition', preferredAts: 'ashby' },
  { name: 'Poolside', slug: 'poolside', preferredAts: 'ashby' },
  { name: 'Magic AI', slug: 'magic', preferredAts: 'ashby' },
  { name: 'Suno', slug: 'suno', preferredAts: 'ashby' },
  { name: 'Udio', slug: 'udio', preferredAts: 'ashby' },
  { name: 'HeyGen', slug: 'heygen', preferredAts: 'ashby' },
  { name: 'Pika', slug: 'pika', preferredAts: 'ashby' },
  { name: 'Luma AI', slug: 'lumaai', preferredAts: 'ashby' },
  { name: 'Ideogram', slug: 'ideogram', preferredAts: 'ashby' },
  { name: 'Leonardo AI', slug: 'leonardo', preferredAts: 'ashby' },
  { name: 'Tavus', slug: 'tavus', preferredAts: 'ashby' },
  { name: 'Captions', slug: 'captions', preferredAts: 'ashby' },
  { name: 'Descript', slug: 'descript', preferredAts: 'greenhouse' },
  { name: 'Phind', slug: 'phind', preferredAts: 'ashby' },
  { name: 'Etched', slug: 'etched', preferredAts: 'ashby' },
  { name: 'Lightmatter', slug: 'lightmatter', preferredAts: 'greenhouse' },
  { name: 'Cerebras', slug: 'cerebras', preferredAts: 'greenhouse' },
  { name: 'SambaNova', slug: 'sambanova', preferredAts: 'greenhouse' },
  { name: 'Tenstorrent', slug: 'tenstorrent', preferredAts: 'greenhouse' },

  // DevTools, DevOps & Cloud Systems
  { name: 'Spacelift', slug: 'spacelift', preferredAts: 'ashby' },
  { name: 'env0', slug: 'env0', preferredAts: 'ashby' },
  { name: 'Upbound', slug: 'upbound', preferredAts: 'greenhouse' },
  { name: 'Loft Labs', slug: 'loft', preferredAts: 'ashby' },
  { name: 'Okteto', slug: 'okteto', preferredAts: 'ashby' },
  { name: 'Dagger', slug: 'dagger', preferredAts: 'ashby' },
  { name: 'Depot', slug: 'depot', preferredAts: 'ashby' },
  { name: 'Earthly', slug: 'earthly', preferredAts: 'ashby' },
  { name: 'Turborepo / Vercel', slug: 'vercel', preferredAts: 'greenhouse' },
  { name: 'Traefik Labs', slug: 'traefik', preferredAts: 'greenhouse' },
  { name: 'Isovalent', slug: 'isovalent', preferredAts: 'greenhouse' },
  { name: 'Tigera', slug: 'tigera', preferredAts: 'greenhouse' },
  { name: 'Tailscale', slug: 'tailscale', preferredAts: 'greenhouse' },
  { name: 'Doppler', slug: 'doppler', preferredAts: 'ashby' },
  { name: 'Infisical', slug: 'infisical', preferredAts: 'ashby' },

  // Indian Unicorns & High-Growth Startups
  { name: 'Razorpay', slug: 'razorpay', preferredAts: 'greenhouse' },
  { name: 'CRED', slug: 'cred', preferredAts: 'lever' },
  { name: 'Meesho', slug: 'meesho', preferredAts: 'greenhouse' },
  { name: 'Zepto', slug: 'zepto', preferredAts: 'greenhouse' },
  { name: 'Blinkit', slug: 'blinkit', preferredAts: 'greenhouse' },
  { name: 'Groww', slug: 'groww', preferredAts: 'greenhouse' },
  { name: 'Zerodha', slug: 'zerodha', preferredAts: 'lever' },
  { name: 'PhonePe', slug: 'phonepe', preferredAts: 'greenhouse' },
  { name: 'Paytm', slug: 'paytm', preferredAts: 'greenhouse' },
  { name: 'BharatPe', slug: 'bharatpe', preferredAts: 'greenhouse' },
  { name: 'Pine Labs', slug: 'pinelabs', preferredAts: 'greenhouse' },
  { name: 'Cashfree', slug: 'cashfree', preferredAts: 'greenhouse' },
  { name: 'Juspay', slug: 'juspay', preferredAts: 'greenhouse' },
  { name: 'Zeta', slug: 'zeta', preferredAts: 'greenhouse' },
  { name: 'Slice', slug: 'slice', preferredAts: 'greenhouse' },
  { name: 'Navi', slug: 'navi', preferredAts: 'greenhouse' },
  { name: 'Delhivery', slug: 'delhivery', preferredAts: 'greenhouse' },
  { name: 'Shadowfax', slug: 'shadowfax', preferredAts: 'greenhouse' },
  { name: 'Porter', slug: 'porter', preferredAts: 'greenhouse' },
  { name: 'Urban Company', slug: 'urbancompany', preferredAts: 'greenhouse' },
  { name: 'Nykaa', slug: 'nykaa', preferredAts: 'greenhouse' },
  { name: 'Lenskart', slug: 'lenskart', preferredAts: 'greenhouse' },
  { name: 'Spinny', slug: 'spinny', preferredAts: 'greenhouse' },
  { name: 'Cars24', slug: 'cars24', preferredAts: 'greenhouse' },
  { name: 'Ather Energy', slug: 'atherenergy', preferredAts: 'greenhouse' },
  { name: 'Ola Electric', slug: 'olaelectric', preferredAts: 'greenhouse' },
  { name: 'InMobi', slug: 'inmobi', preferredAts: 'greenhouse' },
  { name: 'Postman', slug: 'postman', preferredAts: 'greenhouse' },
  { name: 'BrowserStack', slug: 'browserstack', preferredAts: 'greenhouse' },
  { name: 'Hasura', slug: 'hasura', preferredAts: 'ashby' },
  { name: 'Harness', slug: 'harness', preferredAts: 'greenhouse' },
  { name: 'Druva', slug: 'druva', preferredAts: 'greenhouse' },
  { name: 'Icertis', slug: 'icertis', preferredAts: 'greenhouse' },
  { name: 'HighRadius', slug: 'highradius', preferredAts: 'greenhouse' },

  // Global Scaleups & Unicorns
  { name: 'Papaya Global', slug: 'papayaglobal', preferredAts: 'greenhouse' },
  { name: 'Oyster HR', slug: 'oyster', preferredAts: 'greenhouse' },
  { name: 'Multiplier', slug: 'multiplier', preferredAts: 'ashby' },
  { name: 'Omnipresent', slug: 'omnipresent', preferredAts: 'ashby' },
  { name: 'Cityblock Health', slug: 'cityblock', preferredAts: 'greenhouse' },
  { name: 'Lyra Health', slug: 'lyrahealth', preferredAts: 'greenhouse' },
  { name: 'Spring Health', slug: 'springhealth', preferredAts: 'greenhouse' },
  { name: 'Alma', slug: 'helloalma', preferredAts: 'greenhouse' },
  { name: 'Talkspace', slug: 'talkspace', preferredAts: 'greenhouse' },
  { name: 'BetterHelp', slug: 'betterhelp', preferredAts: 'greenhouse' },
  { name: 'Carrot Fertility', slug: 'carrotfertility', preferredAts: 'greenhouse' },
  { name: 'Kindbody', slug: 'kindbody', preferredAts: 'greenhouse' },
  { name: 'Progyny', slug: 'progyny', preferredAts: 'greenhouse' },
  { name: 'ServiceNow', slug: 'servicenow', preferredAts: 'smartrecruiters' },
  { name: 'Workday', slug: 'workday' },
  { name: 'Intuit', slug: 'intuit' },
  { name: 'Autodesk', slug: 'autodesk' },
  { name: 'Salesforce', slug: 'salesforce' },
  { name: 'Adobe', slug: 'adobe' },
  { name: 'VMware', slug: 'vmware' },
  { name: 'Cisco', slug: 'cisco' },
  { name: 'Broadcom', slug: 'broadcom' },
  { name: 'Nvidia', slug: 'nvidia' },
  { name: 'AMD', slug: 'amd' },
  { name: 'Intel', slug: 'intel' },
  { name: 'Qualcomm', slug: 'qualcomm' },
  { name: 'Arista Networks', slug: 'arista', preferredAts: 'greenhouse' },
  { name: 'Fortinet', slug: 'fortinet' },
  { name: 'F5', slug: 'f5' },
  { name: 'Teradata', slug: 'teradata' },
  { name: 'NetApp', slug: 'netapp' },
  { name: 'Western Digital', slug: 'westerndigital' },
  { name: 'Micron', slug: 'micron' },

  // European & Global Scaleups
  { name: 'Personio', slug: 'personio', preferredAts: 'greenhouse' },
  { name: 'Celonis', slug: 'celonis', preferredAts: 'greenhouse' },
  { name: 'Delivery Hero', slug: 'deliveryhero', preferredAts: 'smartrecruiters' },
  { name: 'Bolt', slug: 'bolt', preferredAts: 'greenhouse' },
  { name: 'Wolt', slug: 'wolt', preferredAts: 'smartrecruiters' },
  { name: 'BlaBlaCar', slug: 'blablacar', preferredAts: 'smartrecruiters' },
  { name: 'Deezer', slug: 'deezer', preferredAts: 'smartrecruiters' },
  { name: 'SoundCloud', slug: 'soundcloud', preferredAts: 'greenhouse' },
  { name: 'Supercell', slug: 'supercell', preferredAts: 'greenhouse' },
  { name: 'Rovio', slug: 'rovio', preferredAts: 'greenhouse' },
  { name: 'Trustpilot', slug: 'trustpilot', preferredAts: 'greenhouse' },
  { name: 'Babbel', slug: 'babbel', preferredAts: 'greenhouse' },
  { name: 'DeepL', slug: 'deepl', preferredAts: 'greenhouse' },
  { name: 'Trade Republic', slug: 'traderepublic', preferredAts: 'greenhouse' },
  { name: 'Scalable Capital', slug: 'scalablecapital', preferredAts: 'greenhouse' },
  { name: 'Mollie', slug: 'mollie', preferredAts: 'greenhouse' },
  { name: 'Bird / MessageBird', slug: 'messagebird', preferredAts: 'greenhouse' },
  { name: 'Backbase', slug: 'backbase', preferredAts: 'greenhouse' },
  { name: 'N26', slug: 'n26', preferredAts: 'greenhouse' },
  { name: 'bunq', slug: 'bunq', preferredAts: 'greenhouse' },

  // Modern Productivity, Collaboration & Data Apps
  { name: 'Superhuman', slug: 'superhuman', preferredAts: 'ashby' },
  { name: 'Raycast', slug: 'raycast', preferredAts: 'ashby' },
  { name: 'Pitch', slug: 'pitch', preferredAts: 'greenhouse' },
  { name: 'Gamma', slug: 'gamma', preferredAts: 'ashby' },
  { name: 'Tome', slug: 'tome', preferredAts: 'ashby' },
  { name: 'Hex', slug: 'hex', preferredAts: 'ashby' },
  { name: 'Deepnote', slug: 'deepnote', preferredAts: 'ashby' },
  { name: 'Metabase', slug: 'metabase', preferredAts: 'greenhouse' },
  { name: 'Cube', slug: 'cube', preferredAts: 'ashby' },
  { name: 'Lightdash', slug: 'lightdash', preferredAts: 'ashby' },
  { name: 'Census', slug: 'census', preferredAts: 'ashby' },
  { name: 'Hightouch', slug: 'hightouch', preferredAts: 'ashby' },
  { name: 'RudderStack', slug: 'rudderstack', preferredAts: 'greenhouse' },
  { name: 'Customer.io', slug: 'customerio', preferredAts: 'greenhouse' },
  { name: 'OneSignal', slug: 'onesignal', preferredAts: 'greenhouse' },
  { name: 'Courier', slug: 'courier', preferredAts: 'ashby' },
  { name: 'Knock', slug: 'knock', preferredAts: 'ashby' },
  { name: 'Novu', slug: 'novu', preferredAts: 'ashby' },
  { name: 'Loops', slug: 'loops', preferredAts: 'ashby' },
  { name: 'ConvertKit', slug: 'convertkit', preferredAts: 'ashby' },
  { name: 'Beehiiv', slug: 'beehiiv', preferredAts: 'ashby' },

  // Cybersecurity & Modern Infrastructure
  { name: 'Sysdig', slug: 'sysdig', preferredAts: 'greenhouse' },
  { name: 'Aqua Security', slug: 'aquasec', preferredAts: 'greenhouse' },
  { name: 'GitGuardian', slug: 'gitguardian', preferredAts: 'greenhouse' },
  { name: 'Cyera', slug: 'cyera', preferredAts: 'ashby' },
  { name: 'BigID', slug: 'bigid', preferredAts: 'greenhouse' },
  { name: 'Sprinto', slug: 'sprinto', preferredAts: 'greenhouse' },
  { name: 'Scrut Automation', slug: 'scrutautomation', preferredAts: 'greenhouse' },
  { name: 'OneTrust', slug: 'onetrust', preferredAts: 'greenhouse' },
  { name: 'Transcend', slug: 'transcend', preferredAts: 'ashby' },
  { name: 'Immuta', slug: 'immuta', preferredAts: 'greenhouse' },
  { name: 'Satori', slug: 'satori', preferredAts: 'ashby' },
  { name: 'Dazz', slug: 'dazz', preferredAts: 'greenhouse' },
  { name: 'Apiiro', slug: 'apiiro', preferredAts: 'greenhouse' },
  { name: 'Endor Labs', slug: 'endorlabs', preferredAts: 'ashby' },
  { name: 'ArmorCode', slug: 'armorcode', preferredAts: 'greenhouse' },
  { name: 'BitSight', slug: 'bitsight', preferredAts: 'greenhouse' },
  { name: 'UpGuard', slug: 'upguard', preferredAts: 'greenhouse' },
  { name: 'Panorays', slug: 'panorays', preferredAts: 'greenhouse' },
  { name: 'DataGrail', slug: 'datagrail', preferredAts: 'greenhouse' },
  { name: 'Securiti', slug: 'securiti', preferredAts: 'greenhouse' },

  // High Growth Fintech & Consumer
  { name: 'Alpaca', slug: 'alpaca', preferredAts: 'ashby' },
  { name: 'DriveWealth', slug: 'drivewealth', preferredAts: 'greenhouse' },
  { name: 'Lithic', slug: 'lithic', preferredAts: 'ashby' },
  { name: 'Synctera', slug: 'synctera', preferredAts: 'ashby' },
  { name: 'Column', slug: 'column', preferredAts: 'ashby' },
  { name: 'Treasury Prime', slug: 'treasuryprime', preferredAts: 'greenhouse' },
  { name: 'Moov', slug: 'moov', preferredAts: 'greenhouse' },
  { name: 'Sardine', slug: 'sardine', preferredAts: 'ashby' },
  { name: 'Unit21', slug: 'unit21', preferredAts: 'greenhouse' },
  { name: 'Socure', slug: 'socure', preferredAts: 'greenhouse' },
  { name: 'Persona Identity', slug: 'withpersona', preferredAts: 'ashby' },
  { name: 'Veriff', slug: 'veriff', preferredAts: 'greenhouse' },
  { name: 'IDnow', slug: 'idnow', preferredAts: 'greenhouse' },
  { name: 'Onfido', slug: 'onfido', preferredAts: 'greenhouse' },
  { name: 'Trulioo', slug: 'trulioo', preferredAts: 'greenhouse' },
  { name: 'Jumio', slug: 'jumio', preferredAts: 'smartrecruiters' },
  { name: 'Clearco', slug: 'clearco', preferredAts: 'greenhouse' },
  { name: 'Pipe', slug: 'pipe', preferredAts: 'greenhouse' },
  { name: 'Capchase', slug: 'capchase', preferredAts: 'ashby' },
  { name: 'Founderpath', slug: 'founderpath', preferredAts: 'ashby' },
  { name: 'Sprinto', slug: 'sprinto', preferredAts: 'ashby' },
  { name: 'Dazz', slug: 'dazz', preferredAts: 'greenhouse' },
  { name: 'Immuta', slug: 'immuta', preferredAts: 'greenhouse' },
  { name: 'Transcend', slug: 'transcend', preferredAts: 'ashby' },
  { name: 'Raycast', slug: 'raycast', preferredAts: 'ashby' },
  { name: 'Beehiiv', slug: 'beehiiv', preferredAts: 'ashby' },
  { name: 'Loops', slug: 'loops', preferredAts: 'ashby' },
  { name: 'Courier', slug: 'courier', preferredAts: 'ashby' },
  { name: 'Novu', slug: 'novu', preferredAts: 'ashby' },
  { name: 'Superhuman', slug: 'superhuman', preferredAts: 'ashby' },
  { name: 'Sysdig', slug: 'sysdig', preferredAts: 'greenhouse' },
  { name: 'Aqua Security', slug: 'aquasec', preferredAts: 'greenhouse' },
  { name: 'GitGuardian', slug: 'gitguardian', preferredAts: 'greenhouse' },
  { name: 'Cyera', slug: 'cyera', preferredAts: 'ashby' },
  { name: 'BitSight', slug: 'bitsight', preferredAts: 'greenhouse' },
  { name: 'Unit21', slug: 'unit21', preferredAts: 'greenhouse' },
  { name: 'Tailscale', slug: 'tailscale', preferredAts: 'greenhouse' },
  { name: 'Temporal', slug: 'temporal', preferredAts: 'greenhouse' },
  { name: 'LaunchDarkly', slug: 'launchdarkly', preferredAts: 'greenhouse' },
  { name: 'Sentry', slug: 'sentry', preferredAts: 'greenhouse' },
  { name: 'Vercel', slug: 'vercel', preferredAts: 'greenhouse' },
  { name: 'PlanetScale', slug: 'planetscale', preferredAts: 'ashby' },
  { name: 'Upstash', slug: 'upstash', preferredAts: 'ashby' },
  { name: 'ClickHouse', slug: 'clickhouse', preferredAts: 'greenhouse' },
  { name: 'Starburst', slug: 'starburst', preferredAts: 'greenhouse' },
  { name: 'dbt Labs', slug: 'dbtlabs', preferredAts: 'greenhouse' },
  { name: 'Docker', slug: 'docker', preferredAts: 'greenhouse' },
  { name: 'HashiCorp', slug: 'hashicorp', preferredAts: 'greenhouse' },
];

/**
 * Fetch and extract candidates from poteto/hiring-without-whiteboards
 */
async function fetchPotetoCandidates(): Promise<Array<{ name: string; slug: string; type?: SourceType }>> {
  console.log('Fetching candidate companies from poteto/hiring-without-whiteboards...');
  const results: Array<{ name: string; slug: string; type?: SourceType }> = [];

  try {
    const res = await fetch('https://raw.githubusercontent.com/poteto/hiring-without-whiteboards/master/README.md', {
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return results;

    const text = await res.text();
    const regex = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const rawName = match[1].trim();
      const url = match[2].trim();

      if (rawName.includes('PR') || rawName.includes('HackerNews') || rawName.includes('Finding') || rawName.includes('How')) {
        continue;
      }

      if (url.includes('greenhouse.io/')) {
        const slug = url.split('greenhouse.io/')[1]?.split('/')[0]?.split('?')[0]?.replace(/[#].*$/, '');
        if (slug) results.push({ name: rawName, slug: slug.toLowerCase(), type: 'greenhouse' });
      } else if (url.includes('lever.co/')) {
        const slug = url.split('lever.co/')[1]?.split('/')[0]?.split('?')[0]?.replace(/[#].*$/, '');
        if (slug) results.push({ name: rawName, slug: slug.toLowerCase(), type: 'lever' });
      } else if (url.includes('ashbyhq.com/')) {
        const slug = url.split('ashbyhq.com/')[1]?.split('/')[0]?.split('?')[0]?.replace(/[#].*$/, '');
        if (slug) results.push({ name: rawName, slug: slug.toLowerCase(), type: 'ashby' });
      } else if (url.includes('workable.com/')) {
        const slug = url.split('workable.com/')[1]?.split('/')[0]?.split('?')[0]?.replace(/[#].*$/, '');
        if (slug) results.push({ name: rawName, slug: slug.toLowerCase(), type: 'workable' });
      } else if (url.includes('smartrecruiters.com/')) {
        const slug = url.split('smartrecruiters.com/')[1]?.split('/')[0]?.split('?')[0]?.replace(/[#].*$/, '');
        if (slug) results.push({ name: rawName, slug: slug.toLowerCase(), type: 'smartrecruiters' });
      } else {
        // Derive clean slug from company name
        const cleanSlug = slugify(rawName);
        if (cleanSlug && cleanSlug.length >= 3) {
          results.push({ name: rawName, slug: cleanSlug });
        }
      }
    }
    console.log(`Extracted ${results.length} candidate companies from repository.`);
  } catch (err: any) {
    console.warn(`Poteto fetch failed: ${err.message}`);
  }

  return results;
}

/**
 * Fetch candidate companies from remoteintech/remote-jobs GitHub tree
 */
async function fetchRemoteInTechCandidates(): Promise<Array<{ name: string; slug: string }>> {
  console.log('Fetching candidate companies from remoteintech/remote-jobs...');
  const results: Array<{ name: string; slug: string }> = [];

  try {
    const res = await fetch('https://api.github.com/repos/remoteintech/remote-jobs/git/trees/main?recursive=1', {
      headers: { 'User-Agent': 'CareerMonke-Discovery/1.0' },
      signal: AbortSignal.timeout(10000),
    });
    if (res.ok) {
      const data: any = await res.json();
      if (data.tree && Array.isArray(data.tree)) {
        for (const item of data.tree) {
          if (item.path && item.path.startsWith('src/companies/') && item.path.endsWith('.md')) {
            const rawSlug = item.path.replace('src/companies/', '').replace('.md', '').trim().toLowerCase();
            const cleanSlug = slugify(rawSlug);
            if (cleanSlug && cleanSlug.length >= 3) {
              const name = cleanSlug
                .split('-')
                .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(' ');
              results.push({ name, slug: cleanSlug });
            }
          }
        }
      }
    }
    console.log(`Extracted ${results.length} candidate companies from remoteintech repository.`);
  } catch (err: any) {
    console.warn(`remoteintech fetch warning: ${err.message}`);
  }

  return results;
}

/**
 * Fetch candidate companies from established-remote
 */
async function fetchEstablishedRemoteCandidates(): Promise<Array<{ name: string; slug: string }>> {
  console.log('Fetching candidate companies from yanirs/established-remote...');
  const results: Array<{ name: string; slug: string }> = [];

  try {
    const res = await fetch('https://raw.githubusercontent.com/yanirs/established-remote/master/README.md', {
      headers: { 'User-Agent': 'CareerMonke-Discovery/1.0' },
      signal: AbortSignal.timeout(10000),
    });
    if (res.ok) {
      const text = await res.text();
      const regex = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g;
      let m;
      while ((m = regex.exec(text)) !== null) {
        const name = m[1].trim();
        if (
          !name.includes('http') &&
          !name.includes('Wikipedia') &&
          !name.includes('Rocketship') &&
          !name.includes('Jobs') &&
          !name.includes('Glassdoor') &&
          !name.includes('visit my website')
        ) {
          const cleanSlug = slugify(name);
          if (cleanSlug && cleanSlug.length >= 3) {
            results.push({ name, slug: cleanSlug });
          }
        }
      }
    }
    console.log(`Extracted ${results.length} candidate companies from established-remote.`);
  } catch (err: any) {
    console.warn(`established-remote fetch warning: ${err.message}`);
  }

  return results;
}

/**
 * Probes an ATS endpoint for a given company slug.
 */
async function probeAts(
  slug: string,
  atsType: SourceType
): Promise<{ success: boolean; jobCount: number } | null> {
  const cleanSlug = slug.trim().toLowerCase();
  let url = '';
  let domain = '';

  switch (atsType) {
    case 'greenhouse':
      domain = 'boards-api.greenhouse.io';
      url = `https://boards-api.greenhouse.io/v1/boards/${cleanSlug}/jobs?content=false`;
      break;
    case 'lever':
      domain = 'api.lever.co';
      url = `https://api.lever.co/v0/postings/${cleanSlug}?mode=json`;
      break;
    case 'ashby':
      domain = 'api.ashbyhq.com';
      url = `https://api.ashbyhq.com/posting-api/job-board/${cleanSlug}`;
      break;
    case 'smartrecruiters':
      domain = 'api.smartrecruiters.com';
      url = `https://api.smartrecruiters.com/v1/companies/${cleanSlug}/postings`;
      break;
    case 'recruitee':
      domain = `${cleanSlug}.recruitee.com`;
      url = `https://${cleanSlug}.recruitee.com/api/offers/`;
      break;
    case 'workable':
      domain = 'apply.workable.com';
      url = `https://apply.workable.com/api/v1/widget/accounts/${cleanSlug}`;
      break;
    default:
      return null;
  }

  await throttle(domain);

  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(1800),
      headers: {
        'User-Agent': 'CareerMonke-Discovery/1.0 (+https://careermonke.com)',
        Accept: 'application/json, text/plain, */*',
      },
    });

    if (!res.ok) return null;

    const data: any = await res.json();
    let jobCount = 0;

    if (Array.isArray(data)) {
      jobCount = data.length;
    } else if (data && Array.isArray(data.jobs)) {
      jobCount = data.jobs.length;
    } else if (data && Array.isArray(data.content)) {
      jobCount = data.content.length;
    } else if (data && Array.isArray(data.offers)) {
      jobCount = data.offers.length;
    }

    if (jobCount > 0) {
      return { success: true, jobCount };
    }
  } catch {
    // Network or JSON parse error
  }

  return null;
}

/**
 * Finds the working ATS for a candidate company with fast parallel probes
 */
async function probeCandidate(candidate: {
  name: string;
  slug: string;
  type?: SourceType;
  preferredAts?: SourceType;
}): Promise<DiscoveredBoard | null> {
  if (candidate.type) {
    const res = await probeAts(candidate.slug, candidate.type);
    if (res && res.success) {
      return {
        id: candidate.slug,
        name: candidate.name,
        type: candidate.type,
        target: candidate.slug,
        enabled: true,
        jobCount: res.jobCount,
      };
    }
    return null;
  }

  // Tier 1 Probe: Greenhouse, Ashby, Lever in parallel (covers 90%+ of boards)
  const tier1Types: SourceType[] = candidate.preferredAts
    ? [candidate.preferredAts, ...(['greenhouse', 'ashby', 'lever'] as SourceType[]).filter((t) => t !== candidate.preferredAts)]
    : ['greenhouse', 'ashby', 'lever'];

  const tier1Results = await Promise.all(
    tier1Types.map(async (ats) => {
      const res = await probeAts(candidate.slug, ats);
      return res && res.success ? { ats, jobCount: res.jobCount } : null;
    })
  );

  const tier1Match = tier1Results.find((r) => r !== null);
  if (tier1Match) {
    return {
      id: candidate.slug,
      name: candidate.name,
      type: tier1Match.ats,
      target: candidate.slug,
      enabled: true,
      jobCount: tier1Match.jobCount,
    };
  }

  // Tier 2 Probe: SmartRecruiters, Recruitee, Workable in parallel
  const tier2Types: SourceType[] = ['smartrecruiters', 'recruitee', 'workable'];
  const tier2Results = await Promise.all(
    tier2Types.map(async (ats) => {
      const res = await probeAts(candidate.slug, ats);
      return res && res.success ? { ats, jobCount: res.jobCount } : null;
    })
  );

  const tier2Match = tier2Results.find((r) => r !== null);
  if (tier2Match) {
    return {
      id: candidate.slug,
      name: candidate.name,
      type: tier2Match.ats,
      target: candidate.slug,
      enabled: true,
      jobCount: tier2Match.jobCount,
    };
  }

  return null;
}

/**
 * Main Discovery Engine Execution
 */
async function main() {
  const startTime = Date.now();
  console.log(`\n======================================================`);
  console.log(`🔍 CareerMonke Automated Company Discovery Engine`);
  console.log(`======================================================`);
  console.log(`Target Companies: ${TARGET_COMPANIES}`);
  console.log(`Concurrency:      ${CONCURRENCY}`);
  console.log(`Mode:             ${isDryRun ? 'DRY-RUN (JSON Only)' : 'LIVE (JSON + Supabase sync)'}`);
  console.log(`Started:          ${new Date().toISOString()}\n`);

  // 1. Load initial seed list to preserve existing validated 52 companies
  const seedPath = path.resolve(__dirname, 'config/companies-seed.json');
  const discovered: DiscoveredBoard[] = [];
  const discoveredSlugs = new Set<string>();

  if (fs.existsSync(seedPath)) {
    const rawSeed = fs.readFileSync(seedPath, 'utf-8');
    const seedCompanies: SourceConfig[] = JSON.parse(rawSeed);
    for (const sc of seedCompanies) {
      discovered.push({
        id: sc.target,
        name: sc.name.replace(/\s*\((?:Greenhouse|Lever|Ashby|SmartRecruiters|Recruitee|Workable)\)$/i, '').trim(),
        type: sc.type,
        target: sc.target,
        enabled: true,
        jobCount: 0,
      });
      discoveredSlugs.add(sc.target.toLowerCase());
    }
  }

  // Load existing phase2 companies if already generated
  const phase2Path = path.resolve(__dirname, 'config/companies-phase2.json');
  if (fs.existsSync(phase2Path)) {
    const rawP2 = fs.readFileSync(phase2Path, 'utf-8');
    const p2Companies: SourceConfig[] = JSON.parse(rawP2);
    for (const p of p2Companies) {
      if (!discoveredSlugs.has(p.target.toLowerCase())) {
        discovered.push({
          id: p.target,
          name: p.name,
          type: p.type,
          target: p.target,
          enabled: true,
          jobCount: 0,
        });
        discoveredSlugs.add(p.target.toLowerCase());
      }
    }
  }
  console.log(`Loaded ${discovered.length} already verified companies.`);

  // 2. Fetch external candidates
  const [potetoCandidates, remoteInTechCandidates, establishedRemoteCandidates] = await Promise.all([
    fetchPotetoCandidates(),
    fetchRemoteInTechCandidates(),
    fetchEstablishedRemoteCandidates(),
  ]);

  // 3. Assemble and deduplicate full candidate pool
  const candidatePool: Array<{ name: string; slug: string; type?: SourceType; preferredAts?: SourceType }> = [];
  const seenCandidates = new Set<string>();

  // Add curated first
  for (const c of CURATED_CANDIDATES) {
    if (!discoveredSlugs.has(c.slug.toLowerCase()) && !seenCandidates.has(c.slug.toLowerCase())) {
      candidatePool.push(c);
      seenCandidates.add(c.slug.toLowerCase());
    }
  }

  // Add remoteintech candidates (884 fresh candidates)
  for (const r of remoteInTechCandidates) {
    if (!discoveredSlugs.has(r.slug.toLowerCase()) && !seenCandidates.has(r.slug.toLowerCase())) {
      candidatePool.push(r);
      seenCandidates.add(r.slug.toLowerCase());
    }
  }

  // Add established-remote candidates (100 fresh candidates)
  for (const e of establishedRemoteCandidates) {
    if (!discoveredSlugs.has(e.slug.toLowerCase()) && !seenCandidates.has(e.slug.toLowerCase())) {
      candidatePool.push(e);
      seenCandidates.add(e.slug.toLowerCase());
    }
  }

  // Add poteto candidates
  for (const p of potetoCandidates) {
    if (!discoveredSlugs.has(p.slug.toLowerCase()) && !seenCandidates.has(p.slug.toLowerCase())) {
      candidatePool.push(p);
      seenCandidates.add(p.slug.toLowerCase());
    }
  }

  console.log(`Total candidate companies to probe: ${candidatePool.length}`);
  console.log(`Need to discover ${Math.max(0, TARGET_COMPANIES - discovered.length)} more verified boards.\n`);

  // 4. Run concurrent discovery worker pool
  let candidateIndex = 0;
  let activeWorkers = 0;
  let totalJobsDiscovered = 0;

  async function worker() {
    while (candidateIndex < candidatePool.length && discovered.length < TARGET_COMPANIES) {
      const idx = candidateIndex++;
      const candidate = candidatePool[idx];

      const board = await probeCandidate(candidate);
      if (board) {
        if (!discoveredSlugs.has(board.target.toLowerCase())) {
          discoveredSlugs.add(board.target.toLowerCase());
          discovered.push(board);
          totalJobsDiscovered += board.jobCount;
          console.log(
            `✅ [${discovered.length}/${TARGET_COMPANIES}] Found [${board.type.toUpperCase()}] ${board.name} (${board.target}) -> ${board.jobCount} jobs`
          );
        }
      }
    }
  }

  const workers = Array.from({ length: CONCURRENCY }, () => worker());
  await Promise.all(workers);

  console.log(`\n🎉 Discovery phase finished in ${Math.round((Date.now() - startTime) / 1000)}s!`);
  console.log(`Total Verified Companies Discovered: ${discovered.length}`);

  // 5. Write to config/companies-phase2.json
  const outConfig: SourceConfig[] = discovered.map((b) => ({
    id: b.target,
    name: b.name,
    type: b.type,
    target: b.target,
    enabled: true,
  }));

  const outPath = path.resolve(__dirname, 'config/companies-phase2.json');
  fs.writeFileSync(outPath, JSON.stringify(outConfig, null, 2), 'utf-8');
  console.log(`💾 Saved ${outConfig.length} companies to ${outPath}`);

  // 6. Supabase Sync if not dry run
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!isDryRun && supabaseUrl && serviceRoleKey) {
    console.log('\nSyncing discovered boards to Supabase tables (companies, company_boards)...');
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const nowIso = new Date().toISOString();

    // Batch upsert into companies
    const companiesPayload = discovered.map((b) => ({
      name: b.name,
      slug: b.target,
      ats_type: b.type,
      enabled: true,
      last_success_at: nowIso,
      last_job_count: b.jobCount,
    }));

    const batchSize = 100;
    for (let i = 0; i < companiesPayload.length; i += batchSize) {
      const chunk = companiesPayload.slice(i, i + batchSize);
      await supabase.from('companies').upsert(chunk, { onConflict: 'slug' });
    }

    // Fetch company_ids to link boards
    const { data: dbCompanies } = await supabase
      .from('companies')
      .select('id, slug')
      .in('slug', discovered.map((d) => d.target));

    const companyMap = new Map<string, string>();
    if (dbCompanies) {
      for (const comp of dbCompanies) {
        companyMap.set(comp.slug, comp.id);
      }
    }

    // Batch upsert into company_boards
    const boardsPayload = discovered.map((b) => ({
      company_id: companyMap.get(b.target) || null,
      ats_type: b.type,
      slug: b.target,
      enabled: true,
      last_success_at: nowIso,
      last_job_count: b.jobCount,
      failure_count: 0,
    }));

    for (let i = 0; i < boardsPayload.length; i += batchSize) {
      const chunk = boardsPayload.slice(i, i + batchSize);
      await supabase.from('company_boards').upsert(chunk, { onConflict: 'ats_type,slug' });
    }

    console.log(`✅ Successfully synced ${discovered.length} companies & boards into Supabase!`);
  }

  // 7. Breakdown summary
  const breakdown: Record<string, { count: number; totalJobs: number }> = {};
  for (const b of discovered) {
    if (!breakdown[b.type]) breakdown[b.type] = { count: 0, totalJobs: 0 };
    breakdown[b.type].count++;
    breakdown[b.type].totalJobs += b.jobCount;
  }

  console.log(`\n======================================================`);
  console.log(`📊 DISCOVERY SUMMARY REPORT`);
  console.log(`======================================================`);
  console.table(
    Object.entries(breakdown).map(([ats, data]) => ({
      'ATS Platform': ats.toUpperCase(),
      'Verified Companies': data.count,
      'Total Jobs Available': data.totalJobs,
    }))
  );
  console.log(`Total Companies: ${discovered.length}`);
  console.log(`Total Available Verified Job Pool: ~${totalJobsDiscovered.toLocaleString()} jobs`);
  console.log(`======================================================\n`);
}

main().catch((err) => {
  console.error('Fatal Discovery Failure:', err);
  process.exit(1);
});
