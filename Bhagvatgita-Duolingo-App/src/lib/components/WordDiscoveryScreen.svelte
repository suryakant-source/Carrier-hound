<script lang="ts">
  import type { VersePart } from '../data/gitaData';
  import WordCard from './WordCard.svelte';

  let { part, partIndex, totalParts, onComplete } = $props<{
    part: VersePart;
    partIndex: number;
    totalParts: number;
    onComplete: () => void;
  }>();

  let wordIndex = $state(0);
  let showTransition = $state(false);

  let currentWord = $derived(part.wordBreakdown[wordIndex]);
  let totalWords = $derived(part.wordBreakdown.length);

  // Reset when part changes
  $effect(() => {
    void part.partIndex; // track
    wordIndex = 0;
    showTransition = false;
  });

  function handleNextWord() {
    if (wordIndex < totalWords - 1) {
      wordIndex += 1;
    } else {
      // All words seen — show transition banner, then proceed
      showTransition = true;
      setTimeout(() => {
        onComplete();
      }, 900);
    }
  }
</script>

<div class="w-full h-full flex flex-col bg-bg-base text-text-primary relative select-none overflow-hidden">

  <!-- Header -->
  <div class="flex items-center justify-between px-4 pt-4 pb-3">
    <div class="flex flex-col gap-0.5">
      <span class="text-[9px] font-black uppercase tracking-[0.2em] text-primary">
        {part.title}
      </span>
      <span class="text-[10px] text-text-muted">
        Part {partIndex} of {totalParts}
      </span>
    </div>

    <!-- Part progress pill -->
    <span class="text-[10px] font-bold px-3 py-1 rounded-full bg-primary/15 text-primary border border-primary/25">
      DISCOVER
    </span>
  </div>

  <!-- Word progress dots -->
  <div class="flex items-center justify-center gap-2 pb-4">
    {#each part.wordBreakdown as _, i}
      <div
        class="rounded-full transition-all duration-300
          {i < wordIndex
            ? 'w-4 h-2 bg-primary/60'
            : i === wordIndex
              ? 'w-7 h-2 bg-primary shadow-sm shadow-primary/50'
              : 'w-2 h-2 bg-slate-700'}"
      ></div>
    {/each}
  </div>

  <!-- Sanskrit context strip -->
  <div class="mx-4 mb-4 px-4 py-2.5 bg-bg-surface/60 border border-slate-800 rounded-2xl text-center">
    <p class="text-xs font-bold font-cinzel text-amber-200/70 leading-relaxed">
      {part.sanskrit}
    </p>
  </div>

  <!-- Word count indicator -->
  <div class="text-center mb-2">
    <span class="text-[10px] text-text-muted font-medium">
      Word {wordIndex + 1} of {totalWords}
    </span>
  </div>

  <!-- Card area -->
  <div class="flex-1 flex flex-col items-center justify-center px-4 pb-6">
    {#if currentWord && !showTransition}
      {#key wordIndex}
        <WordCard word={currentWord} onNext={handleNextWord} />
      {/key}
    {/if}

    <!-- Transition banner when all words done -->
    {#if showTransition}
      <div class="flex flex-col items-center gap-4 animate-[fade-slide-up_0.4s_ease-out_both]">
        <div class="w-16 h-16 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center shadow-lg shadow-primary/20">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 text-primary">
            <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="text-center">
          <p class="text-lg font-black text-text-primary font-cinzel">Words Learned!</p>
          <p class="text-xs text-text-muted mt-1">Now let's practice them →</p>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  @keyframes fade-slide-up {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
</style>
