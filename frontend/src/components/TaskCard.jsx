import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskStore } from '../store/useTaskStore';
import { isTaskOverdue } from '../utils/gamification';
import TaskForm from './TaskForm';
import { CheckCircle2, Circle, Trash2, Calendar, BookOpen, AlertCircle, Edit3 } from 'lucide-react';

export default function TaskCard({ task }) {
  const { completeTask, deleteTask } = useTaskStore();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const isOverdue = isTaskOverdue(task.dueDate, task.status);

  const priorityStyles = {
    high:   'bg-rose-500/15 text-rose-400 border-rose-500/30',
    medium: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    low:    'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  };

  const formattedDate = () => {
    if (!task.dueDate) return 'No due date';
    try { return format(parseISO(task.dueDate), 'MMM dd, yyyy'); }
    catch { return task.dueDate; }
  };

  const handleComplete = () => {
    if (task.status === 'done') return;
    setJustCompleted(true);
    // Small delay so animation plays before state flips
    setTimeout(() => completeTask(task.id), 280);
  };

  return (
    <>
      <motion.div
        layout
        className={`glass-panel rounded-xl p-4 transition-colors duration-300 ${
          task.status === 'done'
            ? 'opacity-60 border-emerald-500/20 bg-emerald-500/5'
            : isOverdue
              ? 'border-rose-500/50 bg-rose-500/5 shadow-[0_0_15px_rgba(244,63,94,0.08)]'
              : 'hover:border-brand-purple/30'
        }`}
        whileHover={task.status !== 'done' ? { y: -1 } : {}}
        transition={{ duration: 0.15 }}
      >
        <div className="flex items-start gap-3">
          {/* Complete button */}
          <motion.button
            onClick={handleComplete}
            disabled={task.status === 'done'}
            className={`mt-0.5 rounded-full transition-colors focus:outline-none flex-shrink-0 ${
              task.status === 'done'
                ? 'text-emerald-500 cursor-default'
                : isOverdue
                  ? 'text-rose-400 hover:text-rose-300'
                  : 'text-slate-500 hover:text-brand-purple'
            }`}
            whileTap={task.status !== 'done' ? { scale: 0.85 } : {}}
          >
            <AnimatePresence mode="wait">
              {task.status === 'done' || justCompleted ? (
                <motion.div
                  key="checked"
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 22, duration: 0.3 }}
                >
                  <CheckCircle2 className="w-5 h-5 fill-emerald-500/20 text-emerald-500" />
                </motion.div>
              ) : (
                <motion.div key="unchecked" initial={{ scale: 1 }} exit={{ scale: 0 }}>
                  <Circle className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-brand-purple/95">
                <BookOpen className="w-3 h-3" />
                {task.subject}
              </span>
              <span className="text-slate-700 text-xs">•</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${priorityStyles[task.priority] || priorityStyles.medium}`}>
                {task.priority}
              </span>
              {isOverdue && (
                <motion.span
                  className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border bg-rose-500/20 text-rose-300 border-rose-500/40"
                  animate={{ opacity: [1, 0.6, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <AlertCircle className="w-3 h-3" />Overdue
                </motion.span>
              )}
            </div>

            <h4 className={`text-base font-bold app-text truncate transition-all duration-300 ${
              task.status === 'done' ? 'line-through opacity-50' : ''
            }`}>
              {task.title}
            </h4>

            <p className="flex items-center gap-1 mt-2 text-xs app-text-muted font-medium">
              <Calendar className="w-3.5 h-3.5" />
              <span>Due {formattedDate()}</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {task.status !== 'done' && (
              <motion.button
                onClick={() => setIsEditOpen(true)}
                className="app-text-muted hover:text-brand-purple p-1.5 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Edit task"
              >
                <Edit3 className="w-4 h-4" />
              </motion.button>
            )}
            <motion.button
              onClick={() => deleteTask(task.id)}
              className="app-text-muted hover:text-rose-400 p-1.5 rounded-lg transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Delete task"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Edit Task Modal */}
      <TaskForm
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        editTask={task}
      />
    </>
  );
}
