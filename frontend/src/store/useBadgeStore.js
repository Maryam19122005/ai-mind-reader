import { create } from 'zustand';
import { BADGE_DEFINITIONS, checkBadges } from '../utils/badges';
import { differenceInDays, parseISO, startOfDay } from 'date-fns';
import toast from 'react-hot-toast';

const getStoredBadges = () => {
  try {
    const data = localStorage.getItem('studyflow_badges');
    return data ? JSON.parse(data) : [];
  } catch { return []; }
};

const saveBadges = (badges) => {
  try {
    localStorage.setItem('studyflow_badges', JSON.stringify(badges));
  } catch {}
};

export const useBadgeStore = create((set, get) => ({
  earnedBadgeIds: getStoredBadges(),

  checkAndAward: ({ tasks = [], level = 1, streak = 0 }) => {
    const earned = get().earnedBadgeIds;

    const doneTasks = tasks.filter(t => t.status === 'done').length;

    const today = startOfDay(new Date());
    const earlyCompletions = tasks.filter(t => {
      if (t.status !== 'done' || !t.dueDate || !t.completedAt) return false;
      const due = startOfDay(parseISO(t.dueDate));
      return differenceInDays(due, today) > 0;
    }).length;

    const stats = { doneTasks, streak, level, earlyCompletions };
    const shouldBeEarned = checkBadges(stats);

    const newlyEarned = shouldBeEarned.filter(id => !earned.includes(id));

    if (newlyEarned.length === 0) return;

    const updatedBadges = [...earned, ...newlyEarned];
    set({ earnedBadgeIds: updatedBadges });
    saveBadges(updatedBadges);

    // Toast notification for each new badge
    newlyEarned.forEach(id => {
      const badge = BADGE_DEFINITIONS.find(b => b.id === id);
      if (badge) {
        toast(`🏅 Achievement Unlocked: ${badge.title}!`, {
          duration: 5000,
          icon: badge.icon,
          style: {
            border: '2px solid #eab308',
            background: 'rgba(15,23,42,0.95)',
            color: '#fbbf24',
            fontWeight: 'bold',
          },
        });
      }
    });
  },
}));
