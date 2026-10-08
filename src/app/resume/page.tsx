"use client";

import React, { useState, useEffect } from "react";
import GuideHeader from "@/components/GuideHeader";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  Check,
  ShieldCheck,
  Zap,
  Sparkles,
  Lock,
  ArrowRight,
  CheckCircle2,
  Globe2,
  LogIn,
  FileCheck2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import ResumeUploadAndConfirm from "@/components/resume/ResumeUploadAndConfirm";

export default function ResumePage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setCurrentUser(data.user);
        if (data.user.email) setEmail(data.user.email);
      } else {
        const localEmail = typeof window !== "undefined" ? localStorage.getItem("careermonke_user_email") : null;
        if (localEmail) {
          setCurrentUser({ email: localEmail, id: "local-user" });
          setEmail(localEmail);
        }
      }
    });
  }, []);

  const handleUnlockPro = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail && !currentUser) return;

    setIsProcessing(true);

    try {
      const supabase = createClient();
      await supabase.auth.updateUser({
        data: { is_pro: true },
      });
    } catch (err) {
      console.warn("Could not update user metadata", err);
    }

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("careermonke_pro_active", "true");
        window.dispatchEvent(new Event("careermonke_pro_updated"));
      }
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#09090B] flex flex-col justify-between selection:bg-blue-100 selection:text-blue-900">
      <GuideHeader />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full space-y-12">
        {/* Core Feature 1 & 3: Resume Parser, Fact Extraction, ATS Export */}
        <section>
          <ResumeUploadAndConfirm />
        </section>

        {/* Pro Membership & Direct ATS Telemetry Access */}
        <section className="pt-6 border-t border-slate-200">
          {isSuccess ? (
            /* Success Screen */
            <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-md border border-gray-100 text-center max-w-lg mx-auto space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Welcome to Pro Membership!
                </h2>
                <p className="text-sm text-gray-600 max-w-sm mx-auto leading-relaxed">
                  Your account ({email || "candidate@example.com"}) is now active with direct ATS feeds, verified compensation data, and priority 3D radar filters.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/radar"
                  className="inline-flex items-center justify-center gap-2 w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white py-3.5 rounded-xl font-bold text-sm shadow-md transition-all"
                >
                  <span>Launch 3D Job Radar</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            /* Dedicated Pro Access Card */
            <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200/80">
              {/* Header with Blue Gradient Accent */}
              <div className="bg-gradient-to-br from-[#1E40AF] via-[#2563EB] to-[#3B82F6] text-white p-6 sm:p-8 text-center relative">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 text-white backdrop-blur-xs mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> Pro Member Access
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug max-w-xl mx-auto">
                  Unlock Direct ATS Radar & Pro Feeds
                </h2>
                <p className="text-white/90 text-xs sm:text-sm mt-2 max-w-lg mx-auto leading-relaxed font-normal">
                  Skip 1,000+ applicant queues on third-party aggregators. Query 500+ verified tech company ATS boards directly.
                </p>
              </div>

              <div className="p-6 sm:p-8 space-y-6 max-w-2xl mx-auto">
                {/* Feature Checklist Grounded in Real Data */}
                <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100/80">
                  <div className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-3">
                    Included in your CareerMonke Pro Pass:
                  </div>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-gray-700">
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-gray-900">Direct Company ATS Endpoints:</strong> Over 16,000 active openings scraped from Greenhouse, Lever, Ashby, and SmartRecruiters daily.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-gray-900">Unmasked Verified Salaries:</strong> Full compensation bands and equity expectations verified from official employer listings.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-gray-900">Zero Middleman Spam:</strong> 100% direct company career portals only—no agency brokers, ghost postings, or dead links.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-gray-900">Global Tech Hub Radar:</strong> 3D geographic density across 37 tech hubs plus 1,600+ unrestricted Worldwide Remote roles.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Action Form */}
                {!currentUser ? (
                  <div className="space-y-3 text-center p-5 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="space-y-1">
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base">Sign In Required to Activate Pro</h3>
                      <p className="text-xs text-gray-600 max-w-md mx-auto">
                        Please sign in with your email or Google account to bind your Pro access to your profile.
                      </p>
                    </div>
                    <div>
                      <Link
                        href="/login?next=/resume"
                        className="inline-flex items-center justify-center gap-2 w-full py-3.5 min-h-[44px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl font-bold text-sm shadow-md transition-all"
                      >
                        <LogIn className="w-4 h-4" />
                        <span>Sign In to Continue</span>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleUnlockPro} className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Logged in account:</span>
                      <span className="font-mono font-semibold text-slate-800 truncate ml-2">{email || "Authenticated User"}</span>
                    </div>

                    <div>
                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white py-3.5 min-h-[44px] rounded-xl font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                      >
                        {isProcessing ? (
                          <span>Activating Pro Membership...</span>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 text-yellow-300" />
                            <span>Unlock Pro Access</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}

                {/* Trust Signals */}
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs text-gray-500 pt-2 text-center">
                  <span className="flex items-center gap-1.5 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Official Company ATS Verified
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <Globe2 className="w-3.5 h-3.5 text-cyan-600" /> 16,000+ Active Roles
                  </span>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
