import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams, useNavigate } from "react-router";
import { useCourses } from "../context/CourseContext";
import { useTheme } from "../theme";
import { SiteNav, SiteFooter, Icon } from "../../App";

const CATEGORIES = [
  { id: "all", label: "All Masterclasses", icon: "grid" as const },
  { id: "ai", label: "AI & Machine Learning", icon: "sparkles" as const },
  { id: "fullstack", label: "Full-Stack & Systems", icon: "code" as const },
  { id: "security", label: "Cybersecurity & Zero Trust", icon: "lock" as const },
  { id: "devops", label: "Cloud & DevOps", icon: "grid" as const },
];

export default function CoursesCatalogPage() {
  const { dark } = useTheme();
  const navigate = useNavigate();
  const { courses, enrollInCourse, isEnrolled, getCourseProgress } = useCourses();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCat = searchParams.get("category") || searchParams.get("domain") || "all";
  const initialLevel = searchParams.get("level") || "all";

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat);
  const [selectedLevel, setSelectedLevel] = useState<string>(initialLevel);
  const [sortBy, setSortBy] = useState<string>("popular");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const cat = searchParams.get("category") || searchParams.get("domain");
    if (cat) setSelectedCategory(cat);
    const lvl = searchParams.get("level");
    if (lvl) setSelectedLevel(lvl);
  }, [searchParams]);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: courses.length };
    courses.forEach((c) => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });
    return counts;
  }, [courses]);

  // Filter & Sort courses
  const filteredCourses = useMemo(() => {
    let list = courses.filter((c) => {
      const matchesCat = selectedCategory === "all" || c.category === selectedCategory;
      const matchesLevel = selectedLevel === "all" || c.level === selectedLevel;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.tagline.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.skills.some((s) => s.toLowerCase().includes(q)) ||
        c.instructor.name.toLowerCase().includes(q);
      return matchesCat && matchesLevel && matchesSearch;
    });

    if (sortBy === "popular") {
      list.sort((a, b) => b.studentsCount - a.studentsCount);
    } else if (sortBy === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "price-low") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [courses, selectedCategory, selectedLevel, searchQuery, sortBy]);

  const handleClearFilters = () => {
    setSelectedCategory("all");
    setSelectedLevel("all");
    setSearchQuery("");
    setSearchParams({});
  };

  const hasActiveFilters = selectedCategory !== "all" || selectedLevel !== "all" || searchQuery.trim() !== "";

  return (
    <div className={`subpage app ${dark ? "dark" : ""} min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)] transition-colors duration-200`}>
      <div className="subpage-noise" />
      <SiteNav />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-28 space-y-10">

        {/* HERO SECTION */}
        <section className="text-center max-w-4xl mx-auto space-y-4 pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/30 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            Astra Academy Course Directory
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
            Master the Future of <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-sky-400">
              Technology & AI Engineering
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[var(--muted)] max-w-2xl mx-auto leading-relaxed">
            Hands-on, project-based masterclasses with in-browser code sandboxes, autonomous agent swarms, distributed cloud architectures, and verified industry certificates.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-[var(--muted)] font-semibold">
            <span className="flex items-center gap-1.5"><Icon name="check" size={14} /> 50+ Interactive Masterclasses</span>
            <span className="flex items-center gap-1.5"><Icon name="check" size={14} /> 100% In-Browser Code Sandboxes</span>
            <span className="flex items-center gap-1.5"><Icon name="check" size={14} /> Verified Industry Certifications</span>
          </div>
        </section>

        {/* SEARCH & FILTERS HUB */}
        <section className="p-4 sm:p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] shadow-xl space-y-4 backdrop-blur-xl relative">

          {/* Top Row: Search Input + Difficulty + Sort By */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">

            {/* Search Input (Takes 6 cols on large) */}
            <div className="lg:col-span-6 relative">
              <div className="absolute left-3.5 top-3.5 text-[var(--muted)] pointer-events-none">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" strokeWidth="2" />
                  <path d="m21 21-4.3-4.3" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search masterclasses, topics, skills (e.g. LangGraph, React, Rust, Kubernetes)..."
                className="w-full pl-10 pr-10 py-3 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-3 text-[var(--muted)] hover:text-[var(--text)] p-0.5 rounded-full hover:bg-[var(--surface)] transition-colors"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Difficulty Filter */}
            <div className="lg:col-span-3 flex items-center gap-2">
              <div className="relative w-full">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--muted)] block mb-1">
                  Difficulty Level
                </label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs font-semibold text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] cursor-pointer"
                >
                  <option value="all">🌐 All Difficulty Levels</option>
                  <option value="Beginner">🟢 Beginner Friendly</option>
                  <option value="Intermediate">🟡 Intermediate</option>
                  <option value="Advanced">🔴 Advanced / Staff Level</option>
                </select>
              </div>
            </div>

            {/* Sort Filter */}
            <div className="lg:col-span-3 flex items-center gap-2">
              <div className="relative w-full">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--muted)] block mb-1">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs font-semibold text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] cursor-pointer"
                >
                  <option value="popular">⭐ Most Popular (Students)</option>
                  <option value="rating">🏆 Highest Rated (Reviews)</option>
                  <option value="price-low">🏷️ Price: Free & Low to High</option>
                  <option value="price-high">💎 Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Filter Pills (Responsive Horizontal Scroll) */}
          <div className="pt-3 border-t border-[var(--border-soft)]">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const count = categoryCounts[cat.id] || 0;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${isSelected
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25 border border-purple-400/40"
                        : "bg-[var(--surface-soft)] text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface)] border border-[var(--border-soft)]"
                      }`}
                  >
                    <Icon name={cat.icon} size={14} />
                    <span>{cat.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${isSelected ? "bg-white/20 text-white" : "bg-[var(--surface)] text-[var(--muted)]"
                        }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Filter Summary Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-2 border-t border-[var(--border-soft)] text-[var(--muted)]">
            <div className="flex items-center gap-2 font-semibold">
              <span>Showing <strong>{filteredCourses.length}</strong> masterclasses</span>
              {hasActiveFilters && (
                <span className="text-[11px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                  Filters applied
                </span>
              )}
            </div>

            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="text-xs text-[var(--accent)] hover:underline font-bold flex items-center gap-1"
              >
                <span>Reset all filters</span>
                <span>✕</span>
              </button>
            )}
          </div>
        </section>

        {/* COURSES DIRECTORY GRID */}
        {filteredCourses.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] space-y-4">
            <div className="w-16 h-16 rounded-full bg-purple-500/10 text-purple-400 text-2xl flex items-center justify-center mx-auto">
              🔍
            </div>
            <h3 className="text-lg font-bold">No masterclasses matched your filters</h3>
            <p className="text-xs text-[var(--muted)] max-w-md mx-auto">
              Try adjusting your search query, difficulty level, or category filter to discover relevant engineering courses.
            </p>
            <button
              onClick={handleClearFilters}
              className="button button-sm text-xs font-bold mx-auto mt-2"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredCourses.map((c) => {
              const enrolled = isEnrolled(c.id);
              const progress = getCourseProgress(c.id);

              return (
                <article
                  key={c.id}
                  className="group relative rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] hover:border-[var(--accent)] shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden text-left"
                >
                  {/* Subtle Card Radiant Hover Border */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-purple-500/0 via-transparent to-indigo-500/0 group-hover:from-purple-500/5 group-hover:to-indigo-500/5 transition-all pointer-events-none" />

                  <div>
                    {/* Top Vibrant Banner Preview */}
                    <div
                      className="relative h-44 p-4 flex flex-col justify-between text-white overflow-hidden"
                      style={{ background: c.bannerGradient || "linear-gradient(135deg, #7c3aed 0%, #4338ca 100%)" }}
                    >
                      {/* Background Pattern / Code Geometry Watermark */}
                      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                      {/* Top Badges Row */}
                      <div className="relative z-10 flex items-center justify-between gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 shadow-sm">
                          {c.categoryLabel}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {c.bestseller && (
                            <span className="text-[10px] font-black tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-black shadow-md">
                              ★ BESTSELLER
                            </span>
                          )}
                          {c.featured && !c.bestseller && (
                            <span className="text-[10px] font-black tracking-wider px-2 py-0.5 rounded-full bg-purple-400 text-black shadow-md">
                              FEATURED
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quick Syllabus Hover Action */}
                      <div className="relative z-10 flex items-end justify-between">
                        <div>
                          <span className="text-2xl font-black drop-shadow-md">
                            {c.price === 0 ? "FREE" : `$${c.price}`}
                          </span>
                          <span className="block text-[10px] text-white/80 font-medium">
                            Lifetime Access • Sandboxes Included
                          </span>
                        </div>

                        <Link
                          to={`/learn/${c.id}`}
                          className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white text-white hover:text-black text-[11px] font-bold backdrop-blur-md border border-white/30 transition-all flex items-center gap-1"
                        >
                          <span>Preview</span>
                          <Icon name="arrow" size={12} />
                        </Link>
                      </div>
                    </div>

                    {/* Course Card Body */}
                    <div className="p-5 space-y-4">

                      {/* Meta Information Bar */}
                      <div className="flex items-center justify-between text-[11px] text-[var(--muted)] font-semibold border-b border-[var(--border-soft)] pb-3">
                        <span className="flex items-center gap-1">
                          <span>⏱</span> {c.duration}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full inline-block ${c.level === "Beginner"
                                ? "bg-emerald-400"
                                : c.level === "Intermediate"
                                  ? "bg-amber-400"
                                  : "bg-rose-400"
                              }`}
                          />
                          {c.level}
                        </span>
                        <span className="flex items-center gap-1 text-amber-400 font-bold">
                          ★ {c.rating} <span className="text-[var(--muted)] font-normal">({c.studentsCount.toLocaleString()})</span>
                        </span>
                      </div>

                      {/* Title & Description */}
                      <div className="space-y-1.5">
                        <Link to={`/learn/${c.id}`}>
                          <h3 className="text-base font-extrabold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors line-clamp-1 leading-snug">
                            {c.title}
                          </h3>
                        </Link>
                        <p className="text-xs text-[var(--muted)] line-clamp-2 leading-relaxed">
                          {c.tagline}
                        </p>
                      </div>

                      {/* Skills Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {c.skills.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 rounded-lg bg-[var(--surface-soft)] border border-[var(--border-soft)] text-[10px] text-[var(--text)] font-semibold"
                          >
                            {skill}
                          </span>
                        ))}
                        {c.skills.length > 3 && (
                          <span className="text-[10px] text-[var(--muted)] font-semibold self-center">
                            +{c.skills.length - 3} more
                          </span>
                        )}
                      </div>

                      {/* Feature Highlights */}
                      <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-[var(--muted)]">
                        <div className="flex items-center gap-1.5">
                          <span className="text-purple-400">⚡</span>
                          <span className="truncate">In-Browser Sandbox</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-emerald-400">📜</span>
                          <span className="truncate">Verified Certificate</span>
                        </div>
                      </div>

                      {/* Enrolled Progress Bar */}
                      {enrolled && (
                        <div className="p-3 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border-soft)] space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] font-bold">
                            <span className="text-purple-400">Your Progress</span>
                            <span>{progress.percentage}%</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-[var(--surface)] overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
                              style={{ width: `${progress.percentage}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-[var(--muted)] block">
                            {progress.completed} of {progress.total} lessons finished
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer: Instructor Profile & CTA */}
                  <div className="p-5 pt-3 border-t border-[var(--border-soft)] bg-[var(--surface-soft)]/40 flex items-center justify-between gap-3">

                    {/* Instructor Info */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-sm">
                        {c.instructor.avatar}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[var(--text)] truncate">
                          {c.instructor.name}
                        </p>
                        <p className="text-[10px] text-[var(--muted)] truncate">
                          {c.instructor.role}
                        </p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div>
                      {enrolled ? (
                        <Link
                          to={`/learn/${c.id}`}
                          className="button button-sm text-xs font-bold shadow-md inline-flex items-center gap-1"
                        >
                          Continue →
                        </Link>
                      ) : (
                        <button
                          onClick={() => {
                            enrollInCourse(c.id);
                            navigate(`/learn/${c.id}`);
                          }}
                          className="button button-sm text-xs font-bold shadow-md inline-flex items-center gap-1"
                        >
                          Enroll Free
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
