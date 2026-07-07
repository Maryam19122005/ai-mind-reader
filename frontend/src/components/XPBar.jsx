import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { xpForLevel } from '../utils/gamification';
import { Zap } from 'lucide-react';

/* ─── XP Particle burst ─── */
function XPParticles({ show }) {
  if (!show) return null;
  const particles = Array.from({ length: 6 }, (_, i) => i);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      {particles.map(i => (
        <motion.div
          key={i}
          className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-brand-purple"
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: (Math.cos((i / particles.length) * 2 * Math.PI) * 30),
            y: (Math.sin((i / particles.length) * 2 * Math.PI) * 30),
            opacity: 0,
            scale: 0,
          }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.03 }}
        />
      ))}
    </div>
  );
}

export default function XPBar({ xp, level }) {
  const targetXP = xpForLevel(level);
  const percentage = Math.min(100, Math.max(0, (xp / targetXP) * 100));

  const [prevPct, setPrevPct] = useState(percentage);
  const [showBurst, setShowBurst] = useState(false);
  const [showXPPop, setShowXPPop] = useState(false);
  const [xpDelta, setXpDelta] = useState(0);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      setPrevPct(percentage);
      return;
    }
    if (percentage !== prevPct) {
      // Calculate how much XP was gained
      setXpDelta(Math.round(((percentage - prevPct) / 100) * targetXP));
      setShowBurst(true);
      setShowXPPop(true);
      setTimeout(() => setShowBurst(false), 600);
      setTimeout(() => setShowXPPop(false), 1400);
      setPrevPct(percentage);
    }
  }, [percentage]);

  return (
    <div className="w-full">
      {/* Label row */}
      <div className="flex justify-between items-center mb-1.5">
        <span className="font-game font-bold text-xs uppercase tracking-wider text-brand-purple flex items-center gap-1">
          <Zap className="w-3 h-3" />
          <span>Level</span>
          <motion.span
            key={level}
            className="text-brand-gold text-sm font-black"
            initial={{ scale: 1.6, color: '#fbbf24' }}
            animate={{ scale: 1, color: '#eab308' }}
            transition={{ type: 'spring', stiffness: 400, damping: 18, duration: 0.35 }}
            style={{ textShadow: '0 0 10px rgba(234,179,8,0.5)' }}
          >
            {level}
          </motion.span>
        </span>
        <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
          <motion.span
            key={xp}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {xp}
          </motion.span>
          <span style={{ color: 'var(--border-strong)' }}> / </span>
          {targetXP} XP
        </span>
      </div>

      {/* Bar track */}
      <div className="relative w-full h-3.5 rounded-full overflow-visible border"
        style={{ background: 'var(--border-color)', borderColor: 'var(--border-subtle)' }}>

        {/* Filled portion */}
        <motion.div
          className="absolute top-0 left-0 h-full rounded-full relative overflow-hidden"
          style={{
            background: 'linear-gradient(90deg, #8b5cf6, #6366f1, #ec4899)',
            boxShadow: '0 0 12px rgba(139,92,246,0.5)',
          }}
          initial={{ width: `${prevPct}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.7, ease: [0.22, 0.68, 0, 1.2] }}
        >
          {/* Moving shimmer */}
          <div className="absolute inset-0 animate-shimmer" />
          {/* Bright leading edge */}
          <div className="absolute right-0 top-0 h-full w-3 bg-white/30 blur-sm" />
        </motion.div>

        {/* Grid tick lines */}
        <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:10%_100%]" />
        </div>

        {/* XP pop-up label */}
        <AnimatePresence>
          {showXPPop && xpDelta > 0 && (
            <motion.div
              className="absolute -top-7 font-game font-black text-xs text-emerald-400 whitespace-nowrap"
              style={{ left: `${Math.min(percentage, 90)}%` }}
              initial={{ opacity: 0, y: 4, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              +{xpDelta} XP ⚡
            </motion.div>
          )}
        </AnimatePresence>

        {/* Particle burst at fill edge */}
        <div className="absolute top-0 h-full pointer-events-none"
          style={{ left: `${percentage}%` }}>
          <XPParticles show={showBurst} />
        </div>
      </div>

      {/* Percentage sub-label */}
      <div className="flex justify-end mt-1">
        <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
          {Math.round(percentage)}% to next level
        </span>
      </div>
    </div>
  );
}
