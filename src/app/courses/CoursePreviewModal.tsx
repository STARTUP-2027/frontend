"use client";

import { useState, useEffect } from "react";
import { type Course } from "../context/CourseContext";

interface CoursePreviewModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onEnroll: (courseId: string) => void;
}

export default function CoursePreviewModal({
  course,
  isOpen,
  onClose,
  onEnroll,
}: CoursePreviewModalProps) {
  if (!isOpen || !course) return null;

  const [activeTab, setActiveTab] = useState<"curriculum" | "about" | "instructors" | "reviews">("curriculum");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const totalDurationSec = 765; // ~12m 45s
  const [isSaved, setIsSaved] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    [course.modules[0]?.id || "m-0"]: true,
  });

  // Simulated video playback ticker when playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentTimeSec((t) => (t >= totalDurationSec ? 0 : t + 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const toggleModule = (id: string) => {
    setExpandedModules((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const formatSec = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? "0" : ""}${rem}`;
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/70 backdrop-blur-md animate-fade-in">
        <div
          className="relative w-full max-w-5xl rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl overflow-hidden my-auto text-[var(--text)] transition-all animate-scale-in max-h-[92vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ================= MODAL HEADER ================= */}
          <div className="px-6 py-4 border-b border-[var(--border-soft)] flex items-center justify-between bg-[var(--surface)] shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm shadow-xs border border-indigo-500/20">
                <svg className="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-extrabold text-[var(--text)] tracking-tight">
                  Course Preview
                </h2>
                <p className="text-[11px] text-[var(--muted)]">
                  Get a glimpse of what you'll learn in this course
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close preview modal"
              className="w-8 h-8 rounded-full bg-[var(--surface-soft)] text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--border)]/40 flex items-center justify-center transition-all cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* ================= SCROLLABLE BODY CONTAINER ================= */}
          <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1">

            {/* TOP SECTION: TWO-COLUMN SPLIT (VIDEO ON LEFT, METADATA ON RIGHT) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

              {/* LEFT 6 COLS: VIDEO PLAYER PREVIEW */}
              <div className="lg:col-span-6 relative rounded-2xl overflow-hidden bg-slate-950 aspect-video shadow-md border border-slate-800 flex flex-col justify-between group">
                {/* Video Thumbnail / Mock Player Frame */}
                <div className="absolute inset-0">
                  {course.thumbnailUrl ? (
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-full object-cover opacity-75"
                    />
                  ) : (
                    <div
                      className="w-full h-full"
                      style={{ background: course.bannerGradient || "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)" }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40" />
                </div>

                {/* Central Title Overlay in Video */}
                <div className="relative z-10 p-5 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-6 h-6 rounded-md bg-indigo-500/30 flex items-center justify-center text-xs">
                      🐍
                    </span>
                    <span className="text-xs font-bold text-indigo-300">Astra Interactive Preview</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black tracking-tight text-white drop-shadow-sm max-w-xs">
                    {course.title}
                  </h3>
                </div>

                {/* Central Play Button */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-white/95 text-slate-900 shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-20 cursor-pointer"
                  title={isPlaying ? "Pause Preview" : "Play Preview"}
                >
                  {isPlaying ? (
                    <span className="text-lg font-black">❚❚</span>
                  ) : (
                    <svg className="w-6 h-6 fill-current ml-1" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>

                {/* Bottom Video Controls Bar */}
                <div className="relative z-20 p-3 bg-gradient-to-t from-black/95 to-transparent text-white space-y-1.5">
                  {/* Scrubber Bar */}
                  <div
                    className="w-full h-1 bg-white/30 rounded-full overflow-hidden cursor-pointer"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickX = e.clientX - rect.left;
                      const pct = clickX / rect.width;
                      setCurrentTimeSec(Math.floor(pct * totalDurationSec));
                    }}
                  >
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all"
                      style={{ width: `${(currentTimeSec / totalDurationSec) * 100}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-white/90 pt-0.5">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="hover:text-indigo-300 transition-colors cursor-pointer"
                      >
                        {isPlaying ? "❚❚" : "▶"}
                      </button>
                      <span>
                        {formatSec(currentTimeSec)} / {formatSec(totalDurationSec)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span title="Audio On" className="cursor-pointer hover:text-indigo-300">🔊</span>
                      <span className="px-1 py-0.5 rounded text-[9px] font-bold border border-white/40 uppercase">CC</span>
                      <span title="Fullscreen" className="cursor-pointer hover:text-indigo-300">⛶</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT 6 COLS: COURSE HEADLINE, STATS, HIGHLIGHTS, ACTIONS */}
              <div className="lg:col-span-6 space-y-4 text-left">
                <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
                  {course.categoryLabel || "Software Engineering"}
                </span>

                <div className="space-y-1.5">
                  <h1 className="text-xl sm:text-2xl font-black text-[var(--text)] tracking-tight leading-snug">
                    {course.title}
                  </h1>
                  <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                    {course.tagline || course.description}
                  </p>
                </div>

                {/* Meta Row: Rating, Duration, Level */}
                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-[var(--muted)] pt-1">
                  <span className="flex items-center gap-1 text-amber-500 font-bold">
                    <span>★</span> {course.rating} <span className="text-[var(--muted)] font-normal">({(course.reviewsCount || 6420).toLocaleString()} reviews)</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <span>⏱</span> {course.duration}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-[var(--text)] font-bold">
                    <span>📊</span> {course.level}
                  </span>
                </div>

                {/* 3 Checkmark Bullets with Purple Checkmarks */}
                <ul className="space-y-2 pt-1 text-xs text-[var(--text)] font-medium">
                  <li className="flex items-center gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-[10px] font-bold shrink-0">
                      ✓
                    </span>
                    <span>{course.duration} of interactive masterclasses & guided labs</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-[10px] font-bold shrink-0">
                      ✓
                    </span>
                    <span>Production projects & architectural capstone included</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-[10px] font-bold shrink-0">
                      ✓
                    </span>
                    <span>Verified Industry Certificate on completion</span>
                  </li>
                </ul>

                {/* Buttons Row: Start Preview + Save for Later */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <span>▶</span>
                    <span>Start Preview</span>
                  </button>

                  <button
                    onClick={() => setIsSaved(!isSaved)}
                    className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${isSaved
                        ? "bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-400"
                        : "bg-[var(--surface-soft)] border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)]"
                      }`}
                  >
                    <span>🔖</span>
                    <span>{isSaved ? "Saved" : "Save for Later"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ================= MIDDLE NAVIGATION TABS ================= */}
            <div className="border-b border-[var(--border-soft)] flex items-center gap-6 text-xs font-bold pt-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab("curriculum")}
                className={`pb-3 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${activeTab === "curriculum"
                    ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 font-extrabold"
                    : "text-[var(--muted)] hover:text-[var(--text)]"
                  }`}
              >
                <span>📑</span>
                <span>Curriculum</span>
              </button>
              <button
                onClick={() => setActiveTab("about")}
                className={`pb-3 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${activeTab === "about"
                    ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 font-extrabold"
                    : "text-[var(--muted)] hover:text-[var(--text)]"
                  }`}
              >
                <span>ℹ️</span>
                <span>About this Course</span>
              </button>
              <button
                onClick={() => setActiveTab("instructors")}
                className={`pb-3 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${activeTab === "instructors"
                    ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 font-extrabold"
                    : "text-[var(--muted)] hover:text-[var(--text)]"
                  }`}
              >
                <span>👥</span>
                <span>Instructors</span>
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`pb-3 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${activeTab === "reviews"
                    ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 font-extrabold"
                    : "text-[var(--muted)] hover:text-[var(--text)]"
                  }`}
              >
                <span>⭐</span>
                <span>Reviews</span>
              </button>
            </div>

            {/* ================= TAB CONTENT PANELS ================= */}
            {activeTab === "curriculum" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* LEFT 8 COLS: COURSE CURRICULUM ACCORDIONS */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-base font-extrabold text-[var(--text)]">Course Curriculum</h3>
                      <p className="text-xs text-[var(--muted)]">Explore the complete learning path</p>
                    </div>
                    <span className="text-xs font-mono text-[var(--muted)]">
                      {course.modules.length} Sections • {course.lessonsCount} Lectures • {course.duration}
                    </span>
                  </div>

                  {/* Module Accordions */}
                  <div className="space-y-3">
                    {course.modules.map((mod, index) => {
                      const isOpen = !!expandedModules[mod.id];
                      const lessonCount = mod.lessons?.length || 4;

                      return (
                        <div
                          key={mod.id}
                          className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-xs"
                        >
                          {/* Module Accordion Header */}
                          <div
                            onClick={() => toggleModule(mod.id)}
                            className={`p-4 flex items-center justify-between gap-3 cursor-pointer select-none transition-colors ${isOpen ? "bg-indigo-50/60 dark:bg-indigo-950/20" : "hover:bg-[var(--surface-soft)]"
                              }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                                {index + 1}
                              </span>
                              <span className="text-xs sm:text-sm font-bold text-[var(--text)] truncate">
                                {mod.title}
                              </span>
                            </div>

                            <div className="flex items-center gap-3 shrink-0 text-xs text-[var(--muted)] font-medium">
                              <span>
                                {lessonCount} Lectures • {mod.duration || "1h 30m"}
                              </span>
                              <span className="text-xs">{isOpen ? "▲" : "▼"}</span>
                            </div>
                          </div>

                          {/* Collapsible Sub-Lectures */}
                          {isOpen && (
                            <div className="divide-y divide-[var(--border-soft)] bg-[var(--surface)]">
                              {(mod.lessons || []).map((les, lIndex) => {
                                const isPreview = lIndex === 0;

                                return (
                                  <div
                                    key={les.id}
                                    className="px-5 py-3 flex items-center justify-between gap-3 hover:bg-[var(--surface-soft)]/50 transition-colors text-xs"
                                  >
                                    <div className="flex items-center gap-3 min-w-0">
                                      <span className="text-blue-600 dark:text-blue-400">▶</span>
                                      <span className="font-medium text-[var(--text)] truncate">
                                        {les.title}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-3 shrink-0">
                                      <span className="font-mono text-[11px] text-[var(--muted)]">
                                        {les.duration || "12:45"}
                                      </span>
                                      {isPreview && (
                                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/25">
                                          Preview
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* RIGHT 4 COLS: "BUILD YOUR SKILLS" CARD */}
                <div className="lg:col-span-4 rounded-3xl p-6 text-center space-y-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/30 dark:via-purple-950/20 dark:to-pink-950/10 border border-indigo-200/60 dark:border-indigo-800/40 shadow-sm">
                  {/* Illustration with Rocket */}
                  <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                    <div className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 shadow-md flex items-center justify-center text-3xl">
                      💻
                    </div>
                    <div className="absolute -top-1 -right-1 text-2xl animate-bounce">
                      🚀
                    </div>
                    <div className="absolute -bottom-1 -left-1 px-2 py-0.5 rounded-md bg-purple-600 text-white font-mono text-[10px] font-bold shadow-xs">
                      &lt;/&gt;
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="text-base font-black text-[var(--text)]">Build Your Skills</h4>
                    <p className="text-xs text-[var(--muted)] leading-relaxed">
                      Learn {course.title} from scratch and become industry ready!
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      onEnroll(course.id);
                      onClose();
                    }}
                    className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-black text-xs shadow-md shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                  >
                    Enroll Now →
                  </button>
                </div>
              </div>
            )}

            {activeTab === "about" && (
              <div className="space-y-4 text-xs text-[var(--muted)] leading-relaxed">
                <h3 className="text-sm font-extrabold text-[var(--text)]">About this Masterclass</h3>
                <p>{course.description}</p>
                <div className="pt-2">
                  <h4 className="font-bold text-[var(--text)] mb-2">Skills you'll master:</h4>
                  <div className="flex flex-wrap gap-2">
                    {course.skills.map((s) => (
                      <span key={s} className="px-3 py-1 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs font-semibold text-[var(--text)]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "instructors" && (
              <div className="p-4 rounded-2xl bg-[var(--surface-soft)]/50 border border-[var(--border)] flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm shrink-0 shadow-sm">
                  {course.instructor.avatar}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--text)]">{course.instructor.name}</h4>
                  <p className="text-xs text-[var(--muted)]">{course.instructor.role} • {course.instructor.company}</p>
                  <p className="text-[11px] text-[var(--muted)] mt-1">Leading industry veteran with over a decade of production architecture experience.</p>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black text-amber-500">{course.rating}</span>
                  <div>
                    <div className="text-xs font-bold text-[var(--text)]">⭐⭐⭐⭐⭐ Rated Excellent</div>
                    <div className="text-[11px] text-[var(--muted)]">Based on {(course.reviewsCount || 6420).toLocaleString()} student reviews</div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
      );
}
