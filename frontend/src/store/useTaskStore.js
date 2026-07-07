import { create } from 'zustand';
import { calculateXPForCompletion } from '../utils/gamification';
import { useGameStore } from './useGameStore';
import { useBadgeStore } from './useBadgeStore';
import toast from 'react-hot-toast';


const getStoredTasks = () => {
  try {
    const tasksStr = localStorage.getItem('studyflow_tasks');
    return tasksStr ? JSON.parse(tasksStr) : [];
  } catch (e) {
    return [];
  }
};

const saveStoredTasks = (tasks) => {
  try {
    localStorage.setItem('studyflow_tasks', JSON.stringify(tasks));
  } catch (e) {}
};

export const useTaskStore = create((set, get) => ({
  tasks: getStoredTasks(),

  addTask: (taskData) => {
    const newTask = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
      title: taskData.title,
      subject: taskData.subject || 'General',
      dueDate: taskData.dueDate,
      priority: taskData.priority || 'medium',
      status: 'pending',
    };

    const updatedTasks = [newTask, ...get().tasks];
    set({ tasks: updatedTasks });
    saveStoredTasks(updatedTasks);
    toast.success('Daily quest added to log! 📝');
  },

  editTask: (taskId, updates) => {
    const updatedTasks = get().tasks.map(t =>
      t.id === taskId ? { ...t, ...updates } : t
    );
    set({ tasks: updatedTasks });
    saveStoredTasks(updatedTasks);
    toast.success('Quest updated! ✏️');
  },

  completeTask: (taskId) => {
    const tasks = get().tasks;
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1 || tasks[taskIndex].status === 'done') return;

    const task = tasks[taskIndex];
    const xpAwarded = calculateXPForCompletion(task.dueDate);

    const updatedTasks = tasks.map(t => 
      t.id === taskId ? { ...t, status: 'done', completedAt: new Date().toISOString() } : t
    );

    set({ tasks: updatedTasks });
    saveStoredTasks(updatedTasks);

    // Update game status
    const gameStore = useGameStore.getState();
    gameStore.addXP(xpAwarded);
    gameStore.checkStreak();

    // Trigger badge checks with latest stats
    useBadgeStore.getState().checkAndAward({
      tasks: updatedTasks,
      level: gameStore.level,
      streak: gameStore.streak,
    });
  },

  deleteTask: (taskId) => {
    const updatedTasks = get().tasks.filter(t => t.id !== taskId);
    set({ tasks: updatedTasks });
    saveStoredTasks(updatedTasks);
    toast.error('Quest removed. 🗑️');
  }
}));
