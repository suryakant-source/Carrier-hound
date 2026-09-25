<script lang="ts">
  import { onMount } from 'svelte';
  import { getSanskritDisplay } from '../data/sanskritHelper';
  import { playPopSound } from '../utils/soundEffects';

  let { tiles, onChange } = $props<{
    tiles: string[];
    onChange: (selectedWords: string[]) => void;
  }>();

  interface TileItem {
    id: number;
    text: string;
  }

  let bank = $state<TileItem[]>([]);
  let selected = $state<TileItem[]>([]);

  onMount(() => {
    bank = tiles.map((text: string, id: number) => ({ id, text })).sort(() => Math.random() - 0.5);
  });

  function handleSelect(tile: TileItem) {
    playPopSound();
    bank = bank.filter(t => t.id !== tile.id);
    selected.push(tile);
    onChange(selected.map(t => t.text));
  }

  function handleDeselect(tile: TileItem) {
    playPopSound();
    selected = selected.filter(t => t.id !== tile.id);
    bank.push(tile);
    onChange(selected.map(t => t.text));
  }
</script>

<div class="flex flex-col gap-3 w-full select-none max-w-lg mx-auto">
  
  <!-- Compact Selected Tiles Drop Area -->
  <div class="min-h-[85px] w-full border-2 border-dashed border-slate-750 bg-bg-surface/50 rounded-2xl p-3 flex flex-wrap gap-2 items-center justify-center content-center transition-all">
    {#if selected.length === 0}
      <div class="text-text-muted text-xs text-center w-full flex items-center justify-center gap-1.5 py-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 opacity-50">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        <span>Tap tiles below to assemble the verse</span>
      </div>
    {:else}
      {#each selected as tile (tile.id)}
        {@const display = getSanskritDisplay(tile.text)}
        <button
          type="button"
          onclick={() => handleDeselect(tile)}
          class="bg-primary hover:bg-primary-dark text-bg-base px-3 py-1.5 rounded-xl shadow-md border-b-4 border-amber-900 tile-3d flex flex-col items-center justify-center min-w-[65px] animate-[pop_0.12s_ease-out]"
        >
          <span class="text-[9px] font-extrabold text-bg-base/80 tracking-wider">
            {display.englishSyllables}
          </span>
          <span class="text-base font-black font-cinzel text-bg-base leading-tight">
            {display.devanagari}
          </span>
        </button>
      {/each}
    {/if}
  </div>

  <!-- Divider line -->
  <div class="h-px bg-slate-800 my-0.5"></div>

  <!-- Word Tile Pool -->
  <div class="flex flex-wrap justify-center gap-2 p-3 border border-slate-800 bg-bg-surface/80 rounded-2xl min-h-[90px] content-start">
    {#each bank as tile (tile.id)}
      {@const display = getSanskritDisplay(tile.text)}
      <button
        type="button"
        onclick={() => handleSelect(tile)}
        class="bg-bg-base hover:bg-slate-800 text-text-primary px-3 py-1.5 rounded-xl shadow-sm border border-slate-700 border-b-4 border-b-slate-950 tile-3d flex flex-col items-center justify-center min-w-[70px]"
      >
        <span class="text-[9px] font-semibold text-text-muted tracking-wider">
          {display.englishSyllables}
        </span>
        <span class="text-base font-black font-cinzel text-text-primary leading-tight mt-0.5">
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
