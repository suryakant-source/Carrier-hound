import { createClient } from "../supabase/client";
import { getCandidateProfile } from "../resume/storage";
import { computeFitDiagnostics } from "../matcher/scoring";
import { DUMMY_JOBS } from "@/data/jobs";

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
 * Loads today's daily digest for the authenticated user, or computes top matches locally.
 */
export async function getTodayDigest(): Promise<DailyDigestQueue> {
  const todayStr = new Date().toISOString().split("T")[0];

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
        .single();

      if (!error && data && Array.isArray(data.matched_jobs) && data.matched_jobs.length > 0) {
        return {
          digestDate: data.digest_date,
          matches: data.matched_jobs,
          isQueuedByCron: true,
        };
      }
    }
  } catch (e) {}

  // Fallback: Compute top matches against candidate profile
  try {
    const profile = await getCandidateProfile();
    const matches: DigestMatchItem[] = [];

    for (const job of DUMMY_JOBS.slice(0, 40)) {
      const diagnostics = computeFitDiagnostics(profile, {
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        remote_scope: job.remote ? "worldwide" : undefined,
        category: job.category,
      });

      if (diagnostics.score >= 60) {
        matches.push({
          jobId: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          salaryText: job.salary,
          applyUrl: job.applyUrl,
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
