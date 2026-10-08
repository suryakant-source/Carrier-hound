import { CandidateProfile } from "../resume/types";
import { SKILLS_TAXONOMY } from "../resume/parser";

export interface FitDiagnosticsResult {
  score: number; // 0 to 100
  scoreGrade: "high" | "good" | "moderate" | "low";
  matchedSkills: string[];
  missingSkills: string[];
  whyYouFit: string[];
  gaps: string[];
  jobRequiredSkills: string[];
  breakdown: {
    skillScore: number;
    titleScore: number;
    experienceScore: number;
    remoteScore: number;
  };
}

/**
 * Extracts key technical skills mentioned in a job listing
 */
export function extractSkillsFromJob(job: {
  title?: string;
  description?: string;
  category?: string;
  skills?: string[];
}): string[] {
  const detected = new Set<string>();

  // If the job already has explicit skills array in Supabase
  if (Array.isArray(job.skills) && job.skills.length > 0) {
    job.skills.forEach((s) => detected.add(s));
  }

  const combinedText = ` ${job.title || ""} ${job.category || ""} ${job.description || ""} `.toLowerCase();

  for (const skill of SKILLS_TAXONOMY) {
    const lowerSkill = skill.toLowerCase();
    const escaped = lowerSkill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(?:^|[\\s,;/|])${escaped}(?:$|[\\s,;/|])`, "i");
    if (regex.test(combinedText)) {
      detected.add(skill);
    }
  }

  // Fallback if very few skills detected in short teaser
  if (detected.size === 0) {
    const titleLower = (job.title || "").toLowerCase();
    if (titleLower.includes("frontend") || titleLower.includes("react")) {
      detected.add("React");
      detected.add("JavaScript");
      detected.add("TypeScript");
    } else if (titleLower.includes("backend") || titleLower.includes("node")) {
      detected.add("Node.js");
      detected.add("SQL");
      detected.add("REST API");
    } else if (titleLower.includes("full") || titleLower.includes("stack")) {
      detected.add("JavaScript");
      detected.add("TypeScript");
      detected.add("React");
      detected.add("Node.js");
    } else if (titleLower.includes("devops") || titleLower.includes("cloud")) {
      detected.add("Docker");
      detected.add("Kubernetes");
      detected.add("AWS");
    } else if (titleLower.includes("data") || titleLower.includes("python")) {
      detected.add("Python");
      detected.add("SQL");
    } else {
      detected.add("Software Engineering");
    }
  }

  return Array.from(detected);
}

/**
 * Computes a 100% deterministic fit score (0-100) and diagnostics breakdown.
 * Same resume + same job ALWAYS produces the exact same score.
 */
export function computeFitDiagnostics(
  candidate: CandidateProfile,
  job: {
    id?: string;
    title: string;
    company: string;
    description?: string;
    location?: string;
    remote_scope?: string;
    category?: string;
    skills?: string[];
    salary_text?: string;
  }
): FitDiagnosticsResult {
  const candidateSkills = (candidate.skills || []).map((s) => s.toLowerCase());
  const jobSkills = extractSkillsFromJob(job);

  // 1. Skill Match Component (Weight: 50%)
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  for (const skill of jobSkills) {
    if (candidateSkills.includes(skill.toLowerCase())) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  }

  const skillRatio = jobSkills.length > 0 ? matchedSkills.length / jobSkills.length : 0.8;
  const skillScore = Math.round(skillRatio * 50);

  // 2. Title & Role Alignment (Weight: 25%)
  let titleScore = 12; // Baseline neutral
  const jobTitleLower = job.title.toLowerCase();
  const headlineLower = (candidate.headline || "").toLowerCase();

  // Check matching tokens
  const jobTokens = jobTitleLower.split(/[\s\-_,]+/).filter((t) => t.length > 2);
  let titleMatches = 0;
  for (const token of jobTokens) {
    if (headlineLower.includes(token)) {
      titleMatches++;
    }
    // Also check past experience roles
    for (const exp of candidate.experience || []) {
      if ((exp.role || "").toLowerCase().includes(token)) {
        titleMatches += 0.5;
        break;
      }
    }
  }

  if (titleMatches >= 2) titleScore = 25;
  else if (titleMatches === 1) titleScore = 20;
  else titleScore = 14;

  // 3. Experience & Seniority Alignment (Weight: 15%)
  let experienceScore = 12;
  const totalPositions = (candidate.experience || []).length;
  if (totalPositions >= 3) experienceScore = 15;
  else if (totalPositions >= 1) experienceScore = 12;
  else experienceScore = 8;

  // Check seniority keyword match
  if (jobTitleLower.includes("senior") || jobTitleLower.includes("lead") || jobTitleLower.includes("staff")) {
    if (totalPositions < 2) {
      experienceScore = 8;
    }
  }

  // 4. Remote & Location Compatibility (Weight: 10%)
  let remoteScore = 8;
  const jobRemote = (job.remote_scope || "").toLowerCase();
  if (jobRemote === "worldwide" || jobRemote === "remote") {
    remoteScore = 10;
  } else if (candidate.location && (job.location || "").toLowerCase().includes(candidate.location.toLowerCase())) {
    remoteScore = 10;
  }

  // Sum components
  const finalScore = Math.min(100, Math.max(10, skillScore + titleScore + experienceScore + remoteScore));

  // Determine grade
  let scoreGrade: "high" | "good" | "moderate" | "low" = "moderate";
  if (finalScore >= 80) scoreGrade = "high";
  else if (finalScore >= 65) scoreGrade = "good";
  else if (finalScore >= 45) scoreGrade = "moderate";
  else scoreGrade = "low";

  // Construct factual "Why You Fit" reasons
  const whyYouFit: string[] = [];
  if (matchedSkills.length > 0) {
    whyYouFit.push(
      `Matches ${matchedSkills.length} of ${jobSkills.length} core technical requirements (${matchedSkills.slice(0, 4).join(", ")}${matchedSkills.length > 4 ? ` +${matchedSkills.length - 4} more` : ""}).`
    );
  }
  if (titleMatches >= 1) {
    whyYouFit.push(
      `Your background as "${candidate.headline || candidate.experience?.[0]?.role || "Software Developer"}" strongly aligns with the "${job.title}" title.`
    );
  }
  if (candidate.experience && candidate.experience.length > 0) {
    const latestCompany = candidate.experience[0]?.company;
    if (latestCompany && !latestCompany.includes("Needs Confirmation")) {
      whyYouFit.push(`Verified industry experience at ${latestCompany} supports role readiness.`);
    }
  }
  if (jobRemote === "worldwide" || jobRemote === "remote") {
    whyYouFit.push("100% remote-eligible role with flexible location compatibility.");
  }

  if (whyYouFit.length === 0) {
    whyYouFit.push("Core engineering background provides a foundation for this position.");
  }

  // Construct "Gaps" reasons
  const gaps: string[] = [];
  if (missingSkills.length > 0) {
    gaps.push(
      `Missing explicit evidence for ${missingSkills.length} skills: ${missingSkills.slice(0, 5).join(", ")}${missingSkills.length > 5 ? "..." : ""}.`
    );
  }
  if (jobTitleLower.includes("senior") && totalPositions < 2) {
    gaps.push("Role requires senior-level scope; resume shows early/mid-career timeline.");
  }

  return {
    score: finalScore,
    scoreGrade,
    matchedSkills,
    missingSkills,
    whyYouFit,
    gaps,
    jobRequiredSkills: jobSkills,
    breakdown: {
      skillScore,
      titleScore,
      experienceScore,
      remoteScore,
    },
  };
}
