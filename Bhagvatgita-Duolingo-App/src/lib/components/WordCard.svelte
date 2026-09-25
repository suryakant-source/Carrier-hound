<script lang="ts">
  import type { WordMeaning } from "../data/gitaData";

  let { word, onNext } = $props<{
    word: WordMeaning;
    onNext: () => void;
  }>();

  let flipped = $state(false);
  let entered = $state(false);

  // Pop-in entrance on mount
  import { onMount } from "svelte";
  onMount(() => {
    requestAnimationFrame(() => {
      entered = true;
    });
  });

  function flip() {
    if (!flipped) flipped = true;
  }

  // Color-code part of speech
  function posColor(pos: string): string {
    const p = pos.toLowerCase();
    if (p.includes("noun"))
      return "bg-sky-500/20 text-sky-300 border-sky-500/30";
    if (p.includes("verb"))
      return "bg-amber-500/20 text-amber-300 border-amber-500/30";
    if (p.includes("pronoun"))
      return "bg-violet-500/20 text-violet-300 border-violet-500/30";
    if (p.includes("adverb"))
      return "bg-teal-500/20 text-teal-300 border-teal-500/30";
    if (p.includes("particle"))
      return "bg-rose-500/20 text-rose-300 border-rose-500/30";
    if (p.includes("compound"))
      return "bg-orange-500/20 text-orange-300 border-orange-500/30";
    return "bg-slate-500/20 text-slate-300 border-slate-500/30";
  }
</script>

<!-- Card Scene -->
<div
  class="card-scene w-full max-w-xs mx-auto select-none cursor-pointer"
  style="height: 240px;"
  onclick={flip}
  role="button"
  tabindex="0"
  onkeydown={(e) => e.key === "Enter" && flip()}
  aria-label="Vocabulary card. Tap to reveal meaning."
>
  <div
    class="card-inner w-full h-full {flipped ? 'card-flipped' : ''} {entered
      ? 'card-entered'
      : 'card-pending'}"
  >
    <!-- FRONT FACE -->
    <div
      class="card-face card-front bg-bg-surface border border-slate-700 rounded-3xl shadow-2xl flex flex-col items-center justify-center gap-3 p-6"
    >
      <!-- Subtle Om watermark -->
      <div
        class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]"
      >
        <span class="text-8xl text-primary font-cinzel select-none">ॐ</span>
      </div>

      <span
        class="text-[9px] font-black uppercase tracking-[0.25em] text-text-muted/60"
        >New Word</span
      >

      <!-- Devanagari -->
      <p
        class="text-5xl font-bold text-primary font-cinzel leading-none tracking-wide z-10"
      >
        {word.devanagari}
      </p>

      <!-- Transliteration -->
      <p class="text-base text-text-muted italic font-light tracking-wide z-10">
        {word.word}
      </p>

      <!-- Tap hint -->
      <div class="flex items-center gap-1.5 mt-2 text-text-muted/50 z-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-3.5 h-3.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672Zm-7.518-.267A8.25 8.25 0 1 1 20.25 10.5M8.288 14.212A5.25 5.25 0 1 1 17.25 10.5"
          />
        </svg>
        <span class="text-[10px] font-medium">Tap to reveal</span>
      </div>
    </div>

    <!-- BACK FACE -->
    <div
      class="card-face card-back bg-bg-surface border border-primary/30 rounded-3xl shadow-2xl flex flex-col items-center justify-center gap-3 p-6"
    >
      <!-- Glow ring -->
      <div
        class="absolute inset-0 rounded-3xl bg-primary/5 pointer-events-none"
      ></div>

      <span
        class="text-[9px] font-black uppercase tracking-[0.25em] text-primary/70"
        >Meaning</span
      >

      <!-- English meaning -->
      <p
        class="text-2xl font-black text-text-primary text-center leading-snug z-10"
      >
        {word.meaning}
      </p>

      <!-- Divider -->
      <div class="w-12 h-px bg-slate-700 z-10"></div>

      <!-- Part of speech pill -->
      <span
        class="text-[10px] font-bold px-3 py-1 rounded-full border {posColor(
          word.partOfSpeech,
        )} z-10"
      >
        {word.partOfSpeech}
      </span>

      <!-- Devanagari anchor (memory) -->
      <p class="text-sm text-primary/50 font-cinzel italic z-10">
        {word.devanagari}
      </p>
    </div>
  </div>
</div>

<!-- Got it button — only visible after flip -->
{#if flipped}
  <div class="mt-5 px-4 animate-[fade-slide-up_0.3s_ease-out_both]">
    <button
      onclick={(e) => {
        e.stopPropagation();
        onNext();
      }}
      class="w-full max-w-xs mx-auto flex items-center justify-center gap-2 p-4 bg-primary hover:bg-primary-dark text-bg-base font-black text-sm rounded-2xl shadow-lg btn-3d border-b-4 border-amber-900 active:scale-[0.98] transition-all"
    >
      <span>Got it!</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        class="w-5 h-5"
      >
        <path
          fill-rule="evenodd"
          d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
  </div>
{/if}

<style>
  .card-scene {
    perspective: 1000px;
  }

  .card-inner {
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.55s cubic-bezier(0.4, 0.2, 0.2, 1);
  }

  .card-pending {
    transform: scale(0.88) rotateY(0deg);
    opacity: 0;
  }

  .card-entered {
    transform: scale(1) rotateY(0deg);
    opacity: 1;
    transition:
      transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
      opacity 0.3s ease;
  }

  .card-flipped.card-entered {
    transform: scale(1) rotateY(180deg);
    transition: transform 0.55s cubic-bezier(0.4, 0.2, 0.2, 1);
  }

  .card-face {
    position: absolute;
    inset: 0;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }

  .card-back {
    transform: rotateY(180deg);
  }

  @keyframes fade-slide-up {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
