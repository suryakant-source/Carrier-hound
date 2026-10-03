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

interface RecruiteeOffer {
  id: number;
  title: string;
  careers_url?: string;
  location?: string;
  city?: string;
  country?: string;
  country_code?: string;
  remote?: boolean;
  department?: string;
  published_at?: string;
  description?: string;
  employment_type_code?: string;
}

interface RecruiteeResponse {
  offers?: RecruiteeOffer[];
}

export class RecruiteeAdapter implements SourceAdapter {
  readonly type = 'recruitee';

  async fetchJobs(source: SourceConfig): Promise<NormalizedJob[]> {
    const slug = source.target.trim().toLowerCase();
    const url = `https://${slug}.recruitee.com/api/offers/`;
    const data = await politeFetchJson<RecruiteeResponse>(url);

    if (!data || !Array.isArray(data.offers)) {
      return [];
    }

    const companyName = source.name.replace(/\s*\(Recruitee\)$/i, '').trim();
    const nowIso = new Date().toISOString();

    return data.offers
      .filter((j) => j && j.title && (j.careers_url || j.id))
      .map((j): NormalizedJob => {
        const title = cleanText(j.title);
        const locParts = [j.city, j.country].filter(Boolean);
        const location = j.location || (locParts.length > 0 ? cleanText(locParts.join(', ')) : 'Unspecified');
        const remote = Boolean(j.remote) || detectRemote(title, location);
        const jobType = detectJobType(title, j.employment_type_code || '');
        const description = cleanAndTruncateDescription(j.description, 4000);
        const postedAt = normalizeDate(j.published_at);
        const category = source.category || detectCategory(title, [j.department || '']);
        const seniority = detectSeniority(title);
        const countryCode = j.country_code ? j.country_code.toUpperCase() : detectCountryCode(location);
        const remoteEligibility = detectRemoteEligibility(location, remote);
        const applyUrl = j.careers_url || `https://${slug}.recruitee.com/o/${j.id}`;

        return {
          source: 'recruitee',
          source_type: 'ats',
          source_job_id: `${slug}-${j.id}`,
          title,
          company: companyName,
          company_slug: slug,
          location,
          country_code: countryCode,
          remote,
          remote_scope: remote ? 'remote' : 'onsite',
          remote_eligibility: remoteEligibility,
          job_type: jobType,
          seniority,
          description,
          apply_url: applyUrl,
          source_url: applyUrl,
          salary_text: null,
          salary_min: null,
          salary_max: null,
          currency: 'USD',
          salary_period: 'yearly',
          category,
          posted_at: postedAt,
          discovered_at: nowIso,
          last_seen_at: nowIso,
          verified: true,
          verified_at: nowIso,
          is_active: true,
        };
      });
  }
}
