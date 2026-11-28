"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useSearchParams, useNavigate } from "react-router";
import { useCourses, type Course } from "../context/CourseContext";
import { useTheme } from "../theme";
import { SiteNav, SiteFooter, Icon } from "../../App";
import CourseCard from "./CourseCard";
import CoursePreviewModal from "./CoursePreviewModal";

interface FilterState {
  category: string[];
  level: string[];
  minRating: number;
  duration: string[];
  skills: string[];
  features: string[]; // "certificate", "bestseller", "featured"
  priceRange?: string;
}

const PRICE_OPTIONS = [
  { id: "all", label: "All Prices" },
  { id: "free", label: "Free ($0)" },
  { id: "paid", label: "Paid / Pro" },
];

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
  const [previewCourse, setPreviewCourse] = useState<Course | null>(null);

  // Category dropdown state
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(e.target as Node)) {
        setShowCategoryDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    priceRange: "all",
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
    (!!filters.priceRange && filters.priceRange !== "all") ||
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

  const activeCategoryLabel =
    filters.category.length === 1
      ? CATEGORY_OPTIONS.find((c) => c.id === filters.category[0])?.label || "Category"
      : filters.category.length > 1
        ? `${filters.category.length} Categories`
        : "All Categories";

  return (
    <div className={`subpage app ${dark ? "dark" : ""} min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)] transition-colors duration-200`}>
      <div className="subpage-noise" />
      <SiteNav />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-32 space-y-6">

        {/* ================= SLEEK & MODERN HERO TITLE ================= */}
        <div className="space-y-1.5 max-w-2xl pb-1">
          {/* Top Sparkles & "Your Learning Journey" Badge */}
          <div className="flex items-center gap-2">
            <span className="text-purple-500 dark:text-purple-400 text-xs font-mono font-bold select-none tracking-tighter">
              \ | /
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200/80 dark:border-purple-800/60 text-purple-600 dark:text-purple-400 text-xs font-extrabold shadow-2xs">
              <span>★</span>
              <span>Your Learning Journey</span>
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-black text-[var(--text)] tracking-tight">
            Explore Our Courses
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
            Build in-demand skills with expertly curated courses and hands-on projects.
          </p>
        </div>

        {/* ================= STICKY SEARCH & CONTROLS BAR (STOPS JUST BELOW NAVBAR) ================= */}
        <div className="sticky top-[86px] sm:top-[90px] z-30 py-3 px-4 sm:px-6 rounded-2xl bg-[var(--surface)]/95 backdrop-blur-xl border border-[var(--border)] shadow-sm transition-all flex flex-wrap items-center justify-between gap-3">
          {/* Left: Active Results Count */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[var(--muted)]">
              Showing <strong className="text-[var(--text)]">{filteredCourses.length}</strong> masterclasses
            </span>
            {hasActiveFilters && (
              <button
                onClick={handleClearAllFilters}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-bold cursor-pointer"
              >
                Reset Filters ✕
              </button>
            )}
          </div>

          {/* Right: Integrated Controls (Search Pill + Category Dropdown + Grid/List) */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
            {/* Search Pill */}
            <div className="relative flex-1 sm:w-64 sm:flex-initial">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" strokeWidth="2" />
                  <path d="m21 21-4.3-4.3" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses..."
                className="w-full pl-9 pr-8 py-2 rounded-full bg-[var(--surface-soft)] border border-[var(--border)] text-xs sm:text-sm text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--text)] p-0.5 rounded-full text-xs cursor-pointer"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Pill Dropdown */}
            <div ref={categoryDropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="px-4 py-2 rounded-full bg-[var(--surface-soft)] hover:bg-[var(--surface)] border border-[var(--border)] text-xs font-semibold text-[var(--text)] flex items-center gap-2 transition-all shadow-2xs cursor-pointer whitespace-nowrap"
              >
                <span>{activeCategoryLabel}</span>
                <svg
                  className={`w-3.5 h-3.5 text-[var(--muted)] transition-transform ${showCategoryDropdown ? "rotate-180" : ""}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showCategoryDropdown && (
                <div className="absolute right-0 top-full mt-2 w-60 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xl py-1.5 z-50 animate-scale-in text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => {
                      setFilters((prev) => ({ ...prev, category: [] }));
                      setShowCategoryDropdown(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 hover:bg-[var(--surface-soft)] flex items-center justify-between transition-colors cursor-pointer ${filters.category.length === 0 ? "text-blue-600 dark:text-blue-400 font-bold" : "text-[var(--text)]"
                      }`}
                  >
                    <span>All Categories</span>
                    {filters.category.length === 0 && <span>✓</span>}
                  </button>
                  {CATEGORY_OPTIONS.map((cat) => {
                    const isSelected = filters.category.includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setFilters((prev) => ({ ...prev, category: [cat.id] }));
                          setShowCategoryDropdown(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 hover:bg-[var(--surface-soft)] flex items-center justify-between transition-colors cursor-pointer ${isSelected ? "text-blue-600 dark:text-blue-400 font-bold" : "text-[var(--text)]"
                          }`}
                      >
                        <span>{cat.label}</span>
                        {isSelected && <span>✓</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Mobile Filter Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="lg:hidden px-3.5 py-2 rounded-full bg-[var(--surface-soft)] border border-[var(--border)] text-xs font-bold text-[var(--text)] flex items-center gap-1.5"
            >
              <span>⚙️</span> Filters
            </button>

            {/* Grid / List Switcher */}
            <div className="hidden sm:flex items-center bg-[var(--surface-soft)] border border-[var(--border)] rounded-full p-0.5">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`px-2.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${viewMode === "grid"
                  ? "bg-[var(--surface)] text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-[var(--muted)] hover:text-[var(--text)]"
                  }`}
                title="Grid View"
              >
                <span>⊞</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`px-2.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${viewMode === "list"
                  ? "bg-[var(--surface)] text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-[var(--muted)] hover:text-[var(--text)]"
                  }`}
                title="List View"
              >
                <span>☰</span>
              </button>
            </div>
          </div>
        </div>

        {/* FLIPKART STYLE TWO-COLUMN WORKSPACE: LEFT FILTERS SIDEBAR + RIGHT PRODUCT CATALOG */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* ================= LEFT SIDEBAR FILTERS (FLIPKART STYLE) ================= */}
          <aside
            className={`lg:col-span-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs overflow-hidden sticky top-[152px] z-20 max-h-[calc(100vh-10.5rem)] overflow-y-auto ${isMobileFilterOpen ? "block fixed inset-4 z-[60] overflow-y-auto bg-[var(--surface)]" : "hidden lg:block"
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
                    <CourseCard
                      key={c.id}
                      course={c}
                      isEnrolled={enrolled}
                      progressPercent={progress?.percentage || 0}
                      onPreview={(course) => setPreviewCourse(course)}
                      onStartLearning={(course) => {
                        if (enrolled) {
                          navigate(`/learn/${course.id}`);
                        } else {
                          setPreviewCourse(course);
                        }
                      }}
                    />
                  );
                })}
              </div>
            ) : (
              /* ================= LIST VIEW (MATCHING GRID DESIGN) ================= */
              <div className="space-y-4">
                {filteredCourses.map((c) => {
                  const enrolled = isEnrolled(c.id);
                  const progress = getCourseProgress(c.id);

                  return (
                    <CourseCard
                      key={c.id}
                      course={c}
                      isEnrolled={enrolled}
                      progressPercent={progress?.percentage || 0}
                      layout="list"
                      onPreview={(course) => setPreviewCourse(course)}
                      onStartLearning={(course) => {
                        if (enrolled) {
                          navigate(`/learn/${course.id}`);
                        } else {
                          setPreviewCourse(course);
                        }
                      }}
                    />
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Course Preview Modal for Unenrolled Users */}
      <CoursePreviewModal
        course={previewCourse}
        isOpen={!!previewCourse}
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
