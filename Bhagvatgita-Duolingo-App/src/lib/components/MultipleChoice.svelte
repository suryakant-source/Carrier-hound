<script lang="ts">
  import type { MCQOption } from '../data/gitaData';
  import { playPopSound } from '../utils/soundEffects';

  let { options, onSelect } = $props<{
    options: MCQOption[];
    onSelect: (selected: MCQOption) => void;
  }>();

  let selectedIndex = $state<number | null>(null);

  function handleSelect(option: MCQOption, idx: number) {
    playPopSound();
    selectedIndex = idx;
    onSelect(option);
  }
</script>

<div class="flex flex-col gap-3 w-full select-none max-w-lg mx-auto">
  {#each options as option, idx}
    {@const isSelected = selectedIndex === idx}
    
    <button
      type="button"
      onclick={() => handleSelect(option, idx)}
      class="w-full text-left p-4 rounded-2xl border border-b-4 tile-3d transition-all duration-150 select-none flex items-center justify-between gap-3
        {isSelected
          ? 'bg-primary/20 border-primary text-text-primary shadow-md'
          : 'bg-bg-surface hover:bg-slate-800 border-slate-700 border-b-slate-950 text-text-primary'}"
    >
      <span class="text-sm font-semibold leading-relaxed">{option.text}</span>
      
      <!-- Selection Radio Circle -->
      <div 
        class="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
          {isSelected 
            ? 'border-primary bg-primary text-bg-base' 
            : 'border-slate-600'}"
      >
        {#if isSelected}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-3.5 h-3.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        {/if}
      </div>
    </button>
  {/each}
</div>
