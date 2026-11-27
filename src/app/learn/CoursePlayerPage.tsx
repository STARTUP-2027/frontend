"use client";

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { useCourses } from "../context/CourseContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../theme";
import type { NavigableItem, ContentTabType, SyllabusTypeFilter } from "./types";
import { useNavigableHierarchy } from "./hooks/useNavigableHierarchy";
import { useLabSandbox } from "./hooks/useLabSandbox";
import { usePlayerDiscussion } from "./hooks/usePlayerDiscussion";
import PlayerHeader from "./components/PlayerHeader";
import CurriculumSidebar from "./components/CurriculumSidebar";
import BreadcrumbToolbar from "./components/BreadcrumbToolbar";
import WorkspaceTabs from "./components/WorkspaceTabs";
import CertificateModal from "./components/CertificateModal";

export default function CoursePlayerPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const activeCourseId = typeof courseId === "string" ? courseId : Array.isArray(courseId) ? (courseId as string[])[0] : "";
  const navigate = useNavigate();
  const { dark, setDark } = useTheme();
  const { user } = useAuth();
  const {
    getCourseById,
    isLessonCompleted,
    completeLesson,
    getCourseProgress,
    isBookmarked,
    addBookmark,
    removeBookmark,
    bookmarks,
    claimCertificate,
  } = useCourses();

  const course = getCourseById(activeCourseId || "");
  const navigableItems = useNavigableHierarchy(course);

  // Active Item Navigation State
  const [activeItemId, setActiveItemId] = useState<string>(() => navigableItems[0]?.id || "");

  useEffect(() => {
    if (navigableItems.length > 0 && !navigableItems.some((i) => i.id === activeItemId)) {
      setActiveItemId(navigableItems[0].id);
    }
  }, [navigableItems, activeItemId]);

  const activeItem = navigableItems.find((i) => i.id === activeItemId) || navigableItems[0];
  const activeIndex = navigableItems.findIndex((i) => i.id === activeItemId);

  // UI Modes & Filters
  const [activeContentTab, setActiveContentTab] = useState<ContentTabType>("video");
  const [syllabusSearchQuery, setSyllabusSearchQuery] = useState<string>("");
  const [syllabusTypeFilter, setSyllabusTypeFilter] = useState<SyllabusTypeFilter>("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [showCertModal, setShowCertModal] = useState<boolean>(false);

  // Sync tab with item type on item switch
  useEffect(() => {
    if (activeItem) {
      if (activeItem.type === "quiz") setActiveContentTab("quiz");
      else if (activeItem.type === "reading") setActiveContentTab("reading");
      else setActiveContentTab("video");
    }
  }, [activeItemId]);

  // Hook integrations
  const {
    userCode,
    setUserCode,
    codeOutput,
    isRunningCode,
    labPassed,
    runLabCode,
    resetStarterCode,
  } = useLabSandbox(activeItem);

  const { comments, newQuestionText, setNewQuestionText, postQuestion } = usePlayerDiscussion(
    user?.name
  );

  // Scratchpad Note State
  const [personalNote, setPersonalNote] = useState<string>("");
  const [saveNoteSuccess, setSaveNoteSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (activeItem) {
      setPersonalNote(`## ${activeItem.title} - Key Takeaways\n- `);
    }
  }, [activeItemId]);

  if (!course) {
    return (
      <div className={`subpage app ${dark ? "dark" : ""} flex flex-col items-center justify-center min-h-screen p-8 text-center`}>
        <div className="text-4xl mb-3">🔍</div>
        <h2 className="text-2xl font-bold mb-2">Course Not Found</h2>
        <p className="text-sm text-[var(--muted)] mb-6">The requested course could not be located in our catalog.</p>
        <Link to="/courses" className="button button-sm">Browse All Courses</Link>
      </div>
    );
  }

  const progress = getCourseProgress(course.id);

  // Actions
  const handlePrevItem = () => {
    if (activeIndex > 0) setActiveItemId(navigableItems[activeIndex - 1].id);
  };

  const handleNextItem = () => {
    if (activeIndex < navigableItems.length - 1) {
      setActiveItemId(navigableItems[activeIndex + 1].id);
    }
  };

  const handleCompleteCurrent = () => {
    if (activeItem) {
      completeLesson(course.id, activeItem.id);
      if (activeIndex < navigableItems.length - 1) {
        setActiveItemId(navigableItems[activeIndex + 1].id);
      } else {
        setShowCertModal(true);
      }
    }
  };

  const handleToggleBookmark = () => {
    if (!activeItem) return;
    if (isBookmarked(activeItem.id)) {
      const existing = bookmarks.find((b) => b.lessonId === activeItem.id);
      if (existing) removeBookmark(existing.id);
    } else {
      addBookmark({
        courseId: course.id,
        courseTitle: course.title,
        lessonId: activeItem.id,
        lessonTitle: activeItem.title,
        noteText: activeItem.summary || "",
        snippet: activeItem.codeSnippet,
        tags: [course.category, "Lesson Note"],
      });
    }
  };

  const handleSavePersonalNote = () => {
    if (!activeItem) return;
    addBookmark({
      courseId: course.id,
      courseTitle: course.title,
      lessonId: activeItem.id,
      lessonTitle: activeItem.title,
      noteText: personalNote,
      snippet: userCode,
      tags: [course.category, "Classroom Notes"],
    });
    setSaveNoteSuccess(true);
    setTimeout(() => setSaveNoteSuccess(false), 2500);
  };

  const handleClaimCertificate = () => {
    claimCertificate(course.id);
    setShowCertModal(false);
    navigate("/dashboard");
  };

  return (
    <div className={`app ${dark ? "dark" : ""} min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)] select-none`}>
      {/* Top Application Bar */}
      {!isFocusMode && (
        <PlayerHeader
          courseTitle={course.title}
          completed={progress.completed}
          total={progress.total}
          percentage={progress.percentage}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onEnterFocusMode={() => setIsFocusMode(true)}
          dark={dark}
          onToggleDark={() => setDark(!dark)}
        />
      )}

      {/* Focus Mode Escape Banner */}
      {isFocusMode && (
        <div className="bg-slate-900 text-slate-100 text-xs py-1.5 px-4 flex items-center justify-between border-b border-slate-800 z-50">
          <div className="flex items-center gap-2 font-bold">
            <span>✨ Focus Mode Active:</span>
            <span className="truncate">{activeItem?.title}</span>
          </div>
          <button
            onClick={() => setIsFocusMode(false)}
            className="px-2.5 py-0.5 rounded-lg bg-white/20 hover:bg-white/30 text-white font-black text-[11px] cursor-pointer"
          >
            Exit Focus Mode (ESC)
          </button>
        </div>
      )}

      {/* Main Split Learning Arena */}
      <div
        className="flex-1 flex flex-col lg:flex-row overflow-hidden relative"
        style={{ height: isFocusMode ? "100vh" : "calc(100vh - 57px)" }}
      >
        {/* Left: Curriculum Hierarchy Outline */}
        {isSidebarOpen && (
          <CurriculumSidebar
            course={course}
            navigableItems={navigableItems}
            activeItemId={activeItemId}
            completedCount={progress.completed}
            totalCount={progress.total}
            percentage={progress.percentage}
            searchQuery={syllabusSearchQuery}
            onSearchChange={setSyllabusSearchQuery}
            typeFilter={syllabusTypeFilter}
            onTypeFilterChange={setSyllabusTypeFilter}
            onSelectItem={(item: NavigableItem) => setActiveItemId(item.id)}
            onCloseSidebar={() => setIsSidebarOpen(false)}
            isLessonCompleted={isLessonCompleted}
          />
        )}

        {/* Right: Interactive Learning Workspace */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          <BreadcrumbToolbar
            courseTitle={course.title}
            activeItem={activeItem}
            activeIndex={activeIndex}
            totalItems={navigableItems.length}
            isBookmarked={!!activeItem && isBookmarked(activeItem.id)}
            isCompleted={!!activeItem && isLessonCompleted(activeItem.id)}
            onPrev={handlePrevItem}
            onNext={handleNextItem}
            onToggleBookmark={handleToggleBookmark}
            onCompleteLesson={handleCompleteCurrent}
          />

          <WorkspaceTabs
            activeItem={activeItem}
            activeTab={activeContentTab}
            onTabChange={setActiveContentTab}
            userCode={userCode}
            setUserCode={setUserCode}
            codeOutput={codeOutput}
            isRunningCode={isRunningCode}
            labPassed={labPassed}
            onRunLabCode={runLabCode}
            onResetStarter={resetStarterCode}
            comments={comments}
            newQuestionText={newQuestionText}
            onQuestionTextChange={setNewQuestionText}
            onSubmitQuestion={postQuestion}
            personalNote={personalNote}
            onPersonalNoteChange={setPersonalNote}
            onSavePersonalNote={handleSavePersonalNote}
            saveNoteSuccess={saveNoteSuccess}
          />
        </main>
      </div>

      {/* Verified Certificate Modal */}
      {showCertModal && (
        <CertificateModal
          course={course}
          userName={user?.name}
          onClaim={handleClaimCertificate}
          onClose={() => setShowCertModal(false)}
        />
      )}
    </div>
  );
}
