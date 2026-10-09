"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import GuideHeader from "@/components/GuideHeader";
import Footer from "@/components/Footer";
import { getAuthUser } from "@/lib/auth/session";
import { getUserPreferences } from "@/lib/auth/session";
import { UserPreferences } from "@/lib/auth/types";
import { getCandidateProfile } from "@/lib/resume/storage";
import { CandidateProfile } from "@/lib/resume/types";
import { getTrackedApplications, addApplicationToTracker } from "@/lib/tracker/storage";
import { TrackedApplication } from "@/lib/tracker/types";
import MatchScoreBadge from "@/components/matcher/MatchScoreBadge";
import { getLiveJobs, LiveJob } from "@/lib/jobs/service";
import { getTodayDigest, DailyDigestQueue, DigestMatchItem } from "@/lib/cron/digestStorage";
import { getProAccessStatus } from "@/lib/billing/subscription";
import type { User } from "@supabase/supabase-js";
import { downloadAtsResumeDocx } from "@/lib/resume/tailor";
import {
  Sparkles,
  ArrowRight,
  Briefcase,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  Calendar,
  Building,
  MapPin,
  ExternalLink,
  Plus,
  RefreshCw,
  Target,
  ChevronRight,
  ChevronDown,
  HelpCircle,
  X,
  Lock,
  Globe,
  Download,
} from "lucide-react";
import { toast } from "react-toastify";

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [candidate, setCandidate] = useState<CandidateProfile | null>(null);
  const [applications, setApplications] = useState<TrackedApplication[]>([]);
  const [digest, setDigest] = useState<DailyDigestQueue | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [fallbackLiveJobs, setFallbackLiveJobs] = useState<LiveJob[]>([]);
  const [lastSyncTime, setLastSyncTime] = useState<Date>(() => new Date());

  const formatSyncTime = (date: Date): string => {
    const diffSecs = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diffSecs < 60) return "Just now";
    const diffMins = Math.floor(diffSecs / 60);
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours}h ago`;
  };

  const hasConfirmedResume = Boolean(candidate && candidate.confirmedAt);
  const [isPro, setIsPro] = useState(false);

  const [walkthroughExpanded, setWalkthroughExpanded] = useState(false);

  // Check auth and load user data without false flash
  useEffect(() => {
    getAuthUser().then((authUser) => {
      if (!authUser) {
        router.replace("/login?next=/dashboard");
        return;
      }
      setUser(authUser);

      Promise.all([
        getProAccessStatus(),
        getUserPreferences(authUser.id),
        getCandidateProfile(),
        getTrackedApplications(),
        getTodayDigest(),
      ])
        .then(([subRes, p, cp, apps, d]) => {
          setIsPro(subRes.isPro);
          setPreferences(p);
          if (cp && cp.confirmedAt) {
            setCandidate(cp);
          } else {
            setCandidate(null);
          }
          setApplications(apps);
          setDigest(d);

          if (!d?.matches || d.matches.length === 0) {
            getLiveJobs({ page: 1, pageSize: 6, isPro: subRes.isPro }).then((res) => {
              setFallbackLiveJobs(res.jobs);
            });
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Dashboard data load error", err);
          setLoading(false);
        });

      // Check first-time walkthrough dismiss state
      if (typeof window !== "undefined") {
        const dismissed = localStorage.getItem("careermonke_walkthrough_dismissed");
        if (!dismissed) {
          setShowWalkthrough(true);
        }
      }
    });
  }, [router]);

  const handleDismissWalkthrough = () => {
    setShowWalkthrough(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("careermonke_walkthrough_dismissed", "true");
    }
  };

  const handleRunScan = async () => {
    setIsScanning(true);
    try {
      const d = await getTodayDigest();
      setDigest(d);
      setLastSyncTime(new Date());
      toast.success("AI ATS scan completed! Surfaced latest matching requisitions.");
    } catch (e) {
      toast.error("Could not complete scan.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleSaveToTracker = async (job: {
    id?: string;
    jobId?: string;
    title: string;
    company: string;
    location?: string;
    salary?: string;
    applyUrl?: string;
  }) => {
    try {
      await addApplicationToTracker({
        jobId: job.id || job.jobId || `job-${Date.now()}`,
        title: job.title,
        company: job.company,
        location: job.location,
        salaryText: job.salary,
        applyUrl: job.applyUrl,
        stage: "saved",
      });
      const updated = await getTrackedApplications();
      setApplications(updated);
      toast.success(`Saved "${job.title}" to your Applications Tracker.`);
    } catch (e) {
      toast.error("Failed to save job to tracker.");
    }
  };

  // Pipeline counts
  const stageCounts = {
    saved: applications.filter((a) => a.stage === "saved").length,
    applied: applications.filter((a) => a.stage === "applied").length,
    interview: applications.filter((a) => a.stage === "interview").length,
    offer: applications.filter((a) => a.stage === "offer").length,
    rejected: applications.filter((a) => a.stage === "rejected").length,
  };

  const interviews = applications.filter(
    (a) => a.stage === "interview" || a.followUpAt
  );

  // Relevant listings: from digest or live top verified roles
  const relevantListings = digest?.matches && digest.matches.length > 0
    ? digest.matches.slice(0, 6).map((m: DigestMatchItem) => ({
        jobId: m.jobId,
        title: m.title,
        company: isPro ? m.company : "Confidential Employer",
        location: m.location,
        score: hasConfirmedResume ? m.score : 0,
        matchedSkills: m.matchedSkills,
        missingSkills: m.missingSkills,
        applyUrl: isPro ? m.applyUrl : "",
      }))
    : fallbackLiveJobs.map((j) => ({
        jobId: j.id,
        title: j.title,
        company: j.company,
        location: j.location,
        score: 0,
        matchedSkills: [],
        missingSkills: [],
        applyUrl: isPro ? j.applyUrl : "",
      }));

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <GuideHeader />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-semibold text-slate-500">Loading your CareerMonke dashboard…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#09090B] flex flex-col">
      <GuideHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* ========================================================================= */}
        {/* COMPACT FIRST-TIME SETUP GUIDE (Collapsible)                              */}
        {/* ========================================================================= */}
        {showWalkthrough && (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-4 shadow-sm relative animate-fadeIn space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-white/20">
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                </span>
                <span className="text-xs sm:text-sm font-bold">Quick Start Guide: CareerMonke 4-Step Setup</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setWalkthroughExpanded(!walkthroughExpanded)}
                  className="text-xs text-white/90 hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg transition flex items-center gap-1 cursor-pointer"
                >
                  <span>{walkthroughExpanded ? "Collapse" : "Expand"}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${walkthroughExpanded ? "rotate-180" : ""}`} />
                </button>
                <button
                  type="button"
                  onClick={handleDismissWalkthrough}
                  className="text-white/70 hover:text-white transition p-1 cursor-pointer"
                  title="Dismiss guide"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {walkthroughExpanded && (
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 text-xs border-t border-white/15 animate-fadeIn">
                <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                  <span className="font-bold block text-white mb-0.5">1. Target Preferences</span>
                  <span className="text-white/80">Filter positions by seniority, remote scope, and salary.</span>
                </div>
                <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                  <span className="font-bold block text-white mb-0.5">2. Confirmed Resume</span>
                  <span className="text-white/80">Deterministic fact extraction without fake hallucinations.</span>
                </div>
                <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                  <span className="font-bold block text-white mb-0.5">3. Inspect & Tailor</span>
                  <span className="text-white/80">View fit diagnostics & 1-click tailored ATS exports.</span>
                </div>
                <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                  <span className="font-bold block text-white mb-0.5">4. Track Applications</span>
                  <span className="text-white/80">Apply directly on company portals and manage pipeline.</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TWO PROMINENT HERO FEATURE CARDS: ATS RESUME & JOB FIT SCORE              */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Hero Card 1: ATS Resume */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-2xs flex flex-col justify-between space-y-4 relative overflow-hidden group hover:border-blue-300 transition">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                      AI ATS-Friendly Resume
                    </h2>
                    <p className="text-xs text-slate-500">Deterministic fact verification & clean exports</p>
                  </div>
                </div>

                {hasConfirmedResume ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified & Confirmed</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Needs Upload</span>
                  </span>
                )}
              </div>

              {hasConfirmedResume && candidate ? (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span>{candidate.name}</span>
                    <span className="text-[11px] font-normal text-slate-500 truncate max-w-[200px]">
                      {candidate.headline || "Software Engineer"}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] text-slate-600">
                    <span><strong>{candidate.skills?.length || 0}</strong> verified skills</span>
                    <span>•</span>
                    <span><strong>{candidate.experience?.length || 0}</strong> career positions</span>
                    <span>•</span>
                    <span>Single-column ATS format</span>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-100 text-xs text-amber-900 leading-relaxed">
                  Upload your existing PDF or DOCX resume. We extract confirmed skills and career timelines without hallucinations so every job score is 100% honest.
                </div>
              )}
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              {hasConfirmedResume && candidate ? (
                <>
                  <button
                    type="button"
                    onClick={() => downloadAtsResumeDocx(candidate)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-2xs transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export ATS Word (.docx)</span>
                  </button>
                  <Link
                    href="/resume"
                    className="inline-flex items-center gap-1 px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition"
                  >
                    <span>Edit Facts</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </>
              ) : (
                <Link
                  href="/resume"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-xs transition cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Upload & Confirm Facts</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>

          {/* Hero Card 2: Job Fit Score */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-2xs flex flex-col justify-between space-y-4 relative overflow-hidden group hover:border-blue-300 transition">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                      AI Job Fit Scoring
                    </h2>
                    <p className="text-xs text-slate-500">Real-time skill diagnostics & gap breakdown</p>
                  </div>
                </div>

                {hasConfirmedResume ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>Active Diagnostics</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 shrink-0">
                    <span>Awaiting Resume</span>
                  </span>
                )}
              </div>

              {hasConfirmedResume ? (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1 text-xs text-slate-700 leading-relaxed">
                  <p>
                    Every requisition is scored deterministically against your confirmed skills, years of experience, and location preferences—never black-box hallucinations.
                  </p>
                  <p className="text-[11px] text-blue-700 font-semibold pt-0.5">
                    Pick any requisition below or in the Jobs feed to view why you fit and exact gaps to address.
                  </p>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 leading-relaxed">
                  Match scores are locked until your confirmed facts exist. We never display fake scores against sample data.
                </div>
              )}
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              <Link
                href="/jobs"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-2xs transition cursor-pointer"
              >
                <Target className="w-3.5 h-3.5 text-blue-300" />
                <span>Pick a Job to Score</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              {hasConfirmedResume && (
                <a
                  href="#daily-matches"
                  className="inline-flex items-center gap-1 px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition"
                >
                  <span>See Today&apos;s Matches</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PIPELINE COUNTERS & UPCOMING INTERVIEWS ROW                               */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Applications Pipeline Snapshot (2 cols on large) */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">Applications Pipeline</h3>
                <p className="text-xs text-slate-500">Tracked direct applications across all stages</p>
              </div>

              <Link
                href="/tracker"
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <span>Open Kanban Board</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-5 gap-2 sm:gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-lg sm:text-2xl font-black text-slate-900 block">{stageCounts.saved}</span>
                <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase">Saved</span>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                <span className="text-lg sm:text-2xl font-black text-blue-700 block">{stageCounts.applied}</span>
                <span className="text-[10px] sm:text-xs font-semibold text-blue-700 uppercase">Applied</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                <span className="text-lg sm:text-2xl font-black text-amber-700 block">{stageCounts.interview}</span>
                <span className="text-[10px] sm:text-xs font-semibold text-amber-700 uppercase">Interview</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-lg sm:text-2xl font-black text-emerald-700 block">{stageCounts.offer}</span>
                <span className="text-[10px] sm:text-xs font-semibold text-emerald-700 uppercase">Offer</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-lg sm:text-2xl font-black text-slate-400 block">{stageCounts.rejected}</span>
                <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase">Archive</span>
              </div>
            </div>
          </div>

          {/* Upcoming Follow-ups & Interviews Widget */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  <span>Upcoming Follow-ups</span>
                </span>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                  {interviews.length} Scheduled
                </span>
              </div>

              {interviews.length === 0 ? (
                <div className="py-6 text-center space-y-1">
                  <Clock className="w-6 h-6 text-slate-300 mx-auto" />
                  <p className="text-xs font-semibold text-slate-700">No active interviews scheduled</p>
                  <p className="text-[11px] text-slate-400">
                    When you move jobs to &quot;Interview&quot; in the tracker, reminders appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 pt-2">
                  {interviews.slice(0, 2).map((item) => (
                    <div key={item.id} className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1">
                      <div className="font-bold text-slate-900">{item.title}</div>
                      <div className="text-[11px] text-slate-500 flex items-center justify-between">
                        <span>{item.company}</span>
                        <span className="text-amber-700 font-semibold">Stage: {item.stage}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/tracker"
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center justify-between pt-2 border-t border-slate-100"
            >
              <span>Manage all application follow-ups</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TODAY'S RELEVANT MATCHES & DAILY DIGEST SCAN                              */}
        {/* ========================================================================= */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {hasConfirmedResume ? "Today's Verified Match Feed" : "Relevant Direct Requisitions"}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  Last Sync: {formatSyncTime(lastSyncTime)}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {hasConfirmedResume
                  ? "Deterministic match scores computed against your confirmed resume facts."
                  : "Curated based on your target role preferences. Upload resume to calculate fit scores."}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={handleRunScan}
                disabled={isScanning}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-bold transition shadow-2xs cursor-pointer disabled:opacity-60"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? "animate-spin" : ""}`} />
                <span>{isScanning ? "Scanning..." : "⚡ Run AI Match Scan"}</span>
              </button>

              <Link
                href="/jobs"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-2xs"
              >
                <span>View All Jobs</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Job Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {relevantListings.map((job: any) => (
              <div
                key={job.jobId}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs hover:shadow-md transition space-y-3 flex flex-col justify-between group"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/jobs/detail?id=${encodeURIComponent(job.jobId || job.id)}`}
                      className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1"
                    >
                      {job.title}
                    </Link>

                    {hasConfirmedResume ? (
                      <MatchScoreBadge
                        job={{
                          id: job.jobId,
                          title: job.title,
                          company: job.company,
                          location: job.location,
                        }}
                        size="xs"
                      />
                    ) : (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                        Target Match
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                    <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className={!isPro ? "filter blur-[5px] select-none text-slate-800" : "font-semibold"}>
                      {job.company}
                    </span>
                    {!isPro && (
                      <span className="text-[10px] font-bold text-blue-600 ml-1">
                        (Pro)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{job.location || "Remote / Global"}</span>
                  </div>

                  {job.matchedSkills && job.matchedSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {job.matchedSkills.slice(0, 3).map((skill: string) => (
                        <span key={skill} className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleSaveToTracker(job)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Save to Tracker</span>
                  </button>

                  <Link
                    href={`/jobs/detail?id=${encodeURIComponent(job.jobId)}`}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-0.5"
                  >
                    <span>Inspect</span>
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* QUICK ACTION TILES                                                        */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <Link
            href="/jobs"
            className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-xs transition flex items-center gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-slate-900">Browse Full Job Feed</div>
              <div className="text-[11px] text-slate-500">Filter all verified ATS requisitions</div>
            </div>
          </Link>

          <Link
            href="/resume"
            className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-xs transition flex items-center gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-slate-900">ATS Resume & Tailor</div>
              <div className="text-[11px] text-slate-500">Review facts & generate clean exports</div>
            </div>
          </Link>

          <Link
            href="/radar"
            className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-xs transition flex items-center gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-slate-900">3D Job Radar</div>
              <div className="text-[11px] text-slate-500">Explore global tech hiring clusters</div>
            </div>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
