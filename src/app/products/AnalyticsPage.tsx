import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { SiteFooter, SiteNav } from "../../App";
import { useTheme } from "../theme";
import { useCourses } from "../context/CourseContext";

export default function AnalyticsPage() {
  const { dark } = useTheme();
  const navigate = useNavigate();
  const { enrollInCourse, isEnrolled } = useCourses();

  const [activeTab, setActiveTab] = useState<"rsc" | "streaming" | "edgeDb">("rsc");
  const [streamProgress, setStreamProgress] = useState(100);
  const [isSimulating, setIsSimulating] = useState(false);

  const enrolled = isEnrolled("fullstack-react-nextjs");

  const handleSimulateStream = () => {
    setIsSimulating(true);
    setStreamProgress(10);
    setTimeout(() => setStreamProgress(45), 300);
    setTimeout(() => setStreamProgress(80), 700);
    setTimeout(() => {
      setStreamProgress(100);
      setIsSimulating(false);
    }, 1100);
  };

  return (
    <div className={`subpage app ${dark ? "dark" : ""} min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]`}>
      <SiteNav />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-28 space-y-16">
        {/* Domain Hero */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/30">
            <span>⚡</span> Full-Stack Web & Systems Track
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Master Distributed Web Architecture: <br />
            <em className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400">
              React 19, Server Components & Edge DBs
            </em>
          </h1>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            Build ultra-fast, distributed web platforms with React 19 Actions, zero-bundle Server Components, progressive streaming SSR, optimistic UI mutations, and edge PostgreSQL.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button
              onClick={() => {
                enrollInCourse("fullstack-react-nextjs");
                navigate("/learn/fullstack-react-nextjs");
              }}
              className="button button-lg text-xs font-extrabold shadow-xl hover:scale-105 transition-transform"
            >
              {enrolled ? "Resume Full-Stack Classroom →" : "Enroll in Full-Stack Masterclass Free →"}
            </button>
            <a href="#playground" className="button-secondary button-lg text-xs font-bold">
              <span>⚡</span> Try Interactive Architecture Lab
            </a>
          </div>
        </section>

        {/* Interactive Architecture Lab */}
        <section id="playground" className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--border-soft)] pb-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-400">Interactive Architecture Playground</span>
              <h2 className="text-lg font-black mt-0.5">React 19 Server Components vs Client Hydration</h2>
            </div>

            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs font-bold">
              <button
                onClick={() => setActiveTab("rsc")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeTab === "rsc" ? "bg-sky-600 text-white shadow-sm" : "text-[var(--muted)] hover:text-[var(--text)]"
                }`}
              >
                RSC Server Boundary
              </button>
              <button
                onClick={() => setActiveTab("streaming")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeTab === "streaming" ? "bg-sky-600 text-white shadow-sm" : "text-[var(--muted)] hover:text-[var(--text)]"
                }`}
              >
                Suspense Streaming SSR
              </button>
              <button
                onClick={() => setActiveTab("edgeDb")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeTab === "edgeDb" ? "bg-sky-600 text-white shadow-sm" : "text-[var(--muted)] hover:text-[var(--text)]"
                }`}
              >
                Optimistic UI Updates
              </button>
            </div>
          </div>

          {/* Interactive Visualizer Canvas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold">
                {activeTab === "rsc"
                  ? "Zero-Bundle-Size Server Execution"
                  : activeTab === "streaming"
                  ? "Progressive HTML Chunk Streaming"
                  : "Instant Optimistic State Mutations"}
              </h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                {activeTab === "rsc"
                  ? "Server Components execute exclusively on Node/Edge runtimes. Heavy parsing dependencies like Markdown and Shiki add exactly 0 KB to the client bundle."
                  : activeTab === "streaming"
                  ? "Stream critical UI shells in 12ms while slow asynchronous database queries stream into <Suspense /> fallbacks seamlessly."
                  : "React 19 useOptimistic gives instant user gratification while backend mutations synchronize asynchronously in the background."}
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border)]">
                  <span className="text-[10px] uppercase font-bold text-[var(--muted)]">Client Bundle Delta</span>
                  <p className="text-base font-black text-emerald-400">0 KB added</p>
                </div>
                <div className="p-3 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border)]">
                  <span className="text-[10px] uppercase font-bold text-[var(--muted)]">p99 Hydration Time</span>
                  <p className="text-base font-black text-sky-400">8.4 ms</p>
                </div>
              </div>

              <button
                onClick={handleSimulateStream}
                disabled={isSimulating}
                className="button button-sm text-xs font-bold flex items-center gap-1.5"
              >
                <span>{isSimulating ? "Streaming..." : "▶️ Trigger Live Stream Test"}</span>
              </button>
            </div>

            {/* Code & Terminal Sandbox */}
            <div className="rounded-2xl bg-[#080710] border border-sky-500/20 p-4 font-mono text-xs text-sky-200 space-y-2 shadow-inner">
              <div className="flex justify-between text-[10px] text-gray-400 border-b border-gray-800 pb-2">
                <span>src/app/courses/CourseShell.tsx</span>
                <span>React 19 RSC • Stream: {streamProgress}%</span>
              </div>
              <pre className="text-[11px] leading-relaxed overflow-x-auto text-sky-300">
{`// Direct Server Component DB Query
export async function CourseShell({ id }: { id: string }) {
  const course = await db.query(
    "SELECT * FROM masterclasses WHERE id = $1", 
    [id]
  );

  return (
    <Suspense fallback={<SkeletonLoader />}>
      <InteractiveClassroom data={course} />
    </Suspense>
  );
}`}
              </pre>
            </div>
          </div>
        </section>

        {/* Masterclass Modules Breakdown */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-sky-400">Curriculum Roadmap</span>
            <h2 className="text-2xl sm:text-3xl font-black">Core Pillars of Modern Web Architecture</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] space-y-3">
              <span className="text-2xl">⚛️</span>
              <h3 className="text-base font-extrabold">1. React 19 Core & RSCs</h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Master useActionState, useOptimistic, Form Server Actions, and architectural boundaries between server and client components.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] space-y-3">
              <span className="text-2xl">🌐</span>
              <h3 className="text-base font-extrabold">2. Next.js 15 & Turborepo</h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Architect high-performance monorepos, static & dynamic route caching strategies, parallel routes, and intercepted modals.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] space-y-3">
              <span className="text-2xl">💾</span>
              <h3 className="text-base font-extrabold">3. Edge DBs & Distributed State</h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Connect Neon serverless Postgres, Prisma/Drizzle ORM, multi-region Redis caching, and real-time WebSocket state synchronization.
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
