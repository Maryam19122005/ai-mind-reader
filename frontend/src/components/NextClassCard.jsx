import React from 'react';
import { useScheduleStore } from '../store/useScheduleStore';
import { Clock, MapPin, User, BookOpen } from 'lucide-react';

export default function NextClassCard() {
  const getNextClass = useScheduleStore(s => s.getNextClass);
  const nextClass = getNextClass();

  if (!nextClass) {
    return (
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex items-center gap-3">
        <div className="p-2 rounded-xl bg-slate-900 text-slate-600">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Next Class</p>
          <p className="text-sm text-slate-400">No more classes today</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-4 border flex items-center gap-4 shadow-lg"
      style={{
        background: `${nextClass.color}10`,
        borderColor: `${nextClass.color}40`,
        boxShadow: `0 0 15px ${nextClass.color}15`,
      }}
    >
      {/* Color dot */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg flex-shrink-0"
        style={{ background: `${nextClass.color}30`, border: `2px solid ${nextClass.color}50` }}
      >
        <BookOpen className="w-5 h-5" style={{ color: nextClass.color }} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">Next Class</p>
        <h4 className="text-sm font-bold text-slate-100 truncate">{nextClass.subject}</h4>

        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5">
          <span className="flex items-center gap-1 text-[10px] text-slate-400">
            <Clock className="w-3 h-3" />
            {nextClass.startTime} – {nextClass.endTime}
          </span>
          {nextClass.room && (
            <span className="flex items-center gap-1 text-[10px] text-slate-400">
              <MapPin className="w-3 h-3" />
              {nextClass.room}
            </span>
          )}
          {nextClass.instructor && (
            <span className="flex items-center gap-1 text-[10px] text-slate-400">
              <User className="w-3 h-3" />
              {nextClass.instructor}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
