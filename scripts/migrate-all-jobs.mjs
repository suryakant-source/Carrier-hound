import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, "../.env.local");
const envLines = readFileSync(envPath, "utf-8").split("\n");
for (const line of envLines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx === -1) continue;
  process.env[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  console.log("Loading DUMMY_JOBS from src/data/jobs.ts...");
  const { DUMMY_JOBS } = await import("../src/data/jobs.ts");
  console.log(`Loaded ${DUMMY_JOBS.length} jobs.`);

  // Clear existing jobs to ensure clean slate
  console.log("Clearing previous jobs...");
  await supabase.from("jobs").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  const mappedJobs = DUMMY_JOBS.map((j) => ({
    company: j.company,
    title: j.title,
    location: j.location,
    remote_scope: j.remote ? "remote" : "onsite",
    job_type: "full-time",
    salary_text: j.salary,
    description: `${j.title} at ${j.company} (${j.location}). Apply directly via employer careers portal.`,
    skills: [j.category],
    apply_url: j.applyUrl,
    source_url: j.applyUrl,
    status: "active",
    category: j.category,
    country: j.country,
    date: j.date,
  }));

  const chunkSize = 250;
  const totalChunks = Math.ceil(mappedJobs.length / chunkSize);

  for (let i = 0; i < mappedJobs.length; i += chunkSize) {
    const chunk = mappedJobs.slice(i, i + chunkSize);
    const { error } = await supabase.from("jobs").insert(chunk);
    if (error) {
      console.error(`❌ Chunk ${Math.floor(i / chunkSize) + 1} failed:`, error.message);
      process.exit(1);
    }
    console.log(`✅ Chunk ${Math.floor(i / chunkSize) + 1}/${totalChunks} inserted (${Math.min(i + chunkSize, mappedJobs.length)}/${mappedJobs.length})`);
  }

  console.log("🎉 Successfully migrated all 4,600 jobs into Supabase!");
}

main().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
