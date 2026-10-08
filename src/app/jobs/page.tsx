"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import GuideHeader from "@/components/GuideHeader";
import Footer from "@/components/Footer";
import CategoryPillBar from "@/components/CategoryPillBar";
import PaywallModal from "@/components/PaywallModal";
import MatchScoreBadge from "@/components/matcher/MatchScoreBadge";
import { DUMMY_JOBS, Job } from "@/data/jobs";
import { getAuthUser, getUserPreferences } from "@/lib/auth/session";
import { getCandidateProfile } from "@/lib/resume/storage";
import { CandidateProfile } from "@/lib/resume/types";
import { UserPreferences } from "@/lib/auth/types";
import { addApplicationToTracker, getTrackedApplications } from "@/lib/tracker/storage";
import type { User } from "@supabase/supabase-js";
import {
  Search,
  Filter,
  MapPin,
  Building,
  DollarSign,
  BookmarkPlus,
  ArrowRight,
  Lock,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Check
} from "lucide-react";
import { toast } from "react-toastify";

function JobsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL Query Params
  const querySearch = searchParams.get("search") || "";
  const queryCategory = searchParams.get("category") || searchParams.get("categories") || "";
  const queryRemote = searchParams.get("remote") === "true";

  // Active Tab: 'foryou' | 'all' | 'saved'
  const [activeTab, setActiveTab] = useState<"foryou" | "all" | "saved">("all");

  // Search & Filter state
  const [search, setSearch] = useState(querySearch);
  const [selectedCategory, setSelectedCategory] = useState(queryCategory);
  const [remoteOnly, setRemoteOnly] = useState(queryRemote);
  const [sortBy, setSortBy] = useState<"match" | "newest">("newest");

  // User state
  const [user, setUser] = useState<User | null>(null);
  const [candidate, setCandidate] = useState<CandidateProfile | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [page, setPage] = useState(1);
  const JOBS_PER_PAGE = 25;

  useEffect(() => {
    getAuthUser().then((u) => {
      setUser(u);
      if (u) {
        getUserPreferences(u.id).then((p) => {
          setPreferences(p);
          if (p.onboardingCompleted) {
            setActiveTab("foryou");
          }
        });
      }
    });

    getCandidateProfile().then((cp) => {
      if (cp && cp.confirmedAt) {
        setCandidate(cp);
        setSortBy("match");
      }
    });

    getTrackedApplications().then((apps) => {
      setSavedJobIds(apps.map((a) => a.jobId || ""));
    });
  }, []);

  const isPro = user?.user_metadata?.is_pro === true;
  const hasConfirmedResume = Boolean(candidate && candidate.confirmedAt);

  // Filtered Jobs
  const filteredJobs = useMemo(() => {
    return DUMMY_JOBS.filter((job) => {
      // 1. Tab filtering
      if (activeTab === "saved") {
        return savedJobIds.includes(job.id);
      }

      if (activeTab === "foryou") {
        if (preferences?.roles?.length) {
          const titleMatches = preferences.roles.some((r) =>
            job.title.toLowerCase().includes(r.toLowerCase())
          );
          if (!titleMatches && !preferences.categories.includes(job.category?.toLowerCase() || "")) {
            return false;
          }
        }
      }

      // 2. Search query filter
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(q);
        const matchesCompany = job.company.toLowerCase().includes(q);
        const matchesLocation = job.location.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCompany && !matchesLocation) return false;
      }

      // 3. Category filter
      if (selectedCategory && selectedCategory !== "all") {
        if (job.category?.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
      }

      // 4. Remote only filter
      if (remoteOnly && !job.remote) {
        return false;
      }

      return true;
    });
  }, [activeTab, search, selectedCategory, remoteOnly, savedJobIds, preferences]);

  const displayedJobs = useMemo(() => {
    return filteredJobs.slice(0, page * JOBS_PER_PAGE);
  }, [filteredJobs, page]);

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setRemoteOnly(false);
    setActiveTab("all");
    setPage(1);
  };

  const handleSaveJob = async (job: Job) => {
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
      setSavedJobIds((prev) => [...prev, job.id]);
      toast.success(`Saved "${job.title}" to your Applications Tracker.`);
    } catch (e) {
      toast.error("Could not save application.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#09090B] flex flex-col">
      <GuideHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Top Header & Search Ribbon */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Verified ATS Career Requisitions
              </h1>
              <p className="text-xs text-slate-500">
                Synchronized directly from 500+ employer Greenhouse, Lever, and Ashby portals.
              </p>
            </div>

            {/* Navigation Tabs: For you / All jobs / Saved */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-200/70 border border-slate-300/60 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("foryou");
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === "foryou"
                    ? "bg-white text-blue-600 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                For you
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("all");
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === "all"
                    ? "bg-white text-blue-600 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                All jobs
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("saved");
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                  activeTab === "saved"
                    ? "bg-white text-blue-600 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>Saved</span>
                {savedJobIds.length > 0 && (
                  <span className="text-[10px] bg-slate-200 px-1.5 py-0.2 rounded-full">
                    {savedJobIds.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search Bar & Secondary Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by job title, company, or keyword..."
                className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-blue-600 shadow-2xs"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Remote Only Toggle */}
            <button
              type="button"
              onClick={() => setRemoteOnly(!remoteOnly)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                remoteOnly
                  ? "bg-blue-50 border-blue-300 text-blue-700"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Remote Only</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500 font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs font-bold py-2 px-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-blue-600 cursor-pointer shadow-2xs"
              >
                <option value="newest">Newest First</option>
                <option value="match" disabled={!hasConfirmedResume}>
                  {hasConfirmedResume ? "Highest Fit Match" : "Highest Match (Requires Resume)"}
                </option>
              </select>
            </div>
          </div>

          {/* Category Pill Bar */}
          <CategoryPillBar
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => setSelectedCategory(cat === selectedCategory ? "" : (cat || ""))}
          />
        </div>

        {/* Results Count Banner */}
        <div className="flex items-center justify-between text-xs text-slate-500 pb-1 border-b border-slate-200">
          <span>
            Showing <strong className="text-slate-900">{displayedJobs.length}</strong> of {filteredJobs.length} verified jobs
          </span>

          {!hasConfirmedResume && (
            <Link href="/resume" className="text-blue-600 hover:underline font-semibold">
              + Upload resume to unlock match percentages
            </Link>
          )}
        </div>

        {/* ========================================================================= */}
        {/* JOBS LIST OR EMPTY ZERO RESULTS                                           */}
        {/* ========================================================================= */}
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-2xs">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">No jobs match your active filters</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try clearing your search terms or expanding your category preferences to see more openings.
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedJobs.map((job) => {
              const isSaved = savedJobIds.includes(job.id);
              return (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition space-y-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/jobs/${job.id}`}
                        className="text-base sm:text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors break-words"
                      >
                        {job.title}
                      </Link>

                      <MatchScoreBadge
                        job={{
                          id: job.id,
                          title: job.title,
                          company: job.company,
                          location: job.location,
                          salary_text: job.salary,
                          apply_url: job.applyUrl,
                        }}
                        size="xs"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-medium">
                      <div className="flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span
                          onClick={!isPro ? () => setIsPaywallOpen(true) : undefined}
                          className={
                            !isPro
                              ? "filter blur-[5px] select-none text-slate-800 cursor-pointer font-bold"
                              : "font-bold text-slate-900"
                          }
                          title={!isPro ? "Unlock company name with Pro" : undefined}
                        >
                          {job.company}
                        </span>
                        {!isPro && (
                          <span className="text-[10px] font-bold text-blue-600 ml-1">
                            (Pro)
                          </span>
                        )}
                      </div>

                      <span>•</span>

                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{job.location || "Remote Worldwide"}</span>
                      </div>

                      {job.salary && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                            <DollarSign className="w-3.5 h-3.5 shrink-0" />
                            <span>{job.salary}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                    <button
                      type="button"
                      onClick={() => handleSaveJob(job)}
                      disabled={isSaved}
                      className={`p-2 rounded-xl border text-xs font-bold transition cursor-pointer ${
                        isSaved
                          ? "bg-slate-100 text-slate-400 border-slate-200"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                      title={isSaved ? "Saved to Applications" : "Save to Tracker"}
                    >
                      <BookmarkPlus className="w-4 h-4" />
                    </button>

                    <Link
                      href={`/jobs/${job.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs"
                    >
                      <span>Inspect Job</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}

            {/* Load More Pagination */}
            {displayedJobs.length < filteredJobs.length && (
              <div className="pt-4 text-center">
                <button
                  type="button"
                  onClick={() => setPage((p) => p + 1)}
                  className="px-6 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition shadow-2xs cursor-pointer"
                >
                  Load More Verified Positions ({filteredJobs.length - displayedJobs.length} remaining)
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Paywall Modal */}
      <PaywallModal
        open={isPaywallOpen}
        onOpenChange={setIsPaywallOpen}
        user={user}
        featureTitle="Unlock Verified Company Names & Direct ATS Apply"
      />

      <Footer />
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense>
      <JobsPageInner />
    </Suspense>
  );
}
