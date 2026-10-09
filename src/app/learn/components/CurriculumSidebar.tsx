import React from "react";
import type { Course } from "../../context/CourseContext";
import type { NavigableItem, SyllabusTypeFilter } from "../types";

interface CurriculumSidebarProps {
  course: Course;
  navigableItems: NavigableItem[];
  activeItemId: string;
  completedCount: number;
  totalCount: number;
  percentage: number;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  typeFilter: SyllabusTypeFilter;
  onTypeFilterChange: (type: SyllabusTypeFilter) => void;
  onSelectItem: (item: NavigableItem) => void;
  onCloseSidebar: () => void;
  isLessonCompleted: (lessonId: string) => boolean;
}

const FILTER_OPTIONS: Array<{ id: SyllabusTypeFilter; label: string }> = [
  { id: "all", label: "All" },
  { id: "video", label: "🎥 Video" },
  { id: "reading", label: "📄 Theory" },
  { id: "lab", label: "🔬 Lab" },
  { id: "quiz", label: "🧠 Quiz" },
];

export default function CurriculumSidebar({
  course,
  navigableItems,
  activeItemId,
  completedCount,
  totalCount,
  percentage,
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  onSelectItem,
  onCloseSidebar,
  isLessonCompleted,
}: CurriculumSidebarProps) {
  const filteredNavItems = navigableItems.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    const matchQuery =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.moduleTitle.toLowerCase().includes(q) ||
      (item.submoduleTitle && item.submoduleTitle.toLowerCase().includes(q));
    const matchType = typeFilter === "all" || item.type === typeFilter;
    return matchQuery && matchType;
  });

  return (
    <aside className="w-full lg:w-[380px] xl:w-[410px] shrink-0 border-r border-[var(--border-soft)] bg-[var(--surface)] flex flex-col h-full overflow-hidden z-20 shadow-2xl transition-all duration-200">
      {/* Top Header & Progress */}
      <div className="p-4 border-b border-[var(--border-soft)] bg-[var(--surface-soft)]/60 space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
            <h3 className="text-xs font-black uppercase tracking-wider text-[var(--text)]">
              Curriculum Hierarchy
            </h3>
          </div>
          <button
            onClick={onCloseSidebar}
            className="p-1 rounded-lg hover:bg-[var(--surface)] text-xs text-[var(--muted)] hover:text-[var(--text)] cursor-pointer"
            title="Collapse Syllabus"
          >
            ◀
          </button>
        </div>

        {/* Completion Gauge */}
        <div className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border-soft)] space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span className="text-emerald-400">
              ✓ {completedCount} of {totalCount} Topics Mastered
            </span>
            <span className="text-[var(--muted)] font-mono text-[10px]">
              +{completedCount * 100} XP
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[var(--surface-soft)] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-400 transition-all duration-500 rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search modules, topics, labs..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-[var(--surface)] border border-[var(--border-soft)] text-xs text-[var(--text)] outline-none focus:border-purple-500"
          />
          <span className="absolute left-2.5 top-1.5 text-xs text-[var(--muted)]">🔍</span>
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1.5 text-xs text-[var(--muted)] hover:text-[var(--text)] cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Type Filter Pills */}
        <div className="grid grid-cols-5 gap-1 pt-0.5">
          {FILTER_OPTIONS.map((f) => (
            <button
              key={f.id}
              onClick={() => onTypeFilterChange(f.id)}
              className={`py-1 rounded-lg text-[10px] font-bold text-center truncate transition-all cursor-pointer ${
                typeFilter === f.id
                  ? "bg-purple-600 text-white shadow-xs"
                  : "bg-[var(--surface)] border border-[var(--border-soft)] text-[var(--muted)] hover:text-[var(--text)]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Curriculum Tree */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {filteredNavItems.length === 0 ? (
          <div className="p-8 text-center text-xs text-[var(--muted)] space-y-2">
            <div className="text-2xl">🔎</div>
            <p>No topics match your current filter.</p>
            <button
              onClick={() => {
                onSearchChange("");
                onTypeFilterChange("all");
              }}
              className="text-purple-400 font-bold hover:underline text-[11px] cursor-pointer"
            >
              Clear Filter
            </button>
          </div>
        ) : (
          course.modules.map((mod, modIdx) => {
            const modItems = filteredNavItems.filter((i) => i.moduleId === mod.id);
            if (modItems.length === 0) return null;

            return (
              <div
                key={mod.id}
                className="border border-[var(--border-soft)] rounded-2xl overflow-hidden bg-[var(--surface)] shadow-sm"
              >
                {/* Module Root Header */}
                <div className="p-3 bg-[var(--surface-soft)] border-b border-[var(--border-soft)] flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-5 h-5 rounded-lg bg-purple-500/20 text-purple-400 font-black text-[10px] flex items-center justify-center shrink-0">
                      {modIdx + 1}
                    </span>
                    <h4 className="text-xs font-black truncate text-[var(--text)]">{mod.title}</h4>
                  </div>
                  <span className="text-[10px] font-bold text-[var(--muted)] shrink-0 ml-2 font-mono">
                    {mod.duration}
                  </span>
                </div>

                {/* Items in Module */}
                <div className="divide-y divide-[var(--border-soft)]">
                  {modItems.map((item) => {
                    const isSelected = item.id === activeItemId;
                    const isDone = isLessonCompleted(item.id);
                    const quizCount = item.quizzes?.length || 0;

                    return (
                      <button
                        key={item.id}
                        onClick={() => onSelectItem(item)}
                        className={`w-full p-2.5 text-left flex items-start gap-2.5 transition-all cursor-pointer group ${
                          isSelected
                            ? "bg-purple-600/15 text-purple-300 font-bold border-l-4 border-purple-500 shadow-inner"
                            : "hover:bg-[var(--surface-soft)] text-[var(--text)]"
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black transition-colors ${
                            isDone
                              ? "bg-emerald-500 text-white"
                              : isSelected
                              ? "border-2 border-purple-500 text-purple-400 bg-purple-500/20"
                              : "border border-gray-600 text-gray-500 group-hover:border-gray-400"
                          }`}
                        >
                          {isDone ? "✓" : isSelected ? "▶" : "○"}
                        </span>

                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs">
                              {item.type === "video"
                                ? "🎥"
                                : item.type === "lab"
                                ? "🔬"
                                : item.type === "quiz"
                                ? "🧠"
                                : "📄"}
                            </span>
                            <p
                              className={`text-xs leading-snug line-clamp-2 ${
                                isSelected ? "text-purple-400 font-black" : "text-[var(--text)]"
                              }`}
                            >
                              {item.title}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 text-[10px] text-[var(--muted)]">
                            <span>⏱️ {item.duration}</span>
                            <span>•</span>
                            <span className="capitalize">{item.type}</span>
                            {quizCount > 0 && (
                              <>
                                <span>•</span>
                                <span className="text-amber-400 font-bold">🧠 {quizCount} Qs</span>
                              </>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
