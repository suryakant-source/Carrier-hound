import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// In-memory sliding window rate limiter: 30 requests per minute per user ID
interface RateLimitBucket {
  count: number;
  resetAt: number;
}
const rateLimitMap = new Map<string, RateLimitBucket>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30;

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const bucket = rateLimitMap.get(userId);

  if (!bucket || now > bucket.resetAt) {
    rateLimitMap.set(userId, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return true;
  }

  if (bucket.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  bucket.count++;
  return true;
}

export async function POST(req: Request) {
  try {
    // 1. Verify Authorization Header (Bearer Supabase access token)
    const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to use AI features." },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "").trim();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://szakevhxhwpeskidvtfs.supabase.co";
    const serviceKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json(
        { error: "Server authentication configuration missing." },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false },
    });

    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json(
        { error: "Invalid or expired session. Please sign in again." },
        { status: 401 }
      );
    }

    // 2. Per-User Rate Limiting (30 requests/minute)
    if (!checkRateLimit(user.id)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait a moment before trying again." },
        { status: 429 }
      );
    }

    // 3. Parse Request Payload
    const body = await req.json().catch(() => ({}));
    const { messages, feature, temperature, jsonMode } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Bad request. 'messages' must be a non-empty array." },
        { status: 400 }
      );
    }

    // 4. Server-Side Groq API Key
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return NextResponse.json(
        { error: "AI service is currently unavailable. Please check back shortly." },
        { status: 503 }
      );
    }

    const defaultModel =
      feature === "cover-letter"
        ? process.env.SMART_MODEL || "openai/gpt-oss-120b"
        : process.env.FAST_MODEL || "openai/gpt-oss-20b";
    const model = body.model || defaultModel;

    // 5. Server-to-Server Call to Groq (Keys NEVER logged or returned)
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: typeof temperature === "number" ? temperature : 0.2,
        ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
      }),
    });

    if (!groqResponse.ok) {
      // Log sanitized status only
      console.warn(`[AI Route] Upstream provider returned status ${groqResponse.status}`);
      return NextResponse.json(
        { error: "AI service generation failed. Please try again." },
        { status: 502 }
      );
    }

    const groqData = await groqResponse.json();
    const content = groqData?.choices?.[0]?.message?.content || "";

    return NextResponse.json({
      content,
      text: content,
      model,
    });
  } catch (error) {
    // Sanitized generic error
    console.warn("[AI Route] Internal server error handling AI request");
    return NextResponse.json(
      { error: "Internal error processing AI request." },
      { status: 500 }
    );
  }
}
