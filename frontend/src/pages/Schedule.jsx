import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import ScheduleForm from '../components/ScheduleForm';
import { useScheduleStore, SCHEDULE_DAYS } from '../store/useScheduleStore';
import { CalendarDays, Plus, Trash2, Edit3, Clock } from 'lucide-react';

// Time slots for the grid (7 AM to 9 PM)
const TIME_SLOTS = [];
for (let h = 7; h <= 21; h++) {
  TIME_SLOTS.push(`${h.toString().padStart(2, '0')}:00`);
}

function timeToMinutes(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

export default function Schedule() {
  const { classes, deleteClass } = useScheduleStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);

  const openEdit = (cls) => { setEditingClass(cls); setIsFormOpen(true); };
  const handleClose = () => { setIsFormOpen(false); setEditingClass(null); };

  const getClassesForDay = (day) =>
    classes
      .filter(c => c.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 md:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-100 uppercase tracking-wide flex items-center gap-2">
              <CalendarDays className="w-8 h-8 text-brand-purple" />
              <span>Class Schedule</span>
            </h2>
            <p className="text-slate-400 text-sm mt-1">Your weekly timetable — color-coded by subject.</p>
          </div>
          <button
            onClick={() => { setEditingClass(null); setIsFormOpen(true); }}
            className="flex items-center gap-2 bg-gradient-to-r from-brand-purple to-brand-indigo text-white font-game text-xs font-black uppercase tracking-wider py-3 px-6 rounded-2xl shadow-lg transition-all border border-brand-purple/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Class</span>
          </button>
        </div>

        {classes.length === 0 ? (
          <div className="glass-panel border-dashed border-slate-800 rounded-3xl p-16 text-center flex flex-col items-center gap-4">
            <div className="p-4 rounded-full bg-slate-900 border border-slate-800">
              <CalendarDays className="w-10 h-10 text-slate-600" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-300">No classes yet</h4>
              <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto">
                Click "Add Class" to start building your weekly schedule.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Weekly Grid — desktop */}
            <div className="hidden lg:block glass-panel rounded-3xl overflow-hidden">
              {/* Header row */}
              <div className="grid border-b border-slate-800" style={{ gridTemplateColumns: '70px repeat(7, 1fr)' }}>
                <div className="p-3 border-r border-slate-800" />
                {SCHEDULE_DAYS.map(day => (
                  <div key={day} className="p-3 text-center border-r border-slate-800 last:border-r-0">
                    <p className="text-xs font-black uppercase tracking-wider text-slate-400">{day.slice(0, 3)}</p>
                  </div>
                ))}
              </div>

              {/* Time rows */}
              {TIME_SLOTS.map(slot => (
                <div key={slot} className="grid border-b border-slate-900/50 last:border-b-0" style={{ gridTemplateColumns: '70px repeat(7, 1fr)' }}>
                  <div className="p-2 border-r border-slate-800 flex items-start justify-end pr-3 pt-2">
                    <span className="text-[10px] font-mono text-slate-600">{slot}</span>
                  </div>
                  {SCHEDULE_DAYS.map(day => {
                    const dayClasses = getClassesForDay(day).filter(c => c.startTime === slot);
                    return (
                      <div key={day} className="border-r border-slate-900/40 last:border-r-0 p-1 min-h-[52px] relative">
                        {dayClasses.map(cls => (
                          <div
                            key={cls.id}
                            className="rounded-lg p-1.5 mb-1 text-[10px] font-bold leading-tight relative group cursor-pointer"
                            style={{
                              background: `${cls.color}20`,
                              border: `1px solid ${cls.color}50`,
                              color: cls.color,
                            }}
                          >
                            <p className="font-black truncate">{cls.subject}</p>
                            <p className="opacity-70 font-mono">{cls.startTime}–{cls.endTime}</p>
                            {cls.room && <p className="opacity-60">📍{cls.room}</p>}
                            {/* Hover actions */}
                            <div className="absolute top-1 right-1 hidden group-hover:flex gap-0.5">
                              <button onClick={() => openEdit(cls)} className="p-0.5 rounded bg-slate-900/80 hover:bg-slate-800">
                                <Edit3 className="w-2.5 h-2.5 text-slate-300" />
                              </button>
                              <button onClick={() => deleteClass(cls.id)} className="p-0.5 rounded bg-slate-900/80 hover:bg-slate-800">
                                <Trash2 className="w-2.5 h-2.5 text-rose-400" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Mobile: Day-by-day list */}
            <div className="lg:hidden space-y-4">
              {SCHEDULE_DAYS.map(day => {
                const dayClasses = getClassesForDay(day);
                if (dayClasses.length === 0) return null;
                return (
                  <div key={day} className="glass-panel rounded-2xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/40">
                      <h3 className="font-game text-xs font-black uppercase tracking-wider text-slate-300">{day}</h3>
                    </div>
                    <div className="p-3 space-y-2">
                      {dayClasses.map(cls => (
                        <div
                          key={cls.id}
                          className="rounded-xl p-3 flex items-center gap-3"
                          style={{ background: `${cls.color}15`, border: `1px solid ${cls.color}30` }}
                        >
                          <div className="w-2 h-10 rounded-full flex-shrink-0" style={{ background: cls.color }} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-100">{cls.subject}</p>
                            <p className="text-xs text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />{cls.startTime} – {cls.endTime}
                              {cls.room && <span>• {cls.room}</span>}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <button onClick={() => openEdit(cls)} className="p-1.5 rounded-lg text-slate-500 hover:text-brand-purple hover:bg-slate-900">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button onClick={() => deleteClass(cls.id)} className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-900">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>

      <ScheduleForm isOpen={isFormOpen} onClose={handleClose} editingClass={editingClass} />
    </div>
  );
}
