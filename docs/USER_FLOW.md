# CareerMonke User Flow, Route Boundaries & Architecture

This document formalizes the complete user journey, sitemap, public/private route boundaries, Free vs. Pro entitlement policy, and QA test results for **CareerMonke**.

---

## 1. High-Level Target Flow

```
[1. Understand Product] ──► [2. Verified Account] ──► [3. Preferences & Resume]
      (Landing Page)              (/signup or /login)           (/onboarding)
                                                                       │
                                                                       ▼
[6. Confirm in Tracker] ◄── [5. Apply on Employer ATS] ◄── [4. Relevant Jobs Feed]
    (/tracker Kanban)          (Official Portal)            (/dashboard or /jobs)
```

The user journey is guided, intuitive, and deterministic:
1. **Understand Product**: User lands on public `/` (no dashboard data leaked). Clear value proposition: jobs scraped directly from company ATS feeds before hitting public aggregators.
2. **Verified Account**: Signs up via Supabase Google OAuth or verified email magic link (`/signup` or `/login`). Same-site return URLs (`?next=...`) are preserved and strictly sanitized.
3. **Preferences & Resume**: Short 3-step onboarding (`/onboarding`):
   - *Step 1*: Role targets, seniority, employment types, remote scope, optional salary.
   - *Step 2*: Upload PDF/DOCX for deterministic fact extraction or **Skip**. (Skipping creates zero invented history/skills/match scores).
   - *Step 3*: Review preferences, resume status, daily digest opt-in, and launch.
4. **Relevant Jobs**: User lands on `/dashboard` (App Home) with today's verified matches, next-step banner, and application pipeline summary. Canonical browsing at `/jobs` with "For you", "All jobs", and "Saved" tabs.
5. **Inspect & Apply**: User inspects job at `/jobs/[id]`. Fit diagnostics explain matched skills vs missing skills. Pro unlocks direct company name and official ATS URL.
6. **Confirm & Track**: Opening the employer site does *not* blindly mark the job as applied. An inline check asks: *"Did you submit it?"* User explicitly moves it to `Applied` with a timestamp.

---

## 2. Complete Sitemap & Route Boundaries

| Route | Classification | Access Rule / Guard | Description |
| :--- | :--- | :--- | :--- |
| **`/`** | **Public** | If signed-in $\rightarrow$ redirect to `/dashboard` | Public landing page: Hero, Product preview (sample data), How it works (3 steps), Features, Coverage, Free vs Pro, FAQ, Footer. |
| **`/signup`** | **Auth** | If signed-in $\rightarrow$ redirect to `/dashboard` | New account creation via Google OAuth or verified email magic link. |
| **`/login`** | **Auth** | If signed-in $\rightarrow$ redirect to `/dashboard` or `?next=` | Account login with error states, resend cooldown timer, and sanitized return URLs. |
| **`/auth/callback`** | **Auth API** | Public route handler | Exhanges OAuth/OTP codes with Supabase and sets session cookies. |
| **`/onboarding`** | **Guided Flow** | Signed-in users | 3-step setup with Progress bar, Back, and Resume-Later buttons. |
| **`/dashboard`** | **App (Private)** | If guest $\rightarrow$ redirect to `/login?next=/dashboard` | Central App Home: Actionable next-step banner, Today's curated matches, Upcoming follow-ups, Pipeline summary, AI scan trigger. |
| **`/jobs`** | **App / Catalog** | Public safe teaser; Private enriched | Canonical jobs screen: "For you", "All jobs", "Saved" tabs. Match sorting only on confirmed resume facts. |
| **`/jobs/[id]`** | **App / Detail** | Public safe teaser; Private enriched | Stable job requisition address: Title, Company, Eligibility, Source, Fit diagnostics, Direct Apply / Unlock, Post-apply confirmation. |
| **`/job-search/all`** | **Legacy Redirect** | All users | 301/client-side redirect to `/jobs` preserving all query parameters. |
| **`/resume`** | **App (Private)** | If guest $\rightarrow$ redirect to `/login?next=/resume` | Clean resume management: confirmed facts table, editable items, replace/delete, ATS PDF/Word exports. |
| **`/tracker`** | **App (Private)** | If guest $\rightarrow$ redirect to `/login?next=/tracker` | Applications Kanban Tracker: Saved $\rightarrow$ Applied $\rightarrow$ Interview $\rightarrow$ Offer $\rightarrow$ Rejected. Manual external job entry. |
| **`/settings`** | **App (Private)** | If guest $\rightarrow$ redirect to `/login?next=/settings` | 4 Tabs: Profile & Preferences, Notifications, Billing & Plans, Privacy & Data Export. |
| **`/remote`** | **Public / Resources** | Open to all | Knowledge hub and guide directory (restored from previous redirect). |
| **`/remote/[slug]`** | **Public / SEO** | Open to all | In-depth career guide articles and comparison tables. |
| **`/remote/jobs/[category]`** | **Public / SEO** | Open to all | Niche role category landing pages. |
| **`/worldwide`** | **Public / Directory** | Open to all | Curated directory of 150+ companies hiring worldwide remote talent. |
| **`/radar`** | **Public / Explore** | Open to all | Interactive 3D WebGL globe visualizing global tech hiring clusters. |
| **`/privacy-policy`** | **Legal** | Open to all | Privacy policy and data erasure disclosures. |
| **`/terms-and-conditions`** | **Legal** | Open to all | Platform terms and conditions of use. |

---

## 3. Free vs. Pro Entitlement Matrix

CareerMonke enforces a strict, consistent access policy:

| Feature / Data Element | Free Tier | Pro Subscription (₹199 / $9/mo) |
| :--- | :--- | :--- |
| **Job Title & Requirements** | ✅ Full visibility | ✅ Full visibility |
| **Full Job Description** | ✅ Full visibility | ✅ Full visibility |
| **Company Name** | 🔒 Blurred with Pro Unlock prompt | ✅ Unblurred & clickable |
| **Reported Compensation** | 🔒 Blurred / locked | ✅ Unblurred exact ranges |
| **Direct ATS Application Link** | 🔒 Locked behind Pro paywall | ✅ 1-Click direct employer portal link |
| **Deterministic Fit Diagnostics** | ✅ Unlimited on confirmed resume | ✅ Unlimited on confirmed resume |
| **AI-Tailored Cover Letter** | 🔒 1 Trial version | ✅ Unlimited 1-click tailored letters |
| **ATS Resume Clean Export** | ✅ 1 Standard export | ✅ Unlimited versions |
| **Applications Tracker Pipeline** | 5 Tracked applications max | ✅ Unlimited tracked positions |
| **Automated Daily Digest Scan** | Manual dashboard trigger | ✅ Daily automated cron scan |
| **Billing Providers** | N/A | Domestic: Razorpay (₹199/mo UPI/Cards)<br>International: Stripe ($9/mo Cards) |

---

## 4. Redirect & Safety Verification Rules

1. **Same-Site Return URL Sanitization**:
   - `getValidReturnUrl(targetUrl, fallback)` ensures return destinations start with a single `/` and never contain `//` or `\`. Prevents open-redirect phishing attacks.
2. **Authenticated Landing Redirect**:
   - Logged-in users navigating to `/` are immediately redirected to `/dashboard`.
3. **Unauthenticated App Protection**:
   - Accessing `/dashboard`, `/tracker`, `/resume`, or `/settings` while logged out immediately routes to `/login?next=<current_path>`.
4. **Clean Cache Invalidation on Sign-Out**:
   - `signOutUser()` purges all local auth tokens, candidate profiles, and preference caches from browser storage so shared or public computers leak zero personal history.
5. **No Invented Facts**:
   - Skipping resume upload creates zero phantom skills or arbitrary match scores; jobs are presented as "Target Matches" based on declared role preferences.

---

## 5. QA Verification Checklist

- [x] **Guest Flow**:
  - Landing page renders hero, sample preview card, 3-step how-it-works, features, coverage, pricing teaser, FAQ, and footer.
  - Zero dashboard or private application data exposed to unauthenticated visitors.
  - All landing CTAs route to `/signup`.
- [x] **Auth Flow**:
  - `/signup` creates verified accounts.
  - `/login` supports Google OAuth and email OTP with resend cooldown timers and validation error alerts.
  - Return URL parameter `?next=` preserved across authentication steps.
- [x] **3-Step Onboarding**:
  - Step 1 collects role, seniority, remote preference, and optional salary.
  - Step 2 supports PDF/DOCX upload and editable fact review, or "Skip for now".
  - Step 3 summarizes profile and launches directly to `/dashboard`.
- [x] **Dashboard (`/dashboard`)**:
  - Next-step banner accurately detects missing resume facts or preferences.
  - Today's verified matches display real last-sync timestamps.
  - Pipeline snapshot shows real counts from tracker.
- [x] **Canonical Jobs (`/jobs`)**:
  - "For you", "All jobs", and "Saved" tabs operate smoothly.
  - Legacy `/job-search/all` redirects cleanly with all query params preserved.
  - Empty filter state offers single-click "Reset All Filters".
- [x] **Job Detail (`/jobs/[id]`)**:
  - Renders complete position details.
  - "Apply on Employer Site" prompts the post-apply confirmation modal (*"Did you submit it?"*).
  - Closed/missing positions show friendly 404 state with "Browse Active Jobs" CTA.
- [x] **Resume Facts (`/resume`)**:
  - Pro membership upsell panel removed.
  - Clean fact review, replace, and permanent delete controls.
- [x] **Applications Tracker (`/tracker`)**:
  - Labeled "Applications" across all navigation headers.
  - Kanban drag-and-drop and table views active.
- [x] **Settings (`/settings`)**:
  - 4 tabs functional: Preferences, Notifications, Billing, Privacy.
  - "Export JSON" downloads complete account data.
- [x] **Resources Hub (`/remote`)**:
  - Restored from previous redirect; now serves as an active guides and category index.
  - All occurrences of placeholder "YourBrand" replaced with "CareerMonke".
  - Sitemap and robots configured with canonical domain `https://careermonke.io`.
