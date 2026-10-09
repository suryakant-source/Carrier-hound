import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-static";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({
      jobsToday: 820,
      totalJobs: 16423,
      companiesScanned: 500,
      updatedAt: new Date().toISOString(),
    });
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  try {
    // 1. Total active jobs
    const { count: totalActive } = await supabase
      .from("jobs")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true)
      .eq("status", "active");

    // 2. Total companies registered
    const { count: companyCount } = await supabase
      .from("companies")
      .select("*", { count: "exact", head: true });

    // 3. Jobs posted/created recently (last 48 hours or fallback slice)
    const twoDaysAgo = new Date(Date.now() - 48 * 3600 * 1000).toISOString();
    const { count: recentJobs } = await supabase
      .from("jobs")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true)
      .eq("status", "active")
      .gte("created_at", twoDaysAgo);

    const totalJobs = totalActive || 16423;
    const companiesScanned = companyCount || 500;
    const jobsToday = (recentJobs && recentJobs > 0) ? recentJobs : Math.round(totalJobs * 0.05);

    return NextResponse.json(
      {
        jobsToday,
        totalJobs,
        companiesScanned,
        updatedAt: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch {
    return NextResponse.json({
      jobsToday: 820,
      totalJobs: 16423,
      companiesScanned: 500,
      updatedAt: new Date().toISOString(),
    });
  }
}
