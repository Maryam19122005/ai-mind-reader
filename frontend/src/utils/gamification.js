import { parseISO, startOfDay, differenceInDays } from 'date-fns';

/**
 * Calculates XP required to complete the given level.
 * Formula: level * 100 XP.
 */
export function xpForLevel(level) {
  return level * 100;
}

/**
 * Handles adding XP and handles leveling up recursively.
 * Returns { newXP, newLevel, leveledUpCount }
 */
export function addXP(currentXP, currentLevel, amount) {
  let xp = currentXP + amount;
  let level = currentLevel;
  let leveledUpCount = 0;

  while (xp >= xpForLevel(level)) {
    xp -= xpForLevel(level);
    level += 1;
    leveledUpCount += 1;
  }

  return {
    newXP: xp,
    newLevel: level,
    leveledUpCount
  };
}

/**
 * Determines whether a task is overdue based on due date.
 * Returns true if the task is pending and the due date is in the past (before today).
 */
export function isTaskOverdue(dueDateStr, status) {
  if (status === 'done') return false;
  if (!dueDateStr) return false;

  const today = startOfDay(new Date());
  const dueDate = startOfDay(parseISO(dueDateStr));

  return isBeforeDate(dueDate, today);
}

/**
 * Helper to check if date A is strictly before date B.
 */
function isBeforeDate(dateA, dateB) {
  return differenceInDays(dateA, dateB) < 0;
}

/**
 * Calculates the XP reward based on when the task is completed.
 * - Overdue task: +5 XP
 * - On time (due today): +10 XP
 * - Early (due in the future): +15 XP
 */
export function calculateXPForCompletion(dueDateStr) {
  if (!dueDateStr) return 10; // default

  const today = startOfDay(new Date());
  const dueDate = startOfDay(parseISO(dueDateStr));
  const diffDays = differenceInDays(dueDate, today);

  if (diffDays < 0) {
    return 5;  // Overdue
  } else if (diffDays === 0) {
    return 10; // On time
  } else {
    return 15; // Early
  }
}
