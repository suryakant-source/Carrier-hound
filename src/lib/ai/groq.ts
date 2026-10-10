import { CandidateProfile } from "../resume/types";
import {
  generateTailoredCoverLetter as fallbackGenerateCoverLetter,
  validateCoverLetter,
  formatContactHeader,
} from "../resume/tailor";
import { createClient } from "../supabase/client";

/**
 * Checks if server-side AI enhancement is available.
 * Backward-compatible helper used across frontend components.
 */
export function getGroqApiKey(): boolean {
  return true;
}

export const isAiAvailable = getGroqApiKey;

/**
 * Proxies AI completion requests to our secure server-side endpoint (/api/ai).
 * The server securely injects GROQ_API_KEY and calls Groq on the backend.
 * Secrets, API keys, and vendor endpoints are NEVER exposed to the browser.
 */
export async function callGroqCompletion(options: {
  model?: string;
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
  temperature?: number;
  jsonMode?: boolean;
  feature?: string;
}): Promise<string | null> {
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    if (!token) {
      console.warn("User not authenticated; utilizing deterministic local algorithms.");
      return null;
    }

    const response = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        feature: options.feature || "completion",
        model: options.model,
        messages: options.messages,
        temperature: options.temperature ?? 0.2,
        jsonMode: options.jsonMode,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.warn("[AI] Server endpoint returned error:", errData.error || response.status);
      return null;
    }

    const data = await response.json();
    return data?.content || data?.text || null;
  } catch (err) {
    console.warn("[AI] Secure completion request failed, falling back to local engine:", err);
    return null;
  }
}

/**
 * AI-enhanced Resume Fact Extraction via server-side /api/ai.
 * Strictly enforces zero-hallucination extraction without exposing keys.
 */
export async function extractResumeFactsWithGroq(
  rawText: string,
  baseProfile: CandidateProfile
): Promise<CandidateProfile> {
  const systemPrompt = `You are an elite, zero-hallucination resume facts extraction engine.
CRITICAL ZERO-FABRICATION RULES:
1. ONLY extract information directly evidenced in the source text.
2. NEVER invent, infer, or hallucinate employers, roles, degrees, dates, achievements, or certifications.
3. If the candidate is a fresher or has no work experience mentioned, "experience" MUST be an empty array [].
4. Extract skills objectively across all fields (Marketing, Design, HR, Finance, Operations, Engineering). Do NOT bias towards software terms.
5. If dates, roles, or institutions are ambiguous, set "needsReview": true.
6. Return a valid JSON object matching the CandidateProfile schema:
{
  "name": string,
  "headline": string,
  "summary": string,
  "skills": string[],
  "experience": [
    {
      "id": string,
      "company": string,
      "role": string,
      "startDate": string,
      "endDate": string,
      "bullets": string[],
      "needsReview": boolean
    }
  ],
  "education": [
    {
      "id": string,
      "degree": string,
      "institution": string,
      "year": string,
      "needsReview": boolean
    }
  ],
  "certifications": string[]
}`;

  try {
    const output = await callGroqCompletion({
      feature: "resume-extraction",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Extract verified facts from this resume text:\n\n${rawText.slice(0, 8000)}`,
        },
      ],
      temperature: 0.1,
      jsonMode: true,
    });

    if (output) {
      const parsed = JSON.parse(output);
      return {
        ...baseProfile,
        name: parsed.name || baseProfile.name,
        headline: parsed.headline || baseProfile.headline,
        summary: parsed.summary || baseProfile.summary,
        skills: Array.isArray(parsed.skills) && parsed.skills.length > 0 ? parsed.skills : baseProfile.skills,
        experience: Array.isArray(parsed.experience) ? parsed.experience : baseProfile.experience,
        education: Array.isArray(parsed.education) ? parsed.education : baseProfile.education,
        certifications: Array.isArray(parsed.certifications) ? parsed.certifications : baseProfile.certifications,
      };
    }
  } catch (err) {
    console.warn("Failed to parse AI extraction output, retaining deterministic output:", err);
  }

  return baseProfile;
}

export interface GroqCoverLetterResponse {
  text: string;
  isValidated: boolean;
  error?: string;
}

/**
 * 1-Click Tailored Cover Letter via server-side /api/ai.
 * Hard evidence validation: rejects any unevidenced employers, contacts, or dates.
 */
export async function generateGroqTailoredCoverLetter(
  candidate: CandidateProfile,
  job: {
    title: string;
    company: string;
    description?: string;
  }
): Promise<GroqCoverLetterResponse> {
  const fallback = fallbackGenerateCoverLetter(candidate, job);

  const hasExperience = Array.isArray(candidate.experience) && candidate.experience.length > 0;
  const expSummary = hasExperience
    ? candidate.experience.map((e) => `${e.role} at ${e.company} (${e.startDate || ""} - ${e.endDate || ""})`).slice(0, 3).join("; ")
    : "NO PRIOR WORK EXPERIENCE (Fresher/Student). Strictly DO NOT mention previous employers or tenure.";

  const systemPrompt = `You are a career strategist. Draft 3-4 concise, high-impact body paragraphs for a job cover letter.
CRITICAL RULES:
1. Generate ONLY the body paragraphs. DO NOT include contact headers (name, email, phone, location), salutations ("Dear..."), or sign-offs ("Sincerely...").
2. Strictly ground the content in the candidate's verified facts:
- Real skills: ${(candidate.skills || []).slice(0, 10).join(", ")}
- Work history: ${expSummary}
3. ZERO HALLUCINATIONS:
- NEVER invent false employers, project names, metrics, or years of experience.
- If candidate has NO prior work experience, DO NOT claim "throughout my tenure" or "previous roles". Focus strictly on verified skills and enthusiasm.
- DO NOT include any emails, phone numbers, or URLs.
4. Tailor tone to ${job.title} at ${job.company}.`;

  try {
    const output = await callGroqCompletion({
      feature: "cover-letter",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Candidate Facts:\nName: ${candidate.name}\nHeadline: ${candidate.headline || "Professional"}\nSummary: ${candidate.summary || ""}\nSkills: ${(candidate.skills || []).join(", ")}\n\nJob Target:\nTitle: ${job.title}\nCompany: ${job.company}\nDescription: ${job.description || ""}`,
        },
      ],
      temperature: 0.2,
    });

    if (output && output.trim().length > 80) {
      // Validate the generated paragraphs against candidate facts
      const validation = validateCoverLetter(output, candidate, job);
      if (!validation.valid) {
        console.warn("AI cover letter failed strict evidence verification:", validation.reasons);
        return {
          text: fallback.fullText,
          isValidated: true,
          error: `AI output contained unverified claims (${validation.reasons[0]}). Safely reverted to verified factual draft.`,
        };
      }

      // Assemble full letter deterministically with protected contact header
      const header = formatContactHeader(candidate);
      const blocks: string[] = [];
      if (header) blocks.push(header);
      blocks.push(`Dear Hiring Team at ${job.company},`);
      blocks.push(output.trim());
      blocks.push("Sincerely,");
      blocks.push(candidate.name || "Candidate");

      return {
        text: blocks.join("\n\n"),
        isValidated: true,
      };
    }
  } catch (e) {
    console.warn("AI cover letter generation failed, using deterministic template:", e);
  }

  return {
    text: fallback.fullText,
    isValidated: true,
  };
}
