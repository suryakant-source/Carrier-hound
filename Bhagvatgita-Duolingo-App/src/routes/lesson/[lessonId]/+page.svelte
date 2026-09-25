<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { gitaData } from '$lib/data/gitaData';
  import QuizScreen from '$lib/components/QuizScreen.svelte';

  // Reactively derive active lesson based on URL param
  let activeLesson = $derived.by(() => {
    const lessonId = $page.params.lessonId;
    return gitaData.chapters
      .flatMap(c => c.sections.flatMap(s => s.lessons))
      .find(l => l.id === lessonId);
  });

  function handleExit() {
    goto('/');
  }
</script>

{#if activeLesson}
  <QuizScreen lesson={activeLesson} onExit={handleExit} />
{:else}
  <div class="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center select-none">
    <div class="w-16 h-16 bg-rose-500/10 border border-rose-500/30 rounded-full flex items-center justify-center mb-6 text-rose-500">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
    </div>
    
    <h1 class="text-2xl font-bold font-cinzel text-slate-100 mb-2">Lesson Not Found</h1>
    <p class="text-sm text-slate-400 max-w-xs leading-relaxed mb-6">
      The lesson you are trying to access does not exist or may have been moved.
    </p>
    
    <button
      onclick={handleExit}
      class="py-3 px-6 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-750 font-bold rounded-xl active:scale-95 transition-all text-sm"
    >
      Return to Dashboard
    </button>
  </div>
{/if}
