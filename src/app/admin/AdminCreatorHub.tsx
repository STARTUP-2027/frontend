import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useCourses, type Course, type Module, type Lesson } from "../context/CourseContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../theme";
import { SiteNav, SiteFooter } from "../../App";

export default function AdminCreatorHub() {
  const { dark } = useTheme();
  const { user, role, switchRole } = useAuth();
  const navigate = useNavigate();
  const { courses, createCourse, deleteCourse } = useCourses();

  const [activeTab, setActiveTab] = useState<"courses" | "create" | "analytics">("create");
  const [searchQuery, setSearchQuery] = useState("");
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Form State for creating a course
  const [title, setTitle] = useState("Microservices with Go & gRPC Masterclass");
  const [tagline, setTagline] = useState("Build distributed, ultra-resilient microservice systems with Protocol Buffers");
  const [description, setDescription] = useState("Learn how to design, test, and deploy microservices with high throughput and sub-millisecond serialization using Go and gRPC.");
  const [category, setCategory] = useState<"ai" | "fullstack" | "security" | "devops">("fullstack");
  const [categoryLabel, setCategoryLabel] = useState("Full-Stack & Systems");
  const [level, setLevel] = useState<"Beginner" | "Intermediate" | "Advanced" | "All Levels">("Intermediate");
  const [duration, setDuration] = useState("14.5 Hours");
  const [price, setPrice] = useState(49);
  const [instructorName, setInstructorName] = useState(user?.name || "Dr. Sarah Chen");
  const [instructorRole, setInstructorRole] = useState("Principal Distributed Systems Engineer");
  const [skills, setSkills] = useState("Golang, gRPC, Protocol Buffers, Docker, Microservices");

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

  const handleAddModule = () => {
    const modNum = modules.length + 1;
    const newMod: Module = {
      id: `mod-${Date.now()}`,
      title: `Module ${modNum}: Advanced Topics & Microservice Design`,
      duration: "3.0 Hours",
      lessons: [
        {
          id: `les-${Date.now()}`,
          title: "Architecture Patterns & Service Mesh",
          duration: "20 min",
          type: "video",
          summary: "Implementing circuit breakers and rate limiting.",
          notes: "# Service Mesh & Resilience\n\nCircuit breakers prevent cascading outages across microservice graphs.",
          codeSnippet: `// Circuit Breaker Pattern\nconst breaker = new CircuitBreaker(callUserService, { timeout: 3000, errorThresholdPercentage: 50 });`
        }
      ]
    };
    setModules([...modules, newMod]);
  };

  const handleAddLesson = (modIndex: number) => {
    const targetMod = modules[modIndex];
    const newLesson: Lesson = {
      id: `les-${Date.now()}`,
      title: `Lesson ${targetMod.lessons.length + 1}: Hands-on Implementation`,
      duration: "22 min",
      type: "code",
      summary: "Write and verify service logic in the browser.",
      notes: "# Hands-on Sandbox\n\nStep-by-step instructions for running services.",
      codeSnippet: `package main\nimport "fmt"\n\nfunc main() {\n    fmt.Println("gRPC Server listening on port :50051")\n}`
    };
    const updated = [...modules];
    updated[modIndex].lessons.push(newLesson);
    setModules(updated);
  };

  const handlePublishCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

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
      lessonsCount: modules.reduce((acc, m) => acc + m.lessons.length, 0),
      price: Number(price),
      bannerGradient: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
      instructor: {
        name: instructorName,
        role: instructorRole,
        avatar: "SC",
        company: "Astra Academy",
      },
      skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
      modules,
    });

    setPublishSuccess(true);
    setTimeout(() => {
      setPublishSuccess(false);
      navigate(`/learn/${newCourse.id}`);
    }, 1500);
  };

  return (
    <div className={`subpage app ${dark ? "dark" : ""} min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]`}>
      <SiteNav />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-28 space-y-8">
        {/* Header with Role Badge */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] shadow-lg">
          <div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wider bg-purple-500/20 text-purple-400 border border-purple-500/30 uppercase">
                Instructor & Admin Studio
              </span>
              <span className="text-xs text-[var(--muted)]">Admin: <strong>{user?.name || "Dr. Sarah Chen"}</strong></span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-2 tracking-tight">Course Creator & Curriculum Studio</h1>
            <p className="text-xs text-[var(--muted)] mt-1">Design, edit, and publish interactive tech courses directly to the Astra Academy live catalog.</p>
          </div>

          <div className="flex items-center gap-3">
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
            <span className="text-sm">✨</span> Visual Course Creator
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

        {/* TAB 1: Visual Course Creator */}
        {activeTab === "create" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form column (2 cols) */}
            <form onSubmit={handlePublishCourse} className="lg:col-span-2 space-y-6">
              {publishSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-3 animate-bounce">
                  <span>🎉</span> Course published successfully! Launching classroom preview...
                </div>
              )}

              {/* Basic Course Info */}
              <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] space-y-4">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-[var(--accent)]">Step 1: Course Overview & Metadata</h3>
                
                <div>
                  <label className="block text-xs font-bold mb-1">Course Title</label>
                  <input
                    required
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs focus:ring-2 focus:ring-[var(--accent)]"
                    placeholder="e.g. Autonomous AI Agents & LLM Systems"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Tagline (Short Punchy Hook)</label>
                  <input
                    required
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs focus:ring-2 focus:ring-[var(--accent)]"
                    placeholder="e.g. Build production-grade Multi-Agent workflows with LangGraph"
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
                    <label className="block text-xs font-bold mb-1">Level</label>
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
                    <label className="block text-xs font-bold mb-1">Price ($ USD, 0 for Free)</label>
                    <input
                      type="number"
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full p-3 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Skills Covered (Comma separated)</label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs"
                    placeholder="LangGraph, RAG, PyTorch, Docker"
                  />
                </div>
              </div>

              {/* Visual Module & Lesson Builder */}
              <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-[var(--accent)]">Step 2: Interactive Curriculum Builder</h3>
                    <p className="text-[11px] text-[var(--muted)]">Add modules, video URLs, markdown notes, live code playgrounds & quizzes.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddModule}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[var(--surface-soft)] border border-[var(--border)] hover:border-[var(--accent)]"
                  >
                    + Add Module
                  </button>
                </div>

                <div className="space-y-6">
                  {modules.map((mod, modIdx) => (
                    <div key={mod.id} className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-[var(--accent)] text-white text-xs font-bold flex items-center justify-center shrink-0">
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
                          className="flex-1 p-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs font-bold"
                          placeholder="Module Title"
                        />
                      </div>

                      {/* Lessons in this module */}
                      <div className="space-y-3 pl-8">
                        {mod.lessons.map((lesson, lesIdx) => (
                          <div key={lesson.id} className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border-soft)] space-y-3 text-xs">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] font-bold text-[var(--muted)] uppercase">Lesson {modIdx + 1}.{lesIdx + 1}</span>
                              <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-md font-mono">{lesson.duration}</span>
                            </div>
                            <input
                              type="text"
                              value={lesson.title}
                              onChange={(e) => {
                                const updated = [...modules];
                                updated[modIdx].lessons[lesIdx].title = e.target.value;
                                setModules(updated);
                              }}
                              className="w-full p-2 rounded-lg bg-[var(--surface-soft)] border border-[var(--border)] text-xs font-semibold"
                              placeholder="Lesson Title"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={lesson.videoUrl || ""}
                                onChange={(e) => {
                                  const updated = [...modules];
                                  updated[modIdx].lessons[lesIdx].videoUrl = e.target.value;
                                  setModules(updated);
                                }}
                                className="p-2 rounded-lg bg-[var(--surface-soft)] border border-[var(--border)] text-[11px]"
                                placeholder="Video Embed URL (YouTube/Vimeo/MP4)"
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
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => handleAddLesson(modIdx)}
                          className="text-xs font-bold text-[var(--accent)] hover:underline flex items-center gap-1 mt-2"
                        >
                          + Add Lesson to Module {modIdx + 1}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="submit"
                  className="button py-3 px-8 text-sm font-extrabold shadow-xl hover:scale-105 transition-transform"
                >
                  🚀 Publish Course to Live Catalog
                </button>
              </div>
            </form>

            {/* Live Course Preview Card (1 col) */}
            <div className="space-y-4">
              <div className="sticky top-24 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Live Student Card Preview</h3>
                <div className="p-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl space-y-4">
                  <div className="h-32 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 p-4 flex flex-col justify-between text-white shadow-inner">
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md w-fit">
                      {categoryLabel}
                    </span>
                    <span className="text-lg font-black tracking-tight">{price === 0 ? "FREE" : `$${price}`}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] text-[var(--muted)] font-semibold">
                      <span>⏱️ {duration}</span>
                      <span>•</span>
                      <span>📊 {level}</span>
                      <span>•</span>
                      <span>⭐ 5.0 (New)</span>
                    </div>
                    <h4 className="text-base font-extrabold leading-snug">{title || "Course Title"}</h4>
                    <p className="text-xs text-[var(--muted)] line-clamp-2">{tagline || "Course Tagline goes here..."}</p>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {skills.split(",").slice(0, 3).map((s) => s.trim() && (
                      <span key={s} className="px-2 py-0.5 rounded-md bg-[var(--surface-soft)] text-[10px] text-[var(--muted)] font-medium">
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-[var(--border-soft)] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 font-bold text-[10px] flex items-center justify-center">
                        SC
                      </div>
                      <span className="text-xs font-semibold">{instructorName}</span>
                    </div>
                    <span className="text-xs font-bold text-[var(--accent)]">
                      {modules.reduce((acc, m) => acc + m.lessons.length, 0)} Lessons
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Manage Catalog Table */}
        {activeTab === "courses" && (
          <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--muted)]">Active Courses in Catalog</h3>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses..."
                className="p-2 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs w-full sm:w-64"
              />
            </div>

            <div className="divide-y divide-[var(--border-soft)]">
              {courses
                .filter((c) => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((c) => (
                  <div key={c.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-black text-xs shrink-0">
                        {c.category.toUpperCase().slice(0, 3)}
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold">{c.title}</h4>
                        <div className="flex items-center gap-3 text-xs text-[var(--muted)] mt-0.5">
                          <span>👨‍🏫 {c.instructor.name}</span>
                          <span>•</span>
                          <span>👥 {c.studentsCount.toLocaleString()} Students</span>
                          <span>•</span>
                          <span>⭐ {c.rating}</span>
                          <span>•</span>
                          <span className="font-bold text-[var(--accent)]">{c.price === 0 ? "Free" : `$${c.price}`}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Link to={`/learn/${c.id}`} className="button button-sm text-xs">
                        Open Classroom
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm(`Delete course "${c.title}"?`)) {
                            deleteCourse(c.id);
                          }
                        }}
                        className="p-2 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-500/10 border border-rose-500/30 transition-colors"
                        title="Delete Course"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 3: Analytics */}
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
