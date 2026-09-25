import React from "react";
import Link from "next/link";
import BrandIcon from "@/components/BrandIcon";

export const metadata = {
  title: "Privacy Policy | YourBrand",
  description: "Privacy policy and data protection terms for YourBrand job discovery service.",
};

export default function PrivacyPolicyPage() {
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
          Privacy Policy
        </h1>
        <p className="text-xs text-gray-400 font-mono">Last Updated: September 24, 2026</p>

        <p className="mb-2">
          1. Information We Collect. YourBrand collects information you provide directly to us when creating an account, subscribing to job alert notifications, or contacting customer support. This may include your email address, career preferences, target job titles, and communication logs.
        </p>
        <p className="mb-2">
          - We automatically collect diagnostic telemetry such as browser version, operating system, IP address, and anonymized referral links to protect service integrity and prevent scraping abuse.
        </p>
        <p className="mb-2">
          - We do not store financial payment credentials; all checkout transactions are processed directly by our compliant payment providers.
        </p>

        <p className="mb-2">
          2. How We Use Collected Data. We utilize collected records solely to furnish, personalize, and improve our career radar services. This comprises:
        </p>
        <p className="mb-2">
          - Delivering transactional login verification magic links and account authentication tokens.
        </p>
        <p className="mb-2">
          - Dispatching personalized daily or weekly alert notifications corresponding to your specified category filters.
        </p>
        <p className="mb-2">
          - Detecting fraudulent bot automation or automated scraping behavior against our indexing pipelines.
        </p>

        <p className="mb-2">
          3. Third-Party Integrations. When you click an &ldquo;Apply&rdquo; or destination link, you are directed to third-party employer applicant tracking systems (such as Greenhouse, Lever, Ashby, or Workday). YourBrand does not share your private resume data with these employers unless you explicitly submit through their native web forms.
        </p>

        <p className="mb-2">
          4. Cookies and Local Storage. We utilize minimal local storage and session cookies necessary to maintain authentication states and remember your active search filter preferences. You may disable cookies in your browser settings at any time without impacting public listing visibility.
        </p>

        <p className="mb-2">
          5. Data Retention and Erasure. You retain the right to request full deletion of your user profile and registered email alerts. Requests may be transmitted to privacy@yourbrand.example.com and will be executed within 30 business days.
        </p>

        <p className="mb-2">
          6. Policy Revisions. We reserve the authority to amend this Privacy Policy periodically. Substantial updates will be accompanied by an updated timestamp above and a notification banner within user dashboards.
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
