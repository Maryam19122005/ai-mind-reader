import React from 'react';
import Navbar from '../components/Navbar';
import TimerRing from '../components/TimerRing';
import { useTimerStore } from '../store/useTimerStore';
import { useGameStore } from '../store/useGameStore';
import { Play, Pause, RotateCcw, Coffee, Sword } from 'lucide-react';

export default function Timer() {
  const {
    mode, timeLeft, isRunning, sessionCount,
    start, pause, reset, switchMode,
    WORK_DURATION, BREAK_DURATION,
  } = useTimerStore();
  const { xp, level } = useGameStore();

  const totalTime = mode === 'work' ? WORK_DURATION : BREAK_DURATION;
  const progress = timeLeft / totalTime;

  const tips = [
    'Focus on one task at a time for maximum XP.',
    'Close social media tabs before starting.',
    'Keep water nearby — hydration boosts brainpower.',
    'Take notes during your session for better retention.',
    'Set a specific mini-goal before each Boss Battle.',
  ];
  const tip = tips[sessionCount % tips.length];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 md:px-8 flex flex-col items-center gap-8">

        {/* Title */}
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-black text-slate-100 uppercase tracking-wide flex items-center justify-center gap-2">
            <Sword className="w-8 h-8 text-brand-purple" />
            <span>Boss Battle Timer</span>
          </h2>
          <p className="text-slate-400 text-sm mt-1">25 min focus sessions. Defeat distraction. Earn XP.</p>
        </div>

        {/* Mode Toggle */}
        <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800 w-full max-w-xs">
          <button
            onClick={() => switchMode('work')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
              mode === 'work'
                ? 'bg-brand-purple text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sword className="w-4 h-4" />
            Boss Battle
          </button>
          <button
            onClick={() => switchMode('break')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
              mode === 'break'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Coffee className="w-4 h-4" />
            Rest Phase
          </button>
        </div>

        {/* Timer Ring */}
        <div className={`rounded-full p-6 transition-all duration-500 ${
          mode === 'work'
            ? 'shadow-[0_0_80px_rgba(139,92,246,0.15)]'
            : 'shadow-[0_0_80px_rgba(16,185,129,0.15)]'
        }`}>
          <TimerRing
            progress={progress}
            size={260}
            strokeWidth={16}
            mode={mode}
            timeLeft={timeLeft}
            totalTime={totalTime}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={reset}
            className="w-12 h-12 rounded-2xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-all"
            title="Reset"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={isRunning ? pause : start}
            className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-black shadow-2xl transition-all active:scale-95 ${
              isRunning
                ? 'bg-slate-700 border-2 border-slate-600 hover:bg-slate-600'
                : mode === 'work'
                  ? 'bg-brand-purple hover:bg-brand-purple/90 border-2 border-brand-purple/50 shadow-[0_0_30px_rgba(139,92,246,0.3)]'
                  : 'bg-emerald-600 hover:bg-emerald-500 border-2 border-emerald-600/50 shadow-[0_0_30px_rgba(16,185,129,0.3)]'
            }`}
          >
            {isRunning
              ? <Pause className="w-8 h-8" />
              : <Play className="w-8 h-8 ml-1" />}
          </button>

          {/* Spacer to balance layout */}
          <div className="w-12 h-12" />
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
          <div className="glass-panel rounded-2xl p-4 text-center border border-slate-800">
            <p className="text-2xl font-black font-game text-brand-purple">{sessionCount}</p>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-0.5 font-game">Sessions</p>
          </div>
          <div className="glass-panel rounded-2xl p-4 text-center border border-slate-800">
            <p className="text-2xl font-black font-game text-brand-gold gold-glow">{sessionCount * 5}</p>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-0.5 font-game">XP Earned</p>
          </div>
          <div className="glass-panel rounded-2xl p-4 text-center border border-slate-800">
            <p className="text-2xl font-black font-game text-emerald-400">{Math.round(sessionCount * 25)}</p>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-0.5 font-game">Mins Done</p>
          </div>
        </div>

        {/* Tip of the session */}
        <div className="glass-panel rounded-2xl px-5 py-4 border border-brand-purple/20 w-full max-w-sm text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-purple mb-1.5 font-game">
            💡 Scholar Tip
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">{tip}</p>
        </div>

      </main>
    </div>
  );
}
