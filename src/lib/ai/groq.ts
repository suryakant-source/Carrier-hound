import { CandidateProfile } from "../resume/types";
import { generateTailoredCoverLetter as fallbackGenerateCoverLetter } from "../resume/tailor";

export const FAST_MODEL =
  process.env.FAST_MODEL ||
  process.env.NEXT_PUBLIC_FAST_MODEL ||
  "openai/gpt-oss-20b";

export const SMART_MODEL =
  process.env.SMART_MODEL ||
  process.env.NEXT_PUBLIC_SMART_MODEL ||
  "openai/gpt-oss-120b";

export const GROQ_API_BASE_URL =
  process.env.GROQ_API_BASE_URL || "https://api.groq.com/openai/v1";

/**
 * Gets the active Groq API Key from environment or local config
 */
export function getGroqApiKey(): string | null {
  if (typeof process !== "undefined" && process.env) {
    if (process.env.GROQ_API_KEY) return process.env.GROQ_API_KEY;
    if (process.env.NEXT_PUBLIC_GROQ_API_KEY) return process.env.NEXT_PUBLIC_GROQ_API_KEY;
  }
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("careermonke_groq_api_key");
      if (stored) return stored;
    } catch {}
  }
  return null;
}

/**
 * Generic OpenAI-compatible chat completion caller targeting Groq API
 */
export async function callGroqCompletion(options: {
  model: string;
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
  temperature?: number;
  jsonMode?: boolean;
}): Promise<string | null> {
  const apiKey = getGroqApiKey();
  if (!apiKey) {
    return null;
  }

  try {
    const response = await fetch(`${GROQ_API_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: options.model,
        messages: options.messages,
        temperature: options.temperature ?? 0.2,
        ...(options.jsonMode ? { response_format: { type: "json_object" } } : {}),
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn(`Groq API returned HTTP ${response.status}:`, errText);
      return null;
    }

    const data = await response.json();
    return data?.choices?.[0]?.message?.content || null;
  } catch (err) {
    console.warn("Groq API completion call failed, falling back to local engine:", err);
    return null;
  }
}

/**
 * AI-enhanced Resume Fact Extraction using FAST_MODEL (openai/gpt-oss-20b)
 * Strictly instructs the model never to invent or hallucinate facts.
 */
export async function extractResumeFactsWithGroq(
  rawText: string,
  baseProfile: CandidateProfile
): Promise<CandidateProfile> {
  const apiKey = getGroqApiKey();
  if (!apiKey) return baseProfile;

  const systemPrompt = `You are an elite, zero-hallucination resume facts extraction engine.
CRITICAL RULES:
1. ONLY extract information directly present in the source text.
2. NEVER invent, infer, or hallucinate companies, degrees, dates, or certifications.
3. If dates, roles, or institutions are ambiguous, set "needsReview": true.
4. Return a valid JSON object matching the CandidateProfile schema:
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
      model: FAST_MODEL,
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
        experience: Array.isArray(parsed.experience) && parsed.experience.length > 0 ? parsed.experience : baseProfile.experience,
        education: Array.isArray(parsed.education) && parsed.education.length > 0 ? parsed.education : baseProfile.education,
        certifications: Array.isArray(parsed.certifications) ? parsed.certifications : baseProfile.certifications,
      };
    }
  } catch (err) {
    console.warn("Failed to parse Groq extraction output, retaining deterministic output:", err);
  }

  return baseProfile;
}

/**
 * 1-Click Tailored Cover Letter using SMART_MODEL (openai/gpt-oss-120b)
 * Uses candidate's real confirmed facts + target job description.
 */
export async function generateGroqTailoredCoverLetter(
  candidate: CandidateProfile,
  job: {
    title: string;
    company: string;
    description?: string;
  }
): Promise<string> {
  const fallback = fallbackGenerateCoverLetter(candidate, job);

  const apiKey = getGroqApiKey();
  if (!apiKey) return fallback.fullText;

  const systemPrompt = `You are a career strategist. Draft a concise, high-impact job-tailored cover letter for the candidate applying to the specified position.
RULES:
1. Strictly ground the cover letter in the candidate's real confirmed facts:
- Real skills: ${(candidate.skills || []).slice(0, 10).join(", ")}
- Recent roles: ${(candidate.experience || []).map((e) => `${e.role} at ${e.company}`).slice(0, 3).join("; ")}
2. DO NOT invent false employment history, metrics, or credentials.
3. Tailor the tone to the target role (${job.title}) at ${job.company}.
4. Keep length to 3-4 professional paragraphs.`;

  try {
    const output = await callGroqCompletion({
      model: SMART_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Candidate Details:\nName: ${candidate.name}\nHeadline: ${candidate.headline}\nSummary: ${candidate.summary}\n\nJob Target:\nTitle: ${job.title}\nCompany: ${job.company}\nDescription: ${job.description || "Leading tech engineering team"}`,
        },
      ],
      temperature: 0.3,
    });

    if (output && output.trim().length > 100) {
      return output.trim();
    }
  } catch (e) {
    console.warn("Groq cover letter generation failed, using deterministic template:", e);
  }

  return fallback.fullText;
}
