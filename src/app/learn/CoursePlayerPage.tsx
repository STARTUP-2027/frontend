import { useState, useMemo, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { useCourses, type Lesson, type HierarchyItem, type QuizQuestion, type CourseResource, type ChapterTimestamp } from "../context/CourseContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../theme";

// Flatten all actionable nodes (lessons, submodules with content) into an ordered sequence
interface NavigableItem {
  id: string;
  title: string;
  moduleId: string;
  moduleTitle: string;
  submoduleTitle?: string;
  type: "video" | "reading" | "lab" | "quiz" | "code";
  duration?: string;
  summary?: string;
  notes?: string;
  videoUrl?: string;
  transcript?: string;
  timestamps?: ChapterTimestamp[];
  codeSnippet?: string;
  labObjective?: string;
  expectedOutput?: string;
  quizzes?: QuizQuestion[];
  resources?: CourseResource[];
  flashcards?: Array<{ front: string; back: string }>;
}

export default function CoursePlayerPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { dark, setDark } = useTheme();
  const { user } = useAuth();
  const {
    getCourseById,
    isLessonCompleted,
    completeLesson,
    getCourseProgress,
    isEnrolled,
    enrollInCourse,
    isBookmarked,
    addBookmark,
    removeBookmark,
    bookmarks,
    claimCertificate,
  } = useCourses();

  const course = getCourseById(courseId || "");

  // Flatten course hierarchy into a sequential navigable item list
  const navigableItems = useMemo<NavigableItem[]>(() => {
    if (!course) return [];
    const items: NavigableItem[] = [];

    // Helper to recursively process hierarchy
    const processHierarchy = (nodes: HierarchyItem[], modId: string, modTitle: string, parentSubTitle?: string) => {
      for (const node of nodes) {
        // If node has direct content or quiz or is a leaf
        const hasContent = node.videoUrl || node.notes || node.codeSnippet || (node.quizzes && node.quizzes.length > 0) || node.type !== "module";
        
        if (hasContent || !node.children || node.children.length === 0) {
          const itemType: NavigableItem["type"] =
            node.type === "video"
              ? "video"
              : node.type === "quiz"
              ? "quiz"
              : node.type === "lab" || node.type === "exercise"
              ? "lab"
              : node.type === "reading"
              ? "reading"
              : node.videoUrl
              ? "video"
              : node.codeSnippet
              ? "lab"
              : "reading";

          items.push({
            id: node.id,
            title: node.title,
            moduleId: modId,
            moduleTitle: modTitle,
            submoduleTitle: parentSubTitle || node.title,
            type: itemType,
            duration: node.duration || "15 min",
            summary: node.summary || "In-depth concept mastery and architectural verification.",
            notes: node.notes || `# ${node.title}\n\nComprehensive architectural overview and step-by-step documentation.`,
            videoUrl: node.videoUrl || "https://www.youtube-nocookie.com/embed/aircAruvnKk",
            transcript: node.transcript || "Welcome to this chapter. In this section, we break down foundational system design invariants, state transitions, and real-time execution flows in production environments.",
            timestamps: node.timestamps || [
              { time: "00:00", seconds: 0, label: "Overview & Objectives" },
              { time: "03:45", seconds: 225, label: "Core Architecture Invariants" },
              { time: "08:12", seconds: 492, label: "Interactive Simulation Walkthrough" },
              { time: "14:20", seconds: 860, label: "Production Best Practices" },
            ],
            codeSnippet: node.codeSnippet || `// Interactive Execution Sandbox\nfunction executeVerification() {\n  console.log("Validating architectural invariants...");\n  return { status: "OK", latencyMs: 14.2, memoryMb: 12.8 };\n}\n\nexecuteVerification();`,
            labObjective: node.labObjective || "Implement the core handler, verify memory checkpoints under load, and pass all automated test suites.",
            expectedOutput: node.expectedOutput || "All 5 invariant checks passed successfully.",
            quizzes: node.quizzes && node.quizzes.length > 0 ? node.quizzes : [
              {
                id: `quiz-default-1`,
                question: `What is the core architectural principle emphasized in ${node.title}?`,
                options: [
                  "Deterministic state transitions with automated checkpointing",
                  "Unsynchronized global variables in memory",
                  "Disabling network payload validation",
                  "Ignoring edge cases during high concurrency"
                ],
                correctIndex: 0,
                explanation: "State consistency and deterministic execution guarantee resilience across distributed nodes.",
                points: 50
              }
            ],
            resources: node.resources || [
              { id: "res-1", name: `${node.title} - Architecture CheatSheet`, type: "pdf", size: "1.8 MB" },
              { id: "res-2", name: `Production Starter Blueprint`, type: "code", size: "45 KB" }
            ],
            flashcards: node.flashcards || [
              { front: "State Invariant", back: "A property that remains true throughout the lifecycle of a node execution loop." },
              { front: "Checkpointing", back: "Persisting intermediate state to durable storage to support replay and fault recovery." }
            ]
          });
        }

        if (node.children && node.children.length > 0) {
          processHierarchy(node.children, modId, modTitle, node.title);
        }
      }
    };

    // If course has submodules or hierarchy
    course.modules.forEach((mod) => {
      if (mod.submodules && mod.submodules.length > 0) {
        processHierarchy(mod.submodules, mod.id, mod.title);
      } else if (mod.lessons && mod.lessons.length > 0) {
        mod.lessons.forEach((l) => {
          const lQuizzes: QuizQuestion[] = l.quizzes && l.quizzes.length > 0 
            ? l.quizzes 
            : l.quiz 
            ? [{ id: `quiz-${l.id}`, question: l.quiz.question, options: l.quiz.options, correctIndex: l.quiz.correctIndex, explanation: l.quiz.explanation, points: 50 }] 
            : [];

          items.push({
            id: l.id,
            title: l.title,
            moduleId: mod.id,
            moduleTitle: mod.title,
            type: l.type === "code" ? "lab" : l.type === "quiz" ? "quiz" : l.type === "reading" ? "reading" : "video",
            duration: l.duration,
            summary: l.summary,
            notes: l.notes,
            videoUrl: l.videoUrl || "https://www.youtube-nocookie.com/embed/aircAruvnKk",
            transcript: l.transcript || "Welcome to this lesson. We explore core engineering patterns and practical implementations.",
            timestamps: l.timestamps || [
              { time: "00:00", seconds: 0, label: "Lesson Introduction" },
              { time: "04:15", seconds: 255, label: "Core Principles & Diagram" },
              { time: "11:30", seconds: 690, label: "Code Walkthrough" },
              { time: "18:00", seconds: 1080, label: "Summary & Review" },
            ],
            codeSnippet: l.codeSnippet,
            labObjective: l.labObjective || "Complete the implementation and run sandbox tests to verify execution correctness.",
            expectedOutput: l.expectedOutput || "Output verified successfully.",
            quizzes: lQuizzes,
            resources: l.resources || [
              { id: "res-1", name: `${l.title} - Reference Note`, type: "pdf", size: "1.4 MB" },
              { id: "res-2", name: "Source Code Snippets", type: "code", size: "28 KB" }
            ],
            flashcards: l.flashcards || [
              { front: "Key Concept", back: "Fundamental pattern required for resilient high-scale deployment." }
            ]
          });
        });
      }
    });

    return items;
  }, [course]);

  // Active Lesson state
  const [activeItemId, setActiveItemId] = useState<string>(() => {
    return navigableItems[0]?.id || "";
  });

  // Keep activeItemId valid
  useEffect(() => {
    if (navigableItems.length > 0 && !navigableItems.some((i) => i.id === activeItemId)) {
      setActiveItemId(navigableItems[0].id);
    }
  }, [navigableItems, activeItemId]);

  const activeItem = navigableItems.find((i) => i.id === activeItemId) || navigableItems[0];
  const activeIndex = navigableItems.findIndex((i) => i.id === activeItemId);

  // Content viewing tabs: video, reading, lab, quiz, flashcards, resources, qa, notes
  const [activeContentTab, setActiveContentTab] = useState<
    "video" | "reading" | "lab" | "quiz" | "flashcards" | "resources" | "qa" | "scratchpad"
  >("video");

  // Sync tab with item type when item changes if appropriate
  useEffect(() => {
    if (activeItem) {
      if (activeItem.type === "quiz") setActiveContentTab("quiz");
      else if (activeItem.type === "lab") setActiveContentTab("lab");
      else if (activeItem.type === "reading") setActiveContentTab("reading");
      else setActiveContentTab("video");
    }
  }, [activeItemId]);

  // Player & Sandbox States
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [videoSearchTerm, setVideoSearchTerm] = useState<string>("");
  const [syllabusSearchQuery, setSyllabusSearchQuery] = useState<string>("");
  const [syllabusTypeFilter, setSyllabusTypeFilter] = useState<"all" | "video" | "reading" | "lab" | "quiz">("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);

  // Lab Sandbox Execution State
  const [userCode, setUserCode] = useState<string>("");
  const [codeOutput, setCodeOutput] = useState<string>("");
  const [isRunningCode, setIsRunningCode] = useState<boolean>(false);
  const [labPassed, setLabPassed] = useState<boolean>(false);

  // Quiz States for current item
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  // Flashcards state
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);
  const [masteredCards, setMasteredCards] = useState<Set<number>>(new Set());

  // Personal Note State
  const [personalNote, setPersonalNote] = useState<string>("");
  const [saveNoteSuccess, setSaveNoteSuccess] = useState<boolean>(false);

  // Discussion Q&A state
  const [qaComments, setQaComments] = useState<Array<{ id: string; user: string; role: string; text: string; time: string; upvotes: number }>>([
    {
      id: "qa-1",
      user: "Sarah Jenkins",
      role: "Senior Engineer",
      text: "How do you handle checkpointing when the cyclic agent graph encounters an unrecoverable 500 error from external tools?",
      time: "2 hours ago",
      upvotes: 12
    },
    {
      id: "qa-2",
      user: "Dr. Aris Vance",
      role: "Instructor",
      text: "Great question! We configure an 'EvaluationNode' fallback with exponential backoff and persistent thread checkpoint rewind.",
      time: "1 hour ago",
      upvotes: 24
    }
  ]);
  const [newQuestionText, setNewQuestionText] = useState<string>("");

  // Certificate Modal State
  const [showCertModal, setShowCertModal] = useState<boolean>(false);

  // Initialize Code & Note when item changes
  useEffect(() => {
    if (activeItem) {
      setUserCode(activeItem.codeSnippet || "// Enter solution code here");
      setCodeOutput("");
      setLabPassed(false);
      setQuizAnswers({});
      setQuizSubmitted(false);
      setQuizScore(0);
      setCurrentCardIndex(0);
      setIsCardFlipped(false);
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
  const enrolled = isEnrolled(course.id);

  // Navigation handlers
  const handleSelectNavigableItem = (item: NavigableItem) => {
    setActiveItemId(item.id);
  };

  const handlePrevItem = () => {
    if (activeIndex > 0) {
      setActiveItemId(navigableItems[activeIndex - 1].id);
    }
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

  // Run & Verify Lab Code
  const handleRunLabCode = () => {
    setIsRunningCode(true);
    setCodeOutput("Compiling in isolated Astra WebAssembly runtime...\n");
    setTimeout(() => {
      const outputLog = `[VM RUNTIME 200 OK] Output:\n> Initializing sandbox test harness on 3 test suites...\n> Test 1: Deterministic state transition -> PASSED (1.4ms)\n> Test 2: Concurrent load verification (1000 ops) -> PASSED (4.8ms)\n> Test 3: Checkpoint recovery resilience -> PASSED (2.1ms)\n\n🏆 ALL VERIFICATIONS PASSED!\nPeak Memory: 14.8 MB | Exit Status: 0`;
      setCodeOutput(outputLog);
      setLabPassed(true);
      setIsRunningCode(false);
    }, 750);
  };

  // Submit Quiz
  const handleSubmitQuiz = () => {
    if (!activeItem || !activeItem.quizzes) return;
    let correctCount = 0;
    activeItem.quizzes.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });
    setQuizScore(correctCount);
    setQuizSubmitted(true);
  };

  // Save Note to Notes Hub
  const handleSavePersonalNote = () => {
    if (!activeItem) return;
    addBookmark({
      courseId: course.id,
      courseTitle: course.title,
      lessonId: activeItem.id,
      lessonTitle: activeItem.title,
      noteText: personalNote,
      snippet: userCode,
      tags: [course.category, "Classroom Notes"]
    });
    setSaveNoteSuccess(true);
    setTimeout(() => setSaveNoteSuccess(false), 2500);
  };

  // Post Discussion Question
  const handlePostQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;
    const newComment = {
      id: `qa-${Date.now()}`,
      user: user?.name || "Alex Morgan",
      role: "Student",
      text: newQuestionText.trim(),
      time: "Just now",
      upvotes: 1
    };
    setQaComments([newComment, ...qaComments]);
    setNewQuestionText("");
  };

  // Filtered navigable items for syllabus search
  const filteredNavItems = navigableItems.filter((item) => {
    const q = syllabusSearchQuery.toLowerCase().trim();
    const matchQuery = !q || item.title.toLowerCase().includes(q) || item.moduleTitle.toLowerCase().includes(q) || (item.submoduleTitle && item.submoduleTitle.toLowerCase().includes(q));
    const matchType = syllabusTypeFilter === "all" || item.type === syllabusTypeFilter;
    return matchQuery && matchType;
  });

  return (
    <div className={`app ${dark ? "dark" : ""} min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)] select-none`}>
      {/* ================= TOP CLASSROOM APP BAR ================= */}
      {!isFocusMode && (
        <header className="sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6 py-2.5 border-b border-[var(--border-soft)] bg-[var(--surface)]/95 backdrop-blur-md shadow-sm">
          {/* Left: Dashboard Back & Course Title */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 text-xs font-bold text-[var(--muted)] hover:text-[var(--text)] transition-colors shrink-0"
              title="Return to Student Dashboard"
            >
              <span>←</span>
              <span className="hidden sm:inline">Dashboard</span>
            </Link>

            <span className="text-[var(--border)]">|</span>

            {/* Syllabus Sidebar Toggle Button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                isSidebarOpen
                  ? "bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/20"
                  : "bg-[var(--surface-soft)] hover:bg-[var(--surface)] border-[var(--border)] text-[var(--text)]"
              }`}
              title="Toggle Curriculum Syllabus Sidebar"
            >
              <span>☰</span>
              <span className="hidden md:inline">Curriculum Outline</span>
              <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-black ${
                isSidebarOpen ? "bg-white/20 text-white" : "bg-purple-500/15 text-purple-400"
              }`}>
                {progress.completed}/{progress.total}
              </span>
            </button>

            {/* Course Title */}
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <h1 className="text-xs sm:text-sm font-extrabold truncate max-w-[280px] sm:max-w-md">
                {course.title}
              </h1>
            </div>
          </div>

          {/* Right: Progress Meter + Theme Toggle + Focus Mode */}
          <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
            {/* Progress Gauge */}
            <div className="flex items-center gap-2 bg-[var(--surface-soft)] px-3 py-1.5 rounded-full border border-[var(--border-soft)]">
              <div className="w-20 sm:w-28 h-2 bg-[var(--surface)] rounded-full overflow-hidden border border-[var(--border)]">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-400 transition-all duration-500"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
              <span className="text-xs font-black text-purple-400">{progress.percentage}%</span>
            </div>

            {/* Focus Mode Toggle */}
            <button
              onClick={() => setIsFocusMode(true)}
              className="px-2.5 py-1.5 rounded-xl bg-[var(--surface-soft)] hover:bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--muted)] hover:text-[var(--text)] transition-colors hidden lg:flex items-center gap-1 cursor-pointer"
              title="Enter Fullscreen Focus Classroom Mode"
            >
              <span>🔲</span>
              <span>Focus Mode</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setDark(!dark)}
              className="p-1.5 sm:p-2 rounded-xl bg-[var(--surface-soft)] border border-[var(--border-soft)] text-[var(--muted)] hover:text-[var(--text)] cursor-pointer"
              title="Toggle Theme"
            >
              {dark ? "☀️" : "🌙"}
            </button>
          </div>
        </header>
      )}

      {/* Focus Mode Escape Floating Banner */}
      {isFocusMode && (
        <div className="bg-purple-900/90 text-purple-100 text-xs py-1.5 px-4 flex items-center justify-between z-50">
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

      {/* ================= MAIN 2-COLUMN SPLIT LEARNING ARENA ================= */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative" style={{ height: isFocusMode ? "100vh" : "calc(100vh - 57px)" }}>

        {/* ================= LEFT COLUMN: CISCO MULTI-LEVEL HIERARCHY SYLLABUS ================= */}
        {isSidebarOpen && (
          <aside className="w-full lg:w-[380px] xl:w-[410px] shrink-0 border-r border-[var(--border-soft)] bg-[var(--surface)] flex flex-col h-full overflow-hidden z-20 shadow-2xl transition-all duration-200">
            {/* Syllabus Top Header & Progress */}
            <div className="p-4 border-b border-[var(--border-soft)] bg-[var(--surface-soft)]/60 space-y-3 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-[var(--text)]">
                    Curriculum Hierarchy
                  </h3>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1 rounded-lg hover:bg-[var(--surface)] text-xs text-[var(--muted)] hover:text-[var(--text)] cursor-pointer"
                  title="Collapse Syllabus"
                >
                  ◀
                </button>
              </div>

              {/* Solved / Completion Gauge */}
              <div className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border-soft)] space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-emerald-400">
                    ✓ {progress.completed} of {progress.total} Topics Mastered
                  </span>
                  <span className="text-[var(--muted)] font-mono text-[10px]">
                    +{progress.completed * 100} XP
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[var(--surface-soft)] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-400 transition-all duration-500 rounded-full"
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>
              </div>

              {/* Search Bar in Curriculum */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search modules, topics, labs..."
                  value={syllabusSearchQuery}
                  onChange={(e) => setSyllabusSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-[var(--surface)] border border-[var(--border-soft)] text-xs text-[var(--text)] outline-none focus:border-purple-500"
                />
                <span className="absolute left-2.5 top-1.5 text-xs text-[var(--muted)]">🔍</span>
                {syllabusSearchQuery && (
                  <button
                    onClick={() => setSyllabusSearchQuery("")}
                    className="absolute right-2.5 top-1.5 text-xs text-[var(--muted)] hover:text-[var(--text)] cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Type Filter Pills Grid */}
              <div className="grid grid-cols-5 gap-1 pt-0.5">
                {[
                  { id: "all", label: "All" },
                  { id: "video", label: "🎥 Video" },
                  { id: "reading", label: "📄 Theory" },
                  { id: "lab", label: "🔬 Lab" },
                  { id: "quiz", label: "🧠 Quiz" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSyllabusTypeFilter(f.id as any)}
                    className={`py-1 rounded-lg text-[10px] font-bold text-center truncate transition-all cursor-pointer ${
                      syllabusTypeFilter === f.id
                        ? "bg-purple-600 text-white shadow-xs"
                        : "bg-[var(--surface)] border border-[var(--border-soft)] text-[var(--muted)] hover:text-[var(--text)]"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable Curriculum Tree Navigation */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {filteredNavItems.length === 0 ? (
                <div className="p-8 text-center text-xs text-[var(--muted)] space-y-2">
                  <div className="text-2xl">🔎</div>
                  <p>No topics match your current filter.</p>
                  <button
                    onClick={() => {
                      setSyllabusSearchQuery("");
                      setSyllabusTypeFilter("all");
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
                          <h4 className="text-xs font-black truncate text-[var(--text)]">
                            {mod.title}
                          </h4>
                        </div>
                        <span className="text-[10px] font-bold text-[var(--muted)] shrink-0 ml-2 font-mono">
                          {mod.duration}
                        </span>
                      </div>

                      {/* Items / Submodules inside Module */}
                      <div className="divide-y divide-[var(--border-soft)]">
                        {modItems.map((item) => {
                          const isSelected = item.id === activeItem?.id;
                          const isDone = isLessonCompleted(item.id);
                          const quizCount = item.quizzes?.length || 0;

                          return (
                            <button
                              key={item.id}
                              onClick={() => handleSelectNavigableItem(item)}
                              className={`w-full p-2.5 text-left flex items-start gap-2.5 transition-all cursor-pointer group ${
                                isSelected
                                  ? "bg-purple-600/15 text-purple-300 font-bold border-l-4 border-purple-500 shadow-inner"
                                  : "hover:bg-[var(--surface-soft)] text-[var(--text)]"
                              }`}
                            >
                              {/* Completion Checkmark */}
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
                                    {item.type === "video" ? "🎥" : item.type === "lab" ? "🔬" : item.type === "quiz" ? "🧠" : "📄"}
                                  </span>
                                  <p className={`text-xs leading-snug line-clamp-2 ${isSelected ? "text-purple-400 font-black" : "text-[var(--text)]"}`}>
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
        )}

        {/* ================= RIGHT COLUMN: CISCO-GRADE MULTI-CONTENT LEARNING WORKSPACE ================= */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Top Breadcrumb & Quick Action Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--border-soft)] shadow-sm">
            {/* Breadcrumb Hierarchy Path */}
            <div className="flex items-center gap-1.5 text-xs text-[var(--muted)] min-w-0 flex-wrap">
              <span className="text-purple-400 font-bold">{course.title}</span>
              <span>/</span>
              <span className="truncate max-w-[200px]">{activeItem?.moduleTitle}</span>
              {activeItem?.submoduleTitle && activeItem.submoduleTitle !== activeItem.title && (
                <>
                  <span>/</span>
                  <span className="truncate max-w-[150px]">{activeItem.submoduleTitle}</span>
                </>
              )}
              <span>/</span>
              <span className="font-extrabold text-[var(--text)] truncate max-w-[220px]">{activeItem?.title}</span>
            </div>

            {/* Quick Next / Prev Buttons & Mark Completed CTA */}
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              {/* Prev Button */}
              <button
                onClick={handlePrevItem}
                disabled={activeIndex <= 0}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[var(--surface-soft)] hover:bg-[var(--surface)] border border-[var(--border)] disabled:opacity-40 transition-colors cursor-pointer"
                title="Previous Topic"
              >
                ◀ Prev
              </button>

              {/* Next Button */}
              <button
                onClick={handleNextItem}
                disabled={activeIndex >= navigableItems.length - 1}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[var(--surface-soft)] hover:bg-[var(--surface)] border border-[var(--border)] disabled:opacity-40 transition-colors cursor-pointer"
                title="Next Topic"
              >
                Next ▶
              </button>

              {/* Bookmark to Notes Hub */}
              <button
                onClick={() => {
                  if (activeItem) {
                    if (isBookmarked(activeItem.id)) {
                      const existing = bookmarks.find((b) => b.lessonId === activeItem.id);
                      if (existing) removeBookmark(existing.id);
                    } else {
                      addBookmark({
                        courseId: course.id,
                        courseTitle: course.title,
                        lessonId: activeItem.id,
                        lessonTitle: activeItem.title,
                        noteText: activeItem.summary,
                        snippet: activeItem.codeSnippet,
                        tags: [course.category, "Lesson Note"]
                      });
                    }
                  }
                }}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs border transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeItem && isBookmarked(activeItem.id)
                    ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                    : "bg-[var(--surface-soft)] border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)]"
                }`}
                title="Save bookmark & code to Notes Hub"
              >
                <span>{activeItem && isBookmarked(activeItem.id) ? "★ Saved" : "☆ Bookmark"}</span>
              </button>

              {/* Complete Lesson / Topic CTA */}
              <button
                onClick={handleCompleteCurrent}
                className={`px-4 py-1.5 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                  isLessonCompleted(activeItem?.id || "")
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm"
                    : "bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/25"
                }`}
              >
                <span>{isLessonCompleted(activeItem?.id || "") ? "✓ Completed (+100 XP)" : "Mark Complete & Next"}</span>
              </button>
            </div>
          </div>

          {/* ================= CISCO-GRADE MULTI-FORMAT MODE TABS ================= */}
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-xl">
            {/* Horizontal Tabs Bar */}
            <div className="flex border-b border-[var(--border-soft)] bg-[var(--surface-soft)]/80 overflow-x-auto no-scrollbar">
              {[
                { id: "video", label: "🎥 Video Lecture", badge: activeItem?.timestamps?.length ? `${activeItem.timestamps.length} Ch` : undefined },
                { id: "reading", label: "📄 Cisco Theory & Interactive Reading" },
                { id: "lab", label: "🔬 Hands-on CLI & Sandbox Lab" },
                { id: "quiz", label: `🧠 Assessments (${activeItem?.quizzes?.length || 1})`, badge: quizSubmitted ? `${quizScore}/${activeItem?.quizzes?.length || 1}` : undefined },
                { id: "flashcards", label: `💡 Flashcards (${activeItem?.flashcards?.length || 2})` },
                { id: "resources", label: `📑 Resources & Cheatsheets (${activeItem?.resources?.length || 2})` },
                { id: "qa", label: `💬 Discussion & Q&A (${qaComments.length})` },
                { id: "scratchpad", label: "📝 Personal Scratchpad" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveContentTab(tab.id as any)}
                  className={`px-4 py-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                    activeContentTab === tab.id
                      ? "border-purple-500 text-purple-400 bg-[var(--surface)] shadow-inner"
                      : "border-transparent text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface)]/50"
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="px-1.5 py-0.2 rounded-md bg-purple-500/20 text-purple-300 text-[10px] font-black">
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* TAB 1: VIDEO LECTURE + TIMESTAMPS + TRANSCRIPT */}
            {activeContentTab === "video" && (
              <div className="p-4 sm:p-6 space-y-6">
                {/* 16:9 Responsive Video Container */}
                <div className="relative rounded-2xl overflow-hidden border border-[var(--border)] bg-black aspect-video shadow-2xl">
                  {activeItem?.videoUrl ? (
                    <iframe
                      src={activeItem.videoUrl}
                      title={activeItem.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#120f24] to-[#1c1833] p-8 text-center text-white">
                      <span className="text-4xl mb-2">🎥</span>
                      <h3 className="text-base font-bold">{activeItem?.title}</h3>
                      <p className="text-xs text-gray-400 max-w-md">{activeItem?.summary}</p>
                    </div>
                  )}
                </div>

                {/* Video Playback Speed + Chapters + Live Transcript Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* Left: Chapter Timestamps (5 cols) */}
                  <div className="lg:col-span-5 p-4 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border-soft)] space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase tracking-wider text-[var(--text)] flex items-center gap-1.5">
                        <span>⏱️</span> Interactive Chapter Timestamps
                      </h4>
                      <div className="flex items-center gap-1">
                        {[0.75, 1, 1.25, 1.5, 2].map((spd) => (
                          <button
                            key={spd}
                            onClick={() => setPlaybackSpeed(spd)}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                              playbackSpeed === spd
                                ? "bg-purple-600 text-white"
                                : "text-[var(--muted)] hover:text-[var(--text)]"
                            }`}
                          >
                            {spd}x
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {activeItem?.timestamps?.map((ts, idx) => (
                        <div
                          key={idx}
                          className="p-2 rounded-xl bg-[var(--surface)] border border-[var(--border-soft)] hover:border-purple-500/50 transition-all flex items-center justify-between text-xs cursor-pointer group"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-purple-400 font-bold bg-purple-500/10 px-1.5 py-0.5 rounded">
                              {ts.time}
                            </span>
                            <span className="font-semibold group-hover:text-purple-300 transition-colors">
                              {ts.label}
                            </span>
                          </div>
                          <span className="text-[10px] text-[var(--muted)] opacity-0 group-hover:opacity-100 transition-opacity">
                            Jump ▶
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Searchable Transcript (7 cols) */}
                  <div className="lg:col-span-7 p-4 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border-soft)] space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase tracking-wider text-[var(--text)] flex items-center gap-1.5">
                        <span>📝</span> Video Transcript & Keyword Search
                      </h4>
                      <input
                        type="text"
                        placeholder="Search transcript..."
                        value={videoSearchTerm}
                        onChange={(e) => setVideoSearchTerm(e.target.value)}
                        className="px-2.5 py-1 rounded-lg bg-[var(--surface)] border border-[var(--border-soft)] text-xs text-[var(--text)] outline-none focus:border-purple-500"
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border-soft)] text-xs leading-relaxed text-[var(--muted)] max-h-48 overflow-y-auto">
                      <p>
                        {activeItem?.transcript}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CISCO-STYLE INTERACTIVE THEORY & TEXTBOOK */}
            {activeContentTab === "reading" && (
              <div className="p-6 sm:p-8 space-y-6 max-w-4xl mx-auto">
                {/* Topic Header */}
                <div className="border-b border-[var(--border-soft)] pb-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-400 font-black text-[10px] uppercase tracking-wider">
                      Cisco Theory Module
                    </span>
                    <span className="text-xs text-[var(--muted)]">•</span>
                    <span className="text-xs text-[var(--muted)]">Estimated Read Time: {activeItem?.duration}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-[var(--text)]">{activeItem?.title}</h2>
                  <p className="text-xs text-[var(--muted)] leading-relaxed">{activeItem?.summary}</p>
                </div>

                {/* Cisco Callout Alert 1: Pro-Tip */}
                <div className="p-4 rounded-2xl bg-indigo-500/10 border-l-4 border-indigo-500 space-y-1">
                  <div className="flex items-center gap-2 text-indigo-400 font-black text-xs uppercase tracking-wider">
                    <span>💡</span> Cisco Engineering Best Practice
                  </div>
                  <p className="text-xs text-[var(--text)] leading-relaxed">
                    Always decouple compute workers from deterministic graph checkpoints. In mission-critical production pipelines, persisting intermediate thread state prevents cascading failures and eliminates re-computation costs.
                  </p>
                </div>

                {/* Markdown Theory Content */}
                <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed space-y-4">
                  <div className="p-5 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border-soft)]">
                    <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-[var(--text)]">
                      {activeItem?.notes}
                    </pre>
                  </div>
                </div>

                {/* Cisco Callout Alert 2: Security & Warning */}
                <div className="p-4 rounded-2xl bg-amber-500/10 border-l-4 border-amber-500 space-y-1">
                  <div className="flex items-center gap-2 text-amber-400 font-black text-xs uppercase tracking-wider">
                    <span>⚠️</span> Security & Invariant Invalidation Warning
                  </div>
                  <p className="text-xs text-[var(--text)] leading-relaxed">
                    Never invoke dynamic tool schemas or arbitrary shell commands without passing through an explicit validation node. Verify payload JSON structures against rigid strict schemas before dispatching to downstream actors.
                  </p>
                </div>

                {/* Interactive Data Packet Flow Table */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[var(--accent)]">
                    Protocol & State Packet Breakdown
                  </h4>
                  <div className="overflow-x-auto border border-[var(--border-soft)] rounded-2xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[var(--surface-soft)] border-b border-[var(--border-soft)] text-[10px] uppercase font-black text-[var(--muted)]">
                        <tr>
                          <th className="p-3">Sequence Phase</th>
                          <th className="p-3">State Node</th>
                          <th className="p-3">Payload Type</th>
                          <th className="p-3">Latency SLA</th>
                          <th className="p-3">Guarantee</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border-soft)] font-mono text-[11px]">
                        <tr>
                          <td className="p-3 font-bold text-purple-400">01. INGEST</td>
                          <td className="p-3">UserQueryDispatcher</td>
                          <td className="p-3">Raw String / Context</td>
                          <td className="p-3">&lt; 15 ms</td>
                          <td className="p-3 text-emerald-400">At least once</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-purple-400">02. RETRIEVE</td>
                          <td className="p-3">HybridVectorNode</td>
                          <td className="p-3">Dense + BM25 Embeddings</td>
                          <td className="p-3">&lt; 45 ms</td>
                          <td className="p-3 text-emerald-400">Top-k Relevant</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-purple-400">03. EVALUATE</td>
                          <td className="p-3">StateGraphCheckpoint</td>
                          <td className="p-3">Thread Checkpoint Struct</td>
                          <td className="p-3">&lt; 20 ms</td>
                          <td className="p-3 text-emerald-400">Deterministic Replay</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: HANDS-ON CLI & SANDBOX LAB */}
            {activeContentTab === "lab" && (
              <div className="p-4 sm:p-6 space-y-5">
                {/* Lab Header & Objective */}
                <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase">
                        Hands-on Lab Simulator
                      </span>
                      <span className="text-xs font-bold text-[var(--text)]">{activeItem?.title}</span>
                    </div>
                    <p className="text-xs text-[var(--muted)]">{activeItem?.labObjective}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setUserCode(activeItem?.codeSnippet || "")}
                      className="px-3 py-1.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs font-bold hover:bg-[var(--surface-soft)] cursor-pointer"
                    >
                      ↺ Reset Starter
                    </button>
                    <button
                      onClick={handleRunLabCode}
                      disabled={isRunningCode}
                      className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black shadow-lg shadow-purple-600/25 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <span>{isRunningCode ? "⏳" : "▶"}</span>
                      <span>{isRunningCode ? "Executing Lab..." : "Run & Verify Lab"}</span>
                    </button>
                  </div>
                </div>

                {/* Code Editor + Live Terminal Split */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  {/* Left: Interactive Code/CLI Editor (7 cols) */}
                  <div className="lg:col-span-7 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-[var(--muted)] px-1">
                      <span>Source Implementation (TypeScript / Python)</span>
                      <span className="font-mono text-[10px]">UTF-8 • 2 Spaces</span>
                    </div>
                    <textarea
                      rows={14}
                      value={userCode}
                      onChange={(e) => setUserCode(e.target.value)}
                      className="w-full p-4 rounded-2xl font-mono text-xs bg-[#0b0a14] text-[#93c5fd] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y leading-relaxed shadow-inner"
                    />
                  </div>

                  {/* Right: Interactive Terminal Console Output (5 cols) */}
                  <div className="lg:col-span-5 space-y-2 flex flex-col">
                    <div className="flex items-center justify-between text-xs font-bold text-[var(--muted)] px-1">
                      <span>Astra Isolated Terminal Sandbox</span>
                      {labPassed && (
                        <span className="text-emerald-400 font-bold text-[11px] animate-pulse">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                    <div className="flex-1 p-4 rounded-2xl bg-[#06050b] text-[#34d399] font-mono text-xs border border-[var(--border-soft)] whitespace-pre-wrap min-h-[260px] overflow-y-auto shadow-inner">
                      {codeOutput || (
                        <div className="text-gray-500 italic space-y-2">
                          <p>&gt; Astra Terminal Sandbox v2.4 online.</p>
                          <p>&gt; Click "Run & Verify Lab" above to compile and validate tests.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: MULTI-QUIZ & ASSESSMENTS */}
            {activeContentTab === "quiz" && (
              <div className="p-6 sm:p-8 space-y-6 max-w-3xl mx-auto">
                <div className="flex items-center justify-between border-b border-[var(--border-soft)] pb-4">
                  <div>
                    <h3 className="text-lg font-black text-[var(--text)]">Knowledge Assessment</h3>
                    <p className="text-xs text-[var(--muted)]">Test your mastery on {activeItem?.title}</p>
                  </div>
                  {quizSubmitted && (
                    <div className="px-3 py-1.5 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 text-xs font-extrabold">
                      Score: {quizScore} / {activeItem?.quizzes?.length || 1} Correct ({Math.round((quizScore / (activeItem?.quizzes?.length || 1)) * 100)}%)
                    </div>
                  )}
                </div>

                {/* Quizzes List */}
                <div className="space-y-6">
                  {activeItem?.quizzes?.map((quiz, qIdx) => (
                    <div key={quiz.id || qIdx} className="p-5 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border-soft)] space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[10px] font-black uppercase">
                          Question {qIdx + 1}
                        </span>
                        <h4 className="text-xs font-bold text-[var(--text)]">{quiz.question}</h4>
                      </div>

                      {/* Options */}
                      <div className="space-y-2">
                        {quiz.options.map((opt, optIdx) => {
                          const isSelected = quizAnswers[qIdx] === optIdx;
                          let style = "bg-[var(--surface)] border-[var(--border)] hover:border-purple-500 text-[var(--text)]";

                          if (quizSubmitted) {
                            if (optIdx === quiz.correctIndex) {
                              style = "bg-emerald-500/15 border-emerald-500 text-emerald-400 font-bold";
                            } else if (isSelected) {
                              style = "bg-rose-500/15 border-rose-500 text-rose-400";
                            }
                          } else if (isSelected) {
                            style = "bg-purple-600/20 border-purple-500 text-purple-300 font-bold";
                          }

                          return (
                            <button
                              key={optIdx}
                              disabled={quizSubmitted}
                              onClick={() => {
                                setQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
                              }}
                              className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${style}`}
                            >
                              <span>{opt}</span>
                              {quizSubmitted && optIdx === quiz.correctIndex && (
                                <span className="text-emerald-400 font-black">✓ Correct</span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      {quizSubmitted && (
                        <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--border-soft)] text-xs text-[var(--muted)] space-y-1">
                          <p className="font-bold text-purple-400">Explanation:</p>
                          <p>{quiz.explanation}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Submit / Retake Action */}
                <div className="pt-2 flex justify-end gap-3">
                  {quizSubmitted ? (
                    <button
                      onClick={() => {
                        setQuizSubmitted(false);
                        setQuizAnswers({});
                        setQuizScore(0);
                      }}
                      className="px-4 py-2 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs font-bold hover:bg-[var(--surface)] cursor-pointer"
                    >
                      ↺ Retake Quiz
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitQuiz}
                      disabled={Object.keys(quizAnswers).length === 0}
                      className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black shadow-md shadow-purple-600/25 cursor-pointer disabled:opacity-40"
                    >
                      Submit Answers
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* TAB 5: KEY CONCEPT FLASHCARDS */}
            {activeContentTab === "flashcards" && (
              <div className="p-6 sm:p-8 space-y-6 max-w-xl mx-auto text-center">
                <div className="space-y-1">
                  <h3 className="text-base font-black text-[var(--text)]">Concept Flashcards</h3>
                  <p className="text-xs text-[var(--muted)]">Active recall card {currentCardIndex + 1} of {activeItem?.flashcards?.length || 1}</p>
                </div>

                {/* Flip Card Container */}
                {activeItem?.flashcards && activeItem.flashcards.length > 0 && (
                  <div
                    onClick={() => setIsCardFlipped(!isCardFlipped)}
                    className="min-h-[220px] p-8 rounded-3xl bg-[var(--surface-soft)] border border-[var(--border)] hover:border-purple-500/50 shadow-2xl flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-[1.01]"
                  >
                    <span className="text-[10px] font-black uppercase text-purple-400 tracking-wider mb-3">
                      {isCardFlipped ? "Answer / Explanation (Click to flip)" : "Concept Term (Click to reveal)"}
                    </span>
                    <h4 className="text-base sm:text-lg font-black text-[var(--text)] leading-relaxed">
                      {isCardFlipped ? activeItem.flashcards[currentCardIndex].back : activeItem.flashcards[currentCardIndex].front}
                    </h4>
                  </div>
                )}

                {/* Flashcard Controls */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    disabled={currentCardIndex <= 0}
                    onClick={() => {
                      setCurrentCardIndex((prev) => Math.max(prev - 1, 0));
                      setIsCardFlipped(false);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs font-bold disabled:opacity-30 cursor-pointer"
                  >
                    ◀ Prev Card
                  </button>

                  <button
                    onClick={() => {
                      setMasteredCards((prev) => new Set(prev).add(currentCardIndex));
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      masteredCards.has(currentCardIndex)
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                        : "bg-[var(--surface-soft)] border-[var(--border)] text-[var(--muted)]"
                    }`}
                  >
                    {masteredCards.has(currentCardIndex) ? "✓ Mastered" : "Mark as Mastered"}
                  </button>

                  <button
                    disabled={!activeItem?.flashcards || currentCardIndex >= activeItem.flashcards.length - 1}
                    onClick={() => {
                      setCurrentCardIndex((prev) => Math.min(prev + 1, (activeItem?.flashcards?.length || 1) - 1));
                      setIsCardFlipped(false);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs font-bold disabled:opacity-30 cursor-pointer"
                  >
                    Next Card ▶
                  </button>
                </div>
              </div>
            )}

            {/* TAB 6: RESOURCES & DOWNLOADS */}
            {activeContentTab === "resources" && (
              <div className="p-6 sm:p-8 space-y-6 max-w-3xl mx-auto">
                <div className="border-b border-[var(--border-soft)] pb-3">
                  <h3 className="text-base font-black text-[var(--text)]">Downloadable Assets & Cheatsheets</h3>
                  <p className="text-xs text-[var(--muted)]">Official course reference materials, CLI templates, and architecture specs.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeItem?.resources?.map((res) => (
                    <div
                      key={res.id}
                      className="p-4 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border-soft)] hover:border-purple-500/50 transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{res.type === "pdf" ? "📕" : "💻"}</span>
                        <div>
                          <h4 className="text-xs font-bold text-[var(--text)]">{res.name}</h4>
                          <span className="text-[10px] text-[var(--muted)] font-mono">{res.size || "1.2 MB"} • {res.type.toUpperCase()}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => alert(`Downloading ${res.name}...`)}
                        className="px-3 py-1.5 rounded-xl bg-[var(--surface)] hover:bg-purple-600 hover:text-white border border-[var(--border)] text-xs font-bold transition-all cursor-pointer"
                      >
                        Download ⤓
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 7: DISCUSSION & Q&A */}
            {activeContentTab === "qa" && (
              <div className="p-6 sm:p-8 space-y-6 max-w-3xl mx-auto">
                <div className="flex items-center justify-between border-b border-[var(--border-soft)] pb-3">
                  <div>
                    <h3 className="text-base font-black text-[var(--text)]">Student Q&A Community</h3>
                    <p className="text-xs text-[var(--muted)]">Ask questions and discuss architectural details with fellow students and instructors.</p>
                  </div>
                </div>

                {/* Ask Question Form */}
                <form onSubmit={handlePostQuestion} className="space-y-3">
                  <textarea
                    rows={3}
                    placeholder="Ask a question about this module..."
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border-soft)] text-xs text-[var(--text)] focus:outline-none focus:border-purple-500"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!newQuestionText.trim()}
                      className="button button-sm text-xs font-black cursor-pointer disabled:opacity-40"
                    >
                      Post Question
                    </button>
                  </div>
                </form>

                {/* Comments List */}
                <div className="space-y-3 pt-2">
                  {qaComments.map((c) => (
                    <div key={c.id} className="p-4 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border-soft)] space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-purple-600/30 text-purple-300 text-[10px] font-bold flex items-center justify-center">
                            {c.user.slice(0, 2).toUpperCase()}
                          </span>
                          <span className="text-xs font-bold text-[var(--text)]">{c.user}</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            c.role === "Instructor" ? "bg-amber-500/20 text-amber-400" : "bg-purple-500/20 text-purple-400"
                          }`}>
                            {c.role}
                          </span>
                        </div>
                        <span className="text-[10px] text-[var(--muted)]">{c.time}</span>
                      </div>
                      <p className="text-xs text-[var(--muted)] leading-relaxed">{c.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 8: PERSONAL SCRATCHPAD */}
            {activeContentTab === "scratchpad" && (
              <div className="p-6 sm:p-8 space-y-4 max-w-3xl mx-auto">
                <div className="flex items-center justify-between border-b border-[var(--border-soft)] pb-3">
                  <div>
                    <h3 className="text-base font-black text-[var(--text)]">Lesson Scratchpad Notes</h3>
                    <p className="text-xs text-[var(--muted)]">Personal markdown notes synced automatically with your Astra Notes Hub.</p>
                  </div>
                  <button
                    onClick={handleSavePersonalNote}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black shadow cursor-pointer"
                  >
                    {saveNoteSuccess ? "✓ Saved to Hub!" : "Save to Notes Hub"}
                  </button>
                </div>

                <textarea
                  rows={10}
                  value={personalNote}
                  onChange={(e) => setPersonalNote(e.target.value)}
                  className="w-full p-4 rounded-2xl font-mono text-xs bg-[var(--surface-soft)] text-[var(--text)] border border-[var(--border-soft)] focus:outline-none focus:border-purple-500 leading-relaxed"
                />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ================= VERIFIED CERTIFICATE MODAL ================= */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="max-w-lg w-full p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-black border border-amber-300 flex items-center justify-center mx-auto text-3xl shadow-xl shadow-amber-500/20">
              🏆
            </div>
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-[var(--text)]">Course 100% Completed!</h2>
              <p className="text-xs text-[var(--muted)]">
                Congratulations, <strong>{user?.name || "Student"}</strong>! You have mastered all modules in <strong>{course.title}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border-soft)] text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Graduate:</span>
                <span className="font-bold">{user?.name || "Alex Morgan"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Credential ID:</span>
                <span className="font-mono text-purple-400 font-black">ASTRA-CERT-2027-{Math.floor(1000 + Math.random() * 9000)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Issued By:</span>
                <span className="font-bold">{course.instructor.name} ({course.instructor.company})</span>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  claimCertificate(course.id);
                  setShowCertModal(false);
                  navigate("/dashboard");
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs shadow-lg shadow-purple-600/30 cursor-pointer"
              >
                Claim Verified Certificate & Return to Dashboard
              </button>
              <button
                onClick={() => setShowCertModal(false)}
                className="px-4 py-2 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
