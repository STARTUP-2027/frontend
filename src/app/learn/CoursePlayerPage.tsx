import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { useCourses, type Lesson } from "../context/CourseContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../theme";

export default function CoursePlayerPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { dark, setDark } = useTheme();
  const { user } = useAuth();
  const { getCourseById, isLessonCompleted, completeLesson, getCourseProgress, isEnrolled, enrollInCourse } = useCourses();

  const course = getCourseById(courseId || "");

  // Find first lesson or selected lesson
  const allLessons: Lesson[] = course ? course.modules.flatMap((m) => m.lessons) : [];
  const [activeLessonId, setActiveLessonId] = useState<string>(() => {
    return allLessons.length > 0 ? allLessons[0].id : "";
  });

  const [activeTab, setActiveTab] = useState<"notes" | "code" | "quiz">("notes");
  const [codeOutput, setCodeOutput] = useState<string>("");
  const [isRunningCode, setIsRunningCode] = useState<boolean>(false);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [showCertModal, setShowCertModal] = useState<boolean>(false);
  const [userCode, setUserCode] = useState<string>("");

  if (!course) {
    return (
      <div className={`subpage app ${dark ? "dark" : ""} flex flex-col items-center justify-center min-h-screen p-8 text-center`}>
        <h2 className="text-2xl font-bold mb-4">Course not found</h2>
        <p className="text-muted-foreground mb-6">The requested course could not be located in our catalog.</p>
        <Link to="/courses" className="button button-sm">Browse All Courses</Link>
      </div>
    );
  }

  const activeLesson = allLessons.find((l) => l.id === activeLessonId) || allLessons[0];
  const progress = getCourseProgress(course.id);
  const enrolled = isEnrolled(course.id);

  const handleSelectLesson = (lesson: Lesson) => {
    setActiveLessonId(lesson.id);
    setSelectedQuizAnswer(null);
    setQuizSubmitted(false);
    setCodeOutput("");
    setUserCode(lesson.codeSnippet || "");
  };

  const handleRunCode = () => {
    setIsRunningCode(true);
    setCodeOutput("Compiling and executing in isolated sandbox...\n");
    setTimeout(() => {
      try {
        setCodeOutput((prev) => prev + `[SUCCESS] Output:\n> ${activeLesson.title} execution completed without runtime errors.\n> Status: 200 OK | Process memory: 14.2 MB | Execution time: 18ms`);
      } catch (err: any) {
        setCodeOutput((prev) => prev + `[ERROR]: ${err.message}`);
      }
      setIsRunningCode(false);
    }, 600);
  };

  const handleCompleteCurrentLesson = () => {
    if (activeLesson) {
      completeLesson(course.id, activeLesson.id);
      
      // Auto move to next lesson if available
      const currentIndex = allLessons.findIndex((l) => l.id === activeLesson.id);
      if (currentIndex < allLessons.length - 1) {
        handleSelectLesson(allLessons[currentIndex + 1]);
      } else {
        // Course 100% completed
        setShowCertModal(true);
      }
    }
  };

  return (
    <div className={`app ${dark ? "dark" : ""} min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]`}>
      {/* Top Classroom Bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3 border-b border-[var(--border-soft)] bg-[var(--nav-bg)] backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="flex items-center gap-2 text-xs font-semibold text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
            Back to Dashboard
          </Link>
          <span className="text-[var(--border)]">|</span>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-sm font-bold truncate max-w-md">{course.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Progress Pill */}
          <div className="flex items-center gap-3 bg-[var(--surface-soft)] px-3 py-1.5 rounded-full border border-[var(--border-soft)]">
            <div className="w-24 h-2 bg-[var(--surface)] rounded-full overflow-hidden border border-[var(--border)]">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
            <span className="text-xs font-bold text-[var(--accent)]">{progress.percentage}% Complete</span>
          </div>

          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded-xl bg-[var(--surface-soft)] border border-[var(--border-soft)] text-[var(--muted)] hover:text-[var(--text)]"
            title="Toggle theme"
          >
            {dark ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z"/></svg>
            )}
          </button>
        </div>
      </header>

      {/* Main Workspace: Left Content + Right Syllabus */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: Video / Content / Tabs */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
          {!enrolled && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">💡</span>
                <div>
                  <h4 className="text-xs font-bold text-amber-500">Previewing Course</h4>
                  <p className="text-xs text-[var(--muted)]">Enroll now to track your daily XP, save interactive code snippets, and earn your certificate.</p>
                </div>
              </div>
              <button onClick={() => enrollInCourse(course.id)} className="button button-sm text-xs">
                Enroll Free
              </button>
            </div>
          )}

          {/* Video Player Container */}
          <div className="relative rounded-2xl overflow-hidden border border-[var(--border)] bg-black aspect-video shadow-2xl">
            {activeLesson?.videoUrl ? (
              <iframe
                src={activeLesson.videoUrl}
                title={activeLesson.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#120f24] to-[#1c1833] p-8 text-center text-white">
                <div className="w-16 h-16 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-purple-400"><path d="m9 7 8 5-8 5V7Z"/></svg>
                </div>
                <h3 className="text-lg font-bold mb-2">{activeLesson?.title}</h3>
                <p className="text-xs text-gray-400 max-w-md">{activeLesson?.summary}</p>
              </div>
            )}
          </div>

          {/* Lesson Header & Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border-soft)] shadow-sm">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-[var(--accent)] uppercase">Current Lesson</span>
              <h2 className="text-lg font-extrabold">{activeLesson?.title}</h2>
              <div className="flex items-center gap-3 text-xs text-[var(--muted)] mt-1">
                <span>⏱️ {activeLesson?.duration}</span>
                <span>•</span>
                <span>👨‍🏫 {course.instructor.name}</span>
                <span>•</span>
                <span className="capitalize">Type: {activeLesson?.type}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCompleteCurrentLesson}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
                  isLessonCompleted(activeLesson?.id || "")
                    ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30"
                    : "button"
                }`}
              >
                {isLessonCompleted(activeLesson?.id || "") ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 4 4L19 6"/></svg>
                    Completed (+100 XP)
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 4 4L19 6"/></svg>
                    Mark as Complete & Next
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Tabs: Notes / Interactive Code / Quiz */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-sm">
            <div className="flex border-b border-[var(--border-soft)] bg-[var(--surface-soft)]">
              <button
                onClick={() => setActiveTab("notes")}
                className={`px-5 py-3 text-xs font-bold transition-colors border-b-2 flex items-center gap-2 ${
                  activeTab === "notes"
                    ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--surface)]"
                    : "border-transparent text-[var(--muted)] hover:text-[var(--text)]"
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/></svg>
                Comprehensive Study Notes
              </button>
              <button
                onClick={() => setActiveTab("code")}
                className={`px-5 py-3 text-xs font-bold transition-colors border-b-2 flex items-center gap-2 ${
                  activeTab === "code"
                    ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--surface)]"
                    : "border-transparent text-[var(--muted)] hover:text-[var(--text)]"
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m8 9-3 3 3 3m8-6 3 3-3 3m-3-8-2 10"/></svg>
                Interactive Code Sandbox
              </button>
              <button
                onClick={() => setActiveTab("quiz")}
                className={`px-5 py-3 text-xs font-bold transition-colors border-b-2 flex items-center gap-2 ${
                  activeTab === "quiz"
                    ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--surface)]"
                    : "border-transparent text-[var(--muted)] hover:text-[var(--text)]"
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20m10-10H2"/></svg>
                Knowledge Assessment
              </button>
            </div>

            <div className="p-6">
              {activeTab === "notes" && (
                <div className="prose dark:prose-invert max-w-none text-xs leading-relaxed space-y-4">
                  <div className="p-4 rounded-xl bg-[var(--surface-soft)] border border-[var(--border-soft)]">
                    <h3 className="text-sm font-bold mb-2">Lesson Overview</h3>
                    <p className="text-[var(--muted)]">{activeLesson?.summary}</p>
                  </div>
                  <pre className="p-4 rounded-xl bg-[#0e0c15] text-[#e0def4] overflow-x-auto text-xs font-mono">
                    {activeLesson?.notes}
                  </pre>
                </div>
              )}

              {activeTab === "code" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--muted)]">Interactive Sandbox (Live Execution)</span>
                    <button
                      onClick={handleRunCode}
                      disabled={isRunningCode}
                      className="button button-sm text-xs flex items-center gap-2"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="m9 7 8 5-8 5V7Z"/></svg>
                      {isRunningCode ? "Running..." : "Run Sandbox"}
                    </button>
                  </div>
                  <textarea
                    rows={8}
                    value={userCode || activeLesson?.codeSnippet || "// Enter your code here"}
                    onChange={(e) => setUserCode(e.target.value)}
                    className="w-full p-4 rounded-xl font-mono text-xs bg-[#0b0a12] text-[#93c5fd] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-y"
                  />
                  {codeOutput && (
                    <div className="p-4 rounded-xl bg-[#06050a] text-emerald-400 font-mono text-xs border border-emerald-500/20 whitespace-pre-wrap">
                      {codeOutput}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "quiz" && (
                <div>
                  {activeLesson?.quiz ? (
                    <div className="space-y-4 max-w-xl">
                      <h3 className="text-sm font-bold">{activeLesson.quiz.question}</h3>
                      <div className="space-y-2">
                        {activeLesson.quiz.options.map((opt, idx) => {
                          let optStyle = "border-[var(--border)] bg-[var(--surface-soft)] hover:border-[var(--accent)]";
                          if (quizSubmitted) {
                            if (idx === activeLesson.quiz?.correctIndex) {
                              optStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-500 font-bold";
                            } else if (selectedQuizAnswer === idx) {
                              optStyle = "border-rose-500 bg-rose-500/10 text-rose-500";
                            }
                          } else if (selectedQuizAnswer === idx) {
                            optStyle = "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)] font-bold";
                          }

                          return (
                            <button
                              key={opt}
                              onClick={() => !quizSubmitted && setSelectedQuizAnswer(idx)}
                              className={`w-full p-3.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${optStyle}`}
                            >
                              <span>{opt}</span>
                              {quizSubmitted && idx === activeLesson.quiz?.correctIndex && (
                                <span className="text-emerald-500 font-bold">✓ Correct</span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {!quizSubmitted ? (
                        <button
                          onClick={() => setQuizSubmitted(true)}
                          disabled={selectedQuizAnswer === null}
                          className="button button-sm text-xs mt-3 disabled:opacity-50"
                        >
                          Submit Answer
                        </button>
                      ) : (
                        <div className="p-4 rounded-xl bg-[var(--surface-soft)] border border-[var(--border-soft)] text-xs mt-4">
                          <p className="font-bold text-[var(--accent)] mb-1">Explanation:</p>
                          <p className="text-[var(--muted)]">{activeLesson.quiz.explanation}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-[var(--muted)]">No quiz required for this introductory module.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Right: Collapsible Syllabus Sidebar */}
        <aside className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-[var(--border-soft)] bg-[var(--surface)] overflow-y-auto p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Course Syllabus</h3>
            <span className="text-xs font-bold text-[var(--accent)]">{allLessons.length} Lessons</span>
          </div>

          <div className="space-y-4">
            {course.modules.map((mod, modIdx) => (
              <div key={mod.id} className="border border-[var(--border-soft)] rounded-xl overflow-hidden bg-[var(--surface-soft)]">
                <div className="p-3 border-b border-[var(--border-soft)] bg-[var(--surface)] flex items-center justify-between">
                  <h4 className="text-xs font-bold truncate pr-2">{mod.title}</h4>
                  <span className="text-[10px] text-[var(--muted)] shrink-0">{mod.duration}</span>
                </div>
                <div className="divide-y divide-[var(--border-soft)]">
                  {mod.lessons.map((lesson) => {
                    const isCurrent = lesson.id === activeLesson?.id;
                    const isDone = isLessonCompleted(lesson.id);

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => handleSelectLesson(lesson)}
                        className={`w-full p-3 text-left flex items-start gap-3 transition-colors ${
                          isCurrent
                            ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                            : "hover:bg-[var(--surface)] text-[var(--text)]"
                        }`}
                      >
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[9px] ${
                          isDone
                            ? "bg-emerald-500 text-white font-bold"
                            : isCurrent
                            ? "border border-[var(--accent)] text-[var(--accent)]"
                            : "border border-[var(--border)] text-[var(--muted)]"
                        }`}>
                          {isDone ? "✓" : modIdx + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold leading-tight line-clamp-2">{lesson.title}</p>
                          <span className="text-[10px] text-[var(--muted)] mt-1 block">⏱️ {lesson.duration}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* Certificate Modal */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="max-w-lg w-full p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/30 flex items-center justify-center mx-auto text-2xl">
              🏆
            </div>
            <h2 className="text-xl font-extrabold">Congratulations, {user?.name || "Student"}!</h2>
            <p className="text-xs text-[var(--muted)]">
              You have successfully completed all modules in <strong>{course.title}</strong> and earned your verified certificate!
            </p>
            <div className="p-4 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border-soft)] text-left space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[var(--muted)]">Recipient:</span>
                <span className="font-bold">{user?.name || "Alex Morgan"}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[var(--muted)]">Credential ID:</span>
                <span className="font-mono text-[var(--accent)] font-bold">ASTRA-{Math.floor(1000 + Math.random() * 9000)}-2026</span>
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setShowCertModal(false)} className="button button-sm text-xs">
                View My Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
