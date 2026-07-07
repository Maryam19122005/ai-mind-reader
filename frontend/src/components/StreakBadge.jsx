import React from 'react';
import { Flame } from 'lucide-react';

export default function StreakBadge({ streak }) {
  const isActive = streak > 0;

  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 ${
      isActive 
        ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold animate-pulse-slow' 
        : 'bg-slate-800/40 border border-slate-700/50 text-slate-500'
    }`}>
      <Flame className={`w-5 h-5 transition-transform duration-500 ${
        isActive ? 'fill-amber-500 stroke-amber-600 scale-110 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)] animate-bounce' : 'text-slate-500'
      }`} style={{ animationDuration: '2s' }} />
      <span className="font-game text-sm font-black tracking-wide">
        {streak} {streak === 1 ? 'Day' : 'Days'}
      </span>
    </div>
  );
}
