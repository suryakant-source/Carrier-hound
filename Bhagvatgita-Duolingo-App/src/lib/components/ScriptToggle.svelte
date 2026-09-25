<script lang="ts">
  import { gameState } from '../state/gameState.svelte';
</script>

<!-- Script Mode Toggle Switch -->
<div class="inline-flex items-center bg-slate-950/80 border border-slate-800 p-0.5 rounded-full select-none shadow-inner">
  <button
    onclick={() => gameState.setScriptMode('devanagari')}
    class="px-2.5 py-1 text-[10px] font-bold rounded-full transition-all duration-200 flex items-center gap-1 cursor-pointer
      {gameState.scriptMode === 'devanagari'
        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
        : 'text-slate-500 hover:text-slate-300'}"
    title="Switch to Devanagari Script (देवनागरी)"
    type="button"
  >
    <span class="font-cinzel font-bold text-xs">ॐ</span>
    <span class="font-cinzel">देव</span>
  </button>

  <button
    onclick={() => gameState.setScriptMode('english')}
    class="px-2.5 py-1 text-[10px] font-bold rounded-full transition-all duration-200 flex items-center gap-1 cursor-pointer
      {gameState.scriptMode === 'english'
        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
        : 'text-slate-500 hover:text-slate-300'}"
    title="Switch to English Phonetic (IAST / Roman)"
    type="button"
  >
    <span class="font-black text-[9px]">Aa</span>
    <span>Eng</span>
  </button>
</div>
