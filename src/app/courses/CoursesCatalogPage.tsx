import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams, useNavigate } from "react-router";
import { useCourses } from "../context/CourseContext";
import { useTheme } from "../theme";
import { SiteNav, SiteFooter, Icon } from "../../App";

interface FilterState {
  category: string[];
  level: string[];
  minRating: number;
  duration: string[];
  skills: string[];
  features: string[]; // "certificate", "bestseller", "featured"
}

const CATEGORY_OPTIONS = [
  { id: "ai", label: "AI & Machine Learning", icon: "sparkles" as const },
  { id: "fullstack", label: "Full-Stack & Systems", icon: "code" as const },
  { id: "security", label: "Cybersecurity & Zero Trust", icon: "lock" as const },
  { id: "devops", label: "Cloud & DevOps", icon: "grid" as const },
];

const LEVEL_OPTIONS = [
  { id: "Beginner", label: "Beginner Friendly", color: "bg-emerald-400" },
  { id: "Intermediate", label: "Intermediate", color: "bg-amber-400" },
  { id: "Advanced", label: "Advanced / Staff", color: "bg-rose-400" },
];

const RATING_OPTIONS = [
  { value: 4.5, label: "4.5★ & above" },
  { value: 4.0, label: "4.0★ & above" },
  { value: 3.5, label: "3.5★ & above" },
];

const DURATION_OPTIONS = [
  { id: "short", label: "Under 15 Hours" },
  { id: "medium", label: "15 - 25 Hours" },
  { id: "long", label: "25+ Hours (Intensive)" },
];

const FEATURE_OPTIONS = [
  { id: "certificate", label: "Verified Certificate" },
  { id: "bestseller", label: "Bestseller Masterclass" },
  { id: "featured", label: "Featured Curriculum" },
];

const ALL_SKILLS = [
  "LangGraph",
  "React 19",
  "Rust",
  "Kubernetes",
  "Python 3.12",
  "Go (Golang)",
  "Apache Kafka",
  "PostgreSQL",
  "Docker",
  "Terraform",
  "Solidity",
  "eBPF",
  "Vector RAG",
  "Tailwind CSS v4",
];

export default function CoursesCatalogPage() {
  const { dark } = useTheme();
  const navigate = useNavigate();
  const { courses, enrollInCourse, isEnrolled, getCourseProgress } = useCourses();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search & Sorting state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"popular" | "rating" | "newest">("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Skill search inside filter sidebar
  const [skillSearch, setSkillSearch] = useState("");

  // Collapsible section state for Flipkart-style accordions
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    categories: true,
    rating: true,
    level: true,
    features: true,
    skills: true,
    duration: false,
  });

  // Comprehensive Filter State
  const [filters, setFilters] = useState<FilterState>({
    category: [],
    level: [],
    minRating: 0,
    duration: [],
    skills: [],
    features: [],
  });

  // Sync initial query params from URL
  useEffect(() => {
    const cat = searchParams.get("category") || searchParams.get("domain");
    const lvl = searchParams.get("level");
    const q = searchParams.get("q");

    if (cat && cat !== "all") {
      setFilters((prev) => ({ ...prev, category: [cat] }));
    }
    if (lvl && lvl !== "all") {
      setFilters((prev) => ({ ...prev, level: [lvl] }));
    }
    if (q) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleToggleCategory = (catId: string) => {
    setFilters((prev) => {
      const exists = prev.category.includes(catId);
      const category = exists ? prev.category.filter((c) => c !== catId) : [...prev.category, catId];
      return { ...prev, category };
    });
  };

  const handleToggleLevel = (lvlId: string) => {
    setFilters((prev) => {
      const exists = prev.level.includes(lvlId);
      const level = exists ? prev.level.filter((l) => l !== lvlId) : [...prev.level, lvlId];
      return { ...prev, level };
    });
  };

  const handleToggleDuration = (durId: string) => {
    setFilters((prev) => {
      const exists = prev.duration.includes(durId);
      const duration = exists ? prev.duration.filter((d) => d !== durId) : [...prev.duration, durId];
      return { ...prev, duration };
    });
  };

  const handleToggleSkill = (skill: string) => {
    setFilters((prev) => {
      const exists = prev.skills.includes(skill);
      const skills = exists ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill];
      return { ...prev, skills };
    });
  };

  const handleToggleFeature = (featId: string) => {
    setFilters((prev) => {
      const exists = prev.features.includes(featId);
      const features = exists ? prev.features.filter((f) => f !== featId) : [...prev.features, featId];
      return { ...prev, features };
    });
  };

  const handleClearAllFilters = () => {
    setFilters({
      category: [],
      level: [],
      minRating: 0,
      duration: [],
      skills: [],
      features: [],
    });
    setSearchQuery("");
    setSearchParams({});
  };

  // Check if any filter is active
  const hasActiveFilters =
    filters.category.length > 0 ||
    filters.level.length > 0 ||
    filters.minRating > 0 ||
    filters.duration.length > 0 ||
    filters.skills.length > 0 ||
    filters.features.length > 0 ||
    searchQuery.trim() !== "";

  // Filtered & Sorted Course List
  const filteredCourses = useMemo(() => {
    let list = courses.filter((c) => {
      // Category Filter
      if (filters.category.length > 0 && !filters.category.includes(c.category)) {
        return false;
      }

      // Level Filter
      if (filters.level.length > 0 && !filters.level.includes(c.level)) {
        return false;
      }

      // Rating Filter
      if (filters.minRating > 0 && c.rating < filters.minRating) {
        return false;
      }

      // Duration Filter (approx hours parsed from string)
      if (filters.duration.length > 0) {
        const hoursMatch = c.duration.match(/(\d+(\.\d+)?)/);
        const hours = hoursMatch ? parseFloat(hoursMatch[1]) : 15;
        const matchesDuration = filters.duration.some((d) => {
          if (d === "short") return hours < 15;
          if (d === "medium") return hours >= 15 && hours <= 25;
          if (d === "long") return hours > 25;
          return true;
        });
        if (!matchesDuration) return false;
      }

      // Skills Filter
      if (filters.skills.length > 0) {
        const hasMatchingSkill = filters.skills.some((s) =>
          c.skills.some((cs) => cs.toLowerCase().includes(s.toLowerCase()))
        );
        if (!hasMatchingSkill) return false;
      }

      // Features Filter
      if (filters.features.length > 0) {
        if (filters.features.includes("bestseller") && !c.bestseller) return false;
        if (filters.features.includes("featured") && !c.featured) return false;
      }

      // Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          c.title.toLowerCase().includes(q) ||
          c.tagline.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.skills.some((s) => s.toLowerCase().includes(q)) ||
          c.instructor.name.toLowerCase().includes(q) ||
          c.categoryLabel.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }

      return true;
    });

    // Sorting
    if (sortBy === "popular") {
      list.sort((a, b) => b.studentsCount - a.studentsCount);
    } else if (sortBy === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "newest") {
      list.sort((a, b) => b.lessonsCount - a.lessonsCount);
    }

    return list;
  }, [courses, filters, searchQuery, sortBy]);

  // Filter count helpers for categories
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    courses.forEach((c) => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });
    return counts;
  }, [courses]);

  const filteredSkillOptions = ALL_SKILLS.filter((s) =>
    s.toLowerCase().includes(skillSearch.toLowerCase())
  );

  return (
    <div className={`subpage app ${dark ? "dark" : ""} min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)] transition-colors duration-200`}>
      <div className="subpage-noise" />
      <SiteNav />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-36 pb-16 space-y-6">

        {/* BREADCRUMB & HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[var(--border-soft)]">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--muted)]">
              <Link to="/" className="hover:text-[var(--accent)] transition-colors">Home</Link>
              <span>/</span>
              <span className="text-[var(--text)] font-bold">Courses Directory</span>
              <span>/</span>
              <span className="text-[var(--accent)] font-bold">Interactive Catalog</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight mt-2 text-[var(--text)]">
              Masterclasses & Engineering Hub
            </h1>
            <p className="text-xs sm:text-sm text-[var(--muted)] mt-1">
              Explore 50+ deep-dive curriculum tracks with pattern-wise DSA sheets, hands-on architectural challenges, and verified credentials.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/dsa-sheet"
              className="px-4 py-2 rounded-2xl text-xs font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20 hover:scale-102 transition-all flex items-center gap-2"
            >
              <span>🧠</span> Explore DSA Sheets
            </Link>
            <Link
              to="/contests"
              className="px-4 py-2 rounded-2xl text-xs font-bold border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--accent)] transition-all flex items-center gap-2"
            >
              <span>🏆</span> Code Arena & Quizzes
            </Link>
          </div>
        </div>

        {/* SEARCH & MOBILE FILTER TRIGGER BAR */}
        <div className="p-3 sm:p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border-soft)] shadow-md flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full md:max-w-xl">
            <div className="absolute left-3.5 top-3 text-[var(--muted)] pointer-events-none">
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
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-2.5 text-[var(--muted)] hover:text-[var(--text)] p-0.5 rounded-full hover:bg-[var(--surface)] transition-colors text-xs"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Mobile Filter Button */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="md:hidden px-4 py-2.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs font-bold flex items-center gap-2 text-[var(--text)] w-full justify-center"
            >
              <span>⚙️</span>
              <span>Filters ({hasActiveFilters ? "Active" : "All"})</span>
            </button>

            {/* View Mode Switcher (Grid vs List) */}
            <div className="hidden sm:flex items-center bg-[var(--surface-soft)] border border-[var(--border)] rounded-xl p-1 shrink-0">
              <button
                onClick={() => setViewMode("grid")}
                title="Grid View"
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${viewMode === "grid"
                  ? "bg-[var(--surface)] text-[var(--accent)] shadow-sm font-extrabold"
                  : "text-[var(--muted)] hover:text-[var(--text)]"
                  }`}
              >
                <span>⊞</span> Grid
              </button>
              <button
                onClick={() => setViewMode("list")}
                title="List View"
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${viewMode === "list"
                  ? "bg-[var(--surface)] text-[var(--accent)] shadow-sm font-extrabold"
                  : "text-[var(--muted)] hover:text-[var(--text)]"
                  }`}
              >
                <span>☰</span> List
              </button>
            </div>
          </div>
        </div>

        {/* FLIPKART STYLE TWO-COLUMN WORKSPACE: LEFT FILTERS SIDEBAR + RIGHT PRODUCT CATALOG */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* ================= LEFT SIDEBAR FILTERS (FLIPKART STYLE) ================= */}
          <aside
            className={`lg:col-span-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs overflow-hidden sticky top-24 z-20 ${isMobileFilterOpen ? "block fixed inset-4 z-50 overflow-y-auto bg-[var(--surface)]" : "hidden lg:block"
              }`}
          >
            {/* Sidebar Top Header */}
            <div className="p-4 border-b border-[var(--border-soft)] flex items-center justify-between bg-[var(--surface-soft)]/50">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black tracking-wide uppercase text-[var(--text)]">Filters</span>
                {hasActiveFilters && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-extrabold border border-blue-500/20">
                    Active
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {hasActiveFilters && (
                  <button
                    onClick={handleClearAllFilters}
                    className="text-[11px] font-black uppercase text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors"
                  >
                    Clear All
                  </button>
                )}
                {isMobileFilterOpen && (
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="text-xs p-1 text-[var(--muted)] hover:text-[var(--text)] lg:hidden"
                  >
                    ✕ Close
                  </button>
                )}
              </div>
            </div>

            {/* Active Filters Chips Bar in Sidebar */}
            {hasActiveFilters && (
              <div className="p-3 border-b border-[var(--border-soft)] bg-[var(--surface-soft)]/20 flex flex-wrap gap-1.5">
                {filters.category.map((cat) => (
                  <span
                    key={cat}
                    onClick={() => handleToggleCategory(cat)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-300 border border-blue-500/20 hover:bg-blue-500/20 cursor-pointer transition-all"
                  >
                    {CATEGORY_OPTIONS.find((c) => c.id === cat)?.label || cat} ✕
                  </span>
                ))}
                {filters.level.map((lvl) => (
                  <span
                    key={lvl}
                    onClick={() => handleToggleLevel(lvl)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-slate-500/20 hover:bg-slate-500/20 cursor-pointer transition-all"
                  >
                    {lvl} ✕
                  </span>
                ))}
                {filters.priceRange !== "all" && (
                  <span
                    onClick={() => setFilters((p) => ({ ...p, priceRange: "all" }))}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 cursor-pointer transition-all"
                  >
                    {PRICE_OPTIONS.find((p) => p.id === filters.priceRange)?.label} ✕
                  </span>
                )}
                {filters.minRating > 0 && (
                  <span
                    onClick={() => setFilters((p) => ({ ...p, minRating: 0 }))}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 cursor-pointer transition-all"
                  >
                    {filters.minRating}★ & above ✕
                  </span>
                )}
                {filters.skills.map((s) => (
                  <span
                    key={s}
                    onClick={() => handleToggleSkill(s)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30 hover:bg-sky-500/25 cursor-pointer transition-all"
                  >
                    {s} ✕
                  </span>
                ))}
              </div>
            )}

            {/* Accordion 1: Categories / Domains */}
            <div className="border-b border-[var(--border-soft)]">
              <button
                onClick={() => toggleSection("categories")}
                className="w-full px-4 py-3.5 flex items-center justify-between text-xs font-black uppercase tracking-wider text-[var(--text)] hover:bg-[var(--surface-soft)]/50 transition-colors"
              >
                <span>Category / Domain</span>
                <span className="text-[var(--muted)]">{expandedSections.categories ? "−" : "+"}</span>
              </button>
              {expandedSections.categories && (
                <div className="px-4 pb-3.5 space-y-2">
                  {CATEGORY_OPTIONS.map((cat) => {
                    const checked = filters.category.includes(cat.id);
                    const count = categoryCounts[cat.id] || 0;
                    return (
                      <label
                        key={cat.id}
                        className="flex items-center justify-between gap-2 text-xs font-medium text-[var(--text)] hover:text-[var(--accent)] cursor-pointer group select-none"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => handleToggleCategory(cat.id)}
                            className="rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)] cursor-pointer"
                          />
                          <span className={checked ? "font-bold text-[var(--accent)]" : ""}>{cat.label}</span>
                        </div>
                        <span className="text-[10px] text-[var(--muted)] font-mono">({count})</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>



            {/* Accordion 3: Customer Ratings (Flipkart Green Star Badges) */}
            <div className="border-b border-[var(--border-soft)]">
              <button
                onClick={() => toggleSection("rating")}
                className="w-full px-4 py-3.5 flex items-center justify-between text-xs font-black uppercase tracking-wider text-[var(--text)] hover:bg-[var(--surface-soft)]/50 transition-colors"
              >
                <span>Customer Ratings</span>
                <span className="text-[var(--muted)]">{expandedSections.rating ? "−" : "+"}</span>
              </button>
              {expandedSections.rating && (
                <div className="px-4 pb-3.5 space-y-2">
                  {RATING_OPTIONS.map((r) => {
                    const checked = filters.minRating === r.value;
                    return (
                      <label
                        key={r.value}
                        className="flex items-center gap-2 text-xs font-medium text-[var(--text)] hover:text-[var(--accent)] cursor-pointer select-none"
                      >
                        <input
                          type="radio"
                          name="rating-filter"
                          checked={checked}
                          onChange={() =>
                            setFilters((prev) => ({ ...prev, minRating: checked ? 0 : r.value }))
                          }
                          className="text-[var(--accent)] focus:ring-[var(--accent)] cursor-pointer"
                        />
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-extrabold text-[11px] border border-emerald-500/30">
                          {r.value} ★
                        </span>
                        <span className="text-xs text-[var(--muted)]">& above</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Accordion 4: Difficulty Level */}
            <div className="border-b border-[var(--border-soft)]">
              <button
                onClick={() => toggleSection("level")}
                className="w-full px-4 py-3.5 flex items-center justify-between text-xs font-black uppercase tracking-wider text-[var(--text)] hover:bg-[var(--surface-soft)]/50 transition-colors"
              >
                <span>Difficulty Level</span>
                <span className="text-[var(--muted)]">{expandedSections.level ? "−" : "+"}</span>
              </button>
              {expandedSections.level && (
                <div className="px-4 pb-3.5 space-y-2">
                  {LEVEL_OPTIONS.map((lvl) => {
                    const checked = filters.level.includes(lvl.id);
                    return (
                      <label
                        key={lvl.id}
                        className="flex items-center justify-between gap-2 text-xs font-medium text-[var(--text)] hover:text-[var(--accent)] cursor-pointer select-none"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => handleToggleLevel(lvl.id)}
                            className="rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)] cursor-pointer"
                          />
                          <span className={checked ? "font-bold text-[var(--accent)]" : ""}>{lvl.label}</span>
                        </div>
                        <span className={`w-2 h-2 rounded-full ${lvl.color}`} />
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Accordion 5: Technologies & Skills */}
            <div className="border-b border-[var(--border-soft)]">
              <button
                onClick={() => toggleSection("skills")}
                className="w-full px-4 py-3.5 flex items-center justify-between text-xs font-black uppercase tracking-wider text-[var(--text)] hover:bg-[var(--surface-soft)]/50 transition-colors"
              >
                <span>Technologies & Skills</span>
                <span className="text-[var(--muted)]">{expandedSections.skills ? "−" : "+"}</span>
              </button>
              {expandedSections.skills && (
                <div className="px-4 pb-3.5 space-y-2.5">
                  <input
                    type="text"
                    value={skillSearch}
                    onChange={(e) => setSkillSearch(e.target.value)}
                    placeholder="Search skills (e.g. Rust)..."
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--surface-soft)] border border-[var(--border)] text-[11px] text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                  />
                  <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 text-xs">
                    {filteredSkillOptions.map((s) => {
                      const checked = filters.skills.includes(s);
                      return (
                        <label
                          key={s}
                          className="flex items-center gap-2 text-[11px] font-medium text-[var(--text)] hover:text-[var(--accent)] cursor-pointer select-none"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => handleToggleSkill(s)}
                            className="rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)] cursor-pointer"
                          />
                          <span className={checked ? "font-bold text-[var(--accent)]" : ""}>{s}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 6: Special Perks / Features (Flipkart Assured Style) */}
            <div className="border-b border-[var(--border-soft)]">
              <button
                onClick={() => toggleSection("features")}
                className="w-full px-4 py-3.5 flex items-center justify-between text-xs font-black uppercase tracking-wider text-[var(--text)] hover:bg-[var(--surface-soft)]/50 transition-colors"
              >
                <span>Perks & Badges</span>
                <span className="text-[var(--muted)]">{expandedSections.features ? "−" : "+"}</span>
              </button>
              {expandedSections.features && (
                <div className="px-4 pb-3.5 space-y-2">
                  {FEATURE_OPTIONS.map((f) => {
                    const checked = filters.features.includes(f.id);
                    return (
                      <label
                        key={f.id}
                        className="flex items-center gap-2 text-xs font-medium text-[var(--text)] hover:text-[var(--accent)] cursor-pointer select-none"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleToggleFeature(f.id)}
                          className="rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)] cursor-pointer"
                        />
                        <span className={checked ? "font-bold text-[var(--accent)]" : ""}>{f.label}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Accordion 7: Duration */}
            <div>
              <button
                onClick={() => toggleSection("duration")}
                className="w-full px-4 py-3.5 flex items-center justify-between text-xs font-black uppercase tracking-wider text-[var(--text)] hover:bg-[var(--surface-soft)]/50 transition-colors"
              >
                <span>Course Duration</span>
                <span className="text-[var(--muted)]">{expandedSections.duration ? "−" : "+"}</span>
              </button>
              {expandedSections.duration && (
                <div className="px-4 pb-3.5 space-y-2">
                  {DURATION_OPTIONS.map((d) => {
                    const checked = filters.duration.includes(d.id);
                    return (
                      <label
                        key={d.id}
                        className="flex items-center gap-2 text-xs font-medium text-[var(--text)] hover:text-[var(--accent)] cursor-pointer select-none"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleToggleDuration(d.id)}
                          className="rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)] cursor-pointer"
                        />
                        <span className={checked ? "font-bold text-[var(--accent)]" : ""}>{d.label}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Mobile Apply Button */}
            {isMobileFilterOpen && (
              <div className="p-4 border-t border-[var(--border-soft)] bg-[var(--surface)] lg:hidden">
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="button w-full text-xs font-black py-3"
                >
                  Apply Filters ({filteredCourses.length} results)
                </button>
              </div>
            )}
          </aside>

          {/* ================= RIGHT MAIN CATALOG (FLIPKART STYLE SORT TABS + PRODUCT FEED) ================= */}
          <section className="lg:col-span-9 space-y-4">

            {/* Top Sort By Tabs Bar (Flipkart Style Horizontal Sort Header) */}
            <div className="p-3 sm:px-4 rounded-2xl bg-[var(--surface)] border border-[var(--border-soft)] shadow-md flex flex-wrap items-center justify-between gap-3">

              {/* Result Summary */}
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--text)]">
                <span>Showing <strong className="text-[var(--accent)] font-bold">{filteredCourses.length}</strong> masterclasses</span>
                {searchQuery && (
                  <span className="text-[var(--muted)] font-normal">for "{searchQuery}"</span>
                )}
              </div>

              {/* Flipkart Style Sort Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar text-xs font-semibold">
                <span className="text-[11px] uppercase tracking-wider text-[var(--muted)] font-extrabold mr-1">
                  Sort By:
                </span>
                {[
                  { id: "popular", label: "Popularity" },
                  { id: "rating", label: "Highest Rated" },
                  { id: "newest", label: "Newest / Extensive" },
                ].map((s) => {
                  const active = sortBy === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSortBy(s.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs transition-all whitespace-nowrap ${active
                        ? "bg-[var(--accent)] text-white font-black shadow-sm"
                        : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-soft)]"
                        }`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Empty State */}
            {filteredCourses.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-4 shadow-xs">
                <div className="w-16 h-16 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-3xl flex items-center justify-center mx-auto">
                  🔍
                </div>
                <h3 className="text-lg font-black">No masterclasses match your chosen filters</h3>
                <p className="text-xs text-[var(--muted)] max-w-md mx-auto leading-relaxed">
                  Try clearing some filter tags or searching with broader keywords to discover our interactive curriculum.
                </p>
                <button
                  onClick={handleClearAllFilters}
                  className="button button-sm text-xs font-bold mx-auto mt-2"
                >
                  Reset All Filters
                </button>
              </div>
            ) : viewMode === "grid" ? (
              /* ================= GRID VIEW ================= */
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr">
                {filteredCourses.map((c) => {
                  const enrolled = isEnrolled(c.id);
                  const progress = getCourseProgress(c.id);

                  return (
                    <article
                      key={c.id}
                      className="group relative rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-blue-500/50 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden text-left h-full"
                    >
                      <div className="flex flex-col flex-1 justify-between">
                        <div>
                          {/* Standardized Course Image Thumbnail */}
                          <div className="relative h-44 w-full overflow-hidden bg-[var(--surface-soft)] shrink-0">
                            {c.thumbnailUrl ? (
                              <img
                                src={c.thumbnailUrl}
                                alt={c.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                loading="lazy"
                              />
                            ) : (
                              <div
                                className="w-full h-full"
                                style={{ background: c.bannerGradient || "linear-gradient(135deg, #1e293b 0%, #334155 100%)" }}
                              />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

                            {/* Top Badges */}
                            <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between gap-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-900/80 text-white backdrop-blur-md border border-white/10 shadow-sm">
                                {c.categoryLabel}
                              </span>

                              <div className="flex items-center gap-1.5">
                                {c.bestseller && (
                                  <span className="text-[10px] font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-sm">
                                    ★ BESTSELLER
                                  </span>
                                )}
                                {c.featured && !c.bestseller && (
                                  <span className="text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-blue-600 text-white shadow-sm">
                                    FEATURED
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Bottom Overlay on Thumbnail */}
                            <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between">
                              <span className="text-[11px] font-mono text-white/90 bg-slate-900/80 backdrop-blur-md px-2.5 py-0.5 rounded-md font-semibold border border-white/10">
                                ⏱ {c.duration} • {c.lessonsCount} units
                              </span>

                              <Link
                                to={`/learn/${c.id}`}
                                className="px-3 py-1 rounded-lg bg-white/20 hover:bg-white text-white hover:text-slate-950 text-[11px] font-bold backdrop-blur-md border border-white/20 transition-all flex items-center gap-1"
                              >
                                <span>Preview</span>
                                <Icon name="arrow" size={12} />
                              </Link>
                            </div>
                          </div>

                          {/* Card Content Body */}
                          <div className="p-4 sm:p-5 space-y-3">
                            {/* Rating & Level Meta Row */}
                            <div className="flex items-center justify-between text-[11px]">
                              <div className="flex items-center gap-1.5">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-600 text-white font-bold text-[11px] shadow-xs">
                                  {c.rating} ★
                                </span>
                                <span className="text-[var(--muted)] font-semibold">
                                  ({c.studentsCount.toLocaleString()})
                                </span>
                              </div>

                              <span className="flex items-center gap-1.5 text-[var(--muted)] font-semibold">
                                <span
                                  className={`w-2 h-2 rounded-full inline-block ${c.level === "Beginner"
                                    ? "bg-emerald-500"
                                    : c.level === "Intermediate"
                                      ? "bg-amber-500"
                                      : "bg-rose-500"
                                    }`}
                                />
                                {c.level}
                              </span>
                            </div>

                            {/* Title & Tagline with Fixed Heights to Guarantee Equal Card Alignments */}
                            <div className="space-y-1">
                              <Link to={`/learn/${c.id}`}>
                                <h3 className="text-base font-bold text-[var(--text)] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1 leading-snug min-h-[1.5rem]">
                                  {c.title}
                                </h3>
                              </Link>
                              <p className="text-xs text-[var(--muted)] line-clamp-2 leading-relaxed min-h-[2.5rem]">
                                {c.tagline}
                              </p>
                            </div>

                            {/* Standard Feature Bullets */}
                            <div className="space-y-1 pt-1 text-[11px] text-[var(--muted)] border-t border-[var(--border-soft)]">
                              <div className="flex items-center gap-1.5">
                                <span className="text-blue-600 dark:text-blue-400 font-bold">✓</span>
                                <span className="truncate">⏱ {c.duration} of interactive masterclasses</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-emerald-500 font-bold">✓</span>
                                <span className="truncate">Production projects & architectural capstones</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-sky-500 font-bold">✓</span>
                                <span className="truncate">Verified Industry Certificate on completion</span>
                              </div>
                            </div>

                            {/* Skills Pills with Fixed Height Container */}
                            <div className="flex flex-wrap items-center gap-1.5 pt-1 min-h-[1.75rem]">
                              {c.skills.slice(0, 3).map((skill) => (
                                <span
                                  key={skill}
                                  className="px-2 py-0.5 rounded-md bg-[var(--surface-soft)] border border-[var(--border-soft)] text-[10px] text-[var(--text)] font-medium"
                                >
                                  {skill}
                                </span>
                              ))}
                              {c.skills.length > 3 && (
                                <span className="text-[10px] text-[var(--muted)] font-semibold self-center">
                                  +{c.skills.length - 3}
                                </span>
                              )}
                            </div>

                            {/* Enrolled Progress Bar */}
                            {enrolled && (
                              <div className="p-2.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border-soft)] space-y-1">
                                <div className="flex items-center justify-between text-[10px] font-bold">
                                  <span className="text-blue-600 dark:text-blue-400 font-semibold">Progress</span>
                                  <span>{progress.percentage}%</span>
                                </div>
                                <div className="w-full h-1.5 rounded-full bg-[var(--surface)] overflow-hidden">
                                  <div
                                    className="h-full rounded-full bg-blue-600 dark:bg-blue-500"
                                    style={{ width: `${progress.percentage}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Card Footer: Instructor Profile & CTA - Pinned to Exact Bottom Baseline */}
                        <div className="p-4 sm:p-5 pt-3 border-t border-[var(--border-soft)] bg-[var(--surface-soft)]/40 flex items-center justify-between gap-3 mt-auto">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-7 h-7 rounded-full bg-blue-600/10 text-blue-600 dark:text-blue-400 font-bold text-[11px] flex items-center justify-center shrink-0 border border-blue-500/20">
                              {c.instructor.avatar}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-[var(--text)] truncate">
                                {c.instructor.name}
                              </p>
                              <p className="text-[10px] text-[var(--muted)] truncate">
                                {c.instructor.company}
                              </p>
                            </div>
                          </div>

                          <div>
                            {enrolled ? (
                              <Link
                                to={`/learn/${c.id}`}
                                className="button button-sm text-xs font-bold shadow-xs inline-flex items-center gap-1"
                              >
                                Continue →
                              </Link>
                            ) : (
                              <button
                                onClick={() => {
                                  enrollInCourse(c.id);
                                  navigate(`/learn/${c.id}`);
                                }}
                                className="button button-sm text-xs font-bold shadow-xs inline-flex items-center gap-1"
                              >
                                Start Learning →
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              /* ================= LIST VIEW ================= */
              <div className="space-y-4">
                {filteredCourses.map((c) => {
                  const enrolled = isEnrolled(c.id);
                  const progress = getCourseProgress(c.id);

                  return (
                    <article
                      key={c.id}
                      className="group rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-blue-500/50 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 p-5 grid grid-cols-1 md:grid-cols-12 gap-5 items-center"
                    >
                      {/* Left Image Thumbnail (3 cols) */}
                      <div className="md:col-span-3 h-44 rounded-xl relative overflow-hidden bg-[var(--surface-soft)]">
                        {c.thumbnailUrl ? (
                          <img
                            src={c.thumbnailUrl}
                            alt={c.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        ) : (
                          <div
                            className="w-full h-full"
                            style={{ background: c.bannerGradient || "linear-gradient(135deg, #1e293b 0%, #334155 100%)" }}
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />
                        <div className="absolute top-3 left-3 z-10">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-900/80 text-white backdrop-blur-md border border-white/10 shadow-sm">
                            {c.categoryLabel}
                          </span>
                        </div>
                        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between text-white text-[11px]">
                          <span className="font-mono bg-slate-900/80 backdrop-blur-md px-2.5 py-0.5 rounded-md border border-white/10">
                            ⏱ {c.duration}
                          </span>
                          <span className="text-amber-300 font-bold bg-slate-900/80 backdrop-blur-md px-2.5 py-0.5 rounded-md border border-white/10 flex items-center gap-1">
                            ★ {c.rating}
                          </span>
                        </div>
                      </div>

                      {/* Middle Highlights & Specs (6 cols) */}
                      <div className="md:col-span-6 space-y-2.5">
                        <div className="flex items-center gap-2">
                          <Link to={`/learn/${c.id}`}>
                            <h3 className="text-base font-bold text-[var(--text)] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {c.title}
                            </h3>
                          </Link>
                          {c.bestseller && (
                            <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-xs">
                              Bestseller
                            </span>
                          )}
                        </div>

                        {/* Rating Row */}
                        <div className="flex items-center gap-2 text-xs">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-600 text-white font-bold text-[11px] shadow-xs">
                            {c.rating} ★
                          </span>
                          <span className="text-[var(--muted)] font-semibold">
                            ({c.studentsCount.toLocaleString()} learners)
                          </span>
                          <span className="text-[var(--muted)]">•</span>
                          <span className="text-[var(--muted)] font-semibold">{c.level}</span>
                          <span className="text-[var(--muted)]">•</span>
                          <span className="text-[var(--muted)] font-semibold">{c.duration}</span>
                        </div>

                        <p className="text-xs text-[var(--muted)] line-clamp-2">
                          {c.tagline}
                        </p>

                        {/* Highlights List */}
                        <ul className="text-[11px] text-[var(--muted)] space-y-1">
                          <li className="flex items-center gap-1.5">
                            <span className="text-blue-600 dark:text-blue-400 font-bold">⚡</span>
                            <span>Comprehensive syllabus with hands-on capstone architecture</span>
                          </li>
                          <li className="flex items-center gap-1.5">
                            <span className="text-emerald-500 font-bold">📜</span>
                            <span>Cryptographically verifiable completion certificate</span>
                          </li>
                        </ul>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {c.skills.map((s) => (
                            <span
                              key={s}
                              className="px-2 py-0.5 rounded-md bg-[var(--surface-soft)] border border-[var(--border-soft)] text-[10px] font-medium text-[var(--text)]"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Right CTAs (3 cols) */}
                      <div className="md:col-span-3 md:border-l border-[var(--border-soft)] md:pl-5 space-y-3 flex flex-col justify-between h-full">
                        <div>
                          <span className="text-xs font-bold text-[var(--accent)] block">
                            Full Access Included
                          </span>
                          <span className="text-[10px] text-[var(--muted)] block mt-0.5">
                            Complete Masterclass & Certificate
                          </span>
                          <div className="mt-2 text-xs text-[var(--muted)]">
                            Instructor: <strong className="text-[var(--text)]">{c.instructor.name}</strong>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {enrolled ? (
                            <Link
                              to={`/learn/${c.id}`}
                              className="button button-sm w-full text-xs font-bold text-center block shadow-md"
                            >
                              Continue Learning →
                            </Link>
                          ) : (
                            <button
                              onClick={() => {
                                enrollInCourse(c.id);
                                navigate(`/learn/${c.id}`);
                              }}
                              className="button button-sm w-full text-xs font-bold text-center block shadow-md"
                            >
                              Start Learning →
                            </button>
                          )}
                          <Link
                            to={`/learn/${c.id}`}
                            className="w-full text-center block text-xs text-[var(--muted)] hover:text-[var(--text)] font-semibold"
                          >
                            View Syllabus & Preview
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
