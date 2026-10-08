"use client";

import React, { useState, useEffect } from "react";
import { X, Copy, Download, Check, Sparkles, FileText, ArrowRight } from "lucide-react";
import { CandidateProfile } from "@/lib/resume/types";
import { generateTailoredCoverLetter } from "@/lib/resume/tailor";
import { generateGroqTailoredCoverLetter, getGroqApiKey } from "@/lib/ai/groq";
import { toast } from "react-toastify";

interface CoverLetterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: CandidateProfile;
  job: {
    title: string;
    company: string;
    description?: string;
  };
}

export default function CoverLetterModal({
  open,
  onOpenChange,
  candidate,
  job,
}: CoverLetterModalProps) {
  const [content, setContent] = useState("");
  const [copied, setCopied] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  useEffect(() => {
    if (open && candidate && job) {
      // 1. Instantly set deterministic baseline
      const result = generateTailoredCoverLetter(candidate, job);
      setContent(result.fullText);

      // 2. If Groq API Key is configured, enhance with SMART_MODEL (openai/gpt-oss-120b)
      if (getGroqApiKey()) {
        setIsGeneratingAi(true);
        generateGroqTailoredCoverLetter(candidate, job)
          .then((aiText) => {
            if (aiText) setContent(aiText);
          })
          .finally(() => {
            setIsGeneratingAi(false);
          });
      }
    }
  }, [open, candidate, job]);

  if (!open) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("Cover letter copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Cover_Letter_${job.company.replace(/\s+/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Cover letter downloaded as text file!");
  };

  const handleDownloadDoc = () => {
    // Generate clean Word-compatible document
    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Cover Letter - ${job.company}</title>
<style>body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.5; margin: 1in; white-space: pre-line; }</style>
</head>
<body>${content.replace(/\n/g, "<br>")}</body>
</html>`;
    const blob = new Blob([html], { type: "application/msword;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Cover_Letter_${job.company.replace(/\s+/g, "_")}.doc`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Cover letter downloaded as Word document!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[92dvh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white flex items-start justify-between relative">
          <div className="pr-8 space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-xs">
                <Sparkles className={`w-3 h-3 ${isGeneratingAi ? "animate-spin text-cyan-300" : "text-yellow-300"}`} />
                {isGeneratingAi ? "Refining with Groq SMART_MODEL..." : "1-Click Tailored Cover Letter"}
              </span>
              <span className="text-xs text-blue-200">Grounded in verified facts</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white line-clamp-1">
              Application for {job.title}
            </h2>
            <p className="text-xs sm:text-sm text-blue-100">
              Prepared for {job.company} • Matches confirmed skills
            </p>
          </div>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer min-h-[44px] min-w-[44px]"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
            <span>You can review and edit this letter directly before submitting:</span>
            <span className="font-mono text-slate-400">{content.length} characters</span>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={14}
            className="w-full p-4 rounded-xl border border-slate-200 font-sans text-xs sm:text-sm text-slate-800 leading-relaxed focus:ring-2 focus:ring-blue-500 focus:outline-hidden resize-none bg-slate-50/50"
            placeholder="Generated cover letter will appear here..."
          />
        </div>

        {/* Action Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadDoc}
              className="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer min-h-[44px]"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Download Word (.doc)</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadTxt}
              className="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer min-h-[44px]"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Download (.txt)</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-md flex items-center gap-1.5 transition-all cursor-pointer min-h-[44px]"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy to Clipboard</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
