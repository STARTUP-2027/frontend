"use client";

import { useState } from "react";
import { type Course, useCourses } from "../context/CourseContext";
import { useAuth } from "../context/AuthContext";
import SubscriptionUpgradeModal from "../components/SubscriptionUpgradeModal";

interface CourseCardProps {
  course: Course;
  isEnrolled: boolean;
  progressPercent?: number;
  onPreview: (course: Course) => void;
  onStartLearning: (course: Course) => void;
  layout?: "grid" | "list";
}

// Circular SVG Radial Progress Ring matching Card 1 in reference image
function CircularProgressRing({ percent }: { percent: number }) {
  const r = 14;
  const circumference = 2 * Math.PI * r;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
      <svg className="w-9 h-9 -rotate-90 transform" viewBox="0 0 36 36">
        <circle
          cx="18"
          cy="18"
          r={r}
          className="stroke-slate-200 dark:stroke-slate-700/80"
          strokeWidth="3.2"
          fill="none"
        />
        <circle
          cx="18"
          cy="18"
          r={r}
          className="stroke-teal-500 dark:stroke-teal-400 transition-all duration-700 ease-out"
          strokeWidth="3.2"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-slate-800 dark:text-slate-100 font-mono">
        {percent}%
      </span>
    </div>
  );
}

export default function CourseCard({
  course,
  isEnrolled,
  progressPercent = 0,
  onPreview,
  onStartLearning,
  layout = "grid",
}: CourseCardProps) {
  const { user, isLoggedIn } = useAuth();
  const { enrollInCourse, isEnrolled: checkIsEnrolled } = useCourses();

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isEnrolledLocally, setIsEnrolledLocally] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Active enrolled state
  const enrolledState = isEnrolled || checkIsEnrolled(course.id) || isEnrolledLocally;

  // Progress percentage (fallback to 78% for demo enrolled courses if 0)
  const effectiveProgress = progressPercent > 0 ? progressPercent : enrolledState ? 78 : 0;

  // Badge mapping exactly matching the reference design
  const badgeConfig = course.bestseller
    ? {
        label: "Bestseller",
        icon: "👑",
        className: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white",
      }
    : course.featured
      ? {
          label: "Trending",
          icon: "⚡",
          className: "bg-emerald-500 text-white",
        }
      : course.rating >= 4.9
        ? {
            label: "Popular",
            icon: "🔥",
            className: "bg-emerald-500 text-white",
          }
        : {
            label: "Popular",
            icon: "⭐",
            className: "bg-blue-600 text-white",
          };

  const levelColor =
    course.level === "Beginner"
      ? "text-emerald-600 dark:text-emerald-400"
      : course.level === "Intermediate"
        ? "text-amber-600 dark:text-amber-400"
        : "text-indigo-600 dark:text-indigo-400";

  const handleCardClick = () => {
    if (enrolledState) {
      onStartLearning(course);
    } else {
      onPreview(course);
    }
  };

  const handleActionClick = () => {
    if (enrolledState) {
      onStartLearning(course);
      return;
    }

    const hasSubscription = Boolean(
      isLoggedIn &&
      user &&
      (user.role === "admin" || user.isTrialActive || (user as any).isSubscribed || user.role === "student")
    );

    if (hasSubscription) {
      enrollInCourse(course.id);
      setIsEnrolledLocally(true);
      setTimeout(() => {
        onStartLearning(course);
      }, 350);
    } else {
      setShowUpgradeModal(true);
    }
  };

  const handleTrialActivated = () => {
    enrollInCourse(course.id);
    setIsEnrolledLocally(true);
    setTimeout(() => {
      onStartLearning(course);
    }, 400);
  };

  /* ================= LIST VIEW VARIATION ================= */
  if (layout === "list") {
    return (
      <>
        <article
          onClick={handleCardClick}
          className="group relative rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-blue-400/50 dark:hover:border-blue-500/50 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col md:flex-row items-stretch overflow-hidden cursor-pointer text-left select-none"
        >
          {/* Left Thumbnail with Badge, Duration, and Rating pills */}
          <div className="relative w-full md:w-72 lg:w-80 shrink-0 aspect-[16/10] md:aspect-auto overflow-hidden bg-slate-950">
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
                style={{
                  background:
                    course.bannerGradient || "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
                }}
              />
            )}

            {/* Vignette Shadow Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

            {/* Top Badges: Status Pill + Frosted Heart Bookmark Button */}
            <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wide shadow-sm ${badgeConfig.className}`}
              >
                <span>{badgeConfig.icon}</span>
                <span>{badgeConfig.label}</span>
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsBookmarked(!isBookmarked);
                }}
                title={isBookmarked ? "Remove Bookmark" : "Bookmark Course"}
                className={`w-8 h-8 rounded-full backdrop-blur-md border border-white/25 flex items-center justify-center transition-all cursor-pointer ${
                  isBookmarked
                    ? "bg-rose-500 text-white"
                    : "bg-black/35 text-white hover:bg-black/60"
                }`}
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </button>
            </div>

            {/* Bottom Floating Pills ON Thumbnail: Duration & Rating */}
            <div className="absolute bottom-3.5 left-3 right-3 z-20 flex items-center justify-between text-white text-[11px] font-semibold pointer-events-none">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 font-mono shadow-sm">
                <svg className="w-3.5 h-3.5 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>{course.duration}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 font-mono font-bold text-white shadow-sm">
                <span className="text-amber-400">★</span>
                <span>{course.rating}</span>
              </span>
            </div>

            {/* Organic Bottom Wave on mobile */}
            <div className="md:hidden absolute -bottom-0.5 left-0 right-0 overflow-hidden leading-none z-10 pointer-events-none text-white dark:text-slate-900">
              <svg viewBox="0 0 500 45" preserveAspectRatio="none" className="w-full h-5 fill-current">
                <path d="M0,18 Q160,38 320,10 T500,16 L500,45 L0,45 Z" />
              </svg>
            </div>
          </div>

          {/* Middle Content Body */}
          <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between gap-3 min-w-0">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {course.categoryLabel}
                </span>
                <span className="text-xs text-slate-300 dark:text-slate-700">•</span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {course.studentsCount ? `${course.studentsCount.toLocaleString()} learners` : "2.5k+ learners"}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug tracking-tight">
                {course.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {course.tagline || course.description}
              </p>
            </div>

            {/* Single Row of 3 Attribute Badges matching reference image */}
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/40 text-[11px] font-bold whitespace-nowrap">
                <span>💻</span> Projects
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/40 text-[11px] font-bold whitespace-nowrap">
                <span>📜</span> Certificate
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 border border-teal-200/60 dark:border-teal-800/40 text-[11px] font-bold whitespace-nowrap">
                <span>♾</span> Lifetime
              </span>
              {course.skills?.slice(0, 3).map((s) => (
                <span
                  key={s}
                  className="hidden xl:inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-300"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Right Action Column / Footer matching Grid view footer */}
          <div className="p-4 sm:p-5 md:w-56 lg:w-64 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 flex flex-row md:flex-col items-center justify-between md:justify-center gap-4 shrink-0">
            {enrolledState ? (
              <>
                <div className="flex items-center gap-2.5 min-w-0 md:w-full md:justify-center">
                  <CircularProgressRing percent={effectiveProgress} />
                  <div className="min-w-0 text-left">
                    <div className="text-xs font-extrabold text-slate-900 dark:text-white leading-tight truncate">
                      Your Progress
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight truncate mt-0.5">
                      Continue where you left
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartLearning(course);
                  }}
                  title="Continue Learning"
                  className="w-10 h-10 md:w-full md:h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 font-bold text-xs transition-all shadow-xs hover:scale-[1.02] active:scale-[0.98] shrink-0 cursor-pointer"
                >
                  <span className="hidden md:inline">Continue Learning</span>
                  <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 min-w-0 md:w-full md:justify-center">
                  <svg
                    className={`w-4 h-4 shrink-0 ${levelColor}`}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <rect x="3" y="14" width="4" height="7" rx="1" />
                    <rect x="10" y="9" width="4" height="12" rx="1" />
                    <rect x="17" y="4" width="4" height="17" rx="1" />
                  </svg>
                  <div className="min-w-0 text-left">
                    <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 leading-none uppercase tracking-wider">
                      Level
                    </div>
                    <div className={`text-xs font-black leading-tight mt-0.5 truncate ${levelColor}`}>
                      {course.level || "Intermediate"}
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleActionClick();
                  }}
                  className="py-2.5 px-4 md:w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0 cursor-pointer whitespace-nowrap"
                >
                  <span>View Details</span>
                  <span>→</span>
                </button>
              </>
            )}
          </div>
        </article>

        {/* Subscription Upgrade Modal */}
        <SubscriptionUpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          courseTitle={course.title}
          onTrialActivated={handleTrialActivated}
        />
      </>
    );
  }

  /* ================= GRID VIEW (DEFAULT) ================= */
  return (
    <>
      <article
        onClick={handleCardClick}
        className="group relative rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-blue-400/50 dark:hover:border-blue-500/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer text-left h-full select-none"
      >
        <div>
          {/* ================= 1. THUMBNAIL CONTAINER WITH ORGANIC CURVE ================= */}
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
                style={{
                  background:
                    course.bannerGradient || "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
                }}
              />
            )}

            {/* Vignette Shadow Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

            {/* Top Badges: Status Pill + Frosted Heart Bookmark Button */}
            <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wide shadow-sm ${badgeConfig.className}`}
              >
                <span>{badgeConfig.icon}</span>
                <span>{badgeConfig.label}</span>
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsBookmarked(!isBookmarked);
                }}
                title={isBookmarked ? "Remove Bookmark" : "Bookmark Course"}
                className={`w-8 h-8 rounded-full backdrop-blur-md border border-white/25 flex items-center justify-center transition-all cursor-pointer ${
                  isBookmarked
                    ? "bg-rose-500 text-white"
                    : "bg-black/35 text-white hover:bg-black/60"
                }`}
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </button>
            </div>

            {/* Bottom Floating Pills ON Thumbnail: Duration & Rating */}
            <div className="absolute bottom-3.5 left-3 right-3 z-20 flex items-center justify-between text-white text-[11px] font-semibold pointer-events-none">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 font-mono shadow-sm">
                <svg className="w-3.5 h-3.5 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>{course.duration}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 font-mono font-bold text-white shadow-sm">
                <span className="text-amber-400">★</span>
                <span>{course.rating}</span>
              </span>
            </div>

            {/* Organic Bottom Wave Transition into Card Body */}
            <div className="absolute -bottom-0.5 left-0 right-0 overflow-hidden leading-none z-10 pointer-events-none text-white dark:text-slate-900">
              <svg viewBox="0 0 500 45" preserveAspectRatio="none" className="w-full h-5 fill-current">
                <path d="M0,18 Q160,38 320,10 T500,16 L500,45 L0,45 Z" />
              </svg>
            </div>
          </div>

          {/* ================= 2. CARD CONTENT BODY ================= */}
          <div className="p-5 space-y-3">
            {/* Title (Bold, 2 Lines exactly as in image) */}
            <h3 className="text-base sm:text-[17px] font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug tracking-tight h-[2.85rem] overflow-hidden">
              {course.title}
            </h3>

            {/* Description (Exactly 2 Lines) */}
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed h-[2.5rem] overflow-hidden">
              {course.tagline || course.description}
            </p>

            {/* Single Row of 3 Attribute Badges matching reference image */}
            <div className="flex items-center gap-2 flex-nowrap overflow-hidden pt-1">
              {/* Projects Badge */}
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/40 text-[11px] font-bold whitespace-nowrap shrink-0">
                <span>💻</span> Projects
              </span>

              {/* Certificate Badge */}
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/40 text-[11px] font-bold whitespace-nowrap shrink-0">
                <span>📜</span> Certificate
              </span>

              {/* Lifetime Badge */}
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 border border-teal-200/60 dark:border-teal-800/40 text-[11px] font-bold whitespace-nowrap shrink-0">
                <span>♾</span> Lifetime
              </span>
            </div>
          </div>
        </div>

        {/* ================= 3. CARD FOOTER (EXACT IMAGE VARIATIONS) ================= */}
        <div className="p-4 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3 mt-auto">
          {enrolledState ? (
            /* VARIATION A: In Progress / Enrolled (Matching Card 1 in Image) */
            <>
              <div className="flex items-center gap-2.5 min-w-0">
                <CircularProgressRing percent={effectiveProgress} />
                <div className="min-w-0">
                  <div className="text-xs font-extrabold text-slate-900 dark:text-white leading-tight truncate">
                    Your Progress
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight truncate mt-0.5">
                    Continue where you left
                  </div>
                </div>
              </div>

              {/* Square / Rounded-2xl Arrow Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onStartLearning(course);
                }}
                title="Continue Learning"
                className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-all shadow-xs hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
              >
                <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </>
          ) : (
            /* VARIATION B: Not Enrolled (Matching Card 3 in Image with Level & View Details) */
            <>
              {/* Level Indicator with 3-Bar Chart Icon */}
              <div className="flex items-center gap-2 min-w-0">
                <svg
                  className={`w-4 h-4 shrink-0 ${levelColor}`}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <rect x="3" y="14" width="4" height="7" rx="1" />
                  <rect x="10" y="9" width="4" height="12" rx="1" />
                  <rect x="17" y="4" width="4" height="17" rx="1" />
                </svg>
                <div className="min-w-0">
                  <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 leading-none uppercase tracking-wider">
                    Level
                  </div>
                  <div className={`text-xs font-black leading-tight mt-0.5 truncate ${levelColor}`}>
                    {course.level || "Intermediate"}
                  </div>
                </div>
              </div>

              {/* View Details Button in Indigo */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleActionClick();
                }}
                className="py-2 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0 cursor-pointer whitespace-nowrap"
              >
                <span>View Details</span>
                <span>→</span>
              </button>
            </>
          )}
        </div>
      </article>

      {/* Subscription Upgrade Modal */}
      <SubscriptionUpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        courseTitle={course.title}
        onTrialActivated={handleTrialActivated}
      />
    </>
  );
}
