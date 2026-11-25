import React from "react";
import type { NavigableItem } from "../types";

interface BreadcrumbToolbarProps {
  courseTitle: string;
  activeItem?: NavigableItem;
  activeIndex: number;
  totalItems: number;
  isBookmarked: boolean;
  isCompleted: boolean;
  onPrev: () => void;
  onNext: () => void;
  onToggleBookmark: () => void;
  onCompleteLesson: () => void;
}

export default function BreadcrumbToolbar({
  courseTitle,
  activeItem,
  activeIndex,
  totalItems,
  isBookmarked,
  isCompleted,
  onPrev,
  onNext,
  onToggleBookmark,
  onCompleteLesson,
}: BreadcrumbToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--border-soft)] shadow-sm">
      {/* Breadcrumb Hierarchy Path */}
      <div className="flex items-center gap-1.5 text-xs text-[var(--muted)] min-w-0 flex-wrap">
        <span className="text-purple-400 font-bold">{courseTitle}</span>
        <span>/</span>
        <span className="truncate max-w-[200px]">{activeItem?.moduleTitle}</span>
        {activeItem?.submoduleTitle && activeItem.submoduleTitle !== activeItem.title && (
          <>
            <span>/</span>
            <span className="truncate max-w-[150px]">{activeItem.submoduleTitle}</span>
          </>
        )}
        <span>/</span>
        <span className="font-extrabold text-[var(--text)] truncate max-w-[220px]">
          {activeItem?.title}
        </span>
      </div>

      {/* Quick Action Controls */}
      <div className="flex items-center gap-2 shrink-0 flex-wrap">
        {/* Prev Button */}
        <button
          onClick={onPrev}
          disabled={activeIndex <= 0}
          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[var(--surface-soft)] hover:bg-[var(--surface)] border border-[var(--border)] disabled:opacity-40 transition-colors cursor-pointer"
          title="Previous Topic"
        >
          ◀ Prev
        </button>

        {/* Next Button */}
        <button
          onClick={onNext}
          disabled={activeIndex >= totalItems - 1}
          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[var(--surface-soft)] hover:bg-[var(--surface)] border border-[var(--border)] disabled:opacity-40 transition-colors cursor-pointer"
          title="Next Topic"
        >
          Next ▶
        </button>

        {/* Bookmark Button */}
        <button
          onClick={onToggleBookmark}
          className={`px-3 py-1.5 rounded-xl font-bold text-xs border transition-all flex items-center gap-1.5 cursor-pointer ${
            isBookmarked
              ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
              : "bg-[var(--surface-soft)] border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)]"
          }`}
          title="Save bookmark & code to Notes Hub"
        >
          <span>{isBookmarked ? "★ Saved" : "☆ Bookmark"}</span>
        </button>

        {/* Complete Lesson CTA */}
        <button
          onClick={onCompleteLesson}
          className={`px-4 py-1.5 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
            isCompleted
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm"
              : "bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/25"
          }`}
        >
          <span>{isCompleted ? "✓ Completed (+100 XP)" : "Mark Complete & Next"}</span>
        </button>
      </div>
    </div>
  );
}
