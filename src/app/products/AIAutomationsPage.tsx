import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { SiteFooter, SiteNav } from "../../App";
import { useTheme } from "../theme";
import { useCourses } from "../context/CourseContext";

export default function AIAutomationsPage() {
  const { dark } = useTheme();
  const navigate = useNavigate();
  const { enrollInCourse, isEnrolled } = useCourses();

  const [selectedModel, setSelectedModel] = useState<"claude" | "deepseek" | "gpt4">("claude");
  const [promptQuery, setPromptQuery] = useState("Build an autonomous agent that reads GitHub issues and writes PRs");
  const [isRunning, setIsRunning] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [simulatedStream, setSimulatedStream] = useState<string[]>([
    "✓ System prompt initialized with LangGraph cyclic constraints",
    "✓ Tool definitions loaded: [github_api, code_evaluator, git_commit]"
  ]);

  const enrolled = isEnrolled("ai-agents-masterclass");

  const handleRunAgent = () => {
    if (isRunning) return;
    setIsRunning(true);
    setActiveStep(1);
    setSimulatedStream([`[0ms] 🚀 Dispatched prompt to ${selectedModel.toUpperCase()} reasoning engine...`]);

    setTimeout(() => {
      setActiveStep(2);
      setSimulatedStream((prev) => [
        ...prev,
        "[16ms] 🔍 Embedding query & executing Vector RAG retrieval (Cosine similarity: 0.961)..."
      ]);
    }, 700);

    setTimeout(() => {
      setActiveStep(3);
      setSimulatedStream((prev) => [
        ...prev,
        "[42ms] 🧠 Multi-step reasoning: Deconstructed into 4 sub-tasks (Repo clone, AST parse, Code edit, Lint test)..."
      ]);
    }, 1500);

    setTimeout(() => {
      setActiveStep(4);
      setSimulatedStream((prev) => [
        ...prev,
        "[64ms] ✅ Docker sandbox executed unit tests. All assertions passed with 0 memory errors."
      ]);
      setIsRunning(false);
    }, 2400);
  };

  return (
    <div className={`subpage app ${dark ? "dark" : ""} min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]`}>
      <SiteNav />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-28 space-y-16">
        {/* Domain Hero */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/30">
            <span>✨</span> AI & Machine Learning Track
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Master Autonomous <br />
            <em className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">
              AI Agents & Multi-Agent Swarms
            </em>
          </h1>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            Move beyond simple prompt wrappers. Learn how to architect, evaluate, and deploy production-grade agentic graphs, hybrid vector search pipelines, and self-correcting LLM systems.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button
              onClick={() => {
                enrollInCourse("ai-agents-masterclass");
                navigate("/learn/ai-agents-masterclass");
              }}
              className="button button-lg text-xs font-extrabold shadow-xl hover:scale-105 transition-transform"
            >
              {enrolled ? "Resume AI Classroom →" : "Enroll in AI Masterclass Free →"}
            </button>
            <a href="#playground" className="button-secondary button-lg text-xs font-bold">
              <span>⚡</span> Try Interactive Lab
            </a>
          </div>
        </section>

        {/* Interactive Multi-Agent Playground */}
        <section id="playground" className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--border-soft)] pb-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--accent)]">Live In-Browser Lab</span>
              <h2 className="text-lg font-black mt-0.5">Autonomous Agent Execution Simulator</h2>
            </div>

            {/* Model Selector */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs font-bold">
              <button
                onClick={() => setSelectedModel("claude")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  selectedModel === "claude" ? "bg-purple-600 text-white shadow-sm" : "text-[var(--muted)] hover:text-[var(--text)]"
                }`}
              >
                Claude 3.7 Sonnet
              </button>
              <button
                onClick={() => setSelectedModel("deepseek")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  selectedModel === "deepseek" ? "bg-purple-600 text-white shadow-sm" : "text-[var(--muted)] hover:text-[var(--text)]"
                }`}
              >
                DeepSeek R1
              </button>
              <button
                onClick={() => setSelectedModel("gpt4")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  selectedModel === "gpt4" ? "bg-purple-600 text-white shadow-sm" : "text-[var(--muted)] hover:text-[var(--text)]"
                }`}
              >
                GPT-4o
              </button>
            </div>
          </div>

          {/* Prompt & Trigger */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-[var(--muted)]">Agent Objective / Prompt</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={promptQuery}
                onChange={(e) => setPromptQuery(e.target.value)}
                className="flex-1 p-3 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs font-medium focus:ring-2 focus:ring-[var(--accent)]"
                placeholder="Enter an agent goal..."
              />
              <button
                onClick={handleRunAgent}
                disabled={isRunning}
                className="button px-6 text-xs font-bold shrink-0"
              >
                {isRunning ? "Running Agent..." : "Execute Simulation ▶"}
              </button>
            </div>
          </div>

          {/* Step Pipeline Visualization */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {[
              { num: 1, title: "1. Intent Parsing", desc: "Structured Zod Schema" },
              { num: 2, title: "2. Vector Search", desc: "Pinecone Hybrid RAG" },
              { num: 3, title: "3. Multi-Agent Loop", desc: "LangGraph Cyclic State" },
              { num: 4, title: "4. Sandbox Verification", desc: "Docker Isolated Runner" },
            ].map((step) => {
              const isActive = activeStep === step.num;
              const isDone = activeStep > step.num;
              return (
                <div
                  key={step.num}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isActive
                      ? "bg-purple-500/20 border-purple-500 shadow-md scale-105"
                      : isDone
                      ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                      : "bg-[var(--surface-soft)] border-[var(--border)] text-[var(--muted)]"
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px] font-mono font-bold mb-1">
                    <span>STEP {step.num}</span>
                    <span>{isDone ? "✓ DONE" : isActive ? "ACTIVE" : "QUEUED"}</span>
                  </div>
                  <h4 className="text-xs font-bold text-[var(--text)]">{step.title}</h4>
                  <p className="text-[10px] text-[var(--muted)] mt-0.5">{step.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Live Stream Terminal Output */}
          <div className="p-4 rounded-2xl bg-[#0b0914] text-emerald-400 font-mono text-xs border border-purple-500/20 space-y-1 shadow-inner">
            <div className="flex justify-between text-[10px] text-gray-500 border-b border-gray-800 pb-2 mb-2">
              <span>AGENT STATE LOG STREAM</span>
              <span>Model: {selectedModel.toUpperCase()} • RAG Index: 142k chunks</span>
            </div>
            {simulatedStream.map((line, i) => (
              <div key={i} className="animate-fade-in">{line}</div>
            ))}
          </div>
        </section>

        {/* Masterclass Syllabus Overview */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--accent)]">Curriculum Breakdown</span>
            <h2 className="text-2xl sm:text-3xl font-black">What You Will Master in This Track</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] space-y-3">
              <span className="text-2xl">🧠</span>
              <h3 className="text-base font-extrabold">1. Agent Architectures & LangGraph</h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Build cyclic, stateful multi-agent graphs with conditional routing, human-in-the-loop checkpoints, and memory persistence.
              </p>
              <ul className="text-xs space-y-1 text-[var(--muted)] pt-2 border-t border-[var(--border-soft)]">
                <li>✓ Multi-agent supervisor patterns</li>
                <li>✓ Tool invocation with strict JSON schemas</li>
                <li>✓ Time-travel graph debugging</li>
              </ul>
            </div>

            <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] space-y-3">
              <span className="text-2xl">🔍</span>
              <h3 className="text-base font-extrabold">2. Advanced Hybrid Vector RAG</h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Combine dense vector embeddings with BM25 keyword matching and cross-encoder re-ranking for ultra-precise retrieval.
              </p>
              <ul className="text-xs space-y-1 text-[var(--muted)] pt-2 border-t border-[var(--border-soft)]">
                <li>✓ Pinecone, Qdrant & pgvector</li>
                <li>✓ Reciprocal rank fusion (RRF)</li>
                <li>✓ Semantic chunking & metadata filtering</li>
              </ul>
            </div>

            <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] space-y-3">
              <span className="text-2xl">🛡️</span>
              <h3 className="text-base font-extrabold">3. Evaluation, Sandboxing & Safety</h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Run generated code safely in isolated containers, automate regression test suites with RAGAS, and prevent prompt injection.
              </p>
              <ul className="text-xs space-y-1 text-[var(--muted)] pt-2 border-t border-[var(--border-soft)]">
                <li>✓ Ephemeral Docker sandboxes</li>
                <li>✓ Automated RAGAS evaluation metrics</li>
                <li>✓ Zero-leak guardrails</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Lead Instructor */}
        <section className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] shadow-xl flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-black text-2xl flex items-center justify-center shrink-0 shadow-lg">
            AV
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--accent)]">Lead Instructor</span>
            <h3 className="text-lg font-black">Dr. Aris Vance</h3>
            <p className="text-xs text-[var(--muted)]">Lead AI Researcher at Astra Labs • Former Anthropic Research Contributor</p>
            <p className="text-xs text-[var(--muted)] mt-2">
              "My mission is to help engineers transition from prompt tinkering to architecting robust, autonomous systems that operate reliably in production."
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
