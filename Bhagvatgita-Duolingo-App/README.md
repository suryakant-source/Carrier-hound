# 🕉️ Gita Yoga - Bhagavad Gita Interactive Learning App

An interactive, gamified web application designed to help users learn, understand, and recite the sacred verses of the **Bhagavad Gita** through Duolingo-inspired bite-sized lessons, multi-modal exercises, 5-layer verse study, cited commentaries, and non-graded spiritual reflection journaling.

---

## 🌟 Overview

**Gita Yoga** transforms the study of ancient wisdom into an engaging, structured, and deeply reflective experience. Rather than jumping straight into quizzes, the app provides a **5-Layer Verse Study Model** (Sanskrit → Transliteration → Word Breakdown → Translation → Cited Commentary) alongside **Mindful Reflection Prompts** to foster spiritual depth alongside gamified learning.

---

## ✨ Key Features

### 📜 Layered Verse Study View
- **5-Layer Contemplation Engine**:
  1. **Layer 1: Sanskrit (Devanagari)** — Sacred Devanagari script text rendering.
  2. **Layer 2: Transliteration (IAST)** — Clear phonetic Roman transliteration with diacritics.
  3. **Layer 3: Word-by-Word Breakdown** — Interactive word tiles displaying Devanagari, root transliteration, part of speech, and exact English translation.
  4. **Layer 4: English Translation** — Contextual translation of the full verse.
  5. **Layer 5: Cited Commentary** — Authoritative commentary quotes with explicit citations (*Swami Sivananda*, *Adi Shankaracharya*, *Swami Gambhirananda*, *Eknath Easwaran*).
- **Study Filter Tabs**: Switch between full view or focus directly on individual layers.

### 🪷 Mindful Reflection Prompts (Spiritual Journaling)
- **Non-Graded Journaling**: For emotionally and philosophically loaded verses (e.g. Karma Yoga, detachment, equanimity), users encounter open-ended journaling prompts.
- **Tone-Aware Design**: Does not penalize users or consume hearts, keeping the app spiritually grounded.
- **Intent & Mindset Tags**: Tag entries with mental states like *🧘 Detachment*, *💡 Clarity*, *⚖️ Equanimity*, *🌱 Growth*, or *🌸 Peace*.
- **Journal Persistence**: Personal entries automatically save to `localStorage` in `gameState`.

### 🗺️ Interactive Learning Map
- **Duolingo-style S-Curve Progression**: Visual roadmap organizing verses into Chapters, Sections, and Lessons.
- **Dynamic Node Icons**: Unique visual nodes (Star, Chest, Dumbbell, Trophy) representing standard lessons, rewards, practice exercises, and chapter milestones.

### 🕉️ Dual Script System
- **Instant Script Toggle**: Switch dynamically between original **Devanagari** (Sanskrit) script and **English Transliteration (IAST)** across the entire interface.

### 🎮 Gamification & Progress Tracking
- **Heart Pool**: 5 hearts system to encourage accuracy during quizzes.
- **XP Rewards**: Earn experience points (+50 XP per lesson) upon completing lessons.
- **Streak Tracker**: Automatic calculation of daily activity streaks.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Svelte 5](https://svelte.dev) (using `$state`, `$derived`, and `$props` runes) |
| **Meta-Framework** | [SvelteKit 2](https://kit.svelte.dev) |
| **Build Tool** | [Vite 5](https://vitejs.dev) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) |
| **Language** | TypeScript |
| **Storage** | Browser `localStorage` |

---

## 📂 Project Structure

```
Bhagvatgita Game/
├── src/
│   ├── app.css                 # Global styling and Tailwind imports
│   ├── app.html                # Base HTML template with Google Fonts
│   ├── lib/
│   │   ├── components/         # Modular UI components
│   │   │   ├── LayeredVerseView.svelte   # 5-Layer Verse Study Component (Sanskrit -> Commentary)
│   │   │   ├── ReflectionPrompt.svelte   # Non-graded spiritual journaling component
│   │   │   ├── FeedbackModal.svelte      # Correct/Incorrect modal with explanations
│   │   │   ├── FillInBlank.svelte        # Fill-in-the-blank quiz module
│   │   │   ├── LessonProgress.svelte     # Progress bar & stats header
│   │   │   ├── MultipleChoice.svelte     # MCQ option list component
│   │   │   ├── PhraseMatcher.svelte      # Interactive phrase matching exercise
│   │   │   ├── QuizScreen.svelte         # Primary quiz controller & slide engine
│   │   │   ├── ScriptToggle.svelte       # Devanagari/English script switcher
│   │   │   ├── TeachingScreen.svelte     # Instructional slides with Layered Verse View
│   │   │   └── WordTilePicker.svelte     # Sentence rebuilder exercise
│   │   ├── data/
│   │   │   ├── gitaData.ts               # Curriculum data (Chapters, Lessons, Commentaries)
│   │   │   └── sanskritHelper.ts         # Transliteration & helper utilities
│   │   └── state/
│   │       └── gameState.svelte.ts       # Central state store (Hearts, XP, Reflections)
│   └── routes/
│       ├── +layout.svelte      # Main app wrapper layout
│       ├── +page.svelte        # Dashboard & S-curve learning path screen
│       └── lesson/
│           └── [lessonId]/
│               └── +page.svelte # Active lesson quiz route
└── package.json                # Project dependencies and scripts
```

---

## 🚀 Getting Started

### Installation & Running
```bash
npm install
npm run dev
```

### Type Checking & Building
```bash
npm run check
npm run build
```
