import React from 'react';

/**
 * SVG Circular progress ring for the Boss Battle Pomodoro timer.
 * Props: progress (0–1), size, strokeWidth, mode ('work'|'break')
 */
export default function TimerRing({ progress, size = 240, strokeWidth = 14, mode = 'work', timeLeft, totalTime }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - progress * circumference;

  const workGradientId = 'timerWorkGrad';
  const breakGradientId = 'timerBreakGrad';
  const activeGradientId = mode === 'work' ? workGradientId : breakGradientId;

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <defs>
          {/* Work gradient: purple → pink */}
          <linearGradient id={workGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          {/* Break gradient: green → teal */}
          <linearGradient id={breakGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
        </defs>

        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1e293b"
          strokeWidth={strokeWidth}
        />

        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${activeGradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.5s ease' }}
          filter={mode === 'work' ? 'drop-shadow(0 0 8px rgba(139,92,246,0.5))' : 'drop-shadow(0 0 8px rgba(16,185,129,0.5))'}
        />
      </svg>

      {/* Center content */}
      <div className="absolute flex flex-col items-center justify-center gap-1">
        <span className={`font-game text-4xl font-black tabular-nums ${mode === 'work' ? 'text-brand-purple' : 'text-emerald-400'}`}>
          {minutes}:{seconds}
        </span>
        <span className={`font-game text-[10px] font-bold uppercase tracking-widest ${mode === 'work' ? 'text-brand-pink' : 'text-emerald-500'}`}>
          {mode === 'work' ? '⚔️ Boss Battle' : '☕ Rest Phase'}
        </span>
      </div>
    </div>
  );
}
