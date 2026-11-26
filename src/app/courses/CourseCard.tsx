import { useState } from "react";
import { type Course } from "../context/CourseContext";

interface CourseCardProps {
  course: Course;
  isEnrolled: boolean;
  progressPercent?: number;
  onPreview: (course: Course) => void;
  onStartLearning: (course: Course) => void;
}

export default function CourseCard({
  course,
  isEnrolled,
  progressPercent = 0,
  onPreview,
  onStartLearning,
}: CourseCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Badge mapping based on course properties
  const badgeLabel = course.bestseller
    ? "Bestseller"
    : course.featured
      ? "Trending"
      : course.rating >= 4.7
        ? "Popular"
        : "New";

  const badgeIcon = course.bestseller
    ? "★"
    : course.featured
      ? "🔥"
      : course.rating >= 4.7
        ? "★"
        : "⚡";

  const badgeColor = course.bestseller
    ? "bg-purple-600 text-white"
    : course.featured
      ? "bg-emerald-600 text-white"
      : "bg-teal-600 text-white";

  const levelColor =
    course.level === "Beginner"
      ? "text-emerald-600 dark:text-emerald-400"
      : course.level === "Intermediate"
        ? "text-amber-600 dark:text-amber-400"
        : "text-rose-600 dark:text-rose-400";

  const handleCardClick = () => {
    if (isEnrolled) {
      onStartLearning(course);
    } else {
      onPreview(course);
    }
  };

  return (
    <article
      onClick={handleCardClick}
      className="group relative rounded-3xl bg-[var(--surface)] border border-[var(--border)] hover:border-blue-400/50 dark:hover:border-blue-500/50 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer text-left h-full select-none"
    >
      <div>
        {/* ================= THUMBNAIL CONTAINER (16:10 ASPECT RATIO) ================= */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950 shrink-0">
          {course.thumbnailUrl ? (
            <img
              src={course.thumbnailUrl}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div
              className="w-full h-full"
              style={{ background: course.bannerGradient || "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)" }}
            />
          )}

          {/* Vignette Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none" />

          {/* Top Pill Badges: Status Pill + Bookmark Heart Button */}
          <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between">
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-black tracking-wide shadow-sm ${badgeColor}`}
            >
              <span>{badgeIcon}</span>
              <span>{badgeLabel}</span>
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsBookmarked(!isBookmarked);
              }}
              title={isBookmarked ? "Remove Bookmark" : "Bookmark Course"}
              className={`w-8 h-8 rounded-full backdrop-blur-md border border-white/20 flex items-center justify-center transition-all cursor-pointer ${
                isBookmarked
                  ? "bg-rose-500 text-white"
                  : "bg-black/40 text-white hover:bg-black/60"
              }`}
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>
          </div>

          {/* Bottom Floating Pills on Thumbnail */}
          <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between text-white text-[11px] font-semibold">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 font-mono">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>{course.duration}</span>
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-amber-400 font-bold">
              <span>★</span>
              <span>{course.rating}</span>
            </span>
          </div>
        </div>

        {/* ================= CARD BODY ================= */}
        <div className="p-5 space-y-3">
          {/* Level & Enrolled Stats Row */}
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--muted)]">
            <span className={`inline-flex items-center gap-1 font-bold ${levelColor}`}>
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M4 19h4V9H4v10zm6 0h4V5h-4v14zm6 0h4v-7h-4v7z" />
              </svg>
              <span>{course.level}</span>
            </span>

            <span className="inline-flex items-center gap-1">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z" />
              </svg>
              <span>{course.studentsCount ? `${(course.studentsCount / 1000).toFixed(1)}k+` : "2.5k+"} Enrolled</span>
          </span>
        </div>

        {/* Title with Fixed Height */}
          <h3 className="text-base font-extrabold text-[var(--text)] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1 leading-snug">
            {course.title}
          </h3>

          {/* Description line-clamped */}
            <p className="text-xs text-[var(--muted)] line-clamp-2 leading-relaxed min-h-[2.5rem]">
              {course.tagline || course.description}
            </p>

            {/* Feature Chips Row (Projects, Certificate, Lifetime) */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--surface-soft)] text-[var(--text)] text-[11px] font-semibold border border-[var(--border-soft)]">
                  <span>💻</span> Projects
                </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--surface-soft)] text-[var(--text)] text-[11px] font-semibold border border-[var(--border-soft)]">
                    <span>📜</span> Certificate
                  </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--surface-soft)] text-[var(--text)] text-[11px] font-semibold border border-[var(--border-soft)]">
                      <span>⏱</span> Lifetime
                    </span>
                  </div>

                  {/* Progress bar if enrolled */}
                  {isEnrolled && (
                    <div className="pt-2">
                        <div className="flex items-center justify-between text-[11px] font-bold text-[var(--text)] mb-1">
                          <span className="text-blue-600 dark:text-blue-400">Your Progress</span>
                          <span>{progressPercent}%</span>
                        </div>
                          <div className="w-full h-1.5 rounded-full bg-[var(--surface-soft)] overflow-hidden">
                            <div
                              className="h-full rounded-full bg-blue-600 transition-all duration-500"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                        </div>
          )}
                      </div>
                    </div>

      {/* ================= CARD FOOTER ACTIONS ================= */}
                    <div className="p-5 pt-3 border-t border-[var(--border-soft)] flex items-center justify-between gap-3 mt-auto">
                      {/* Circular Preview Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onPreview(course);
                        }}
                        title="Open Course Preview"
                        className="w-10 h-10 rounded-2xl bg-[var(--surface-soft)] text-[var(--text)] border border-[var(--border)] flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-2xs hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
                      >
                        <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
                        </svg>
                      </button>

        {/* Start Learning / Continue Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStartLearning(course);
          }}
          className={`flex-1 py-2.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all hover:scale-[1.02] active:scale-95 cursor-pointer whitespace-nowrap ${
            isEnrolled
              ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:opacity-90"
              : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20"
          }`}
        >
          <span className="whitespace-nowrap">{isEnrolled ? "Continue Learning" : "Start Learning"}</span>
          <span>→</span>
        </button>
      </div>
    </article>
  );
}
