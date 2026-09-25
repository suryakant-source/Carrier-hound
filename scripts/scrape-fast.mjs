import fs from "fs";
import path from "path";

// List of verified ATS endpoints
const ASHBY_COMPANIES = [
  "linear", "ramp", "notion", "cursor", "retool", "sentry", "supabase", "vapi"
];

const GREENHOUSE_COMPANIES = [
  "stripe", "datadog", "figma", "lyft", "instacart", "cloudflare", "gitlab", "discord", "github", "airbnb", "mongodb"
];

function categorizeJob(title) {
  const t = title.toLowerCase();
  if (t.includes("design") || t.includes("ui") || t.includes("ux")) return "design";
  if (t.includes("devops") || t.includes("sre") || t.includes("infrastructure") || t.includes("cloud")) return "devops";
  if (t.includes("ai") || t.includes("ml") || t.includes("machine learning") || t.includes("data") || t.includes("llm")) return "ai";
  if (t.includes("frontend") || t.includes("full stack") || t.includes("fullstack") || t.includes("web")) return "software";
  return "engineering";
}

function isTechJob(title, department = "") {
  const text = (title + " " + department).toLowerCase();
  const techKeywords = [
    "engineer", "developer", "software", "frontend", "backend", "full stack", "fullstack",
    "devops", "sre", "cloud", "security", "infrastructure", "ai", "machine learning",
    "data", "ml", "python", "react", "golang", "architect", "platform", "system", "designer", "product manager"
  ];
  const excludeKeywords = ["account executive", "bdr", "sdr", "sales rep", "legal counsel", "paralegal", "recruiter", "talent acquisition"];
  
  if (excludeKeywords.some(w => text.includes(w))) return false;
  return techKeywords.some(w => text.includes(w));
}

async function scrapeAshby(company) {
  try {
    const res = await fetch(`https://api.ashbyhq.com/posting-api/job-board/${company}`);
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.jobs) return [];
    
    return data.jobs
      .filter(j => isTechJob(j.title, j.department))
      .map(j => {
        let salary = "Competitive + Equity";
        if (j.compensation && j.compensation.min && j.compensation.max) {
          salary = `$${Math.round(j.compensation.min / 1000)}k - $${Math.round(j.compensation.max / 1000)}k`;
        }
        const isRemote = j.isRemote || (j.location && j.location.toLowerCase().includes("remote"));
        return {
          id: `ashby-${company}-${j.id}`,
          title: j.title,
          company: company.charAt(0).toUpperCase() + company.slice(1),
          location: j.location || (isRemote ? "Remote — Global" : "San Francisco, CA"),
          date: "Just now",
          salary,
          category: categorizeJob(j.title),
          remote: isRemote ?? true,
          country: isRemote ? "Remote" : "United States",
          type: "Full-time",
          directSource: true,
          applyUrl: j.jobUrl
        };
      });
  } catch (e) {
    return [];
  }
}

async function scrapeGreenhouse(company) {
  try {
    const res = await fetch(`https://boards-api.greenhouse.io/v1/boards/${company}/jobs`);
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.jobs) return [];
    
    return data.jobs
      .filter(j => isTechJob(j.title, j.departments?.map(d => d.name).join(" ")))
      .map(j => {
        const loc = j.location?.name || "";
        const isRemote = loc.toLowerCase().includes("remote") || loc.toLowerCase().includes("virtual");
        return {
          id: `gh-${company}-${j.id}`,
          title: j.title,
          company: company.charAt(0).toUpperCase() + company.slice(1),
          location: loc || (isRemote ? "Remote — Worldwide" : "San Francisco, CA"),
          date: "Today",
          salary: "$140,000 - $210,000",
          category: categorizeJob(j.title),
          remote: isRemote || loc.includes("Remote"),
          country: isRemote ? "Remote" : (loc.includes("India") ? "India" : "United States"),
          type: "Full-time",
          directSource: true,
          applyUrl: j.absolute_url
        };
      });
  } catch (e) {
    return [];
  }
}

async function scrapeJobicy() {
  try {
    const res = await fetch("https://jobicy.com/api/v2/remote-jobs?count=100");
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.jobs) return [];
    
    return data.jobs
      .filter(j => isTechJob(j.jobTitle))
      .map(j => {
        let salary = "Competitive Rate";
        if (j.annualSalaryMin && j.annualSalaryMax) {
          salary = `$${Math.round(j.annualSalaryMin / 1000)}k - $${Math.round(j.annualSalaryMax / 1000)}k`;
        }
        const jobType = Array.isArray(j.jobType) ? j.jobType.join(", ") : (j.jobType || "Full-time");
        return {
          id: `jobicy-${j.id}`,
          title: j.jobTitle,
          company: j.companyName,
          location: j.jobGeo || "Remote — Worldwide",
          date: "Today",
          salary,
          category: categorizeJob(j.jobTitle),
          remote: true,
          country: "Remote",
          type: jobType.includes("Contract") ? "Contract" : (jobType.includes("Part") ? "Part-time" : "Full-time"),
          directSource: true,
          applyUrl: j.url
        };
      });
  } catch (e) {
    return [];
  }
}

async function run() {
  console.log("Scraping live jobs from ATS & Open APIs...");
  const [jobicyJobs, ...atsJobs] = await Promise.all([
    scrapeJobicy(),
    ...ASHBY_COMPANIES.map(c => scrapeAshby(c)),
    ...GREENHOUSE_COMPANIES.map(c => scrapeGreenhouse(c))
  ]);

  const allJobs = [jobicyJobs, ...atsJobs].flat();
  console.log(`Total live tech jobs scraped: ${allJobs.length}`);
  
  // Deduplicate by company + title
  const seen = new Set();
  const deduped = [];
  for (const job of allJobs) {
    const key = `${job.company.toLowerCase()}-${job.title.toLowerCase()}`;
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(job);
    }
  }

  console.log(`Unique verified jobs after deduplication: ${deduped.length}`);
  console.log("Sample job:", deduped[0]);
}

run();
