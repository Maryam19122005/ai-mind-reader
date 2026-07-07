import React, { useState } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import TaskCard from './TaskCard';
import { Trophy, CheckCircle, Swords, Shield, Scroll, Sparkles } from 'lucide-react';

const PRIORITY_CONFIG = {
  high:   { label: '⚔️ Boss Fight',   icon: Swords,  color: 'text-rose-400',   bg: 'bg-rose-500/10',   border: 'border-rose-500/20' },
  medium: { label: '🛡️ Bounty Hunt', icon: Shield,  color: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/20' },
  low:    { label: '📜 Side Quest',   icon: Scroll,  color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
};

const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center py-16 gap-5 text-center"
  >
    {/* Animated icon */}
    <motion.div
      className="relative"
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-brand-purple/20 to-brand-pink/10 border border-brand-purple/20 flex items-center justify-center">
        <Scroll className="w-9 h-9 text-brand-purple/60" />
      </div>
      <motion.div
        className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-brand-gold/20 border border-brand-gold/30 flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      >
        <Sparkles className="w-3 h-3 text-brand-gold" />
      </motion.div>
    </motion.div>

    <div>
      <h4 className="text-base font-bold app-text mb-1">Quest Log Empty</h4>
      <p className="text-sm app-text-secondary max-w-xs mx-auto leading-relaxed">
        No daily quests for today. Create a new quest to start earning XP and leveling up!
      </p>
    </div>

    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-purple/10 border border-brand-purple/20">
      <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
      <span className="text-xs font-semibold text-brand-purple">Click "New Quest" above to begin</span>
    </div>
  </motion.div>
);

export default function QuestList({ tasks }) {
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const [filter, setFilter] = useState('all');

  const dailyQuests  = tasks.filter(task => task.dueDate === todayStr);
  const pending      = dailyQuests.filter(q => q.status === 'pending');
  const completed    = dailyQuests.filter(q => q.status === 'done');

  const filtered = filter === 'all'     ? dailyQuests
                 : filter === 'pending' ? pending
                 :                        completed;

  const completedPct = dailyQuests.length > 0
    ? Math.round((completed.length / dailyQuests.length) * 100)
    : 0;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h3 className="font-game text-sm font-bold uppercase tracking-wider app-text-muted flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
          >
            <Trophy className="w-4 h-4 text-brand-gold" />
          </motion.div>
          <span className="app-text">Active Daily Quests</span>
        </h3>

        {/* Progress pill */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold"
            style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border-color)' }}>
            <span className="text-emerald-400">{completed.length}</span>
            <span className="app-text-muted">/</span>
            <span className="app-text">{dailyQuests.length}</span>
            <span className="app-text-muted ml-1">cleared</span>
          </div>
          {dailyQuests.length > 0 && (
            <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border-color)' }}>
              <motion.div
                className="h-full rounded-full bg-emerald-400"
                initial={{ width: 0 }}
                animate={{ width: `${completedPct}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      {dailyQuests.length > 0 && (
        <div className="flex gap-2">
          {[
            { key: 'all', label: 'All', count: dailyQuests.length },
            { key: 'pending', label: 'Active', count: pending.length },
            { key: 'done', label: 'Done', count: completed.length },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                filter === tab.key
                  ? 'bg-brand-purple text-white shadow-md'
                  : 'app-text-muted hover:app-text'
              }`}
              style={filter === tab.key ? { boxShadow: '0 0 12px rgba(139,92,246,0.3)' } : {}}
            >
              {tab.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-lg font-mono ${
                filter === tab.key ? 'bg-white/20 text-white' : 'bg-slate-700/30 app-text-muted'
              }`}>{tab.count}</span>
            </button>
          ))}
        </div>
      )}

      {/* Quest cards */}
      {dailyQuests.length === 0 ? (
        <EmptyState />
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-10 app-text-muted text-sm"
        >
          No {filter === 'pending' ? 'active' : 'completed'} quests here.
        </motion.div>
      ) : (
        <motion.div
          className="space-y-3"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map(task => {
              const cfg = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
              return (
                <motion.div
                  key={task.id}
                  layout
                  variants={{
                    hidden: { opacity: 0, y: 16, scale: 0.97 },
                    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } },
                  }}
                  exit={{ opacity: 0, scale: 0.95, y: -8, transition: { duration: 0.2 } }}
                  className="relative group"
                >
                  {/* Priority tag */}
                  <div className={`absolute -top-2.5 left-5 z-10 px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest font-game ${cfg.bg} ${cfg.color} border ${cfg.border} shadow-sm`}>
                    {cfg.label}
                  </div>
                  <div className="pt-2">
                    <TaskCard task={task} />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* All done celebration */}
      <AnimatePresence>
        {dailyQuests.length > 0 && completed.length === dailyQuests.length && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl p-4 text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(5,150,105,0.05))',
              border: '1px solid rgba(16,185,129,0.3)',
            }}
          >
            <motion.p
              className="text-2xl mb-1"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 2 }}
            >
              🏆
            </motion.p>
            <p className="text-sm font-bold text-emerald-400 font-game uppercase tracking-wider">All Quests Conquered!</p>
            <p className="text-xs app-text-secondary mt-0.5">You are a true champion today.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
