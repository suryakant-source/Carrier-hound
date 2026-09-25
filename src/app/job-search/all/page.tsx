"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import BrandIcon from "@/components/BrandIcon";
import Modal from "@/components/Modal";
import AvatarStack from "@/components/AvatarStack";
import Chip from "@/components/Chip";
import PaywallModal from "@/components/PaywallModal";
import { DUMMY_JOBS, Job } from "@/data/jobs";
import { CATEGORIES } from "@/data/categories";
import { toast } from "react-toastify";
import {
  Search,
  Briefcase,
  FileText,
  LogIn,
  Clock,
  Layers,
  MapPin,
  ChevronLeft,
  ChevronRight,
  X,
  Filter,
  Radio,
  ExternalLink,
} from "lucide-react";

function JobSearchContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("categories") || "";

  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [countryFilter, setCountryFilter] = useState("all");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [dateFilter, setDateFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Modals state
  const [moreModalJob, setMoreModalJob] = useState<Job | null>(null);
  const [applyModalJob, setApplyModalJob] = useState<Job | null>(null);
  const [signupEmail, setSignupEmail] = useState("");
  const [paywallOpen, setPaywallOpen] = useState(false);

  // Categories list
  const allCategoryOptions = useMemo(() => {
    return CATEGORIES.map((c) => ({ value: c.slug, label: c.name }));
  }, []);

  // Filter logic
  const filteredJobs = useMemo(() => {
    return DUMMY_JOBS.filter((job) => {
      // Search term
      if (
        searchTerm &&
        !job.title.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Categories (if any selected)
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(job.category)
      ) {
        return false;
      }

      // Country
      if (countryFilter !== "all" && job.country !== countryFilter) {
        return false;
      }

      // Remote
      if (remoteOnly && !job.remote) {
        return false;
      }

      return true;
    });
  }, [searchTerm, selectedCategories, countryFilter, remoteOnly]);

  const jobsPerPage = 10;
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage) || 1;
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  const handleToggleCategory = (slug: string) => {
    if (selectedCategories.includes(slug)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== slug));
    } else {
      setSelectedCategories([...selectedCategories, slug]);
    }
    setCurrentPage(1);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupEmail) return;
    toast.success(`Check ${signupEmail} for your instant login link!`);
    setApplyModalJob(null);
    setSignupEmail("");
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-[#09090B] flex flex-col">
      {/* ========================================================================= */}
      {/* APP HEADER (White, bottom shadow, 2 rows)                                 */}
      {/* ========================================================================= */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
        {/* Row 1: Logo & Nav Buttons */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <BrandIcon className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-black text-blue-600 tracking-tight">YourBrand</span>
          </Link>

          {/* 3 Outline buttons with icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/job-search/all"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-300 text-xs sm:text-sm font-medium text-gray-700 hover:bg-slate-100 transition-colors"
            >
              <Briefcase className="w-3.5 h-3.5 text-blue-600" />
              <span>Jobs</span>
            </Link>
            <button
              type="button"
              onClick={() => setPaywallOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-300 text-xs sm:text-sm font-medium text-gray-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>Resume</span>
            </button>
            <Link
              href="/radar"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 text-white hover:bg-cyan-950 border border-slate-700 text-xs sm:text-sm font-semibold transition-colors shadow-xs"
            >
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>3D Radar</span>
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50 text-xs sm:text-sm font-semibold transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </Link>
          </div>
        </div>

        {/* Row 2: Search input + black Search button */}
        <div className="border-t border-gray-100 bg-gray-50/60 py-3 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search job title... (Exact search)"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E4E4E7] rounded-lg text-sm text-[#09090B] focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-neutral-800 transition-colors shadow-sm cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2 COLUMNS BODY                                                           */}
      {/* ========================================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[290px_1fr] gap-8 items-start">
          {/* ===================================================================== */}
          {/* Left Column: Sticky Filter Card (~290px)                              */}
          {/* ===================================================================== */}
          <aside className="bg-white border border-[#E4E4E7] rounded-xl p-5 shadow-sm lg:sticky lg:top-36 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2 font-bold text-[#09090B] text-base">
                <Filter className="w-4 h-4 text-blue-600" />
                <span>Filters</span>
              </div>
              {(selectedCategories.length > 0 || countryFilter !== "all" || remoteOnly) && (
                <button
                  onClick={() => {
                    setSelectedCategories([]);
                    setCountryFilter("all");
                    setRemoteOnly(false);
                    setSearchTerm("");
                  }}
                  className="text-xs text-blue-600 hover:underline font-medium"
                >
                  Reset all
                </button>
              )}
            </div>

            {/* Category Filter with multi-select chips */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Categories
              </label>

              {/* Selected Category Chips */}
              {selectedCategories.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {selectedCategories.map((catSlug) => {
                    const catObj = CATEGORIES.find((c) => c.slug === catSlug);
                    return (
                      <span
                        key={catSlug}
                        className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-md border border-blue-200"
                      >
                        <span>{catObj?.name || catSlug}</span>
                        <button
                          type="button"
                          onClick={() => handleToggleCategory(catSlug)}
                          className="hover:text-blue-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}

              {/* Category dropdown */}
              <select
                value=""
                onChange={(e) => {
                  if (e.target.value) handleToggleCategory(e.target.value);
                }}
                className="w-full text-sm px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
              >
                <option value="">+ Add category filter...</option>
                {allCategoryOptions.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    disabled={selectedCategories.includes(opt.value)}
                  >
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Country Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Country / Region
              </label>
              <select
                value={countryFilter}
                onChange={(e) => {
                  setCountryFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full text-sm px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
              >
                <option value="all">All Countries</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
                <option value="Sweden">Sweden</option>
                <option value="Switzerland">Switzerland</option>
                <option value="Australia">Australia</option>
              </select>
            </div>

            {/* Remote Filter */}
            <div className="pt-2">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remoteOnly}
                  onChange={(e) => {
                    setRemoteOnly(e.target.checked);
                    setCurrentPage(1);
                  }}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="text-sm font-medium text-[#09090B]">100% Remote Only</span>
              </label>
            </div>

            {/* Date Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Date Discovered
              </label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full text-sm px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
              >
                <option value="all">Anytime (Live ATS feed)</option>
                <option value="24h">Past 24 hours</option>
                <option value="7d">Past 7 days</option>
                <option value="30d">Past 30 days</option>
              </select>
            </div>

            {/* Pro Tip Box */}
            <div className="bg-[#F8FAFF] p-3.5 rounded-lg border border-[#DBE3EF] text-xs text-[#4B5563] space-y-1">
              <span className="font-bold text-blue-700 block">Crawler Live Status:</span>
              <p>Polling verified company domains every 15 minutes. No agency syndication.</p>
            </div>
          </aside>

          {/* ===================================================================== */}
          {/* Right Column: Job Count + Job Cards + Pagination                      */}
          {/* ===================================================================== */}
          <div className="space-y-4">
            {/* Job Count Line */}
            <div className="flex items-center justify-between pb-2">
              <h2 className="text-lg font-bold text-[#09090B]">
                {filteredJobs.length > 0 ? (
                  <span>
                    Showing {filteredJobs.length} active listings{" "}
                    <span className="text-sm font-normal text-gray-500">(from 61,065 monitored jobs)</span>
                  </span>
                ) : (
                  <span>No matching jobs found</span>
                )}
              </h2>
              <span className="text-xs font-mono text-gray-400">Page {currentPage} of {totalPages}</span>
            </div>

            {/* Job Cards */}
            {paginatedJobs.length === 0 ? (
              <div className="bg-white border border-[#E4E4E7] rounded-xl p-12 text-center space-y-3">
                <p className="text-gray-500 text-base">No listings match your current filter selections.</p>
                <button
                  onClick={() => {
                    setSelectedCategories([]);
                    setCountryFilter("all");
                    setRemoteOnly(false);
                    setSearchTerm("");
                  }}
                  className="text-sm font-semibold text-blue-600 hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              paginatedJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white border border-[#E4E4E7] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-150 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      {/* Job Title: text-2xl semibold */}
                      <h3 className="text-2xl font-semibold text-[#09090B] tracking-tight hover:text-[#2563EB] cursor-pointer">
                        {job.title}
                      </h3>

                      {/* Verified Company Name (Unblurred) */}
                      <div className="flex flex-wrap items-center gap-2.5 text-sm text-[#4B5563]">
                        <span className="font-semibold text-gray-900">
                          {job.company}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          {job.location}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-gray-400 font-mono text-xs">
                          <Clock className="w-3.5 h-3.5" />
                          {job.date}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons: Direct Apply Link + Outline pill More */}
                    <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                      {/* Direct Apply button */}
                      <a
                        href={job.applyUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-full font-semibold text-sm transition-colors shadow-sm cursor-pointer whitespace-nowrap group"
                      >
                        <span>Apply Direct</span>
                        <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>

                      {/* Outline pill More button with layers icon */}
                      <button
                        onClick={() => setMoreModalJob(job)}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium text-xs transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>More</span>
                      </button>
                    </div>
                  </div>

                  {/* Chips: Salary, Source, Remote */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
                    <Chip variant="salary">{job.salary}</Chip>
                    <Chip variant="source">Direct ATS Source</Chip>
                    {job.remote && <Chip variant="default">100% Remote</Chip>}
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded ml-auto">
                      Verified Active
                    </span>
                  </div>
                </div>
              ))
            )}

            {/* Pagination: Previous | Page 1 | Next > (black button) */}
            <div className="pt-6 pb-12 flex items-center justify-between">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed bg-white shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <span className="text-sm font-semibold text-gray-700">
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="inline-flex items-center gap-1 px-5 py-2 bg-black hover:bg-neutral-800 text-white rounded-md text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: "More" -> Other matched jobs from this company                   */}
      {/* ========================================================================= */}
      <Modal
        open={!!moreModalJob}
        onOpenChange={(open) => !open && setMoreModalJob(null)}
        title={moreModalJob ? `${moreModalJob.company} — Role Breakdown` : "Job Details"}
        description="Verified direct-source requisition data directly from employer ATS."
      >
        {moreModalJob && (
          <div className="py-4 space-y-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-blue-600 font-bold block">
                {moreModalJob.category.toUpperCase()} • {moreModalJob.type}
              </span>
              <h4 className="text-xl font-bold text-gray-900 leading-tight">
                {moreModalJob.title}
              </h4>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 pt-1">
                <span className="font-semibold text-gray-900">{moreModalJob.company}</span>
                <span>•</span>
                <span>{moreModalJob.location}</span>
                <span>•</span>
                <span className="text-emerald-700 font-bold font-mono">{moreModalJob.salary}</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center justify-between">
              <span>✓ 100% Verified Direct Application Endpoint</span>
              <span className="font-bold">Zero Middlemen</span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setMoreModalJob(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <a
                href={moreModalJob.applyUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-6 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors shadow-sm"
              >
                <span>Go to Employer Application</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 2: "Apply" while logged out -> Sign up now to apply to this job     */}
      {/* ========================================================================= */}
      <Modal
        open={!!applyModalJob}
        onOpenChange={(open) => !open && setApplyModalJob(null)}
        title="Sign up now to apply to this job"
        description="Unlock direct employer Greenhouse, Lever, and Ashby endpoints with verified salary data."
      >
        <form onSubmit={handleSignupSubmit} className="space-y-5 pt-2">
          {applyModalJob && (
            <div className="bg-gray-50 p-3.5 rounded-lg border border-gray-200 text-sm">
              <span className="text-xs text-gray-500 uppercase tracking-wider block font-semibold mb-0.5">
                Target Requisition
              </span>
              <span className="font-bold text-[#09090B] block">{applyModalJob.title}</span>
              <span className="text-xs text-emerald-700 font-semibold">{applyModalJob.salary}</span>
            </div>
          )}

          <div>
            <label htmlFor="signup-email" className="block text-sm font-semibold text-[#09090B] mb-1.5">
              Work or Personal Email
            </label>
            <input
              id="signup-email"
              type="email"
              required
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3.5 py-2.5 bg-white border border-[#E4E4E7] rounded-lg text-sm text-[#09090B] focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-black text-white font-semibold rounded-lg hover:bg-neutral-800 transition-colors flex items-center justify-center cursor-pointer shadow-sm text-sm"
          >
            Sign up to Unlock Direct Link
          </button>

          {/* AvatarStack + social proof line inside modal */}
          <div className="pt-2 flex justify-center">
            <AvatarStack
              peopleCount="24,800+"
              jobsCount="61,000+"
              textColor="text-gray-700"
            />
          </div>
        </form>
      </Modal>

      {/* Paywall Modal triggered by Resume button */}
      <PaywallModal open={paywallOpen} onOpenChange={setPaywallOpen} />
    </div>
  );
}

export default function JobSearchPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center text-gray-500 font-medium">
          Loading live job radar...
        </div>
      }
    >
      <JobSearchContent />
    </React.Suspense>
  );
}
