import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskStore } from '../store/useTaskStore';
import { parseTask } from '../api/taskApi';
import { format } from 'date-fns';
import { X, Sparkles, Plus, ClipboardList, PenTool, Edit3, Wand2 } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * TaskForm — supports both Add (no editTask prop) and Edit modes (editTask prop provided).
 */
export default function TaskForm({ isOpen, onClose, editTask = null }) {
  const { addTask, editTask: storeEditTask } = useTaskStore();
  const isEditing = Boolean(editTask);

  const [activeTab, setActiveTab] = useState('manual');

  // Form fields
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [dueDate, setDueDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [priority, setPriority] = useState('medium');

  // AI parser
  const [aiText, setAiText] = useState('');
  const [isParsing, setIsParsing] = useState(false);

  // Populate form when opening in edit mode
  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title || '');
      setSubject(editTask.subject || '');
      setDueDate(editTask.dueDate || format(new Date(), 'yyyy-MM-dd'));
      setPriority(editTask.priority || 'medium');
    } else {
      setTitle('');
      setSubject('');
      setDueDate(format(new Date(), 'yyyy-MM-dd'));
      setPriority('medium');
    }
    setAiText('');
    setActiveTab('manual');
  }, [editTask, isOpen]);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) { toast.error('Quest title is required!'); return; }

    const data = {
      title: title.trim(),
      subject: subject.trim() || 'General',
      dueDate,
      priority,
    };

    if (isEditing) {
      storeEditTask(editTask.id, data);
    } else {
      addTask(data);
    }
    onClose();
  };

  const handleAiParse = async () => {
    if (!aiText.trim()) { toast.error('Please enter some text for the AI scribe.'); return; }

    setIsParsing(true);
    const loadingToast = toast.loading('AI Scribe is parsing the scroll...');
    try {
      const parsed = await parseTask(aiText);
      setTitle(parsed.title || '');
      setSubject(parsed.subject || 'General');
      setDueDate(parsed.dueDate || format(new Date(), 'yyyy-MM-dd'));
      setPriority(parsed.priority || 'medium');
      toast.dismiss(loadingToast);
      toast.success('Scroll parsed! Review and publish.');
      setActiveTab('manual');
    } catch {
      toast.dismiss(loadingToast);
      toast.error('AI Scribe failed to parse the text.');
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <AnimatePresence>
    {isOpen && (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl relative overflow-hidden"
        initial={{ opacity: 0, scale: 0.94, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28, duration: 0.35 }}
      >

        {/* Glows */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-brand-purple/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-brand-pink/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-900">
          <h3 className="text-lg font-black uppercase tracking-wider font-game bg-gradient-to-r from-brand-purple to-brand-pink bg-clip-text text-transparent flex items-center gap-2">
            {isEditing ? <Edit3 className="w-5 h-5 text-brand-purple" /> : <Plus className="w-5 h-5 text-brand-purple" />}
            <span>{isEditing ? 'Edit Quest' : 'Create New Quest'}</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-900 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs — only show AI tab when adding */}
        {!isEditing && (
          <div className="flex bg-slate-900/60 p-1 rounded-xl mb-6 border border-slate-800">
            <button
              onClick={() => setActiveTab('manual')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'manual' ? 'bg-brand-purple text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              <PenTool className="w-4 h-4" /><span>Manual</span>
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'ai' ? 'bg-gradient-to-r from-brand-purple to-brand-pink text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              <Sparkles className="w-4 h-4" /><span>AI Parser</span>
            </button>
          </div>
        )}

        {/* AI Tab */}
        {activeTab === 'ai' && !isEditing ? (
          <div className="space-y-4 relative">
            {/* ── Loading overlay ── */}
            <AnimatePresence>
              {isParsing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 rounded-2xl"
                  style={{ background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(6px)' }}
                >
                  {/* Spinning ring */}
                  <div className="relative w-14 h-14">
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-brand-purple/20"
                    />
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-purple"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                    />
                    <motion.div
                      className="absolute inset-2 rounded-full border border-transparent border-t-brand-pink"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Wand2 className="w-5 h-5 text-brand-purple" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-black font-game text-white uppercase tracking-wider">AI Scribe at work</p>
                    <div className="flex items-center justify-center gap-1 mt-1.5">
                      {[0,1,2].map(i => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-brand-purple"
                          animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2 }}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Parsing your scroll with Gemini...</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Describe your task</label>
              <textarea
                value={aiText}
                onChange={e => setAiText(e.target.value)}
                placeholder="E.g., Finish biology lab by tomorrow and make it high priority"
                rows="4"
                disabled={isParsing}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:border-brand-purple focus:outline-none resize-none disabled:opacity-40"
              />
            </div>
            <motion.button
              onClick={handleAiParse}
              disabled={isParsing}
              whileHover={!isParsing ? { scale: 1.02 } : {}}
              whileTap={!isParsing ? { scale: 0.97 } : {}}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-game text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-brand-purple to-brand-pink transition-all disabled:opacity-40"
            >
              <Sparkles className="w-4 h-4" />
              <span>Cast Parsing Spell</span>
            </motion.button>
          </div>
        ) : (
          /* Manual / Edit Form */
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <label htmlFor="task-title" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Quest Title</label>
              <input
                id="task-title"
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="E.g., Read history chapter 4"
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-brand-purple focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="task-subject" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Subject</label>
                <input
                  id="task-subject"
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="E.g., Biology"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-brand-purple focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="task-due" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Due Date</label>
                <input
                  id="task-due"
                  type="date"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 focus:border-brand-purple focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Quest Difficulty</label>
              <div className="grid grid-cols-3 gap-3">
                {['low', 'medium', 'high'].map(lvl => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setPriority(lvl)}
                    className={`py-2 px-3 text-xs font-bold uppercase tracking-wider rounded-xl border transition-all ${
                      priority === lvl
                        ? lvl === 'high'
                          ? 'bg-rose-500/15 text-rose-400 border-rose-500/50'
                          : lvl === 'medium'
                            ? 'bg-amber-500/15 text-amber-400 border-amber-500/50'
                            : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/50'
                        : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-game text-xs font-black uppercase tracking-wider text-white bg-brand-purple hover:bg-brand-purple/90 shadow-lg transition-all"
              >
                <ClipboardList className="w-4 h-4" />
                <span>{isEditing ? 'Save Changes' : 'Publish Quest'}</span>
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </motion.div>
    )}
    </AnimatePresence>
  );
}
