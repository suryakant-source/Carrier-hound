import React from "react";
import Link from "next/link";
import BrandIcon from "@/components/BrandIcon";

export const metadata = {
  title: "Terms and Conditions | YourBrand",
  description: "Terms and conditions of service for YourBrand job discovery platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-[#09090B] py-16 px-6">
      {/* Small blue logo (max-width 200px) centered at top */}
      <div className="max-w-[200px] mx-auto text-center mb-10">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-600 group">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
            <BrandIcon className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-blue-600">YourBrand</span>
        </Link>
      </div>

      {/* Narrow container with minimal styling */}
      <div className="max-w-[680px] mx-auto text-sm leading-relaxed text-[#4B5563] space-y-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#09090B] tracking-tight">
          Terms and Conditions
        </h1>
        <p className="text-xs text-gray-400 font-mono">Last Updated: September 24, 2026</p>

        <p className="mb-2">
          1. Acceptance of Terms. By accessing or using the YourBrand application, website, or data feeds, you agree to be legally bound by these Terms and Conditions. If you do not consent to all provisions, you must discontinue platform usage immediately.
        </p>

        <p className="mb-2">
          2. Nature of Service. YourBrand operates as an informational search engine and direct discovery tool designed to catalog unindexed and publicly published employment opportunities.
        </p>
        <p className="mb-2">
          - YourBrand is not an employment agency, headhunter, staffing firm, or employer.
        </p>
        <p className="mb-2">
          - We make no warranty regarding employment outcomes, interview guarantees, or third-party hiring decisions.
        </p>

        <p className="mb-2">
          3. Permitted and Prohibited Conduct. You are granted a personal, non-exclusive, non-transferable license to search listings for bona fide personal employment purposes.
        </p>
        <p className="mb-2">
          - You agree not to reverse-engineer, systematically scrape, copy, or redistribute database contents without explicit written consent.
        </p>
        <p className="mb-2">
          - Automated querying, spamming employer links, or attempting unauthorized bypass of rate limiters will result in immediate IP termination.
        </p>

        <p className="mb-2">
          4. Accuracy of Requisitions and Third-Party Links. Requisition details, compensation ranges, and company metadata are compiled from public employer endpoints. While we execute sub-hourly health checks, employers may alter terms or retire openings without prior notice.
        </p>

        <p className="mb-2">
          5. Limitation of Liability. To the fullest extent permitted by applicable law, YourBrand shall not be held liable for any indirect, incidental, or consequential damages resulting from platform interactions or employment disputes.
        </p>

        <p className="mb-2">
          6. Governing Jurisdiction. These terms shall be construed and interpreted in accordance with applicable commercial laws, without regard to conflict of law principles.
        </p>

        <div className="pt-8 border-t border-gray-200 text-xs text-gray-400">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
