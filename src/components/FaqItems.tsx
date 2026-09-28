"use client";

import React, { useState } from "react";
import { Plus, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FaqHomeItemProps {
  question: string;
  answer: string;
  defaultOpen?: boolean;
  className?: string;
}

export function FaqHomeItem({ question, answer, defaultOpen = false, className }: FaqHomeItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={cn("py-3 sm:py-3.5 border-b border-gray-200 last:border-b-0", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-4 text-left group focus:outline-none cursor-pointer"
        aria-expanded={isOpen}
      >
        <span className="text-base sm:text-lg font-bold text-[#09090B] group-hover:text-[#2563EB] transition-colors">
          {question}
        </span>
        <span
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-200",
            isOpen
              ? "bg-blue-50 text-[#2563EB] rotate-45"
              : "bg-gray-100 text-gray-600 group-hover:bg-blue-50 group-hover:text-[#2563EB]"
          )}
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
        </span>
      </button>

      {isOpen && (
        <div className="pt-3 pb-1 text-[#4B5563] text-sm sm:text-base leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

interface FaqGuidesItemProps {
  question: string;
  answer: string;
  defaultOpen?: boolean;
  className?: string;
}

export function FaqGuidesItem({ question, answer, defaultOpen = false, className }: FaqGuidesItemProps) {
  return (
    <details
      open={defaultOpen}
      className={cn(
        "group border-b border-[#E4E4E7] py-2 transition-colors",
        className
      )}
    >
      <summary className="grid grid-cols-[1fr_2.25rem] items-center min-h-[64px] cursor-pointer list-none select-none text-left">
        <span className="text-lg font-semibold text-[#09090B] group-open:text-[#2563EB] transition-colors pr-4">
          {question}
        </span>
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 group-hover:bg-blue-50 text-gray-500 group-hover:text-[#2563EB] transition-transform duration-200 group-open:rotate-180">
          <ChevronDown className="w-4 h-4" />
        </span>
      </summary>
      <div className="pb-5 pt-1 text-[rgb(99,115,129)] text-base leading-relaxed">
        <p>{answer}</p>
      </div>
    </details>
  );
}
