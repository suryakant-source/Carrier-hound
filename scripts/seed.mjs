/**
 * Career Hound — Database Seed Script
 * ------------------------------------
 * Run AFTER executing supabase/schema.sql in the Supabase dashboard.
 *
 * Usage:
 *   node scripts/seed.mjs
 *
 * Requires .env.local to be filled in.
 * Uses the service_role key so RLS doesn't block the inserts.
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Read .env.local manually — no dotenv needed
const envPath = join(__dirname, "../.env.local");
const envLines = readFileSync(envPath, "utf-8").split("\n");
for (const line of envLines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx).trim();
  const value = trimmed.slice(eqIdx + 1).trim();
  process.env[key] = value;
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("❌  Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const jobs = [
  {
    company: "Stripe",
    title: "Backend Engineer — Payments Infrastructure",
    location: "San Francisco, CA",
    remote_scope: "hybrid",
    job_type: "full-time",
    salary_text: "$180k – $240k",
    description:
      "Join the Payments Infrastructure team to build the systems that process billions of dollars daily. You will design, implement, and scale distributed services using Go and Java, improve reliability across our global payments network, and collaborate with product and compliance teams to ship new payment methods.",
    skills: ["Go", "Java", "Distributed Systems", "PostgreSQL", "Kafka"],
    apply_url: "https://boards.greenhouse.io/stripe/jobs/4000001",
    source_url: "https://stripe.com/jobs",
    status: "active",
  },
  {
    company: "Razorpay",
    title: "Senior Software Engineer — Core Payments",
    location: "Bengaluru, India",
    remote_scope: "hybrid",
    job_type: "full-time",
    salary_text: "₹40L – ₹60L",
    description:
      "Work on Razorpay's core payments engine processing 5M+ transactions/day. Build high-availability microservices, optimize for sub-100ms latency, and lead technical design for new payment product lines.",
    skills: ["Java", "Spring Boot", "MySQL", "Redis", "Kubernetes"],
    apply_url: "https://boards.greenhouse.io/razorpay/jobs/4000002",
    source_url: "https://razorpay.com/jobs",
    status: "active",
  },
  {
    company: "Monzo",
    title: "Backend Engineer — Lending",
    location: "London, UK",
    remote_scope: "remote",
    job_type: "full-time",
    salary_text: "£80k – £110k",
    description:
      "Build the next generation of credit products at Monzo. You'll work in a small squad to design and ship the back-end services that power personal loans, overdrafts, and flexible payments. We use Go and are big on testing and observability.",
    skills: ["Go", "gRPC", "PostgreSQL", "Terraform", "Datadog"],
    apply_url: "https://boards.greenhouse.io/monzo/jobs/4000003",
    source_url: "https://monzo.com/careers",
    status: "active",
  },
  {
    company: "Groww",
    title: "Software Development Engineer II — Brokerage Platform",
    location: "Bengaluru, India",
    remote_scope: "onsite",
    job_type: "full-time",
    salary_text: "₹30L – ₹45L",
    description:
      "Build and scale the brokerage platform serving 10M+ active investors. Responsibilities include designing low-latency order management services, ensuring SEBI compliance workflows, and improving real-time market data pipelines.",
    skills: ["Java", "Spring", "Kafka", "Elasticsearch", "AWS"],
    apply_url: "https://jobs.ashbyhq.com/groww/4000004",
    source_url: "https://groww.in/careers",
    status: "active",
  },
  {
    company: "Linear",
    title: "Software Engineer — Product (Frontend)",
    location: "Remote",
    remote_scope: "remote",
    job_type: "full-time",
    salary_text: "$150k – $200k",
    description:
      "Linear builds software for teams who care about quality. You'll work on our React application used by tens of thousands of engineering teams. Expect deep work on performance, animations, keyboard navigation, and real-time collaboration features.",
    skills: ["TypeScript", "React", "GraphQL", "CSS", "Electron"],
    apply_url: "https://jobs.ashbyhq.com/linear/4000005",
    source_url: "https://linear.app/careers",
    status: "active",
  },
  {
    company: "Loom",
    title: "Full-Stack Engineer — Core Product",
    location: "Remote",
    remote_scope: "remote",
    job_type: "full-time",
    salary_text: "$140k – $180k",
    description:
      "Build the video communication product used by millions. You'll work across our React frontend and Node.js/Python backend, improving the record-upload-share flow and building integrations with tools like Slack, Notion, and Jira.",
    skills: ["React", "TypeScript", "Node.js", "Python", "WebRTC"],
    apply_url: "https://boards.greenhouse.io/loom/jobs/4000006",
    source_url: "https://loom.com/careers",
    status: "active",
  },
  {
    company: "Zepto",
    title: "Senior Frontend Engineer — Consumer App",
    location: "Mumbai, India",
    remote_scope: "hybrid",
    job_type: "full-time",
    salary_text: "₹28L – ₹42L",
    description:
      "Own the consumer-facing React Native and Next.js surfaces at Zepto. Drive performance improvements on our home feed, build A/B tested checkout flows, and work directly with design to ship pixel-perfect experiences at scale.",
    skills: ["React Native", "Next.js", "TypeScript", "Redux", "GraphQL"],
    apply_url: "https://jobs.ashbyhq.com/zepto/4000007",
    source_url: "https://zepto.team/careers",
    status: "active",
  },
  {
    company: "Cloudflare",
    title: "Site Reliability Engineer — Edge Network",
    location: "Austin, TX",
    remote_scope: "hybrid",
    job_type: "full-time",
    salary_text: "$160k – $210k",
    description:
      "Keep Cloudflare's global edge network running across 200+ cities. You will automate infrastructure provisioning with Terraform and Ansible, build runbooks, drive post-incident reviews, and improve observability across millions of requests per second.",
    skills: ["Kubernetes", "Terraform", "Go", "Prometheus", "Linux"],
    apply_url: "https://boards.greenhouse.io/cloudflare/jobs/4000008",
    source_url: "https://cloudflare.com/careers",
    status: "active",
  },
  {
    company: "CRED",
    title: "DevOps Engineer — Platform",
    location: "Bengaluru, India",
    remote_scope: "onsite",
    job_type: "full-time",
    salary_text: "₹25L – ₹38L",
    description:
      "Own CI/CD pipelines, Kubernetes cluster operations, and cost optimisation for CRED's AWS infrastructure. You'll work closely with backend teams to reduce deployment times and build self-service developer tooling.",
    skills: ["Kubernetes", "AWS", "Terraform", "ArgoCD", "Python"],
    apply_url: "https://jobs.ashbyhq.com/cred/4000009",
    source_url: "https://cred.club/careers",
    status: "active",
  },
  {
    company: "Hugging Face",
    title: "ML Engineer — Open Source",
    location: "Remote",
    remote_scope: "remote",
    job_type: "full-time",
    salary_text: "$130k – $170k",
    description:
      "Join the team that maintains the most-used open-source ML library in the world. You'll work on Transformers, Diffusers, and PEFT — fixing bugs, reviewing community PRs, and shipping new model integrations.",
    skills: ["Python", "PyTorch", "Transformers", "CUDA", "Git"],
    apply_url: "https://boards.greenhouse.io/huggingface/jobs/4000010",
    source_url: "https://huggingface.co/jobs",
    status: "active",
  },
  {
    company: "Sarvam AI",
    title: "AI Engineer — Language Models",
    location: "Bengaluru, India",
    remote_scope: "onsite",
    job_type: "full-time",
    salary_text: "₹35L – ₹55L",
    description:
      "Build and fine-tune large language models for Indian languages. You will work on pre-training runs, RLHF pipelines, and evaluation frameworks. Experience with distributed training on GPU clusters is a strong plus.",
    skills: ["Python", "PyTorch", "RLHF", "LLM", "JAX"],
    apply_url: "https://jobs.ashbyhq.com/sarvam/4000011",
    source_url: "https://sarvam.ai/careers",
    status: "active",
  },
  {
    company: "Weights & Biases",
    title: "Data Engineer — MLOps Platform",
    location: "Remote",
    remote_scope: "remote",
    job_type: "full-time",
    salary_text: "$120k – $155k",
    description:
      "Build the data pipelines that power W&B's model registry and artifact store. You'll work with large-scale experiment metadata, design Clickhouse schemas, and improve query performance for millions of runs.",
    skills: ["Python", "dbt", "Clickhouse", "Airflow", "Spark"],
    apply_url: "https://boards.greenhouse.io/wandb/jobs/4000012",
    source_url: "https://wandb.ai/careers",
    status: "active",
  },
  {
    company: "Notion",
    title: "Product Designer — Editor Experience",
    location: "Remote",
    remote_scope: "remote",
    job_type: "full-time",
    salary_text: "$140k – $175k",
    description:
      "Own the design of Notion's core editor — the block-based canvas used by millions daily. You'll work on complex interaction design problems: inline AI, collaborative cursors, rich text editing, and mobile ergonomics.",
    skills: ["Figma", "Prototyping", "User Research", "Design Systems", "Motion Design"],
    apply_url: "https://boards.greenhouse.io/notion/jobs/4000013",
    source_url: "https://notion.so/careers",
    status: "active",
  },
  {
    company: "Meesho",
    title: "Senior Product Manager — Supplier Platform",
    location: "Bengaluru, India",
    remote_scope: "hybrid",
    job_type: "full-time",
    salary_text: "₹35L – ₹50L",
    description:
      "Lead the Supplier Platform product area — the tools used by 1M+ sellers to list, price, and fulfill orders on Meesho. You will define the roadmap, work closely with engineering and data science, and measure success via GMV and supplier NPS.",
    skills: ["Product Strategy", "SQL", "A/B Testing", "Stakeholder Management", "Agile"],
    apply_url: "https://jobs.ashbyhq.com/meesho/4000014",
    source_url: "https://meesho.io/careers",
    status: "active",
  },
  {
    company: "Wiz",
    title: "Security Engineer — Cloud Infrastructure",
    location: "Remote",
    remote_scope: "remote",
    job_type: "full-time",
    salary_text: "$160k – $220k",
    description:
      "Work on the security product that protects the cloud infrastructure of Fortune 500 companies. You'll research new attack vectors, build detection logic, and help customers understand their risk exposure through our graph-based cloud security platform.",
    skills: ["Cloud Security", "AWS", "Python", "Graph Databases", "CSPM"],
    apply_url: "https://boards.greenhouse.io/wiz/jobs/4000015",
    source_url: "https://wiz.io/careers",
    status: "active",
  },
  {
    company: "PhonePe",
    title: "iOS Engineer — UPI Payments",
    location: "Bengaluru, India",
    remote_scope: "hybrid",
    job_type: "full-time",
    salary_text: "₹30L – ₹50L",
    description:
      "Build the iOS client for India's largest UPI payments app used by 500M+ users. Responsibilities include improving app startup time, building new payment flows, and maintaining our Swift/Obj-C codebase with a focus on reliability and security.",
    skills: ["Swift", "Objective-C", "UIKit", "CoreData", "XCTest"],
    apply_url: "https://jobs.ashbyhq.com/phonepe/jobs/4000016",
    source_url: "https://phonepe.com/careers",
    status: "active",
  },
  {
    company: "Duolingo",
    title: "Android Engineer — Learning Experience",
    location: "Pittsburgh, PA",
    remote_scope: "hybrid",
    job_type: "full-time",
    salary_text: "$140k – $180k",
    description:
      "Build the Android learning experience for 60M daily active learners. You'll ship lessons, streaks, and gamification features in Kotlin, working closely with pedagogy researchers and data scientists to maximize learner engagement.",
    skills: ["Kotlin", "Jetpack Compose", "Coroutines", "Room", "MVVM"],
    apply_url: "https://boards.greenhouse.io/duolingo/jobs/4000017",
    source_url: "https://duolingo.com/careers",
    status: "active",
  },
  {
    company: "PlanetScale",
    title: "Database Engineer — Vitess Core",
    location: "Remote",
    remote_scope: "remote",
    job_type: "full-time",
    salary_text: "$150k – $200k",
    description:
      "Contribute to Vitess — the open-source MySQL clustering system that powers YouTube and PlanetScale. You'll work on query routing, schema change workflows, and the online DDL system. Deep knowledge of MySQL internals is required.",
    skills: ["Go", "MySQL", "Vitess", "Distributed Databases", "gRPC"],
    apply_url: "https://boards.greenhouse.io/planetscale/jobs/4000018",
    source_url: "https://planetscale.com/careers",
    status: "active",
  },
  {
    company: "HashedIn (Deloitte)",
    title: "Cloud Architect — GCP / AWS",
    location: "Bengaluru, India",
    remote_scope: "hybrid",
    job_type: "full-time",
    salary_text: "₹28L – ₹45L",
    description:
      "Lead cloud architecture engagements for enterprise clients migrating to GCP and AWS. Responsibilities include infra design, cost optimisation, and helping client engineering teams adopt IaC with Terraform and Pulumi.",
    skills: ["GCP", "AWS", "Terraform", "Pulumi", "Python"],
    apply_url: "https://jobs.ashbyhq.com/hashedin/jobs/4000019",
    source_url: "https://hashedin.com/careers",
    status: "active",
  },
  {
    company: "BrowserStack",
    title: "Software Engineer — Test Automation Platform",
    location: "Mumbai, India",
    remote_scope: "hybrid",
    job_type: "full-time",
    salary_text: "₹22L – ₹35L",
    description:
      "Build the test automation infrastructure that runs millions of tests daily across real devices and browsers. You'll work on our Selenium and Playwright grid, improve scheduling algorithms, and reduce flakiness rates.",
    skills: ["Java", "Selenium", "Playwright", "Kubernetes", "Python"],
    apply_url: "https://jobs.ashbyhq.com/browserstack/jobs/4000020",
    source_url: "https://browserstack.com/careers",
    status: "active",
  },
];

async function main() {
  console.log(`\n🐾 Career Hound — Database Seed\n`);
  console.log(`📡 Connecting to: ${SUPABASE_URL}\n`);

  // Test connection first
  const { error: pingError } = await supabase.from("jobs").select("id").limit(1);

  if (pingError) {
    console.error(`❌  Connection failed: ${pingError.message}`);
    console.error(
      `\n👉  Did you run supabase/schema.sql in the Supabase Dashboard → SQL Editor first?\n`
    );
    process.exit(1);
  }

  console.log(`✅  Connected. Inserting ${jobs.length} jobs...\n`);

  // For dev seeding: clear existing seed jobs then insert fresh
  // (only deletes rows whose apply_url starts with our seed URLs)
  await supabase
    .from("jobs")
    .delete()
    .like("apply_url", "%/4000%");

  const { data, error } = await supabase
    .from("jobs")
    .insert(jobs)
    .select("id, company, title");

  if (error) {
    console.error(`❌  Seed failed: ${error.message}`);
    process.exit(1);
  }

  console.log(`✅  Seeded ${data?.length ?? 0} jobs:\n`);
  data?.forEach((j) => console.log(`   • ${j.company} — ${j.title}`));
  console.log(`\n🎉  Done! Check your Supabase dashboard → Table Editor → jobs\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
