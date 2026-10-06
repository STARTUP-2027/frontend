import { useState } from "react";
import { Link } from "react-router";
import { useCourses } from "../context/CourseContext";
import { useTheme } from "../theme";
import { SiteNav, SiteFooter } from "../../App";

export default function CoursesCatalogPage() {
  const { dark } = useTheme();
  const { courses, enrollInCourse, isEnrolled } = useCourses();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredCourses = courses.filter((c) => {
    const matchesCat = selectedCategory === "all" || c.category === selectedCategory;
    const matchesLevel = selectedLevel === "all" || c.level === selectedLevel;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesLevel && matchesSearch;
  });

  return (
    <div className={`subpage app ${dark ? "dark" : ""} min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]`}>
      <SiteNav />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-28 space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/30">
            Astra Academy Course Directory
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Master the Future of <br />
            <em className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
              Technology & AI Engineering
            </em>
          </h1>
          <p className="text-sm text-[var(--muted)]">
            Explore world-class, project-based masterclasses with interactive code sandboxes, real-world architecture blueprints, and verified certifications.
          </p>
        </div>

        {/* Filters & Search */}
        <div className="p-4 sm:p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] shadow-md space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by topic, skill (e.g. LangGraph, React, Rust)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs focus:ring-2 focus:ring-[var(--accent)]"
              />
              <svg className="absolute left-3 top-3 w-4 h-4 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>

            {/* Level Filter */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-xs font-bold text-[var(--muted)]">Difficulty:</span>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="p-2 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs font-semibold"
              >
                <option value="all">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-[var(--border-soft)]">
            {[
              { id: "all", label: "All Masterclasses" },
              { id: "ai", label: "AI & Machine Learning" },
              { id: "fullstack", label: "Full-Stack & Systems" },
              { id: "security", label: "Cybersecurity & Zero Trust" },
              { id: "devops", label: "DevOps & Cloud Architecture" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat.id
                    ? "bg-[var(--accent)] text-white shadow-lg"
                    : "bg-[var(--surface-soft)] text-[var(--muted)] hover:text-[var(--text)] border border-[var(--border-soft)]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((c) => {
            const enrolled = isEnrolled(c.id);
            return (
              <div
                key={c.id}
                className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] hover:border-[var(--accent)] shadow-lg hover:shadow-2xl transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-4">
                  {/* Top Badge Banner */}
                  <div
                    className="h-32 rounded-2xl p-4 flex flex-col justify-between text-white shadow-inner relative overflow-hidden"
                    style={{ background: c.bannerGradient || "linear-gradient(135deg, #7c3aed 0%, #4338ca 100%)" }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md">
                        {c.categoryLabel}
                      </span>
                      {c.bestseller && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-black">
                          BESTSELLER
                        </span>
                      )}
                    </div>
                    <span className="text-xl font-black">{c.price === 0 ? "FREE" : `$${c.price}`}</span>
                  </div>

                  {/* Course Details */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] text-[var(--muted)] font-semibold">
                      <span>⏱️ {c.duration}</span>
                      <span>•</span>
                      <span>📊 {c.level}</span>
                      <span>•</span>
                      <span>⭐ {c.rating} ({c.studentsCount.toLocaleString()})</span>
                    </div>

                    <h3 className="text-base font-extrabold leading-snug">{c.title}</h3>
                    <p className="text-xs text-[var(--muted)] line-clamp-2">{c.tagline}</p>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1">
                    {c.skills.slice(0, 3).map((skill) => (
                      <span key={skill} className="px-2 py-0.5 rounded-md bg-[var(--surface-soft)] text-[10px] text-[var(--muted)] font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-[var(--border-soft)] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-400 font-bold text-[10px] flex items-center justify-center">
                      {c.instructor.avatar}
                    </div>
                    <span className="text-xs font-semibold truncate max-w-[100px]">{c.instructor.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link to={`/learn/${c.id}`} className="text-xs font-bold text-[var(--muted)] hover:text-[var(--text)]">
                      Syllabus
                    </Link>
                    {enrolled ? (
                      <Link to={`/learn/${c.id}`} className="button button-sm text-xs font-bold">
                        Continue →
                      </Link>
                    ) : (
                      <button
                        onClick={() => enrollInCourse(c.id)}
                        className="button button-sm text-xs font-bold"
                      >
                        Enroll Free
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
