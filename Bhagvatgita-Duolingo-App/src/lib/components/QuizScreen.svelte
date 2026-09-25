<script lang="ts">
  import { gameState } from '../state/gameState.svelte';
  import type { Lesson, VersePart, Question } from '../data/gitaData';
  import LessonProgress from './LessonProgress.svelte';
  import FeedbackModal from './FeedbackModal.svelte';
  import PhraseMatcher from './PhraseMatcher.svelte';
  import WordTilePicker from './WordTilePicker.svelte';
  import MultipleChoice from './MultipleChoice.svelte';
  import FillInBlank from './FillInBlank.svelte';
  import ReflectionPrompt from './ReflectionPrompt.svelte';
  import Mascot from './Mascot.svelte';
  import VerseHookScreen from './VerseHookScreen.svelte';
  import WordDiscoveryScreen from './WordDiscoveryScreen.svelte';

  let { lesson, onExit } = $props<{
    lesson: Lesson;
    onExit: () => void;
  }>();

  // ─── Phase State Machine ───────────────────────────────────────────────────
  type Phase =
    | 'verse_hook'      // Cinematic verse intro
    | 'word_discover'   // Word-by-word card flip discovery
    | 'part_play'       // Exercises for current part
    | 'synthesis_intro' // Full verse assembled
    | 'synthesis_play'  // Final synthesis exercises
    | 'complete'        // Victory
    | 'game_over';      // Out of hearts

  let parts = $derived(lesson.parts && lesson.parts.length > 0 ? lesson.parts : []);
  let hasParts = $derived(parts.length > 0);

  let phase = $state<Phase>(hasParts ? 'verse_hook' : 'synthesis_play');
  let partIndex = $state(0); // current part being studied (0-indexed)

  let currentPart = $derived<VersePart | null>(
    hasParts && partIndex < parts.length ? parts[partIndex] : null
  );

  // ─── Exercise State ────────────────────────────────────────────────────────
  let activeQuestions = $derived<Question[]>(
    phase === 'synthesis_play'
      ? (lesson.finalSynthesisQuestions && lesson.finalSynthesisQuestions.length > 0
          ? lesson.finalSynthesisQuestions
          : lesson.questions)
      : (currentPart ? currentPart.questions : lesson.questions)
  );

  let questionIndex = $state(0);
  let activeQuestion = $derived(activeQuestions[questionIndex]);

  let selectedOption = $state<any>(null);
  let selectedWords = $state<string[]>([]);
  let matchComplete = $state(false);

  let isChecked = $state(false);
  let isCorrect = $state(false);
  let showFeedback = $state(false);
  let isGameOver = $state(false);
  let isLessonCompleted = $state(false);
  let showFloatingXP = $state(false);

  let canCheck = $derived(() => {
    if (!activeQuestion) return false;
    if (activeQuestion.type === 'phrase_matching') return matchComplete;
    if (activeQuestion.type === 'sentence_rebuilding') return selectedWords.length > 0;
    return selectedOption !== null;
  });

  // ─── Phase Transitions ─────────────────────────────────────────────────────
  function handleVerseHookComplete() {
    partIndex = 0;
    phase = 'word_discover';
  }

  function handleWordDiscoveryComplete() {
    resetExerciseState();
    phase = 'part_play';
  }

  function handlePartPlayComplete() {
    if (partIndex + 1 < parts.length) {
      // More parts — go to next word discovery
      partIndex += 1;
      phase = 'word_discover';
    } else {
      // All parts done — synthesis
      phase = 'synthesis_intro';
    }
  }

  function startSynthesisPlay() {
    resetExerciseState();
    phase = 'synthesis_play';
  }

  function resetExerciseState() {
    questionIndex = 0;
    selectedOption = null;
    selectedWords = [];
    matchComplete = false;
    isChecked = false;
    isCorrect = false;
    showFeedback = false;
  }

  // ─── Exercise Handlers ─────────────────────────────────────────────────────
  function handleMatchIncorrect() {
    gameState.decrementHeart();
    if (gameState.hearts <= 0) isGameOver = true;
  }

  function handleSelect(val: any) {
    if (isChecked) return;
    selectedOption = val;
  }

  function handleWordChange(words: string[]) {
    if (isChecked) return;
    selectedWords = words;
  }

  function checkAnswer() {
    if (!canCheck() || isChecked) return;
    isChecked = true;

    if (activeQuestion.type === 'phrase_matching') {
      isCorrect = true;
      showFeedback = true;
    } else if (activeQuestion.type === 'multiple_choice') {
      isCorrect = selectedOption.isCorrect;
      showFeedback = true;
      if (!isCorrect) gameState.decrementHeart();
    } else if (activeQuestion.type === 'fill_in_the_blank') {
      isCorrect = selectedOption.trim().toLowerCase() === activeQuestion.answer.trim().toLowerCase();
      showFeedback = true;
      if (!isCorrect) gameState.decrementHeart();
    } else if (activeQuestion.type === 'sentence_rebuilding') {
      const user = selectedWords.join(' ').trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
      const target = activeQuestion.targetSentence.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
      isCorrect = user === target;
      showFeedback = true;
      if (!isCorrect) gameState.decrementHeart();
    }

    if (gameState.hearts <= 0) {
      setTimeout(() => { if (gameState.hearts <= 0) isGameOver = true; }, 800);
    }
  }

  function handleContinue() {
    showFeedback = false;
    isChecked = false;
    selectedOption = null;
    selectedWords = [];
    matchComplete = false;

    if (questionIndex < activeQuestions.length - 1) {
      questionIndex += 1;
    } else {
      // Current exercise set finished
      if (phase === 'part_play') {
        handlePartPlayComplete();
      } else {
        // synthesis_play done
        isLessonCompleted = true;
        showFloatingXP = true;
        gameState.completeLesson(lesson.id);
      }
    }
  }

  function restartLesson() {
    gameState.refillHearts();
    partIndex = 0;
    phase = hasParts ? 'verse_hook' : 'synthesis_play';
    resetExerciseState();
    isGameOver = false;
    isLessonCompleted = false;
    showFloatingXP = false;
  }

  // ─── Feedback derived ──────────────────────────────────────────────────────
  let correctAnswerText = $derived(() => {
    if (!activeQuestion) return '';
    if (activeQuestion.type === 'multiple_choice') {
      const mcq = activeQuestion as any;
      return mcq.options.find((o: any) => o.isCorrect)?.text || '';
    }
    if (activeQuestion.type === 'fill_in_the_blank') return activeQuestion.answer;
    if (activeQuestion.type === 'sentence_rebuilding') return activeQuestion.targetSentence;
    return '';
  });

  let explanationText = $derived(() => {
    if (!activeQuestion) return lesson.purport;
    if (activeQuestion.type === 'multiple_choice') {
      const mcq = activeQuestion as any;
      return selectedOption?.explanation || mcq.options.find((o: any) => o.isCorrect)?.explanation || '';
    }
    if (activeQuestion.type === 'fill_in_the_blank' || activeQuestion.type === 'sentence_rebuilding') {
      return activeQuestion.explanation;
    }
    return lesson.purport;
  });
</script>

<div class="w-full h-full flex flex-col bg-bg-base text-text-primary relative select-none">

  {#if isGameOver}
    <!-- ═══ GAME OVER ════════════════════════════════════════════════════════ -->
    <div class="absolute inset-0 bg-bg-base/95 flex flex-col items-center justify-center p-6 text-center z-50 animate-[fade-in_0.3s_ease-out]">
      <Mascot mood="sad" size="lg" speechBubble="Do not lose heart! Try again." />
      <h1 class="text-2xl font-black text-error font-cinzel tracking-wide mt-4 mb-1">Out of Hearts</h1>
      <p class="text-text-muted text-xs max-w-xs leading-relaxed mb-6">
        "Focus on the action without fear of failure. Refill your hearts and try again."
      </p>
      <div class="flex flex-col gap-3 w-full max-w-xs">
        <button onclick={restartLesson} class="w-full bg-primary hover:bg-primary-dark text-bg-base font-black py-3.5 rounded-2xl shadow-lg btn-3d border-b-4 border-amber-900 transition-all">
          Refill Hearts &amp; Retry
        </button>
        <button onclick={onExit} class="w-full bg-bg-surface hover:bg-slate-800 text-text-muted font-bold py-3.5 rounded-2xl border border-slate-700 active:scale-[0.98] transition-all text-xs">
          Return to Dashboard
        </button>
      </div>
    </div>

  {:else if isLessonCompleted}
    <!-- ═══ LESSON COMPLETE ══════════════════════════════════════════════════ -->
    <div class="absolute inset-0 bg-bg-base/95 flex flex-col items-center justify-center p-6 text-center z-50 animate-[fade-in_0.3s_ease-out] relative">

      {#if showFloatingXP}
        <div class="absolute top-1/4 z-50 animate-float-xp font-black text-3xl text-primary drop-shadow-lg flex items-center gap-1">
          <span>+50 XP</span>
          <svg viewBox="0 0 24 24" fill="currentColor" class="w-7 h-7 text-primary"><path d="M13 2L3 14h7v8l10-12h-7V2z"/></svg>
        </div>
      {/if}

      <Mascot mood="happy" size="lg" speechBubble="Verse Mastered!" speechIconType="trophy" />

      <h1 class="text-2xl font-black text-success font-cinzel tracking-wide mt-4 mb-1">Full Verse Mastered!</h1>
      <span class="text-text-muted text-xs font-bold uppercase tracking-widest">{lesson.verseRef} Complete</span>

      <p class="text-text-muted text-xs max-w-xs mt-3 mb-6 leading-relaxed">
        You've mastered every word and assembled the complete verse for <strong class="text-text-primary">{lesson.title}</strong>!
      </p>

      <div class="bg-bg-surface border border-slate-800 rounded-2xl p-4 w-full max-w-xs flex justify-around mb-6 shadow-xl">
        <div class="flex flex-col items-center">
          <div class="flex items-center gap-1 text-primary font-black text-2xl">
            <svg viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path d="M13 2L3 14h7v8l10-12h-7V2z"/></svg>
            <span>50</span>
          </div>
          <span class="text-text-muted text-[9px] uppercase font-bold tracking-wider mt-1">XP Earned</span>
        </div>
        <div class="w-px bg-slate-800"></div>
        <div class="flex flex-col items-center">
          <div class="flex items-center gap-1 text-error font-black text-2xl">
            <svg viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-rose-500"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            <span>{gameState.hearts}</span>
          </div>
          <span class="text-text-muted text-[9px] uppercase font-bold tracking-wider mt-1">Hearts Left</span>
        </div>
      </div>

      <button onclick={onExit} class="w-full max-w-xs bg-primary hover:bg-primary-dark text-bg-base font-black py-4 rounded-2xl shadow-lg btn-3d border-b-4 border-amber-900 transition-all text-sm">
        Return to Map
      </button>
    </div>

  {:else if phase === 'verse_hook'}
    <!-- ═══ VERSE HOOK ═══════════════════════════════════════════════════════ -->
    <VerseHookScreen {lesson} onComplete={handleVerseHookComplete} />

  {:else if phase === 'word_discover' && currentPart}
    <!-- ═══ WORD DISCOVERY ═══════════════════════════════════════════════════ -->
    <WordDiscoveryScreen
      part={currentPart}
      partIndex={partIndex + 1}
      totalParts={parts.length}
      onComplete={handleWordDiscoveryComplete}
    />

  {:else if phase === 'synthesis_intro'}
    <!-- ═══ SYNTHESIS INTRO ══════════════════════════════════════════════════ -->
    <div class="absolute inset-0 bg-bg-base/95 flex flex-col items-center justify-center p-6 text-center z-40 overflow-y-auto scrollbar-none animate-[fade-in_0.3s_ease-out]">
      <Mascot mood="happy" size="md" speechBubble="Let's assemble the full verse!" />

      <span class="text-[9px] font-black uppercase tracking-[0.25em] px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 mt-4 mb-2">
        FULL VERSE MASTER STAGE
      </span>
      <h2 class="text-2xl font-black text-text-primary font-cinzel tracking-wide mb-2 max-w-xs">
        Merging All Parts Together
      </h2>

      <p class="text-xs text-text-muted max-w-xs leading-relaxed mb-5">
        You've discovered every word. Now let's test your complete mastery of the entire verse.
      </p>

      <div class="bg-bg-surface border border-slate-800 p-5 rounded-3xl w-full max-w-xs flex flex-col gap-2.5 mb-6 shadow-2xl text-left">
        <span class="text-[9px] font-black text-primary uppercase tracking-widest block border-b border-slate-800 pb-2">
          {lesson.verseRef} · Full Verse:
        </span>
        <p class="text-base font-bold font-cinzel text-amber-200 leading-snug whitespace-pre-line">
          {lesson.verseSanskrit}
        </p>
        <p class="text-xs text-text-muted italic leading-relaxed pt-2 border-t border-slate-800">
          "{lesson.translation}"
        </p>
      </div>

      <button
        onclick={startSynthesisPlay}
        class="w-full max-w-xs py-4 bg-primary text-bg-base font-black text-sm rounded-2xl shadow-xl btn-3d border-b-4 border-amber-900 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
      >
        <span>SOLVE FULL VERSE</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
          <path fill-rule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>

  {:else}
    <!-- ═══ EXERCISE PHASE (part_play or synthesis_play) ═════════════════════ -->
    <LessonProgress
      current={questionIndex}
      total={activeQuestions.length}
      onCancel={onExit}
    />

    <div class="flex-1 flex flex-col items-center overflow-y-auto px-4 py-4 scrollbar-none w-full max-w-md mx-auto">
      <!-- Question header -->
      <div class="text-center w-full mb-4 flex flex-col items-center gap-2">
        {#if phase === 'synthesis_play'}
          <span class="bg-primary/20 text-primary border border-primary/40 text-[9px] px-3 py-0.5 rounded-full font-black uppercase tracking-wider flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3.5 h-3.5">
              <path fill-rule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clip-rule="evenodd" />
            </svg>
            FULL VERSE MASTER STAGE
          </span>
        {:else if currentPart}
          <div class="flex flex-col items-center gap-1">
            <span class="bg-success/20 text-success border border-success/40 text-[9px] px-3 py-0.5 rounded-full font-black uppercase tracking-wider">
              STEP {partIndex + 1}/{parts.length}
            </span>
            <span class="text-xs font-bold text-text-muted">
              {currentPart.title}
            </span>
          </div>
        {/if}

        {#if activeQuestion}
          <h2 class="text-sm font-bold text-text-primary leading-snug max-w-sm">
            {activeQuestion.prompt}
          </h2>
        {/if}
      </div>

      <!-- Question component -->
      <div class="w-full flex-1 flex flex-col justify-start">
        {#if activeQuestion}
          {#if activeQuestion.type === 'reflection'}
            <ReflectionPrompt
              promptId={activeQuestion.id}
              prompt={activeQuestion.prompt}
              verseContext={(activeQuestion as any).verseContext || lesson.translation}
              guidance={(activeQuestion as any).guidance}
              onComplete={handleContinue}
            />
          {:else if activeQuestion.type === 'phrase_matching'}
            <PhraseMatcher
              pairs={activeQuestion.pairs}
              onIncorrect={handleMatchIncorrect}
              onAllMatched={() => matchComplete = true}
            />
          {:else if activeQuestion.type === 'sentence_rebuilding'}
            <WordTilePicker
              tiles={activeQuestion.tiles}
              onChange={handleWordChange}
            />
          {:else if activeQuestion.type === 'fill_in_the_blank'}
            <FillInBlank
              prompt={activeQuestion.prompt}
              translation={activeQuestion.translation}
              options={activeQuestion.options}
              onSelect={handleSelect}
            />
          {:else if activeQuestion.type === 'multiple_choice'}
            <MultipleChoice
              options={activeQuestion.options}
              onSelect={handleSelect}
            />
          {/if}
        {/if}
      </div>
    </div>

    <!-- Check button (hidden for reflection) -->
    {#if activeQuestion && activeQuestion.type !== 'reflection'}
      <div class="p-4 bg-bg-surface border-t border-slate-800 sticky bottom-0 z-20">
        <button
          onclick={checkAnswer}
          disabled={!canCheck() || isChecked}
          class="w-full py-4 rounded-2xl font-black text-sm select-none transition-all active:scale-[0.98] btn-3d
            {canCheck() && !isChecked
              ? 'bg-primary text-bg-base hover:bg-primary-dark border-b-4 border-amber-900 shadow-lg shadow-primary/10'
              : 'bg-bg-base text-text-muted/50 border border-slate-800 cursor-not-allowed border-b-4 border-b-slate-950'}"
        >
          Check Answer
        </button>
      </div>
    {/if}

    {#if showFeedback}
      <FeedbackModal
        {isCorrect}
        correctAnswerText={correctAnswerText()}
        explanation={explanationText()}
        onContinue={handleContinue}
      />
    {/if}
  {/if}
</div>

<style>
  @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
  .scrollbar-none::-webkit-scrollbar { display: none; }
  .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
</style>
