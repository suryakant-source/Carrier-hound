import { CandidateProfile } from "./types";
import { createClient } from "../supabase/client";

const PROFILE_STORAGE_KEY = "careermonke_candidate_profile";

/**
 * Default sample profile when a candidate hasn't uploaded a resume yet.
 */
export const DEFAULT_CANDIDATE_PROFILE: CandidateProfile = {
  name: "Software Engineer",
  email: "",
  phone: "",
  location: "Remote / Global",
  headline: "Full-Stack Software Engineer",
  summary: "Results-driven Software Engineer experienced in building resilient web applications, designing backend APIs, and deploying modern cloud systems. Passionate about clean code, high performance, and rapid product delivery.",
  skills: [
    "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "PostgreSQL", "SQL", "Git", "REST API", "Docker", "Tailwind CSS"
  ],
  experience: [
    {
      id: "exp-sample-1",
      company: "Tech Systems",
      role: "Full-Stack Developer",
      startDate: "2022",
      endDate: "Present",
      bullets: [
        "Architected scalable web applications using React, TypeScript, and Node.js microservices.",
        "Optimized database queries and API response times, improving page performance by 35%.",
        "Collaborated with cross-functional product and design teams to deliver weekly releases."
      ],
      needsReview: false
    }
  ],
  education: [
    {
      id: "edu-sample-1",
      degree: "Bachelor of Science in Computer Science",
      institution: "State University",
      year: "2022",
      needsReview: false
    }
  ],
  certifications: ["AWS Certified Cloud Practitioner"],
  updatedAt: new Date().toISOString()
};

/**
 * Gets the confirmed candidate profile from local storage and Supabase.
 * Returns null if the user has not uploaded and confirmed a resume.
 */
export async function getCandidateProfile(userId?: string): Promise<CandidateProfile | null> {
  let profile: CandidateProfile | null = null;

  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.confirmedAt) {
          profile = parsed;
        }
      }
    } catch (e) {
      console.warn("Could not read local candidate profile", e);
    }
  }

  // Try fetching from Supabase if logged in
  try {
    const supabase = createClient();
    let resolvedUserId = userId;
    let userEmail: string | undefined = undefined;

    if (!resolvedUserId) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        resolvedUserId = session.user.id;
        userEmail = session.user.email;
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        resolvedUserId = user?.id;
        userEmail = user?.email;
      }
    }

    if (resolvedUserId) {
      const queryPromise = supabase
        .from("candidate_profiles")
        .select("*")
        .eq("user_id", resolvedUserId)
        .maybeSingle();

      const timeoutPromise = new Promise<{ data: null; error: Error }>((resolve) =>
        setTimeout(() => resolve({ data: null, error: new Error("Profile query timeout") }), 4000)
      );

      const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

      if (!error && data && data.confirmed_at) {
        const remoteProfile: CandidateProfile = {
          name: data.name || profile?.name || "",
          email: data.email || userEmail || profile?.email || "",
          phone: data.phone || profile?.phone || "",
          location: data.location || profile?.location || "",
          headline: data.headline || profile?.headline || "",
          summary: data.summary || profile?.summary || "",
          skills: data.skills || profile?.skills || [],
          experience: data.experience_json || profile?.experience || [],
          education: data.education_json || profile?.education || [],
          certifications: data.certifications || profile?.certifications || [],
          rawText: data.raw_resume_text || profile?.rawText || "",
          confirmedAt: data.confirmed_at,
          updatedAt: data.updated_at,
        };
        saveCandidateProfileLocally(remoteProfile);
        return remoteProfile;
      }
    }
  } catch (err) {}

  return profile;
}

/**
 * Saves candidate profile to local storage and dispatches event
 */
export function saveCandidateProfileLocally(profile: CandidateProfile) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
      window.dispatchEvent(new Event("careermonke_profile_updated"));
    } catch (e) {
      console.warn("Could not save candidate profile locally", e);
    }
  }
}

/**
 * Saves confirmed candidate profile to both local storage and Supabase
 */
export async function saveConfirmedCandidateProfile(profile: CandidateProfile): Promise<void> {
  const updatedProfile: CandidateProfile = {
    ...profile,
    confirmedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  saveCandidateProfileLocally(updatedProfile);

  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user || (await supabase.auth.getUser()).data.user;

  if (user) {
    const payload: any = {
      user_id: user.id,
      name: updatedProfile.name,
      email: updatedProfile.email || user.email,
      phone: updatedProfile.phone,
      headline: updatedProfile.headline,
      summary: updatedProfile.summary,
      skills: updatedProfile.skills,
      experience_json: updatedProfile.experience,
      education_json: updatedProfile.education,
      certifications: updatedProfile.certifications,
      raw_resume_text: updatedProfile.rawText,
      confirmed_at: updatedProfile.confirmedAt,
      updated_at: updatedProfile.updatedAt,
    };

    if (updatedProfile.location) {
      payload.location = updatedProfile.location;
    }

    let { error } = await supabase.from("candidate_profiles").upsert(payload);

    // If live table doesn't have location column yet, retry without location
    if (error && (error.message?.includes("location") || error.code === "42703")) {
      delete payload.location;
      const retry = await supabase.from("candidate_profiles").upsert(payload);
      error = retry.error;
    }

    if (error) {
      console.error("Failed to sync candidate profile to Supabase:", error);
      throw new Error(`Failed to save candidate profile to database: ${error.message}`);
    }
  }
}

export const saveCandidateProfileToSupabase = saveConfirmedCandidateProfile;

/**
 * Deletes candidate profile from local storage and Supabase
 */
export async function deleteCandidateProfile(): Promise<void> {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(PROFILE_STORAGE_KEY);
      window.dispatchEvent(new Event("careermonke_profile_updated"));
    } catch (e) {
      console.warn("Could not remove local candidate profile", e);
    }
  }

  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("candidate_profiles").delete().eq("user_id", user.id);
    }
  } catch (err) {
    console.warn("Could not delete candidate profile from Supabase", err);
  }
}
