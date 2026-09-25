import React from "react";
import Link from "next/link";
import GuideHeader from "@/components/GuideHeader";
import Footer from "@/components/Footer";
import { WORLDWIDE_COMPANIES } from "@/data/companies";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Companies Hiring Worldwide | YourBrand Directory",
  description: "Explore 150+ companies currently hiring international and worldwide remote talent across engineering, product, and design.",
};

export default function WorldwidePage() {
  return (
    <div className="min-h-screen bg-white text-[#09090B] flex flex-col">
      <GuideHeader />

      <main className="flex-1 py-16 sm:py-24">
        {/* Centered Header */}
        <div className="max-w-3xl mx-auto px-6 text-center space-y-6 mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tighter text-[#09090B]">
            Companies Hiring Worldwide
          </h1>

          <p className="text-[#4B5563] text-base md:text-xl max-w-xl mx-auto leading-relaxed">
            Verified distributed organizations actively hiring across global timezones without regional tax or location restrictions.
          </p>

          <div className="pt-2">
            <Link
              href="/job-search/all"
              className="inline-flex items-center gap-2 bg-black hover:bg-neutral-800 text-white font-semibold px-7 py-3.5 rounded-lg text-base transition-colors shadow-sm"
            >
              <span>View Jobs on YourBrand</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <p className="text-xs uppercase tracking-wider font-semibold text-gray-400 pt-4">
            Current worldwide job listings by company:
          </p>
        </div>

        {/* List ~770px wide: rows with py-4 and divider lines */}
        <div className="max-w-[770px] mx-auto px-6">
          <div className="divide-y divide-[#E4E4E7] border-y border-[#E4E4E7]">
            {WORLDWIDE_COMPANIES.map((company) => (
              <div
                key={company.id}
                className="py-4 flex items-center justify-between hover:bg-slate-50/80 px-2 transition-colors group"
              >
                <Link
                  href={`/job-search/all?search=${encodeURIComponent(company.name)}`}
                  className="text-lg font-medium text-[#09090B] group-hover:text-blue-600 transition-colors"
                >
                  {company.name}
                </Link>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 font-mono">
                    {company.jobCount} jobs
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 group-hover:text-blue-600 transition-all -translate-x-1 group-hover:translate-x-0" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
