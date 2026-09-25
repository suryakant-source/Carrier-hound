<script lang="ts">
  import type { Lesson } from "../data/gitaData";
  import { onMount } from "svelte";

  let { lesson, onComplete } = $props<{
    lesson: Lesson;
    onComplete: () => void;
  }>();

  // 3 moments: sanskrit, transliteration, translation
  let moment = $state(0);
  let autoTimer: ReturnType<typeof setTimeout> | null = null;

  onMount(() => {
    scheduleNext();
    return () => {
      if (autoTimer) clearTimeout(autoTimer);
    };
  });

  function scheduleNext() {
    if (autoTimer) clearTimeout(autoTimer);
    autoTimer = setTimeout(() => {
      if (moment < 2) {
        moment += 1;
        scheduleNext();
      }
      // moment 2 = translation — user must tap "Begin"
    }, 2200);
  }

  function advance() {
    if (autoTimer) clearTimeout(autoTimer);
    if (moment < 2) {
      moment += 1;
      scheduleNext();
    }
  }
</script>

<!-- Full-screen cinematic container -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="w-full h-full flex flex-col items-center justify-center bg-bg-base relative overflow-hidden select-none"
  role="button"
  tabindex="0"
  onclick={advance}
  onkeydown={(e) => (e.key === "Enter" || e.key === " " ? advance() : null)}
>
  <!-- Ambient glow layers -->
  <div class="absolute inset-0 pointer-events-none">
    <div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-primary/8 blur-[80px] animate-pulse"
    ></div>
    <div
      class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-emerald-500/6 blur-[60px]"
    ></div>
  </div>

  <!-- Om watermark -->
  <div
    class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.025]"
  >
    <span class="text-[18rem] text-primary font-cinzel leading-none">ॐ</span>
  </div>

  <!-- Skip button -->
  <button
    onclick={(e) => {
      e.stopPropagation();
      onComplete();
    }}
    class="absolute top-4 right-4 text-[10px] font-bold text-text-muted/50 hover:text-text-muted transition-colors px-3 py-1.5 rounded-full border border-slate-800 hover:border-slate-700 z-20"
  >
    Skip
  </button>

  <!-- Content -->
  <div
    class="relative z-10 flex flex-col items-center px-8 max-w-sm w-full gap-6"
  >
    <!-- Verse reference pill -->
    <div class="flex items-center gap-2">
      <div class="w-5 h-px bg-primary/40"></div>
      <span
        class="text-[10px] font-black uppercase tracking-[0.25em] text-primary/80"
        >{lesson.verseRef}</span
      >
      <div class="w-5 h-px bg-primary/40"></div>
    </div>

    <!-- Sanskrit — Moment 0 -->
    {#if moment >= 0}
      <div
        class="text-center animate-[moment-rise_0.7s_cubic-bezier(0.34,1.56,0.64,1)_both]"
      >
        <p
          class="text-3xl font-bold font-cinzel text-primary leading-relaxed whitespace-pre-line text-shadow-gold"
        >
          {lesson.verseSanskrit}
        </p>
      </div>
    {/if}

    <!-- Transliteration — Moment 1 -->
    {#if moment >= 1}
      <div
        class="text-center animate-[moment-rise_0.6s_cubic-bezier(0.34,1.56,0.64,1)_both]"
      >
        <p class="text-sm text-text-muted italic leading-relaxed">
          {lesson.verseTransliteration}
        </p>
      </div>
    {/if}

    <!-- Translation — Moment 2 -->
    {#if moment >= 2}
      <div
        class="flex flex-col items-center gap-5 animate-[moment-rise_0.6s_cubic-bezier(0.34,1.56,0.64,1)_both]"
      >
        <div class="w-10 h-px bg-slate-700"></div>
        <p
          class="text-sm text-text-primary/90 leading-relaxed text-center font-light"
        >
          "{lesson.translation}"
        </p>

        <!-- Begin button -->
        <button
          onclick={(e) => {
            e.stopPropagation();
            onComplete();
          }}
          class="mt-2 flex items-center gap-2 py-4 px-8 bg-primary hover:bg-primary-dark text-bg-base font-black text-sm rounded-2xl shadow-xl btn-3d border-b-4 border-amber-900 active:scale-[0.98] transition-all"
        >
          <span>Begin Learning</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="w-5 h-5"
          >
            <path
              fill-rule="evenodd"
              d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    {/if}

    <!-- Moment progress dots -->
    <div
      class="absolute -top-10 left-0 right-0 flex justify-center gap-2 pointer-events-none"
    >
      {#each [0, 1, 2] as m}
        <div
          class="h-1.5 rounded-full transition-all duration-400
          {m <= moment ? 'w-5 bg-primary' : 'w-1.5 bg-slate-700'}"
        ></div>
      {/each}
    </div>
  </div>
</div>

<style>
  .text-shadow-gold {
    text-shadow: 0 0 40px rgba(244, 164, 40, 0.3);
  }
</style>
