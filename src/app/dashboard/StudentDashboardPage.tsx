"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useCourses } from "../context/CourseContext";
import { useTheme } from "../theme";
import { SiteNav, SiteFooter } from "../../App";

export default function StudentDashboardPage() {
  const { dark } = useTheme();
  const { user, switchRole } = useAuth();
  const navigate = useNavigate();
  const { courses, enrolledCourseIds, getCourseProgress, certificates, enrollInCourse } = useCourses();

  const [activeFilter, setActiveFilter] = useState<"all" | "in-progress" | "completed">("all");
  const [selectedCert, setSelectedCert] = useState<any | null>(null);

  const enrolledCourses = courses.filter((c) => enrolledCourseIds.includes(c.id));
  const otherCourses = courses.filter((c) => !enrolledCourseIds.includes(c.id));

  // Determine active resume course
  const primaryResumeCourse = enrolledCourses.length > 0 ? enrolledCourses[0] : courses[0];
  const primaryProgress = primaryResumeCourse ? getCourseProgress(primaryResumeCourse.id) : { percentage: 0 };

  // Generate GitHub-style 52-week activity heatmap data
  const weeks = Array.from({ length: 36 }).map((_, wIdx) => {
    return Array.from({ length: 7 }).map((_, dIdx) => {
      // Deterministic pseudo-activity distribution
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
    <div className={`subpage app ${dark ? "dark" : ""} min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]`}>
      <SiteNav />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-28 space-y-8">
        {/* Student Welcome & Gamification Banner */}
        <div className="relative overflow-hidden p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-extrabold text-xl flex items-center justify-center shadow-md">
                {user?.avatar || "AM"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight">Welcome back, {user?.name || "Alex Morgan"}!</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Pro Learner
                  </span>
                </div>
                <p className="text-xs text-[var(--muted)] mt-1">{user?.title || "Aspiring AI & Full-Stack Engineer"}</p>
              </div>
            </div>

            {/* Gamification Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] flex items-center gap-3 shadow-xs">
                <span className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center text-base shrink-0">🔥</span>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[var(--muted)] tracking-wider block">Streak</span>
                  <p className="text-base sm:text-lg font-extrabold text-[var(--text)]">{user?.streak || 14} <span className="text-[10px] font-semibold text-[var(--muted)]">Days</span></p>
                </div>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] flex items-center gap-3 shadow-xs">
                <span className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-base shrink-0">⚡</span>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[var(--muted)] tracking-wider block">Learning XP</span>
                  <p className="text-base sm:text-lg font-extrabold text-[var(--text)]">{user?.xp || 1450}</p>
                </div>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] flex items-center gap-3 shadow-xs">
                <span className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-base shrink-0">✅</span>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[var(--muted)] tracking-wider block">Completed</span>
                  <p className="text-base sm:text-lg font-extrabold text-[var(--text)]">{user?.completedLessonIds.length || 42} <span className="text-[10px] font-semibold text-[var(--muted)]">Lessons</span></p>
                </div>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] flex items-center gap-3 shadow-xs">
                <span className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-base shrink-0">🏆</span>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[var(--muted)] tracking-wider block">Certificates</span>
                  <p className="text-base sm:text-lg font-extrabold text-[var(--text)]">{certificates.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3-Day Free Trial Active Status Banner */}
        <div className="p-4 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-sm shrink-0">
              🎁
            </span>
            <div>
              <p className="font-bold text-[var(--text)] flex items-center gap-2">
                <span>3-Day Full Access Free Trial Active</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold uppercase">
                  3 Days Remaining
                </span>
              </p>
              <p className="text-[11px] text-[var(--muted)]">
                You have unrestricted access to all masterclasses, pattern-wise DSA sheets, and verified certifications.
              </p>
            </div>
          </div>
          <Link
            to="/dsa-sheet"
            className="px-3.5 py-1.5 rounded-lg font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shrink-0 shadow-xs"
          >
            Practice DSA Sheets →
          </Link>
        </div>

        {/* Quick Role Switcher Banner (for Development & Testing) */}
        <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-base">🛠️</span>
            <span>Testing Mode: You are logged in as <strong>Student (Alex Morgan)</strong>. Fixed credentials: <code>student@astra.edu</code> / <code>student123</code></span>
          </div>
          <button
            onClick={() => switchRole("admin")}
            className="px-3.5 py-1.5 rounded-lg font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors shrink-0"
          >
            Switch to Admin / Course Creator (Dr. Sarah Chen) →
          </button>
        </div>

        {/* Interactive Student Hub Quick Navigation Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <Link
            to="/contests"
            className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-blue-500/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-3 group shadow-xs"
          >
            <span className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center text-lg group-hover:scale-105 transition-transform shrink-0">
              ⚡
            </span>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-[var(--text)] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">Contest Arena</h4>
              <p className="text-[10px] text-[var(--muted)] truncate">Daily & 1v1 Duels</p>
            </div>
          </Link>

          <Link
            to="/dsa-sheet"
            className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-blue-500/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-3 group shadow-xs"
          >
            <span className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-lg group-hover:scale-105 transition-transform shrink-0">
              🧠
            </span>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-[var(--text)] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">DSA Sheets</h4>
              <p className="text-[10px] text-[var(--muted)] truncate">380+ Pattern Problems</p>
            </div>
          </Link>

          <Link
            to="/notes"
            className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-blue-500/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-3 group shadow-xs"
          >
            <span className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-lg group-hover:scale-105 transition-transform shrink-0">
              📑
            </span>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-[var(--text)] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">Notes & Bookmarks</h4>
              <p className="text-[10px] text-[var(--muted)] truncate">Snippets & Cards</p>
            </div>
          </Link>

          <Link
            to="/verify"
            className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-blue-500/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-3 group shadow-xs"
          >
            <span className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-lg group-hover:scale-105 transition-transform shrink-0">
              🏆
            </span>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-[var(--text)] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">Credentials Hub</h4>
              <p className="text-[10px] text-[var(--muted)] truncate">Public Verification</p>
            </div>
          </Link>
        </div>

        {/* Continue Learning Active Hero Card */}
        {primaryResumeCourse && (
          <div className="p-6 sm:p-7 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs hover:shadow-sm transition-all relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                    In Progress • Jump Back In
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-[var(--text)]">{primaryResumeCourse.title}</h2>
                <p className="text-xs text-[var(--muted)] line-clamp-2 leading-relaxed">{primaryResumeCourse.tagline}</p>

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-[var(--muted)] font-medium">Course Mastery</span>
                    <span className="text-blue-600 dark:text-blue-400 font-mono">{primaryProgress.percentage}% Completed</span>
                  </div>
                  <div className="w-full h-2.5 bg-[var(--surface-soft)] rounded-full overflow-hidden border border-[var(--border)]">
                    <div
                      className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-700 rounded-full"
                      style={{ width: `${primaryProgress.percentage}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <button
                  onClick={() => navigate(`/learn/${primaryResumeCourse.id}`)}
                  className="button py-3 px-5 text-xs font-bold flex items-center gap-2 shadow-xs hover:shadow-sm"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="m9 7 8 5-8 5V7Z"/></svg>
                  Resume Classroom
                </button>
              </div>
            </div>
          </div>
        )}

        {/* GitHub-Style Daily Learning Activity Heatmap */}
        <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-[var(--accent)] flex items-center gap-2">
                <span>📊</span> Daily Study & Coding Activity (52-Week Matrix)
              </h3>
              <p className="text-[11px] text-[var(--muted)] mt-0.5">324 lessons and hands-on exercises completed over the past year.</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-[var(--muted)] font-medium">
              <span>Less</span>
              <span className={`w-3 h-3 rounded-sm ${getHeatmapColor(0)}`} />
              <span className={`w-3 h-3 rounded-sm ${getHeatmapColor(1)}`} />
              <span className={`w-3 h-3 rounded-sm ${getHeatmapColor(2)}`} />
              <span className={`w-3 h-3 rounded-sm ${getHeatmapColor(3)}`} />
              <span className={`w-3 h-3 rounded-sm ${getHeatmapColor(4)}`} />
              <span>More</span>
            </div>
          </div>

          {/* Heatmap Grid Container */}
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
        </div>

        {/* Enrolled Courses Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold tracking-tight">My Enrolled Masterclasses ({enrolledCourses.length})</h3>
            <Link to="/courses" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
              Browse Full Catalog →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((c) => {
              const prog = getCourseProgress(c.id);
              return (
                <div
                  key={c.id}
                  className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-blue-500/50 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">
                      <span className="px-2 py-0.5 rounded-full bg-[var(--surface-soft)] border border-[var(--border-soft)]">{c.categoryLabel}</span>
                      <span className="text-blue-600 dark:text-blue-400 font-mono font-bold">{prog.percentage}% done</span>
                    </div>

                    <h4 className="text-sm font-bold leading-snug line-clamp-1">{c.title}</h4>
                    <p className="text-xs text-[var(--muted)] line-clamp-2 min-h-[2.5rem] leading-relaxed">{c.tagline}</p>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="w-full h-1.5 bg-[var(--surface-soft)] rounded-full overflow-hidden border border-[var(--border)]">
                        <div
                          className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all"
                          style={{ width: `${prog.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-3 border-t border-[var(--border-soft)] bg-[var(--surface-soft)]/30 flex items-center justify-between">
                    <span className="text-xs text-[var(--muted)] font-mono">⏱️ {c.duration}</span>
                    <Link to={`/learn/${c.id}`} className="button button-sm text-xs font-bold shadow-xs">
                      Launch Classroom →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Explore More Recommended Courses */}
        {otherCourses.length > 0 && (
          <div className="space-y-4 pt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold tracking-tight">Explore More Masterclasses</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherCourses.map((c) => (
                <div
                  key={c.id}
                  className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-blue-500/50 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-5 space-y-3">
                    <span className="px-2 py-0.5 rounded-full bg-[var(--surface-soft)] border border-[var(--border-soft)] text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider inline-block">
                      {c.categoryLabel}
                    </span>
                    <h4 className="text-sm font-bold leading-snug line-clamp-1">{c.title}</h4>
                    <p className="text-xs text-[var(--muted)] line-clamp-2 min-h-[2.5rem] leading-relaxed">{c.description}</p>
                    <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
                      <span>Full Access Included</span>
                      <span>•</span>
                      <span>⭐ {c.rating}</span>
                    </div>
                  </div>

                  <div className="p-4 pt-3 border-t border-[var(--border-soft)] bg-[var(--surface-soft)]/30 flex items-center justify-between">
                    <Link to={`/learn/${c.id}`} className="text-xs font-semibold text-[var(--muted)] hover:text-[var(--text)]">
                      Preview Syllabus
                    </Link>
                    <button onClick={() => enrollInCourse(c.id)} className="button button-sm text-xs font-bold shadow-xs">
                      Enroll Free
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Verified Certificates Showcase */}
        {certificates.length > 0 && (
          <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-2">
              <span>🏆</span> My Verified Certificates ({certificates.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  onClick={() => setSelectedCert(cert)}
                  className="p-4 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] hover:border-blue-500/40 hover:shadow-sm cursor-pointer transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl">🎓</span>
                    <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold">{cert.credentialId}</span>
                  </div>
                  <h4 className="text-xs font-bold truncate">{cert.courseTitle}</h4>
                  <p className="text-[10px] text-[var(--muted)]">Issued to {cert.studentName} on {cert.issueDate}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Certificate Viewer Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="max-w-xl w-full p-8 rounded-2xl bg-gradient-to-b from-[#1c1830] to-[#120f20] text-white border-2 border-amber-500/40 shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto text-2xl">
              🏆
            </div>
            <div>
              <span className="text-[10px] tracking-widest font-mono text-amber-400 uppercase">Certificate of Excellence</span>
              <h2 className="text-2xl font-black mt-1">Astra Academy Certificate</h2>
              <p className="text-xs text-gray-400 mt-2">This is to certify that</p>
              <p className="text-xl font-extrabold text-white mt-1 border-b border-gray-700 pb-2 inline-block px-6">
                {selectedCert.studentName}
              </p>
              <p className="text-xs text-gray-400 mt-3">has successfully mastered and completed all requirements for</p>
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

      <SiteFooter />
    </div>
  );
}
