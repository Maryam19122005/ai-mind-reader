import React from 'react';
import { BADGE_DEFINITIONS, RARITY_STYLES } from '../utils/badges';
import { useBadgeStore } from '../store/useBadgeStore';
import { format, parseISO } from 'date-fns';
import { Lock } from 'lucide-react';

export default function BadgeCard({ badge }) {
  const earnedBadgeIds = useBadgeStore(s => s.earnedBadgeIds);
  const isEarned = earnedBadgeIds.includes(badge.id);
  const styles = RARITY_STYLES[badge.rarity] || RARITY_STYLES.common;

  return (
    <div className={`relative rounded-2xl border p-4 transition-all duration-300 flex flex-col items-center text-center gap-2 ${
      isEarned
        ? `${styles.bg} ${styles.border} ${styles.glow}`
        : 'bg-slate-900/30 border-slate-800 opacity-50 grayscale'
    }`}>
      {/* Lock overlay for unearned */}
      {!isEarned && (
        <div className="absolute top-2 right-2">
          <Lock className="w-3.5 h-3.5 text-slate-600" />
        </div>
      )}

      {/* Rarity pip */}
      <span className={`absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${styles.badge}`}>
        {badge.rarity}
      </span>

      {/* Icon */}
      <div className={`text-4xl mt-3 leading-none ${isEarned ? '' : 'opacity-40'}`}>
        {badge.icon}
      </div>

      {/* Info */}
      <div>
        <h4 className={`text-sm font-bold tracking-wide ${isEarned ? 'text-slate-100' : 'text-slate-500'}`}>
          {badge.title}
        </h4>
        <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed max-w-[120px]">
          {badge.description}
        </p>
      </div>

      {/* Earned date */}
      {isEarned && (
        <p className="text-[9px] font-mono text-slate-600 mt-1">Unlocked</p>
      )}
    </div>
  );
}
