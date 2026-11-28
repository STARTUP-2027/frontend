"use client";

import { useState, useEffect } from "react";
import { useTheme } from "../theme";

type ModeKey = "code" | "plan" | "collaborate" | "automate" | "secure";

interface ModeData {
  key: ModeKey;
  label: string;
  files: Array<{ name: string; icon: string; lang: string }>;
  activeFileIndex: number;
  chatUser: string;
  chatGreeting: string;
  chatPrompt: string;
  chatResponse?: string;
  codeLines: Array<{ lineNum: number; code: string; highlight?: boolean }>;
}

const MODES: Record<ModeKey, ModeData> = {
  code: {
    key: "code",
    label: "Code",
    files: [
      { name: "game.ts", icon: "TS", lang: "typescript" },
      { name: "characters.module.css", icon: "#", lang: "css" },
      { name: "bonus-level.ts", icon: "TS", lang: "typescript" },
    ],
    activeFileIndex: 0,
    chatUser: "@monalisa",
    chatGreeting:
      "Hi @monalisa, how can I help you?\n\nI'm powered by AI, so surprises and mistakes are possible. Make sure to verify any generated code or suggestions, and share feedback so that we can learn and improve.",
    chatPrompt: "Add collision detection and update score on worldbounds",
    chatResponse:
      "Added worldbounds collision event listener to track score when the ball hits left or right boundaries.",
    codeLines: [
      { lineNum: 58, code: "    // Create score texts" },
      { lineNum: 59, code: "    this.player1ScoreText = this.add.text(16, 16, 'Player 1: 0', { fontSize: '32px' });" },
      { lineNum: 60, code: "    this.player2ScoreText = this.add.text(300, 16, 'Player 2: 0', { fontSize: '32px' });" },
      { lineNum: 61, code: "    // Add collision detection for scoring" },
      { lineNum: 62, code: "    this.physics.world.on(\"worldbounds\", (body) => {" },
      { lineNum: 63, code: "      if (body.gameObject === this.ball) {" },
      { lineNum: 64, code: "        if (body.blocked.left) {" },
      { lineNum: 65, code: "          this.player2Score += 1;" },
      { lineNum: 66, code: "          this.player2ScoreText.setText(`Player 2: ${this.player2Score}`);" },
      { lineNum: 67, code: "        } else if (body.blocked.right) {" },
      { lineNum: 68, code: "          this.player1Score += 1;" },
      { lineNum: 69, code: "          this.player1ScoreText.setText(`Player 1: ${this.player1Score}`);" },
      { lineNum: 70, code: "        }" },
      { lineNum: 71, code: "      }" },
      { lineNum: 72, code: "    });" },
      { lineNum: 73, code: "  }" },
      { lineNum: 74, code: "" },
      { lineNum: 75, code: "  update() {" },
      { lineNum: 76, code: "    // Player 1 controls" },
      { lineNum: 77, code: "    if (this.cursors.left.isDown) {" },
      { lineNum: 78, code: "      this.player1.setVelocityX(-200);" },
      { lineNum: 79, code: "    } else if (this.cursors.right.isDown) {" },
      { lineNum: 80, code: "      this.player1.setVelocityX(200);" },
      { lineNum: 81, code: "    } else {" },
      { lineNum: 82, code: "      this.player1.setVelocityX(0);" },
      { lineNum: 83, code: "    }" },
      { lineNum: 84, code: "" },
      { lineNum: 85, code: "    if (this.cursors.up.isDown) {" },
      { lineNum: 86, code: "      this.player1.setVelocityY(-200);" },
      { lineNum: 87, code: "    } else if (this.cursors.down.isDown) {" },
      { lineNum: 88, code: "      this.player1.setVelocityY(200);" },
      { lineNum: 89, code: "    } else {" },
      { lineNum: 90, code: "      this.player1.setVelocityY(0);" },
      { lineNum: 91, code: "    }" },
    ],
  },
  plan: {
    key: "plan",
    label: "Plan",
    files: [
      { name: "architecture.plan.md", icon: "MD", lang: "markdown" },
      { name: "roadmap.json", icon: "{}", lang: "json" },
    ],
    activeFileIndex: 0,
    chatUser: "@monalisa",
    chatGreeting:
      "Planning Copilot: Let's design the next sprint architecture.\n\nI have indexed your project dependencies and repository schema to generate an actionable milestone blueprint.",
    chatPrompt: "Plan LangGraph multi-agent swarm architecture",
    chatResponse:
      "Architecture plan created: Split agents into Retriever, Planner, and Coder with cycle checkpoint evaluation.",
    codeLines: [
      { lineNum: 1, code: "# Architecture Execution Plan: Multi-Agent Swarm" },
      { lineNum: 2, code: "## 1. Objective: State-Machine Agentic Loop" },
      { lineNum: 3, code: "- Establish LangGraph StateGraph with persistent MemorySaver" },
      { lineNum: 4, code: "- Register dynamic tool calling endpoints (Vector RAG, AST parser)" },
      { lineNum: 5, code: "" },
      { lineNum: 6, code: "## 2. Agent Node Routing" },
      { lineNum: 7, code: "```mermaid" },
      { lineNum: 8, code: "graph LR" },
      { lineNum: 9, code: "  Query[User Query] --> Planner[Reasoning Planner]" },
      { lineNum: 10, code: "  Planner --> Retriever[Hybrid Vector Store]" },
      { lineNum: 11, code: "  Retriever --> Coder[Code Synthesis Engine]" },
      { lineNum: 12, code: "  Coder --> Validator{Unit Tests Pass?}" },
      { lineNum: 13, code: "  Validator -- No --> Coder" },
      { lineNum: 14, code: "  Validator -- Yes --> Output[Verified Code]" },
      { lineNum: 15, code: "```" },
      { lineNum: 16, code: "" },
      { lineNum: 17, code: "## 3. SLA & Performance Targets" },
      { lineNum: 18, code: "- p99 latency < 850ms per recursive reasoning loop" },
      { lineNum: 19, code: "- 100% token usage tracking per sandbox session" },
    ],
  },
  collaborate: {
    key: "collaborate",
    label: "Collaborate",
    files: [
      { name: "pull-request #142.diff", icon: "±", lang: "diff" },
      { name: "reviewers.yaml", icon: "⚙", lang: "yaml" },
    ],
    activeFileIndex: 0,
    chatUser: "@monalisa",
    chatGreeting:
      "Review Copilot: 3 peers have submitted reviews on PR #142.\n\nAll CI integration tests passed. Would you like me to summarize comments or merge?",
    chatPrompt: "Summarize code review feedback on PR #142",
    chatResponse:
      "Summary: 2 approvals from @alex and @devin. Recommended adding null check on player cursor initialization.",
    codeLines: [
      { lineNum: 1, code: "@@ -12,8 +12,14 @@ export function PlayerController({ session }) {" },
      { lineNum: 2, code: "   const socket = useWebSocket(session.endpoint);" },
      { lineNum: 3, code: "+  // Peer review suggestion by @devin: Add graceful fallback" },
      { lineNum: 4, code: "+  if (!socket.isConnected) {" },
      { lineNum: 5, code: "+    return <ReconnectingBadge retryCount={socket.retryCount} />;" },
      { lineNum: 6, code: "+  }" },
      { lineNum: 7, code: "   " },
      { lineNum: 8, code: "   useEffect(() => {" },
      { lineNum: 9, code: "     const handleSync = (payload: GameState) => {" },
      { lineNum: 10, code: "       dispatch({ type: 'SYNC_STATE', payload });" },
      { lineNum: 11, code: "     };" },
      { lineNum: 12, code: "     socket.on('state_sync', handleSync);" },
      { lineNum: 13, code: "     return () => socket.off('state_sync', handleSync);" },
      { lineNum: 14, code: "   }, [socket]);" },
    ],
  },
  automate: {
    key: "automate",
    label: "Automate",
    files: [
      { name: "ci-pipeline.yml", icon: "⚙", lang: "yaml" },
      { name: "test-suite.ts", icon: "TS", lang: "typescript" },
    ],
    activeFileIndex: 0,
    chatUser: "@monalisa",
    chatGreeting:
      "Automation Copilot: GitHub Actions workflow triggered on push to branch main.\n\nMatrix build: 4 parallel runners across Linux and macOS.",
    chatPrompt: "Run end-to-end sandbox test suite and deploy preview",
    chatResponse:
      "✓ 42 unit tests passed. Preview deployment active at https://astra-preview-pr142.app",
    codeLines: [
      { lineNum: 1, code: "name: Astra CI/CD Masterclass Sandbox" },
      { lineNum: 2, code: "on: [push, pull_request]" },
      { lineNum: 3, code: "" },
      { lineNum: 4, code: "jobs:" },
      { lineNum: 5, code: "  build-and-eval:" },
      { lineNum: 6, code: "    runs-on: ubuntu-latest" },
      { lineNum: 7, code: "    steps:" },
      { lineNum: 8, code: "      - uses: actions/checkout@v4" },
      { lineNum: 9, code: "      - name: Setup Node.js & Rust toolchain" },
      { lineNum: 10, code: "        uses: actions/setup-node@v4" },
      { lineNum: 11, code: "        with: { node-version: 22 }" },
      { lineNum: 12, code: "      - name: Run Multi-Agent RAG Evaluation" },
      { lineNum: 13, code: "        run: pnpm test:ai-eval" },
      { lineNum: 14, code: "      - name: Deploy Live Edge Sandbox" },
      { lineNum: 15, code: "        run: pnpm deploy:preview" },
    ],
  },
  secure: {
    key: "secure",
    label: "Secure",
    files: [
      { name: "security-audit.rs", icon: "RS", lang: "rust" },
      { name: "zero-trust-guard.rs", icon: "RS", lang: "rust" },
    ],
    activeFileIndex: 0,
    chatUser: "@monalisa",
    chatGreeting:
      "Security Copilot: Static AST and memory-safety analysis complete.\n\n0 high vulnerabilities found. RS256 token verification compiled with Zero-Copy verification.",
    chatPrompt: "Audit Rust memory bounds and verify JWT mTLS handshake",
    chatResponse:
      "Audited 14 microservice endpoints. Safe against race conditions and token replay attacks.",
    codeLines: [
      { lineNum: 1, code: "// Zero-Trust Rust Token Guard with Compile-Time Invariants" },
      { lineNum: 2, code: "pub async fn verify_handshake(token: &str) -> Result<Claims, SecurityError> {" },
      { lineNum: 3, code: "    let verified = RS256Verifier::verify(token, &PUBLIC_KEY)?;" },
      { lineNum: 4, code: "    if verified.is_expired() {" },
      { lineNum: 5, code: "        return Err(SecurityError::TokenExpired);" },
      { lineNum: 6, code: "    }" },
      { lineNum: 7, code: "    // Enforce cryptographic nonces and tenant isolation" },
      { lineNum: 8, code: "    enforce_tenant_boundary(&verified.tenant_id)?;" },
      { lineNum: 9, code: "    Ok(verified.claims)" },
      { lineNum: 10, code: "}" },
    ],
  },
};

function renderSyntaxHighlighted(line: string) {
  // Simple syntax colorizer for keywords, strings, comments, numbers
  if (line.trim().startsWith("//") || line.trim().startsWith("#")) {
    return <span className="text-[#7d8590]">{line}</span>;
  }

  // Tokens highlighting
  const parts = line.split(/(\bthis\b|\bif\b|\belse\b|\bconst\b|\bexport\b|\bfunction\b|\blet\b|\bpub\b|\basync\b|\bfn\b|\bname:\b|\bon:\b|\bjobs:\b|\bruns-on:\b|\bsteps:\b|\buses:\b|\brun:\b|\btrue\b|\bfalse\b|\bnew\b|\breturn\b|'[^']*'|"[^"]*"|`[^`]*`|\d+)/g);

  return (
    <>
      {parts.map((part, i) => {
        if (!part) return null;
        if (/^(this|if|else|const|export|function|let|pub|async|fn|new|return)$/.test(part)) {
          return <span key={i} className="text-[#ff7b72] font-semibold">{part}</span>;
        }
        if (/^(name:|on:|jobs:|runs-on:|steps:|uses:|run:)$/.test(part)) {
          return <span key={i} className="text-[#79c0ff] font-semibold">{part}</span>;
        }
        if (/^('|\"|`).*('|\"|`)$/.test(part)) {
          return <span key={i} className="text-[#a5d6ff]">{part}</span>;
        }
        if (/^\d+$/.test(part)) {
          return <span key={i} className="text-[#79c0ff]">{part}</span>;
        }
        if (part.includes(".")) {
          return <span key={i} className="text-[#d2a8ff]">{part}</span>;
        }
        return <span key={i} className="text-[#e6edf3]">{part}</span>;
      })}
    </>
  );
}

export default function HeroInteractiveCopilot() {
  const [activeMode, setActiveMode] = useState<ModeKey>("code");
  const [activeFileTab, setActiveFileTab] = useState(0);
  const [customPrompt, setCustomPrompt] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "copilot"; text: string }>>([]);
  const [isPlaying, setIsPlaying] = useState(true);

  const currentModeData = MODES[activeMode];

  // Reset chat messages when switching modes
  useEffect(() => {
    setActiveFileTab(0);
    setChatMessages([]);
  }, [activeMode]);

  const handleSendPrompt = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const promptToSend = customPrompt.trim() || currentModeData.chatPrompt;
    setChatMessages((prev) => [
      ...prev,
      { sender: "user", text: promptToSend },
      {
        sender: "copilot",
        text: currentModeData.chatResponse || "Generating optimized implementation and running tests...",
      },
    ]);
    setCustomPrompt("");
  };

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* Clean, Modern Code Workspace Container */}
      <div className="relative w-full max-w-5xl rounded-2xl p-1 bg-slate-200/50 dark:bg-slate-800/40 border border-slate-300/60 dark:border-slate-800 shadow-xl">
        {/* Main VS Code App Window */}
        <div className="w-full rounded-2xl bg-[#0d1117] border border-[#30363d] overflow-hidden shadow-2xl flex flex-col font-sans">
          
          {/* Top Window Bar (macOS Dots & Title) */}
          <div className="h-9 px-4 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between text-xs text-[#7d8590]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block border border-[#e0443e]" />
              <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block border border-[#dea123]" />
              <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block border border-[#1aab29]" />
            </div>
            <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-[#8b949e]">
              <span>astra-academy — workspace</span>
            </div>
            <div className="w-12" />
          </div>

          {/* IDE Body: Split between Activity Bar, Copilot Chat, and Code Editor */}
          <div className="flex flex-col md:flex-row min-h-[460px] max-h-[560px] overflow-hidden text-left">
            
            {/* Leftmost Activity Bar (Icons) */}
            <div className="hidden sm:flex w-12 bg-[#0b0e14] border-r border-[#21262d] flex-col items-center py-3 space-y-5 text-[#7d8590]">
              {/* Explorer */}
              <button className="hover:text-white transition-colors" title="Explorer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </button>
              {/* Search */}
              <button className="hover:text-white transition-colors" title="Search">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="7" strokeWidth="1.8" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M20 20l-3.5-3.5" />
                </svg>
              </button>
              {/* Source Control */}
              <button className="hover:text-white transition-colors" title="Source Control">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 3a3 3 0 100 6 3 3 0 000-6zM6 9a3 3 0 100 6 3 3 0 000-6zM16 15a3 3 0 100 6 3 3 0 000-6zM6 12v6m10-9v3a3 3 0 01-3 3H9" />
                </svg>
              </button>
              {/* Copilot Chat (Selected Active) */}
              <button className="text-white relative" title="GitHub Copilot Chat">
                <div className="absolute -left-3 top-0 bottom-0 w-0.5 bg-[#58a6ff] rounded-r" />
                <svg className="w-5 h-5 text-[#58a6ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
            </div>

            {/* Left Pane: GITHUB COPILOT CHAT */}
            <div className="w-full md:w-[38%] bg-[#0d1117] border-r border-[#21262d] flex flex-col justify-between p-4 text-xs font-sans">
              <div className="space-y-4 overflow-y-auto pr-1">
                {/* Panel Title */}
                <div className="text-[11px] font-bold tracking-wider text-[#8b949e] uppercase">
                  GITHUB COPILOT: CHAT
                </div>

                {/* Copilot Greeting Header */}
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#1f242c] border border-[#30363d] flex items-center justify-center text-white shrink-0 shadow-sm">
                    <svg className="w-4 h-4 text-[#58a6ff]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#e6edf3]">GitHub Copilot</h4>
                  </div>
                </div>

                {/* Copilot Message Body */}
                <div className="p-3.5 rounded-xl bg-[#161b22] border border-[#30363d] text-[#c9d1d9] leading-relaxed space-y-2 text-xs">
                  <p className="font-semibold text-[#58a6ff]">{currentModeData.chatGreeting.split("\n\n")[0]}</p>
                  <p className="text-[11px] text-[#8b949e]">
                    {currentModeData.chatGreeting.split("\n\n")[1] || "I am ready to help you write code, explain concepts, and architect scalable systems."}
                  </p>
                </div>

                {/* Dynamic Chat Messages */}
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl text-xs ${
                      msg.sender === "user"
                        ? "bg-[#1f242c] border border-[#388bfd]/40 text-[#58a6ff] ml-3"
                        : "bg-[#161b22] border border-[#30363d] text-[#e6edf3] mr-3"
                    }`}
                  >
                    <div className="font-bold text-[10px] text-[#8b949e] mb-1">
                      {msg.sender === "user" ? "You" : "Copilot"}
                    </div>
                    <div>{msg.text}</div>
                  </div>
                ))}
              </div>

              {/* Chat Prompt Input Bar */}
              <form onSubmit={handleSendPrompt} className="pt-3 border-t border-[#21262d] relative mt-2">
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Ask a question or type '/' for commands"
                  className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-[#161b22] border border-[#30363d] text-xs text-[#e6edf3] placeholder-[#6e7681] focus:outline-none focus:border-[#58a6ff] transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-4.5 p-1 rounded-lg text-[#8b949e] hover:text-[#58a6ff] transition-colors"
                  title="Send Prompt"
                >
                  <svg className="w-4 h-4 transform rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>
            </div>

            {/* Right Pane: Code Editor Area */}
            <div className="flex-1 bg-[#090d16] flex flex-col justify-between overflow-hidden">
              
              {/* File Tabs Header */}
              <div className="flex items-center bg-[#0d1117] border-b border-[#21262d] overflow-x-auto text-xs">
                {currentModeData.files.map((file, idx) => {
                  const isActive = activeFileTab === idx;
                  return (
                    <button
                      key={file.name}
                      onClick={() => setActiveFileTab(idx)}
                      className={`flex items-center gap-2 px-4 py-2.5 border-r border-[#21262d] font-mono text-[11px] transition-colors ${
                        isActive
                          ? "bg-[#090d16] text-[#e6edf3] border-t-2 border-t-[#58a6ff] font-bold"
                          : "bg-[#0d1117] text-[#7d8590] hover:text-[#c9d1d9]"
                      }`}
                    >
                      <span className={`text-[10px] font-bold ${file.icon === "TS" ? "text-[#3178c6]" : file.icon === "RS" ? "text-[#dea584]" : "text-[#79c0ff]"}`}>
                        {file.icon}
                      </span>
                      <span>{file.name}</span>
                      <span className="text-[#6e7681] hover:text-white text-[10px]">✕</span>
                    </button>
                  );
                })}
              </div>

              {/* Code Line Content */}
              <div className="flex-1 p-3 sm:p-4 font-mono text-[11px] sm:text-xs overflow-y-auto space-y-0.5 leading-relaxed">
                {currentModeData.codeLines.map((line) => (
                  <div key={line.lineNum} className="flex items-start hover:bg-[#161b22]/50 px-1 rounded transition-colors group">
                    <span className="w-8 shrink-0 text-right pr-4 text-[#484f58] group-hover:text-[#7d8590] select-none text-[11px]">
                      {line.lineNum}
                    </span>
                    <span className="flex-1 whitespace-pre font-mono">
                      {renderSyntaxHighlighted(line.code)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Editor Bottom Bar with Pause/Play Indicator */}
              <div className="px-4 py-2 bg-[#0d1117] border-t border-[#21262d] flex items-center justify-between text-[11px] text-[#7d8590] font-mono">
                <div className="flex items-center gap-3">
                  <span>UTF-8</span>
                  <span>TypeScript 5.7</span>
                  <span className="text-emerald-400">● Live Sandbox Ready</span>
                </div>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1 rounded hover:bg-[#21262d] text-[#c9d1d9] transition-colors flex items-center gap-1 font-sans"
                  title="Pause / Play Code Sandbox"
                >
                  <span className="text-xs">{isPlaying ? "⏸ 00" : "▶ 01"}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Pill Navigation Bar (Code, Plan, Collaborate, Automate, Secure) */}
      <div className="mt-8 flex items-center justify-center">
        <div className="inline-flex items-center p-1.5 rounded-full bg-[#0d1117] border border-[#30363d] shadow-2xl backdrop-blur-xl">
          {(["code", "plan", "collaborate", "automate", "secure"] as ModeKey[]).map((key) => {
            const isActive = activeMode === key;
            return (
              <button
                key={key}
                onClick={() => setActiveMode(key)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all capitalize ${
                  isActive
                    ? "bg-[#1f242c] text-white border border-[#58a6ff] shadow-[0_0_15px_rgba(88,166,255,0.3)]"
                    : "text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#161b22]/80"
                }`}
              >
                {MODES[key].label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
