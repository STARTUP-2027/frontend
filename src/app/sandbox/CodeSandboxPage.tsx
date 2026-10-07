import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useCourses } from "../context/CourseContext";
import { useTheme } from "../theme";
import { SiteNav, SiteFooter } from "../../App";

type Language = "typescript" | "python" | "rust" | "sql" | "go";

interface CodeRecipe {
  id: Language;
  name: string;
  badge: string;
  version: string;
  code: string;
  sampleOutput: string;
  variables: Record<string, string | number | boolean>;
}

const RECIPES: Record<Language, CodeRecipe> = {
  typescript: {
    id: "typescript",
    name: "TypeScript (React 19 & Edge)",
    badge: "TS 5.7",
    version: "v5.7.3 / React 19.0",
    code: `"use server";
import { revalidatePath } from "next/cache";

interface AgentPayload {
  prompt: string;
  temperature: number;
  maxRetries: number;
}

export async function dispatchAgentWorkflow(payload: AgentPayload) {
  console.log("[Edge Runtime] Initializing agent graph dispatch...");
  
  const startTime = performance.now();
  const memoryCheckpoint = { threadId: "th_8849", step: 1 };
  
  // Simulated RAG tool invocation
  const searchResults = ["Doc A: Vector embeddings", "Doc B: Cyclic graph nodes"];
  
  const durationMs = (performance.now() - startTime).toFixed(2);
  console.log(\`[Edge Runtime] Completed in \${durationMs}ms with checkpoint:\`, memoryCheckpoint);
  
  return {
    status: 200,
    threadId: memoryCheckpoint.threadId,
    retrievedCount: searchResults.length,
    confidence: 0.984
  };
}`,
    sampleOutput: `[TypeScript Edge Runtime v5.7.3]
> [Edge Runtime] Initializing agent graph dispatch...
> [Edge Runtime] Vector retrieval: 2 documents indexed in 1.4ms
> [Edge Runtime] Completed in 2.80ms with checkpoint: { threadId: 'th_8849', step: 1 }
✓ Execution returned: { status: 200, threadId: 'th_8849', retrievedCount: 2, confidence: 0.984 }
✓ Zero runtime errors | Peak memory: 12.4 MB`,
    variables: {
      "status": 200,
      "threadId": "th_8849",
      "retrievedCount": 2,
      "confidence": 0.984,
      "environment": "edge-v8-isolated"
    }
  },
  python: {
    id: "python",
    name: "Python 3.12 (LangGraph RAG)",
    badge: "PY 3.12",
    version: "v3.12.2 / LangGraph 0.2",
    code: `import time
from typing import TypedDict, List

class AgentState(TypedDict):
    messages: List[str]
    retrieved_docs: List[str]
    reflection_attempts: int

def agent_node(state: AgentState) -> AgentState:
    print("[Agent Loop] Inspecting user query and state context...")
    state["reflection_attempts"] += 1
    state["retrieved_docs"] = ["Qdrant::LangGraph_Cyclic_Docs", "Milvus::Dense_Vectors"]
    return state

# Execute loop simulation
initial_state = AgentState(messages=["What is RAG?"], retrieved_docs=[], reflection_attempts=0)
result = agent_node(initial_state)
print(f"✓ Agent converged with {len(result['retrieved_docs'])} docs in {result['reflection_attempts']} loop(s).")`,
    sampleOutput: `[Python 3.12.2 isolated sandbox]
> [Agent Loop] Inspecting user query and state context...
> [Agent Loop] Evaluating document relevance via semantic cross-encoder...
✓ Agent converged with 2 docs in 1 loop(s).
✓ Process exited with code 0 (Success) | Runtime: 14.8ms | Memory: 18.2 MB`,
    variables: {
      "messages_count": 1,
      "retrieved_docs_count": 2,
      "reflection_attempts": 1,
      "converged": true
    }
  },
  rust: {
    id: "rust",
    name: "Rust (Tokio Systems & mTLS)",
    badge: "Rust 2024",
    version: "rustc 1.84.0 / Tokio 1.40",
    code: `use std::sync::Arc;
use tokio::sync::Mutex;

#[derive(Debug)]
struct SecurityContext {
    token_claims: Vec<String>,
    is_verified: bool,
}

#[tokio::main]
async fn main() {
    println!("[Rust Zero-Trust] Initializing cryptographic mTLS token guard...");
    let ctx = Arc::new(Mutex::new(SecurityContext {
        token_claims: vec!["role:architect".to_string(), "tenant:astra".to_string()],
        is_verified: true,
    }));

    let guard = ctx.lock().await;
    println!("[Rust Zero-Trust] Token verified! Claims: {:?}", guard.token_claims);
    println!("✓ Memory-safe execution complete without garbage collection overhead.");
}`,
    sampleOutput: `[rustc 1.84.0-nightly / LLVM 19]
Compiling astra-sandbox v0.1.0 (/sandbox/main.rs)
Finished release [optimized] target(s) in 0.08s
Running \`target/release/astra-sandbox\`
> [Rust Zero-Trust] Initializing cryptographic mTLS token guard...
> [Rust Zero-Trust] Token verified! Claims: ["role:architect", "tenant:astra"]
✓ Memory-safe execution complete without garbage collection overhead.
✓ Allocation footprint: 0.8 MB`,
    variables: {
      "is_verified": true,
      "claims_count": 2,
      "compiler_safety": "Borrow Checker Clean",
      "heap_allocated_bytes": 1024
    }
  },
  sql: {
    id: "sql",
    name: "SQL (PostgreSQL 16 Analytics)",
    badge: "PG 16",
    version: "PostgreSQL 16.4 Engine",
    code: `-- Calculate moving average completion rates and student percentiles
WITH student_stats AS (
  SELECT 
    student_id,
    xp_points,
    completed_lessons,
    RANK() OVER (ORDER BY xp_points DESC) as global_rank,
    PERCENT_RANK() OVER (ORDER BY xp_points) as percentile
  FROM students_registry
)
SELECT 
  global_rank,
  student_id,
  xp_points,
  ROUND((percentile * 100)::numeric, 1) || '%' as percentile_rank
FROM student_stats
LIMIT 5;`,
    sampleOutput: `[PostgreSQL 16.4 Query Engine]
 global_rank | student_id | xp_points | percentile_rank 
-------------+------------+-----------+-----------------
           1 | usr_kaito  |     18450 | 99.8%
           2 | usr_aris   |     16920 | 98.6%
           3 | usr_elena  |     15200 | 96.4%
           4 | usr_alex   |     14500 | 94.2%
           5 | usr_marcus |     13800 | 92.0%
(5 rows in 1.14 ms | Planning time: 0.08 ms)`,
    variables: {
      "rows_returned": 5,
      "execution_time_ms": 1.14,
      "index_scan_used": "idx_xp_points_btree",
      "status": "EXPLAIN ANALYZE PASSED"
    }
  },
  go: {
    id: "go",
    name: "Go (gRPC Microservice)",
    badge: "Go 1.23",
    version: "go version go1.23.1 linux/amd64",
    code: `package main

import (
	"context"
	"fmt"
	"time"
)

type UserRequest struct {
	UserID    string
	AuthToken string
}

func StreamEvents(ctx context.Context, req UserRequest) error {
	fmt.Printf("[gRPC Gateway] Handling bi-directional stream for User: %s\\n", req.UserID)
	fmt.Println("[gRPC Gateway] Protocol Buffers binary serialization active (HTTP/2)")
	return nil
}

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()
	
	req := UserRequest{UserID: "usr_alex_2026", AuthToken: "jwt_rs256_valid"}
	_ = StreamEvents(ctx, req)
	fmt.Println("✓ gRPC stream dispatched with sub-millisecond serialization.")
}`,
    sampleOutput: `[Go 1.23.1 Engine]
> [gRPC Gateway] Handling bi-directional stream for User: usr_alex_2026
> [gRPC Gateway] Protocol Buffers binary serialization active (HTTP/2)
✓ gRPC stream dispatched with sub-millisecond serialization.
✓ Goroutines: 2 | Memory heap: 4.1 MB`,
    variables: {
      "goroutines": 2,
      "user_id": "usr_alex_2026",
      "transport": "HTTP/2 Multiplexed",
      "latency_micros": 420
    }
  }
};

export default function CodeSandboxPage() {
  const { dark } = useTheme();
  const { user } = useAuth();
  const { addBookmark } = useCourses();
  const navigate = useNavigate();

  const [selectedLang, setSelectedLang] = useState<Language>("typescript");
  const [editorCode, setEditorCode] = useState(RECIPES.typescript.code);
  const [terminalOutput, setTerminalOutput] = useState(RECIPES.typescript.sampleOutput);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<"terminal" | "inspector">("terminal");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const currentRecipe = RECIPES[selectedLang];

  const handleSelectLanguage = (lang: Language) => {
    setSelectedLang(lang);
    setEditorCode(RECIPES[lang].code);
    setTerminalOutput(RECIPES[lang].sampleOutput);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setTerminalOutput(`Compiling and executing in isolated ${currentRecipe.name} sandbox...\n`);
    setTimeout(() => {
      setTerminalOutput(
        `[${currentRecipe.version} Environment]\n` +
        `> Executed at ${new Date().toLocaleTimeString()}\n` +
        currentRecipe.sampleOutput
      );
      setIsRunning(false);
    }, 600);
  };

  const handleSaveToNotes = () => {
    addBookmark({
      courseId: "sandbox-code",
      courseTitle: `Interactive Sandbox (${currentRecipe.name})`,
      lessonId: `sandbox-${Date.now()}`,
      lessonTitle: `${currentRecipe.name} Custom Code Snippet`,
      snippet: editorCode,
      noteText: `Saved from Astra Code Sandbox (${currentRecipe.badge}) on ${new Date().toLocaleDateString()}`,
      tags: [selectedLang, "Sandbox", "Personal Snippet"]
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className={`subpage app ${dark ? "dark" : ""} min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]`}>
      <SiteNav />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-28 space-y-6">
        {/* Sandbox Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] shadow-xl">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wider bg-purple-500/20 text-purple-400 border border-purple-500/30 uppercase">
                Multi-Language Code Sandbox
              </span>
              <span className="text-xs text-[var(--muted)] font-mono">{currentRecipe.version}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight">Interactive Cloud Sandbox</h1>
            <p className="text-xs text-[var(--muted)] mt-1">
              Live compiler, runtime variable inspector, and interactive template sandbox for TypeScript, Python, Rust, SQL, and Go.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveToNotes}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-[var(--border)] bg-[var(--surface-soft)] hover:border-[var(--accent)] transition-all flex items-center gap-2"
            >
              <span>💾</span> Save Snippet to Notes
            </button>
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className="button button-sm text-xs font-black flex items-center gap-2 shadow-lg"
            >
              <span>⚡</span> {isRunning ? "Executing..." : "Run Code (Ctrl + Enter)"}
            </button>
          </div>
        </div>

        {saveSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-3 animate-fade-in">
            <span>✓</span> Code snippet successfully saved to your personal Notes & Bookmarks Hub!
          </div>
        )}

        {/* Language Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(Object.keys(RECIPES) as Language[]).map((lang) => {
            const r = RECIPES[lang];
            const isSelected = selectedLang === lang;
            return (
              <button
                key={lang}
                onClick={() => handleSelectLanguage(lang)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                  isSelected
                    ? "bg-[var(--accent)] text-white shadow-md scale-102"
                    : "bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)]"
                }`}
              >
                <span>{lang === "typescript" ? "🔷" : lang === "python" ? "🐍" : lang === "rust" ? "🦀" : lang === "sql" ? "🗄️" : "🐹"}</span>
                <span>{r.name}</span>
                <span className="text-[10px] opacity-75 font-mono">[{r.badge}]</span>
              </button>
            );
          })}
        </div>

        {/* Workspace: Left Code Editor + Right Terminal / Variable Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Editor Column (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl border border-[var(--border)] bg-[#0d0b17] overflow-hidden shadow-2xl space-y-0">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-[#080710]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                <span className="text-xs font-mono text-gray-400 ml-2">main.{selectedLang === "typescript" ? "ts" : selectedLang === "python" ? "py" : selectedLang === "rust" ? "rs" : selectedLang === "sql" ? "sql" : "go"}</span>
              </div>
              <span className="text-[10px] text-gray-400 font-mono">UTF-8 • LF</span>
            </div>

            <textarea
              rows={18}
              value={editorCode}
              onChange={(e) => setEditorCode(e.target.value)}
              className="w-full p-4 bg-transparent text-[#93c5fd] font-mono text-xs focus:outline-none resize-none leading-relaxed"
              spellCheck={false}
            />
          </div>

          {/* Right: Output & Variable Inspector (5 cols) */}
          <div className="lg:col-span-5 rounded-3xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-xl space-y-0">
            {/* Tab Header */}
            <div className="flex border-b border-[var(--border-soft)] bg-[var(--surface-soft)]">
              <button
                onClick={() => setActiveTab("terminal")}
                className={`px-4 py-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
                  activeTab === "terminal"
                    ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--surface)]"
                    : "border-transparent text-[var(--muted)] hover:text-[var(--text)]"
                }`}
              >
                <span>🖥️</span> Terminal Simulator
              </button>
              <button
                onClick={() => setActiveTab("inspector")}
                className={`px-4 py-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
                  activeTab === "inspector"
                    ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--surface)]"
                    : "border-transparent text-[var(--muted)] hover:text-[var(--text)]"
                }`}
              >
                <span>🔍</span> Variable & State Inspector
              </button>
            </div>

            {/* Terminal View */}
            {activeTab === "terminal" && (
              <div className="p-4 bg-[#05040a] min-h-[360px] font-mono text-xs text-emerald-400 overflow-x-auto whitespace-pre-wrap leading-relaxed space-y-2">
                <div className="flex items-center justify-between text-[10px] text-gray-400 border-b border-gray-800 pb-2 mb-2">
                  <span>Astra Cloud Sandbox v2.4</span>
                  <span>Exit: 0 OK</span>
                </div>
                {terminalOutput}
              </div>
            )}

            {/* Variable Inspector View */}
            {activeTab === "inspector" && (
              <div className="p-5 space-y-4 min-h-[360px]">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[var(--muted)]">
                  Live Runtime State Variables
                </h4>
                <div className="space-y-2">
                  {Object.entries(currentRecipe.variables).map(([key, val]) => (
                    <div
                      key={key}
                      className="p-3 rounded-xl bg-[var(--surface-soft)] border border-[var(--border-soft)] flex items-center justify-between text-xs"
                    >
                      <span className="font-mono text-purple-400 font-bold">{key}</span>
                      <span className="font-mono text-[var(--text)] font-semibold">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
