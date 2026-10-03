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

interface SmartRecruitersJob {
  id: string;
  name: string;
  uuid?: string;
  refNumber?: string;
  company?: {
    name?: string;
    identifier?: string;
  };
  location?: {
    city?: string;
    region?: string;
    country?: string;
    remote?: boolean;
  };
  typeOfEmployment?: {
    id?: string;
    label?: string;
  };
  experienceLevel?: {
    id?: string;
    label?: string;
  };
  releasedDate?: string;
  creator?: {
    name?: string;
  };
  function?: {
    id?: string;
    label?: string;
  };
  department?: {
    id?: string;
    label?: string;
  };
  ref?: string;
}

interface SmartRecruitersResponse {
  totalFound?: number;
  content?: SmartRecruitersJob[];
}

export class SmartRecruitersAdapter implements SourceAdapter {
  readonly type = 'smartrecruiters';

  async fetchJobs(source: SourceConfig): Promise<NormalizedJob[]> {
    const slug = source.target.trim().toLowerCase();
    const url = `https://api.smartrecruiters.com/v1/companies/${slug}/postings?limit=100`;
    const data = await politeFetchJson<SmartRecruitersResponse>(url);

    if (!data || !Array.isArray(data.content)) {
      return [];
    }

    const companyName = source.name.replace(/\s*\(SmartRecruiters\)$/i, '').trim();
    const nowIso = new Date().toISOString();

    return data.content
      .filter((j) => j && j.name && j.id)
      .map((j): NormalizedJob => {
        const title = cleanText(j.name);
        const locParts = [j.location?.city, j.location?.region, j.location?.country].filter(Boolean);
        const location = locParts.length > 0 ? cleanText(locParts.join(', ')) : 'Unspecified';
        const remote = Boolean(j.location?.remote) || detectRemote(title, location);
        const jobType = detectJobType(title, j.typeOfEmployment?.label || '');
        const postedAt = normalizeDate(j.releasedDate);
        const category =
          source.category ||
          detectCategory(title, [j.function?.label || '', j.department?.label || '']);
        const seniority = detectSeniority(title);
        const countryCode = j.location?.country ? j.location.country.toUpperCase() : detectCountryCode(location);
        const remoteEligibility = detectRemoteEligibility(location, remote);
        const applyUrl = `https://jobs.smartrecruiters.com/${slug}/${j.id}`;

        return {
          source: 'smartrecruiters',
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
          description: `${title} at ${companyName}`,
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
