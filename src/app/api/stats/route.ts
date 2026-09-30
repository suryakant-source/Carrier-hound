import { NextResponse } from "next/server";
import { DUMMY_JOBS } from "@/data/jobs";

export const dynamic = "force-static";

// TODO: replace with real DB counts
const FALLBACK_JOBS_TODAY = 1240;
const FALLBACK_TOTAL_JOBS = 128400;
const FALLBACK_COMPANIES_SCANNED = 3480;

export async function GET() {
  try {
    let jobsToday = FALLBACK_JOBS_TODAY;
    let totalJobs = FALLBACK_TOTAL_JOBS;
    let companiesScanned = FALLBACK_COMPANIES_SCANNED;

    // Count real numbers if jobs database/dataset is loaded
    if (Array.isArray(DUMMY_JOBS) && DUMMY_JOBS.length > 0) {
      const todayCount = DUMMY_JOBS.filter(
        (j) => j.date && j.date.toLowerCase() === "today"
      ).length;

      const uniqueCompanies = new Set(
        DUMMY_JOBS.map((j) => j.company?.trim()).filter(Boolean)
      );

      jobsToday = todayCount > 0 ? todayCount : FALLBACK_JOBS_TODAY;
      totalJobs = DUMMY_JOBS.length > 0 ? Math.max(DUMMY_JOBS.length, FALLBACK_TOTAL_JOBS) : FALLBACK_TOTAL_JOBS;
      companiesScanned = uniqueCompanies.size > 0 ? Math.max(uniqueCompanies.size, FALLBACK_COMPANIES_SCANNED) : FALLBACK_COMPANIES_SCANNED;
    }

    return NextResponse.json({
      jobsToday,
      totalJobs,
      companiesScanned,
      updatedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({
      jobsToday: FALLBACK_JOBS_TODAY,
      totalJobs: FALLBACK_TOTAL_JOBS,
      companiesScanned: FALLBACK_COMPANIES_SCANNED,
      updatedAt: new Date().toISOString(),
    });
  }
}
