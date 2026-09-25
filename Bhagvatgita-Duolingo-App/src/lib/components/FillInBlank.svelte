<script lang="ts">
  import { getSanskritDisplay } from '../data/sanskritHelper';
  import { playPopSound } from '../utils/soundEffects';

  let { prompt, translation, options, onSelect } = $props<{
    prompt: string;
    translation: string;
    options: string[];
    onSelect: (selectedWord: string) => void;
  }>();

  let selectedWord = $state<string | null>(null);

  function handleSelect(word: string) {
    playPopSound();
    selectedWord = word;
    onSelect(word);
  }

  let parsedPrompt = $derived(() => {
    let instruction = '';
    let template = prompt;

    const quoteMatch = prompt.match(/^(.*?):?\s*["“](.*?)["”]\s*$/);
    if (quoteMatch) {
      instruction = quoteMatch[1].trim();
      template = quoteMatch[2].trim();
    } else if (prompt.includes(':')) {
      const parts = prompt.split(':');
      instruction = parts[0].trim();
      template = parts.slice(1).join(':').trim();
    }

    const rawTokens = template.split(/\s+/).filter(Boolean);
    const tokens = rawTokens.map((tok: string) => {
      const isBlank = tok.includes('______') || tok === '___';
      const cleanWord = tok.replace(/[^a-zA-Zāīūēōṛḷṁḥñṅṇtṭdḍsṣś']/g, '');
      return {
        raw: tok,
        isBlank,
        word: cleanWord || tok
      };
    });

    return { instruction, tokens };
  });
</script>

<div class="flex flex-col gap-4 w-full select-none max-w-lg mx-auto">
  
  <!-- Verse Display Box -->
  <div class="bg-bg-surface/90 border border-slate-800 p-4 sm:p-5 rounded-3xl text-center shadow-xl flex flex-col gap-3 items-center justify-center min-h-[110px]">
    
    {#if parsedPrompt().instruction}
      <span class="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
        {parsedPrompt().instruction}
      </span>
    {/if}

    <!-- Verse Token Cards Row -->
    <div class="flex flex-wrap gap-2 items-center justify-center py-1">
      {#each parsedPrompt().tokens as token}
        {#if token.isBlank}
          {#if selectedWord}
            {@const display = getSanskritDisplay(selectedWord)}
            <div class="px-3.5 py-2 rounded-2xl bg-primary text-bg-base border-b-4 border-amber-950 shadow-md flex flex-col items-center justify-center min-w-[70px] animate-[pop_0.12s_ease-out]">
              <span class="text-[9px] font-extrabold text-bg-base/80 tracking-wider">
                {display.englishSyllables}
              </span>
              <span class="text-base font-black font-cinzel text-bg-base leading-tight mt-0.5">
                {display.devanagari}
              </span>
            </div>
          {:else}
            <div class="px-3.5 py-2 rounded-2xl bg-bg-base/80 border-2 border-dashed border-primary/50 flex flex-col items-center justify-center min-w-[75px] min-h-[50px] shadow-inner animate-pulse">
              <span class="text-xs font-black text-primary font-cinzel tracking-widest">
                ______
              </span>
            </div>
          {/if}
        {:else}
          {@const display = getSanskritDisplay(token.word)}
          <div class="px-3.5 py-2 rounded-2xl bg-bg-base border border-slate-750 shadow-sm border-b-4 border-b-slate-950 flex flex-col items-center justify-center min-w-[65px]">
            <span class="text-[9px] font-semibold text-text-muted tracking-wider">
              {display.englishSyllables}
            </span>
            <span class="text-base font-black font-cinzel text-text-primary leading-tight mt-0.5">
              {display.devanagari}
            </span>
          </div>
        {/if}
      {/each}
    </div>

    {#if translation}
      <p class="text-xs text-text-muted italic leading-snug border-t border-slate-800/80 pt-2 w-full max-w-md">
        "{translation}"
      </p>
    {/if}
  </div>

  <div class="h-px bg-slate-800"></div>

  <!-- Options bank with 3D tactile buttons -->
  <div class="flex flex-wrap justify-center gap-2.5">
    {#each options as option}
      {@const isSelected = selectedWord === option}
      {@const display = getSanskritDisplay(option)}
      
      <button
        type="button"
        onclick={() => handleSelect(option)}
        class="min-w-[90px] px-4 py-2 rounded-2xl shadow border-b-4 tile-3d flex flex-col items-center justify-center transition-all
          {isSelected
            ? 'bg-primary text-bg-base border-amber-950 shadow-primary/20'
            : 'bg-bg-surface hover:bg-slate-800 border-slate-700 border-b-slate-950 text-text-primary'}"
      >
        <span class="text-[9px] font-semibold tracking-wider {isSelected ? 'text-bg-base/80' : 'text-text-muted'}">
          {display.englishSyllables}
        </span>
        <span class="text-base font-black font-cinzel leading-tight mt-0.5 {isSelected ? 'text-bg-base' : 'text-text-primary'}">
          {display.devanagari}
        </span>
      </button>
    {/each}
  </div>
</div>

<style>
  @keyframes pop {
    0% { transform: scale(0.85); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }
</style>
