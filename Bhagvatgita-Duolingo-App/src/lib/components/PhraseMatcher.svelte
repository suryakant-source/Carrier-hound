<script lang="ts">
  import { onMount } from 'svelte';
  import type { PhrasePair } from '../data/gitaData';
  import { getSanskritDisplay } from '../data/sanskritHelper';
  import { playPopSound, playSuccessSound, playErrorSound } from '../utils/soundEffects';

  let { pairs, onIncorrect, onAllMatched } = $props<{
    pairs: PhrasePair[];
    onIncorrect: () => void;
    onAllMatched: () => void;
  }>();

  let selectedSanskrit = $state<string | null>(null);
  let selectedEnglish = $state<string | null>(null);

  let sanskritList = $state<string[]>([]);
  let englishList = $state<string[]>([]);

  let matchedSanskrit = $state<string[]>([]);
  let matchedEnglish = $state<string[]>([]);

  let errorSanskrit = $state<string | null>(null);
  let errorEnglish = $state<string | null>(null);

  onMount(() => {
    sanskritList = pairs.map((p: PhrasePair) => p.sanskrit).sort(() => Math.random() - 0.5);
    englishList = pairs.map((p: PhrasePair) => p.english).sort(() => Math.random() - 0.5);
  });

  function selectSanskrit(term: string) {
    if (errorSanskrit || matchedSanskrit.includes(term)) return;
    playPopSound();
    selectedSanskrit = term;
    checkMatch();
  }

  function selectEnglish(term: string) {
    if (errorEnglish || matchedEnglish.includes(term)) return;
    playPopSound();
    selectedEnglish = term;
    checkMatch();
  }

  function checkMatch() {
    if (!selectedSanskrit || !selectedEnglish) return;

    const isPairCorrect = pairs.some(
      (p: PhrasePair) => p.sanskrit === selectedSanskrit && p.english === selectedEnglish
    );

    if (isPairCorrect) {
      playSuccessSound();
      matchedSanskrit.push(selectedSanskrit);
      matchedEnglish.push(selectedEnglish);
      selectedSanskrit = null;
      selectedEnglish = null;

      if (matchedSanskrit.length === pairs.length) {
        onAllMatched();
      }
    } else {
      playErrorSound();
      errorSanskrit = selectedSanskrit;
      errorEnglish = selectedEnglish;
      onIncorrect();

      setTimeout(() => {
        errorSanskrit = null;
        errorEnglish = null;
        selectedSanskrit = null;
        selectedEnglish = null;
      }, 700);
    }
  }
</script>

<div class="flex flex-col gap-3 w-full select-none max-w-lg mx-auto">
  <div class="grid grid-cols-2 gap-2.5">

    <!-- Sanskrit Column -->
    <div class="flex flex-col gap-2">
      <span class="text-[10px] uppercase tracking-[0.15em] text-text-muted font-bold text-center">Sanskrit</span>
      {#each sanskritList as term}
        {@const isMatched = matchedSanskrit.includes(term)}
        {@const isSelected = selectedSanskrit === term}
        {@const isError = errorSanskrit === term}
        {@const display = getSanskritDisplay(term)}
        <button
          type="button"
          onclick={() => selectSanskrit(term)}
          disabled={isMatched}
          class="min-h-[52px] p-2 text-xs font-semibold rounded-2xl border text-center transition-all duration-150 select-none flex flex-col items-center justify-center border-b-4 tile-3d
            {isMatched
              ? 'bg-success/10 border-success/30 text-success/50 cursor-default line-through'
              : isError
                ? 'bg-error/20 border-error text-rose-200 animate-shake'
                : isSelected
                  ? 'bg-primary/20 border-primary text-primary shadow-md'
                  : 'bg-bg-surface hover:bg-slate-800 border-slate-700 border-b-slate-950 text-text-primary'}"
        >
          <span class="text-[9px] font-semibold text-text-muted tracking-wider">
            {display.englishSyllables}
          </span>
          <span class="text-sm font-bold font-cinzel text-text-primary mt-0.5">
            {display.devanagari}
          </span>
        </button>
      {/each}
    </div>

    <!-- English Column -->
    <div class="flex flex-col gap-2">
      <span class="text-[10px] uppercase tracking-[0.15em] text-text-muted font-bold text-center">Meaning</span>
      {#each englishList as term}
        {@const isMatched = matchedEnglish.includes(term)}
        {@const isSelected = selectedEnglish === term}
        {@const isError = errorEnglish === term}
        <button
          type="button"
          onclick={() => selectEnglish(term)}
          disabled={isMatched}
          class="min-h-[52px] p-2.5 text-xs font-semibold rounded-2xl border text-center transition-all duration-150 select-none flex items-center justify-center border-b-4 tile-3d
            {isMatched
              ? 'bg-success/10 border-success/30 text-success/50 cursor-default line-through'
              : isError
                ? 'bg-error/20 border-error text-rose-200 animate-shake'
                : isSelected
                  ? 'bg-primary/20 border-primary text-primary shadow-md'
                  : 'bg-bg-surface hover:bg-slate-800 border-slate-700 border-b-slate-950 text-text-primary'}"
        >
          {term}
        </button>
      {/each}
    </div>

  </div>
</div>
