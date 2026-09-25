"use client";

import React, { useState } from "react";
import { CircleDollarSign, Wrench, Clock } from "lucide-react";

export default function ProductScreenshotMock() {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  return (
    <div className="w-full bg-[#F4F4F6] rounded-2xl sm:rounded-3xl border border-gray-200/80 p-3.5 sm:p-4 md:p-5 shadow-[0_20px_50px_rgba(15,23,42,0.12)] overflow-hidden text-left">
      <div className="flex flex-col md:flex-row items-stretch md:items-start gap-3.5 sm:gap-4">
        {/* Left Side: Minimalist Filters Card */}
        <div className="w-full md:w-[160px] lg:w-[168px] shrink-0 bg-white border border-[#E5E7EB] rounded-2xl p-3 sm:p-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <h3 className="text-sm sm:text-[15px] font-bold text-[#09090B] tracking-tight mb-2.5">
            Filters
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-1 gap-2 sm:gap-2.5">
            {/* Filter 1: Role */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                Role
              </label>
              <div className="w-full h-7 sm:h-7.5 px-3 rounded-lg border border-gray-200 bg-white flex items-center text-xs text-gray-400 select-none">
                Select...
              </div>
            </div>

            {/* Filter 2: Location */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                Location
              </label>
              <div className="w-full h-7 sm:h-7.5 px-3 rounded-lg border border-gray-200 bg-white flex items-center text-xs text-gray-400 select-none">
                Select...
              </div>
            </div>

            {/* Filter 3: Tools */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                Tools
              </label>
              <div className="w-full h-7 sm:h-7.5 px-3 rounded-lg border border-gray-200 bg-white flex items-center text-xs text-gray-400 select-none">
                Select...
              </div>
            </div>

            {/* Filter 4: Remote */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                Remote
              </label>
              <div className="w-full h-7 sm:h-7.5 px-3 rounded-lg border border-gray-200 bg-white flex items-center text-xs text-gray-400 select-none">
                Select...
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: 3-Layer Staggered Overlapping Cards */}
        <div className="relative flex-1 min-w-0">
          {/* Card 3 (Back Layer - Top Right) */}
          <div
            className="absolute z-0 top-0 left-[18px] sm:left-[36px] right-0 bottom-[50px] sm:bottom-[62px] bg-white border border-[#E5E7EB] rounded-2xl p-2.5 sm:p-3 shadow-[0_2px_6px_rgba(0,0,0,0.03)] pointer-events-none select-none overflow-hidden"
            aria-hidden="true"
          >
            <div className="space-y-0.5">
              <h4 className="font-bold text-[#09090B] text-sm sm:text-base md:text-lg tracking-tight truncate">
                Sales Development Representative
              </h4>
              <p className="text-xs text-gray-500 font-normal">
                Cribl
              </p>
            </div>
          </div>

          {/* Card 2 (Middle Layer) */}
          <div
            className="absolute z-10 top-[25px] sm:top-[31px] left-[9px] sm:left-[18px] right-[9px] sm:right-[18px] bottom-[25px] sm:bottom-[31px] bg-white border border-[#E5E7EB] rounded-2xl p-2.5 sm:p-3 shadow-[0_3px_10px_rgba(0,0,0,0.04)] pointer-events-none select-none overflow-hidden"
            aria-hidden="true"
          >
            <div className="space-y-0.5">
              <h4 className="font-bold text-[#09090B] text-sm sm:text-base md:text-lg tracking-tight truncate">
                Senior Product Designer
              </h4>
              <p className="text-xs text-gray-500 font-normal">
                Interface AI
              </p>
            </div>
          </div>

          {/* Card 1 (Front Layer - Main Focus) */}
          <div className="relative z-20 mt-[50px] sm:mt-[62px] mr-[18px] sm:mr-[36px] bg-white border border-[#E5E7EB] rounded-2xl p-3 sm:p-3.5 md:p-4 shadow-[0_6px_20px_rgba(0,0,0,0.06)]">
            <div className="space-y-1.5 sm:space-y-2">
              {/* Job Title & Company */}
              <div>
                <h4 className="font-bold text-[#09090B] text-base sm:text-lg md:text-xl tracking-tight">
                  Software Engineer
                </h4>
                <p className="text-xs text-gray-500 font-normal mt-0.5">
                  Tenable, Inc.
                </p>
              </div>

              {/* Salary Badge / Text with Amber Coin Icon */}
              <div className="flex items-center gap-1.5 text-xs sm:text-[13px] font-semibold text-[#D97706]">
                <CircleDollarSign className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
                <span>$106,000—$141,333.33 USD</span>
              </div>

              {/* Tools / Tech Stack with Wrench Icon */}
              <div className="flex items-start gap-1.5 text-[11px] sm:text-xs text-gray-600 leading-relaxed">
                <Wrench className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                <span>
                  Agile, API, Docker, Go, Java, Kotlin, Kubernetes, Linux, MySQL, PHP, PostgreSQL, SDLC, SQL
                </span>
              </div>

              {/* Verified Date with Clock Icon */}
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-500">
                <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span>November 14, 2026</span>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-2 pt-1 sm:pt-2">
                <a
                  href="/job-search/all"
                  className="bg-[#18181B] hover:bg-black text-white text-xs font-semibold px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors shadow-sm inline-flex items-center"
                >
                  Apply Now
                </a>
                <a
                  href="/job-search/all"
                  className="bg-[#18181B] hover:bg-black text-white text-xs font-semibold px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg transition-colors shadow-sm inline-flex items-center"
                >
                  + 6 more
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setLiked(!liked);
                    if (disliked) setDisliked(false);
                  }}
                  className={`border text-xs font-medium px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors ${
                    liked
                      ? "bg-blue-50 border-blue-400 text-blue-700"
                      : "bg-white hover:bg-gray-50 border-gray-300 text-gray-800"
                  }`}
                >
                  Like
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDisliked(!disliked);
                    if (liked) setLiked(false);
                  }}
                  className={`border text-xs font-medium px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors ${
                    disliked
                      ? "bg-red-50 border-red-400 text-red-700"
                      : "bg-white hover:bg-gray-50 border-gray-300 text-gray-800"
                  }`}
                >
                  Dislike
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
