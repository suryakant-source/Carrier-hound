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

/**
 * Retrieves the full user subscription object if one exists
 */
export async function getUserSubscription(): Promise<UserSubscription | null> {
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
        return {
          id: sub.id,
          userId: sub.user_id,
          provider: sub.provider || "razorpay",
          planId: sub.plan_id || PLAN_DOMESTIC.id,
          currency: sub.currency || "INR",
          amount: sub.amount || 199,
          status: sub.status || "active",
          currentPeriodStart: sub.current_period_start || new Date().toISOString(),
          currentPeriodEnd: sub.current_period_end || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          gracePeriodEnd: sub.grace_period_end,
          cancelAtPeriodEnd: sub.cancel_at_period_end ?? false,
          metadata: sub.metadata,
        };
      }
    }
  } catch (e) {
    console.warn("Could not fetch user subscription", e);
  }

  // Fallback to local cache if pro was activated locally
  if (typeof window !== "undefined") {
    try {
      const isPro = localStorage.getItem(LOCAL_PRO_KEY) === "true";
      if (isPro) {
        return {
          id: "sub_local_pro",
          userId: "local_user",
          provider: "razorpay",
          planId: PLAN_DOMESTIC.id,
          currency: "INR",
          amount: 199,
          status: "active",
          currentPeriodStart: new Date().toISOString(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          cancelAtPeriodEnd: false,
        };
      }
    } catch {}
  }

  return null;
}

/**
 * Marks the subscription to cancel at the end of the current period
 */
export async function cancelSubscription(): Promise<UserSubscription | null> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (sub) {
        await supabase
          .from("subscriptions")
          .update({ cancel_at_period_end: true })
          .eq("id", sub.id);

        return {
          id: sub.id,
          userId: sub.user_id,
          provider: sub.provider || "razorpay",
          planId: sub.plan_id || PLAN_DOMESTIC.id,
          currency: sub.currency || "INR",
          amount: sub.amount || 199,
          status: sub.status || "active",
          currentPeriodStart: sub.current_period_start || new Date().toISOString(),
          currentPeriodEnd: sub.current_period_end || new Date().toISOString(),
          gracePeriodEnd: sub.grace_period_end,
          cancelAtPeriodEnd: true,
          metadata: sub.metadata,
        };
      }
    }
  } catch (e) {
    console.warn("Could not cancel subscription remotely", e);
  }

  // Local fallback
  return null;
}
