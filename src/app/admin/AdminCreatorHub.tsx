import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { useCourses, type Course, type Module, type Lesson, type HierarchyItem } from "../context/CourseContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../theme";
import { SiteNav, SiteFooter } from "../../App";
import InfiniteHierarchyEditor from "./InfiniteHierarchyEditor";
import AdminHackathonStudio from "./AdminHackathonStudio";

const GRADIENT_PRESETS = [
  { id: "neon", name: "Vibrant Neon", gradient: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%)" },
  { id: "cyberpunk", name: "Cyberpunk Violet", gradient: "linear-gradient(135deg, #7c3aed 0%, #4338ca 100%)" },
  { id: "emerald", name: "Emerald Deep", gradient: "linear-gradient(135deg, #059669 0%, #0d9488 50%, #0284c7 100%)" },
  { id: "sunset", name: "Sunset Amber", gradient: "linear-gradient(135deg, #f59e0b 0%, #ea580c 50%, #e11d48 100%)" },
  { id: "cosmic", name: "Cosmic Indigo", gradient: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)" },
  { id: "obsidian", name: "Midnight Obsidian", gradient: "linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)" },
  { id: "aurora", name: "Aurora Teal", gradient: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)" },
  { id: "crimson", name: "Hyperdrive Crimson", gradient: "linear-gradient(135deg, #e11d48 0%, #701a75 100%)" },
];

export default function AdminCreatorHub() {
  const { dark } = useTheme();
  const { user, switchRole } = useAuth();
  const navigate = useNavigate();
  const { courses, createCourse, updateCourse, deleteCourse } = useCourses();

  const [activeTab, setActiveTab] = useState<"courses" | "create" | "hackathons" | "analytics">("create");
  const [curriculumViewMode, setCurriculumViewMode] = useState<"infinite" | "linear">("infinite");
  const [searchQuery, setSearchQuery] = useState("");
  const [publishSuccess, setPublishSuccess] = useState<string | null>(null);

  // Edit Mode State: null = create new, string = editing existing course ID
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("Microservices with Go & gRPC Masterclass");
  const [tagline, setTagline] = useState("Build distributed, ultra-resilient microservice systems with Protocol Buffers");
  const [description, setDescription] = useState("Learn how to design, test, and deploy microservices with high throughput and sub-millisecond serialization using Go and gRPC.");
  const [category, setCategory] = useState<"ai" | "fullstack" | "security" | "devops" | "design">("fullstack");
  const [categoryLabel, setCategoryLabel] = useState("Full-Stack & Systems");
  const [level, setLevel] = useState<"Beginner" | "Intermediate" | "Advanced" | "All Levels">("Intermediate");
  const [duration, setDuration] = useState("14.5 Hours");
  const [price, setPrice] = useState(49);
  const [instructorName, setInstructorName] = useState(user?.name || "Dr. Sarah Chen");
  const [instructorRole, setInstructorRole] = useState("Principal Distributed Systems Engineer");
  const [skills, setSkills] = useState("Golang, gRPC, Protocol Buffers, Docker, Microservices");
  
  // Thumbnail & Banner state
  const [bannerGradient, setBannerGradient] = useState("linear-gradient(135deg, #6366f1 0%, #a855f7 100%)");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [previewDarkMode, setPreviewDarkMode] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic modules state
  const [modules, setModules] = useState<Module[]>([
    {
      id: "mod-1",
      title: "Module 1: High-Performance Serialization with Protocol Buffers",
      duration: "3.5 Hours",
      lessons: [
        {
          id: "les-1-1",
          title: "Introduction to gRPC Architecture and Binary Protocols",
          duration: "25 min",
          type: "video",
          videoUrl: "https://www.youtube-nocookie.com/embed/aircAruvnKk",
          summary: "Understand HTTP/2 multiplexing, proto3 syntax, and code generation.",
          notes: "# Protocol Buffers v3\n\ngRPC uses binary serialization over HTTP/2, yielding up to 7-10x performance improvements compared to REST JSON.",
          codeSnippet: `syntax = "proto3";\npackage auth;\n\nmessage UserRequest {\n  string user_id = 1;\n  string auth_token = 2;\n}`,
          quiz: {
            question: "Why is gRPC faster than traditional REST JSON?",
            options: [
              "It uses HTTP/2 multiplexing and compact binary serialization",
              "It only works on local computers",
              "It does not use network sockets",
              "It eliminates all database queries"
            ],
            correctIndex: 0,
            explanation: "gRPC leverages binary proto encoding and HTTP/2 bi-directional streaming for maximum network efficiency."
          }
        }
      ]
    }
  ]);

  // Infinite Hierarchy Tree State (Recursive submodules & multi-quizzes)
  const [hierarchyItems, setHierarchyItems] = useState<HierarchyItem[]>([
    {
      id: "mod-1",
      title: "Module 1: High-Performance Serialization with Protocol Buffers",
      type: "module",
      duration: "3.5 Hours",
      summary: "Understand HTTP/2 multiplexing, proto3 syntax, and code generation.",
      quizzes: [
        {
          id: "q-1",
          question: "Why is gRPC faster than traditional REST JSON?",
          options: [
            "It uses HTTP/2 multiplexing and compact binary serialization",
            "It only works on local computers",
            "It does not use network sockets",
            "It eliminates all database queries"
          ],
          correctIndex: 0,
          explanation: "gRPC leverages binary proto encoding and HTTP/2 bi-directional streaming for maximum network efficiency.",
          points: 50
        }
      ],
      children: [
        {
          id: "sub-1-1",
          title: "Submodule 1.1: Binary Encoding & Protobuf Buffer Internals",
          type: "submodule",
          duration: "25 min",
          summary: "Varint encoding, zig-zag signed integers, and memory alignment.",
          quizzes: [
            {
              id: "q-1-1",
              question: "How does Protobuf encode small integers efficiently?",
              options: [
                "Using Variable-length Quantity (Varint) 7-bit payload bytes",
                "Converting all numbers to 64-bit strings",
                "Encrypting with AES-GCM",
                "Base64 padding"
              ],
              correctIndex: 0,
              explanation: "Varints use the most significant bit (MSB) as a continuation marker, allowing values < 128 to take just 1 byte.",
              points: 50
            }
          ],
          children: [
            {
              id: "sub-1-1-1",
              title: "Submodule 1.1.1: Zero-Copy Deserialization Benchmarks",
              type: "submodule",
              duration: "20 min",
              summary: "Measuring CPU cache locality and zero-allocation string parsing.",
              quizzes: [
                {
                  id: "q-1-1-1",
                  question: "Which Rust feature enables zero-copy buffer slicing?",
                  options: [
                    "Byte slices (&[u8]) with lifetime borrowing",
                    "Cloning strings on every read",
                    "Global mutex locks",
                    "Dynamic pointer casting without validation"
                  ],
                  correctIndex: 0,
                  explanation: "Rust's borrow checker enables safe zero-copy &[u8] referencing directly into received network buffer memory.",
                  points: 50
                }
              ],
              children: []
            }
          ]
        }
      ]
    }
  ]);

  // Load course into editor for Post-Publish Editing
  const handleLoadCourseForEdit = (course: Course) => {
    setEditingCourseId(course.id);
    setTitle(course.title);
    setTagline(course.tagline);
    setDescription(course.description);
    setCategory(course.category);
    setCategoryLabel(course.categoryLabel);
    setLevel(course.level);
    setDuration(course.duration);
    setPrice(course.price);
    setInstructorName(course.instructor.name);
    setInstructorRole(course.instructor.role);
    setSkills(course.skills.join(", "));
    setBannerGradient(course.bannerGradient || "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)");
    setThumbnailUrl(course.thumbnailUrl || "");
    setModules(JSON.parse(JSON.stringify(course.modules)));
    setActiveTab("create");
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const handleResetToNewCourse = () => {
    setEditingCourseId(null);
    setTitle("Autonomous Agentic Graph Systems");
    setTagline("Design cyclic LangGraph architectures with tool checkpoints and RAG");
    setDescription("Master multi-agent orchestration, state persistence, human-in-the-loop workflows, and evaluation pipelines.");
    setCategory("ai");
    setCategoryLabel("AI & Machine Learning");
    setLevel("Advanced");
    setDuration("16.0 Hours");
    setPrice(79);
    setInstructorName(user?.name || "Dr. Aris Vance");
    setInstructorRole("Lead AI Architect");
    setSkills("LangGraph, Vector DBs, Claude 3.7, Python 3.12, RAG");
    setBannerGradient("linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%)");
    setThumbnailUrl("");
    setModules([
      {
        id: `mod-${Date.now()}`,
        title: "Module 1: Agent Graph State & Reasoning Cycles",
        duration: "4.0 Hours",
        lessons: [
          {
            id: `les-${Date.now()}`,
            title: "Cyclic State Graphs vs Static Pipelines",
            duration: "28 min",
            type: "video",
            videoUrl: "https://www.youtube-nocookie.com/embed/aircAruvnKk",
            summary: "Learn how cyclic graphs enable agent self-correction.",
            notes: "# Cyclic Graphs in LangGraph\n\nState is passed and mutated through nodes with conditional edges.",
            codeSnippet: `const graph = new StateGraph(StateAnnotation)\n  .addNode("agent", callModel)\n  .addEdge("agent", END);`,
            quiz: {
              question: "What enables an LLM agent to retry failed tool calls?",
              options: [
                "Cyclic graph loops with conditional reflection edges",
                "Increasing GPU VRAM",
                "Disabling token limits",
                "Single-shot prompt completions"
              ],
              correctIndex: 0,
              explanation: "Cyclic state graphs maintain conversational state across execution cycles to inspect error outputs and retry."
            }
          }
        ]
      }
    ]);
  };

  // Image upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size must be under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setThumbnailUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddModule = () => {
    const modNum = modules.length + 1;
    const newMod: Module = {
      id: `mod-${Date.now()}`,
      title: `Module ${modNum}: Advanced Topics & System Patterns`,
      duration: "3.5 Hours",
      lessons: [
        {
          id: `les-${Date.now()}`,
          title: "Core Architecture & Design Patterns",
          duration: "25 min",
          type: "video",
          summary: "Deep dive into architectural patterns and resilience.",
          notes: "# Architecture Notes\n\nUnderstand key design patterns and failure modes.",
          codeSnippet: `// Implementation Example\nfunction executeWorkflow() {\n  console.log("Workflow triggered successfully");\n}`
        }
      ]
    };
    setModules([...modules, newMod]);
  };

  const handleRemoveModule = (modIdx: number) => {
    if (modules.length === 1) {
      alert("A course must have at least one module.");
      return;
    }
    setModules(modules.filter((_, idx) => idx !== modIdx));
  };

  const handleAddLesson = (modIndex: number) => {
    const targetMod = modules[modIndex];
    const newLesson: Lesson = {
      id: `les-${Date.now()}`,
      title: `Lesson ${targetMod.lessons.length + 1}: Hands-on Implementation & Sandbox`,
      duration: "20 min",
      type: "code",
      summary: "Interactive coding and verification in sandbox.",
      notes: "# Hands-on Exercise\n\nFollow step-by-step instructions to verify behavior.",
      codeSnippet: `// Sandbox exercise starter code\nconsole.log("Interactive Lesson Sandbox Active");`
    };
    const updated = [...modules];
    updated[modIndex].lessons.push(newLesson);
    setModules(updated);
  };

  const handleRemoveLesson = (modIndex: number, lesIndex: number) => {
    if (modules[modIndex].lessons.length === 1) {
      alert("Each module must contain at least one lesson.");
      return;
    }
    const updated = [...modules];
    updated[modIndex].lessons = updated[modIndex].lessons.filter((_, idx) => idx !== lesIndex);
    setModules(updated);
  };

  const handlePublishOrSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const skillsArray = skills.split(",").map((s) => s.trim()).filter(Boolean);
    const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);

    if (editingCourseId) {
      // Update existing course
      updateCourse(editingCourseId, {
        title,
        tagline,
        description,
        category,
        categoryLabel,
        level,
        duration,
        lessonsCount: totalLessons,
        price: Number(price),
        bannerGradient,
        thumbnailUrl: thumbnailUrl || undefined,
        instructor: {
          name: instructorName,
          role: instructorRole,
          avatar: instructorName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "SC",
          company: "Astra Academy",
        },
        skills: skillsArray,
        modules,
      });

      setPublishSuccess(`Course "${title}" has been updated successfully!`);
      setTimeout(() => {
        setPublishSuccess(null);
        navigate(`/learn/${editingCourseId}`);
      }, 1400);
    } else {
      // Create new course
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const newCourse = createCourse({
        slug,
        title,
        tagline,
        description,
        category,
        categoryLabel,
        level,
        duration,
        lessonsCount: totalLessons,
        price: Number(price),
        bannerGradient,
        thumbnailUrl: thumbnailUrl || undefined,
        instructor: {
          name: instructorName,
          role: instructorRole,
          avatar: instructorName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "SC",
          company: "Astra Academy",
        },
        skills: skillsArray,
        modules,
      });

      setPublishSuccess(`Course "${title}" created and published to live catalog!`);
      setTimeout(() => {
        setPublishSuccess(null);
        navigate(`/learn/${newCourse.id}`);
      }, 1400);
    }
  };

  return (
    <div className={`subpage app ${dark ? "dark" : ""} min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]`}>
      <SiteNav />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-28 space-y-8">
        {/* Header with Role Badge & Mode Indicator */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wider bg-purple-500/20 text-purple-400 border border-purple-500/30 uppercase">
                Instructor & Curriculum Studio
              </span>
              {editingCourseId ? (
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1.5 animate-pulse">
                  <span>✏️</span> Post-Publish Edit Mode
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                  <span>✨</span> New Course Authoring
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight">
              {editingCourseId ? `Editing: ${title}` : "Course Creator & Thumbnail Studio"}
            </h1>
            <p className="text-xs text-[var(--muted)] mt-1">
              Design, customize visual thumbnails, configure live code runners, and edit published curriculum in real time.
            </p>
          </div>

          <div className="flex items-center gap-3 relative z-10 flex-wrap">
            {editingCourseId && (
              <button
                onClick={handleResetToNewCourse}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-[var(--border)] bg-[var(--surface-soft)] hover:border-amber-400 text-amber-400 transition-all flex items-center gap-2"
              >
                <span>➕</span> Create New Course Instead
              </button>
            )}
            <button
              onClick={() => switchRole("student")}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-[var(--border)] bg-[var(--surface-soft)] hover:border-[var(--accent)] transition-all flex items-center gap-2"
            >
              <span>🎓</span> Switch to Student View
            </button>
            <Link to="/courses" className="button button-sm text-xs">
              View Public Catalog →
            </Link>
          </div>
        </div>

        {/* Studio Tabs */}
        <div className="flex border-b border-[var(--border-soft)] gap-2">
          <button
            onClick={() => setActiveTab("create")}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "create"
                ? "border-[var(--accent)] text-[var(--accent)]"
                : "border-transparent text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            <span className="text-sm">{editingCourseId ? "✏️" : "✨"}</span>
            {editingCourseId ? "Course & Curriculum Editor" : "Visual Course Creator"}
          </button>
          <button
            onClick={() => setActiveTab("courses")}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "courses"
                ? "border-[var(--accent)] text-[var(--accent)]"
                : "border-transparent text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            <span className="text-sm">📚</span> Manage Catalog ({courses.length})
          </button>
          <button
            onClick={() => setActiveTab("hackathons")}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "hackathons"
                ? "border-[var(--accent)] text-[var(--accent)]"
                : "border-transparent text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            <span className="text-sm">🏆</span> Hackathons & Test Cases
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "analytics"
                ? "border-[var(--accent)] text-[var(--accent)]"
                : "border-transparent text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            <span className="text-sm">📊</span> Student & Revenue Analytics
          </button>
        </div>

        {/* TAB 1: Visual Course Creator & Editor */}
        {activeTab === "create" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Column (2 Cols) */}
            <form onSubmit={handlePublishOrSaveCourse} className="lg:col-span-2 space-y-6">
              {publishSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-3 animate-bounce">
                  <span>🎉</span> {publishSuccess}
                </div>
              )}

              {/* Step 1: Course Overview & Metadata */}
              <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-[var(--accent)] flex items-center gap-2">
                    <span>1️⃣</span> Course Overview & Metadata
                  </h3>
                  {editingCourseId && (
                    <span className="text-[10px] font-mono bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-md border border-purple-500/20">
                      ID: {editingCourseId}
                    </span>
                  )}
                </div>
                
                <div>
                  <label className="block text-xs font-bold mb-1">Course Title</label>
                  <input
                    required
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs focus:ring-2 focus:ring-[var(--accent)] font-semibold"
                    placeholder="e.g. Autonomous AI Agents & LLM Systems"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Tagline (Short Punchy Value Hook)</label>
                  <input
                    required
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs focus:ring-2 focus:ring-[var(--accent)]"
                    placeholder="e.g. Build production-grade Multi-Agent workflows with LangGraph"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Full Course Description</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs focus:ring-2 focus:ring-[var(--accent)]"
                    placeholder="Detailed explanation of curriculum and real-world outcomes..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        setCategory(val);
                        setCategoryLabel(
                          val === "ai"
                            ? "AI & Machine Learning"
                            : val === "fullstack"
                            ? "Full-Stack Engineering"
                            : val === "security"
                            ? "Cybersecurity & Systems"
                            : "DevOps & Cloud"
                        );
                      }}
                      className="w-full p-3 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs"
                    >
                      <option value="ai">AI & Machine Learning</option>
                      <option value="fullstack">Full-Stack & Systems</option>
                      <option value="security">Cybersecurity & Zero Trust</option>
                      <option value="devops">DevOps & Cloud</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">Difficulty Level</label>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value as any)}
                      className="w-full p-3 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="All Levels">All Levels</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">Course Price ($ USD, 0 for Free)</label>
                    <input
                      type="number"
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full p-3 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1">Instructor Name</label>
                    <input
                      type="text"
                      value={instructorName}
                      onChange={(e) => setInstructorName(e.target.value)}
                      className="w-full p-3 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">Instructor Title / Role</label>
                    <input
                      type="text"
                      value={instructorRole}
                      onChange={(e) => setInstructorRole(e.target.value)}
                      className="w-full p-3 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Skills Covered (Comma separated tags)</label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs"
                    placeholder="LangGraph, RAG, PyTorch, Docker, Protocol Buffers"
                  />
                </div>
              </div>

              {/* Step 2: Thumbnail / Banner Studio */}
              <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] space-y-6 shadow-sm">
                <div>
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-[var(--accent)] flex items-center gap-2">
                    <span>🎨</span> Thumbnail & Banner Customizer Studio
                  </h3>
                  <p className="text-[11px] text-[var(--muted)] mt-0.5">
                    Upload a custom high-res banner or pick from 8 interactive gradient aesthetics.
                  </p>
                </div>

                {/* Upload or URL Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold">Custom Image Upload (PNG/JPG/WebP)</label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[var(--surface-soft)] border border-[var(--border)] hover:border-[var(--accent)] flex items-center gap-2 transition-all flex-1 justify-center"
                      >
                        <span>📁</span> Upload Image File
                      </button>
                      {thumbnailUrl && (
                        <button
                          type="button"
                          onClick={() => setThumbnailUrl("")}
                          className="px-3 py-2.5 rounded-xl text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20"
                          title="Remove custom image"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold">Or External Thumbnail Image URL</label>
                    <input
                      type="url"
                      value={thumbnailUrl}
                      onChange={(e) => setThumbnailUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full p-2.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs"
                    />
                  </div>
                </div>

                {/* Interactive Gradient Preset Picker */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold">Interactive Gradient Theme Presets (8 Curated)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {GRADIENT_PRESETS.map((preset) => {
                      const isSelected = bannerGradient === preset.gradient && !thumbnailUrl;
                      return (
                        <button
                          type="button"
                          key={preset.id}
                          onClick={() => {
                            setBannerGradient(preset.gradient);
                          }}
                          className={`p-2.5 rounded-xl text-left border text-xs transition-all flex flex-col gap-1.5 ${
                            isSelected
                              ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/50 shadow-md"
                              : "border-[var(--border)] hover:border-gray-400"
                          }`}
                        >
                          <div
                            className="h-8 rounded-lg w-full shadow-inner"
                            style={{ background: preset.gradient }}
                          />
                          <span className="text-[11px] font-bold truncate">{preset.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Step 3: Interactive Curriculum & Quiz Builder (Infinite Hierarchy) */}
              <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] space-y-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-soft)] pb-4">
                  <div>
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-[var(--accent)] flex items-center gap-2">
                      <span>3️⃣</span> Infinite Hierarchy Curriculum & Multi-Quiz Studio
                    </h3>
                    <p className="text-[11px] text-[var(--muted)]">
                      Create unlimited nested submodules (Module → Submodule → Sub-submodule...) with multiple quizzes per topic.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCurriculumViewMode(curriculumViewMode === "infinite" ? "linear" : "infinite")}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[var(--surface-soft)] border border-[var(--border)] hover:border-[var(--accent)] flex items-center gap-1.5 shadow-sm"
                    >
                      <span>{curriculumViewMode === "infinite" ? "📋 Switch to Linear List" : "🌳 Switch to Infinite Tree"}</span>
                    </button>
                    {curriculumViewMode === "linear" && (
                      <button
                        type="button"
                        onClick={handleAddModule}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1 shadow-sm"
                      >
                        <span>➕ Add Module</span>
                      </button>
                    )}
                  </div>
                </div>

                {curriculumViewMode === "infinite" ? (
                  <InfiniteHierarchyEditor
                    items={hierarchyItems}
                    onChange={(newItems) => {
                      setHierarchyItems(newItems);
                    }}
                  />
                ) : (
                  <div className="space-y-6">
                    {modules.map((mod, modIdx) => (
                      <div key={mod.id} className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] space-y-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 flex-1">
                            <span className="w-7 h-7 rounded-full bg-[var(--accent)] text-white text-xs font-bold flex items-center justify-center shrink-0">
                              {modIdx + 1}
                            </span>
                            <input
                              type="text"
                              value={mod.title}
                              onChange={(e) => {
                                const updated = [...modules];
                                updated[modIdx].title = e.target.value;
                                setModules(updated);
                              }}
                              className="flex-1 p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs font-bold"
                              placeholder="Module Title"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveModule(modIdx)}
                            className="text-xs text-rose-500 hover:text-rose-400 p-1 font-bold"
                            title="Delete Module"
                          >
                            ✕
                          </button>
                        </div>

                        {/* Lessons in this module */}
                        <div className="space-y-4 pl-4 sm:pl-8 border-l-2 border-[var(--border-soft)]">
                          {mod.lessons.map((lesson, lesIdx) => (
                            <div key={lesson.id} className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border-soft)] space-y-3 text-xs shadow-xs">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[10px] font-extrabold text-[var(--muted)] uppercase tracking-wider">
                                  Lesson {modIdx + 1}.{lesIdx + 1}
                                </span>
                                <div className="flex items-center gap-2">
                                  <select
                                    value={lesson.type}
                                    onChange={(e) => {
                                      const updated = [...modules];
                                      updated[modIdx].lessons[lesIdx].type = e.target.value as any;
                                      setModules(updated);
                                    }}
                                    className="p-1 rounded-md bg-[var(--surface-soft)] border border-[var(--border)] text-[10px] font-bold"
                                  >
                                    <option value="video">🎥 Video & Notes</option>
                                    <option value="code">💻 Code Sandbox</option>
                                    <option value="quiz">📝 Quiz Assessment</option>
                                  </select>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveLesson(modIdx, lesIdx)}
                                    className="text-rose-500 hover:text-rose-400 text-xs font-bold p-1"
                                    title="Delete Lesson"
                                  >
                                    ✕
                                  </button>
                                </div>
                              </div>

                              <input
                                type="text"
                                value={lesson.title}
                                onChange={(e) => {
                                  const updated = [...modules];
                                  updated[modIdx].lessons[lesIdx].title = e.target.value;
                                  setModules(updated);
                                }}
                                className="w-full p-2.5 rounded-lg bg-[var(--surface-soft)] border border-[var(--border)] text-xs font-semibold"
                                placeholder="Lesson Title"
                              />

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  value={lesson.videoUrl || ""}
                                  onChange={(e) => {
                                    const updated = [...modules];
                                    updated[modIdx].lessons[lesIdx].videoUrl = e.target.value;
                                    setModules(updated);
                                  }}
                                  className="p-2 rounded-lg bg-[var(--surface-soft)] border border-[var(--border)] text-[11px]"
                                  placeholder="Video Embed URL (YouTube/MP4)"
                                />
                                <input
                                  type="text"
                                  value={lesson.duration}
                                  onChange={(e) => {
                                    const updated = [...modules];
                                    updated[modIdx].lessons[lesIdx].duration = e.target.value;
                                    setModules(updated);
                                  }}
                                  className="p-2 rounded-lg bg-[var(--surface-soft)] border border-[var(--border)] text-[11px]"
                                  placeholder="Duration (e.g. 24 min)"
                                />
                              </div>

                              {/* Summary */}
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-[var(--muted)]">Lesson Summary</label>
                                <input
                                  type="text"
                                  value={lesson.summary}
                                  onChange={(e) => {
                                    const updated = [...modules];
                                    updated[modIdx].lessons[lesIdx].summary = e.target.value;
                                    setModules(updated);
                                  }}
                                  className="w-full p-2 rounded-lg bg-[var(--surface-soft)] border border-[var(--border)] text-[11px]"
                                  placeholder="Quick key takeaways for students"
                                />
                              </div>
                            </div>
                          ))}

                          <button
                            type="button"
                            onClick={() => handleAddLesson(modIdx)}
                            className="text-xs font-bold text-[var(--accent)] hover:underline flex items-center gap-1 mt-2"
                          >
                            ➕ Add Lesson to Module {modIdx + 1}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-4 pt-2">
                {editingCourseId && (
                  <button
                    type="button"
                    onClick={handleResetToNewCourse}
                    className="px-5 py-3 rounded-2xl text-xs font-bold border border-[var(--border)] bg-[var(--surface-soft)] hover:bg-[var(--surface)]"
                  >
                    Cancel Editing
                  </button>
                )}
                <button
                  type="submit"
                  className="button py-3.5 px-8 text-sm font-black shadow-xl hover:scale-105 transition-transform flex items-center gap-2"
                >
                  <span>{editingCourseId ? "💾" : "🚀"}</span>
                  {editingCourseId ? "Save All Course Changes" : "Publish Course to Catalog"}
                </button>
              </div>
            </form>

            {/* Live Course Preview Card Mockup (1 Col) */}
            <div className="space-y-4">
              <div className="sticky top-24 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                    Live Card Mockup Preview
                  </h3>
                  {/* Light / Dark Mode Mockup Switch */}
                  <button
                    type="button"
                    onClick={() => setPreviewDarkMode(!previewDarkMode)}
                    className="px-2.5 py-1 rounded-lg bg-[var(--surface-soft)] border border-[var(--border)] text-[10px] font-bold flex items-center gap-1.5 hover:border-[var(--accent)] transition-all"
                  >
                    <span>{previewDarkMode ? "🌙 Dark Mockup" : "☀️ Light Mockup"}</span>
                  </button>
                </div>

                {/* The Mockup Card */}
                <div className={`p-6 rounded-3xl border shadow-2xl space-y-4 transition-colors ${
                  previewDarkMode
                    ? "bg-[#131120] text-white border-purple-500/30"
                    : "bg-white text-gray-900 border-gray-200"
                }`}>
                  {/* Thumbnail / Gradient Banner */}
                  <div
                    className="h-36 rounded-2xl p-4 flex flex-col justify-between text-white shadow-inner relative overflow-hidden bg-cover bg-center"
                    style={{
                      background: thumbnailUrl ? `url(${thumbnailUrl}) center/cover no-repeat` : bannerGradient,
                    }}
                  >
                    {thumbnailUrl && <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />}
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md">
                        {categoryLabel}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md">
                        {level}
                      </span>
                    </div>
                    <div className="relative z-10 flex items-end justify-between">
                      <span className="text-xl font-black tracking-tight">{price === 0 ? "FREE" : `$${price}`}</span>
                      <span className="text-[11px] font-mono text-white/90">⏱ {duration}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-semibold text-gray-400">
                      <span>⭐ 5.0 (New Course)</span>
                      <span>•</span>
                      <span>👥 1,240 Enrolled</span>
                    </div>
                    <h4 className={`text-base font-extrabold leading-snug ${previewDarkMode ? "text-white" : "text-gray-900"}`}>
                      {title || "Untitled Masterclass"}
                    </h4>
                    <p className={`text-xs line-clamp-2 ${previewDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      {tagline || "Course Tagline goes here..."}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {skills.split(",").slice(0, 3).map((s) => s.trim() && (
                      <span
                        key={s}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${
                          previewDarkMode
                            ? "bg-purple-500/10 text-purple-300 border border-purple-500/20"
                            : "bg-purple-50 text-purple-700 border border-purple-100"
                        }`}
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className={`pt-3 border-t flex items-center justify-between ${
                    previewDarkMode ? "border-gray-800" : "border-gray-100"
                  }`}>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 text-white font-bold text-[10px] flex items-center justify-center">
                        {instructorName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "SC"}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-xs font-bold truncate max-w-[100px] ${previewDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                          {instructorName}
                        </p>
                        <p className="text-[9px] text-gray-400 truncate max-w-[100px]">{instructorRole}</p>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-purple-400">
                      {modules.reduce((acc, m) => acc + m.lessons.length, 0)} Lessons
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border-soft)] space-y-2 text-xs">
                  <h4 className="font-bold flex items-center gap-1.5 text-[var(--accent)]">
                    <span>💡</span> Creator Pro-Tip
                  </h4>
                  <p className="text-[11px] text-[var(--muted)]">
                    Changes you publish here are saved to the persistent database and immediately reflect across the Course Player, Catalog, and Student Dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Manage Catalog Table with Post-Publish Edit Actions */}
        {activeTab === "courses" && (
          <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] space-y-6 shadow-md">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-[var(--accent)]">
                  Active Courses in Catalog ({courses.length})
                </h3>
                <p className="text-xs text-[var(--muted)] mt-0.5">
                  Click <strong>"Edit Course Structure"</strong> on any course to load all modules, quizzes, and metadata into the editor.
                </p>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses or instructors..."
                className="p-2.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs w-full sm:w-72"
              />
            </div>

            <div className="divide-y divide-[var(--border-soft)]">
              {courses
                .filter((c) =>
                  c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  c.instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  c.category.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((c) => (
                  <div key={c.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xs shrink-0 shadow-md bg-cover bg-center"
                        style={{
                          background: c.thumbnailUrl ? `url(${c.thumbnailUrl}) center/cover` : c.bannerGradient || "linear-gradient(135deg, #7c3aed 0%, #4338ca 100%)",
                        }}
                      >
                        {!c.thumbnailUrl && c.category.toUpperCase().slice(0, 3)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-extrabold truncate">{c.title}</h4>
                          {c.featured && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              Featured
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--muted)] mt-1">
                          <span>👨‍🏫 {c.instructor.name}</span>
                          <span>•</span>
                          <span>📚 {c.modules.reduce((acc, m) => acc + m.lessons.length, 0)} Lessons</span>
                          <span>•</span>
                          <span>👥 {c.studentsCount.toLocaleString()} Students</span>
                          <span>•</span>
                          <span>⭐ {c.rating}</span>
                          <span>•</span>
                          <span className="font-bold text-[var(--accent)]">{c.price === 0 ? "Free" : `$${c.price}`}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <button
                        onClick={() => handleLoadCourseForEdit(c)}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[var(--surface-soft)] border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all flex items-center gap-1.5"
                      >
                        <span>✏️</span> Edit Course
                      </button>
                      <Link to={`/learn/${c.id}`} className="button button-sm text-xs">
                        Classroom →
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${c.title}"?`)) {
                            deleteCourse(c.id);
                          }
                        }}
                        className="p-2 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-500/10 border border-rose-500/30 transition-colors"
                        title="Delete Course"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 3: Hackathon & Test Case Creator Studio */}
        {activeTab === "hackathons" && (
          <AdminHackathonStudio />
        )}

        {/* TAB 4: Analytics */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)]">
                <span className="text-[10px] font-bold uppercase text-[var(--muted)]">Total Enrolled Students</span>
                <p className="text-2xl font-black mt-1">15,080</p>
                <span className="text-xs text-emerald-500 font-bold">↑ +18% this month</span>
              </div>
              <div className="p-5 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)]">
                <span className="text-[10px] font-bold uppercase text-[var(--muted)]">Monthly Course Revenue</span>
                <p className="text-2xl font-black mt-1">$148,920</p>
                <span className="text-xs text-emerald-500 font-bold">↑ +24% vs last quarter</span>
              </div>
              <div className="p-5 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)]">
                <span className="text-[10px] font-bold uppercase text-[var(--muted)]">Average Completion Rate</span>
                <p className="text-2xl font-black mt-1">87.4%</p>
                <span className="text-xs text-purple-400 font-bold">Top 5% across EdTech</span>
              </div>
              <div className="p-5 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)]">
                <span className="text-[10px] font-bold uppercase text-[var(--muted)]">Certificates Verified</span>
                <p className="text-2xl font-black mt-1">4,320</p>
                <span className="text-xs text-indigo-400 font-bold">Shared to LinkedIn</span>
              </div>
            </div>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
