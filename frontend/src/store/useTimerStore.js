import { create } from 'zustand';
import { useGameStore } from './useGameStore';
import toast from 'react-hot-toast';

const WORK_DURATION = 25 * 60; // 25 minutes in seconds
const BREAK_DURATION = 5 * 60; // 5 minutes in seconds

export const useTimerStore = create((set, get) => ({
  mode: 'work',         // 'work' | 'break'
  timeLeft: WORK_DURATION,
  isRunning: false,
  sessionCount: 0,
  intervalId: null,

  start: () => {
    if (get().isRunning) return;

    const id = setInterval(() => {
      const { timeLeft, mode, sessionCount } = get();

      if (timeLeft <= 1) {
        clearInterval(get().intervalId);

        if (mode === 'work') {
          // Work session complete — award XP
          useGameStore.getState().addXP(5);
          const newCount = sessionCount + 1;
          toast.success(`⚔️ Boss Battle Round ${newCount} complete! +5 XP`, {
            duration: 4000,
            style: { border: '2px solid #8b5cf6', background: '#0f172a', color: '#c4b5fd' },
          });
          set({
            mode: 'break',
            timeLeft: BREAK_DURATION,
            isRunning: false,
            sessionCount: newCount,
            intervalId: null,
          });
        } else {
          // Break complete — back to work
          toast(`☕ Break over! Time to study again.`, { icon: '💪' });
          set({
            mode: 'work',
            timeLeft: WORK_DURATION,
            isRunning: false,
            intervalId: null,
          });
        }
        return;
      }

      set({ timeLeft: timeLeft - 1 });
    }, 1000);

    set({ isRunning: true, intervalId: id });
  },

  pause: () => {
    const { intervalId } = get();
    if (intervalId) clearInterval(intervalId);
    set({ isRunning: false, intervalId: null });
  },

  reset: () => {
    const { intervalId, mode } = get();
    if (intervalId) clearInterval(intervalId);
    set({
      timeLeft: mode === 'work' ? WORK_DURATION : BREAK_DURATION,
      isRunning: false,
      intervalId: null,
    });
  },

  switchMode: (newMode) => {
    const { intervalId } = get();
    if (intervalId) clearInterval(intervalId);
    set({
      mode: newMode,
      timeLeft: newMode === 'work' ? WORK_DURATION : BREAK_DURATION,
      isRunning: false,
      intervalId: null,
    });
  },

  WORK_DURATION,
  BREAK_DURATION,
}));
