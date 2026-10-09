import realCompanies from "./companies.json";

/**
 * Real verified companies actively hiring talent across global timezones.
 * Sourced directly from official ATS boards in CareerMonke Supabase database.
 */
export interface WorldwideCompany {
  id: string;
  name: string;
  jobCount: number;
  slug: string;
  country?: string;
}

export const WORLDWIDE_COMPANIES: WorldwideCompany[] = realCompanies;
