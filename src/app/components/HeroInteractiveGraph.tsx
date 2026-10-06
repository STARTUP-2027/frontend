import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useTheme } from "../theme";

export default function HeroInteractiveGraph() {
  const navigate = useNavigate();
  const { dark } = useTheme();

  const [activePromptIndex, setActivePromptIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [activeStep, setActiveStep] = useState(3);
  const [diffAccepted, setDiffAccepted] = useState(false);

  const prompts = [
    {
      id: "ai-rag",
      label: "✨ AI Agents & RAG",
      query: "Refactor agent loop into stateful LangGraph with dense vector search",
      file: "agent_workflow.ts",
      code: `// Astra AI Copilot: Generated LangGraph Cyclic Swarm
import { StateGraph, END } from "@langchain/langgraph";
import { hybridVectorSearch } from "./retrievers/vector_rag";

+ const agentGraph = new StateGraph<AgentState>(AgentStateSchema);
+ agentGraph.addNode("retrieve_knowledge", hybridVectorSearch);
+ agentGraph.addNode("synthesize_code", claudeReasoningAgent);
+ agentGraph.addConditionalEdges("evaluate_tests", (state) => 
+   state.passed ? END : "synthesize_code" // Self-correcting loop
+ );
export const autonomousCoder = agentGraph.compile();`,
      tests: "4 passed, 0 failed (14.2ms)",
    },
    {
      id: "react-rsc",
      label: "⚡ React 19 & Edge SSR",
      query: "Stream Server Component with Suspense and optimistic action mutations",
      file: "CourseShell.tsx",
      code: `// React 19 Server Components with Zero Client Bundle
export async function CourseShell({ courseId }: { courseId: string }) {
+ const courseData = await db.query('SELECT * FROM masterclasses WHERE id = $1', [courseId]);

  return (
+   <Suspense fallback={<SkeletonProgressPulse />}>
+     <InteractiveClassroom data={courseData} />
+   </Suspense>
  );
}`,
      tests: "0 KB client bundle size, 8.4ms hydration",
    },
    {
      id: "rust-security",
      label: "🛡️ Zero-Trust Security",
      query: "Implement compile-time memory safe mTLS token verification in Rust",
      file: "token_guard.rs",
      code: `// Rust Zero-Trust Token Verification
pub async fn verify_handshake(token: &str) -> Result<SessionClaims, SecurityError> {
+   let verified = RS256Verifier::verify(token, &PUBLIC_KEY)?;
+   if verified.is_expired() {
+       return Err(SecurityError::TokenExpired);
+   }
+   Ok(verified.claims)
}`,
      tests: "0 data races, 100% memory safe",
    },
  ];

  const currentPrompt = prompts[activePromptIndex];

  const handleTriggerAction = () => {
    if (isRunning) return;
    setIsRunning(true);
    setActiveStep(1);

    setTimeout(() => setActiveStep(2), 600);
    setTimeout(() => setActiveStep(3), 1300);
    setTimeout(() => {
      setActiveStep(4);
      setDiffAccepted(true);
      setIsRunning(false);
    }, 2000);
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_20px_70px_rgba(124,58,237,0.15)] dark:shadow-[0_25px_90px_rgba(0,0,0,0.6)] backdrop-blur-2xl overflow-hidden text-left transition-all">
      {/* GitHub-Style Radiant Gradient Border Accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 via-pink-500 to-sky-400" />

      {/* GitHub-Style Window Topbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 border-b border-[var(--border-soft)] bg-[var(--surface-soft)]">
        {/* Repo & Branch Breadcrumbs */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
          </div>

          <span className="text-[var(--border)]">|</span>

          <div className="flex items-center gap-2 text-xs font-mono text-[var(--muted)]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/></svg>
            <span className="font-bold text-[var(--text)]">astra-academy</span>
            <span>/</span>
            <span className="text-[var(--accent)] font-semibold">{currentPrompt.file}</span>
            <span className="px-2 py-0.5 rounded-md bg-[var(--surface)] text-[10px] font-bold border border-[var(--border-soft)] font-sans">
              main (sha-84f9a1)
            </span>
          </div>
        </div>

        {/* Live CI & Workflow Trigger */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>CI: Passing (14ms)</span>
          </div>

          <button
            onClick={handleTriggerAction}
            disabled={isRunning}
            className="button button-sm text-xs font-bold flex items-center gap-1.5 shadow-md"
          >
            <span>{isRunning ? "⚡" : "▶"}</span>
            <span>{isRunning ? "Running CI..." : "Run GitHub Action"}</span>
          </button>
        </div>
      </div>

      {/* Main Copilot + Workflow Visualizer Split View */}
      <div className="p-5 sm:p-6 space-y-6">
        {/* Interactive Copilot Query Prompts Selector */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent)] flex items-center gap-1.5">
            <span>✨</span> GitHub-Style Interactive AI Copilot
          </span>
          <div className="flex flex-wrap gap-2">
            {prompts.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => {
                  setActivePromptIndex(idx);
                  setDiffAccepted(false);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activePromptIndex === idx
                    ? "bg-[var(--accent)] text-white shadow-md scale-105"
                    : "bg-[var(--surface-soft)] text-[var(--muted)] hover:text-[var(--text)] border border-[var(--border-soft)]"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt Input Preview Bar */}
        <div className="p-3 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border-soft)] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-[var(--text)] font-medium">
            <span className="text-purple-400">💬</span>
            <span className="italic">"{currentPrompt.query}"</span>
          </div>
          <span className="text-[10px] font-mono text-[var(--accent)] font-bold">Claude 3.7 Sonnet</span>
        </div>

        {/* Code Diff Display (Green additions with GitHub line formatting) */}
        <div className="rounded-2xl bg-[#080710] text-[#e0def4] border border-[var(--border-soft)] overflow-hidden font-mono text-xs shadow-inner">
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#100d1e] border-b border-white/[0.06] text-[11px] text-gray-400">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">+14 lines</span>
              <span>•</span>
              <span>{currentPrompt.file}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-purple-300">✓ {currentPrompt.tests}</span>
              <button
                onClick={() => setDiffAccepted(true)}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 font-bold text-[10px] border border-emerald-500/30 transition-all"
              >
                {diffAccepted ? "✓ Diff Merged" : "Accept Diff"}
              </button>
            </div>
          </div>

          <pre className="p-4 overflow-x-auto leading-relaxed text-[11px] text-sky-200">
            {currentPrompt.code}
          </pre>
        </div>

        {/* GitHub Actions CI/CD Pipeline Steps */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[var(--muted)] flex items-center gap-1.5">
              <span>🔄</span> GitHub Actions Pipeline
            </span>
            <span className="text-[11px] font-mono text-[var(--accent)]">Execution Time: 42ms</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {[
              { num: 1, name: "1. Typecheck & Lint", status: "passed", time: "12ms" },
              { num: 2, name: "2. Vector Index Sync", status: "passed", time: "18ms" },
              { num: 3, name: "3. Multi-Agent RAG Eval", status: "passed", time: "28ms" },
              { num: 4, name: "4. Deploy Edge Service", status: "passed", time: "8ms" },
            ].map((step) => {
              const isActive = isRunning && activeStep === step.num;
              const isDone = activeStep >= step.num;

              return (
                <div
                  key={step.num}
                  className={`p-3 rounded-2xl border transition-all ${
                    isActive
                      ? "bg-purple-500/20 border-purple-500 shadow-md scale-105"
                      : isDone
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                      : "bg-[var(--surface-soft)] border-[var(--border-soft)] text-[var(--muted)]"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                    <span>STEP 0{step.num}</span>
                    <span className="font-bold">{isDone ? "✓ PASS" : "QUEUED"}</span>
                  </div>
                  <h5 className="text-xs font-bold text-[var(--text)] truncate">{step.name}</h5>
                  <span className="text-[10px] text-[var(--muted)] font-mono">{step.time}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Classroom CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[var(--border-soft)] text-xs">
          <div className="flex items-center gap-3 text-[var(--muted)]">
            <span className="font-bold text-[var(--text)]">👨‍🏫 Instructor: Dr. Aris Vance</span>
            <span>•</span>
            <span>Masterclass 1 of 16 in AI Track</span>
          </div>

          <button
            onClick={() => navigate("/learn/ai-agents-masterclass")}
            className="button button-sm text-xs font-bold"
          >
            Launch Classroom Sandbox →
          </button>
        </div>
      </div>
    </div>
  );
}
