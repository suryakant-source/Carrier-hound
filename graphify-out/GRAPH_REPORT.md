# Graph Report - Carrer-hound  (2026-09-25)

## Corpus Check
- 138 files · ~250,965 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 4, .css 4, .toml 1)

## Summary
- 503 nodes · 751 edges · 39 communities (29 shown, 10 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14
- Community 15
- Community 16
- Community 17
- Community 18
- Community 19
- Community 20
- Community 21
- Community 23
- Community 24
- Community 25
- Community 26
- Community 27
- Community 28
- Community 29
- Community 30
- Community 31
- Community 32
- Community 33
- Community 34
- Community 35
- Community 36
- Community 37

## God Nodes (most connected - your core abstractions)
1. `react` - 31 edges
2. `cn()` - 24 edges
3. `next` - 22 edges
4. `lucide-react` - 21 edges
5. `compilerOptions` - 15 edges
6. `gameState` - 13 edges
7. `compilerOptions` - 10 edges
8. `BrandIcon()` - 10 edges
9. `initThree()` - 7 edges
10. `initThree()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `JobPreviewProps` --references--> `Job`  [EXTRACTED]
  src/components/JobPreview.tsx → data/jobs.ts
- `ReviewCardProps` --references--> `Review`  [EXTRACTED]
  src/components/ReviewCards.tsx → data/testimonials.ts
- `MiniReviewCardProps` --references--> `MiniReview`  [EXTRACTED]
  src/components/ReviewCards.tsx → data/testimonials.ts
- `BackToTop()` --calls--> `cn()`  [EXTRACTED]
  src/components/BackToTop.tsx → src/lib/utils.ts
- `GhostButton()` --calls--> `cn()`  [EXTRACTED]
  src/components/Buttons.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (39 total, 10 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (30): TODO: REPLACE WITH REAL CONTENT, WORLDWIDE_COMPANIES, WorldwideCompany, DUMMY_JOBS, Job, TODO: REPLACE WITH REAL CONTENT, lucide-react, next (+22 more)

### Community 1 - "Community 1"
Cohesion: 0.08
Nodes (32): FULL_REVIEWS, MINI_REVIEWS, MiniReview, Review, clsx, tailwind-merge, PageProps, AVATAR_URLS (+24 more)

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (30): dependencies, tailwindcss, @tailwindcss/vite, devDependencies, svelte, svelte-check, @sveltejs/adapter-auto, @sveltejs/kit (+22 more)

### Community 3 - "Community 3"
Cohesion: 0.06
Nodes (33): devDependencies, autoprefixer, postcss, puppeteer-core, tailwindcss, @types/node, @types/react, @types/react-dom (+25 more)

### Community 4 - "Community 4"
Cohesion: 0.09
Nodes (21): activeQuestion, canCheck, checkAnswer(), correctAnswerText, explanationText, handleContinue(), handlePartPlayComplete(), handleWordDiscoveryComplete() (+13 more)

### Community 5 - "Community 5"
Cohesion: 0.11
Nodes (12): chapterStats, generatePathD(), generateSegmentD(), getNodeOffset(), hasReflection, nextLesson, S_CURVE_OFFSETS, sadhanaTask1Done (+4 more)

### Community 6 - "Community 6"
Cohesion: 0.12
Nodes (15): ComparisonRow, FAQItem, GUIDE_ARTICLES, GuideArticle, TODO: REPLACE WITH REAL CONTENT, CATEGORY_LANDINGS, CategoryLandingData, TODO: REPLACE WITH REAL CONTENT (+7 more)

### Community 7 - "Community 7"
Cohesion: 0.12
Nodes (14): bg247TeachingSlides, bg247WordBreakdown, bg248TeachingSlides, Chapter, Commentary, gitaData, Lesson, MCQOption (+6 more)

### Community 8 - "Community 8"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 9 - "Community 9"
Cohesion: 0.12
Nodes (17): dependencies, class-variance-authority, clsx, globe.gl, lucide-react, mapbox-gl, next, @radix-ui/react-dialog (+9 more)

### Community 10 - "Community 10"
Cohesion: 0.21
Nodes (12): createEmberTexture(), createFloatingLanterns(), createLanternTexture(), createRisingEmbers(), initAudio(), initThree(), onMouseMove(), onScroll() (+4 more)

### Community 11 - "Community 11"
Cohesion: 0.21
Nodes (12): createEmberTexture(), createFloatingLanterns(), createLanternTexture(), createRisingEmbers(), initAudio(), initThree(), onMouseMove(), onScroll() (+4 more)

### Community 12 - "Community 12"
Cohesion: 0.14
Nodes (13): ref_fs, ref_http, ref_path, fs, http, MIME, path, server (+5 more)

### Community 14 - "Community 14"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, checkJs, esModuleInterop, forceConsistentCasingInFileNames, moduleResolution, resolveJsonModule, skipLibCheck (+4 more)

### Community 15 - "Community 15"
Cohesion: 0.23
Nodes (9): three, JobRadarGlobe, JobRadarGlobe(), latLngToVector3(), CountryRegion, RADAR_CITIES, RADAR_COUNTRIES, RadarCity (+1 more)

### Community 16 - "Community 16"
Cohesion: 0.22
Nodes (8): CATEGORIES, CategoryItem, TODO: REPLACE WITH REAL CONTENT, @radix-ui/react-dialog, CategorySelectModal(), CategorySelectModalProps, Modal(), ModalProps

### Community 17 - "Community 17"
Cohesion: 0.25
Nodes (5): #each(), getSanskritDisplay(), IAST_TO_DEVANAGARI, SANSKRIT_DICT, SanskritDisplay

### Community 18 - "Community 18"
Cohesion: 0.25
Nodes (4): isHeartDecreasing, prevHearts, ScriptMode, ref_app

### Community 19 - "Community 19"
Cohesion: 0.25
Nodes (7): CertRoute, FitMeter, TODO: REPLACE WITH REAL CONTENT, ROLE_GUIDES, RoleGuideData, RoleLadderRung, TitleBand

### Community 20 - "Community 20"
Cohesion: 0.29
Nodes (6): CareerRoute, HUB_DATA, HubGuideItem, TODO: REPLACE WITH REAL CONTENT, Trailhead, WorkStyleItem

### Community 21 - "Community 21"
Cohesion: 0.29
Nodes (6): CareerRoute, HUB_DATA, HubGuideItem, TODO: REPLACE WITH REAL CONTENT, Trailhead, WorkStyleItem

### Community 23 - "Community 23"
Cohesion: 0.53
Nodes (4): getAudioContext(), playErrorSound(), playPopSound(), playSuccessSound()

### Community 24 - "Community 24"
Cohesion: 0.33
Nodes (5): ComparisonRow, FAQItem, GUIDE_ARTICLES, GuideArticle, TODO: REPLACE WITH REAL CONTENT

### Community 25 - "Community 25"
Cohesion: 0.40
Nodes (4): FULL_REVIEWS, MINI_REVIEWS, MiniReview, Review

### Community 26 - "Community 26"
Cohesion: 0.50
Nodes (3): name, private, version

### Community 27 - "Community 27"
Cohesion: 0.50
Nodes (3): CATEGORIES, CategoryItem, TODO: REPLACE WITH REAL CONTENT

### Community 28 - "Community 28"
Cohesion: 0.50
Nodes (3): TODO: REPLACE WITH REAL CONTENT, WORLDWIDE_COMPANIES, WorldwideCompany

### Community 29 - "Community 29"
Cohesion: 0.50
Nodes (3): CATEGORY_LANDINGS, CategoryLandingData, TODO: REPLACE WITH REAL CONTENT

### Community 30 - "Community 30"
Cohesion: 0.50
Nodes (3): DUMMY_JOBS, Job, TODO: REPLACE WITH REAL CONTENT

## Knowledge Gaps
- **224 isolated node(s):** `name`, `version`, `type`, `dev`, `build` (+219 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 293 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Community 0` to `Community 16`, `Community 1`, `Community 3`, `Community 15`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `next` connect `Community 0` to `Community 1`, `Community 3`, `Community 6`, `Community 15`, `Community 16`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `Community 0` to `Community 16`, `Community 1`, `Community 3`, `Community 15`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **What connects `name`, `version`, `type` to the rest of the system?**
  _224 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05924978687127025 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.08156028368794327 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.06417112299465241 - nodes in this community are weakly interconnected._