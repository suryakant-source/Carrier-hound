import { SourceAdapter } from './types';
import { NormalizedJob, SourceConfig } from '../types';
import { politeFetchJson } from '../utils/polite-fetch';
import {
  cleanText,
  cleanAndTruncateDescription,
  detectRemote,
  detectJobType,
  detectCategory,
  detectSeniority,
  detectCountryCode,
  detectRemoteEligibility,
  normalizeDate,
} from '../utils/sanitizer';

interface AdzunaJob {
  id: string | number;
  title: string;
  description: string;
  redirect_url: string;
  created: string;
  salary_min?: number;
  salary_max?: number;
  company?: {
    display_name?: string;
  };
  location?: {
    display_name?: string;
    area?: string[];
  };
  category?: {
    label?: string;
    tag?: string;
  };
}

interface AdzunaResponse {
  results?: AdzunaJob[];
  count?: number;
}

export class AdzunaAdapter implements SourceAdapter {
  readonly type = 'adzuna';

  async fetchJobs(source: SourceConfig): Promise<NormalizedJob[]> {
    const appId = process.env.ADZUNA_APP_ID;
    const appKey = process.env.ADZUNA_APP_KEY;

    if (!appId || !appKey) {
      console.log('   ℹ️ [Adzuna] Skipped (ADZUNA_APP_ID or ADZUNA_APP_KEY not configured)');
      return [];
    }

    const country = (source.target || 'us').toLowerCase();
    const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=50&content-type=application/json`;

    const data = await politeFetchJson<AdzunaResponse>(url);
    if (!data || !Array.isArray(data.results)) {
      return [];
    }

    const nowIso = new Date().toISOString();

    return data.results
      .filter((j) => j && j.title && j.redirect_url)
      .map((j): NormalizedJob => {
        const title = cleanText(j.title);
        const company = cleanText(j.company?.display_name || 'Various');
        const location = cleanText(j.location?.display_name || 'US');
        const remote = detectRemote(title, location);
        const jobType = detectJobType(title, j.description);
        const description = cleanAndTruncateDescription(j.description, 4000);
        const postedAt = normalizeDate(j.created);
        const category = source.category || detectCategory(title, [j.category?.label || '']);
        const seniority = detectSeniority(title);
        const countryCode = detectCountryCode(location) || country.toUpperCase();
        const remoteEligibility = detectRemoteEligibility(location, remote);

        let salaryText: string | null = null;
        if (j.salary_min && j.salary_max) {
          salaryText = `$${Math.round(j.salary_min).toLocaleString()} - $${Math.round(j.salary_max).toLocaleString()} / yr`;
        } else if (j.salary_min) {
          salaryText = `From $${Math.round(j.salary_min).toLocaleString()} / yr`;
        }

        return {
          source: 'adzuna',
          source_type: 'feed',
          source_job_id: String(j.id),
          title,
          company,
          location,
          country_code: countryCode,
          remote,
          remote_scope: remote ? 'remote' : 'onsite',
          remote_eligibility: remoteEligibility,
          job_type: jobType,
          seniority,
          description,
          apply_url: j.redirect_url,
          source_url: j.redirect_url,
          salary_text: salaryText,
          salary_min: j.salary_min ? Math.round(j.salary_min) : null,
          salary_max: j.salary_max ? Math.round(j.salary_max) : null,
          currency: 'USD',
          salary_period: 'yearly',
          category,
          posted_at: postedAt,
          discovered_at: nowIso,
          last_seen_at: nowIso,
          verified: false,
          verified_at: null,
          is_active: true,
        };
      });
  }
}
