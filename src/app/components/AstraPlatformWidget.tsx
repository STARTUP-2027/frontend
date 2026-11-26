import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function AstraPlatformWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [activeTab, setActiveTab] = useState<"quick" | "roadmap" | "stats">("quick");
  const { user } = useAuth();

  if (isDismissed) return null;

  return (
    <div className="fixed bottom-5 right-5 z-40 select-none print:hidden">
      {/* Expanded Floating Widget Card */}
      {isOpen ? (
        <div className="w-80 sm:w-96 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl overflow-hidden backdrop-blur-2xl animate-scale-in text-[var(--text)] transition-all flex flex-col">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-blue-500/10 border-b border-[var(--border-soft)] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-sm shadow-xs font-bold">
                ✨
              </span>
              <div>
                <h4 className="text-xs font-black tracking-tight text-[var(--text)]">
                  Astra Hub & Roadmap
                </h4>
                <p className="text-[10px] text-[var(--muted)]">Interactive Learning Companion</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-[var(--surface-soft)] text-[var(--muted)] hover:text-[var(--text)] flex items-center justify-center text-xs transition-colors cursor-pointer"
              title="Close Widget"
            >
              ✕
            </button>
          </div>

          {/* Sub Navigation Bar */}
          <div className="flex border-b border-[var(--border-soft)] text-[11px] font-bold bg-[var(--surface-soft)]/40 px-3">
            <button
              onClick={() => setActiveTab("quick")}
              className={`py-2 px-3 border-b-2 transition-all cursor-pointer ${activeTab === "quick"
                  ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 font-extrabold"
                  : "border-transparent text-[var(--muted)] hover:text-[var(--text)]"
                }`}
            >
              ⚡ Fast Hub
            </button>
            <button
              onClick={() => setActiveTab("roadmap")}
              className={`py-2 px-3 border-b-2 transition-all cursor-pointer ${activeTab === "roadmap"
                  ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 font-extrabold"
                  : "border-transparent text-[var(--muted)] hover:text-[var(--text)]"
                }`}
            >
              🚀 Coming Soon
            </button>
            <button
              onClick={() => setActiveTab("stats")}
              className={`py-2 px-3 border-b-2 transition-all cursor-pointer ${activeTab === "stats"
                  ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 font-extrabold"
                  : "border-transparent text-[var(--muted)] hover:text-[var(--text)]"
                }`}
            >
              📊 Telemetry
            </button>
          </div>

          {/* Tab 1: Quick Actions */}
          {activeTab === "quick" && (
            <div className="p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200/50 dark:border-indigo-800/40">
                <div className="flex items-center gap-2">
                  <span className="text-base">🔥</span>
                  <div>
                    <p className="font-bold text-[11px] text-[var(--text)]">Daily Study Streak</p>
                    <p className="text-[10px] text-[var(--muted)]">14-Day Consecutive Builder</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono font-black text-indigo-600 dark:text-indigo-400">
                  +{user?.xp || 450} XP
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/dsa-sheet"
                  onClick={() => setIsOpen(false)}
                  className="p-3 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border)] hover:border-indigo-500/40 transition-all text-left group"
                >
                  <span className="text-lg block mb-1">🧠</span>
                  <p className="font-bold text-[11px] text-[var(--text)] group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    DSA Sheets
                  </p>
                  <p className="text-[10px] text-[var(--muted)]">620+ Patterns</p>
                </Link>

                <Link
                  to="/contests"
                  onClick={() => setIsOpen(false)}
                  className="p-3 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border)] hover:border-indigo-500/40 transition-all text-left group"
                >
                  <span className="text-lg block mb-1">⚡</span>
                  <p className="font-bold text-[11px] text-[var(--text)] group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    Contest Arena
                  </p>
                  <p className="text-[10px] text-[var(--muted)]">Quizzes & Duels</p>
                </Link>

                <Link
                  to="/courses"
                  onClick={() => setIsOpen(false)}
                  className="p-3 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border)] hover:border-indigo-500/40 transition-all text-left group"
                >
                  <span className="text-lg block mb-1">📚</span>
                  <p className="font-bold text-[11px] text-[var(--text)] group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    Full Catalog
                  </p>
                  <p className="text-[10px] text-[var(--muted)]">50+ Masterclasses</p>
                </Link>

                <Link
                  to="/verify"
                  onClick={() => setIsOpen(false)}
                  className="p-3 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border)] hover:border-indigo-500/40 transition-all text-left group"
                >
                  <span className="text-lg block mb-1">🏆</span>
                  <p className="font-bold text-[11px] text-[var(--text)] group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    Credentials
                  </p>
                  <p className="text-[10px] text-[var(--muted)]">Public Badge</p>
                </Link>
              </div>
            </div>
          )}

          {/* Tab 2: Coming Soon Roadmap */}
          {activeTab === "roadmap" && (
            <div className="p-4 space-y-2.5 text-xs max-h-60 overflow-y-auto">
              <div className="p-2.5 rounded-xl bg-[var(--surface-soft)]/60 border border-[var(--border-soft)] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[11px] text-[var(--text)] flex items-center gap-1.5">
                    <span>⚔️</span> Real-Time 1v1 Battle Arena
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    Q2 2026
                  </span>
                </div>
                <p className="text-[10px] text-[var(--muted)]">
                  Live WebRTC matchmaking for synchronized pair-programming battles with code execution judge.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-[var(--surface-soft)]/60 border border-[var(--border-soft)] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[11px] text-[var(--text)] flex items-center gap-1.5">
                    <span>📱</span> Astra Mobile Studio App
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                    In Alpha
                  </span>
                </div>
                <p className="text-[10px] text-[var(--muted)]">
                  Download offline video masterclasses, solve flashcards on commute, and track daily interview streaks.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-[var(--surface-soft)]/60 border border-[var(--border-soft)] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[11px] text-[var(--text)] flex items-center gap-1.5">
                    <span>🤖</span> AI Architectural Mock Interviewer
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-500 border border-purple-500/20">
                    Beta
                  </span>
                </div>
                <p className="text-[10px] text-[var(--muted)]">
                  Voice-first systems design interview simulator with real-time distributed topology evaluation.
                </p>
              </div>
            </div>
          )}

          {/* Tab 3: Platform Telemetry */}
          {activeTab === "stats" && (
            <div className="p-4 space-y-2.5 text-xs">
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border-soft)]">
                  <span className="text-[10px] uppercase font-bold text-[var(--muted)]">Engineers</span>
                  <p className="text-sm font-black text-[var(--text)]">150,000+</p>
                </div>
                <div className="p-2.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border-soft)]">
                  <span className="text-[10px] uppercase font-bold text-[var(--muted)]">DSA Solved</span>
                  <p className="text-sm font-black text-emerald-500">1.2M+</p>
                </div>
                <div className="p-2.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border-soft)]">
                  <span className="text-[10px] uppercase font-bold text-[var(--muted)]">Cluster Uptime</span>
                  <p className="text-sm font-black text-indigo-500">99.99%</p>
                </div>
                <div className="p-2.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border-soft)]">
                  <span className="text-[10px] uppercase font-bold text-[var(--muted)]">API Latency</span>
                  <p className="text-sm font-black text-amber-500">18ms p95</p>
                </div>
              </div>

              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold text-center">
                ● All Nodes & Compilers Operational
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Collapsed Floating Pill Button with Dismiss option */
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2 px-3.5 py-2 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer font-bold text-xs border border-white/20"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
            <span className="text-xs">✨</span>
            <span className="hidden sm:inline">Astra Hub</span>
            <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[9px] uppercase font-mono font-bold">
              Widget
            </span>
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="w-6 h-6 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white/70 hover:text-white flex items-center justify-center text-[10px] transition-all cursor-pointer shadow-sm border border-white/10"
            title="Hide widget"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
