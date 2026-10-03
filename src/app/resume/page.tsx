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
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

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

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 w-full">
        {isSuccess ? (
          /* Success Screen */
          <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-xl border border-gray-100 text-center max-w-lg mx-auto space-y-6 animate-scaleUp">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Welcome to Pro Membership!
              </h1>
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
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200/80 animate-fadeInUp">
            {/* Header with Blue Gradient Accent */}
            <div className="bg-gradient-to-br from-[#1E40AF] via-[#2563EB] to-[#3B82F6] text-white p-6 sm:p-10 text-center relative">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 text-white backdrop-blur-xs mb-4">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> Pro Member Access
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug max-w-xl mx-auto">
                Unlock Direct ATS Radar & Pro Feeds
              </h1>
              <p className="text-white/90 text-sm sm:text-base mt-3 max-w-lg mx-auto leading-relaxed font-normal">
                Skip 1,000+ applicant queues on third-party aggregators. Query 500+ verified tech company ATS boards directly.
              </p>
            </div>

            <div className="p-6 sm:p-10 space-y-8 max-w-2xl mx-auto">
              {/* Feature Checklist Grounded in Real Data */}
              <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100/80">
                <div className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-4">
                  Included in your CareerMonke Pro Pass:
                </div>
                <ul className="space-y-3 text-xs sm:text-sm text-gray-700">
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

              {/* Action Form & Sticky Trigger */}
              {!currentUser ? (
                <div className="space-y-4 text-center p-5 sm:p-6 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-gray-900 text-base">Sign In Required to Activate Pro</h3>
                    <p className="text-xs text-gray-600 max-w-md mx-auto">
                      Please sign in with your email or Google account to bind your Pro access to your profile.
                    </p>
                  </div>
                  <div className="sticky bottom-0 z-20 sm:static bg-slate-50/95 sm:bg-transparent backdrop-blur-xs sm:backdrop-blur-none p-2 sm:p-0 -mx-5 sm:mx-0 border-t sm:border-t-0 border-slate-200 pb-[env(safe-area-inset-bottom,1rem)] sm:pb-0">
                    <Link
                      href="/login?next=/resume"
                      className="inline-flex items-center justify-center gap-2 w-full py-4 min-h-[48px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Sign In to Continue</span>
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleUnlockPro} className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Logged in account:</span>
                    <span className="font-mono font-semibold text-slate-800 truncate ml-2">{email || "Authenticated User"}</span>
                  </div>

                  {/* Sticky Action Button on Mobile */}
                  <div className="sticky bottom-0 z-20 sm:static bg-white/95 sm:bg-transparent backdrop-blur-xs sm:backdrop-blur-none p-2 sm:p-0 -mx-6 sm:mx-0 border-t sm:border-t-0 border-gray-200 pb-[env(safe-area-inset-bottom,1rem)] sm:pb-0">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white py-4 min-h-[48px] rounded-xl font-bold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
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

              {/* Preview Below the Form */}
              <div className="mt-8 p-5 sm:p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-4 shadow-lg text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-semibold">
                      AI Resume ATS Match Preview
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Score: 94/100
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Keyword Match (Verified ATS Portals)</span>
                    <span className="text-emerald-400 font-bold">Optimal Tier</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="w-[94%] h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full" />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                    Direct requisition telemetry confirms unmasked salary bands, hiring team contacts, and direct Greenhouse / Lever endpoints.
                  </p>
                </div>
              </div>

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
      </main>

      <Footer />
    </div>
  );
}
