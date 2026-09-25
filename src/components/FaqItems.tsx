import React from "react";
import { HelpCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FaqHomeItemProps {
  question: string;
  answer: string;
  className?: string;
}

export function FaqHomeItem({ question, answer, className }: FaqHomeItemProps) {
  return (
    <div className={cn("py-6 border-b border-gray-200 last:border-b-0", className)}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-1">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[#2563EB]">
            <HelpCircle className="w-5 h-5" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-[#09090B] mb-2">{question}</h3>
          <p className="text-[#4B5563] text-base leading-relaxed">{answer}</p>
        </div>
      </div>
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
