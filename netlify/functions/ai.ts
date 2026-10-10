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

export async function handler(event: any) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    // 1. Verify Authorization Header (Bearer Supabase access token)
    const authHeader = event.headers.authorization || event.headers.Authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: "Unauthorized. Please sign in to use AI features." }),
      };
    }

    const token = authHeader.replace("Bearer ", "").trim();
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.SUPABASE_URL ||
      "https://szakevhxhwpeskidvtfs.supabase.co";
    const serviceKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SERVICE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !serviceKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Server authentication configuration missing." }),
      };
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false },
    });

    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: "Invalid or expired session. Please sign in again." }),
      };
    }

    // 2. Per-User Rate Limiting (30 requests/minute)
    if (!checkRateLimit(user.id)) {
      return {
        statusCode: 429,
        headers,
        body: JSON.stringify({ error: "Rate limit exceeded. Please wait a moment before trying again." }),
      };
    }

    // 3. Parse Request Payload
    let body: any = {};
    try {
      body = JSON.parse(event.body || "{}");
    } catch {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Invalid JSON request body." }),
      };
    }

    const { messages, feature, temperature, jsonMode } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Bad request. 'messages' must be a non-empty array." }),
      };
    }

    // 4. Server-Side Groq API Key
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return {
        statusCode: 503,
        headers,
        body: JSON.stringify({ error: "AI service is currently unavailable. Please check back shortly." }),
      };
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
      console.warn(`[AI Netlify Function] Upstream provider returned status ${groqResponse.status}`);
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({ error: "AI service generation failed. Please try again." }),
      };
    }

    const groqData = await groqResponse.json();
    const content = groqData?.choices?.[0]?.message?.content || "";

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        content,
        text: content,
        model,
      }),
    };
  } catch (error) {
    console.warn("[AI Netlify Function] Internal server error handling AI request");
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal error processing AI request." }),
    };
  }
}
