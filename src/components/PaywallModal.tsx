"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  X,
  Check,
  ShieldCheck,
  Zap,
  Sparkles,
  Lock,
  ArrowRight,
  CheckCircle2,
  LogIn,
  ExternalLink,
} from "lucide-react";
import BrandIcon from "./BrandIcon";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface PaywallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  subtitle?: string;
  user?: User | null;
  onSuccess?: () => void;
  redirectUrl?: string;
}

export default function PaywallModal({
  open,
  onOpenChange,
  title = "Unlock CareerMonke Pro Access",
  subtitle = "Direct access to unlisted company career endpoints, verified compensation bands, and ATS links.",
  user: initialUser,
  onSuccess,
  redirectUrl,
}: PaywallModalProps) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(initialUser ?? null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (initialUser) {
      setCurrentUser(initialUser);
      if (initialUser?.email) setEmail(initialUser.email);
    } else {
      const localEmail =
        typeof window !== "undefined"
          ? localStorage.getItem("careermonke_user_email")
          : null;
      if (localEmail) {
        const u = {
          id: "local-user",
          email: localEmail,
          user_metadata: {},
        } as User;
        setCurrentUser(u);
        setEmail(localEmail);
      } else {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data }) => {
          setCurrentUser(data.user);
          if (data.user?.email) setEmail(data.user.email);
        });
      }
    }
  }, [initialUser, open]);

  const handleActivatePro = async () => {
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
      onSuccess?.();
    }, 700);
  };

  if (!open) return null;

  const loginNextUrl = redirectUrl || (typeof window !== "undefined" ? window.location.pathname + window.location.search : "/radar");

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden border border-gray-100 animate-slideUp sm:animate-scaleUp max-h-[92dvh] sm:max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Indicator Handle */}
        <div className="w-full flex items-center justify-center pt-2.5 pb-1 sm:hidden bg-blue-900/90 shrink-0">
          <div className="w-10 h-1 rounded-full bg-white/40" />
        </div>

        {/* Close Button — always reachable */}
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute top-3 right-3 sm:top-3.5 sm:right-3.5 z-20 w-11 h-11 rounded-full bg-black/20 sm:bg-white/20 hover:bg-black/40 sm:hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer min-h-[44px] min-w-[44px]"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          /* Success Screen */
          <div className="p-6 sm:p-10 text-center space-y-5 overflow-y-auto pb-10 sm:pb-10">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-900">CareerMonke Pro Unlocked</h3>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                Full direct ATS access has been granted for <strong className="text-gray-900">{email || "your account"}</strong>. You can now view all unmasked salary bands, direct company links, and locations.
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsSuccess(false);
                  onOpenChange(false);
                }}
                className="w-full min-h-[44px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white py-3 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center cursor-pointer"
              >
                Return to 3D Radar
              </button>
            </div>
          </div>
        ) : (
          /* Pro Upgrade Screen */
          <div className="overflow-y-auto flex-1 min-h-0 overscroll-contain">
            {/* Header in Brand Blue (#2563EB) */}
            <div className="bg-gradient-to-br from-[#1E40AF] via-[#2563EB] to-[#3B82F6] text-white p-6 sm:p-7 relative">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 text-white backdrop-blur-xs">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> Pro Member Access
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-400/20 text-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" /> Verified Direct
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                {title}
              </h3>
              <p className="text-white/85 text-xs sm:text-sm mt-1.5 leading-relaxed">
                {subtitle}
              </p>
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-7 space-y-5 pb-8 sm:pb-7 pb-[max(2rem,env(safe-area-inset-bottom))]">
              {/* Value Proposition Highlights */}
              <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-100/80">
                <div className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#2563EB]" />
                  What Pro Unlocks on Radar:
                </div>
                <ul className="space-y-2 text-xs text-gray-700">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-gray-900">Direct ATS Apply Links:</strong> Skip LinkedIn broker queues; apply directly on company Greenhouse, Lever, and Ashby portals.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-gray-900">Unmasked Compensation:</strong> View verified salary bands and equity packages from official employer listings.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-gray-900">Exact Locations & Timezones:</strong> Full office address, hybrid expectations, and worldwide eligibility.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-gray-900">500 Verified Tech Boards:</strong> Fresh jobs scraped and verified daily from top global tech companies.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Action State: Sign In vs Activate */}
              {!currentUser ? (
                /* User is NOT logged in */
                <div className="space-y-3 pt-1">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <p className="text-xs text-slate-600 font-medium">
                      You are currently browsing as a guest. Please sign in with your email or Google account to unlock Pro features.
                    </p>
                  </div>
                  <Link
                    href={`/login?next=${encodeURIComponent(loginNextUrl)}`}
                    onClick={() => onOpenChange(false)}
                    className="w-full min-h-[44px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white py-3 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In to Unlock Pro Access</span>
                  </Link>
                </div>
              ) : (
                /* User IS logged in */
                <div className="space-y-3 pt-1">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Signed in as:</span>
                    <span className="font-semibold text-slate-800 font-mono">{email || "Authenticated User"}</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleActivatePro}
                    disabled={isProcessing}
                    className="w-full min-h-[44px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white py-3.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                  >
                    {isProcessing ? (
                      <span>Unlocking Pro Access...</span>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-yellow-300" />
                        <span>Unlock Pro Access</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Trust Footer Links */}
              <div className="flex items-center justify-center gap-4 text-[11px] text-gray-500 pt-1 border-t border-gray-100">
                <Link
                  href="/terms-and-conditions"
                  target="_blank"
                  className="hover:text-gray-900 transition-colors"
                >
                  Terms of Service
                </Link>
                <span>•</span>
                <Link
                  href="/privacy-policy"
                  target="_blank"
                  className="hover:text-gray-900 transition-colors"
                >
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
