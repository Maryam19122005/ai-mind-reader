/**
 * Badge definitions and checking logic for StudyFlow achievements.
 */

export const BADGE_DEFINITIONS = [
  // Task milestones
  {
    id: 'first_quest',
    title: 'First Blood',
    description: 'Complete your very first quest.',
    icon: '⚔️',
    rarity: 'common',
    check: ({ doneTasks }) => doneTasks >= 1,
  },
  {
    id: 'quest_5',
    title: 'Adventurer',
    description: 'Complete 5 quests.',
    icon: '🗺️',
    rarity: 'common',
    check: ({ doneTasks }) => doneTasks >= 5,
  },
  {
    id: 'quest_10',
    title: 'Quest Veteran',
    description: 'Complete 10 quests.',
    icon: '🏹',
    rarity: 'uncommon',
    check: ({ doneTasks }) => doneTasks >= 10,
  },
  {
    id: 'quest_25',
    title: 'Seasoned Hero',
    description: 'Complete 25 quests.',
    icon: '🛡️',
    rarity: 'rare',
    check: ({ doneTasks }) => doneTasks >= 25,
  },
  {
    id: 'quest_50',
    title: 'Legendary Scholar',
    description: 'Complete 50 quests.',
    icon: '👑',
    rarity: 'legendary',
    check: ({ doneTasks }) => doneTasks >= 50,
  },

  // Streak milestones
  {
    id: 'streak_3',
    title: 'Consistent',
    description: 'Maintain a 3-day streak.',
    icon: '🔥',
    rarity: 'common',
    check: ({ streak }) => streak >= 3,
  },
  {
    id: 'streak_7',
    title: '7-Day Streak',
    description: 'Maintain a 7-day streak. One full week!',
    icon: '🌟',
    rarity: 'uncommon',
    check: ({ streak }) => streak >= 7,
  },
  {
    id: 'streak_14',
    title: 'Fortnight Warrior',
    description: 'Maintain a 14-day streak.',
    icon: '💫',
    rarity: 'rare',
    check: ({ streak }) => streak >= 14,
  },
  {
    id: 'streak_30',
    title: 'Unstoppable',
    description: 'Maintain a 30-day streak. Legendary dedication!',
    icon: '🏆',
    rarity: 'legendary',
    check: ({ streak }) => streak >= 30,
  },

  // Early bird (task completed before due date)
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Complete a task before its due date.',
    icon: '🐦',
    rarity: 'uncommon',
    check: ({ earlyCompletions }) => earlyCompletions >= 1,
  },
  {
    id: 'early_bird_5',
    title: 'Proactive Scholar',
    description: 'Complete 5 tasks before their due date.',
    icon: '⚡',
    rarity: 'rare',
    check: ({ earlyCompletions }) => earlyCompletions >= 5,
  },

  // Level milestones
  {
    id: 'level_5',
    title: 'Rising Star',
    description: 'Reach Level 5.',
    icon: '⭐',
    rarity: 'uncommon',
    check: ({ level }) => level >= 5,
  },
  {
    id: 'level_10',
    title: 'Archmage',
    description: 'Reach Level 10. You\'re on fire!',
    icon: '🧙',
    rarity: 'legendary',
    check: ({ level }) => level >= 10,
  },
];

export const RARITY_STYLES = {
  common: {
    border: 'border-slate-600',
    bg: 'bg-slate-800/40',
    badge: 'bg-slate-700 text-slate-300',
    glow: '',
  },
  uncommon: {
    border: 'border-emerald-500/50',
    bg: 'bg-emerald-500/5',
    badge: 'bg-emerald-500/20 text-emerald-400',
    glow: 'shadow-[0_0_12px_rgba(16,185,129,0.15)]',
  },
  rare: {
    border: 'border-brand-indigo/50',
    bg: 'bg-brand-indigo/5',
    badge: 'bg-brand-indigo/20 text-indigo-400',
    glow: 'shadow-[0_0_12px_rgba(99,102,241,0.2)]',
  },
  legendary: {
    border: 'border-brand-gold/50',
    bg: 'bg-brand-gold/5',
    badge: 'bg-brand-gold/20 text-yellow-400',
    glow: 'shadow-[0_0_15px_rgba(234,179,8,0.25)]',
  },
};

/**
 * Given current stats, returns array of badge IDs that should now be unlocked.
 */
export function checkBadges(stats) {
  return BADGE_DEFINITIONS.filter(badge => badge.check(stats)).map(b => b.id);
};
