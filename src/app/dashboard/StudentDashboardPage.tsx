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
    if (level === 0) return dark ? "bg-[#161424]" : "bg-[#ede9fe]";
    if (level === 1) return "bg-purple-300 dark:bg-purple-900";
    if (level === 2) return "bg-purple-400 dark:bg-purple-700";
    if (level === 3) return "bg-purple-500 dark:bg-purple-600";
    return "bg-purple-600 dark:bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.6)]";
  };

  return (
    <div className={`subpage app ${dark ? "dark" : ""} min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]`}>
      <SiteNav />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-28 space-y-8">
        {/* Student Welcome & Gamification Banner */}
        <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-900/30 via-indigo-900/20 to-transparent border border-[var(--border-soft)] shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white font-extrabold text-xl flex items-center justify-center shadow-lg">
                {user?.avatar || "AM"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight">Welcome back, {user?.name || "Alex Morgan"}!</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Pro Learner
                  </span>
                </div>
                <p className="text-xs text-[var(--muted)] mt-1">{user?.title || "Aspiring AI & Full-Stack Engineer"}</p>
              </div>
            </div>

            {/* Gamification Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--border-soft)] text-center shadow-sm">
                <span className="text-[10px] uppercase font-bold text-[var(--muted)]">Streak</span>
                <p className="text-lg font-black text-amber-400 flex items-center justify-center gap-1">
                  🔥 {user?.streak || 14} <span className="text-[10px] font-normal text-[var(--muted)]">Days</span>
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--border-soft)] text-center shadow-sm">
                <span className="text-[10px] uppercase font-bold text-[var(--muted)]">Learning XP</span>
                <p className="text-lg font-black text-[var(--accent)]">⚡ {user?.xp || 1450}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--border-soft)] text-center shadow-sm">
                <span className="text-[10px] uppercase font-bold text-[var(--muted)]">Completed</span>
                <p className="text-lg font-black text-emerald-400">✅ {user?.completedLessonIds.length || 42} <span className="text-[10px] font-normal text-[var(--muted)]">Lessons</span></p>
              </div>
              <div className="p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--border-soft)] text-center shadow-sm">
                <span className="text-[10px] uppercase font-bold text-[var(--muted)]">Certificates</span>
                <p className="text-lg font-black text-indigo-400">🏆 {certificates.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3-Day Free Trial Active Status Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-purple-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-md">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-black flex items-center justify-center text-sm">
              🎁
            </span>
            <div>
              <p className="font-extrabold text-[var(--text)] flex items-center gap-2">
                <span>3-Day Full Access Free Trial Active</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-black text-[10px] font-black uppercase">
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
            className="px-3 py-1.5 rounded-xl font-bold bg-emerald-500 text-black hover:bg-emerald-400 transition-colors shrink-0 shadow-sm"
          >
            Practice DSA Sheets →
          </Link>
        </div>

        {/* Quick Role Switcher Banner (for Development & Testing) */}
        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border-soft)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-base">🛠️</span>
            <span>Testing Mode: You are logged in as <strong>Student (Alex Morgan)</strong>. Fixed credentials: <code>student@astra.edu</code> / <code>student123</code></span>
          </div>
          <button
            onClick={() => switchRole("admin")}
            className="px-3 py-1.5 rounded-xl font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30 hover:bg-purple-500/20 transition-colors"
          >
            Switch to Admin / Course Creator (Dr. Sarah Chen) →
          </button>
        </div>

        {/* Interactive Student Hub Quick Navigation Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            to="/contests"
            className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border-soft)] hover:border-amber-400/50 transition-all flex items-center gap-3 group shadow-sm"
          >
            <span className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
              ⚡
            </span>
            <div>
              <h4 className="text-xs font-extrabold group-hover:text-amber-400 transition-colors">Contest Arena</h4>
              <p className="text-[10px] text-[var(--muted)]">Daily & 1v1 Duels</p>
            </div>
          </Link>

          <Link
            to="/dsa-sheet"
            className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border-soft)] hover:border-emerald-400/50 transition-all flex items-center gap-3 group shadow-sm"
          >
            <span className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
              🧠
            </span>
            <div>
              <h4 className="text-xs font-extrabold group-hover:text-emerald-400 transition-colors">DSA Sheets</h4>
              <p className="text-[10px] text-[var(--muted)]">380+ Pattern Problems</p>
            </div>
          </Link>

          <Link
            to="/notes"
            className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border-soft)] hover:border-indigo-400/50 transition-all flex items-center gap-3 group shadow-sm"
          >
            <span className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
              📑
            </span>
            <div>
              <h4 className="text-xs font-extrabold group-hover:text-indigo-400 transition-colors">Notes & Bookmarks</h4>
              <p className="text-[10px] text-[var(--muted)]">Snippets & Cards</p>
            </div>
          </Link>

          <Link
            to="/verify"
            className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border-soft)] hover:border-emerald-400/50 transition-all flex items-center gap-3 group shadow-sm"
          >
            <span className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
              🏆
            </span>
            <div>
              <h4 className="text-xs font-extrabold group-hover:text-emerald-400 transition-colors">Credentials Hub</h4>
              <p className="text-[10px] text-[var(--muted)]">Public Verification</p>
            </div>
          </Link>
        </div>

        {/* Continue Learning Active Hero Card */}
        {primaryResumeCourse && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] shadow-xl relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--accent)]">
                    In Progress • Jump Back In
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black">{primaryResumeCourse.title}</h2>
                <p className="text-xs text-[var(--muted)] line-clamp-2">{primaryResumeCourse.tagline}</p>

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-[var(--muted)]">Course Mastery</span>
                    <span className="text-[var(--accent)]">{primaryProgress.percentage}% Completed</span>
                  </div>
                  <div className="w-full h-3 bg-[var(--surface-soft)] rounded-full overflow-hidden border border-[var(--border)]">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-700"
                      style={{ width: `${primaryProgress.percentage}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate(`/learn/${primaryResumeCourse.id}`)}
                  className="button py-3.5 px-6 text-xs font-extrabold flex items-center gap-2 shadow-xl hover:scale-105 transition-transform"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="m9 7 8 5-8 5V7Z"/></svg>
                  Resume Classroom
                </button>
              </div>
            </div>
          </div>
        )}

        {/* GitHub-Style Daily Learning Activity Heatmap */}
        <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] shadow-md space-y-4">
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
            <Link to="/courses" className="text-xs font-bold text-[var(--accent)] hover:underline">
              Browse Full Catalog →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((c) => {
              const prog = getCourseProgress(c.id);
              return (
                <div
                  key={c.id}
                  className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] hover:border-[var(--accent)] shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-bold text-[var(--muted)] uppercase">
                      <span>{c.categoryLabel}</span>
                      <span className="text-[var(--accent)] font-mono">{prog.percentage}% done</span>
                    </div>

                    <h4 className="text-base font-extrabold leading-snug">{c.title}</h4>
                    <p className="text-xs text-[var(--muted)] line-clamp-2">{c.tagline}</p>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-[var(--surface-soft)] rounded-full overflow-hidden border border-[var(--border)]">
                      <div
                        className="h-full bg-[var(--accent)] transition-all"
                        style={{ width: `${prog.percentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[var(--border-soft)] flex items-center justify-between">
                    <span className="text-xs text-[var(--muted)]">⏱️ {c.duration}</span>
                    <Link to={`/learn/${c.id}`} className="button button-sm text-xs font-bold">
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
                  className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] shadow-md space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-[var(--muted)] uppercase">{c.categoryLabel}</span>
                    <h4 className="text-base font-extrabold leading-snug">{c.title}</h4>
                    <p className="text-xs text-[var(--muted)] line-clamp-2">{c.description}</p>
                    <div className="flex items-center gap-2 text-xs font-bold text-[var(--accent)]">
                      <span>Full Access Included</span>
                      <span>•</span>
                      <span>⭐ {c.rating}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[var(--border-soft)] flex items-center justify-between">
                    <Link to={`/learn/${c.id}`} className="text-xs font-bold text-[var(--muted)] hover:text-[var(--text)]">
                      Preview Syllabus
                    </Link>
                    <button onClick={() => enrollInCourse(c.id)} className="button button-sm text-xs font-bold">
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
          <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] shadow-md space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-[var(--accent)] flex items-center gap-2">
              <span>🏆</span> My Verified Certificates ({certificates.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  onClick={() => setSelectedCert(cert)}
                  className="p-4 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border)] hover:border-amber-400/50 cursor-pointer transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl">🎓</span>
                    <span className="text-[10px] font-mono text-[var(--accent)]">{cert.credentialId}</span>
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
          <div className="max-w-xl w-full p-8 rounded-3xl bg-gradient-to-b from-[#1c1830] to-[#120f20] text-white border-2 border-amber-500/40 shadow-2xl space-y-6 text-center">
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
              <p className="text-base font-bold text-purple-300 mt-1">{selectedCert.courseTitle}</p>
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
