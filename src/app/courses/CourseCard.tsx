import { useState, useRef, useEffect } from "react";
import { type Course, useCourses } from "../context/CourseContext";
import { useAuth } from "../context/AuthContext";
import SubscriptionUpgradeModal from "../components/SubscriptionUpgradeModal";

interface CourseCardProps {
  course: Course;
  isEnrolled: boolean;
  progressPercent?: number;
  onPreview: (course: Course) => void;
  onStartLearning: (course: Course) => void;
}

interface SlideToEnrollProps {
  onSlideComplete: () => void;
  disabled?: boolean;
}

function SlideToEnroll({ onSlideComplete, disabled }: SlideToEnrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);

  const startDrag = (clientX: number) => {
    if (disabled || isSuccess) return;
    setIsDragging(true);
    startXRef.current = clientX;
    currentXRef.current = dragX;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const clientXNow = "touches" in e ? e.touches[0].clientX : e.clientX;
      const deltaX = clientXNow - startXRef.current;
      const container = containerRef.current;
      if (!container) return;

      const trackWidth = container.clientWidth;
      const thumbWidth = 36;
      const maxDrag = Math.max(10, trackWidth - thumbWidth - 6);

      const nextDragX = Math.max(0, Math.min(maxDrag, currentXRef.current + deltaX));
      setDragX(nextDragX);

      // If dragged > 80% to end, complete slide
      if (nextDragX >= maxDrag * 0.85) {
        setIsDragging(false);
        setDragX(maxDrag);
        setIsSuccess(true);
        cleanup();
        onSlideComplete();
      }
    };

    const handleEnd = () => {
      setIsDragging(false);
      cleanup();
      const container = containerRef.current;
      if (!container) return;

      const trackWidth = container.clientWidth;
      const thumbWidth = 36;
      const maxDrag = Math.max(10, trackWidth - thumbWidth - 6);

      if (dragX >= maxDrag * 0.7) {
        setDragX(maxDrag);
        setIsSuccess(true);
        onSlideComplete();
      } else {
        // Snap back smoothly
        setDragX(0);
      }
    };

    const cleanup = () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleEnd);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled || isSuccess) return;
    const container = containerRef.current;
    if (container) {
      const maxDrag = container.clientWidth - 42;
      setDragX(maxDrag);
      setIsSuccess(true);
      setTimeout(() => {
        onSlideComplete();
      }, 200);
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className="relative flex-1 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 overflow-hidden select-none cursor-pointer flex items-center p-1 group/slider"
      title="Slide or click to enroll"
    >
      {/* Dynamic Progress Fill */}
      <div
        className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/30 dark:from-blue-500/25 dark:to-indigo-500/35 transition-all duration-75 rounded-2xl"
        style={{ width: `${dragX + 36}px` }}
      />

      {/* Center Label with shimmering arrows */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none pl-6 text-[11px] font-bold text-slate-500 dark:text-slate-400">
        {isSuccess ? (
          <span className="text-emerald-600 dark:text-emerald-400 font-black animate-pulse flex items-center gap-1">
            <span>✓</span> Enrolled!
          </span>
        ) : (
          <span className="flex items-center gap-1.5">
            <span className="group-hover/slider:text-blue-600 dark:group-hover/slider:text-blue-400 transition-colors">
              Slide to Enroll
            </span>
            <span className="font-mono text-blue-500 animate-pulse">❯❯</span>
          </span>
        )}
      </div>

      {/* Draggable Handle */}
      <div
        onMouseDown={(e) => {
          e.stopPropagation();
          startDrag(e.clientX);
        }}
        onTouchStart={(e) => {
          e.stopPropagation();
          startDrag(e.touches[0].clientX);
        }}
        style={{
          transform: `translateX(${dragX}px)`,
          transition: isDragging ? "none" : "transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
        className="w-8 h-8 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white flex items-center justify-center shadow-md cursor-grab active:cursor-grabbing font-black text-xs select-none relative z-10 shrink-0 hover:scale-105 active:scale-95 transition-transform"
      >
        <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </div>
    </div>
  );
}

export default function CourseCard({
  course,
  isEnrolled,
  progressPercent = 0,
  onPreview,
  onStartLearning,
}: CourseCardProps) {
  const { user, isLoggedIn } = useAuth();
  const { enrollInCourse, isEnrolled: checkIsEnrolled } = useCourses();

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isEnrolledLocally, setIsEnrolledLocally] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Active enrolled state
  const enrolledState = isEnrolled || checkIsEnrolled(course.id) || isEnrolledLocally;

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
    if (enrolledState) {
      onStartLearning(course);
    } else {
      onPreview(course);
    }
  };

  const handleEnrollSlide = () => {
    // Check if user has active subscription or trial
    const hasSubscription = Boolean(
      isLoggedIn &&
      user &&
      (user.role === "admin" || user.isTrialActive || (user as any).isSubscribed || user.role === "student")
    );

    if (hasSubscription) {
      // User has subscription -> Enroll directly!
      enrollInCourse(course.id);
      setIsEnrolledLocally(true);
      setTimeout(() => {
        onStartLearning(course);
      }, 500);
    } else {
      // No subscription -> Open Upgrade Modal!
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

  return (
    <>
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

              {/* If enrolled and has progress, show progress pill, else enrolled count */}
              {enrolledState && progressPercent > 0 ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60">
                  <span>{progressPercent}% Complete</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                  </svg>
                  <span>{course.studentsCount ? `${(course.studentsCount / 1000).toFixed(1)}k+` : "2.5k+"} Enrolled</span>
                </span>
              )}
            </div>

            {/* Title with Fixed Height */}
            <h3 className="text-base font-extrabold text-[var(--text)] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1 leading-snug">
              {course.title}
            </h3>

            {/* 1. Exactly 2 Lines of Description */}
            <p className="text-xs text-[var(--muted)] line-clamp-2 leading-relaxed h-[2.5rem] overflow-hidden">
              {course.tagline || course.description}
            </p>

            {/* 2. Below it: ONLY Single Line of Attributes (Projects, Certificate, Lifetime) */}
            <div className="flex items-center gap-1.5 flex-nowrap overflow-hidden pt-0.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[var(--surface-soft)] text-[var(--text)] text-[10px] font-semibold border border-[var(--border-soft)] whitespace-nowrap shrink-0">
                <span>💻</span> Projects
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[var(--surface-soft)] text-[var(--text)] text-[10px] font-semibold border border-[var(--border-soft)] whitespace-nowrap shrink-0">
                <span>📜</span> Certificate
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[var(--surface-soft)] text-[var(--text)] text-[10px] font-semibold border border-[var(--border-soft)] whitespace-nowrap shrink-0">
                <span>⏱</span> Lifetime
              </span>
            </div>
          </div>
        </div>

        {/* ================= CARD FOOTER ACTIONS ================= */}
        <div className="p-4 pt-2 border-t border-[var(--border-soft)] flex items-center justify-between gap-2.5 mt-auto">
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

          {/* If Enrolled: Continue Learning. If Not Enrolled: Interactive Slide to Enroll */}
          {enrolledState ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStartLearning(course);
              }}
              className="flex-1 py-2.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:opacity-90 active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <span>Continue Learning</span>
              <span>→</span>
            </button>
          ) : (
            <SlideToEnroll onSlideComplete={handleEnrollSlide} />
          )}
        </div>

        {/* 3. Border Line Showing Progress at the Border of the Course Card */}
        {enrolledState && progressPercent > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-[3.5px] bg-slate-200/50 dark:bg-slate-800/80 overflow-hidden z-20">
            <div
              className={`h-full transition-all duration-700 ${
                progressPercent >= 100
                  ? "bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]"
                  : "bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 shadow-[0_0_8px_rgba(59,130,246,0.6)]"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </article>

      {/* 4. Subscription Upgrade Modal */}
      <SubscriptionUpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        courseTitle={course.title}
        onTrialActivated={handleTrialActivated}
      />
    </>
  );
}
