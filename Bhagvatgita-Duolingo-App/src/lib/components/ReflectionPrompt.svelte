<script lang="ts">
  import { gameState } from '../state/gameState.svelte';

  let {
    promptId,
    prompt,
    verseContext,
    guidance,
    onComplete
  } = $props<{
    promptId: string;
    prompt: string;
    verseContext?: string;
    guidance?: string;
    onComplete: () => void;
  }>();

  // Load existing entry if previously reflected
  let reflectionText = $state(gameState.userReflections[promptId] || '');
  let selectedTag = $state<string | null>(null);
  let isSaved = $state(false);

  const INTENT_TAGS = [
    { label: 'Detachment', value: 'detachment' },
    { label: 'Clarity', value: 'clarity' },
    { label: 'Equanimity', value: 'equanimity' },
    { label: 'Self-Growth', value: 'growth' },
    { label: 'Peace', value: 'peace' }
  ];

  function handleSave() {
    if (reflectionText.trim()) {
      gameState.saveReflection(promptId, reflectionText.trim());
      isSaved = true;
      setTimeout(() => {
        onComplete();
      }, 400);
    } else {
      onComplete();
    }
  }
</script>

<div class="w-full max-w-xl mx-auto flex flex-col gap-6 p-4 sm:p-6 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl select-none relative overflow-hidden">
  
  <!-- Ambient background glow -->
  <div class="absolute -top-12 -left-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

  <!-- Header Banner -->
  <div class="flex items-center justify-between border-b border-slate-800 pb-3">
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm">
        <svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4"><path d="M12 3c-1.5 2.5-3 5.5-3 8 0 2.5 1.5 4.5 3 4.5s3-2 3-4.5c0-2.5-1.5-5.5-3-8zm-5 4c-1.5 2-3 5-3 7 0 2.5 2 4.5 4.5 4.5 2 0 3.5-1.5 3.5-3.5-2 0-3.5-1.5-4-3.5-.5-1.5-.5-3 0-4.5zm10 0c.5 1.5.5 3 0 4.5-.5 2-2 3.5-4 3.5 0 2 1.5 3.5 3.5 3.5 2.5 0 4.5-2 4.5-4.5 0-2-1.5-5-3-7z"/></svg>
      </div>
      <div class="flex flex-col">
        <span class="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
          Mindful Reflection
        </span>
        <span class="text-xs font-bold text-slate-300">
          Personal Journaling · Non-Graded
        </span>
      </div>
    </div>

    <span class="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full">
      No Wrong Answers
    </span>
  </div>

  <!-- Verse Context Banner if provided -->
  {#if verseContext}
    <div class="bg-slate-950/60 border border-slate-800 p-3.5 rounded-2xl flex flex-col gap-1">
      <span class="text-[9px] font-black uppercase tracking-wider text-slate-400">Verse Context</span>
      <p class="text-xs text-slate-300 italic leading-relaxed">
        {verseContext}
      </p>
    </div>
  {/if}

  <!-- Reflection Prompt Question -->
  <div class="flex flex-col gap-2">
    <h2 class="text-lg sm:text-xl font-extrabold font-cinzel text-amber-100 tracking-wide leading-snug">
      {prompt}
    </h2>
    {#if guidance}
      <p class="text-xs text-slate-400 leading-relaxed">
        {guidance}
      </p>
    {/if}
  </div>

  <!-- Intent / Sentiment Filter Tags -->
  <div class="flex flex-wrap gap-2">
    {#each INTENT_TAGS as tag}
      <button
        type="button"
        onclick={() => selectedTag = selectedTag === tag.value ? null : tag.value}
        class="px-3 py-1.5 rounded-xl text-xs font-bold border transition-all active:scale-95 {selectedTag === tag.value ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm' : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'}"
      >
        {tag.label}
      </button>
    {/each}
  </div>

  <!-- Reflection Textarea -->
  <div class="flex flex-col gap-1.5">
    <label for="reflection-input" class="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex justify-between">
      <span>Your Journal Entry</span>
      <span>{reflectionText.length} characters</span>
    </label>
    <textarea
      id="reflection-input"
      bind:value={reflectionText}
      placeholder="Write your reflection here... (e.g. How can you practice non-attachment in your daily responsibilities today?)"
      rows="4"
      class="w-full bg-slate-950 border border-slate-750 focus:border-emerald-500 rounded-2xl p-4 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none leading-relaxed"
    ></textarea>
  </div>

  <!-- Save / Continue Action -->
  <div class="flex items-center justify-between pt-2">
    <button
      type="button"
      onclick={onComplete}
      class="text-xs font-semibold text-slate-400 hover:text-slate-200 px-3 py-2"
    >
      Skip for now
    </button>

    <button
      type="button"
      onclick={handleSave}
      class="py-3.5 px-6 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg active:scale-95 transition-all flex items-center gap-2"
    >
      {#if isSaved}
        <span>Saved!</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
          <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
        </svg>
      {:else}
        <span>SAVE REFLECTION & CONTINUE</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
          <path fill-rule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clip-rule="evenodd" />
        </svg>
      {/if}
    </button>
  </div>

</div>
