"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useCourses, type Course } from "../context/CourseContext";
import { useTheme } from "../theme";
import { SiteNav, SiteFooter } from "../../App";
import CourseCard from "../courses/CourseCard";
import CoursePreviewModal from "../courses/CoursePreviewModal";

// Customization Specialization Tracks
const SPECIALIZATION_TRACKS = [
  { id: "ai", label: "🤖 AI & Autonomous Agents", targetRole: "AI Systems Architect" },
  { id: "fullstack", label: "🌐 Full-Stack Distributed Systems", targetRole: "Staff Software Engineer" },
  { id: "security", label: "🔒 Cybersecurity & Zero Trust", targetRole: "Security Operations Specialist" },
  { id: "cloud", label: "☁️ Cloud & DevOps Infrastructure", targetRole: "Cloud Platform Architect" },
];

export default function StudentDashboardPage() {
  const { dark } = useTheme();
  const { user, switchRole } = useAuth();
  const navigate = useNavigate();
  const { courses, enrolledCourseIds, getCourseProgress, certificates, enrollInCourse } = useCourses();

  // Active Enrolled Filtering
  const [courseFilter, setCourseFilter] = useState<"all" | "in-progress" | "completed">("all");
  const [courseViewMode, setCourseViewMode] = useState<"grid" | "list">("grid");
  const [selectedCert, setSelectedCert] = useState<any | null>(null);
  const [previewCourse, setPreviewCourse] = useState<Course | null>(null);

  // Student Customization States (with LocalStorage persistence)
  const [weeklyGoalHours, setWeeklyGoalHours] = useState<number>(10);
  const [completedHoursThisWeek, setCompletedHoursThisWeek] = useState<number>(6.5);
  const [selectedTrack, setSelectedTrack] = useState<string>("ai");
  const [customBio, setCustomBio] = useState<string>(user?.title || "Aspiring AI & Full-Stack Engineer");
  const [isEditingBio, setIsEditingBio] = useState<boolean>(false);
  const [bioInput, setBioInput] = useState<string>("");
  const [showGoalModal, setShowGoalModal] = useState<boolean>(false);

  // Load custom settings on mount
  useEffect(() => {
    try {
      const savedGoal = localStorage.getItem("astra_student_weekly_goal");
      if (savedGoal) setWeeklyGoalHours(Number(savedGoal));
      const savedTrack = localStorage.getItem("astra_student_track");
      if (savedTrack) setSelectedTrack(savedTrack);
      const savedBio = localStorage.getItem("astra_student_bio");
      if (savedBio) setCustomBio(savedBio);
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const handleSaveGoal = (hours: number) => {
    setWeeklyGoalHours(hours);
    try {
      localStorage.setItem("astra_student_weekly_goal", String(hours));
    } catch { }
    setShowGoalModal(false);
  };

  const handleSaveTrack = (trackId: string) => {
    setSelectedTrack(trackId);
    try {
      localStorage.setItem("astra_student_track", trackId);
    } catch { }
  };

  const handleSaveBio = () => {
    if (bioInput.trim()) {
      setCustomBio(bioInput.trim());
      try {
        localStorage.setItem("astra_student_bio", bioInput.trim());
      } catch { }
    }
    setIsEditingBio(false);
  };

  // Enrolled courses logic
  const enrolledCourses = courses.filter((c) => enrolledCourseIds.includes(c.id));
  const otherCourses = courses.filter((c) => !enrolledCourseIds.includes(c.id));

  const filteredEnrolledCourses = enrolledCourses.filter((c) => {
    const prog = getCourseProgress(c.id);
    if (courseFilter === "in-progress") return prog.percentage > 0 && prog.percentage < 100;
    if (courseFilter === "completed") return prog.percentage >= 100;
    return true;
  });

  // Primary resume course
  const primaryResumeCourse = enrolledCourses.length > 0 ? enrolledCourses[0] : courses[0];
  const primaryProgress = primaryResumeCourse ? getCourseProgress(primaryResumeCourse.id) : { percentage: 0 };

  // Calculate goal percentage
  const goalPercentage = Math.min(100, Math.round((completedHoursThisWeek / weeklyGoalHours) * 100));

  // Heatmap generation
  const weeks = Array.from({ length: 36 }).map((_, wIdx) => {
    return Array.from({ length: 7 }).map((_, dIdx) => {
      const val = (wIdx * 7 + dIdx * 3) % 10;
      let level = 0;
      if (val > 8) level = 4;
      else if (val > 6) level = 3;
      else if (val > 4) level = 2;
      else if (val > 2) level = 1;
      return { day: dIdx, level, count: level * 2 };
    });
  });

  const getHeatmapColor = (level: number) => {
    if (level === 0) return dark ? "bg-slate-800" : "bg-slate-100";
    if (level === 1) return "bg-blue-200 dark:bg-blue-950";
    if (level === 2) return "bg-blue-300 dark:bg-blue-800";
    if (level === 3) return "bg-blue-500 dark:bg-blue-600";
    return "bg-blue-600 dark:bg-blue-500";
  };

  return (
    <div className={`subpage app ${dark ? "dark" : ""} min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)] transition-colors duration-200`}>
      <SiteNav />

      {/* Main Container with reduced top padding matching courses catalog */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-32 space-y-6">

        {/* ================= 1. DYNAMIC STUDENT HERO COMMAND CENTER ================= */}
        <section className="relative overflow-hidden rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm p-6 sm:p-8">
          {/* Subtle Ambient Backlight Glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">

            {/* Left: Avatar & Bio & Customization */}
            <div className="flex items-start sm:items-center gap-4 sm:gap-5">
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-2xl sm:text-3xl flex items-center justify-center shadow-lg shadow-blue-500/25 shrink-0 ring-4 ring-white dark:ring-slate-800">
                  {user?.avatar || "AM"}
                </div>
                {/* Level Tag on Avatar */}
                <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-sm">
                  Lvl 4
                </span>
              </div>

              <div className="space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    Welcome back, {user?.name || "Alex Morgan"}!
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                    <span>👑</span> Pro Learner
                  </span>
                </div>

                {/* Customizable Bio / Title */}
                {isEditingBio ? (
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={bioInput}
                      onChange={(e) => setBioInput(e.target.value)}
                      placeholder="e.g. AI Systems Architect in training"
                      className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-medium text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveBio}
                      className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditingBio(false)}
                      className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 group cursor-pointer" onClick={() => { setBioInput(customBio); setIsEditingBio(true); }}>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                      {customBio}
                    </p>
                    <span className="text-[10px] text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      ✏️ Edit
                    </span>
                  </div>
                )}

                {/* XP Progression Bar to Next Level */}
                <div className="pt-1 flex items-center gap-3">
                  <div className="w-48 sm:w-60 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700/80">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-700" style={{ width: "72.5%" }} />
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 font-mono">
                    1,450 / 2,000 XP
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Gamification Badges & Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
              {/* Daily Streak */}
              <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 flex items-center gap-3 shadow-2xs">
                <span className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center text-xl shrink-0">
                  🔥
                </span>
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 tracking-wider block">
                    Streak
                  </span>
                  <p className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    {user?.streak || 14} <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Days</span>
                  </p>
                </div>
              </div>

              {/* Learning XP */}
              <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-800/40 flex items-center gap-3 shadow-2xs">
                <span className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl shrink-0">
                  ⚡
                </span>
                <div>
                  <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 tracking-wider block">
                    Total XP
                  </span>
                  <p className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    {user?.xp || 1450}
                  </p>
                </div>
              </div>

              {/* Completed Lessons */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 flex items-center gap-3 shadow-2xs">
                <span className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl shrink-0">
                  ✅
                </span>
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider block">
                    Completed
                  </span>
                  <p className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    {user?.completedLessonIds.length || 42} <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Lessons</span>
                  </p>
                </div>
              </div>

              {/* Certificates */}
              <div className="p-3.5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-800/40 flex items-center gap-3 shadow-2xs">
                <span className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xl shrink-0">
                  🏆
                </span>
                <div>
                  <span className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400 tracking-wider block">
                    Credentials
                  </span>
                  <p className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    {certificates.length || 1}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ================= 2. STUDENT CUSTOMIZATION & LEARNING GOAL STRIP ================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">

          {/* Target Track Specialization Selector (Customizable) */}
          <div className="lg:col-span-7 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Target Specialization Track
                </span>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  Customize Your Focus Domain
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Auto-curates recommended labs
              </span>
            </div>

            {/* Track Selector Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {SPECIALIZATION_TRACKS.map((t) => {
                const isActive = selectedTrack === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleSaveTrack(t.id)}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${isActive
                      ? "bg-purple-50 dark:bg-purple-950/40 border-purple-300 dark:border-purple-700 text-purple-900 dark:text-purple-200 shadow-2xs"
                      : "bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/60 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                      }`}
                  >
                    <span className="text-xs font-bold truncate block">{t.label}</span>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium truncate block mt-1">
                      {t.targetRole}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Weekly Study Target & Progress Meter (Customizable) */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Weekly Learning Target
                </span>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  {completedHoursThisWeek} of {weeklyGoalHours} hrs completed
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGoalModal(true)}
                className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer"
              >
                Set Goal ⚙️
              </button>
            </div>

            {/* Target Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">This Week's Pace</span>
                <span className="text-blue-600 dark:text-blue-400 font-mono">{goalPercentage}% achieved</span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700/80">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-blue-600 rounded-full transition-all duration-700"
                  style={{ width: `${goalPercentage}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>🔥 3.5 hrs left to hit your goal</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">On Track!</span>
            </div>
          </div>

        </section>

        {/* ================= 3. QUICK ACTION TILES ================= */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            to="/dsa-sheet"
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-emerald-500/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-3.5 group shadow-2xs"
          >
            <span className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform shrink-0">
              🧠
            </span>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                Daily DSA Sheet
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">380+ Pattern Problems</p>
            </div>
          </Link>

          <Link
            to="/contests"
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-amber-500/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-3.5 group shadow-2xs"
          >
            <span className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-xl group-hover:scale-110 transition-transform shrink-0">
              ⚔️
            </span>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors truncate">
                Contest Arena
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Live 1v1 Battle Mode</p>
            </div>
          </Link>

          <Link
            to="/notes"
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-blue-500/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-3.5 group shadow-2xs"
          >
            <span className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform shrink-0">
              📑
            </span>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                Study Notes & Cards
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Bookmarks & Code Vault</p>
            </div>
          </Link>

          <Link
            to="/verify"
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-purple-500/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-3.5 group shadow-2xs"
          >
            <span className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform shrink-0">
              🎓
            </span>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors truncate">
                Credentials Hub
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Public Verification</p>
            </div>
          </Link>
        </div>

        {/* ================= 4. JUMP BACK IN / RESUME LEARNING FEATURE CARD ================= */}
        {primaryResumeCourse && (
          <div className="relative overflow-hidden p-6 sm:p-7 rounded-[28px] bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-900/50 shadow-md">
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-blue-500/15 via-transparent to-transparent pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-300">
                    Active Masterclass • Jump Back In
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
                  {primaryResumeCourse.title}
                </h2>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {primaryResumeCourse.tagline || primaryResumeCourse.description}
                </p>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300 text-[11px]">Course Progression</span>
                    <span className="text-teal-400 font-mono font-black">{primaryProgress.percentage}% Mastered</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800/80 rounded-full overflow-hidden border border-white/10">
                    <div
                      className="h-full bg-gradient-to-r from-teal-400 to-blue-500 transition-all duration-700 rounded-full"
                      style={{ width: `${primaryProgress.percentage}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => navigate(`/learn/${primaryResumeCourse.id}`)}
                  className="py-3 px-6 rounded-2xl bg-white text-slate-950 font-black text-xs hover:bg-indigo-50 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="m9 7 8 5-8 5V7Z" />
                  </svg>
                  <span>Resume Classroom</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= 5. ENROLLED COURSES SECTION (USING MODERN DESIGN) ================= */}
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                My Enrolled Masterclasses ({enrolledCourses.length})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Track your active curricula, hands-on capstones, and certificates.
              </p>
            </div>

            {/* Filter Tabs & Grid/List Toggle */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <div className="flex items-center p-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setCourseFilter("all")}
                  className={`px-3 py-1 rounded-full transition-all cursor-pointer ${courseFilter === "all"
                    ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    }`}
                >
                  All ({enrolledCourses.length})
                </button>
                <button
                  type="button"
                  onClick={() => setCourseFilter("in-progress")}
                  className={`px-3 py-1 rounded-full transition-all cursor-pointer ${courseFilter === "in-progress"
                    ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    }`}
                >
                  In Progress
                </button>
                <button
                  type="button"
                  onClick={() => setCourseFilter("completed")}
                  className={`px-3 py-1 rounded-full transition-all cursor-pointer ${courseFilter === "completed"
                    ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    }`}
                >
                  Completed
                </button>
              </div>

              {/* View Switcher */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-full p-0.5">
                <button
                  type="button"
                  onClick={() => setCourseViewMode("grid")}
                  className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${courseViewMode === "grid"
                    ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs"
                    : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    }`}
                  title="Grid View"
                >
                  ⊞
                </button>
                <button
                  type="button"
                  onClick={() => setCourseViewMode("list")}
                  className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${courseViewMode === "list"
                    ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs"
                    : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    }`}
                  title="List View"
                >
                  ☰
                </button>
              </div>
            </div>
          </div>

          {/* Render Cards matching the exact new CourseCard specification */}
          {filteredEnrolledCourses.length > 0 ? (
            <div
              className={
                courseViewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {filteredEnrolledCourses.map((c) => {
                const prog = getCourseProgress(c.id);
                return (
                  <CourseCard
                    key={c.id}
                    course={c}
                    isEnrolled={true}
                    progressPercent={prog?.percentage || 78}
                    layout={courseViewMode}
                    onPreview={(course) => setPreviewCourse(course)}
                    onStartLearning={(course) => navigate(`/learn/${course.id}`)}
                  />
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center rounded-[28px] bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
              <span className="text-3xl block">📚</span>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                No courses match this filter
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore our engineering masterclasses in AI, Distributed Systems, and DevOps.
              </p>
              <Link
                to="/courses"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
              >
                Browse Course Catalog →
              </Link>
            </div>
          )}
        </section>

        {/* ================= 6. DAILY ACTIVITY HEATMAP (52-WEEK MATRIX) ================= */}
        <section className="p-6 rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-2">
                <span>📊</span> Daily Study & Coding Activity (52-Week Matrix)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                324 lessons and hands-on exercises completed over the past year.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
              <span>Less</span>
              <span className={`w-3 h-3 rounded-sm ${getHeatmapColor(0)}`} />
              <span className={`w-3 h-3 rounded-sm ${getHeatmapColor(1)}`} />
              <span className={`w-3 h-3 rounded-sm ${getHeatmapColor(2)}`} />
              <span className={`w-3 h-3 rounded-sm ${getHeatmapColor(3)}`} />
              <span className={`w-3 h-3 rounded-sm ${getHeatmapColor(4)}`} />
              <span>More</span>
            </div>
          </div>

          {/* Heatmap Grid */}
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-1.5 min-w-[720px]">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-1.5">
                  {week.map((day, dIdx) => (
                    <div
                      key={dIdx}
                      className={`w-3.5 h-3.5 rounded-sm transition-transform hover:scale-125 cursor-pointer ${getHeatmapColor(
                        day.level
                      )}`}
                      title={`${day.count} activities completed`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 7. VERIFIED CERTIFICATES SHOWCASE ================= */}
        {certificates.length > 0 && (
          <section className="p-6 rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-2">
                <span>🏆</span> My Verified Certificates ({certificates.length})
              </h3>
              <Link to="/verify" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                Public Verification Portal →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  onClick={() => setSelectedCert(cert)}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 hover:border-purple-500/50 hover:shadow-sm cursor-pointer transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl group-hover:scale-110 transition-transform">🎓</span>
                    <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-black">
                      {cert.credentialId}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {cert.courseTitle}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Issued to {cert.studentName} on {cert.issueDate}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* Goal Customization Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="max-w-md w-full p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 text-left">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Personalize Your Schedule
              </span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                Set Weekly Learning Goal
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Choose how many hours you plan to dedicate to code labs, DSA, and masterclasses each week.
              </p>
            </div>

            {/* Presets */}
            <div className="grid grid-cols-3 gap-2">
              {[5, 10, 20].map((hours) => (
                <button
                  key={hours}
                  type="button"
                  onClick={() => handleSaveGoal(hours)}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${weeklyGoalHours === hours
                    ? "bg-blue-50 dark:bg-blue-950/50 border-blue-500 text-blue-600 dark:text-blue-400 font-black shadow-2xs"
                    : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:border-slate-400"
                    }`}
                >
                  <span className="text-lg block font-mono font-black">{hours}h</span>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">
                    {hours === 5 ? "Casual" : hours === 10 ? "Dedicated" : "Intensive"}
                  </span>
                </button>
              ))}
            </div>

            {/* Close button */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowGoalModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Viewer Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="max-w-xl w-full p-8 rounded-3xl bg-gradient-to-b from-[#1c1830] to-[#120f20] text-white border-2 border-amber-500/40 shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto text-2xl">
              🏆
            </div>
            <div>
              <span className="text-[10px] tracking-widest font-mono text-amber-400 uppercase">
                Certificate of Excellence
              </span>
              <h2 className="text-2xl font-black mt-1">Astra Academy Certificate</h2>
              <p className="text-xs text-gray-400 mt-2">This is to certify that</p>
              <p className="text-xl font-extrabold text-white mt-1 border-b border-gray-700 pb-2 inline-block px-6">
                {selectedCert.studentName}
              </p>
              <p className="text-xs text-gray-400 mt-3">
                has successfully mastered and completed all requirements for
              </p>
              <p className="text-base font-bold text-blue-400 mt-1">{selectedCert.courseTitle}</p>
            </div>
            <div className="flex justify-between items-center text-[10px] text-gray-400 pt-4 border-t border-gray-800">
              <span>Issue Date: {selectedCert.issueDate}</span>
              <span className="font-mono text-amber-400 font-bold">{selectedCert.credentialId}</span>
            </div>
            <div className="flex flex-wrap gap-2.5 justify-center pt-2">
              <Link
                to={`/verify/${selectedCert.credentialId}`}
                onClick={() => setSelectedCert(null)}
                className="button button-sm text-xs font-bold flex items-center gap-1.5"
              >
                <span>🌐</span> Public Verification Page
              </Link>
              <button
                onClick={() => {
                  const name = encodeURIComponent(selectedCert.courseTitle);
                  const orgName = encodeURIComponent("Astra Academy");
                  const certUrl = encodeURIComponent(`${window.location.origin}/verify/${selectedCert.credentialId}`);
                  const certId = encodeURIComponent(selectedCert.credentialId);
                  const linkedinUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${name}&organizationName=${orgName}&certUrl=${certUrl}&certId=${certId}&issueYear=2026&issueMonth=10`;
                  window.open(linkedinUrl, "_blank");
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0a66c2] text-white hover:bg-[#084e96] flex items-center gap-1.5"
              >
                <span>🔗</span> Add to LinkedIn
              </button>
              <button
                onClick={() => setSelectedCert(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal for courses if needed */}
      <CoursePreviewModal
        course={previewCourse}
        isOpen={Boolean(previewCourse)}
        onClose={() => setPreviewCourse(null)}
        onEnroll={(courseId) => {
          enrollInCourse(courseId);
          navigate(`/learn/${courseId}`);
        }}
      />

      <SiteFooter />
    </div>
  );
}
