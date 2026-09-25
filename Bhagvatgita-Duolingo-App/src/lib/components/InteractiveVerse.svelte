<script lang="ts">
  import type { WordMeaning } from '../data/gitaData';
  import { getSanskritDisplay } from '../data/sanskritHelper';

  let { verseSanskrit, verseTransliteration, wordBreakdown, translation } = $props<{
    verseSanskrit: string;
    verseTransliteration: string;
    wordBreakdown: WordMeaning[];
    translation: string;
  }>();

  // Active word popover modal
  let activeWord = $state<WordMeaning | null>(null);
</script>

<div class="flex flex-col gap-6 w-full select-none">
  
  <!-- Interactive Verse Words Grid Container -->
  <div class="bg-slate-950/60 border border-slate-800 p-5 rounded-3xl shadow-xl flex flex-col gap-4">
    
    <!-- Section Label -->
    <div class="flex items-center justify-between">
      <span class="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
        Verse Word-by-Word Breakdown
      </span>
      <span class="text-[10px] text-slate-500 font-semibold">
        Tap any word for details
      </span>
    </div>

    <!-- Word Chips with Meanings Directly Below -->
    <div class="flex flex-wrap gap-y-5 gap-x-3.5 items-start justify-center py-2">
      {#each wordBreakdown as item}
        {@const display = getSanskritDisplay(item.word)}
        <button
          onclick={() => activeWord = item}
          class="flex flex-col items-center group cursor-pointer active:scale-95 transition-all text-center"
        >
          <!-- Word Token Chip -->
          <div class="px-3.5 py-2 rounded-2xl bg-slate-900 group-hover:bg-slate-800 border border-slate-750 group-hover:border-emerald-500/50 shadow-sm transition-all border-b-4 border-b-slate-950 group-hover:border-b-emerald-600 flex flex-col items-center justify-center min-w-[65px]">
            <span class="text-[10px] font-semibold text-slate-400 group-hover:text-emerald-400/80 tracking-wider">
              {display.englishSyllables}
            </span>
            <span class="text-base font-extrabold text-slate-100 group-hover:text-emerald-300 font-cinzel transition-colors leading-tight mt-0.5">
              {item.devanagari}
            </span>
          </div>

          <!-- Translated Meaning Directly Below -->
          <span class="text-[11px] font-semibold text-emerald-400/90 group-hover:text-emerald-300 max-w-[110px] leading-tight text-center mt-1.5 border-b border-dashed border-emerald-500/40 pb-0.5">
            {item.meaning}
          </span>
        </button>
      {/each}
    </div>

  </div>

  <!-- Verse Translation Card -->
  <div class="bg-slate-900/80 border border-slate-800 p-4.5 rounded-2xl flex flex-col gap-1.5">
    <span class="text-[10px] font-black uppercase tracking-widest text-slate-500">
      Full English Translation
    </span>
    <p class="text-xs text-slate-200 italic leading-relaxed">
      "{translation}"
    </p>
  </div>

  <!-- Tap Word Popover Detail Modal -->
  {#if activeWord}
    <div class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-end justify-center p-4">
      <div class="w-full max-w-sm bg-slate-900 border border-slate-750 rounded-3xl p-6 flex flex-col gap-4 animate-[slide-up_0.2s_ease-out] shadow-2xl">
        
        <!-- Modal Header -->
        <div class="flex justify-between items-start">
          <div class="flex flex-col">
            <span class="text-[10px] uppercase font-bold tracking-widest text-slate-500">{activeWord.partOfSpeech}</span>
            <h3 class="text-3xl font-black text-white font-cinzel mt-0.5">{activeWord.devanagari}</h3>
            <span class="text-base font-bold text-amber-300">{activeWord.word}</span>
          </div>
          <button
            onclick={() => activeWord = null}
            class="text-slate-400 hover:text-slate-200 bg-slate-800 p-2 rounded-full"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="h-px bg-slate-800"></div>

        <!-- Meaning & Explanation -->
        <div class="bg-slate-950/50 border border-slate-800 p-4 rounded-2xl flex flex-col gap-1">
          <span class="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">Meaning</span>
          <p class="text-lg font-extrabold text-slate-100">{activeWord.meaning}</p>
        </div>

        <button
          onclick={() => activeWord = null}
          class="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl shadow-lg active:scale-95 transition-all text-sm"
        >
          Got it!
        </button>

      </div>
    </div>
  {/if}

</div>

<style>
  @keyframes slide-up {
    0% { transform: translateY(100%); }
    100% { transform: translateY(0); }
  }
</style>
