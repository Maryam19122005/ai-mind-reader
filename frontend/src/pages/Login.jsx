import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, User, Sun, Moon } from 'lucide-react';
import toast from 'react-hot-toast';

const floatVariant = {
  animate: {
    y: [0, -12, 0],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
  },
};

export default function Login() {
  const [name, setName]       = useState('');
  const login                 = useAuthStore(s => s.login);
  const { theme, toggleTheme }= useThemeStore();
  const navigate              = useNavigate();
  const isDark                = theme === 'dark';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) { toast.error('Please enter your Hero Name!'); return; }
    login(name.trim());
    toast.success(`⚔️ Welcome, ${name.trim()}! Your quest begins now.`);
    navigate('/');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 relative overflow-hidden"
         style={{ background: isDark
           ? 'radial-gradient(ellipse at 30% 30%, rgba(139,92,246,0.12) 0%, #020617 60%)'
           : 'radial-gradient(ellipse at 30% 30%, rgba(139,92,246,0.10) 0%, #eef1ff 60%)'
         }}>

      {/* Animated orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div animate={{ x: [0,30,0], y: [0,-40,0] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute w-96 h-96 rounded-full blur-3xl opacity-20 -top-20 -left-20 ${isDark ? 'bg-brand-purple' : 'bg-indigo-300'}`} />
        <motion.div animate={{ x: [0,-25,0], y: [0,35,0] }} transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute w-80 h-80 rounded-full blur-3xl opacity-15 bottom-0 right-0 ${isDark ? 'bg-brand-pink' : 'bg-pink-200'}`} />
        <motion.div animate={{ x: [0,15,0], y: [0,20,0] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute w-64 h-64 rounded-full blur-3xl opacity-10 top-1/2 left-1/2 ${isDark ? 'bg-brand-indigo' : 'bg-violet-200'}`} />
      </div>

      {/* Theme toggle top-right */}
      <button
        onClick={toggleTheme}
        className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
          isDark
            ? 'border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
            : 'border-indigo-400/30 bg-white/70 text-indigo-600 hover:bg-white'
        }`}
      >
        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>

      {/* Card */}
      <motion.div
        className="w-full max-w-md glass-panel rounded-3xl p-8 shadow-2xl relative z-10"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            variants={floatVariant}
            animate="animate"
            className="inline-flex rounded-2xl bg-gradient-to-tr from-brand-purple to-brand-pink p-4 shadow-[0_0_24px_rgba(139,92,246,0.4)] mb-4"
          >
            <BookOpen className="w-9 h-9 text-white" />
          </motion.div>

          <motion.h1
            className="font-game text-3xl font-black uppercase tracking-wider bg-gradient-to-r from-brand-purple to-brand-pink bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            StudyFlow
          </motion.h1>
          <motion.p
            className="text-xs mt-2 uppercase tracking-widest font-game app-text-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            Productivity RPG · Quest Log
          </motion.p>
        </div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <div>
            <label htmlFor="hero-name" className="block text-xs font-bold uppercase tracking-wider app-text-muted mb-2 font-game">
              Your Hero Name
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 app-text-muted">
                <User className="w-4 h-4" />
              </span>
              <input
                id="hero-name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter your name..."
                className="w-full rounded-2xl border pl-11 pr-4 py-3.5 text-sm focus:border-brand-purple focus:ring-1 focus:ring-brand-purple focus:outline-none transition-all"
                style={{
                  background: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  borderColor: 'var(--border-strong)',
                }}
                maxLength={20}
                required
              />
            </div>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-4 rounded-2xl font-game text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-brand-purple to-brand-indigo hover:from-brand-indigo hover:to-brand-purple shadow-lg hover:shadow-brand-purple/30 transition-all duration-300 border border-brand-purple/20"
          >
            ⚔️ Enter Portal & Begin Quest
          </motion.button>
        </motion.form>

        {/* Footer */}
        <motion.div
          className="mt-6 text-center border-t pt-4"
          style={{ borderColor: 'var(--border-color)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-center gap-2 app-text-muted text-[10px] font-mono">
            <Sparkles className="w-3 h-3 text-brand-purple" />
            <span>XP · Levels · Streaks · Badges</span>
            <Sparkles className="w-3 h-3 text-brand-pink" />
          </div>
          <p className="text-[10px] app-text-muted mt-1.5 font-mono">
            {isDark ? '🌙 Dark Mode Active' : '☀️ Light Mode Active'} · No account needed
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
