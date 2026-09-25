# 📜 Gita Yoga — Complete Project Documentation

This document provides a comprehensive guide to the **Gita Yoga** application architecture, feature set, data model, state management implementation, and technical setup.

---

## 📑 Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [Core App Features](#2-core-app-features)
3. [Technology Stack](#3-technology-stack)
4. [Architecture & Folder Structure](#4-architecture--folder-structure)
5. [State Management (Svelte 5 Runes)](#5-state-management-svelte-5-runes)
6. [Curriculum & Data Schema](#6-curriculum--data-schema)
7. [Layered Verse Study Engine](#7-layered-verse-study-engine)
8. [Mindful Reflection Journaling](#8-mindful-reflection-journaling)
9. [Setup & Developer Workflows](#9-setup--developer-workflows)

---

## 1. Executive Summary

**Gita Yoga** is an interactive, web-based educational and contemplative platform built to make learning, memorizing, and understanding the **Bhagavad Gita** accessible, intuitive, and spiritually grounded.

By combining Duolingo-inspired habit mechanics (streaks, XP, sequential path progression) with a **5-Layer Verse Study Model** (Sanskrit → Transliteration → Word Breakdown → Translation → Cited Commentary) and **Non-Graded Reflection Prompts**, the application avoids tone-deaf quiz jumping and fosters genuine spiritual reflection.

---

## 2. Core App Features

### 📜 1. Layered Verse Study Engine (`LayeredVerseView.svelte`)
- **Layer 1: Sanskrit (Devanagari)** — Sacred Devanagari script text rendering.
- **Layer 2: Transliteration (IAST)** — Phonetic Roman transliteration with diacritics.
- **Layer 3: Word-by-Word Breakdown** — Interactive word chips displaying Devanagari, root transliteration, part of speech, and exact English translation.
- **Layer 4: English Translation** — Contextual translation of the full verse.
- **Layer 5: Cited Commentary** — Authoritative commentary quotes with explicit citations (*Swami Sivananda*, *Adi Shankaracharya*, *Swami Gambhirananda*, *Eknath Easwaran*).

### 🪷 2. Mindful Reflection Journaling (`ReflectionPrompt.svelte`)
- Non-graded journaling mode triggered during emotionally and philosophically significant verses (e.g. Karma Yoga, detachment, equanimity).
- Allows users to write personal reflections without heart penalties or right/wrong scoring.
- Includes intent tags (*🧘 Detachment*, *💡 Clarity*, *⚖️ Equanimity*, *🌱 Self-Growth*, *🌸 Peace*).
- Entries are saved to `gameState.userReflections` in `localStorage`.

### 🗺️ 3. Gamified S-Curve Roadmap (`+page.svelte`)
- Visual roadmap organizing verses into Chapters, Sections, and Lessons with unlocked/locked progression.
- Nodes distinguish standard lessons (Star), chests (Chest), practice workouts (Dumbbell), and trophies (Trophy).

### 🕉️ 4. Dynamic Script Engine (`ScriptToggle.svelte`)
- Dual-script support: **Devanagari** and **English Transliteration (IAST)**, updated globally across all components.

---

## 3. Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | [Svelte 5](https://svelte.dev) | Modern reactive web framework utilizing `$state`, `$derived` runes |
| **App Engine** | [SvelteKit 2](https://kit.svelte.dev) | File-system routing, SSR/SSG capabilities |
| **Build Tool** | [Vite 5](https://vitejs.dev) | Fast development server and bundler |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) | Utility-first CSS engine |
| **Language** | [TypeScript](https://www.typescriptlang.org) | End-to-end static typing |

---

## 4. Architecture & Folder Structure

```
Bhagvatgita Game/
├── src/
│   ├── app.css                       # Global styling and Tailwind directives
│   ├── app.html                      # HTML shell & font inclusions
│   ├── lib/
│   │   ├── components/               # UI components
│   │   │   ├── LayeredVerseView.svelte   # 5-Layer Verse Study Component
│   │   │   ├── ReflectionPrompt.svelte   # Non-graded spiritual journaling component
│   │   │   ├── FeedbackModal.svelte      # Result feedback & explanation overlay
│   │   │   ├── FillInBlank.svelte        # Missing word selection exercise
│   │   │   ├── LessonProgress.svelte     # Progress bar & stats header
│   │   │   ├── MultipleChoice.svelte     # Standard MCQ component
│   │   │   ├── PhraseMatcher.svelte      # Phrase matching component
│   │   │   ├── QuizScreen.svelte         # Primary quiz controller & slide engine
│   │   │   ├── ScriptToggle.svelte       # Script mode switch button
│   │   │   ├── TeachingScreen.svelte     # Slide-deck visual intro component
│   │   │   └── WordTilePicker.svelte     # Drag-and-click verse reconstruction
│   │   ├── data/
│   │   │   ├── gitaData.ts               # Curriculum data & Commentaries
│   │   │   └── sanskritHelper.ts         # Transliteration utilities
│   │   └── state/
│   │       └── gameState.svelte.ts       # Central game state using Svelte 5 Runes
│   └── routes/
│       ├── +layout.svelte            # Base layout wrapper
│       ├── +page.svelte              # Main S-curve roadmap dashboard
│       └── lesson/
│           └── [lessonId]/
│               └── +page.svelte       # Active lesson quiz route
└── package.json                      # Project dependencies
```

---

## 5. State Management (Svelte 5 Runes)

Managed in [`gameState.svelte.ts`](file:///c:/Users/KIIT/Documents/Coding%20Projects/Web%20Development/ORM/Bhagvatgita%20Game/src/lib/state/gameState.svelte.ts):

```typescript
class GameState {
  hearts = $state(5);
  xp = $state(0);
  streak = $state(0);
  completedLessons = $state<string[]>([]);
  lastActiveDate = $state<string | null>(null);
  scriptMode = $state<'devanagari' | 'english'>('devanagari');
  userReflections = $state<Record<string, string>>({});

  // Key Methods
  saveReflection(promptId: string, text: string) // Persists journal entry
  completeLesson(lessonId: string)              // Awards XP & updates streak
  decrementHeart()                              // Depletes heart on wrong quiz answer
}
```

---

## 6. Curriculum & Data Schema

```typescript
export interface Commentary {
  author: string;      // e.g. "Swami Sivananda", "Adi Shankaracharya"
  tradition: string;   // e.g. "Advaita Vedanta", "Divine Life Society"
  text: string;        // Commentary content
}

export interface Lesson {
  id: string;
  title: string;
  verseRef: string;
  verseSanskrit: string;
  verseTransliteration: string;
  translation: string;
  purport: string;
  commentary?: Commentary;
  reflectionPrompt?: string;
  parts?: VersePart[];
  finalSynthesisQuestions?: Question[];
  wordBreakdown: WordMeaning[];
  questions: Question[];
}
```

---

## 7. Setup & Developer Workflows

```bash
npm install
npm run dev
npm run check
npm run build
```
