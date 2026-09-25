import React from "react";
import Link from "next/link";
import BrandIcon from "./BrandIcon";
import DotPattern from "./DotPattern";

interface FooterProps {
  isGuide?: boolean;
}

export default function Footer({ isGuide = false }: FooterProps) {
  return (
    <footer className="relative bg-[#090E34] text-white pt-16 pb-12 overflow-hidden border-t border-slate-800 animate-fadeInUp">
      {/* Faint dot pattern in the top-right corner */}
      <div className="absolute top-0 right-0 pointer-events-none opacity-20">
        <DotPattern width={220} height={160} dotColor="#ffffff" rows={7} cols={10} />
      </div>

      <div className="max-w-content mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand + Tagline */}
          <div className="md:col-span-6 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <BrandIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">YourBrand</span>
            </Link>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              We find jobs posted on company websites. Real-time radar for unindexed remote engineering, design, data, and product jobs directly from verified company ATS endpoints.
            </p>
            <div className="pt-2 text-xs text-slate-500">
              Zero ghost listings. Zero spam agencies. 100% direct company ATS urls.
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Navigation</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/job-search/all" className="hover:text-white transition-colors">
                  Live Job Search
                </Link>
              </li>
              <li>
                <Link href="/worldwide" className="hover:text-white transition-colors">
                  Companies Hiring Worldwide
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Member Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column with Support, Privacy, Terms, Socials */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Links</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <a href="/#contact" className="hover:text-white transition-colors">
                  Support
                </a>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li className="pt-2 flex items-center gap-3 text-slate-400">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Twitter / X"
                  className="hover:text-white transition-colors"
                >
                  Twitter
                </a>
                <span>•</span>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="hover:text-white transition-colors"
                >
                  Facebook
                </a>
                <span>•</span>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="TikTok"
                  className="hover:text-white transition-colors"
                >
                  TikTok
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom row: copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} YourBrand Inc. All rights reserved. Not affiliated with any referenced brands.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-slate-300 transition-colors">
              Privacy
            </Link>
            <Link href="/terms-and-conditions" className="hover:text-slate-300 transition-colors">
              Terms
            </Link>
            <Link href="/worldwide" className="hover:text-slate-300 transition-colors">
              Worldwide Directory
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
