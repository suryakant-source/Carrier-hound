import { browser } from '$app/environment';

export type ScriptMode = 'devanagari' | 'english';

class GameState {
  // Svelte 5 reactive runes
  hearts = $state(5);
  xp = $state(0);
  streak = $state(0);
  completedLessons = $state<string[]>([]);
  lastActiveDate = $state<string | null>(null);
  scriptMode = $state<ScriptMode>('devanagari');
  userReflections = $state<Record<string, string>>({});

  constructor() {
    this.loadState();
  }

  loadState() {
    if (!browser) return;
    try {
      const saved = localStorage.getItem('gita_game_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.hearts = parsed.hearts ?? 5;
        this.xp = parsed.xp ?? 0;
        this.streak = parsed.streak ?? 0;
        this.completedLessons = parsed.completedLessons ?? [];
        this.lastActiveDate = parsed.lastActiveDate ?? null;
        this.scriptMode = parsed.scriptMode ?? 'devanagari';
        this.userReflections = parsed.userReflections ?? {};
      }
    } catch (e) {
      console.error('Failed to load game state:', e);
    }
  }

  saveState() {
    if (!browser) return;
    try {
      const stateObj = {
        hearts: this.hearts,
        xp: this.xp,
        streak: this.streak,
        completedLessons: $state.snapshot(this.completedLessons),
        lastActiveDate: this.lastActiveDate,
        scriptMode: this.scriptMode,
        userReflections: $state.snapshot(this.userReflections)
      };
      localStorage.setItem('gita_game_state', JSON.stringify(stateObj));
    } catch (e) {
      console.error('Failed to save game state:', e);
    }
  }

  saveReflection(promptId: string, text: string) {
    this.userReflections[promptId] = text;
    this.saveState();
  }

  toggleScriptMode() {
    this.scriptMode = this.scriptMode === 'devanagari' ? 'english' : 'devanagari';
    this.saveState();
  }

  setScriptMode(mode: ScriptMode) {
    this.scriptMode = mode;
    this.saveState();
  }

  decrementHeart() {
    if (this.hearts > 0) {
      this.hearts--;
      this.saveState();
    }
  }

  refillHearts() {
    this.hearts = 5;
    this.saveState();
  }

  addXP(amount: number) {
    this.xp += amount;
    this.saveState();
  }

  completeLesson(lessonId: string) {
    if (!this.completedLessons.includes(lessonId)) {
      this.completedLessons.push(lessonId);
      this.addXP(50); // Reward 50 XP
      this.updateStreak();
      this.saveState();
    }
  }

  updateStreak() {
    const today = new Date().toDateString();
    if (this.lastActiveDate === today) return;

    if (this.lastActiveDate) {
      const lastDate = new Date(this.lastActiveDate);
      const todayDate = new Date(today);
      const diffTime = todayDate.getTime() - lastDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        this.streak += 1;
      } else if (diffDays > 1) {
        this.streak = 1; // Reset if broke streak
      }
    } else {
      this.streak = 1; // First day
    }
    this.lastActiveDate = today;
  }
  
  resetState() {
    this.hearts = 5;
    this.xp = 0;
    this.streak = 0;
    this.completedLessons = [];
    this.lastActiveDate = null;
    this.scriptMode = 'devanagari';
    this.userReflections = {};
    this.saveState();
  }
}

export const gameState = new GameState();
