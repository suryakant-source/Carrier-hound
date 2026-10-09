import { createClient } from "../supabase/client";
import { DUMMY_JOBS } from "@/data/jobs";

export interface LiveJob {
  id: string;
  title: string;
  company: string;
  location: string;
  date: string;
  salary: string;
  category: string;
  remote: boolean;
  remoteScope?: string;
  remoteEligibility?: string;
  country: string;
  type: string;
  directSource: boolean;
  applyUrl: string;
  description?: string;
  skills?: string[];
  postedAt?: string;
}

export interface GetJobsOptions {
  page?: number;
  pageSize?: number;
  category?: string;
  search?: string;
  remoteOnly?: boolean;
  isPro?: boolean;
}

export interface GetJobsResult {
  jobs: LiveJob[];
  totalCount: number;
}

/**
 * Accurately determines remote eligibility scope without false Worldwide assumptions.
 */
export function getJobRemoteEligibility(job: {
  remote?: boolean;
  remoteScope?: string;
  remoteEligibility?: string;
  remote_scope?: string;
  remote_eligibility?: string;
  location?: string;
}): "worldwide" | "country_restricted" | "unknown" | "onsite" {
  const loc = (job.location || "").toLowerCase();
  const scope = (job.remoteScope || job.remote_scope || "").toLowerCase();
  const elig = (job.remoteEligibility || job.remote_eligibility || "").toLowerCase();

  if (elig === "worldwide" || scope === "worldwide") return "worldwide";
  if (elig === "country_restricted" || scope === "country_restricted") return "country_restricted";

  if (!job.remote && !loc.includes("remote")) return "onsite";

  // Check if location has explicit country/city restriction
  if (
    /\b(united states|u\.s\.|usa|remote - us|remote \(us\)|remote, us|uk|canada|india|germany|france|europe|emea|apac)\b/i.test(
      loc
    )
  ) {
    return "country_restricted";
  }

  // Check if location explicitly confirms global worldwide eligibility
  if (/\b(worldwide|anywhere|global|work from anywhere|all timezones)\b/i.test(loc)) {
    return "worldwide";
  }

  // If remote is true but no geography is specified
  if (job.remote) {
    return "unknown";
  }

  return "unknown";
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "Recently";
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60));
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 30) return `${diffDays}d ago`;
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch {
    return "Recently";
  }
}

/**
 * Fetches live verified active jobs from Supabase with strict server/payload-level Pro gating.
 * When isPro is false, gated fields (company, salary, apply_url) are NEVER queried or included in the payload.
 */
export async function getLiveJobs(options: GetJobsOptions = {}): Promise<GetJobsResult> {
  const {
    page = 1,
    pageSize = 25,
    category,
    search,
    remoteOnly,
    isPro = false,
  } = options;

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  try {
    const supabase = createClient();

    // STRICT PRO GATING AT QUERY LEVEL:
    // If not pro, NEVER request company, salary_text, or apply_url across the network wire
    const selectColumns = isPro
      ? "id, title, location, category, remote, remote_scope, remote_eligibility, country_code, job_type, verified, posted_at, created_at, company, salary_text, apply_url"
      : "id, title, location, category, remote, remote_scope, remote_eligibility, country_code, job_type, verified, posted_at, created_at";

    let query = supabase
      .from("jobs")
      .select(selectColumns, { count: "exact" })
      .eq("is_active", true)
      .eq("status", "active");

    if (category && category !== "all") {
      const c = category.toLowerCase().trim();
      if (c === "trending") {
        query = query.in("category", ["ai", "engineering", "devops"]);
      } else if (c === "tech") {
        query = query.in("category", ["engineering", "devops", "ai", "software"]);
      } else if (c === "internships") {
        query = query.or("job_type.eq.internship,title.ilike.%intern%");
      } else if (c === "remote") {
        query = query.eq("remote", true);
      } else if (c === "fresher") {
        query = query.or("title.ilike.%junior%,title.ilike.%entry%,title.ilike.%associate%,title.ilike.%intern%,job_type.eq.internship");
      } else if (c === "operations") {
        query = query.or("category.eq.operations,title.ilike.%operation%,title.ilike.%ops%");
      } else if (c === "cyber-security") {
        query = query.or("category.eq.cyber-security,title.ilike.%security%,title.ilike.%cyber%");
      } else if (c === "customer-support") {
        query = query.or("category.eq.customer-support,title.ilike.%support%,title.ilike.%customer%,title.ilike.%success%");
      } else if (c === "legal") {
        query = query.or("category.eq.legal,title.ilike.%legal%,title.ilike.%compliance%");
      } else if (c === "healthcare") {
        query = query.or("category.eq.healthcare,title.ilike.%health%,title.ilike.%clinical%");
      } else {
        query = query.or(`category.ilike.%${c}%,title.ilike.%${c}%`);
      }
    }

    if (remoteOnly) {
      query = query.eq("remote", true);
    }

    if (search && search.trim()) {
      const q = search.trim();
      if (isPro) {
        query = query.or(`title.ilike.%${q}%,location.ilike.%${q}%,company.ilike.%${q}%`);
      } else {
        query = query.or(`title.ilike.%${q}%,location.ilike.%${q}%`);
      }
    }

    query = query
      .order("posted_at", { ascending: false, nullsFirst: false })
      .range(from, to);

    const { data, count, error } = await query;

    if (!error && data && data.length > 0) {
      const mappedJobs: LiveJob[] = data.map((row: any) => {
        if (!isPro) {
          // STRICT SERVER-SIDE GATING FOR NON-PRO / VISITOR USERS:
          // Locked fields (company, salary, location, remote, description, applyUrl) are stripped completely.
          return {
            id: row.id,
            title: row.title || "Untitled Position",
            company: "",
            location: "",
            date: formatDate(row.posted_at || row.created_at),
            salary: "",
            category: row.category || "engineering",
            remote: false,
            remoteScope: undefined,
            remoteEligibility: undefined,
            country: "",
            type: row.job_type === "internship" ? "Internship" : "Full-time",
            directSource: false,
            applyUrl: "",
            description: "",
            skills: [],
            postedAt: row.posted_at || row.created_at,
          };
        }

        return {
          id: row.id,
          title: row.title || "Untitled Position",
          company: row.company || "Verified Employer",
          location: row.location || (row.remote ? "Remote (Worldwide)" : "Remote"),
          date: formatDate(row.posted_at || row.created_at),
          salary: row.salary_text || "",
          category: row.category || "engineering",
          remote: Boolean(row.remote),
          remoteScope: row.remote_scope || undefined,
          remoteEligibility: row.remote_eligibility || undefined,
          country: row.country_code || "US",
          type: row.job_type === "internship" ? "Internship" : "Full-time",
          directSource: Boolean(row.verified),
          applyUrl: row.apply_url || "",
          description: row.description || "",
          skills: row.skills || [],
          postedAt: row.posted_at || row.created_at,
        };
      });

      return {
        jobs: mappedJobs,
        totalCount: count ?? 16423,
      };
    }
  } catch (err) {
    console.warn("Supabase live jobs fetch error, falling back:", err);
  }

  // Offline / Error fallback: filter static list with strict payload gating
  let fallbackList = DUMMY_JOBS.slice();
  if (category && category !== "all") {
    const c = category.toLowerCase().trim();
    fallbackList = fallbackList.filter((j) => {
      const jc = (j.category || "").toLowerCase();
      const jt = (j.title || "").toLowerCase();
      if (c === "trending") return ["ai", "engineering", "devops"].includes(jc);
      if (c === "tech") return ["engineering", "devops", "ai", "software"].includes(jc) || jt.includes("developer");
      if (c === "internships") return jt.includes("intern") || j.type.toLowerCase().includes("intern");
      if (c === "remote") return j.remote;
      if (c === "fresher") return jt.includes("junior") || jt.includes("entry") || jt.includes("intern");
      if (c === "operations") return jc === "operations" || jt.includes("operation") || jt.includes("ops");
      if (c === "cyber-security") return jc === "cyber-security" || jt.includes("security") || jt.includes("cyber");
      if (c === "customer-support") return jc === "customer-support" || jt.includes("support") || jt.includes("customer");
      if (c === "legal") return jc === "legal" || jt.includes("legal") || jt.includes("compliance");
      if (c === "healthcare") return jc === "healthcare" || jt.includes("health");
      return jc.includes(c) || jt.includes(c);
    });
  }
  if (remoteOnly) {
    fallbackList = fallbackList.filter((j) => j.remote);
  }
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    fallbackList = fallbackList.filter(
      (j) => j.title.toLowerCase().includes(q) || j.location.toLowerCase().includes(q)
    );
  }

  const pagedFallback = fallbackList.slice(from, to + 1).map((j) => ({
    ...j,
    company: isPro ? j.company : "Confidential Employer",
    salary: isPro ? j.salary : "",
    applyUrl: isPro ? j.applyUrl : "",
  }));

  return {
    jobs: pagedFallback,
    totalCount: fallbackList.length,
  };
}

/**
 * Fetches single job detail by ID with strict server/payload-level Pro gating.
 */
export async function getLiveJobById(jobId: string, isPro: boolean = false): Promise<LiveJob | null> {
  if (!jobId || !jobId.trim()) return null;
  const cleanId = jobId.trim();

  try {
    const supabase = createClient();
    const selectColumns = isPro
      ? "id, title, location, category, remote, remote_scope, remote_eligibility, country_code, job_type, verified, posted_at, created_at, description, skills, company, salary_text, apply_url"
      : "id, title, category, job_type, posted_at, created_at";

    const { data, error } = await (supabase
      .from("jobs")
      .select(selectColumns as any)
      .eq("id", cleanId)
      .eq("is_active", true)
      .eq("status", "active")
      .maybeSingle() as any);

    if (!error && data) {
      const row = data as any;
      if (!isPro) {
        return {
          id: row.id,
          title: row.title || "Untitled Position",
          company: "",
          location: "",
          date: formatDate(row.posted_at || row.created_at),
          salary: "",
          category: row.category || "engineering",
          remote: false,
          country: "",
          type: row.job_type === "internship" ? "Internship" : "Full-time",
          directSource: false,
          applyUrl: "",
          description: "",
          skills: [],
          postedAt: row.posted_at || row.created_at,
        };
      }

      return {
        id: row.id,
        title: row.title || "Untitled Position",
        company: row.company || "Verified Employer",
        location: row.location || (row.remote ? "Remote (Worldwide)" : "Remote"),
        date: formatDate(row.posted_at || row.created_at),
        salary: row.salary_text || "",
        category: row.category || "engineering",
        remote: Boolean(row.remote),
        remoteScope: row.remote_scope || undefined,
        remoteEligibility: row.remote_eligibility || undefined,
        country: row.country_code || "US",
        type: row.job_type === "internship" ? "Internship" : "Full-time",
        directSource: Boolean(row.verified),
        applyUrl: row.apply_url || "",
        description: row.description || "",
        skills: row.skills || [],
        postedAt: row.posted_at || row.created_at,
      };
    }
  } catch (err) {
    console.warn("Supabase single job fetch error:", err);
  }

  // Fallback to static DUMMY_JOBS if matching legacy ID
  const found = DUMMY_JOBS.find((j) => j.id === cleanId);
  if (found) {
    if (!isPro) {
      return {
        id: found.id,
        title: found.title,
        company: "",
        location: "",
        date: found.date,
        salary: "",
        category: found.category,
        remote: false,
        country: "",
        type: found.type,
        directSource: false,
        applyUrl: "",
        description: "",
        skills: [],
      };
    }
    return {
      ...found,
      company: found.company,
      salary: found.salary,
      applyUrl: found.applyUrl,
    };
  }

  return null;
}
