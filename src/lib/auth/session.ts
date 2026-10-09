import { createClient } from "../supabase/client";
import { UserPreferences, DEFAULT_USER_PREFERENCES } from "./types";
import type { User } from "@supabase/supabase-js";

const PREFS_STORAGE_KEY = "careermonke_preferences";
const USER_EMAIL_KEY = "careermonke_user_email";
const USER_PRO_KEY = "careermonke_pro_active";
const CANDIDATE_PROFILE_KEY = "careermonke_candidate_profile";

/**
 * Validates a return URL to ensure it is a safe relative same-site path.
 * Disallows absolute URLs, protocol-relative '//', or external schemes.
 */
export function getValidReturnUrl(targetUrl: string | null | undefined, fallback: string = "/dashboard"): string {
  if (!targetUrl) return fallback;
  const trimmed = targetUrl.trim();
  // Must start with '/' but not '//'
  if (trimmed.startsWith("/") && !trimmed.startsWith("//") && !trimmed.includes("\\")) {
    return trimmed;
  }
  return fallback;
}

export function getAuditEmail(): string | null {
  return process.env.NEXT_PUBLIC_AUDIT_EMAIL?.trim() || null;
}

export function isAuditUser(email?: string | null): boolean {
  const auditEmail = getAuditEmail();
  if (!auditEmail || !email) return false;
  return email.trim().toLowerCase() === auditEmail.toLowerCase();
}

/**
 * Retrieves the current authenticated user session.
 */
export async function getAuthUser(): Promise<User | null> {
  const supabase = createClient();
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (user && !error) {
      if (typeof window !== "undefined" && user.email) {
        localStorage.setItem(USER_EMAIL_KEY, user.email);
      }
      return user;
    }
  } catch (err) {
    console.warn("Supabase auth check failed:", err);
  }

  // 1. Audit Mode bypass: env-gated only (NEXT_PUBLIC_AUDIT_EMAIL)
  const auditEmail = getAuditEmail();
  if (auditEmail && typeof window !== "undefined") {
    const localEmail = localStorage.getItem(USER_EMAIL_KEY);
    if (localEmail && localEmail.trim().toLowerCase() === auditEmail.toLowerCase()) {
      return {
        id: "audit-mode-tester",
        email: auditEmail,
        app_metadata: { provider: "audit" },
        user_metadata: { full_name: "Audit Mode Tester", email: auditEmail },
        aud: "authenticated",
        created_at: new Date().toISOString(),
      } as unknown as User;
    }
  }

  // Clear stale local storage if Supabase says no authenticated session
  if (typeof window !== "undefined") {
    localStorage.removeItem(USER_EMAIL_KEY);
  }

  return null;
}

/**
 * Retrieves user preferences from Supabase with fallback to local storage.
 */
export async function getUserPreferences(userId?: string): Promise<UserPreferences> {
  const supabase = createClient();
  if (userId && userId !== "local-user") {
    try {
      const { data, error } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (data && !error) {
        const prefs: UserPreferences = {
          roles: data.roles || [],
          categories: data.categories || [],
          experienceLevel: data.experience_level || "mid",
          employmentTypes: data.employment_types || ["full-time"],
          locations: data.locations || ["Remote / Global"],
          remotePreference: data.remote_preference || "remote",
          workAuth: data.work_auth,
          minSalary: data.min_salary,
          salaryCurrency: data.salary_currency || "USD",
          dailyDigestOptIn: data.daily_digest_opt_in ?? true,
          onboardingCompleted: data.onboarding_completed ?? false,
          updatedAt: data.updated_at || new Date().toISOString(),
        };
        if (typeof window !== "undefined") {
          localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefs));
        }
        return prefs;
      }
    } catch (e) {
      console.warn("Failed to load user preferences from DB:", e);
    }
  }

  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(PREFS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore parse error
      }
    }
  }

  return DEFAULT_USER_PREFERENCES;
}

/**
 * Saves user preferences to Supabase and syncs with local storage.
 */
export async function saveUserPreferences(prefs: UserPreferences, userId?: string): Promise<void> {
  const updatedPrefs: UserPreferences = {
    ...prefs,
    updatedAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(updatedPrefs));
    window.dispatchEvent(new Event("careermonke_preferences_updated"));
  }

  const supabase = createClient();
  if (userId && userId !== "local-user") {
    try {
      await supabase.from("user_preferences").upsert({
        user_id: userId,
        roles: updatedPrefs.roles,
        categories: updatedPrefs.categories,
        experience_level: updatedPrefs.experienceLevel,
        employment_types: updatedPrefs.employmentTypes,
        locations: updatedPrefs.locations,
        remote_preference: updatedPrefs.remotePreference,
        work_auth: updatedPrefs.workAuth,
        min_salary: updatedPrefs.minSalary,
        salary_currency: updatedPrefs.salaryCurrency,
        daily_digest_opt_in: updatedPrefs.dailyDigestOptIn,
        onboarding_completed: updatedPrefs.onboardingCompleted,
        updated_at: updatedPrefs.updatedAt,
      });
    } catch (e) {
      console.warn("Failed to save preferences to DB:", e);
    }
  }
}

/**
 * Full Sign-Out with clean private cache purge.
 */
export async function signOutUser(): Promise<void> {
  const supabase = createClient();
  try {
    await supabase.auth.signOut();
  } catch (e) {
    console.warn("Supabase sign out error:", e);
  }

  if (typeof window !== "undefined") {
    localStorage.removeItem(USER_EMAIL_KEY);
    localStorage.removeItem(USER_PRO_KEY);
    localStorage.removeItem(PREFS_STORAGE_KEY);
    localStorage.removeItem(CANDIDATE_PROFILE_KEY);
    document.cookie = `${USER_EMAIL_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    window.dispatchEvent(new Event("careermonke_auth_updated"));
  }
}
