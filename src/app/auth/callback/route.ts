import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * GET /auth/callback
 *
 * Handles two flows:
 * 1. Magic link  → ?token_hash=...&type=email&next=/jobs
 * 2. Google OAuth → ?code=...&next=/jobs
 *
 * After successful auth, redirects to `next` (default: /jobs).
 * On failure, redirects to /login?error=auth_failed.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  const code       = searchParams.get("code");
  const tokenHash  = searchParams.get("token_hash");
  const type       = searchParams.get("type") as "email" | "recovery" | "invite" | null;
  const next       = searchParams.get("next") ?? "/job-search/all";

  const supabase = await createClient();

  // ── Google OAuth / PKCE code exchange ──────────────────────────────────
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    console.error("[auth/callback] code exchange failed:", error.message);
  }

  // ── Magic link (email OTP) ──────────────────────────────────────────────
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    console.error("[auth/callback] OTP verify failed:", error.message);
  }

  // ── Auth failed ─────────────────────────────────────────────────────────
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
