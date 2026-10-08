import { createClient } from "../supabase/client";
import {
  UserSubscription,
  ProAccessStatus,
  PLAN_DOMESTIC,
  PLAN_INTERNATIONAL,
} from "./types";

const LOCAL_PRO_KEY = "careermonke_pro_active";
const LOCAL_SUB_KEY = "careermonke_subscription_cache";

/**
 * Checks the user's active Pro access status, taking into account:
 * 1. Active paid subscriptions (Razorpay / Stripe)
 * 2. 7-Day Grace Period on failed renewal (maintains access with dunning warning)
 * 3. Local demo or promo overrides
 */
export async function getProAccessStatus(): Promise<ProAccessStatus> {
  // Check if locally marked as pro (offline fallback / guest upgrade)
  let isLocallyActive = false;
  if (typeof window !== "undefined") {
    try {
      isLocallyActive = localStorage.getItem(LOCAL_PRO_KEY) === "true";
    } catch {}
  }

  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data: sub, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!error && sub) {
        const now = new Date();
        const periodEnd = sub.current_period_end ? new Date(sub.current_period_end) : null;
        const graceEnd = sub.grace_period_end ? new Date(sub.grace_period_end) : null;

        // Check if within 7-day grace period
        if (sub.status === "in_grace_period" && graceEnd) {
          const diffMs = graceEnd.getTime() - now.getTime();
          const daysLeft = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

          if (diffMs > 0) {
            return {
              isPro: true,
              status: "in_grace_period",
              planName: sub.plan_id === PLAN_INTERNATIONAL.id ? PLAN_INTERNATIONAL.name : PLAN_DOMESTIC.name,
              inGracePeriod: true,
              graceDaysLeft: daysLeft,
              expirationDate: graceEnd.toISOString(),
            };
          }
        }

        // Active subscription check
        if (sub.status === "active" || sub.status === "trialing") {
          return {
            isPro: true,
            status: sub.status,
            planName: sub.plan_id === PLAN_INTERNATIONAL.id ? PLAN_INTERNATIONAL.name : PLAN_DOMESTIC.name,
            inGracePeriod: false,
            expirationDate: periodEnd ? periodEnd.toISOString() : undefined,
          };
        }
      }
    }
  } catch (e) {
    console.warn("Could not check remote subscription status", e);
  }

  return {
    isPro: isLocallyActive,
    status: isLocallyActive ? "active" : "canceled",
    inGracePeriod: false,
  };
}

/**
 * Activates Pro status locally and broadcasts update event
 */
export function setLocalProActive(active: boolean = true) {
  if (typeof window !== "undefined") {
    try {
      if (active) {
        localStorage.setItem(LOCAL_PRO_KEY, "true");
      } else {
        localStorage.removeItem(LOCAL_PRO_KEY);
      }
      window.dispatchEvent(new Event("careermonke_pro_updated"));
    } catch {}
  }
}
