import React, { useState } from 'react';
import { useScheduleStore, SCHEDULE_DAYS, CLASS_COLORS } from '../store/useScheduleStore';
import { X, Plus, Clock, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ScheduleForm({ isOpen, onClose, editingClass = null }) {
  const { addClass, editClass } = useScheduleStore();

  const [subject, setSubject] = useState(editingClass?.subject || '');
  const [day, setDay] = useState(editingClass?.day || 'Monday');
  const [startTime, setStartTime] = useState(editingClass?.startTime || '08:00');
  const [endTime, setEndTime] = useState(editingClass?.endTime || '09:00');
  const [room, setRoom] = useState(editingClass?.room || '');
  const [instructor, setInstructor] = useState(editingClass?.instructor || '');
  const [color, setColor] = useState(editingClass?.color || CLASS_COLORS[0]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim()) { toast.error('Subject name is required!'); return; }
    if (startTime >= endTime) { toast.error('End time must be after start time!'); return; }

    const data = { subject: subject.trim(), day, startTime, endTime, room: room.trim(), instructor: instructor.trim(), color };

    if (editingClass) {
      editClass(editingClass.id, data);
    } else {
      addClass(data);
      toast.success('Class added to schedule! 📅');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-900">
          <h3 className="text-base font-black uppercase tracking-wider font-game text-brand-purple flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            {editingClass ? 'Edit Class' : 'Add Class'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-900 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Subject */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Subject Name</label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="E.g., Advanced Mathematics"
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-brand-purple focus:outline-none"
              required
            />
          </div>

          {/* Day */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Day</label>
            <select
              value={day}
              onChange={e => setDay(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 focus:border-brand-purple focus:outline-none"
            >
              {SCHEDULE_DAYS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 focus:border-brand-purple focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 focus:border-brand-purple focus:outline-none"
              />
            </div>
          </div>

          {/* Room and Instructor */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Room (optional)</label>
              <input
                type="text"
                value={room}
                onChange={e => setRoom(e.target.value)}
                placeholder="E.g., B-204"
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-brand-purple focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Instructor (optional)</label>
              <input
                type="text"
                value={instructor}
                onChange={e => setInstructor(e.target.value)}
                placeholder="E.g., Mr. Khan"
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-brand-purple focus:outline-none"
              />
            </div>
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Subject Color</label>
            <div className="flex gap-2 flex-wrap">
              {CLASS_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="w-8 h-8 rounded-full transition-transform hover:scale-110 focus:outline-none"
                  style={{
                    background: c,
                    boxShadow: color === c ? `0 0 0 3px #0f172a, 0 0 0 5px ${c}` : 'none',
                  }}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-game text-xs font-black uppercase tracking-wider text-white bg-brand-purple hover:bg-brand-purple/90 shadow-lg transition-all mt-2"
          >
            <Plus className="w-4 h-4" />
            {editingClass ? 'Save Changes' : 'Add to Schedule'}
          </button>
        </form>
      </div>
    </div>
  );
}
