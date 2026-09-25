<script lang="ts">
  import { gameState } from '../state/gameState.svelte';

  let { current, total, onCancel } = $props<{
    current: number;
    total: number;
    onCancel: () => void;
  }>();

  let progressPercent = $derived(total > 0 ? Math.min(100, Math.max(0, ((current + 1) / total) * 100)) : 0);

  let prevHearts = $state(gameState.hearts);
  let isHeartDecreasing = $state(false);

  $effect(() => {
    if (gameState.hearts < prevHearts) {
      isHeartDecreasing = true;
      const t = setTimeout(() => {
        isHeartDecreasing = false;
      }, 600);
      prevHearts = gameState.hearts;
      return () => clearTimeout(t);
    } else {
      prevHearts = gameState.hearts;
    }
  });
</script>

<div class="flex items-center gap-3 px-4 py-3 bg-bg-surface/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 select-none">
  <!-- Close -->
  <button
    onclick={onCancel}
    class="text-text-muted hover:text-text-primary transition-colors p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
    aria-label="Exit Lesson"
    type="button"
  >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>

  <!-- Progress bar -->
  <div class="flex-1 h-3 bg-bg-base rounded-full overflow-hidden border border-slate-800 p-0.5">
    <div
      class="h-full bg-gradient-to-r from-primary to-amber-300 rounded-full transition-all duration-300 ease-out"
      style="width: {progressPercent}%"
    ></div>
  </div>

  <!-- Hearts with pulse/shrink animation -->
  <div class="flex items-center gap-1.5 min-w-[50px] justify-end">
    <span class="text-rose-500 transition-transform duration-200 {isHeartDecreasing ? 'scale-125 animate-bounce' : gameState.hearts <= 1 ? 'animate-bounce' : ''}">
      <svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
    </span>
    <span class="font-extrabold text-error text-sm tabular-nums">{gameState.hearts}</span>
  </div>
</div>
