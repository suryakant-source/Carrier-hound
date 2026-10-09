import { createClient } from "../supabase/client";
import {
  UserSubscription,
  ProAccessStatus,
  PLAN_DOMESTIC,
  PLAN_INTERNATIONAL,
} from "./types";

const LOCAL_SUB_KEY = "careermonke_subscription_cache";

/**
 * Checks the user's active Pro access status, strictly server-verified.
 * 1. Active paid subscriptions in Supabase (Razorpay / Stripe)
 * 2. 7-Day Grace Period on failed renewal
 * Until billing is live and verified on the server, everyone is Free.
 */
export async function getProAccessStatus(): Promise<ProAccessStatus> {
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
        .maybeSingle();

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

  // Strictly server-verified: default to Free plan
  return {
    isPro: false,
    status: "canceled",
    inGracePeriod: false,
  };
}

/**
 * Legacy hook deprecated: Pro proof is strictly server-verified in Supabase.
 */
export function setLocalProActive(_active: boolean = true) {
  // Purge any stale fake pro key from previous sessions
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem("careermonke_pro_active");
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
        .maybeSingle();

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
        .maybeSingle();

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
