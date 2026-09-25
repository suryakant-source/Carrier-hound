"use client";

import React, { useState } from "react";
import Link from "next/link";
import BrandIcon from "./BrandIcon";
import { Menu, X, FileText, Briefcase, Globe } from "lucide-react";

export default function GuideHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Brand */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <BrandIcon className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-black text-blue-600 tracking-tight">YourBrand</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/job-search/all"
            className="text-sm font-medium text-[#4B5563] hover:text-[#09090B] transition-colors"
          >
            Hidden Jobs
          </Link>
          <Link
            href="/worldwide"
            className="text-sm font-medium text-[#4B5563] hover:text-[#09090B] transition-colors"
          >
            Companies Hiring
          </Link>
          <Link
            href="/resume"
            className="text-sm font-medium text-[#4B5563] hover:text-[#09090B] transition-colors"
          >
            Resume
          </Link>
          <Link
            href="/radar"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white hover:bg-cyan-950 hover:border-cyan-500 border border-slate-700 text-xs font-bold transition-all shadow-xs"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span>3D Radar</span>
          </Link>

          {/* Blue Sign In Button */}
          <Link
            href="/login"
            className="inline-flex items-center justify-center bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 min-h-[40px] rounded-lg text-sm font-semibold transition-colors shadow-sm"
          >
            Sign In
          </Link>
        </nav>

        {/* Mobile Right Controls: Menu pill */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gray-200 text-xs font-semibold text-gray-700 bg-white shadow-xs"
          >
            <Menu className="w-4 h-4" />
            <span>Menu</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end md:hidden animate-fadeIn">
          <div className="w-full max-w-xs bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    <BrandIcon className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-lg text-gray-900">YourBrand</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                  className="p-1 rounded-md text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 pt-6">
                <Link
                  href="/job-search/all"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-800 font-medium"
                >
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <span>Hidden Jobs Search</span>
                </Link>
                <Link
                  href="/worldwide"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-800 font-medium"
                >
                  <Globe className="w-4 h-4 text-blue-600" />
                  <span>Companies Hiring Worldwide</span>
                </Link>
                <Link
                  href="/resume"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-800 font-medium"
                >
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Resume</span>
                </Link>
                <Link
                  href="/radar"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-900 text-white font-medium shadow-sm"
                >
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                  <span>3D Globe Job Radar</span>
                </Link>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center bg-[#2563EB] text-white py-3 rounded-lg font-semibold text-sm shadow-sm"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
