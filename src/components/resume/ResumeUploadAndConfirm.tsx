"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  Download,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Building,
  Briefcase,
  GraduationCap,
  Award,
  Calendar,
  Check,
  FileCheck,
  ShieldCheck,
  Info,
} from "lucide-react";
import {
  CandidateProfile,
  WorkExperienceItem,
  EducationItem,
  ParsedResumeResult,
} from "@/lib/resume/types";
import { extractTextFromFile, parseResumeText, getSampleCandidateProfile } from "@/lib/resume/parser";
import {
  getCandidateProfile,
  saveCandidateProfileLocally,
  saveCandidateProfileToSupabase,
} from "@/lib/resume/storage";
import {
  downloadAtsResumeDocx,
  downloadAtsResumeText,
} from "@/lib/resume/tailor";
import { extractResumeFactsWithGroq, getGroqApiKey } from "@/lib/ai/groq";
import Link from "next/link";

export default function ResumeUploadAndConfirm() {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newSkillInput, setNewSkillInput] = useState("");
  const [newCertInput, setNewCertInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load existing profile on mount
  useEffect(() => {
    getCandidateProfile().then((p) => {
      setProfile(p);
    });
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    setParseError(null);
    setIsSaved(false);

    try {
      const text = await extractTextFromFile(file);
      if (!text || text.trim().length < 40) {
        throw new Error(
          "Could not extract sufficient text from this file. Please ensure the document is not an image-only scan or password-protected."
        );
      }

      const parsed: ParsedResumeResult = parseResumeText(text);
      let profileResult = parsed.profile;
      if (getGroqApiKey()) {
        profileResult = await extractResumeFactsWithGroq(text, parsed.profile);
      }
      setProfile(profileResult);
    } catch (err: any) {
      console.error("Resume parsing error:", err);
      setParseError(
        err?.message || "Failed to parse resume document. You can try our sample profile or paste plain text."
      );
    } finally {
      setIsParsing(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleLoadSample = () => {
    const sample = getSampleCandidateProfile();
    setProfile(sample);
    setIsSaved(false);
    setParseError(null);
  };

  // Skill manipulations
  const handleAddSkill = () => {
    if (!newSkillInput.trim() || !profile) return;
    const clean = newSkillInput.trim();
    if (!profile.skills.some((s) => s.toLowerCase() === clean.toLowerCase())) {
      setProfile({
        ...profile,
        skills: [...profile.skills, clean],
      });
    }
    setNewSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    if (!profile) return;
    setProfile({
      ...profile,
      skills: profile.skills.filter((s) => s !== skillToRemove),
    });
  };

  // Certification manipulations
  const handleAddCert = () => {
    if (!newCertInput.trim() || !profile) return;
    const clean = newCertInput.trim();
    if (!profile.certifications.some((c) => c.toLowerCase() === clean.toLowerCase())) {
      setProfile({
        ...profile,
        certifications: [...profile.certifications, clean],
      });
    }
    setNewCertInput("");
  };

  const handleRemoveCert = (certToRemove: string) => {
    if (!profile) return;
    setProfile({
      ...profile,
      certifications: profile.certifications.filter((c) => c !== certToRemove),
    });
  };

  // Experience manipulations
  const handleUpdateExperience = (
    index: number,
    field: keyof WorkExperienceItem,
    value: any
  ) => {
    if (!profile) return;
    const updated = [...profile.experience];
    updated[index] = { ...updated[index], [field]: value };
    // If user edited dates or company, auto-clear needsReview if both are filled
    if (field === "startDate" || field === "endDate" || field === "company") {
      const exp = updated[index];
      if (exp.company && exp.startDate && exp.role) {
        exp.needsReview = false;
      }
    }
    setProfile({ ...profile, experience: updated });
  };

  const handleToggleExpReview = (index: number) => {
    if (!profile) return;
    const updated = [...profile.experience];
    updated[index].needsReview = !updated[index].needsReview;
    setProfile({ ...profile, experience: updated });
  };

  const handleAddExperience = () => {
    if (!profile) return;
    const newExp: WorkExperienceItem = {
      id: `exp-${Date.now()}`,
      company: "Company Name",
      role: "Software Engineer",
      startDate: "2023",
      endDate: "Present",
      bullets: ["Built scalable backend services and UI features."],
      needsReview: false,
    };
    setProfile({
      ...profile,
      experience: [newExp, ...profile.experience],
    });
  };

  const handleRemoveExperience = (index: number) => {
    if (!profile) return;
    const updated = profile.experience.filter((_, i) => i !== index);
    setProfile({ ...profile, experience: updated });
  };

  // Education manipulations
  const handleUpdateEducation = (
    index: number,
    field: keyof EducationItem,
    value: any
  ) => {
    if (!profile) return;
    const updated = [...profile.education];
    updated[index] = { ...updated[index], [field]: value };
    if (updated[index].institution && updated[index].degree && updated[index].year) {
      updated[index].needsReview = false;
    }
    setProfile({ ...profile, education: updated });
  };

  const handleAddEducation = () => {
    if (!profile) return;
    const newEdu: EducationItem = {
      id: `edu-${Date.now()}`,
      degree: "Bachelor of Science in Computer Science",
      institution: "University Name",
      year: "2022",
      needsReview: false,
    };
    setProfile({
      ...profile,
      education: [newEdu, ...profile.education],
    });
  };

  const handleRemoveEducation = (index: number) => {
    if (!profile) return;
    const updated = profile.education.filter((_, i) => i !== index);
    setProfile({ ...profile, education: updated });
  };

  // Save confirmed facts
  const handleSaveConfirmedProfile = async () => {
    if (!profile) return;
    setIsSaving(true);
    try {
      const confirmedProfile: CandidateProfile = {
        ...profile,
        confirmedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      saveCandidateProfileLocally(confirmedProfile);
      await saveCandidateProfileToSupabase(confirmedProfile);
      setProfile(confirmedProfile);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 4000);
    } catch (err) {
      console.warn("Error saving profile", err);
    } finally {
      setIsSaving(false);
    }
  };

  const countNeedsReview = () => {
    if (!profile) return 0;
    const expUnclear = profile.experience.filter((e) => e.needsReview).length;
    const eduUnclear = profile.education.filter((e) => e.needsReview).length;
    return expUnclear + eduUnclear;
  };

  const needsReviewTotal = countNeedsReview();

  return (
    <div className="space-y-8">
      {/* Upload & Dropzone Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Zero-Hallucination Fact Extraction</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Upload Your Resume for AI Fit & ATS Export
          </h2>

          <p className="text-sm text-slate-600 leading-relaxed max-w-xl mx-auto">
            Upload your existing resume in <strong>PDF</strong> or <strong>DOCX</strong> format. We extract verified skills, job timelines, and education. We never invent facts—any unclear lines are flagged for your confirmation.
          </p>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleFileUpload}
            className="hidden"
            id="resume-file-input"
          />

          {/* Dropzone Container */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="mt-6 border-2 border-dashed border-blue-200 hover:border-blue-400 bg-blue-50/40 hover:bg-blue-50/70 rounded-2xl p-8 sm:p-10 cursor-pointer transition-all flex flex-col items-center justify-center gap-3 text-center group"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              {isParsing ? (
                <RefreshCw className="w-6 h-6 animate-spin" />
              ) : (
                <UploadCloud className="w-7 h-7" />
              )}
            </div>

            <div className="space-y-1">
              <span className="text-sm sm:text-base font-bold text-slate-800">
                {isParsing ? "Parsing Document Facts..." : "Click or drag resume here to upload"}
              </span>
              <p className="text-xs text-slate-500">
                Supports PDF (.pdf), Microsoft Word (.docx), or Text (.txt) up to 10MB
              </p>
            </div>
          </div>

          {parseError && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>{parseError}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setParseError(null);
                  fileInputRef.current?.click();
                }}
                className="px-3 py-1.5 min-h-[36px] bg-amber-200 hover:bg-amber-300 active:scale-[0.98] rounded-lg font-bold text-amber-900 transition cursor-pointer self-start sm:self-auto shrink-0"
              >
                Retry Upload
              </button>
            </div>
          )}

          <div className="pt-2 flex items-center justify-center gap-3">
            <span className="text-xs text-slate-400">or</span>
            <button
              type="button"
              onClick={handleLoadSample}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1 cursor-pointer min-h-[44px] py-2 px-1"
            >
              <FileCheck className="w-3.5 h-3.5" />
              Load Sample Software Engineer Resume
            </button>
          </div>

        </div>
      </div>

      {/* Fact Review & Confirmation Section */}
      {profile && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-8 animate-fadeInUp">
          {/* Header & Verification Banner */}
          <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Extracted Facts Review
                </h3>
                {profile.confirmedAt ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <Check className="w-3 h-3 text-emerald-600" />
                    Confirmed
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                    Review Before Saving
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Verify your extracted profile details below. Changes are saved directly to your account.
              </p>
            </div>

            {/* ATS Download Quick Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => downloadAtsResumeDocx(profile)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                title="Download ATS-Optimized Word Doc"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                <span>Export ATS Word (.doc)</span>
              </button>
              <button
                type="button"
                onClick={() => downloadAtsResumeText(profile)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                title="Download ATS Plain Text"
              >
                <FileText className="w-3.5 h-3.5 text-slate-600" />
                <span>Export Plain Text</span>
              </button>
            </div>
          </div>

          {/* Attention Banner if items need review */}
          {needsReviewTotal > 0 && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <strong className="font-bold">
                  {needsReviewTotal} item{needsReviewTotal > 1 ? "s" : ""} need{needsReviewTotal === 1 ? "s" : ""} review:
                </strong>{" "}
                Some dates or company names were ambiguous in your resume file. Please verify them below before confirming.
              </div>
            </div>
          )}

          {/* Section 1: Personal Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              1. Candidate Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-blue-500 bg-white"
                  placeholder="e.g. Alex Johnson"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-blue-500 bg-white"
                  placeholder="alex@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-blue-500 bg-white"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Location / Timezone</label>
                <input
                  type="text"
                  value={profile.location || ""}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-blue-500 bg-white"
                  placeholder="Remote / San Francisco, CA"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="sm:col-span-1">
                <label className="block text-xs font-medium text-slate-700 mb-1">Target Headline / Title</label>
                <input
                  type="text"
                  value={profile.headline}
                  onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-blue-500 bg-white"
                  placeholder="e.g. Senior Full-Stack Engineer"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">Professional Summary</label>
                <textarea
                  rows={2}
                  value={profile.summary}
                  onChange={(e) => setProfile({ ...profile, summary: e.target.value })}
                  className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-blue-500 bg-white resize-none"
                  placeholder="Brief summary of engineering background..."
                />
              </div>
            </div>
          </div>

          {/* Section 2: Skills Taxonomy */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                2. Extracted Technical Skills ({profile.skills.length})
              </h4>
              <span className="text-[11px] text-slate-400">Used for deterministic match scoring</span>
            </div>

            <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-xl border border-slate-200 min-h-[60px]">
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-white text-slate-800 border border-slate-300 shadow-2xs group"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-slate-400 hover:text-red-500 transition cursor-pointer"
                    title={`Remove ${skill}`}
                  >
                    ×
                  </button>
                </span>
              ))}

              {profile.skills.length === 0 && (
                <span className="text-xs text-slate-400 italic">No skills added yet. Type below to add.</span>
              )}
            </div>

            <div className="flex items-center gap-2 max-w-sm">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
                placeholder="Add skill (e.g. Docker, Rust, GraphQL)"
                className="text-xs px-3.5 py-2.5 min-h-[44px] rounded-xl border border-slate-300 focus:outline-blue-500 bg-white flex-1"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2.5 min-h-[44px] rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 active:scale-[0.98] transition-all duration-150 cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

          </div>

          {/* Section 3: Work Experience Timeline */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                3. Work Experience Timeline ({profile.experience.length})
              </h4>
              <button
                type="button"
                onClick={handleAddExperience}
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Position</span>
              </button>
            </div>

            <div className="space-y-4">
              {profile.experience.map((exp, idx) => (
                <div
                  key={exp.id || idx}
                  className={`p-4 sm:p-5 rounded-xl border transition-all ${
                    exp.needsReview
                      ? "bg-amber-50/40 border-amber-300"
                      : "bg-slate-50/60 border-slate-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-slate-500" />
                      <span className="text-xs font-bold text-slate-700">Position #{idx + 1}</span>
                      {exp.needsReview && (
                        <button
                          type="button"
                          onClick={() => handleToggleExpReview(idx)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900 cursor-pointer hover:bg-amber-300"
                          title="Click to mark confirmed"
                        >
                          <AlertTriangle className="w-3 h-3 text-amber-700" />
                          <span>Needs Review (Click to Confirm)</span>
                        </button>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveExperience(idx)}
                      className="text-slate-400 hover:text-red-500 text-xs p-1 cursor-pointer"
                      title="Remove position"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Company</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => handleUpdateExperience(idx, "company", e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-blue-500 bg-white"
                        placeholder="Company Name"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Role / Title</label>
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) => handleUpdateExperience(idx, "role", e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-blue-500 bg-white"
                        placeholder="e.g. Senior Frontend Engineer"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Start Date</label>
                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={(e) => handleUpdateExperience(idx, "startDate", e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-blue-500 bg-white"
                        placeholder="e.g. Jan 2022"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">End Date</label>
                      <input
                        type="text"
                        value={exp.endDate}
                        onChange={(e) => handleUpdateExperience(idx, "endDate", e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-blue-500 bg-white"
                        placeholder="e.g. Present"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Key Responsibilities & Impact (1 bullet per line)
                    </label>
                    <textarea
                      rows={2}
                      value={(exp.bullets || []).join("\n")}
                      onChange={(e) =>
                        handleUpdateExperience(
                          idx,
                          "bullets",
                          e.target.value.split("\n").filter((l) => l.trim().length > 0)
                        )
                      }
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-blue-500 bg-white"
                      placeholder="Enter bullets (one per line)..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Education & Certifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
            {/* Education */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  4. Education ({profile.education.length})
                </h4>
                <button
                  type="button"
                  onClick={handleAddEducation}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Degree</span>
                </button>
              </div>

              <div className="space-y-3">
                {profile.education.map((edu, idx) => (
                  <div
                    key={edu.id || idx}
                    className={`p-3.5 rounded-xl border ${
                      edu.needsReview ? "bg-amber-50/50 border-amber-300" : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-[11px] font-bold text-slate-700">Degree #{idx + 1}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveEducation(idx)}
                        className="text-slate-400 hover:text-red-500 text-xs cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => handleUpdateEducation(idx, "degree", e.target.value)}
                        placeholder="Degree / Major"
                        className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => handleUpdateEducation(idx, "institution", e.target.value)}
                          placeholder="Institution"
                          className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                        />
                        <input
                          type="text"
                          value={edu.year}
                          onChange={(e) => handleUpdateEducation(idx, "year", e.target.value)}
                          placeholder="Graduation Year"
                          className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                5. Certifications ({profile.certifications.length})
              </h4>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 min-h-[100px] flex flex-wrap gap-2">
                {profile.certifications.map((cert) => (
                  <span
                    key={cert}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white text-slate-800 border border-slate-200 shadow-2xs"
                  >
                    <Award className="w-3 h-3 text-amber-500" />
                    <span>{cert}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCert(cert)}
                      className="text-slate-400 hover:text-red-500 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {profile.certifications.length === 0 && (
                  <span className="text-xs text-slate-400 italic">No certifications listed</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newCertInput}
                  onChange={(e) => setNewCertInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCert())}
                  placeholder="e.g. AWS Certified Solutions Architect"
                  className="text-xs px-3.5 py-2.5 min-h-[44px] rounded-xl border border-slate-300 bg-white flex-1 focus:outline-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddCert}
                  className="px-4 py-2.5 min-h-[44px] rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 active:scale-[0.98] transition-all duration-150 cursor-pointer"
                >
                  Add
                </button>
              </div>

            </div>
          </div>

          {/* Confirm & Save Actions (Sticky on Mobile) */}
          <div className="pt-4 border-t border-slate-200 sticky bottom-0 bg-white/95 backdrop-blur-xs py-3 -mx-6 sm:mx-0 px-6 sm:px-0">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500 text-center sm:text-left">
                {isSaved ? (
                  <span className="text-emerald-600 font-bold flex items-center gap-1 justify-center sm:justify-start">
                    <CheckCircle2 className="w-4 h-4" />
                    Facts confirmed and synced to your profile!
                  </span>
                ) : (
                  <span>
                    Saving binds your verified facts to real-time deterministic match scores across all job postings.
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleSaveConfirmedProfile}
                  disabled={isSaving}
                  className="w-full sm:w-auto px-6 py-3.5 min-h-[44px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl font-bold text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <span>Saving Profile...</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-blue-200" />
                      <span>Confirm Facts & Save Profile</span>
                    </>
                  )}
                </button>

                <Link
                  href="/job-search/all"
                  className="hidden md:inline-flex items-center gap-1.5 px-5 py-3.5 rounded-xl border border-slate-300 hover:bg-slate-50 font-bold text-sm text-slate-700 transition"
                >
                  <span>Browse Jobs</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
