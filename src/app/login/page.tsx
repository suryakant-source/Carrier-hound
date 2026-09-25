"use client";

import React, { useState } from "react";
import Link from "next/link";
import BrandIcon from "@/components/BrandIcon";
import { toast } from "react-toastify";
import { ArrowLeft, Mail } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    toast.success("Check your email for a login link");
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col items-center justify-center p-4 sm:p-6 text-[#09090B]">
      {/* Back button */}
      <div className="w-full max-w-[600px] mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Big blue rounded-square app icon (~140px) */}
      <div className="w-[140px] h-[140px] rounded-3xl bg-[#2563EB] shadow-xl flex items-center justify-center text-white mb-8 transition-transform hover:scale-105">
        <BrandIcon className="w-20 h-20 text-white" />
      </div>

      {/* Card ~600px wide, 1px border, rounded-xl, thin teal top border */}
      <div className="w-full max-w-[600px] bg-white border border-[#E4E4E7] rounded-xl shadow-sm overflow-hidden border-t-4 border-t-teal-500">
        {/* Tinted top strip */}
        <div className="bg-[#F8FAFF] border-b border-gray-100 py-3.5 px-6 text-center">
          <p className="text-sm font-medium text-gray-700">
            We&apos;ll email you a login link for a password-free sign in.
          </p>
        </div>

        {/* Form Body */}
        <div className="p-8 sm:p-10 space-y-6">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold text-[#09090B]">Sign in</h1>
            <p className="text-sm text-[#4B5563]">
              Enter your email below to access your saved jobs and alerts.
            </p>
          </div>

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-emerald-900">Check your inbox</h3>
              <p className="text-sm text-emerald-700">
                We sent a secure magic link to <span className="font-semibold">{email}</span>. Click the link to log into YourBrand.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="text-xs text-emerald-800 underline font-semibold pt-1"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-[#09090B] mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full h-12 px-4 bg-white border border-[#E4E4E7] rounded-lg text-base text-[#09090B] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm"
                />
              </div>

              {/* Full-width blue "Send Login Link" button (py-3, rounded-lg, semibold) */}
              <button
                type="submit"
                className="w-full py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-base rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 shadow-sm cursor-pointer"
              >
                Send Login Link
              </button>
            </form>
          )}

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
