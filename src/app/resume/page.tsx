"use client";

import React, { useState } from "react";
import GuideHeader from "@/components/GuideHeader";
import Footer from "@/components/Footer";
import {
  Check,
  ShieldCheck,
  Zap,
  Sparkles,
  CreditCard,
  Lock,
  ArrowRight,
  Star,
  CheckCircle2,
} from "lucide-react";

export default function ResumePage() {
  const [selectedPlan, setSelectedPlan] = useState<"lifetime" | "monthly">("lifetime");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [cardName, setCardName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1200);
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
                Your account ({email || "candidate@example.com"}) is active with lifetime unindexed company feeds and direct ATS links.
              </p>
            </div>
            <div className="pt-2">
              <a
                href="/job-search/all"
                className="inline-flex items-center justify-center gap-2 w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white py-3.5 rounded-xl font-bold text-sm shadow-md transition-all"
              >
                <span>Access Live Job Search</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        ) : (
          /* Dedicated Paywall Card */
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
                Skip 1,000+ applicant queues on LinkedIn and Indeed. Query 12,000+ company websites directly.
              </p>
            </div>

            <div className="p-6 sm:p-10 space-y-8 max-w-2xl mx-auto">
              {/* Plan Switcher */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Lifetime Plan */}
                <div
                  onClick={() => setSelectedPlan("lifetime")}
                  className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedPlan === "lifetime"
                      ? "border-[#2563EB] bg-blue-50/50 shadow-md"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <span className="absolute -top-3 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                    Most Popular
                  </span>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                      Lifetime Access
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        selectedPlan === "lifetime"
                          ? "border-[#2563EB] bg-[#2563EB]"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedPlan === "lifetime" && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2 my-1">
                    <span className="text-3xl font-black text-gray-900">$29</span>
                    <span className="text-sm text-gray-400 line-through">$89</span>
                  </div>
                  <div className="text-xs text-gray-600 font-medium mt-1">
                    Pay once • Unlimited lifetime access
                  </div>
                </div>

                {/* Monthly Plan */}
                <div
                  onClick={() => setSelectedPlan("monthly")}
                  className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedPlan === "monthly"
                      ? "border-[#2563EB] bg-blue-50/50 shadow-md"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                      Monthly Pass
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        selectedPlan === "monthly"
                          ? "border-[#2563EB] bg-[#2563EB]"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedPlan === "monthly" && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2 my-1">
                    <span className="text-3xl font-black text-gray-900">$9</span>
                    <span className="text-sm text-gray-500">/month</span>
                  </div>
                  <div className="text-xs text-gray-600 font-medium mt-1">
                    Cancel anytime in 1 click
                  </div>
                </div>
              </div>

              {/* Feature Checklist */}
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200/80">
                <div className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">
                  Included in your Pro Pass:
                </div>
                <ul className="space-y-2.5 text-xs sm:text-sm text-gray-700">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Direct company career links:</strong> Lever, Greenhouse, Ashby endpoints updated every 15 minutes.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Resume direct ATS matcher:</strong> Target exact job keywords and pass automated filters.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Zero middleman spam:</strong> No agency brokers, ghost positions, or expired listings.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Transparent compensation:</strong> Verified salary bands and location remote eligibility.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Checkout Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Work or Personal Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="candidate@example.com"
                    className="w-full h-11 px-3.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        defaultValue="4242 •••• •••• 4242"
                        className="w-full h-11 pl-9 pr-3 rounded-lg border border-gray-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <CreditCard className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Expiry
                      </label>
                      <input
                        type="text"
                        required
                        defaultValue="12/28"
                        className="w-full h-11 px-3 rounded-lg border border-gray-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        CVC
                      </label>
                      <input
                        type="text"
                        required
                        defaultValue="891"
                        className="w-full h-11 px-3 rounded-lg border border-gray-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white py-4 rounded-xl font-bold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-3 disabled:opacity-75"
                >
                  {isProcessing ? (
                    <span>Activating membership...</span>
                  ) : (
                    <>
                      <span>
                        Complete Purchase • {selectedPlan === "lifetime" ? "$29 One-Time" : "$9/Month"}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Trust Signals */}
                <div className="flex items-center justify-center gap-4 text-xs text-gray-500 pt-2">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" /> 256-Bit SSL Encrypted
                  </span>
                  <span>•</span>
                  <span>7-Day Full Money Back Guarantee</span>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
