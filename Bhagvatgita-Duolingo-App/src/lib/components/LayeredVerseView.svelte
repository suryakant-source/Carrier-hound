<script lang="ts">
  import type { WordMeaning, Commentary } from "../data/gitaData";
  import { getSanskritDisplay } from "../data/sanskritHelper";

  let {
    verseSanskrit,
    verseTransliteration,
    wordBreakdown,
    translation,
    commentary,
    verseRef,
  } = $props<{
    verseSanskrit: string;
    verseTransliteration: string;
    wordBreakdown: WordMeaning[];
    translation: string;
    commentary?: Commentary;
    verseRef?: string;
  }>();

  // Active word popover modal state
  let activeWord = $state<WordMeaning | null>(null);

  // Single-slide index (0: Sanskrit, 1: Transliteration, 2: Word Breakdown, 3: Translation, 4: Commentary)
  let currentSlide = $state(0);

  // Secondary "Full View" toggle state
  let isFullView = $state(false);

  const totalSlides = $derived(commentary ? 5 : 4);

  function nextSlide() {
    if (currentSlide < totalSlides - 1) {
      currentSlide += 1;
    }
  }

  function prevSlide() {
    if (currentSlide > 0) {
      currentSlide -= 1;
    }
  }
</script>

<div class="flex flex-col gap-5 w-full max-w-xl mx-auto select-none">
  <!-- Top Controls: Single-Slide Dots & Full View Toggle -->
  <div
    class="flex items-center justify-between bg-bg-surface/90 border border-slate-800 p-2.5 rounded-2xl shadow-inner"
  >
    <!-- Dots Progress Indicator -->
    {#if !isFullView}
      <div class="flex items-center gap-2">
        {#each Array(totalSlides) as _, i}
          <button
            onclick={() => (currentSlide = i)}
            class="h-2.5 rounded-full transition-all duration-200 {currentSlide ===
            i
              ? 'w-7 bg-primary shadow-sm'
              : 'w-2.5 bg-slate-800 hover:bg-slate-700'}"
            aria-label="Slide {i + 1}"
          ></button>
        {/each}
      </div>
    {:else}
      <span
        class="text-[10px] font-black uppercase tracking-wider text-primary"
      >
        Full Stacked View
      </span>
    {/if}

    <!-- Secondary Toggle Button -->
    <button
      onclick={() => (isFullView = !isFullView)}
      class="px-3 py-1 rounded-xl text-[10px] font-extrabold border transition-all active:scale-95 {isFullView
        ? 'bg-primary/20 text-primary border-primary/40'
        : 'bg-bg-base text-text-muted border-slate-800 hover:text-text-primary'}"
    >
      {isFullView ? "Single Slide View" : "Full Stacked View"}
    </button>
  </div>

  {#if !isFullView}
    <!-- SINGLE SLIDE PRESENTATION MODE -->
    <div class="relative min-h-[300px] flex flex-col justify-between">
      <!-- Slide Content -->
      {#if currentSlide === 0}
        <!-- SLIDE 1: SANSKRIT -->
        <div
          class="bg-bg-surface border border-primary/40 p-6 rounded-3xl shadow-xl flex flex-col gap-4 relative overflow-hidden animate-[fade-in_0.2s_ease-out]"
        >
          <div
            class="flex items-center justify-between border-b border-primary/20 pb-3"
          >
            <span
              class="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-1.5"
            >
              <span class="font-cinzel font-bold text-xs">ॐ</span> Layer 1 · Sacred
              Sanskrit
            </span>
            {#if verseRef}
              <span
                class="text-[10px] font-bold text-amber-300 bg-primary/10 px-2 py-0.5 rounded-md border border-primary/30"
              >
                {verseRef}
              </span>
            {/if}
          </div>

          <div class="py-6 text-center">
            <p
              class="text-2xl sm:text-3xl font-extrabold font-cinzel text-amber-100 tracking-wide leading-relaxed whitespace-pre-line drop-shadow-md"
            >
              {verseSanskrit}
            </p>
          </div>
        </div>
      {:else if currentSlide === 1}
        <!-- SLIDE 2: TRANSLITERATION -->
        <div
          class="bg-bg-surface border border-teal-500/40 p-6 rounded-3xl shadow-xl flex flex-col gap-4 animate-[fade-in_0.2s_ease-out]"
        >
          <div
            class="flex items-center justify-between border-b border-teal-500/20 pb-3"
          >
            <span
              class="text-[10px] font-black uppercase tracking-[0.2em] text-teal-400"
            >
              Layer 2 · Transliteration (IAST)
            </span>
          </div>

          <div class="py-6 text-center">
            <p
              class="text-base sm:text-lg font-semibold text-teal-200 italic font-mono leading-relaxed whitespace-pre-line"
            >
              {verseTransliteration}
            </p>
          </div>
        </div>
      {:else if currentSlide === 2}
        <!-- SLIDE 3: WORD BREAKDOWN -->
        <div
          class="bg-bg-surface border border-emerald-500/40 p-6 rounded-3xl shadow-xl flex flex-col gap-4 animate-[fade-in_0.2s_ease-out]"
        >
          <div
            class="flex items-center justify-between border-b border-slate-800 pb-3"
          >
            <span
              class="text-[10px] font-black uppercase tracking-[0.2em] text-success"
            >
              Layer 3 · Word-by-Word Breakdown
            </span>
            <span class="text-[9px] text-text-muted font-bold">
              Tap tile for details
            </span>
          </div>

          <div class="flex flex-wrap gap-2.5 items-stretch justify-center py-2">
            {#each wordBreakdown as item}
              {@const display = getSanskritDisplay(item.word)}
              <button
                onclick={() => (activeWord = item)}
                class="flex flex-col items-center group cursor-pointer active:scale-95 transition-all text-center"
              >
                <div
                  class="px-3 py-2 rounded-2xl bg-bg-base border border-slate-750 group-hover:border-success/50 shadow-sm transition-all border-b-4 border-b-slate-950 flex flex-col items-center justify-center min-w-[70px]"
                >
                  <span
                    class="text-[9px] font-semibold text-text-muted group-hover:text-success tracking-wider"
                  >
                    {display.englishSyllables}
                  </span>
                  <span
                    class="text-sm font-black text-text-primary font-cinzel mt-0.5"
                  >
                    {item.devanagari}
                  </span>
                </div>
                <span
                  class="text-[10px] font-bold text-success/90 group-hover:text-success max-w-[100px] leading-tight text-center mt-1 border-b border-dashed border-success/30 pb-0.5"
                >
                  {item.meaning}
                </span>
              </button>
            {/each}
          </div>
        </div>
      {:else if currentSlide === 3}
        <!-- SLIDE 4: ENGLISH TRANSLATION -->
        <div
          class="bg-bg-surface border border-slate-750 p-6 rounded-3xl shadow-xl flex flex-col gap-4 animate-[fade-in_0.2s_ease-out]"
        >
          <div
            class="flex items-center justify-between border-b border-slate-800 pb-3"
          >
            <span
              class="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted"
            >
              Layer 4 · Full English Translation
            </span>
          </div>

          <div class="py-4">
            <p
              class="text-base sm:text-lg font-medium text-text-primary italic leading-relaxed pl-3 border-l-2 border-primary/60"
            >
              "{translation}"
            </p>
          </div>
        </div>
      {:else if currentSlide === 4 && commentary}
        <!-- SLIDE 5: CITED COMMENTARY -->
        <div
          class="bg-bg-surface border border-primary/40 p-6 rounded-3xl shadow-xl flex flex-col gap-4 animate-[fade-in_0.2s_ease-out]"
        >
          <div
            class="flex items-center justify-between border-b border-primary/20 pb-3"
          >
            <span
              class="text-[10px] font-black uppercase tracking-[0.2em] text-primary"
            >
              Layer 5 · Philosophical Commentary
            </span>
            <span
              class="text-[10px] font-extrabold text-primary bg-primary/10 border border-primary/30 px-2 py-0.5 rounded-full"
            >
              {commentary.author}
            </span>
          </div>

          <p
            class="text-sm text-text-primary leading-relaxed pl-3 border-l-2 border-primary/50"
          >
            {commentary.text}
          </p>

          <span
            class="text-[9px] font-semibold text-text-muted italic text-right"
          >
            — Cited commentary by {commentary.author} ({commentary.tradition})
          </span>
        </div>
      {/if}

      <!-- Next / Prev Slide Navigation Buttons -->
      <div class="flex items-center justify-between pt-4">
        <button
          onclick={prevSlide}
          disabled={currentSlide === 0}
          class="px-4 py-2 bg-bg-surface hover:bg-slate-800 border border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold rounded-xl flex items-center gap-1 text-text-primary transition-all active:scale-95"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="w-4 h-4"
          >
            <path
              fill-rule="evenodd"
              d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
              clip-rule="evenodd"
            />
          </svg>
          <span>Previous Layer</span>
        </button>

        <span class="text-[11px] font-extrabold text-text-muted">
          {currentSlide + 1} of {totalSlides}
        </span>

        <button
          onclick={nextSlide}
          disabled={currentSlide === totalSlides - 1}
          class="px-4 py-2 bg-primary/20 hover:bg-primary/30 border border-primary/40 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold rounded-xl flex items-center gap-1 text-primary transition-all active:scale-95"
        >
          <span>Next Layer</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="w-4 h-4"
          >
            <path
              fill-rule="evenodd"
              d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  {:else}
    <!-- FULL STACKED VIEW MODE -->
    <div class="flex flex-col gap-4">
      <!-- Layer 1: Sanskrit -->
      <div
        class="bg-bg-surface border border-primary/30 p-5 rounded-3xl shadow-xl flex flex-col gap-3"
      >
        <div
          class="flex items-center justify-between border-b border-primary/20 pb-2"
        >
          <span
            class="text-[10px] font-black uppercase tracking-[0.2em] text-primary"
          >
            Layer 1 · Sacred Sanskrit
          </span>
        </div>
        <p
          class="text-xl sm:text-2xl font-extrabold font-cinzel text-amber-100 text-center leading-relaxed whitespace-pre-line"
        >
          {verseSanskrit}
        </p>
      </div>

      <!-- Layer 2: Transliteration -->
      <div
        class="bg-bg-surface border border-teal-500/30 p-4 rounded-3xl flex flex-col gap-2"
      >
        <span
          class="text-[9px] font-black uppercase tracking-widest text-teal-400"
        >
          Layer 2 · Transliteration (IAST)
        </span>
        <p
          class="text-xs sm:text-sm font-semibold text-teal-200 italic font-mono leading-relaxed whitespace-pre-line"
        >
          {verseTransliteration}
        </p>
      </div>

      <!-- Layer 3: Word Breakdown -->
      <div
        class="bg-bg-surface border border-slate-800 p-5 rounded-3xl flex flex-col gap-3"
      >
        <span
          class="text-[10px] font-black uppercase tracking-[0.2em] text-success"
        >
          Layer 3 · Word-by-Word Breakdown
        </span>
        <div class="flex flex-wrap gap-2 items-center justify-center">
          {#each wordBreakdown as item}
            {@const display = getSanskritDisplay(item.word)}
            <button
              onclick={() => (activeWord = item)}
              class="px-3 py-1.5 rounded-xl bg-bg-base border border-slate-750 text-center active:scale-95 transition-all"
            >
              <span
                class="text-xs font-bold text-text-primary block font-cinzel"
                >{item.devanagari}</span
              >
              <span class="text-[9px] font-semibold text-success block"
                >{item.meaning}</span
              >
            </button>
          {/each}
        </div>
      </div>

      <!-- Layer 4: Translation -->
      <div
        class="bg-bg-surface border border-slate-800 p-4 rounded-3xl flex flex-col gap-1"
      >
        <span
          class="text-[10px] font-black uppercase tracking-widest text-text-muted"
        >
          Layer 4 · Translation
        </span>
        <p class="text-xs sm:text-sm text-text-primary italic leading-relaxed">
          "{translation}"
        </p>
      </div>

      <!-- Layer 5: Commentary -->
      {#if commentary}
        <div
          class="bg-bg-surface border border-primary/40 p-4 rounded-3xl flex flex-col gap-2"
        >
          <span
            class="text-[10px] font-black uppercase tracking-widest text-primary"
          >
            Layer 5 · Commentary by {commentary.author}
          </span>
          <p class="text-xs text-text-primary leading-relaxed">
            {commentary.text}
          </p>
        </div>
      {/if}
    </div>
  {/if}

  <!-- Active Word Popover Modal -->
  {#if activeWord}
    <div
      class="fixed inset-0 bg-bg-base/85 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
    >
      <div
        class="w-full max-w-sm bg-bg-surface border border-slate-750 rounded-3xl p-6 flex flex-col gap-4 shadow-2xl"
      >
        <div class="flex justify-between items-start">
          <div class="flex flex-col">
            <span
              class="text-[10px] uppercase font-bold tracking-widest text-text-muted"
              >{activeWord.partOfSpeech}</span
            >
            <h3 class="text-3xl font-black text-white font-cinzel mt-0.5">
              {activeWord.devanagari}
            </h3>
            <span class="text-base font-bold text-primary"
              >{activeWord.word}</span
            >
          </div>
          <button
            onclick={() => (activeWord = null)}
            class="text-text-muted hover:text-text-primary bg-bg-base p-2 rounded-full"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2.5"
              stroke="currentColor"
              class="w-4 h-4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div class="h-px bg-slate-800"></div>

        <div
          class="bg-bg-base/60 border border-slate-800 p-4 rounded-2xl flex flex-col gap-1"
        >
          <span
            class="text-[10px] font-extrabold uppercase tracking-wider text-success"
            >Meaning</span
          >
          <p class="text-lg font-extrabold text-text-primary">
            {activeWord.meaning}
          </p>
        </div>

        <button
          onclick={() => (activeWord = null)}
          class="w-full py-3 bg-success hover:bg-emerald-400 text-bg-base font-black rounded-xl shadow-lg active:scale-95 transition-all text-sm"
        >
          Got it!
        </button>
      </div>
    </div>
  {/if}
</div>
