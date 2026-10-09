"use client";

import React, { useState, useMemo } from "react";
import {
  X,
  Copy,
  Download,
  Check,
  Sparkles,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  GraduationCap,
  Eye,
  FileCode,
} from "lucide-react";
import { CandidateProfile } from "@/lib/resume/types";
import { extractSkillsFromJob } from "@/lib/matcher/scoring";
import {
  downloadAtsResumeDocx,
  downloadAtsResumeText,
  buildAtsResumePlainText,
} from "@/lib/resume/tailor";
import { toast } from "react-toastify";

interface TailorResumeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: CandidateProfile;
  job: {
    id?: string;
    title: string;
    company: string;
    location?: string;
    category?: string;
    skills?: string[];
    description?: string;
  };
  onOpenCoverLetter?: () => void;
}

export default function TailorResumeModal({
  open,
  onOpenChange,
  candidate,
  job,
  onOpenCoverLetter,
}: TailorResumeModalProps) {
  const [copied, setCopied] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);

  // Extract evidenced skills from this job requisition
  const jobSkills = useMemo(() => {
    return extractSkillsFromJob({
      title: job.title,
      category: job.category,
      skills: job.skills,
      description: job.description || `${job.title} ${job.category || ""}`,
    });
  }, [job]);

  // Skill matching: normalize & detect overlap
  const { matchedSkills, otherSkills, missingSkills } = useMemo(() => {
    const candidateSkills = candidate?.skills || [];
    const matched: string[] = [];
    const others: string[] = [];

    candidateSkills.forEach((s) => {
      const isMatched = jobSkills.some(
        (js) =>
          js.toLowerCase() === s.toLowerCase() ||
          s.toLowerCase().includes(js.toLowerCase()) ||
          js.toLowerCase().includes(s.toLowerCase())
      );
      if (isMatched) {
        matched.push(s);
      } else {
        others.push(s);
      }
    });

    const missing = jobSkills.filter(
      (js) =>
        !candidateSkills.some(
          (cs) =>
            cs.toLowerCase() === js.toLowerCase() ||
            cs.toLowerCase().includes(js.toLowerCase()) ||
            js.toLowerCase().includes(cs.toLowerCase())
        )
    );

    return { matchedSkills: matched, otherSkills: others, missingSkills: missing };
  }, [candidate, jobSkills]);

  // Build tailored candidate profile:
  // Re-orders skills so role-matched skills appear at the very beginning of the ATS skills list.
  // Never hallucinates or invents non-existent experience.
  const tailoredCandidate = useMemo<CandidateProfile>(() => {
    const orderedSkills = [...matchedSkills, ...otherSkills];
    return {
      ...candidate,
      skills: orderedSkills,
    };
  }, [candidate, matchedSkills, otherSkills]);

  const resumeText = useMemo(() => {
    return buildAtsResumePlainText(tailoredCandidate);
  }, [tailoredCandidate]);

  if (!open) return null;

  const handleDownloadDocx = () => {
    const filename = `${(candidate.name || "Resume").replace(/\s+/g, "_")}_Tailored_${(job.company || "Company").replace(/\s+/g, "_")}_ATS.docx`;
    downloadAtsResumeDocx(tailoredCandidate, filename);
    toast.success(`Downloaded ATS Word document tailored for ${job.company}!`);
  };

  const handleDownloadTxt = () => {
    const filename = `${(candidate.name || "Resume").replace(/\s+/g, "_")}_Tailored_${(job.company || "Company").replace(/\s+/g, "_")}_ATS.txt`;
    downloadAtsResumeText(tailoredCandidate, filename);
    toast.success("Downloaded plain text ATS resume!");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(resumeText);
    setCopied(true);
    toast.success("Tailored resume copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[92dvh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-start justify-between relative">
          <div className="pr-8 space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Sparkles className="w-3 h-3" /> ATS Skill Highlighting
              </span>
              <span className="text-xs text-slate-400 font-mono">Zero Hallucinations</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white line-clamp-1">{job.title}</h2>
            <p className="text-xs sm:text-sm text-slate-300">
              {job.company} • {job.location || "Remote"}
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

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* Explanation Banner */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-slate-900">
                Grounded 100% in your verified resume facts
              </p>
              <p className="text-slate-600">
                ATS Skill Highlighting prioritizes and reorganizes your verified skills so the core requirements for <strong>{job.company}</strong> appear front and center for applicant tracking parsers. No fake credentials or hallucinations are generated.
              </p>
            </div>
          </div>

          {/* Matched Skills Highlighting */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Matched Skills Prioritized in Export ({matchedSkills.length})</span>
              </h3>
              <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Promoted to Top of Skills List
              </span>
            </div>

            <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100 flex flex-wrap gap-1.5">
              {matchedSkills.length > 0 ? (
                matchedSkills.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-emerald-800 border border-emerald-200 shadow-2xs"
                  >
                    ✓ {s}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500 italic">
                  No direct keyword overlap found with this job description. Your full verified skill list will still be exported.
                </span>
              )}
            </div>
          </div>

          {/* Missing Skills Warning */}
          {missingSkills.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Job Requirements Missing from Resume ({missingSkills.length})</span>
              </h3>
              <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-200 flex flex-wrap gap-1.5">
                {missingSkills.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-white text-amber-900 border border-amber-200"
                  >
                    + {s}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 italic">
                These skills were found in the job listing. Prepare to discuss relevant project exposure during interviews.
              </p>
            </div>
          )}

          {/* Preview Toggle & Plain Text Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowFullPreview(!showFullPreview)}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{showFullPreview ? "Hide Resume Preview" : "View Tailored ATS Text Preview"}</span>
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy Text"}</span>
              </button>
            </div>

            {showFullPreview && (
              <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed max-h-64 overflow-y-auto whitespace-pre-wrap border border-slate-800">
                {resumeText}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onOpenCoverLetter && (
              <button
                type="button"
                onClick={() => {
                  onOpenChange(false);
                  onOpenCoverLetter();
                }}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer py-2 px-1"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Need Cover Letter Instead? →</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleDownloadTxt}
              className="px-3.5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition cursor-pointer min-h-[44px] flex items-center gap-1.5"
            >
              <FileCode className="w-3.5 h-3.5 text-slate-500" />
              <span>Export Text (.txt)</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadDocx}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-bold shadow-xs transition cursor-pointer min-h-[44px] flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Aligned ATS (.docx)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
