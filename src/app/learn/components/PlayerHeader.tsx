import React from "react";
import { Link } from "react-router";

interface PlayerHeaderProps {
  courseTitle: string;
  completed: number;
  total: number;
  percentage: number;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onEnterFocusMode: () => void;
  dark: boolean;
  onToggleDark: () => void;
}

export default function PlayerHeader({
  courseTitle,
  completed,
  total,
  percentage,
  isSidebarOpen,
  onToggleSidebar,
  onEnterFocusMode,
  dark,
  onToggleDark,
}: PlayerHeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6 py-2.5 border-b border-[var(--border-soft)] bg-[var(--surface)]/95 backdrop-blur-md shadow-sm">
      {/* Left: Dashboard Back & Course Title */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <Link
          to="/dashboard"
          className="flex items-center gap-1.5 text-xs font-bold text-[var(--muted)] hover:text-[var(--text)] transition-colors shrink-0"
          title="Return to Student Dashboard"
        >
          <span>←</span>
          <span className="hidden sm:inline">Dashboard</span>
        </Link>

        <span className="text-[var(--border)]">|</span>

        {/* Syllabus Sidebar Toggle Button */}
        <button
          onClick={onToggleSidebar}
          className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            isSidebarOpen
              ? "bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/20"
              : "bg-[var(--surface-soft)] hover:bg-[var(--surface)] border-[var(--border)] text-[var(--text)]"
          }`}
          title="Toggle Curriculum Syllabus Sidebar"
        >
          <span>☰</span>
          <span className="hidden md:inline">Curriculum Outline</span>
          <span
            className={`px-1.5 py-0.2 rounded-md text-[10px] font-black ${
              isSidebarOpen ? "bg-white/20 text-white" : "bg-purple-500/15 text-purple-400"
            }`}
          >
            {completed}/{total}
          </span>
        </button>

        {/* Course Title */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <h1 className="text-xs sm:text-sm font-extrabold truncate max-w-[280px] sm:max-w-md">
            {courseTitle}
          </h1>
        </div>
      </div>

      {/* Right: Progress Meter + Theme Toggle + Focus Mode */}
      <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
        <div className="flex items-center gap-2 bg-[var(--surface-soft)] px-3 py-1.5 rounded-full border border-[var(--border-soft)]">
          <div className="w-20 sm:w-28 h-2 bg-[var(--surface)] rounded-full overflow-hidden border border-[var(--border)]">
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="text-xs font-black text-purple-400">{percentage}%</span>
        </div>

        <button
          onClick={onEnterFocusMode}
          className="px-2.5 py-1.5 rounded-xl bg-[var(--surface-soft)] hover:bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--muted)] hover:text-[var(--text)] transition-colors hidden lg:flex items-center gap-1 cursor-pointer"
          title="Enter Fullscreen Focus Classroom Mode"
        >
          <span>🔲</span>
          <span>Focus Mode</span>
        </button>

        <button
          onClick={onToggleDark}
          className="p-1.5 sm:p-2 rounded-xl bg-[var(--surface-soft)] border border-[var(--border-soft)] text-[var(--muted)] hover:text-[var(--text)] cursor-pointer"
          title="Toggle Theme"
        >
          {dark ? "☀️" : "🌙"}
        </button>
      </div>
    </header>
  );
}
