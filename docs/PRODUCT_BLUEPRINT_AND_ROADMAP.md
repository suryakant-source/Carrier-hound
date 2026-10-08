# CareerMonke (Careerhound) — Comprehensive Product, Tech, Business & Roadmap Blueprint

---

## Executive Summary
**CareerMonke** is a modern job discovery platform designed to connect job seekers directly to verified public openings on top employer career portals (powered by ATS platforms such as Greenhouse, Ashby, Lever, SmartRecruiters, Recruitee, and Workable). By prioritizing source-direct applications, transparent compensation bands, and an interactive 3D WebGL radar, CareerMonke eliminates the clutter, ghost listings, and intermediary markups typical of traditional legacy job boards like LinkedIn and Naukri.

---

## Section A: Product Basics

### 1. Product Name & Core Value Proposition
* **Name:** **CareerMonke** (Internal Repo: `Carrier-hound` / `yourbrand-job-discovery`).
* **One-Line Pitch:** A high-fidelity job discovery platform that aggregates verified direct-from-source tech openings from 500+ official company ATS endpoints, featuring an interactive 3D Globe Radar (`/radar`) to visualize global hiring density in real-time.

### 2. Target Audience & Core Problems Solved
* **Target Audience:**
  * Software engineers, frontend/backend/full-stack developers, DevOps/SRE, AI/ML engineers.
  * Product managers, UI/UX designers, data scientists, and technical interns.
  * Remote and global job seekers targeting direct employer career endpoints.
* **Geography:**
  * **India First:** Key tech hubs (Bangalore, Delhi NCR, Mumbai, Hyderabad, Pune).
  * **Global Tech Hubs:** US (San Francisco, NYC, Seattle, Austin), Europe (London, Dublin, Berlin, Amsterdam), APAC (Singapore, Tokyo).
* **Problems Solved:**
  * **Ghost & Broker Listings:** Traditional platforms (LinkedIn, Naukri) frequently host expired listings, third-party recruiters, and reposted "ghost" jobs.
  * **Scattered Portals:** Companies publish real openings across fragmented ATS portals (Greenhouse, Ashby, Lever). CareerMonke centralizes these with 100% direct-apply links.
  * **Lack of Compensation & Location Transparency:** Unmasks official employer salary bands, actual work locations, and true remote-eligibility rules.

### 3. Platforms & Deployment Status
* **Platform:** Responsive Web Application (Desktop, Tablet, and Mobile browsers — certified from 360px to 430px mobile widths and 768px tablets).
* **Current Status:** **Live in Production** with active CI/CD deployment.
* **Live Endpoints:**
  * **Production URL:** [https://careermonke.netlify.app](https://careermonke.netlify.app)
  * **3D Globe Radar:** [https://careermonke.netlify.app/radar](https://careermonke.netlify.app/radar)
  * **Job Feed:** [https://careermonke.netlify.app/job-search/all](https://careermonke.netlify.app/job-search/all)
  * **Repository:** [https://github.com/suryakant-source/Carrier-hound.git](https://github.com/suryakant-source/Carrier-hound.git) (Branch: `main`)

### 4. Feature Matrix: Shipped vs. Upcoming (Jobright.ai Feature Parity)

| Category | Feature | Status | Description |
|---|---|---|---|
| **Data Ingestion** | 500 Verified ATS Companies | ✅ **Live** | Direct sync with Greenhouse, Ashby, Lever, SmartRecruiters, Recruitee, Workable. |
| **Data Ingestion** | 16,400+ Active Roles | ✅ **Live** | 15,800+ Verified Direct ATS listings with closure & disappearance tracking. |
| **3D Radar** | 3D Interactive WebGL Globe | ✅ **Live** | Logarithmic density colors (Cyan -> Blue -> Violet -> Orange), 60 FPS GPU-accelerated. |
| **3D Radar** | 4 Light Filters | ✅ **Live** | Country (sorted by count), Category, Remote toggle, Internships toggle. |
| **Monetization** | Free vs. Pro Visual Paywall | ✅ **Live** | Free sees titles & initial avatar; Pro locks exact salary, company name, direct apply link. |
| **Responsiveness** | Mobile Optimization | ✅ **Live** | 0px horizontal overflow on 360px–430px mobile devices, 44px+ touch targets, iOS zoom fix. |
| **Jobright Feature 1** | Resume Parser & Fact Extraction | 🟡 **Planned (v1.1)** | Upload resume (PDF/DOCX) -> Extract verified skills & career timeline without hallucinations. |
| **Jobright Feature 2** | AI Match Score & Fit Diagnostics | 🟡 **Planned (v1.1)** | "85% Match" + "Why You Fit" + "Missing Skills" deterministic diagnostic breakdown. |
| **Jobright Feature 3** | ATS Resume Tailoring & Cover Letter | 🟡 **Planned (v1.1)** | 1-Click job-tailored cover letter generator & clean ATS-friendly resume export (PDF/Word). |
| **Jobright Feature 4** | Application Kanban Tracker | 🟡 **Planned (v1.1)** | Application pipeline tracker (Saved -> Applied -> Interview -> Offer -> Rejected). |
| **Billing** | Razorpay & Stripe Gateway | 🟡 **Planned (v2.0)** | Domestic UPI/Cards (₹199/month) and International ($9/month) checkout & webhook verification. |
| **Automation** | Daily Automated Cron | 🟡 **Planned (v1.2)** | GitHub Actions workflow (`ingest.yml`) scheduled daily at 02:00 AM IST. |
| **Jobright Feature 5** | Chrome Extension Form Autofill | 🔮 **Future (v3.0)** | Auto-fill Greenhouse/Lever job application forms in 1 click. |

### 5. Team & Maintenance
* **Created By:** Suryakant Sahoo and founding team.
* **Timeline:** Initial architecture and blueprints finalized September 28–29, 2026; MVP, Supabase live pipeline, 3D radar, free-vs-pro system, and responsive layout built October 2026.
* **Maintainer:** Suryakant Sahoo (GitHub owner & Netlify administration).

---

## Section B: Numbers & Financials

### 6. User Metrics & Current Inventory
* **Current Stage:** MVP / Private Beta testing.
* **Database Inventory:** **16,423 Active Roles**, **500 Verified Employers**, 37 Global Tech Metros.
* **Active Users:** Initial developer and tester accounts (<50 users). Public launch target: **1,000–5,000 initial users**.

### 7. Monetization & Pricing Model
* **Current Revenue:** ₹0 / month (Pre-monetization; checkout flow staged for Razorpay/Stripe).
* **Proposed Pricing Structure:**
  * **Free Forever:** Full job browsing, search, direct ATS links, 10 matches/day, 1 free trial cover letter, 1 free ATS export.
  * **Pro Monthly (India):** **₹199 / month** (or **₹1,499 / year**).
  * **Pro Monthly (Global):** **$9 / month** (or **$59 / year**).
  * **Pro Entitlements:** Unmasked salary bands, direct ATS links, unlimited fit diagnostics, 30 AI cover letters/mo, 10 ATS exports/mo, unlimited application tracker slots.

### 8. Retention & Growth Drivers
* **Retention Levers:**
  * Daily updated feed of verified employer openings.
  * Job status tracker with follow-up reminders.
  * Verified closure removal (no frustrating dead apply links).

### 9. Monthly Infrastructure & Operational Costs

| Phase / Scenario | Netlify (Hosting) | Supabase (Database/Auth) | Scraper / Worker | User AI (GPT-4o mini) | Total Monthly (USD) | Total Monthly (INR) |
|---|---|---|---|---|---|---|
| **MVP Test (Current)** | $0 (Free) | $0 (Free, 500MB) | $5 – $10 | $0 | **$5 – $25** | **₹480 – ₹2,400** |
| **Production Baseline (100–500 DAU)** | $20 (Pro) | $25 (Pro) | $15 – $25 | $5 – $15 | **$50 – $70** | **₹4,800 – ₹6,720** |
| **Growth (1,000 DAU)** | $30 – $40 | $40 – $65 | $25 – $50 | $20 – $40 | **$120 – $220** | **₹11,500 – ₹21,000** |
| **Scale (10,000 DAU)** | $40 | $65 | $50 | $86 – $229 | **$240 – $1,100** | **₹23,000 – ₹1,05,000** |

* **Storage Efficiency:** 17,400+ jobs currently consume **~28 MB** (approx. 5.6% of Supabase free 500 MB quota).
* **Annual Domain Cost:** ~$11–$15 / year (₹1,000–₹1,400/year).

---

## Section C: Technical Architecture

### 10. Technology Stack
* **Frontend:** Next.js 14 (App Router, Static HTML Export `output: "export"`), React 18, TypeScript, Tailwind CSS, Lucide Icons.
* **3D Visualization:** Three.js (WebGL 3D Earth, custom orbit controls, GPU transform rendering).
* **Backend & Persistence:** Supabase (PostgreSQL with Row Level Security, Supabase Auth, Private Storage).
* **Ingestion Pipeline:** Node.js / TypeScript worker engine (`scripts/ingest.ts`, `scripts/discovery.ts`) with 6 ATS adapters.
* **Hosting & CDN:** Netlify Edge Network (`careermonke.netlify.app`).

### 11. Third-Party Integrations
* **Supabase:** Managed database, user authentication (email/Google), file storage.
* **Netlify:** Continuous deployment, preview builds, static asset distribution.
* **Public ATS Endpoints:** Greenhouse API, Ashby API, Lever API, SmartRecruiters API, Recruitee API, Workable API.
* **Geo Assets:** Natural Earth 110m land polygons (`ne_110m_land.json`) for 3D continent projection.
* **Planned Third-Party Services:**
  * **OpenAI (GPT-4o mini):** Token-efficient resume parsing and structured cover letter drafting.
  * **Razorpay:** Domestic Indian payments (UPI, Cards, NetBanking, Subscriptions).
  * **Stripe:** Global card checkout and multi-currency billing.
  * **Resend:** Transactional email and new match alerts.

### 12. Security & Compliance
* **Credential Isolation:** Service-role keys and administrative database credentials exist exclusively in secure server environments; browser bundle receives only the public anonymous key.
* **PostgreSQL RLS:** Deny-by-default access policies enforce strict user isolation for profiles, applications, and documents.
* **Ethical Data Ingestion:**
  * Scrapes **only** official employer ATS endpoints and public company career pages.
  * Does not copy or scrape aggregator platforms (LinkedIn, Naukri, Indeed).
  * Respects robots.txt policies, rates, and HTTP 429 backoff headers.
  * Published policies available at `/terms-and-conditions` and `/privacy-policy`.

---

## Section D: Business & Competitive Strategy

### 13. Competitive Landscape
* **Jobright.ai (Primary Benchmark):** AI job search assistant ($19.99/mo). High price point for Indian job seekers; US-centric.
* **LinkedIn & Naukri:** High volume, but plagued by duplicate listings, promoter spam, and ghost postings.
* **Otta / Welcome:** Tech curated jobs, but limited regional coverage in emerging markets.
* **Simplify / Huntr:** Specialized application trackers lacking native direct-ATS search.

### 14. Unique Selling Proposition (USP)
1. **Source-Direct Verified Jobs:** Zero intermediary agencies; 100% direct-to-ATS application links.
2. **Visual 3D Discovery:** Interactive 3D globe radar mapping tech hiring hubs globally.
3. **Affordable Pricing:** Jobright features offered at **₹199/month** (approx. 1/10th the price of US competitors).
4. **Factual AI (No Hallucinations):** Strict factual validation ensures resumes and cover letters never invent experience.

### 15. Go-To-Market & Growth Strategy
* **Programmatic SEO:** Scaled role and location landing pages (`/remote/jobs/[category]`, `/worldwide`).
* **Visual Viral Loops:** Video captures and interactive links of the 3D Radar shared across LinkedIn, Twitter (X), and developer forums.
* **Community Seeding:** Launch campaigns across Product Hunt, `r/developersIndia`, developer Discord servers, and university alumni networks.

### 16. Target Milestones & Timeline
* **Sprint 1 (Weeks 1–2):** Resume Upload, Fact Extraction, and **Deterministic Match Scoring (Jobright style: "Why You Fit" + "Missing Skills")**.
* **Sprint 2 (Weeks 3–4):** AI Cover Letter Generator + ATS Resume Builder (DOCX/PDF Export) + Kanban Application Tracker.
* **Sprint 3 (Weeks 5–6):** Razorpay Subscription Integration + Automated Daily Ingestion Cron.
* **Month 3 Target:** 15,000 registered users, 500+ Pro subscribers, achieving ₹1,00,000+ MRR.
