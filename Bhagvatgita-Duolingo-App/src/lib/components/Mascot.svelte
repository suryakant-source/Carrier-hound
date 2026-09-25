<script lang="ts">
  export type MascotMood = 'happy' | 'sad' | 'neutral' | 'thinking' | 'guide';

  let {
    mood = 'neutral',
    size = 'md',
    speechBubble,
    speechIconType,
    bubblePosition = 'top',
    animate = false
  } = $props<{
    mood?: MascotMood;
    size?: 'sm' | 'md' | 'lg';
    speechBubble?: string;
    speechIconType?: 'flame' | 'lightning' | 'trophy' | 'om';
    bubblePosition?: 'top' | 'right' | 'left';
    animate?: boolean;
  }>();

  const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };
  let activeSize = $derived((size || 'md') as 'sm' | 'md' | 'lg');
</script>

<div class="relative flex flex-col items-center select-none group">

  <!-- Speech Bubble if present -->
  {#if speechBubble}
    <div
      class="absolute z-20 pointer-events-none transition-all duration-200 animate-[fade-in_0.2s_ease-out]
        {bubblePosition === 'top' ? '-top-12 left-1/2 -translate-x-1/2' : ''}
        {bubblePosition === 'right' ? 'left-full ml-2 top-1/2 -translate-y-1/2' : ''}
        {bubblePosition === 'left' ? 'right-full mr-2 top-1/2 -translate-y-1/2' : ''}"
    >
      <div class="bg-bg-surface border border-primary/60 text-amber-200 font-extrabold text-[10px] sm:text-[11px] px-3 py-1.5 rounded-xl shadow-2xl whitespace-nowrap flex items-center gap-1.5 max-w-[200px]">
        {#if speechIconType === 'flame'}
          <svg viewBox="0 0 24 24" fill="currentColor" class="w-3.5 h-3.5 text-amber-500 flex-shrink-0">
            <path d="M12 23c-4.97 0-9-4.03-9-9 0-4.13 2.84-7.58 6.72-8.62.44-.12.88.2.88.66v.83c0 2.21 1.79 4 4 4s4-1.79 4-4v-.83c0-.46.44-.78.88-.66C20.16 6.42 23 9.87 23 14c0 4.97-4.03 9-9 9z"/>
          </svg>
        {:else if speechIconType === 'lightning'}
          <svg viewBox="0 0 24 24" fill="currentColor" class="w-3.5 h-3.5 text-primary flex-shrink-0">
            <path d="M13 2L3 14h7v8l10-12h-7V2z"/>
          </svg>
        {:else if speechIconType === 'trophy'}
          <svg viewBox="0 0 24 24" fill="currentColor" class="w-3.5 h-3.5 text-amber-400 flex-shrink-0">
            <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0011 15.9V18H8v2h8v-2h-3v-2.1c2.12-.39 3.75-2.07 4.39-4.24C19.7 11.23 21 9.27 21 7V5c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
          </svg>
        {:else if speechIconType === 'om'}
          <span class="text-xs font-cinzel text-primary font-bold leading-none flex-shrink-0">ॐ</span>
        {/if}
        <span class="leading-snug">{speechBubble}</span>
      </div>
      <!-- Triangle Arrow Pointer -->
      {#if bubblePosition === 'top'}
        <div class="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-primary/60 mx-auto -mt-[1px]"></div>
      {:else if bubblePosition === 'left'}
        <div class="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[6px] border-l-primary/60 absolute top-1/2 -translate-y-1/2 -right-[6px]"></div>
      {:else if bubblePosition === 'right'}
        <div class="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-r-[6px] border-r-primary/60 absolute top-1/2 -translate-y-1/2 -left-[6px]"></div>
      {/if}
    </div>
  {/if}

  <!-- Mascot Owl SVG -->
  <div
    class="relative {sizeClasses[activeSize]} flex items-center justify-center drop-shadow-xl transition-transform duration-200 hover:scale-105
      {animate ? 'animate-owl-bounce' : ''}"
  >
    <svg viewBox="0 0 100 100" class="w-full h-full">
      <!-- Body -->
      <ellipse cx="50" cy="55" rx="35" ry="38" fill="#10B981" />
      <ellipse cx="50" cy="58" rx="24" ry="26" fill="#D1FAE5" />

      <!-- Headband / Saffron tilak -->
      <path d="M 22 32 Q 50 25 78 32 L 76 38 Q 50 31 24 38 Z" fill="#F4A428" />
      <circle cx="50" cy="30" r="3.5" fill="#D64545" />

      <!-- Eyes & Expressions -->
      {#if mood === 'happy'}
        <!-- Celebrating smiling eyes -->
        <path d="M 28 46 Q 37 38 44 46" fill="none" stroke="#0F172A" stroke-width="4" stroke-linecap="round" />
        <path d="M 56 46 Q 63 38 72 46" fill="none" stroke="#0F172A" stroke-width="4" stroke-linecap="round" />
        <circle cx="30" cy="48" r="3" fill="#E85D9A" opacity="0.6" />
        <circle cx="70" cy="48" r="3" fill="#E85D9A" opacity="0.6" />
      {:else if mood === 'sad'}
        <!-- Soft comforting eyes -->
        <circle cx="37" cy="45" r="10" fill="white" />
        <circle cx="63" cy="45" r="10" fill="white" />
        <circle cx="37" cy="47" r="4" fill="#0F172A" />
        <circle cx="63" cy="47" r="4" fill="#0F172A" />
        <!-- Sad tear droplet -->
        <circle cx="25" cy="52" r="2.5" fill="#38BDF8" />
      {:else if mood === 'thinking'}
        <!-- Thinking inquisitive eyes -->
        <circle cx="37" cy="45" r="11" fill="white" />
        <circle cx="63" cy="45" r="11" fill="white" />
        <circle cx="41" cy="42" r="5" fill="#0F172A" />
        <circle cx="61" cy="42" r="5" fill="#0F172A" />
        <!-- Raised eyebrow -->
        <path d="M 28 36 Q 37 32 44 38" fill="none" stroke="#F4A428" stroke-width="3" stroke-linecap="round" />
      {:else if mood === 'guide'}
        <!-- Guide: wide open eager eyes looking up -->
        <circle cx="37" cy="43" r="12" fill="white" />
        <circle cx="63" cy="43" r="12" fill="white" />
        <circle cx="37" cy="40" r="5.5" fill="#0F172A" />
        <circle cx="63" cy="40" r="5.5" fill="#0F172A" />
        <circle cx="39" cy="38" r="2.5" fill="white" />
        <circle cx="65" cy="38" r="2.5" fill="white" />
        <!-- Small star sparkle near right eye -->
        <text x="73" y="35" font-size="7" fill="#F4A428" text-anchor="middle">✦</text>
      {:else}
        <!-- Neutral / Serene attentive eyes -->
        <circle cx="37" cy="45" r="11" fill="white" />
        <circle cx="63" cy="45" r="11" fill="white" />
        <circle cx="39" cy="45" r="5" fill="#0F172A" />
        <circle cx="61" cy="45" r="5" fill="#0F172A" />
        <circle cx="41" cy="43" r="2" fill="white" />
        <circle cx="63" cy="43" r="2" fill="white" />
      {/if}

      <!-- Beak -->
      {#if mood === 'happy' || mood === 'guide'}
        <polygon points="50,47 42,56 58,56" fill="#F4A428" />
      {:else}
        <polygon points="50,48 44,56 56,56" fill="#F4A428" />
      {/if}

      <!-- Wings -->
      <ellipse cx="18" cy="58" rx="8" ry="16" fill="#059669" transform="rotate({mood === 'happy' || mood === 'guide' ? '30 18 58' : '15 18 58'})" />
      <ellipse cx="82" cy="58" rx="8" ry="16" fill="#059669" transform="rotate({mood === 'happy' || mood === 'guide' ? '-30 82 58' : '-15 82 58'})" />

      <!-- Feet -->
      <ellipse cx="40" cy="91" rx="6" ry="3" fill="#F4A428" />
      <ellipse cx="60" cy="91" rx="6" ry="3" fill="#F4A428" />
    </svg>
  </div>

  <!-- Shadow Base -->
  <div class="w-12 h-2.5 bg-slate-950/80 rounded-full blur-[1px] -mt-1"></div>
</div>
