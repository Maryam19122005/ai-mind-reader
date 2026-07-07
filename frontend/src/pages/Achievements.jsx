import React from 'react';
import Navbar from '../components/Navbar';
import BadgeCard from '../components/BadgeCard';
import { BADGE_DEFINITIONS } from '../utils/badges';
import { useBadgeStore } from '../store/useBadgeStore';
import { Trophy, Lock } from 'lucide-react';

const RARITY_ORDER = { legendary: 0, rare: 1, uncommon: 2, common: 3 };

const sortedBadges = [...BADGE_DEFINITIONS].sort(
  (a, b) => RARITY_ORDER[a.rarity] - RARITY_ORDER[b.rarity]
);

export default function Achievements() {
  const earnedBadgeIds = useBadgeStore(s => s.earnedBadgeIds);
  const earned = earnedBadgeIds.length;
  const total = BADGE_DEFINITIONS.length;
  const pct = Math.round((earned / total) * 100);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 md:px-8">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-slate-100 uppercase tracking-wide flex items-center gap-2">
            <Trophy className="w-8 h-8 text-brand-gold" />
            <span>Achievements</span>
          </h2>
          <p className="text-slate-400 text-sm mt-1">Unlock badges by completing quests and hitting milestones.</p>
        </div>

        {/* Progress Summary Bar */}
        <div className="glass-panel rounded-3xl p-6 mb-8 flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="text-center sm:text-left">
            <p className="text-4xl font-black font-game text-brand-gold gold-glow">{earned}</p>
            <p className="text-xs uppercase tracking-widest text-slate-500 font-game mt-1">Badges Earned</p>
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-xs text-slate-400 mb-2">
              <span>{earned} / {total} unlocked</span>
              <span className="font-bold text-brand-purple">{pct}%</span>
            </div>
            <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-gold to-amber-400 shadow-[0_0_10px_rgba(234,179,8,0.4)] transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <Lock className="w-4 h-4" />
            <span>{total - earned} locked</span>
          </div>
        </div>

        {/* Badge Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {sortedBadges.map(badge => (
            <BadgeCard key={badge.id} badge={badge} />
          ))}
        </div>

      </main>
    </div>
  );
}
