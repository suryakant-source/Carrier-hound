"use client";

import React, { useState, useRef, useEffect } from "react";
import { SlidersHorizontal, ChevronDown, Check } from "lucide-react";

export interface CategoryPillItem {
  id: string;
  label: string;
  emoji: string;
  slug?: string;
}

export const MAIN_CATEGORY_PILLS: CategoryPillItem[] = [
  { id: "trending", label: "Trending", emoji: "🔥" },
  { id: "tech", label: "Tech", emoji: "💻" },
  { id: "design", label: "Design", emoji: "🎨" },
  { id: "marketing", label: "Marketing", emoji: "📈" },
  { id: "finance", label: "Finance", emoji: "💰" },
  { id: "data", label: "Data", emoji: "📊" },
  { id: "internships", label: "Internships", emoji: "🎓" },
  { id: "remote", label: "Remote", emoji: "🏠" },
  { id: "fresher", label: "Fresher Friendly", emoji: "⭐" },
];

export const MORE_CATEGORIES: CategoryPillItem[] = [
  { id: "product", label: "Product Management", emoji: "🎯", slug: "product" },
  { id: "hr", label: "HR & People", emoji: "👥", slug: "hr" },
  { id: "operations", label: "Operations", emoji: "⚙️", slug: "operations" },
  { id: "sales", label: "Sales & BD", emoji: "🤝", slug: "sales" },
  { id: "cyber-security", label: "Cyber Security", emoji: "🛡️", slug: "cyber-security" },
  { id: "qa-testing", label: "QA & Testing", emoji: "🧪", slug: "qa-testing" },
  { id: "customer-support", label: "Customer Support", emoji: "🎧", slug: "customer-support" },
  { id: "legal", label: "Legal & Compliance", emoji: "⚖️", slug: "legal" },
  { id: "healthcare", label: "Healthcare", emoji: "🏥", slug: "healthcare" },
];

interface CategoryPillBarProps {
  activeCategory: string | null;
  onSelectCategory: (id: string | null) => void;
  onOpenFilters: () => void;
  hasActiveFilters?: boolean;
}

export default function CategoryPillBar({
  activeCategory,
  onSelectCategory,
  onOpenFilters,
  hasActiveFilters = false,
}: CategoryPillBarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click or ESC
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setDropdownOpen(false);
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [dropdownOpen]);

  const isMoreActive = MORE_CATEGORIES.some((c) => c.id === activeCategory);
  const activeMoreItem = MORE_CATEGORIES.find((c) => c.id === activeCategory);

  const handlePillClick = (id: string) => {
    if (activeCategory === id) {
      onSelectCategory(null);
    } else {
      onSelectCategory(id);
    }
  };

  return (
    <div className="w-full bg-white border-b border-gray-200/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-2 sm:gap-3">
        {/* Left: Horizontally scrollable row of pills with right fade gradient */}
        <div className="relative flex-1 min-w-0 overflow-hidden">
          <div
            className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-0.5 pr-8"
            role="tablist"
            aria-label="Category Filters"
          >
            {MAIN_CATEGORY_PILLS.map((pill) => {
              const isActive = activeCategory === pill.id;

              return (
                <button
                  key={pill.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handlePillClick(pill.id)}
                  className={`snap-start shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[44px] rounded-full text-[13px] font-medium transition-colors duration-150 whitespace-nowrap cursor-pointer select-none border ${
                    isActive
                      ? "bg-[#2563EB] text-white border-[#2563EB]"
                      : "bg-transparent text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50/70"
                  }`}
                >
                  <span className="text-sm leading-none" aria-hidden="true">
                    {pill.emoji}
                  </span>
                  <span>{pill.label}</span>
                </button>
              );
            })}
          </div>

          {/* Subtle fade gradient on right edge to hint more pills on mobile */}
          <div
            className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10"
            aria-hidden="true"
          />
        </div>

        {/* Right End: Always pinned 'More' pill dropdown and 'Filter' pill */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 pl-1.5 sm:pl-3 border-l border-gray-200 relative z-20">
          {/* More Pill Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
              className={`inline-flex items-center gap-1 px-3 py-1.5 min-h-[44px] rounded-full text-[13px] font-medium transition-colors duration-150 whitespace-nowrap cursor-pointer select-none border ${
                isMoreActive
                  ? "bg-[#2563EB] text-white border-[#2563EB]"
                  : "bg-transparent text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50/70"
              }`}
            >
              <span>{activeMoreItem ? `${activeMoreItem.emoji} ${activeMoreItem.label.split(" ")[0]}` : "More"}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-150 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-56 max-h-80 overflow-y-auto rounded-xl bg-white border border-gray-200 shadow-xl py-1.5 z-50 animate-fadeIn"
                role="menu"
              >
                <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100">
                  Additional Categories
                </div>
                {MORE_CATEGORIES.map((item) => {
                  const isSelected = activeCategory === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        handlePillClick(item.id);
                        setDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-[13px] text-left transition-colors min-h-[40px] ${
                        isSelected
                          ? "bg-blue-50 text-blue-600 font-semibold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span aria-hidden="true">{item.emoji}</span>
                        <span>{item.label}</span>
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Filter Pill with Sliders icon */}
          <button
            type="button"
            onClick={onOpenFilters}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[44px] rounded-full text-[13px] font-medium transition-colors duration-150 whitespace-nowrap cursor-pointer select-none border ${
              hasActiveFilters
                ? "bg-blue-50 text-[#2563EB] border-blue-300 font-semibold"
                : "bg-transparent text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50/70"
            }`}
            aria-label="Open advanced filters"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter</span>
            {hasActiveFilters && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
