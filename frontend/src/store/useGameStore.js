import { create } from 'zustand';
import { addXP } from '../utils/gamification';
import { format, subDays } from 'date-fns';
import toast from 'react-hot-toast';

const getTodayStr = () => format(new Date(), 'yyyy-MM-dd');
const getYesterdayStr = () => format(subDays(new Date(), 1), 'yyyy-MM-dd');

const getStoredGameData = () => {
  try {
    const data = localStorage.getItem('studyflow_game_data');
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {}
  return { xp: 0, level: 1, streak: 0, lastActiveDate: null };
};

const saveStoredGameData = (state) => {
  try {
    localStorage.setItem('studyflow_game_data', JSON.stringify({
      xp: state.xp,
      level: state.level,
      streak: state.streak,
      lastActiveDate: state.lastActiveDate,
    }));
  } catch (e) {}
};

export const useGameStore = create((set, get) => ({
  ...getStoredGameData(),

  addXP: (amount) => {
    const state = get();
    const result = addXP(state.xp, state.level, amount);

    const newState = {
      ...state,
      xp: result.newXP,
      level: result.newLevel,
    };

    if (result.leveledUpCount > 0) {
      toast.success(`🎉 LEVEL UP! You reached Level ${result.newLevel}!`, {
        duration: 5000,
        icon: '👑',
        style: {
          border: '2px solid #fbbf24',
          padding: '16px',
          color: '#7c3aed',
          fontWeight: 'bold',
          background: '#fef3c7',
        },
      });
    }

    set(newState);
    saveStoredGameData(newState);
  },

  checkStreak: () => {
    const state = get();
    const today = getTodayStr();
    const yesterday = getYesterdayStr();
    
    let newStreak = state.streak;
    let newLastActiveDate = state.lastActiveDate;

    if (state.lastActiveDate === today) {
      // Already active today, streak remains same
      return;
    } else if (state.lastActiveDate === yesterday) {
      // Active yesterday, increment streak
      newStreak = (state.streak || 0) + 1;
      newLastActiveDate = today;
      toast(`Streak continued! ${newStreak} days! 🔥`, { icon: '🔥' });
    } else {
      // Reset or start streak at 1
      newStreak = 1;
      newLastActiveDate = today;
      toast(`New daily streak started! 🔥`, { icon: '✨' });
    }

    const newState = {
      ...state,
      streak: newStreak,
      lastActiveDate: newLastActiveDate
    };

    set(newState);
    saveStoredGameData(newState);
  }
}));
