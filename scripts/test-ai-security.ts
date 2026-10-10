import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function runSecurityTests() {
  console.log("=================================================");
  console.log("AI SECURITY & SERVER-SIDE PROXY VERIFICATION");
  console.log("=================================================\n");

  // Test 1: Check environment variables
  console.log("1. Checking Environment Variables:");
  const hasGroqKey = Boolean(process.env.GROQ_API_KEY);
  const hasPublicGroqKey = Boolean(process.env.NEXT_PUBLIC_GROQ_API_KEY);
  console.log(`- GROQ_API_KEY exists on server: ${hasGroqKey ? "YES" : "NO"}`);
  console.log(`- NEXT_PUBLIC_GROQ_API_KEY is absent: ${!hasPublicGroqKey ? "YES (CLEAN)" : "NO (LEAK)"}`);

  if (hasPublicGroqKey) {
    console.error("FAIL: NEXT_PUBLIC_GROQ_API_KEY is still present in environment!");
    process.exit(1);
  }

  // Test 2: Verify client code does not contain hardcoded keys or vendor URL
  console.log("\n2. Scanning src/lib/ai/groq.ts for key leaks or direct vendor URLs:");
  const fs = await import("fs");
  const groqTsContent = fs.readFileSync("src/lib/ai/groq.ts", "utf-8");
  const hasGskLiteral = groqTsContent.includes("gsk_");
  const hasDirectVendorUrl = groqTsContent.includes("api.groq.com");

  console.log(`- Zero 'gsk_' literals in groq.ts: ${!hasGskLiteral ? "PASSED" : "FAILED"}`);
  console.log(`- Zero 'api.groq.com' URLs in groq.ts: ${!hasDirectVendorUrl ? "PASSED" : "FAILED"}`);

  if (hasGskLiteral || hasDirectVendorUrl) {
    console.error("FAIL: groq.ts contains key or direct vendor URL!");
    process.exit(1);
  }

  // Test 3: Test Netlify function simulation
  console.log("\n3. Testing Netlify function handler auth guard:");
  const { handler } = await import("../netlify/functions/ai");

  // Call without Authorization header
  const resNoAuth = await handler({
    httpMethod: "POST",
    headers: {},
    body: JSON.stringify({ messages: [{ role: "user", content: "hello" }] }),
  });
  console.log(`- No auth header rejected with HTTP 401: ${resNoAuth.statusCode === 401 ? "PASSED" : "FAILED"}`);

  // Call with invalid token
  const resBadToken = await handler({
    httpMethod: "POST",
    headers: { authorization: "Bearer invalid_fake_token_xyz" },
    body: JSON.stringify({ messages: [{ role: "user", content: "hello" }] }),
  });
  console.log(`- Invalid Bearer token rejected with HTTP 401: ${resBadToken.statusCode === 401 ? "PASSED" : "FAILED"}`);

  if (resNoAuth.statusCode !== 401 || resBadToken.statusCode !== 401) {
    console.error("FAIL: Auth guard did not return 401!");
    process.exit(1);
  }

  console.log("\n=================================================");
  console.log("ALL AI SECURITY VERIFICATIONS PASSED 100%!");
  console.log("=================================================");
}

runSecurityTests().catch((e) => {
  console.error(e);
  process.exit(1);
});
