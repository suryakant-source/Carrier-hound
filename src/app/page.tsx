"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BrandIcon from "@/components/BrandIcon";
import DotPattern from "@/components/DotPattern";
import Footer from "@/components/Footer";
import { getAuthUser } from "@/lib/auth/session";
import {
  ArrowRight,
  Check,
  X,
  Sparkles,
  ShieldCheck,
  Briefcase,
  Target,
  FileText,
  LayoutGrid,
  Globe,
  Lock,
  ChevronDown,
  Building,
  MapPin,
  Calendar,
  ExternalLink,
  HelpCircle
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  // Redirect signed-in users directly to Dashboard
  useEffect(() => {
    getAuthUser().then((user) => {
      if (user) {
        router.replace("/dashboard");
      }
    });
  }, [router]);

  return (
    <div className="min-h-screen bg-white text-[#09090B] flex flex-col selection:bg-blue-100 selection:text-blue-900">
      {/* ========================================================================= */}
      {/* 1. PUBLIC HEADER                                                          */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center p-0.5 shadow-xs border border-gray-100">
              <BrandIcon className="w-7 h-7" />
            </div>
            <span className="text-xl font-black text-blue-600 tracking-tight">CareerMonke</span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">
              How it works
            </a>
            <a href="#preview" className="hover:text-blue-600 transition-colors">
              Jobs preview
            </a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors">
              Pricing
            </a>
            <Link href="/remote" className="hover:text-blue-600 transition-colors">
              Resources
            </Link>
            <Link href="/worldwide" className="hover:text-blue-600 transition-colors">
              Companies
            </Link>
          </nav>

          {/* Right CTAs */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-blue-600 px-3 py-2 transition"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.98] text-white px-4 sm:px-5 py-2.5 min-h-[40px] rounded-xl text-xs sm:text-sm font-bold transition shadow-xs cursor-pointer"
            >
              <span>Get started</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ========================================================================= */}
        {/* 2. HERO SECTION                                                           */}
        {/* ========================================================================= */}
        <section className="relative bg-[#2563EB] text-white pt-16 pb-20 sm:pt-24 sm:pb-28 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-20 flex flex-col items-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-white shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Direct ATS Scraping • Updated Every 15 Minutes</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight text-white max-w-3xl">
              Find jobs directly from company career pages.
            </h1>

            <p className="text-white/90 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed">
              We continuously scan official ATS feeds (Greenhouse, Lever, Ashby, Workday) to uncover open requisitions before they reach crowded public job boards.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md pt-2">
              <Link
                href="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-[#09090B] font-bold text-base px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-[0.98] transition cursor-pointer min-h-[48px]"
              >
                <span>Get started free</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
              <a
                href="#preview"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-base px-6 py-4 rounded-xl border border-white/20 transition cursor-pointer min-h-[48px]"
              >
                <span>See sample jobs</span>
              </a>
            </div>

            <p className="text-white/70 text-xs pt-2">
              No credit card required • Connect resume for verified match scores
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. PRODUCT PREVIEW (Labelled Sample Data)                                 */}
        {/* ========================================================================= */}
        <section id="preview" className="py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
              Product Preview
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              What you get inside CareerMonke
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              SAMPLE DATA PREVIEW • Clear fit diagnostics, deterministic gap analysis, and real pipeline tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Card 1: Sample Job with Locked Pro Details */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    Sample Job Card
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>88% Sample Fit</span>
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-slate-900">Senior Full-Stack Engineer</h3>
                  {/* Company Name (Blurred for Guest) */}
                  <div className="flex items-center gap-1.5 mt-1 text-xs">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span className="filter blur-[5px] select-none text-slate-700 font-semibold">
                      Stripe Technologies
                    </span>
                    <span className="text-[10px] text-blue-600 font-bold ml-1 flex items-center gap-0.5">
                      <Lock className="w-2.5 h-2.5" />
                      <span>Pro</span>
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-500 flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>Worldwide Remote</span>
                  </span>
                  <span>•</span>
                  <span>Scraped 18m ago</span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3">
                  Building next-generation payment APIs and merchant dashboard infrastructure using TypeScript, React, and distributed cloud services.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Greenhouse ATS Source</span>
                <Link
                  href="/signup"
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <span>Unlock Details</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Card 2: Deterministic Fit Diagnostics */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                  Fit Diagnostics
                </span>
                <Target className="w-4 h-4 text-blue-600" />
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-sm text-slate-900">Deterministic Match Breakdown</h4>
                <p className="text-[11px] text-slate-500">
                  Computed against confirmed resume facts. No hallucinations.
                </p>

                <div className="space-y-2 pt-1">
                  <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-xs">
                    <span className="font-bold text-emerald-800 block text-[11px] mb-1">
                      ✓ Why You Fit (Matched Skills)
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {["React", "TypeScript", "Node.js", "PostgreSQL"].map((s) => (
                        <span key={s} className="bg-white text-emerald-700 px-1.5 py-0.5 rounded text-[10px] font-semibold border border-emerald-200">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-100 text-xs">
                    <span className="font-bold text-amber-800 block text-[11px] mb-1">
                      ⚠ Skill Gaps to Address
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {["GraphQL", "Distributed Systems"].map((s) => (
                        <span key={s} className="bg-white text-amber-700 px-1.5 py-0.5 rounded text-[10px] font-semibold border border-amber-200">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-400">
                Formula: Skills (50%) + Title (25%) + Exp (15%) + Remote (10%)
              </div>
            </div>

            {/* Card 3: Kanban Application Tracker Sample */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    Application Tracker
                  </span>
                  <LayoutGrid className="w-4 h-4 text-blue-600" />
                </div>

                <h4 className="font-bold text-sm text-slate-900">Personal Pipeline Board</h4>
                <p className="text-[11px] text-slate-500">
                  Track direct career page applications through every stage.
                </p>

                <div className="space-y-2 pt-1">
                  <div className="p-2 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-between text-xs">
                    <div className="font-bold text-blue-900">Staff Backend Engineer</div>
                    <span className="px-2 py-0.5 bg-blue-600 text-white rounded text-[10px] font-bold">
                      Interview
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-between text-xs">
                    <div className="font-bold text-emerald-900">Lead Product Architect</div>
                    <span className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-bold">
                      Applied (Direct)
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div className="font-bold text-slate-700">Senior Cloud Specialist</div>
                    <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded text-[10px] font-bold">
                      Saved
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                You apply directly on employer portals — we never auto-submit.
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. HOW IT WORKS (3 Clear Steps)                                           */}
        {/* ========================================================================= */}
        <section id="how-it-works" className="py-16 sm:py-24 bg-slate-50 border-y border-slate-200/80">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                Simple Workflow
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                How CareerMonke Works
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm">
                No recruiter middle-men. No ghost aggregators. Three straightforward steps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                  1
                </div>
                <h3 className="font-bold text-base text-slate-900">
                  Set Preferences & Confirm Resume
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Upload your PDF or Word resume. Our deterministic fact extractor pulls verified skills and timeline for your confirmation. You can also skip and match purely by role goals.
                </p>
                <div className="text-[11px] font-semibold text-blue-700 bg-blue-50/70 p-2 rounded-lg">
                  ✓ Never invents facts or credentials
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                  2
                </div>
                <h3 className="font-bold text-base text-slate-900">
                  Discover Live Feeds & Prepare
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Our crawler checks employer ATS systems every 15 minutes. Review deterministic fit diagnostics and generate 1-click tailored ATS cover letters and clean exports.
                </p>
                <div className="text-[11px] font-semibold text-blue-700 bg-blue-50/70 p-2 rounded-lg">
                  ✓ Clean single-column ATS resume export
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                  3
                </div>
                <h3 className="font-bold text-base text-slate-900">
                  Apply Directly & Track Pipeline
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Submit directly on the official employer site. We <strong>never automatically blast applications</strong> without your control. Once submitted, confirm and manage notes in your Kanban board.
                </p>
                <div className="text-[11px] font-semibold text-emerald-700 bg-emerald-50/70 p-2 rounded-lg">
                  ✓ 100% direct official application
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. KEY FEATURES                                                           */}
        {/* ========================================================================= */}
        <section className="py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
              Full Feature Set
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Engineered for the Modern Job Hunt
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              Everything you need to bypass job board spam and get noticed by hiring managers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Direct ATS Postings</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Direct requisitions from Greenhouse, Lever, Ashby, and Workday. No expired ghost jobs or recruiter reposts.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Deterministic Fit Diagnostics</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clear 0-100% match scores with exact breakdown of why you fit and specific skill gaps to cover.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">ATS Resume & Cover Letter</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                1-click job-tailored cover letter and clean single-column ATS Word/PDF export without tables that break parsers.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <LayoutGrid className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Application Kanban Tracker</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Track Saved, Applied, Interview, Offer, and Rejected stages with date logs and personal interview notes.
              </p>
            </div>
          </div>

          {/* Optional Explore Callout: 3D Radar */}
          <div className="mt-8 p-5 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="font-bold text-sm text-cyan-200">Optional Visual Explore Tool</span>
              </div>
              <p className="text-xs text-slate-300">
                Want to explore tech hiring clusters geographically? Check out our interactive 3D Global Job Radar.
              </p>
            </div>
            <Link
              href="/radar"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition shadow-xs self-start sm:self-auto"
            >
              <Globe className="w-4 h-4" />
              <span>Explore 3D Radar</span>
            </Link>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. COVERAGE & REAL REFRESH                                                */}
        {/* ========================================================================= */}
        <section className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200/80">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10">
              <div className="space-y-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                  Real Coverage
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  Global & Remote Hiring Requisitions
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  We monitor over 500 tech companies and verified remote employers across North America, Europe, India, and worldwide hubs. Listings are updated in real-time batches every 15 minutes.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <div className="font-bold text-base text-slate-900">500+</div>
                    <div className="text-[11px] text-slate-500">Connected Career Portals</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <div className="font-bold text-base text-slate-900">15 Mins</div>
                    <div className="text-[11px] text-slate-500">Ingestion Synchronization</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                  Supported Categories & Roles
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "Frontend & React",
                    "Full-Stack Development",
                    "Backend (Go, Python, Java)",
                    "Data Science & AI/ML",
                    "DevOps & Kubernetes",
                    "Product Management",
                    "UI/UX & Product Design",
                    "Engineering Management",
                    "Sales & Business Development",
                    "Operations & Growth"
                  ].map((cat) => (
                    <span key={cat} className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                      {cat}
                    </span>
                  ))}
                </div>
                <div className="pt-2 text-xs text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Filtered for active remote eligibility and verified hiring portals.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. FREE VS PRO PRICING                                                    */}
        {/* ========================================================================= */}
        <section id="pricing" className="py-16 sm:py-24 max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
              Fair Pricing
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Transparent Access Rules
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              Explore freely. Upgrade to Pro when you&apos;re ready to unmask direct hiring companies and unlock 1-click ATS applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-700">
                  Free Forever
                </div>
                <div>
                  <div className="text-3xl font-black text-slate-900">$0</div>
                  <div className="text-xs text-slate-500">No credit card needed</div>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Search and filter all job titles & roles</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Deterministic fit diagnostics on confirmed resume</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>5 saved application tracker slots</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>1 clean ATS resume export</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-400">
                    <X className="w-4 h-4 text-slate-300 shrink-0" />
                    <span>Company names & direct apply links locked</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/signup"
                className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold text-center transition cursor-pointer"
              >
                Start Free
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-white rounded-2xl border-2 border-blue-600 p-6 sm:p-8 shadow-md relative flex flex-col justify-between space-y-6">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] uppercase font-bold tracking-wider px-3 py-0.5 rounded-full shadow-xs">
                Recommended
              </div>

              <div className="space-y-4">
                <div className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700">
                  CareerMonke Pro
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900">₹199 / mo</span>
                    <span className="text-xs text-slate-400">(Domestic)</span>
                  </div>
                  <div className="text-xs text-slate-500">$9 / month for International</div>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <strong className="text-slate-900">Unlocked company names & direct ATS links</strong>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Unblurred salary & exact office locations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Unlimited application tracker pipeline</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Unlimited AI-tailored cover letters & ATS versions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Daily automated AI matching digest scan</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/signup?upgrade=true"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs sm:text-sm font-bold text-center transition shadow-xs cursor-pointer"
              >
                Upgrade to Pro
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 8. FAQ                                                                    */}
        {/* ========================================================================= */}
        <section className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200/80">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10 space-y-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-xs text-slate-500">
                Clear answers regarding your privacy, data, and access.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "How is my resume privacy protected?",
                  a: "Your resume is parsed to extract verifiable factual attributes (skills, job titles, education). We never sell your resume to recruiters, and facts are saved only after you review and confirm them. You can delete your resume data at any time from Settings."
                },
                {
                  q: "How fresh are the job postings?",
                  a: "We continuously synchronize with company ATS feeds (Greenhouse, Lever, Ashby, Workday) every 15 minutes. When a requisition is closed by an employer, it is updated immediately so you don't waste time on stale listings."
                },
                {
                  q: "Does CareerMonke automatically submit applications for me?",
                  a: "No, and for good reason: automated application bots get candidates blacklisted. CareerMonke uncovers the direct ATS link and prepares your tailored cover letter and ATS resume, but you submit directly to the employer's official page."
                },
                {
                  q: "What is the difference between Free and Pro?",
                  a: "Free allows you to browse all positions, compute match scores on your confirmed resume, and track up to 5 jobs. Pro unlocks company names, direct 1-click ATS application links, unlimited tracker slots, and tailored cover letters."
                },
                {
                  q: "Can I cancel my subscription anytime?",
                  a: "Yes. There are no annual lock-ins. You can cancel your subscription with one click in your billing settings. You retain access until the end of your billing cycle."
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-1.5">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{item.q}</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed pl-6">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 9. FINAL CTA                                                              */}
        {/* ========================================================================= */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 sm:py-20 text-center">
          <div className="max-w-3xl mx-auto px-4 space-y-5">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
              Ready to skip the crowd and apply directly?
            </h2>
            <p className="text-white/90 text-xs sm:text-base max-w-xl mx-auto leading-relaxed">
              Create your account in 30 seconds. Connect your resume or set your preferences to begin discovering unadvertised roles.
            </p>
            <div className="pt-2">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-[0.98] transition cursor-pointer text-sm sm:text-base"
              >
                <span>Get started free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Public Footer */}
      <Footer />
    </div>
  );
}
