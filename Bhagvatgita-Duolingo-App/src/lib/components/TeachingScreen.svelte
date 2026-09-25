<script lang="ts">
  import type { Lesson, VersePart } from '../data/gitaData';
  import LayeredVerseView from './LayeredVerseView.svelte';

  let { lesson, activePart, partIndex, totalParts, onComplete } = $props<{
    lesson: Lesson;
    activePart?: VersePart | null;
    partIndex?: number;
    totalParts?: number;
    onComplete: () => void;
  }>();

  let displayTitle = $derived(activePart ? activePart.title : lesson.title);
  let displaySanskrit = $derived(activePart ? activePart.sanskrit : lesson.verseSanskrit);
  let displayTransliteration = $derived(activePart ? activePart.transliteration : lesson.verseTransliteration);
  let displayTranslation = $derived(activePart ? activePart.translation : lesson.translation);
  let displayBreakdown = $derived(activePart ? activePart.wordBreakdown : lesson.wordBreakdown);
  let displayCommentary = $derived(activePart ? activePart.commentary : lesson.commentary);
</script>

<div class="w-full h-full flex flex-col bg-bg-base text-text-primary relative">

  <!-- Header with Stage Indicator -->
  <div class="flex items-center justify-between px-4 py-3 bg-bg-surface/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 select-none">
    <div class="flex items-center gap-2">
      <span class="text-[10px] font-black uppercase tracking-[0.15em] text-primary">
        {lesson.verseRef} {#if activePart && totalParts}· Part {partIndex} of {totalParts}{:else}· Overview{/if}
      </span>
    </div>
    {#if activePart && totalParts}
      <span class="text-[10px] font-extrabold bg-primary/20 text-primary border border-primary/40 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
        STEP {partIndex}/{totalParts}
      </span>
    {/if}
  </div>

  <!-- Interactive Layered Verse Canvas -->
  <div class="flex-1 flex flex-col items-center justify-start px-4 py-5 overflow-y-auto scrollbar-none gap-5">
    
    <!-- Title / Header -->
    <div class="text-center flex flex-col items-center gap-1">
      <h1 class="text-xl sm:text-2xl font-black font-cinzel text-text-primary tracking-wide">
        {displayTitle}
      </h1>
      <p class="text-xs text-text-muted max-w-sm leading-relaxed">
        Study each layer step-by-step below before starting practice exercises.
      </p>
    </div>

    <!-- 5-Layer Structured Verse View -->
    <LayeredVerseView
      verseSanskrit={displaySanskrit}
      verseTransliteration={displayTransliteration}
      wordBreakdown={displayBreakdown}
      translation={displayTranslation}
      commentary={displayCommentary}
      verseRef={lesson.verseRef}
    />

  </div>

  <!-- Action button -->
  <div class="p-4 bg-bg-surface border-t border-slate-800 sticky bottom-0 z-20">
    <button
      onclick={onComplete}
      class="w-full py-4 bg-primary hover:bg-primary-dark text-bg-base font-black text-sm rounded-2xl shadow-lg btn-3d border-b-4 border-amber-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
    >
      <span>PRACTICE THIS PART</span>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
        <path fill-rule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clip-rule="evenodd" />
      </svg>
    </button>
  </div>

</div>

<style>
  .scrollbar-none::-webkit-scrollbar { display: none; }
  .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
</style>
