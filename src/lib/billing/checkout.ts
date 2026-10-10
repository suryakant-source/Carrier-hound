import { createClient } from "../supabase/client";
import { BillingPlan, PLAN_DOMESTIC, PLAN_INTERNATIONAL } from "./types";

export interface CheckoutResult {
  success: boolean;
  error?: string;
}

/**
 * Pluggable payment gateway executor.
 * When real Razorpay / Stripe is integrated, ONLY this function needs to be modified/swapped
 * to invoke Razorpay checkout modal or Stripe Checkout session.
 * The backend entitlement persistence and redirect logic remain untouched.
 */
export async function executePaymentGateway(plan: BillingPlan): Promise<CheckoutResult> {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session || !session.access_token) {
    return { success: false, error: "Please sign in to proceed with checkout." };
  }

  try {
    // Call serverless backend endpoint
    const res = await fetch("/api/simulate-checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        planId: plan.id,
        provider: plan.provider,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return { success: false, error: errData.error || "Payment simulation failed" };
    }

    const data = await res.json();
    return { success: Boolean(data.success) };
  } catch (err: any) {
    return { success: false, error: err?.message || "Could not complete payment simulation." };
  }
}

/**
 * High-level Pro checkout orchestrator.
 * 1. Verifies visitor authentication state:
 *    - If signed out: redirects to /login?next=... to sign in first.
 * 2. For signed-in users:
 *    - Executes payment gateway (currently simulated, pluggable for live Razorpay/Stripe).
 * 3. On success:
 *    - Navigates past the paywall to the unlocked Pro experience.
 */
export async function handleProCheckout(
  plan: BillingPlan = PLAN_DOMESTIC,
  options: {
    redirectTarget?: string;
    onStart?: () => void;
    onError?: (errorMsg: string) => void;
    onSuccess?: () => void;
  } = {}
) {
  const { redirectTarget, onStart, onError, onSuccess } = options;

  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user || (await supabase.auth.getUser()).data.user;

  const currentPath = typeof window !== "undefined"
    ? window.location.pathname + window.location.search
    : "/dashboard";
  const target = redirectTarget || currentPath;

  // 1. If visitor is NOT signed in, send them through sign-in first
  if (!user) {
    const loginUrl = `/login?next=${encodeURIComponent(target)}`;
    if (typeof window !== "undefined") {
      window.location.href = loginUrl;
    }
    return;
  }

  onStart?.();

  // 2. Execute payment gateway (simulation)
  const result = await executePaymentGateway(plan);

  if (!result.success) {
    onError?.(result.error || "Payment processing failed. Please try again.");
    return;
  }

  onSuccess?.();

  // 3. Redirect past paywall into Pro experience with fresh state reload
  if (typeof window !== "undefined") {
    // If user is on an upgrade screen (e.g. /dashboard or /onboarding or /radar), reload current page or target
    const finalDestination = target === "/" || target === "/login" ? "/dashboard" : target;
    window.location.href = finalDestination;
  }
}
