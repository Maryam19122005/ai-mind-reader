import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useThemeStore } from './store/useThemeStore';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Achievements from './pages/Achievements';
import Schedule from './pages/Schedule';
import Timer from './pages/Timer';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  const { initTheme, theme } = useThemeStore();

  // Apply persisted theme class to <html> on first load
  useEffect(() => { initTheme(); }, []);

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: theme === 'dark' ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.95)',
            color: theme === 'dark' ? '#f8fafc' : '#0f172a',
            backdropFilter: 'blur(8px)',
            border: theme === 'dark'
              ? '1px solid rgba(255,255,255,0.08)'
              : '1px solid rgba(148,163,184,0.3)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          },
        }}
      />

      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/timer" element={<Timer />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
