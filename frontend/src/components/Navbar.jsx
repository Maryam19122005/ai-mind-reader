import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useGameStore } from '../store/useGameStore';
import { useThemeStore } from '../store/useThemeStore';
import XPBar from './XPBar';
import StreakBadge from './StreakBadge';
import {
  LogOut, BookOpen, LayoutDashboard, CheckSquare,
  Trophy, CalendarDays, Timer, Menu, X, Sun, Moon
} from 'lucide-react';

const NAV_LINKS = [
  { to: '/',             label: 'Dashboard',   icon: LayoutDashboard },
  { to: '/tasks',        label: 'Quests',       icon: CheckSquare },
  { to: '/schedule',     label: 'Schedule',     icon: CalendarDays },
  { to: '/timer',        label: 'Boss Battle',  icon: Timer },
  { to: '/achievements', label: 'Badges',       icon: Trophy },
];

export default function Navbar() {
  const { user, logout }        = useAuthStore();
  const { xp, level, streak }   = useGameStore();
  const { theme, toggleTheme }  = useThemeStore();
  const navigate                = useNavigate();
  const location                = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isDark = theme === 'dark';

  const handleLogout = () => { logout(); navigate('/login'); };
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 w-full border-b app-nav-bg"
         style={{ borderColor: 'var(--border-color)', boxShadow: 'var(--shadow-navbar)' }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">

        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
          <div className="rounded-lg bg-gradient-to-tr from-brand-purple to-brand-pink p-1.5 shadow-[0_0_12px_rgba(139,92,246,0.3)] transition-transform group-hover:scale-105">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="font-game text-lg font-black uppercase tracking-wider bg-gradient-to-r from-brand-purple to-brand-pink bg-clip-text text-transparent hidden sm:block">
            StudyFlow
          </span>
        </Link>

        {/* XP Bar — center */}
        <div className="flex-1 max-w-xs mx-2 hidden md:block">
          <XPBar xp={xp} level={level} />
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all ${
                isActive(to)
                  ? 'bg-brand-purple/10 text-brand-purple border border-brand-purple/25'
                  : 'app-text-secondary hover:bg-brand-purple/5 hover:text-brand-purple border border-transparent'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </Link>
          ))}
        </div>

        {/* Right side: streak + theme toggle + user + logout */}
        <div className="hidden md:flex items-center gap-2 pl-2 border-l flex-shrink-0" style={{ borderColor: 'var(--border-color)' }}>
          <StreakBadge streak={streak} />

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all border ${
              isDark
                ? 'border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                : 'border-indigo-400/30 bg-indigo-100/60 text-indigo-600 hover:bg-indigo-100'
            }`}
          >
            {isDark
              ? <Sun className="w-4 h-4" />
              : <Moon className="w-4 h-4" />
            }
          </button>

          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest font-game" style={{ color: 'var(--text-muted)' }}>Hero</p>
            <p className="text-xs font-bold max-w-[80px] truncate app-text">{user?.name || 'Player'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg p-1.5 border border-transparent hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400 transition-all app-text-muted"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile right: theme toggle + hamburger */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={toggleTheme}
            className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
              isDark
                ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                : 'border-indigo-400/30 bg-indigo-100 text-indigo-600'
            }`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 app-text-muted hover:app-text rounded-lg hover:bg-brand-purple/5"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile XP bar */}
      <div className="md:hidden px-4 pb-2">
        <XPBar xp={xp} level={level} />
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="lg:hidden border-t px-4 py-3 space-y-1 app-nav-bg" style={{ borderColor: 'var(--border-color)' }}>
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all ${
                isActive(to)
                  ? 'bg-brand-purple/10 text-brand-purple border border-brand-purple/20'
                  : 'app-text-secondary hover:bg-brand-purple/5 hover:text-brand-purple border border-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
          <div className="flex items-center justify-between pt-2 mt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-2">
              <StreakBadge streak={streak} />
              <span className="text-sm font-bold app-text">{user?.name}</span>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 text-xs text-rose-400 hover:text-rose-300 p-2 rounded-lg">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
