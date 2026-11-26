import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { useCourses, type Course } from "../context/CourseContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../theme";
import { SiteNav, SiteFooter } from "../../App";
import AdminCourseStudio from "./AdminCourseStudio";
import AdminStudentManagement from "./AdminStudentManagement";
import AdminCustomizableDashboard from "./AdminCustomizableDashboard";
import AdminHackathonStudio from "./AdminHackathonStudio";

export default function AdminCreatorHub() {
  const { dark } = useTheme();
  const { user, switchRole } = useAuth();
  const { courses, deleteCourse } = useCourses();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active Tab from URL query params (controlled via Profile Dropdown & URL): studio | courses | students | analytics | hackathons
  const tabFromUrl = searchParams.get("tab") as "studio" | "courses" | "students" | "analytics" | "hackathons" | null;
  const activeTab = tabFromUrl || "studio";

  const setActiveTab = (newTab: "studio" | "courses" | "students" | "analytics" | "hackathons") => {
    setSearchParams({ tab: newTab });
  };

  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [catalogSearch, setCatalogSearch] = useState("");

  const handleEditCourse = (courseId: string) => {
    setEditingCourseId(courseId);
    setSearchParams({ tab: "studio" });
  };

  const handleCreateNewCourse = () => {
    setEditingCourseId(null);
    setSearchParams({ tab: "studio" });
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col font-sans transition-colors duration-200">
      <SiteNav />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 space-y-8">
        {/* Admin Hub Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xs relative overflow-hidden">
          <div className="space-y-1 relative z-10">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[var(--accent)] text-white shadow-xs">
                Admin &amp; Instructor Console
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--surface-soft)] text-[var(--accent)] border border-[var(--border)]">
                {activeTab === "studio"
                  ? editingCourseId
                    ? `Editing Course #${editingCourseId}`
                    : "✏️ Dynamic Course Studio"
                  : activeTab === "courses"
                  ? `📚 Catalog Directory (${courses.length})`
                  : activeTab === "students"
                  ? "👥 Manage All Students"
                  : activeTab === "analytics"
                  ? "📊 Analytics Dashboard"
                  : "🏆 Hackathons & Arenas"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Astra Curriculum &amp; Platform Studio
            </h1>
            <p className="text-xs text-[var(--muted)] max-w-2xl">
              Dynamic multi-modal course authoring (pure video, pure text, flowcharts, inline images &amp; code), student directory &amp; moderation, and customizable real-time analytics.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 relative z-10 flex-wrap">
            {activeTab !== "studio" ? (
              <button
                onClick={handleCreateNewCourse}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[var(--accent)] text-white hover:opacity-90 transition-all flex items-center gap-1.5 shadow-xs"
              >
                <span>➕</span> Create Course
              </button>
            ) : (
              <button
                onClick={() => setActiveTab("courses")}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[var(--surface-soft)] border border-[var(--border)] hover:border-[var(--accent)] text-[var(--foreground)] transition-all flex items-center gap-1.5"
              >
                <span>📚</span> Manage Catalog ({courses.length})
              </button>
            )}

            <button
              onClick={() => switchRole("student")}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[var(--surface-soft)] border border-[var(--border)] hover:border-[var(--accent)] text-[var(--foreground)] transition-all flex items-center gap-1.5"
            >
              <span>🎓</span> Student View
            </button>

            <Link
              to="/courses"
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[var(--surface-soft)] border border-[var(--border)] hover:bg-[var(--surface)] text-[var(--foreground)] transition-colors"
            >
              Public Catalog →
            </Link>
          </div>
        </div>

        {/* SECTION 1: DYNAMIC COURSE STUDIO WITH STUDENT PREVIEW */}
        {activeTab === "studio" && (
          <AdminCourseStudio
            key={editingCourseId || "new"}
            initialCourseId={editingCourseId}
            onSaved={(id) => {
              setEditingCourseId(null);
            }}
            onCancel={() => {
              setEditingCourseId(null);
              setActiveTab("courses");
            }}
          />
        )}

        {/* SECTION 2: MANAGE ALL COURSES IN CATALOG */}
        {activeTab === "courses" && (
          <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--accent)]">
                  Active Platform Courses ({courses.length})
                </h3>
                <p className="text-xs text-[var(--muted)] mt-0.5">
                  Click <strong>"Edit in Studio"</strong> to open any course directly inside the dynamic authoring studio with live preview.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <input
                  type="text"
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  placeholder="Search courses or categories..."
                  className="p-2.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs w-full sm:w-64 focus:outline-none focus:border-[var(--accent)]"
                />
                <button
                  onClick={handleCreateNewCourse}
                  className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-[var(--accent)] text-white hover:opacity-90 shrink-0"
                >
                  + New Course
                </button>
              </div>
            </div>

            <div className="divide-y divide-[var(--border-soft)]">
              {courses
                .filter(
                  (c) =>
                    c.title.toLowerCase().includes(catalogSearch.toLowerCase()) ||
                    c.instructor.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
                    c.category.toLowerCase().includes(catalogSearch.toLowerCase())
                )
                .map((c) => (
                  <div
                    key={c.id}
                    className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[var(--surface-soft)]/40 p-3 rounded-2xl transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xs shrink-0 shadow-md bg-cover bg-center"
                        style={{
                          background: c.thumbnailUrl
                            ? `url(${c.thumbnailUrl}) center/cover`
                            : c.bannerGradient || "linear-gradient(135deg, #7c3aed 0%, #4338ca 100%)",
                        }}
                      >
                        {!c.thumbnailUrl && c.category.toUpperCase().slice(0, 3)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-extrabold truncate">{c.title}</h4>
                          {c.featured && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                              Featured
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--muted)] mt-1">
                          <span>👨‍🏫 {c.instructor.name}</span>
                          <span>•</span>
                          <span>📚 {c.modules.reduce((acc, m) => acc + m.lessons.length, 0)} Lessons</span>
                          <span>•</span>
                          <span>👥 {c.studentsCount.toLocaleString()} Students</span>
                          <span>•</span>
                          <span>⭐ {c.rating}</span>
                          <span>•</span>
                          <span className="font-bold text-[var(--accent)]">{c.categoryLabel}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleEditCourse(c.id)}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all flex items-center gap-1.5"
                      >
                        <span>✏️</span> Edit in Studio
                      </button>
                      <Link
                        to={`/learn/${c.id}`}
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[var(--surface-soft)] border border-[var(--border)] hover:text-[var(--accent)] transition-colors"
                      >
                        Preview Classroom →
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${c.title}"?`)) {
                            deleteCourse(c.id);
                          }
                        }}
                        className="p-2 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-500/10 border border-rose-500/30 transition-colors"
                        title="Delete Course"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* SECTION 3: MANAGE ALL STUDENTS ON PLATFORM */}
        {activeTab === "students" && <AdminStudentManagement />}

        {/* SECTION 4: CUSTOMIZABLE ANALYTICS & COMING SOON DASHBOARD */}
        {activeTab === "analytics" && <AdminCustomizableDashboard />}

        {/* SECTION 5: HACKATHONS & TEST CASES */}
        {activeTab === "hackathons" && <AdminHackathonStudio />}
      </main>

      <SiteFooter />
    </div>
  );
}
