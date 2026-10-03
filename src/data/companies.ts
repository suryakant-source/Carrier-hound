/**
 * Real verified companies actively hiring remote talent across global timezones.
 * Sourced directly from official ATS boards in CareerMonke Supabase directory.
 */

export interface WorldwideCompany {
  id: string;
  name: string;
  jobCount: number;
  slug: string;
  country: string;
}

export const WORLDWIDE_COMPANIES: WorldwideCompany[] = [
  { id: "comp-openai", name: "OpenAI", jobCount: 378, slug: "openai", country: "United States" },
  { id: "comp-elevenlabs", name: "ElevenLabs", jobCount: 91, slug: "elevenlabs", country: "United States" },
  { id: "comp-cohere", name: "Cohere", jobCount: 84, slug: "cohere", country: "Canada" },
  { id: "comp-ramp", name: "Ramp", jobCount: 69, slug: "ramp", country: "United States" },
  { id: "comp-baseten", name: "Baseten", jobCount: 62, slug: "baseten", country: "United States" },
  { id: "comp-notion", name: "Notion", jobCount: 55, slug: "notion", country: "United States" },
  { id: "comp-supabase", name: "Supabase", jobCount: 50, slug: "supabase", country: "Worldwide" },
  { id: "comp-perplexity", name: "Perplexity AI", jobCount: 32, slug: "perplexity", country: "United States" },
  { id: "comp-snowflake", name: "Snowflake", jobCount: 31, slug: "snowflake", country: "United States" },
  { id: "comp-sentry", name: "Sentry", jobCount: 28, slug: "sentry", country: "United States" },
  { id: "comp-cursor", name: "Cursor", jobCount: 25, slug: "cursor", country: "United States" },
  { id: "comp-databricks", name: "Databricks", jobCount: 22, slug: "databricks", country: "United States" },
  { id: "comp-mixpanel", name: "Mixpanel", jobCount: 19, slug: "mixpanel", country: "United States" },
  { id: "comp-linear", name: "Linear", jobCount: 16, slug: "linear", country: "United States" },
  { id: "comp-affirm", name: "Affirm", jobCount: 12, slug: "affirm", country: "United States" },
  { id: "comp-resend", name: "Resend", jobCount: 5, slug: "resend", country: "United States" },
  { id: "comp-gusto", name: "Gusto", jobCount: 2, slug: "gusto", country: "United States" },
  { id: "comp-stripe", name: "Stripe", jobCount: 1, slug: "stripe", country: "United States" },
  { id: "comp-intercom", name: "Intercom", jobCount: 1, slug: "intercom", country: "Ireland" },
];
