import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import Navbar from '../components/Navbar';
import QuestList from '../components/QuestList';
import TaskForm from '../components/TaskForm';
import NextClassCard from '../components/NextClassCard';
import { useAuthStore } from '../store/useAuthStore';
import { useGameStore } from '../store/useGameStore';
import { useTaskStore } from '../store/useTaskStore';
import { useBadgeStore } from '../store/useBadgeStore';
import { useThemeStore } from '../store/useThemeStore';
import { BADGE_DEFINITIONS } from '../utils/badges';
import { xpForLevel } from '../utils/gamification';
import {
  Plus, Flame, CheckCircle, Clock, Trophy,
  Timer, Sparkles, Star, Zap, Target, BookOpen,
  TrendingUp, Award, Swords, Shield, Scroll
} from 'lucide-react';

/* ─── Motivational quotes ─── */
const QUOTES = [
  { text: "Every quest completed is a step toward mastery.", author: "StudyFlow" },
  { text: "The warrior who studies conquers the world.", author: "Ancient Wisdom" },
  { text: "Level up your mind, level up your life.", author: "StudyFlow" },
  { text: "Today's grind is tomorrow's glory.", author: "Scholar's Code" },
  { text: "XP doesn't lie. Put in the work.", author: "StudyFlow" },
  { text: "Champions study even when no one is watching.", author: "Scholar's Code" },
  { text: "One quest at a time. One level at a time.", author: "StudyFlow" },
];

/* ─── Rank titles ─── */
const getRank = (level) => {
  if (level >= 20) return { title: 'Grand Archmage', color: '#f59e0b', icon: '👑' };
  if (level >= 15) return { title: 'Archmage', color: '#8b5cf6', icon: '🔮' };
  if (level >= 10) return { title: 'Sage', color: '#6366f1', icon: '📚' };
  if (level >= 7)  return { title: 'Scholar', color: '#10b981', icon: '🎓' };
  if (level >= 4)  return { title: 'Apprentice', color: '#06b6d4', icon: '⚡' };
  return                 { title: 'Recruit', color: '#94a3b8', icon: '🛡️' };
};

/* ─── Animated number counter ─── */
function AnimatedNumber({ value, className }) {
  const [displayed, setDisplayed] = useState(0);
  const prev = useRef(0);

  useEffect(() => {
    const start = prev.current;
    const end = value;
    const duration = 800;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(start + (end - start) * eased));
      if (progress < 1) requestAnimationFrame(animate);
      else prev.current = end;
    };
    requestAnimationFrame(animate);
  }, [value]);

  return <span className={className}>{displayed}</span>;
}

/* ─── Live Clock ─── */
function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const hours = time.getHours();
  const greeting = hours < 12 ? '🌅 Morning' : hours < 17 ? '☀️ Afternoon' : '🌙 Evening';
  const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="text-right">
      <p className="text-[10px] font-bold uppercase tracking-widest app-text-muted">{greeting}</p>
      <p className="text-2xl font-black font-game app-text tabular-nums">{timeStr}</p>
      <p className="text-xs app-text-secondary">{dateStr}</p>
    </div>
  );
}

/* ─── Radial Progress Ring ─── */
function ProgressRing({ pct, size = 80, stroke = 7, color = '#8b5cf6', label, value }) {
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none"
            stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
          <motion.circle cx={size / 2} cy={size / 2} r={radius} fill="none"
            stroke={color} strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.4, ease: [0.22, 0.68, 0, 1.2], delay: 0.5 }}
            style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm font-black font-game app-text">{value}</span>
          <span className="text-[8px] uppercase tracking-wider app-text-muted leading-tight">{pct}%</span>
        </div>
      </div>
      <span className="text-[9px] uppercase tracking-widest font-bold app-text-muted">{label}</span>
    </div>
  );
}

/* ─── Animated Background ─── */
const FloatingParticles = ({ isDark }) => (
  <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
    {/* Main orbs */}
    <div className={`orb-1 absolute w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.18] -top-32 -left-32
      ${isDark ? 'bg-brand-purple' : 'bg-violet-300'}`} />
    <div className={`orb-2 absolute w-[400px] h-[400px] rounded-full blur-[100px] opacity-[0.14] top-1/3 -right-20
      ${isDark ? 'bg-brand-pink' : 'bg-pink-200'}`} />
    <div className={`orb-3 absolute w-[300px] h-[300px] rounded-full blur-[80px] opacity-[0.1] bottom-10 left-1/4
      ${isDark ? 'bg-brand-indigo' : 'bg-blue-200'}`} />
    {/* Mini accent blobs */}
    <div className="absolute w-32 h-32 rounded-full blur-3xl opacity-[0.12] top-1/2 left-1/2 bg-amber-400 animate-float" />
    <div className="absolute w-20 h-20 rounded-full blur-2xl opacity-[0.1] bottom-1/3 right-1/4 bg-emerald-400 animate-float-slow" />
  </div>
);

/* ─── Stat Card ─── */
const StatCard = ({ icon: Icon, value, label, color, sub }) => (
  <motion.div
    variants={{ hidden: { opacity: 0, y: 20, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1 } }}
    whileHover={{ scale: 1.04, y: -2 }}
    className="glass-panel rounded-2xl p-4 flex flex-col items-center gap-2 cursor-default group"
    style={{ transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
  >
    <div className={`p-2.5 rounded-xl ${color} group-hover:scale-110 transition-transform`}>
      <Icon className="w-5 h-5" />
    </div>
    <AnimatedNumber value={typeof value === 'number' ? value : 0} className="text-2xl font-black font-game app-text" />
    <div className="text-center">
      <p className="text-[10px] uppercase font-bold tracking-wider app-text-muted leading-tight">{label}</p>
      {sub && <p className="text-[9px] app-text-muted opacity-70">{sub}</p>}
    </div>
  </motion.div>
);

/* ─── Quote Card ─── */
function QuoteCard() {
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * QUOTES.length));
  const [visible, setVisible] = useState(true);

  const cycle = () => {
    setVisible(false);
    setTimeout(() => {
      setIdx(i => (i + 1) % QUOTES.length);
      setVisible(true);
    }, 300);
  };

  useEffect(() => {
    const id = setInterval(cycle, 12000);
    return () => clearInterval(id);
  }, []);

  const q = QUOTES[idx];
  return (
    <motion.div
      className="glass-panel rounded-2xl p-4 border border-brand-purple/20 cursor-pointer hover:border-brand-purple/40 transition-colors"
      onClick={cycle}
      whileHover={{ scale: 1.01 }}
      title="Click for next quote"
    >
      <div className="flex items-start gap-3">
        <div className="p-1.5 rounded-lg bg-brand-purple/10 flex-shrink-0 mt-0.5">
          <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
        </div>
        <AnimatePresence mode="wait">
          {visible && (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.25 }}
            >
              <p className="text-xs font-semibold app-text italic leading-relaxed">"{q.text}"</p>
              <p className="text-[10px] app-text-muted mt-1 font-game">— {q.author}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ─── Streak Heatmap dots ─── */
function StreakDots({ streak }) {
  const dots = Array.from({ length: 7 }, (_, i) => i < streak ? 'active' : 'inactive');
  return (
    <div className="flex gap-1.5 mt-2">
      {dots.map((state, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.06, type: 'spring', stiffness: 400, damping: 20 }}
          className={`w-4 h-4 rounded-sm ${state === 'active'
            ? 'bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.6)]'
            : 'bg-slate-700/40'}`}
        />
      ))}
      {streak > 7 && (
        <span className="text-[10px] font-bold text-amber-400 self-center">+{streak - 7}</span>
      )}
    </div>
  );
}

/* ─── Main animation variants ─── */
const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 0.68, 0, 1.2] } },
};
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 280, damping: 24 } },
};

/* ══════════════════════════════════════════
   MAIN DASHBOARD
══════════════════════════════════════════ */
export default function Dashboard() {
  const { user } = useAuthStore();
  const { xp, level, streak } = useGameStore();
  const { tasks } = useTaskStore();
  const earnedBadgeIds = useBadgeStore(s => s.earnedBadgeIds);
  const { theme } = useThemeStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const isDark = theme === 'dark';

  const pendingCount   = tasks.filter(t => t.status === 'pending').length;
  const completedCount = tasks.filter(t => t.status === 'done').length;
  const totalTasks     = tasks.length;
  const totalXpNeeded  = xpForLevel(level);
  const xpPct          = Math.round((xp / totalXpNeeded) * 100);
  const completionPct  = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const rank = getRank(level);

  return (
    <div className="min-h-screen relative" style={{ background: 'var(--bg-base)' }}>
      <FloatingParticles isDark={isDark} />
      <Navbar />

      <motion.main
        className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 py-8 md:px-8"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        {/* ── TOP HEADER BAR ── */}
        <motion.div
          className="flex flex-col md:flex-row md:items-start md:justify-between mb-8 gap-4"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <div>
            <div className="flex items-center gap-3 mb-1">
              <motion.div
                animate={{ rotate: [0, 12, -12, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 5 }}
              >
                <Star className="w-7 h-7 text-brand-gold" style={{ filter: 'drop-shadow(0 0 8px rgba(234,179,8,0.5))' }} />
              </motion.div>
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wide app-text">
                Adventurer's Log
              </h1>
            </div>
            <p className="text-sm app-text-secondary ml-10">
              Welcome back, <span className="text-brand-purple font-bold">{user?.name || 'Hero'}</span>!{' '}
              <span className="app-text-muted">Ready to conquer today's quests?</span>
            </p>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <LiveClock />
            <motion.button
              onClick={() => setIsFormOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 bg-gradient-to-r from-brand-purple to-brand-indigo text-white font-game text-xs font-black uppercase tracking-wider py-3 px-6 rounded-2xl shadow-lg border border-brand-purple/30"
              style={{ boxShadow: '0 0 20px rgba(139,92,246,0.35)' }}
            >
              <Plus className="w-4 h-4" />
              <span>New Quest</span>
            </motion.button>
          </div>
        </motion.div>

        {/* ── MAIN GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ══ LEFT COLUMN: CHARACTER SHEET ══ */}
          <motion.div
            className="lg:col-span-1 space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >

            {/* ─ Profile Card ─ */}
            <motion.div
              variants={cardVariants}
              className="glass-panel rounded-3xl p-6 relative overflow-hidden"
            >
              {/* Background glyph */}
              <div className="absolute top-0 right-0 p-5 opacity-[0.04] pointer-events-none select-none">
                <Sparkles className="w-32 h-32 text-brand-purple" />
              </div>

              {/* Shimmer on hover */}
              <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                <div className="absolute inset-0 animate-shimmer rounded-3xl" />
              </div>

              <p className="font-game text-[10px] font-bold uppercase tracking-widest app-text-muted mb-5 flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-brand-purple" /> Character Profile
              </p>

              {/* Avatar + name */}
              <div className="flex items-center gap-4 mb-5">
                <motion.div
                  className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-purple/30 to-brand-pink/30 border-2 border-brand-purple/30 flex items-center justify-center shadow-inner flex-shrink-0"
                  whileHover={{ rotate: [0, -6, 6, 0], transition: { duration: 0.5 } }}
                >
                  {/* Pulsing ring */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-brand-purple/40"
                    animate={{ scale: [1, 1.15, 1], opacity: [0.7, 0, 0.7] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  />
                  <span className="font-game text-2xl font-black text-brand-purple z-10">
                    {user?.name ? user.name.slice(0, 2).toUpperCase() : 'PL'}
                  </span>
                </motion.div>

                <div className="flex-1 min-w-0">
                  <p className="text-lg font-bold app-text truncate">{user?.name || 'Hero'}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-sm">{rank.icon}</span>
                    <span
                      className="text-[10px] uppercase tracking-widest font-bold font-game"
                      style={{ color: rank.color }}
                    >
                      {rank.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-1.5">
                    {[...Array(Math.min(level, 5))].map((_, i) => (
                      <motion.div key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 * i }}>
                        <Star className="w-3 h-3 text-brand-gold fill-brand-gold" />
                      </motion.div>
                    ))}
                    {level > 5 && <span className="text-[9px] text-brand-gold font-bold ml-0.5">+{level - 5}</span>}
                  </div>
                </div>
              </div>

              {/* XP Bar */}
              <div className="pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-game font-bold app-text-muted text-[10px] uppercase tracking-wider flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-brand-purple" /> Level {level} Progress
                  </span>
                  <motion.span
                    className="font-mono text-brand-purple font-bold text-xs"
                    key={xpPct}
                    initial={{ scale: 1.3, color: '#a78bfa' }}
                    animate={{ scale: 1, color: '#8b5cf6' }}
                    transition={{ duration: 0.4 }}
                  >
                    {xpPct}%
                  </motion.span>
                </div>
                <div className="w-full h-3 rounded-full overflow-hidden relative" style={{ background: 'var(--border-color)' }}>
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-brand-purple to-brand-pink relative overflow-hidden"
                    initial={{ width: 0 }}
                    animate={{ width: `${xpPct}%` }}
                    transition={{ duration: 1.3, ease: [0.22, 0.68, 0, 1.2], delay: 0.4 }}
                    style={{ boxShadow: '0 0 12px rgba(139,92,246,0.5)' }}
                  >
                    {/* Shimmer on bar */}
                    <div className="absolute inset-0 animate-shimmer" />
                  </motion.div>
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-[10px] font-game font-bold text-brand-purple">LVL {level}</span>
                  <span className="text-[10px] font-mono app-text-muted">
                    <AnimatedNumber value={xp} /> / {totalXpNeeded} XP
                  </span>
                </div>
              </div>

              {/* Stats grid */}
              <motion.div
                className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t"
                style={{ borderColor: 'var(--border-color)' }}
                variants={containerVariants}
              >
                <StatCard icon={CheckCircle} value={completedCount} label="Cleared" color="bg-emerald-500/10 text-emerald-400" />
                <StatCard icon={Clock} value={pendingCount} label="Pending" color="bg-indigo-500/10 text-indigo-400" />
                <StatCard icon={Target} value={totalTasks} label="Total" color="bg-brand-purple/10 text-brand-purple" />
              </motion.div>
            </motion.div>

            {/* ─ Streak Card ─ */}
            <motion.div
              variants={cardVariants}
              className="rounded-3xl p-5 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(249,115,22,0.06))',
                border: '1px solid rgba(245,158,11,0.25)',
              }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-game text-[10px] font-bold uppercase tracking-widest text-amber-500 mb-1">
                    🔥 Activity Streak
                  </p>
                  <div className="flex items-baseline gap-2">
                    <motion.span
                      className="text-4xl font-black font-game app-text"
                      key={streak}
                      initial={{ scale: 1.4, color: '#f59e0b' }}
                      animate={{ scale: 1, color: 'var(--text-primary)' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    >
                      {streak}
                    </motion.span>
                    <span className="text-sm app-text-secondary font-medium">days</span>
                  </div>
                  <StreakDots streak={Math.min(streak, 7)} />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5 }}
                  className="p-3 bg-amber-500/15 rounded-2xl"
                >
                  <Flame className="w-10 h-10 text-amber-400 fill-amber-500"
                    style={{ filter: 'drop-shadow(0 0 8px rgba(245,158,11,0.6))' }} />
                </motion.div>
              </div>
            </motion.div>

            {/* ─ Progress Ring ─ */}
            <motion.div
              variants={cardVariants}
              className="glass-panel rounded-3xl p-5"
            >
              <p className="font-game text-[10px] font-bold uppercase tracking-widest app-text-muted mb-4 flex items-center gap-1.5">
                <Target className="w-3 h-3 text-brand-indigo" /> Progress Overview
              </p>
              <div className="flex items-center justify-around">
                <ProgressRing
                  pct={completionPct}
                  size={86}
                  stroke={7}
                  color="#10b981"
                  label="Tasks Done"
                  value={`${completedCount}`}
                />
                <ProgressRing
                  pct={xpPct}
                  size={86}
                  stroke={7}
                  color="#8b5cf6"
                  label="XP Level"
                  value={`${level}`}
                />
                <ProgressRing
                  pct={earnedBadgeIds.length > 0 ? Math.round((earnedBadgeIds.length / BADGE_DEFINITIONS.length) * 100) : 0}
                  size={86}
                  stroke={7}
                  color="#f59e0b"
                  label="Badges"
                  value={`${earnedBadgeIds.length}`}
                />
              </div>
            </motion.div>

            {/* ─ Motivation Quote ─ */}
            <motion.div variants={cardVariants}>
              <QuoteCard />
            </motion.div>

            {/* ─ Next Class ─ */}
            <motion.div variants={cardVariants}>
              <NextClassCard />
            </motion.div>

            {/* ─ Quick-link buttons ─ */}
            <motion.div variants={cardVariants} className="grid grid-cols-2 gap-3">
              <Link to="/achievements"
                className="glass-panel rounded-2xl p-4 flex flex-col items-center gap-2 border border-brand-gold/20 hover:border-brand-gold/50 hover:scale-105 transition-all group relative overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'radial-gradient(circle at center, rgba(234,179,8,0.05), transparent)' }} />
                <motion.div whileHover={{ rotate: 20, scale: 1.2 }} transition={{ type: 'spring' }}>
                  <Trophy className="w-6 h-6 text-brand-gold" style={{ filter: 'drop-shadow(0 0 6px rgba(234,179,8,0.4))' }} />
                </motion.div>
                <div className="text-center z-10">
                  <p className="text-xs font-black font-game app-text">{earnedBadgeIds.length}/{BADGE_DEFINITIONS.length}</p>
                  <p className="text-[10px] uppercase tracking-wider app-text-muted">Badges</p>
                </div>
              </Link>

              <Link to="/timer"
                className="glass-panel rounded-2xl p-4 flex flex-col items-center gap-2 border border-brand-purple/20 hover:border-brand-purple/50 hover:scale-105 transition-all group relative overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'radial-gradient(circle at center, rgba(139,92,246,0.05), transparent)' }} />
                <motion.div whileHover={{ rotate: -20, scale: 1.2 }} transition={{ type: 'spring' }}>
                  <Swords className="w-6 h-6 text-brand-purple" style={{ filter: 'drop-shadow(0 0 6px rgba(139,92,246,0.4))' }} />
                </motion.div>
                <div className="text-center z-10">
                  <p className="text-xs font-black font-game app-text">⚔️ Start</p>
                  <p className="text-[10px] uppercase tracking-wider app-text-muted">Boss Battle</p>
                </div>
              </Link>
            </motion.div>
          </motion.div>

          {/* ══ RIGHT COLUMN: QUESTS ══ */}
          <motion.div
            className="lg:col-span-2 space-y-4"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            {/* Daily summary banner */}
            <motion.div
              className="rounded-2xl p-4 flex items-center gap-4 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(99,102,241,0.08) 50%, rgba(236,72,153,0.06) 100%)',
                border: '1px solid rgba(139,92,246,0.2)',
              }}
            >
              {/* Animated glow line at top */}
              <motion.div
                className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-brand-purple via-brand-pink to-transparent"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.5, delay: 0.3 }}
              />

              <div className="p-3 rounded-xl bg-brand-purple/10 flex-shrink-0">
                <Scroll className="w-6 h-6 text-brand-purple" />
              </div>

              <div className="flex-1">
                <p className="font-game text-[10px] font-bold uppercase tracking-widest text-brand-purple mb-0.5">
                  Today's Mission Brief
                </p>
                <p className="text-sm font-semibold app-text">
                  {completedCount === 0 && pendingCount === 0
                    ? "No quests assigned — create one to begin your journey!"
                    : completedCount === pendingCount + completedCount
                      ? "🎉 All quests conquered! You're unstoppable!"
                      : `${pendingCount} quest${pendingCount !== 1 ? 's' : ''} remaining — keep pushing!`}
                </p>
              </div>

              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="text-center">
                  <p className="text-2xl font-black font-game text-emerald-400">
                    <AnimatedNumber value={completedCount} />
                  </p>
                  <p className="text-[9px] uppercase tracking-wider app-text-muted">done</p>
                </div>
                <div className="w-px h-10" style={{ background: 'var(--border-color)' }} />
                <div className="text-center">
                  <p className="text-2xl font-black font-game app-text">
                    <AnimatedNumber value={totalTasks} />
                  </p>
                  <p className="text-[9px] uppercase tracking-wider app-text-muted">total</p>
                </div>
              </div>
            </motion.div>

            {/* Quest list panel */}
            <div className="glass-panel rounded-3xl p-6">
              <QuestList tasks={tasks} />
            </div>
          </motion.div>
        </div>
      </motion.main>

      {/* Task Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <TaskForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
