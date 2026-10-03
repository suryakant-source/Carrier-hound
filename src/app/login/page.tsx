"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import BrandIcon from "@/components/BrandIcon";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Mail, Loader2 } from "lucide-react";

// Google "G" SVG — inline, no external dependency
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  );
}

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/job-search/all";

  const [email, setEmail]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError]         = useState("");

  // Check if user is already logged in locally -> auto redirect
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const existing = localStorage.getItem("careermonke_user_email");
      if (existing) {
        router.replace(next);
      }
    }
  }, [next, router]);

  // ── Instant Email Sign In & Redirect ─────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }
    setError("");
    setLoading(true);

    if (typeof window !== "undefined") {
      localStorage.setItem("careermonke_user_email", cleanEmail);
      document.cookie = `careermonke_user_email=${encodeURIComponent(cleanEmail)}; path=/; max-age=2592000`;
      window.dispatchEvent(new Event("careermonke_auth_updated"));
      window.location.href = next;
    } else {
      router.push(next);
    }
  };

  // ── Instant Google Sign In & Redirect ────────────────────────────────────
  const handleGoogle = () => {
    setGoogleLoading(true);
    setError("");
    const defaultEmail = "google.user@careermonke.com";

    if (typeof window !== "undefined") {
      localStorage.setItem("careermonke_user_email", defaultEmail);
      document.cookie = `careermonke_user_email=${encodeURIComponent(defaultEmail)}; path=/; max-age=2592000`;
      window.dispatchEvent(new Event("careermonke_auth_updated"));
      window.location.href = next;
    } else {
      router.push(next);
    }
  };

  React.useEffect(() => {
    document.title = "Sign in to CareerMonke | Verified Job Feeds";
  }, []);

  return (
    <div className="min-h-[100dvh] bg-[#F3F4F6] flex flex-col items-center justify-center p-4 sm:p-6 text-[#09090B] py-6 sm:py-12 pb-[env(safe-area-inset-bottom,1.5rem)]">
      {/* Back button */}
      <div className="w-full max-w-[600px] mb-4 sm:mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-black transition-colors min-h-[44px] py-2 px-1 -ml-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Big blue rounded-square app icon with CareerMonke logo */}
      <div className="w-[88px] h-[88px] sm:w-[140px] sm:h-[140px] rounded-2xl sm:rounded-3xl bg-white shadow-lg sm:shadow-xl border border-gray-100 flex items-center justify-center p-2.5 sm:p-4 mb-4 sm:mb-8 transition-transform hover:scale-105">
        <BrandIcon className="w-14 h-14 sm:w-24 sm:h-24" />
      </div>

      {/* Card ~600px wide, 1px border, rounded-xl, thin teal top border */}
      <div className="w-full max-w-[600px] bg-white border border-[#E4E4E7] rounded-xl shadow-sm overflow-hidden border-t-4 border-t-teal-500">
        {/* Tinted top strip */}
        <div className="bg-[#F8FAFF] border-b border-gray-100 py-3 sm:py-3.5 px-4 sm:px-6 text-center">
          <p className="text-xs sm:text-sm font-medium text-gray-700">
            Enter your email to instantly access verified jobs without waiting.
          </p>
        </div>

        {/* Form Body */}
        <div className="p-5 sm:p-10 space-y-5 sm:space-y-6">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold text-[#09090B]">Sign in to CareerMonke</h1>
            <p className="text-sm text-[#4B5563]">
              Enter your email below to jump straight to active jobs.
            </p>
          </div>

          <div className="space-y-4">
            {/* Error banner */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* ── Google OAuth button ── */}
            <button
              type="button"
              onClick={handleGoogle}
              disabled={googleLoading || loading}
              className="w-full h-12 flex items-center justify-center gap-3 border border-[#E4E4E7] rounded-lg text-sm font-semibold text-[#09090B] hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {googleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <GoogleIcon />
              )}
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* ── Instant Email Form ── */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-[#09090B] mb-2"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full h-12 px-4 bg-white border border-[#E4E4E7] rounded-lg text-base text-[#09090B] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-base rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Redirecting…
                  </>
                ) : (
                  "Continue to Jobs →"
                )}
              </button>
            </form>
          </div>

          <div className="pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
            By signing in, you agree to our{" "}
            <Link href="/terms-and-conditions" className="text-blue-600 hover:underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy-policy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
            .
          </div>
        </div>
      </div>
    </div>
  );
}

// Suspense wrapper required by Next.js for useSearchParams in client components
export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageInner />
    </Suspense>
  );
}
