# 🎮 StudyFlow — Gamified Academic Life Manager

StudyFlow turns the chaos of student life — assignments, deadlines, and class schedules — into an RPG-style quest log. Built in a 2.5-hour hackathon sprint, it combines a real productivity tool with game mechanics (XP, levels, streaks, badges) and an AI-powered natural language task parser.

**🔗 Live App:** [ai-mind-reader-3keq.vercel.app](https://ai-mind-reader-3keq.vercel.app)
**🔗 Backend API:** [ai-mind-reader-phi.vercel.app](https://ai-mind-reader-phi.vercel.app)

> Note: the deployed links above use an earlier project codename from the hackathon sprint — the app itself is StudyFlow.

---

## 💡 The Problem

Students juggle assignments, deadlines, and class schedules across notebooks, group chats, and half-used apps. Most task managers are boring, so tasks pile up and get forgotten. StudyFlow fixes both problems at once: one place to track academic life, wrapped in a game layer that makes staying on top of it actually rewarding.

## ✨ Key Features

- **🤖 AI Quest Parser** — Type a task in plain English (e.g. *"physics assignment due next week monday, high priority"*) and Google's **Gemini AI** extracts the title, subject, due date, and priority automatically — no manual form-filling needed.
- **⭐ XP & Leveling System** — Earn XP for completing tasks (more for finishing early, less for overdue), leveling up your academic "hero" as you go.
- **🔥 Daily Streaks** — Stay consistent and build a streak, just like Duolingo.
- **🏆 13 Achievement Badges** — Unlockable badges across four rarity tiers for milestones like task counts, streak length, and early completions.
- **📅 Class Schedule / Timetable** — A weekly, color-coded grid for tracking classes.
- **⏱️ Boss Battle Timer** — A Pomodoro-style focus timer with an animated progress ring that rewards completed study sessions with XP.
- **✅ Full Task Manager** — Add, edit, complete, delete, search, filter, and sort assignments by subject, due date, or priority.
- **🎨 Dark, Glassmorphic UI** — Custom game-inspired design system with smooth animations throughout.
- **💾 Offline-First** — If the AI backend is ever unavailable, the app falls back to local parsing so it never breaks mid-use.

## 🛠️ Tech Stack

**Frontend**
- React (Vite)
- Zustand (state management)
- Framer Motion (animations)
- Tailwind CSS

**Backend**
- Next.js (API routes)
- Google Gemini AI (`gemini-2.5-flash`) for natural language task parsing
- TypeScript

**Deployment**
- Vercel (separate deployments for frontend and backend)

## 🤖 How the AI Parser Works

The backend exposes a single API endpoint (`/api/parse-task`) that:
1. Takes a raw, casual sentence describing a task
2. Sends it to Gemini along with today's date and day of the week
3. Gemini returns a structured JSON object: `{ title, subject, dueDate, priority }`
4. Includes automatic retry logic in case of temporary API slowdowns, so the experience stays smooth even under pressure

## 🚀 Built For

**DigTech 2026 Hackathon** — Vibe Coding Module (2.5-hour build sprint)

## 👥 Team

- Frontend, gamification system & UI/UX
- Backend, AI integration & deployment

---

*Built with a lot of coffee, some panic, and a very patient AI pair-programmer.*


*if really like this project then do star*