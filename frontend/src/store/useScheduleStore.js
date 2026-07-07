import { create } from 'zustand';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const getStoredSchedule = () => {
  try {
    const data = localStorage.getItem('studyflow_schedule');
    return data ? JSON.parse(data) : [];
  } catch { return []; }
};

const saveSchedule = (classes) => {
  try {
    localStorage.setItem('studyflow_schedule', JSON.stringify(classes));
  } catch {}
};

export const useScheduleStore = create((set, get) => ({
  classes: getStoredSchedule(),

  addClass: (classData) => {
    const newClass = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
      subject: classData.subject || 'Unknown',
      day: classData.day || 'Monday',
      startTime: classData.startTime || '08:00',
      endTime: classData.endTime || '09:00',
      room: classData.room || '',
      instructor: classData.instructor || '',
      color: classData.color || '#8b5cf6',
    };
    const updated = [...get().classes, newClass];
    set({ classes: updated });
    saveSchedule(updated);
  },

  editClass: (classId, updates) => {
    const updated = get().classes.map(c =>
      c.id === classId ? { ...c, ...updates } : c
    );
    set({ classes: updated });
    saveSchedule(updated);
  },

  deleteClass: (classId) => {
    const updated = get().classes.filter(c => c.id !== classId);
    set({ classes: updated });
    saveSchedule(updated);
  },

  getNextClass: () => {
    const now = new Date();
    const dayIndex = now.getDay(); // 0=Sun
    // Map JS day (0=Sun) to our day names
    const jsToDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = jsToDay[dayIndex];

    const todayClasses = get().classes
      .filter(c => c.day === todayName)
      .filter(c => {
        const [h, m] = c.startTime.split(':').map(Number);
        const classStart = new Date(now);
        classStart.setHours(h, m, 0, 0);
        return classStart > now;
      })
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    return todayClasses[0] || null;
  },
}));

export const SCHEDULE_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const CLASS_COLORS = [
  '#8b5cf6', '#6366f1', '#ec4899', '#f59e0b',
  '#10b981', '#3b82f6', '#ef4444', '#14b8a6',
];
