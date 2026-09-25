<script lang="ts">
  import { onMount } from 'svelte';
  import Mascot from './Mascot.svelte';
  import { playSuccessSound, playErrorSound } from '../utils/soundEffects';

  let { isCorrect, correctAnswerText, explanation, onContinue } = $props<{
    isCorrect: boolean;
    correctAnswerText?: string;
    explanation?: string;
    onContinue: () => void;
  }>();

  let mounted = $state(false);
  let canvasRef = $state<HTMLCanvasElement | null>(null);

  onMount(() => {
    const timer = setTimeout(() => mounted = true, 50);

    if (isCorrect) {
      playSuccessSound();
      triggerConfetti();
    } else {
      playErrorSound();
    }

    return () => clearTimeout(timer);
  });

  function triggerConfetti() {
    if (!canvasRef) return;
    const ctx = canvasRef.getContext('2d');
    if (!ctx) return;

    canvasRef.width = window.innerWidth;
    canvasRef.height = 300;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
    }> = [];

    const colors = ['#F4A428', '#1DAA7C', '#E85D9A', '#38BDF8', '#F5EFE0'];

    for (let i = 0; i < 35; i++) {
      particles.push({
        x: canvasRef.width / 2 + (Math.random() * 100 - 50),
        y: canvasRef.height,
        vx: (Math.random() - 0.5) * 8,
        vy: -Math.random() * 8 - 4,
        size: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1
      });
    }

    let animId: number;
    function render() {
      if (!ctx || !canvasRef) return;
      ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);

      let alive = false;
      particles.forEach((p) => {
        if (p.alpha > 0) {
          alive = true;
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.25; // gravity
          p.alpha -= 0.02;

          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      if (alive) {
        animId = requestAnimationFrame(render);
      }
    }

    animId = requestAnimationFrame(render);
  }
</script>

<!-- Bottom Drawer Container -->
<div 
  class="absolute bottom-0 left-0 right-0 border-t p-5 pb-6 transition-transform duration-300 ease-out z-50 select-none shadow-[0_-8px_30px_rgba(0,0,0,0.6)] backdrop-blur-md relative overflow-hidden
    {mounted ? 'translate-y-0' : 'translate-y-full'}
    {isCorrect 
      ? 'bg-bg-surface border-success/60 text-text-primary' 
      : 'bg-bg-surface border-error/60 text-text-primary'}"
>
  <!-- Confetti Canvas -->
  <canvas bind:this={canvasRef} class="absolute inset-0 pointer-events-none z-10 w-full h-full"></canvas>

  <div class="max-w-md mx-auto flex flex-col gap-4 relative z-20">
    
    <!-- Result Header with Emotional Mascot -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        {#if isCorrect}
          <div class="p-2 bg-success text-bg-base rounded-full animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h2 class="text-2xl font-black tracking-tight text-success font-cinzel">Excellent!</h2>
        {:else}
          <div class="p-2 bg-error text-bg-base rounded-full animate-shake">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 class="text-2xl font-black tracking-tight text-error font-cinzel">Incorrect</h2>
        {/if}
      </div>

      <!-- Mascot Mood -->
      <Mascot mood={isCorrect ? 'happy' : 'sad'} size="sm" />
    </div>

    <!-- Correct Answer Display (if incorrect) -->
    {#if !isCorrect && correctAnswerText}
      <div class="text-xs font-medium bg-bg-base/80 p-3 rounded-2xl border border-error/40">
        <span class="text-error font-bold block mb-1">Correct Answer:</span>
        <p class="text-text-primary font-cinzel italic leading-relaxed">
          {correctAnswerText}
        </p>
      </div>
    {/if}

    <!-- Explanatory Purport -->
    {#if explanation}
      <div class="text-xs border-t border-slate-800 pt-2.5">
        <span class="font-bold text-[10px] uppercase tracking-wider text-text-muted">Gita Insight:</span>
        <p class="text-text-muted mt-1 leading-relaxed">
          {explanation}
        </p>
      </div>
    {/if}

    <!-- Action Button -->
    <button
      onclick={onContinue}
      class="w-full py-3.5 px-6 rounded-2xl font-black text-base shadow-lg active:scale-[0.98] transition-all select-none btn-3d
        {isCorrect 
          ? 'bg-success hover:bg-emerald-400 text-bg-base border-b-4 border-emerald-900 shadow-success/20' 
          : 'bg-error hover:bg-rose-500 text-bg-base border-b-4 border-rose-950 shadow-error/20'}"
    >
      Continue
    </button>
  </div>
</div>
