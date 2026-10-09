"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import GuideHeader from "@/components/GuideHeader";
import Footer from "@/components/Footer";
import { getLiveJobById, LiveJob } from "@/lib/jobs/service";
import { getAuthUser } from "@/lib/auth/session";
import { getCandidateProfile } from "@/lib/resume/storage";
import { CandidateProfile } from "@/lib/resume/types";
import { computeFitDiagnostics, FitDiagnosticsResult } from "@/lib/matcher/scoring";
import { addApplicationToTracker, getTrackedApplications, removeApplicationFromTracker } from "@/lib/tracker/storage";
import PaywallModal from "@/components/PaywallModal";
import CoverLetterModal from "@/components/resume/CoverLetterModal";
import FitDiagnosticsModal from "@/components/matcher/FitDiagnosticsModal";
import type { User } from "@supabase/supabase-js";
import {
  ArrowLeft,
  Building,
  MapPin,
  Calendar,
  DollarSign,
  Briefcase,
  Globe,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Lock,
  BookmarkPlus,
  FileText,
  Sparkles,
  AlertCircle,
  Clock,
  HelpCircle,
  Share2
} from "lucide-react";
import { toast } from "react-toastify";

function getResolvedJobId(searchParams: URLSearchParams | null): string {
  const queryId = searchParams?.get("id");
  if (queryId && queryId.trim()) return queryId.trim();

  if (typeof window !== "undefined") {
    const urlParams = new URLSearchParams(window.location.search);
    const winId = urlParams.get("id");
    if (winId && winId.trim()) return winId.trim();

    const pathname = window.location.pathname;
    const match = pathname.match(/^\/jobs\/([^/?#]+)/);
    if (match && match[1] && match[1] !== "detail") {
      return decodeURIComponent(match[1]).trim();
    }
  }

  return "";
}

function JobDetailInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [user, setUser] = useState<User | null>(null);
  const [candidate, setCandidate] = useState<CandidateProfile | null>(null);
  const [job, setJob] = useState<LiveJob | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals & States
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [isCoverLetterOpen, setIsCoverLetterOpen] = useState(false);
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);
  const [showApplyConfirmModal, setShowApplyConfirmModal] = useState(false);
  const [isSavedInTracker, setIsSavedInTracker] = useState(false);

  useEffect(() => {
    const resolvedId = getResolvedJobId(searchParams);

    // 1. Load user & profile
    getAuthUser().then((u) => {
      setUser(u);
      const isPro = u?.user_metadata?.is_pro === true;

      // 2. Fetch live job from Supabase with payload-level Pro gating
      if (resolvedId) {
        getLiveJobById(resolvedId, isPro).then((foundJob) => {
          setJob(foundJob);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    getCandidateProfile().then((cp) => {
      if (cp && cp.confirmedAt) {
        setCandidate(cp);
      } else {
        setCandidate(null);
      }
    });

    // 3. Check if already tracked
    if (resolvedId) {
      getTrackedApplications().then((apps) => {
        const tracked = apps.some((a) => a.jobId === resolvedId);
        setIsSavedInTracker(tracked);
      });
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <GuideHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // Not found or closed job state
  if (!job) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <GuideHeader />
        <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Job Not Found or Requisition Closed</h1>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            This opening may have been unlisted or filled by the employer&apos;s ATS portal.
          </p>
          <div className="pt-4">
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-xs hover:bg-blue-700 transition"
            >
              <span>Browse Active Verified Jobs</span>
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isPro = user?.user_metadata?.is_pro === true;
  const diagnostics: FitDiagnosticsResult | null = candidate
    ? computeFitDiagnostics(candidate, {
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        salary_text: job.salary,
      })
    : null;

  const handleApplyClick = () => {
    if (!isPro) {
      setIsPaywallOpen(true);
      return;
    }

    // Open employer ATS in new tab
    if (job.applyUrl) {
      window.open(job.applyUrl, "_blank", "noopener,noreferrer");
      // Prompt user with confirmation modal
      setShowApplyConfirmModal(true);
    }
  };

  const handleConfirmApplication = async (status: "applied" | "saved") => {
    setShowApplyConfirmModal(false);
    try {
      await addApplicationToTracker({
        jobId: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        salaryText: job.salary,
        applyUrl: job.applyUrl,
        stage: status,
        appliedAt: status === "applied" ? new Date().toISOString() : undefined,
      });
      setIsSavedInTracker(true);
      if (status === "applied") {
        toast.success(`Application confirmed! Moved "${job.title}" to Applied stage.`);
      } else {
        toast.info(`Saved "${job.title}" to your Applications pipeline.`);
      }
    } catch (e) {
      toast.error("Could not update tracker.");
    }
  };

  const handleSaveOnly = async () => {
    if (!user) {
      toast.info("Please sign up or sign in to save jobs to your tracker.");
      const currentUrl = typeof window !== "undefined" ? window.location.pathname + window.location.search : `/jobs/detail?id=${job.id}`;
      router.push(`/signup?next=${encodeURIComponent(currentUrl)}`);
      return;
    }

    if (isSavedInTracker) {
      try {
        await removeApplicationFromTracker(job.id);
        setIsSavedInTracker(false);
        toast.info(`Removed "${job.title}" from Applications.`);
      } catch (e) {
        toast.error("Could not remove from tracker.");
      }
      return;
    }

    try {
      await addApplicationToTracker({
        jobId: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        salaryText: job.salary,
        applyUrl: job.applyUrl,
        stage: "saved",
      });
      setIsSavedInTracker(true);
      toast.success(`Saved "${job.title}" to Applications.`);
    } catch (e) {
      toast.error("Could not save to tracker.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#09090B] flex flex-col">
      <GuideHeader />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Jobs</span>
          </Link>

          <span className="text-[11px] font-bold text-slate-400">
            Requisition ID: {job.id.slice(0, 16)}…
          </span>
        </div>

        {/* ========================================================================= */}
        {/* 1. HEADER CARD: Title, Company, Eligibility, Source                       */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  {job.category || "Engineering"}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {job.type || "Full-time"}
                </span>
                {job.remote && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Worldwide Remote Eligible
                  </span>
                )}
              </div>

              <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {job.title}
              </h1>

              {/* Company & Location (with Pro access gate) */}
              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-600 font-medium">
                <div className="flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-slate-400 shrink-0" />
                  <span
                    onClick={!isPro ? () => setIsPaywallOpen(true) : undefined}
                    className={
                      !isPro
                        ? "filter blur-[5px] select-none text-slate-800 cursor-pointer font-bold"
                        : "font-bold text-slate-900"
                    }
                    title={!isPro ? "Click to unlock company with Pro" : undefined}
                  >
                    {job.company}
                  </span>
                  {!isPro && (
                    <button
                      type="button"
                      onClick={() => setIsPaywallOpen(true)}
                      className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 cursor-pointer ml-1"
                    >
                      <Lock className="w-3 h-3" />
                      <span>Unlock (Pro)</span>
                    </button>
                  )}
                </div>

                <span>•</span>

                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{job.location || "Remote / Global"}</span>
                </div>

                {job.salary && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <DollarSign className="w-4 h-4 shrink-0" />
                      <span>{job.salary}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Direct Ingestion Badge */}
            <div className="sm:text-right shrink-0 space-y-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Verified Direct ATS Feed</span>
              </span>
              <p className="text-[10px] text-slate-400">Scraped from official career portal</p>
            </div>
          </div>

          {/* Action Ribbon */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleApplyClick}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs sm:text-sm font-bold shadow-xs transition cursor-pointer"
              >
                <span>{isPro ? "Apply on Employer Site" : "Unlock Direct Apply (Pro)"}</span>
                <ExternalLink className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleSaveOnly}
                className={`inline-flex items-center gap-1.5 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold border transition cursor-pointer ${
                  isSavedInTracker
                    ? "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <BookmarkPlus className="w-4 h-4" />
                <span>{isSavedInTracker ? "Remove from Saved" : "Save Job"}</span>
              </button>
            </div>

            {/* AI Tailoring Secondary Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (!candidate) {
                    toast.info("Please upload your resume first to generate tailored cover letters.");
                    router.push("/resume");
                    return;
                  }
                  setIsCoverLetterOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-blue-700 text-xs font-bold transition cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Prepare Cover Letter</span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. FIT DIAGNOSTICS & GAP ANALYSIS SECTION                                 */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Fit Diagnostics & Gap Analysis
              </h2>
            </div>

            {diagnostics && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {diagnostics.score}% Deterministic Match
              </span>
            )}
          </div>

          {candidate ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-2 text-xs">
                <span className="font-bold text-emerald-900 block text-xs">
                  ✓ Why You Fit (Matched Skills)
                </span>
                <p className="text-emerald-800 text-[11px]">
                  Skills from your confirmed resume found in this requisition:
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {diagnostics?.matchedSkills.length ? (
                    diagnostics.matchedSkills.map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded bg-white text-emerald-800 font-semibold border border-emerald-200 text-[11px]">
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 italic">No specific direct skill overlap detected</span>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100 space-y-2 text-xs">
                <span className="font-bold text-amber-900 block text-xs">
                  ⚠ Missing Skills (Gaps to Address)
                </span>
                <p className="text-amber-800 text-[11px]">
                  Target skills mentioned in the job description that were not flagged in your resume facts:
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {diagnostics?.missingSkills.length ? (
                    diagnostics.missingSkills.map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded bg-white text-amber-800 font-semibold border border-amber-200 text-[11px]">
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-emerald-700 font-semibold">Zero critical skill gaps detected!</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2">
              <p className="text-xs text-slate-600">
                Connect your resume to unlock real-time match percentage and skill gap diagnostics for this role.
              </p>
              <Link
                href="/resume"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800"
              >
                <span>Upload & Confirm Resume Facts →</span>
              </Link>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 3. FULL REQUISITION DESCRIPTION                                           */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            About the Role & Responsibilities
          </h2>

          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3">
            <p>
              This position was retrieved directly from the employer&apos;s verified career portal. Below is the published job overview and primary scope:
            </p>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2 font-mono text-xs text-slate-800">
              <p>• Category: {job.category || "General Tech"}</p>
              <p>• Location Eligibility: {job.location || "Remote Worldwide"}</p>
              <p>• Employment Type: {job.type || "Full-Time Direct Hire"}</p>
              <p>• Reported Compensation: {isPro && job.salary ? job.salary : "Locked (Pro Membership)"}</p>
            </div>
            <p>
              Candidates are encouraged to tailor their application to address the core responsibilities outlined above and apply directly through the company&apos;s ATS link.
            </p>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* 4. POST-APPLY CONFIRMATION MODAL ("Did you submit it?")                   */}
      {/* ========================================================================= */}
      {showApplyConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Did you submit your application?
              </h3>
              <p className="text-xs text-slate-500">
                Opening the company portal doesn&apos;t automatically record an application. If you finalized the employer&apos;s form, we will update your pipeline.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
              <button
                type="button"
                onClick={() => handleConfirmApplication("applied")}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition shadow-xs cursor-pointer"
              >
                Yes, Mark as Applied
              </button>

              <button
                type="button"
                onClick={() => handleConfirmApplication("saved")}
                className="w-full py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm transition cursor-pointer"
              >
                Not yet, keep Saved
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Paywall Modal */}
      <PaywallModal
        open={isPaywallOpen}
        onOpenChange={setIsPaywallOpen}
        user={user}
        featureTitle="Unlock Direct Company ATS Applications"
      />

      {/* Cover Letter Modal */}
      {isCoverLetterOpen && candidate && (
        <CoverLetterModal
          open={isCoverLetterOpen}
          onOpenChange={setIsCoverLetterOpen}
          candidate={candidate}
          job={{
            title: job.title,
            company: job.company,
            description: `${job.title} at ${job.company} (${job.location}, ${job.category}).`,
          }}
        />
      )}

      <Footer />
    </div>
  );
}

export default function JobDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex flex-col">
          <GuideHeader />
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      }
    >
      <JobDetailInner />
    </Suspense>
  );
}
