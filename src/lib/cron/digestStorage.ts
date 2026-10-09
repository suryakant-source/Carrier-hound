import { createClient } from "../supabase/client";
import { getCandidateProfile } from "../resume/storage";
import { computeFitDiagnostics } from "../matcher/scoring";
import { getLiveJobs } from "../jobs/service";
import { getProAccessStatus } from "../billing/subscription";

export interface DigestMatchItem {
  jobId: string;
  title: string;
  company: string;
  location: string;
  salaryText?: string;
  applyUrl: string;
  score: number;
  scoreGrade: string;
  matchedSkills: string[];
  missingSkills: string[];
}

export interface DailyDigestQueue {
  digestDate: string;
  matches: DigestMatchItem[];
  isQueuedByCron: boolean;
}

/**
 * Loads today's daily digest for the authenticated user, or computes top matches locally
 * using the live Supabase dataset and consistent Pro field-level gating.
 */
export async function getTodayDigest(): Promise<DailyDigestQueue> {
  const todayStr = new Date().toISOString().split("T")[0];
  const { isPro } = await getProAccessStatus();

  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data, error } = await supabase
        .from("daily_digests")
        .select("*")
        .eq("user_id", user.id)
        .order("digest_date", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data && Array.isArray(data.matched_jobs) && data.matched_jobs.length > 0) {
        // Enforce consistent payload-level Pro gating on stored matches
        const sanitizedMatches: DigestMatchItem[] = data.matched_jobs.map((item: any) => ({
          jobId: item.jobId || item.id,
          title: item.title,
          company: isPro ? (item.company || "Verified Employer") : "Confidential Employer",
          location: item.location || "Remote",
          salaryText: isPro ? (item.salaryText || item.salary || "") : "",
          applyUrl: isPro ? (item.applyUrl || "") : "",
          score: item.score ?? 50,
          scoreGrade: item.scoreGrade || "moderate",
          matchedSkills: item.matchedSkills || [],
          missingSkills: item.missingSkills || [],
        }));

        return {
          digestDate: data.digest_date,
          matches: sanitizedMatches,
          isQueuedByCron: true,
        };
      }
    }
  } catch (e) {
    console.warn("Could not retrieve remote digest, computing from live jobs:", e);
  }

  // Fallback: Compute top matches against candidate profile only if confirmed
  try {
    const profile = await getCandidateProfile();
    if (!profile || !profile.confirmedAt) {
      return {
        digestDate: todayStr,
        matches: [],
        isQueuedByCron: false,
      };
    }

    // Use live verified jobs from the exact same source as /jobs
    const liveRes = await getLiveJobs({ page: 1, pageSize: 50, isPro });
    const matches: DigestMatchItem[] = [];

    for (const job of liveRes.jobs) {
      const diagnostics = computeFitDiagnostics(profile, {
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        remote_scope: job.remoteScope || (job.remote ? "worldwide" : undefined),
        category: job.category,
        skills: job.skills,
        salary_text: job.salary,
      });

      if (diagnostics.score >= 50) {
        matches.push({
          jobId: job.id,
          title: job.title,
          company: isPro ? job.company : "Confidential Employer",
          location: job.location || "Remote",
          salaryText: isPro ? job.salary : "",
          applyUrl: isPro ? job.applyUrl : "",
          score: diagnostics.score,
          scoreGrade: diagnostics.scoreGrade,
          matchedSkills: diagnostics.matchedSkills,
          missingSkills: diagnostics.missingSkills,
        });
      }
    }

    matches.sort((a, b) => b.score - a.score);

    return {
      digestDate: todayStr,
      matches: matches.slice(0, 5),
      isQueuedByCron: false,
    };
  } catch (e) {
    return {
      digestDate: todayStr,
      matches: [],
      isQueuedByCron: false,
    };
  }
}
