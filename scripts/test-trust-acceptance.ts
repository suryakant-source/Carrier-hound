import { parseResumeText } from "../src/lib/resume/parser";
import { computeFitDiagnostics } from "../src/lib/matcher/scoring";
import { generateTailoredCoverLetter, validateCoverLetter } from "../src/lib/resume/tailor";

console.log("=== RUNNING ZERO-HALLUCINATION & TRUST ACCEPTANCE TESTS ===\n");

// 1. RESUME FIXTURES
const seniorDataEngText = `
Alex Mercer
alex.mercer@example.com | +1 (555) 432-1098 | San Francisco, CA
Senior Data Engineer

Professional Summary
Senior Data Engineer with 6+ years of experience designing scalable data architectures, real-time pipelines, and cloud data warehouses.

Technical Skills
SQL, Python, Apache Spark, Snowflake, AWS, ETL, Data Modeling, Docker, Airflow

Experience
Senior Data Engineer | Snowflake Inc
2022 - Present
• Architected enterprise ETL pipelines processing over 5TB of streaming data daily using Spark and Snowflake.
• Optimized cloud compute costs by 35% across AWS services.

Data Engineer | Databricks
2018 - 2022
• Developed Python pipelines for data ingestion and warehousing.
• Collaborated with analytics teams to model key business dimensions.

Education
Bachelor of Science in Computer Science
University of California, Berkeley (2018)

Certifications
AWS Certified Data Analytics - Specialty
`;

const marketingManagerText = `
Priya Sharma
priya.sharma@example.com | +91 98765 43210 | Mumbai, India
Marketing Manager

Professional Summary
Results-driven Marketing Manager with 5 years of experience leading multi-channel acquisition, SEO strategy, and lifecycle campaigns.

Skills
SEO, SEM, Google Ads, HubSpot, Content Marketing, Google Analytics, Mailchimp, Copywriting, Social Media Marketing

Experience
Marketing Lead | GrowthVentures
2020 - Present
• Scaled organic search traffic by 140% through comprehensive technical SEO and content clustering.
• Managed $50k monthly paid acquisition budget across Google Ads and Meta Ads with 3.8x ROAS.

Marketing Specialist | DigitalWave
2019 - 2020
• Orchestrated email marketing automation workflows in HubSpot and Mailchimp.

Education
Bachelor of Arts in Communications
Mumbai University (2019)

Certifications
HubSpot Inbound Marketing Certified
`;

const fresherNoExperienceText = `
Rahul Verma
rahul.verma@example.com | +91 91234 56789 | New Delhi, India
Aspiring Web Specialist

Professional Summary
Recent graduate with no work experience seeking an entry-level opportunity. Passionate about learning and building responsive web interfaces.

Skills
HTML, CSS, JavaScript, React, Git

Experience
No work experience. Completed university coursework and personal portfolio projects.

Education
Bachelor of Technology in Information Technology
Delhi Technological University (2024)
`;

// Target Requisition: Senior Data Engineer
const targetSeniorDataJob = {
  id: "job-sde-1",
  title: "Senior Data Engineer",
  company: "Apex Cloud Systems",
  location: "Worldwide (Remote)",
  remote_scope: "worldwide",
  category: "Data & ML",
  skills: ["SQL", "Python", "Apache Spark", "Snowflake", "AWS", "ETL", "Airflow"],
  description: "We are seeking a Senior Data Engineer with 5+ years of experience. Must have proven mastery in SQL, Python, Spark, Snowflake, AWS, and ETL pipelines."
};

// Target Requisition: Growth Marketing Lead
const targetMarketingJob = {
  id: "job-mkt-1",
  title: "Growth Marketing Lead",
  company: "SaaS ScaleUp",
  location: "Worldwide (Remote)",
  remote_scope: "worldwide",
  category: "Marketing",
  skills: ["SEO", "Google Ads", "HubSpot", "Google Analytics", "SEM"],
  description: "Looking for an experienced Growth Marketing Lead to direct our SEO, Google Ads, and inbound acquisition pipelines in HubSpot."
};

let allPassed = true;

// --- TEST 1: PARSER INTEGRITY & ZERO FABRICATION ---
console.log("--- TEST 1: Resume Parser Extraction ---");

// Test 1A: Fresher has strictly 0 experience
const fresherParsed = parseResumeText(fresherNoExperienceText);
console.log("Fresher Experience Count:", fresherParsed.profile.experience.length);
if (fresherParsed.profile.experience.length === 0) {
  console.log("✓ PASS: Fresher has strictly EMPTY work history (0 roles).");
} else {
  console.error("✗ FAIL: Fresher was given invented work experience:", fresherParsed.profile.experience);
  allPassed = false;
}

// Test 1B: Marketing resume preserves domain skills and does not become software developer
const marketingParsed = parseResumeText(marketingManagerText);
const hasMarketingSkills = ["SEO", "Google Ads", "HubSpot"].every((s) => marketingParsed.profile.skills.includes(s));
console.log("Marketing Skills Found:", marketingParsed.profile.skills);
console.log("Marketing Headline:", marketingParsed.profile.headline);

if (hasMarketingSkills && !marketingParsed.profile.headline.toLowerCase().includes("software developer")) {
  console.log("✓ PASS: Marketing resume preserves marketing skills and genuine headline.");
} else {
  console.error("✗ FAIL: Marketing resume corrupted with software terms.");
  allPassed = false;
}

// Test 1C: "Mumbai" does NOT parse as MBA education
const hasFakeMba = marketingParsed.profile.education.some((e) => /\bmba\b/i.test(e.degree) && !e.degree.toLowerCase().includes("bachelor"));
console.log("Marketing Education Degrees:", marketingParsed.profile.education.map((e) => e.degree));
if (!hasFakeMba) {
  console.log("✓ PASS: 'Mumbai' was NOT falsely parsed as an MBA degree.");
} else {
  console.error("✗ FAIL: Substring 'Mumbai' parsed as MBA!");
  allPassed = false;
}

// Test 1D: Senior Data Engineer preserves full certification & experience
const sdeParsed = parseResumeText(seniorDataEngText);
console.log("SDE Certifications:", sdeParsed.profile.certifications);
const hasFullCert = sdeParsed.profile.certifications.some((c) => c.toLowerCase().includes("aws certified data analytics"));
if (hasFullCert) {
  console.log("✓ PASS: Full certification name preserved without truncation.");
} else {
  console.error("✗ FAIL: Certification truncated or missing.");
  allPassed = false;
}

// --- TEST 2: SCORING INTEGRITY & CALIBRATION ---
console.log("\n--- TEST 2: Fit Scoring on Target Requisition ('Senior Data Engineer') ---");

const sdeScore = computeFitDiagnostics(sdeParsed.profile, targetSeniorDataJob);
const mktScoreOnSde = computeFitDiagnostics(marketingParsed.profile, targetSeniorDataJob);
const fresherScoreOnSde = computeFitDiagnostics(fresherParsed.profile, targetSeniorDataJob);

console.log(`Senior Data Engineer Score: ${sdeScore.score}% (${sdeScore.scoreGrade})`);
console.log(`Marketing Manager Score on SDE Job: ${mktScoreOnSde.score}% (${mktScoreOnSde.scoreGrade})`);
console.log(`Fresher Score on SDE Job: ${fresherScoreOnSde.score}% (${fresherScoreOnSde.scoreGrade})`);

if (sdeScore.score >= 80 && mktScoreOnSde.score <= 25 && fresherScoreOnSde.score <= 20) {
  console.log("✓ PASS: Distinct, explainable scores. Fresher and Marketing scores reflect genuine mismatch without phantom points.");
} else {
  console.error("✗ FAIL: Scores are inflated or not distinct.");
  allPassed = false;
}

// Test 2B: Marketing Manager scoring on Marketing Job
const mktScoreOnMkt = computeFitDiagnostics(marketingParsed.profile, targetMarketingJob);
console.log(`Marketing Manager Score on Marketing Job: ${mktScoreOnMkt.score}% (${mktScoreOnMkt.scoreGrade})`);
if (mktScoreOnMkt.score >= 80) {
  console.log("✓ PASS: Marketing Manager scores high on relevant marketing requisition.");
} else {
  console.error("✗ FAIL: Marketing Manager did not score well on marketing job.");
  allPassed = false;
}

// --- TEST 3: COVER LETTER ADAPTABILITY & HARD EVIDENCE VALIDATION ---
console.log("\n--- TEST 3: Cover Letter Generation & Evidence Validation ---");

// Test 3A: Fresher cover letter
const fresherLetter = generateTailoredCoverLetter(fresherParsed.profile, targetSeniorDataJob);
console.log("Fresher Letter Sample Paragraphs:");
fresherLetter.paragraphs.forEach((p, i) => console.log(` [P${i+1}] ${p}`));

const hasFabricatedTenure = fresherLetter.fullText.toLowerCase().includes("throughout my tenure") ||
  fresherLetter.fullText.toLowerCase().includes("previous engineering roles") ||
  fresherLetter.fullText.toLowerCase().includes("previous roles");

const fresherValidation = validateCoverLetter(fresherLetter.fullText, fresherParsed.profile, targetSeniorDataJob);

if (!hasFabricatedTenure && fresherValidation.valid) {
  console.log("✓ PASS: Fresher cover letter is grounded without false tenure or fabricated roles.");
} else {
  console.error("✗ FAIL: Fresher cover letter contained fabricated claims:", fresherValidation.reasons);
  allPassed = false;
}

// Test 3B: Marketing cover letter uses marketing domain terms, not software engineering
const mktLetter = generateTailoredCoverLetter(marketingParsed.profile, targetMarketingJob);
const isSoftwareBiased = mktLetter.fullText.toLowerCase().includes("software systems") || mktLetter.fullText.toLowerCase().includes("engineering team");
const mktValidation = validateCoverLetter(mktLetter.fullText, marketingParsed.profile, targetMarketingJob);

if (!isSoftwareBiased && mktValidation.valid) {
  console.log("✓ PASS: Marketing cover letter adapted to growth & marketing domain.");
} else {
  console.error("✗ FAIL: Marketing cover letter used inappropriate software engineering boilerplate.");
  allPassed = false;
}

// Test 3C: Hard validation catches fabricated claims
const hallucinatedLetterText = `
Dear Hiring Team at Apex Cloud Systems,

Throughout my 4 years of experience as Lead Architect at Google, I managed a team of 15 engineers.
You can contact me at fake.suryakant@google.com or (555) 000-9999. See my work at https://linkedin.com/in/fake-profile.
`;
const caughtHallucination = validateCoverLetter(hallucinatedLetterText, fresherParsed.profile, targetSeniorDataJob);
console.log("Validator catches on fabricated input:", caughtHallucination.reasons);
if (!caughtHallucination.valid && caughtHallucination.reasons.length >= 3) {
  console.log("✓ PASS: Validator strictly caught fabricated email, phone, links, and fake company.");
} else {
  console.error("✗ FAIL: Validator failed to catch fabricated claims.");
  allPassed = false;
}

console.log("\n==================================================");
if (allPassed) {
  console.log("🎉 ALL ZERO-HALLUCINATION & TRUST TESTS PASSED!");
  process.exit(0);
} else {
  console.error("💥 SOME ACCEPTANCE TESTS FAILED.");
  process.exit(1);
}
