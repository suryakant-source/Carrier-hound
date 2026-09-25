"use client";

import React, { useState } from "react";
import {
  X,
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
import BrandIcon from "./BrandIcon";

interface PaywallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  subtitle?: string;
}

export default function PaywallModal({
  open,
  onOpenChange,
  title = "Unlock YourBrand Pro Access",
  subtitle = "Direct access to unlisted company career feeds, instant ATS matching, and priority notifications.",
}: PaywallModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<"lifetime" | "monthly">("lifetime");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [cardName, setCardName] = useState("");

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors"
          aria-label="Close paywall modal"
        >
          <X className="w-4 h-4" />
        </button>

        {isSuccess ? (
          /* Success Screen */
          <div className="p-8 sm:p-10 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-900">Welcome to YourBrand Pro!</h3>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                Your account ({email || "candidate@example.com"}) is now active with unlimited access to direct company ATS feeds and resume tools.
              </p>
            </div>
            <div className="pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsSuccess(false);
                  onOpenChange(false);
                }}
                className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white py-3.5 rounded-xl font-bold text-sm shadow-md transition-all"
              >
                Go to Jobs Radar
              </button>
            </div>
          </div>
        ) : (
          /* Paywall Screen */
          <div>
            {/* Header with Blue Gradient Accent */}
            <div className="bg-gradient-to-br from-[#1E40AF] via-[#2563EB] to-[#3B82F6] text-white p-6 sm:p-8 relative">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 text-white backdrop-blur-xs">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> Pro Member Access
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-400/20 text-emerald-200">
                  <Zap className="w-3 h-3 text-emerald-300" /> Instant Activation
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
                {title}
              </h3>
              <p className="text-white/85 text-xs sm:text-sm mt-2 max-w-lg leading-relaxed">
                {subtitle}
              </p>
            </div>

            <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Plan Switcher */}
              <div className="grid grid-cols-2 gap-3">
                {/* Lifetime Plan */}
                <div
                  onClick={() => setSelectedPlan("lifetime")}
                  className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedPlan === "lifetime"
                      ? "border-[#2563EB] bg-blue-50/50 shadow-sm"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <span className="absolute -top-2.5 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                    Best Value
                  </span>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                      Lifetime Access
                    </span>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        selectedPlan === "lifetime"
                          ? "border-[#2563EB] bg-[#2563EB]"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedPlan === "lifetime" && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1.5 my-1">
                    <span className="text-2xl font-black text-gray-900">$29</span>
                    <span className="text-xs text-gray-400 line-through">$89</span>
                  </div>
                  <div className="text-[11px] text-gray-500">Pay once • Lifetime access</div>
                </div>

                {/* Monthly Plan */}
                <div
                  onClick={() => setSelectedPlan("monthly")}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedPlan === "monthly"
                      ? "border-[#2563EB] bg-blue-50/50 shadow-sm"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                      Monthly Pass
                    </span>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        selectedPlan === "monthly"
                          ? "border-[#2563EB] bg-[#2563EB]"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedPlan === "monthly" && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1 my-1">
                    <span className="text-2xl font-black text-gray-900">$9</span>
                    <span className="text-xs text-gray-500">/month</span>
                  </div>
                  <div className="text-[11px] text-gray-500">Cancel anytime in 1 click</div>
                </div>
              </div>

              {/* Feature Checklist */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5">
                  Everything Included in Pro:
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Direct ATS feeds:</strong> 12,000+ company websites queried every 15 mins.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Resume & ATS Optimization:</strong> Bypass filters and match verified employer keywords.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Zero spam or recruiter brokers:</strong> 100% direct company applications only.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Verified compensation:</strong> Transparent salary ranges and real equity bands.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Checkout Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Your Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="candidate@example.com"
                    className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white py-3.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-75"
                >
                  {isProcessing ? (
                    <span>Securing access...</span>
                  ) : (
                    <>
                      <span>
                        Unlock Instant Access • {selectedPlan === "lifetime" ? "$29 One-Time" : "$9/Month"}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Trust Signals */}
                <div className="flex items-center justify-center gap-4 text-[11px] text-gray-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3 h-3 text-emerald-600" /> 256-Bit SSL
                  </span>
                  <span>•</span>
                  <span>7-Day Money Back Guarantee</span>
                  <span>•</span>
                  <span>No hidden contracts</span>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
