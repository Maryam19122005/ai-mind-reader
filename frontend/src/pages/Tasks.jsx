import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import { useTaskStore } from '../store/useTaskStore';
import { parseISO, compareAsc, compareDesc } from 'date-fns';
import { Search, SlidersHorizontal, Plus, Compass, BookOpen, AlertCircle } from 'lucide-react';

/* ── Animation variants ── */
const pageVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.4, ease: [0.22, 0.68, 0, 1.2] },
  },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring', stiffness: 280, damping: 24 },
  },
  exit: { opacity: 0, scale: 0.95, y: -8, transition: { duration: 0.18 } },
};

export default function Tasks() {
  const { tasks } = useTaskStore();
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Filter/Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDateAsc');

  // Dynamically extract unique subjects from current tasks
  const subjects = ['all', ...new Set(tasks.map(t => t.subject).filter(Boolean))];

  // Map priorities to numeric weights for sorting
  const priorityWeight = { high: 3, medium: 2, low: 1 };

  // Filter & Sort logic
  const filteredTasks = tasks
    .filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      const matchesSubject = subjectFilter === 'all' || task.subject.toLowerCase() === subjectFilter.toLowerCase();
      
      return matchesSearch && matchesStatus && matchesPriority && matchesSubject;
    })
    .sort((a, b) => {
      if (sortBy === 'dueDateAsc') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return compareAsc(parseISO(a.dueDate), parseISO(b.dueDate));
      }
      if (sortBy === 'dueDateDesc') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return compareDesc(parseISO(a.dueDate), parseISO(b.dueDate));
      }
      if (sortBy === 'priority') {
        const weightA = priorityWeight[a.priority] || 0;
        const weightB = priorityWeight[b.priority] || 0;
        return weightB - weightA; // High priority first
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      <motion.main
        className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 md:px-8"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        
        {/* Header Section */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
          variants={cardVariants}
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-100 uppercase tracking-wide flex items-center gap-2">
              <Compass className="w-8 h-8 text-brand-purple" />
              <span>Quest Log</span>
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Browse, filter, and track all your active and cleared quests.
            </p>
          </div>
          
          <motion.button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-brand-purple to-brand-indigo hover:from-brand-indigo hover:to-brand-purple text-white font-game text-xs font-black uppercase tracking-wider py-3 px-6 rounded-2xl shadow-lg hover:shadow-brand-purple/20 transition-all border border-brand-purple/20 active:scale-[0.98]"
            whileHover={{ scale: 1.04, boxShadow: '0 0 20px rgba(139,92,246,0.4)' }}
            whileTap={{ scale: 0.97 }}
            animate={{ boxShadow: ['0 0 0px rgba(139,92,246,0)', '0 0 16px rgba(139,92,246,0.3)', '0 0 0px rgba(139,92,246,0)'] }}
            transition={{ boxShadow: { duration: 2.5, repeat: Infinity, repeatDelay: 1 } }}
          >
            <Plus className="w-4 h-4" />
            <span>Create Quest</span>
          </motion.button>
        </motion.div>

        {/* Filters and Control Board */}
        <motion.div
          className="glass-panel rounded-3xl p-6 mb-8 space-y-4"
          variants={cardVariants}
        >
          
          {/* Row 1: Search and Status filters */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:max-w-md">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search quest title..."
                className="w-full rounded-2xl border border-slate-800 bg-slate-950/50 pl-11 pr-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:border-brand-purple focus:outline-none transition-colors"
              />
            </div>
            
            {/* Status Tabs */}
            <div className="flex bg-slate-950/60 p-1 rounded-xl border border-slate-850 w-full md:w-auto">
              {['all', 'pending', 'done'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`flex-1 md:flex-initial py-2 px-4 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                    statusFilter === status
                      ? 'bg-slate-850 text-white shadow-md border border-slate-700/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {status === 'all' ? 'All' : status === 'pending' ? 'Active' : 'Cleared'}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-slate-905 w-full" />

          {/* Row 2: Secondary Dropdown Filters (Subject, Difficulty, Sorting) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-center pt-2">
            
            {/* Subject */}
            <div className="space-y-1.5">
              <label htmlFor="subject-select" className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Subject
              </label>
              <select
                id="subject-select"
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-slate-300 focus:border-brand-purple focus:outline-none"
              >
                {subjects.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub === 'all' ? 'All Subjects' : sub}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div className="space-y-1.5">
              <label htmlFor="difficulty-select" className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Difficulty (Priority)
              </label>
              <select
                id="difficulty-select"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-slate-300 focus:border-brand-purple focus:outline-none"
              >
                <option value="all">All Difficulties</option>
                <option value="high">High Only</option>
                <option value="medium">Medium Only</option>
                <option value="low">Low Only</option>
              </select>
            </div>

            {/* Sort Order */}
            <div className="space-y-1.5">
              <label htmlFor="sort-select" className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Order By
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-slate-300 focus:border-brand-purple focus:outline-none"
              >
                <option value="dueDateAsc">Due Date (Earliest)</option>
                <option value="dueDateDesc">Due Date (Latest)</option>
                <option value="priority">Difficulty (Highest)</option>
              </select>
            </div>

            {/* Helper Indicator info */}
            <div className="self-end pb-1.5 text-right hidden md:block">
              <span className="text-xs text-slate-400 font-mono">
                Matching Quests: <span className="text-brand-purple font-black">{filteredTasks.length}</span>
              </span>
            </div>

          </div>

        </motion.div>

        {/* Quests Display Grid */}
        {filteredTasks.length === 0 ? (
          <motion.div
            className="glass-panel border-dashed border-slate-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-3"
            variants={cardVariants}
          >
            <div className="p-3 rounded-full bg-slate-900 border border-slate-805 text-slate-500">
              <SlidersHorizontal className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-300">No Quests Found</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No active or completed quests match the filters. Try adjusting your parameters or create a new quest.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
          >
            <AnimatePresence mode="popLayout">
              {filteredTasks.map((task) => (
                <motion.div key={task.id} variants={cardVariants} exit="exit" layout>
                  <TaskCard task={task} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

      </motion.main>

      {/* Task Form Dialog Modal */}
      <TaskForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
}
