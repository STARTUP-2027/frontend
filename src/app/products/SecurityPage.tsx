import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { SiteFooter, SiteNav } from "../../App";
import { useTheme } from "../theme";
import { useCourses } from "../context/CourseContext";

export default function SecurityPage() {
  const { dark } = useTheme();
  const navigate = useNavigate();
  const { enrollInCourse, isEnrolled } = useCourses();

  const [terminalInput, setTerminalInput] = useState("");
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "[SYSTEM] Astra Security Sandbox v2.4 (Rust Kernel)",
    "Type 'scan', 'audit', or 'compile' to simulate security defenses:",
  ]);

  const enrolled = isEnrolled("rust-systems");

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();
    if (!cmd) return;

    const newLogs = [...terminalLogs, `$ ${terminalInput}`];

    if (cmd === "scan") {
      newLogs.push(
        "🔍 Running Zero-Trust network vulnerability audit...",
        "✓ mTLS Certificates: Valid (TLS 1.3, Curve25519)",
        "✓ JWT Signature: Valid (RS256, expiration: 3600s)",
        "✓ RBAC Matrix: 0 privilege escalation vulnerabilities found."
      );
    } else if (cmd === "audit" || cmd === "compile") {
      newLogs.push(
        "🦀 Compiling Rust binary with strict Borrow Checker...",
        "✓ Memory Safety: 0 data races, 0 use-after-free, 0 buffer overflows.",
        "✓ Binary size: 4.8 MB (Optimized for Alpine Docker container)."
      );
    } else {
      newLogs.push(
        `Command '${cmd}' not recognized. Try typing 'scan', 'audit', or 'compile'.`
      );
    }

    setTerminalLogs(newLogs);
    setTerminalInput("");
  };

  return (
    <div className={`subpage app ${dark ? "dark" : ""} min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]`}>
      <SiteNav />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-28 space-y-16">
        {/* Domain Hero */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span>🛡️</span> Cybersecurity & Zero-Trust Track
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Master Memory Safety & <br />
            <em className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-400">
              Zero-Trust Cloud Security with Rust
            </em>
          </h1>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            Eliminate memory vulnerabilities and build bulletproof backend systems. Master cryptographic handshakes, offensive security auditing, and high-concurrency microservices.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button
              onClick={() => {
                enrollInCourse("rust-systems");
                navigate("/learn/rust-systems");
              }}
              className="button button-lg text-xs font-extrabold shadow-xl hover:scale-105 transition-transform"
            >
              {enrolled ? "Resume Security Classroom →" : "Enroll in Security Masterclass Free →"}
            </button>
            <a href="#playground" className="button-secondary button-lg text-xs font-bold">
              <span>⚡</span> Launch Interactive Sandbox
            </a>
          </div>
        </section>

        {/* Interactive Security Terminal Lab */}
        <section id="playground" className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--border-soft)] pb-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">Interactive Terminal Sandbox</span>
              <h2 className="text-lg font-black mt-0.5">Zero-Trust & Rust Memory Auditor</h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setTerminalInput("scan")}
                className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold hover:bg-emerald-500/20 transition-all"
              >
                Run: scan
              </button>
              <button
                onClick={() => setTerminalInput("audit")}
                className="px-3 py-1 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 text-xs font-mono font-bold hover:bg-purple-500/20 transition-all"
              >
                Run: audit
              </button>
            </div>
          </div>

          {/* Terminal Window */}
          <div className="rounded-2xl bg-[#06050b] border border-emerald-500/30 p-5 font-mono text-xs text-emerald-400 shadow-inner space-y-3">
            <div className="flex justify-between text-[10px] text-gray-500 border-b border-gray-800 pb-2">
              <span>root@astra-security-lab:~#</span>
              <span>TLS 1.3 • Zero-Trust Enforced</span>
            </div>

            <div className="space-y-1 max-h-64 overflow-y-auto">
              {terminalLogs.map((log, i) => (
                <div key={i} className={log.startsWith("$") ? "text-white font-bold" : "text-emerald-400"}>
                  {log}
                </div>
              ))}
            </div>

            <form onSubmit={handleCommand} className="flex items-center gap-2 pt-2 border-t border-gray-800">
              <span className="text-emerald-400 font-bold">$</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                placeholder="Type 'scan' or 'audit'..."
                className="flex-1 bg-transparent border-0 text-white font-mono text-xs focus:outline-none"
              />
            </form>
          </div>
        </section>

        {/* Masterclass Pillars */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400">Curriculum Roadmap</span>
            <h2 className="text-2xl sm:text-3xl font-black">Zero-Trust & Systems Security Pillars</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] space-y-3">
              <span className="text-2xl">🦀</span>
              <h3 className="text-base font-extrabold">1. Rust Memory Safety</h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Master ownership, borrow checker lifetimes, RAII, and thread safety to eliminate CVEs at compile time.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] space-y-3">
              <span className="text-2xl">🔐</span>
              <h3 className="text-base font-extrabold">2. Cryptography & Identity</h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Implement mutual TLS (mTLS), OAuth2 PKCE token handshakes, JWT validation, and KMS envelope encryption.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] space-y-3">
              <span className="text-2xl">🛡️</span>
              <h3 className="text-base font-extrabold">3. Zero-Trust Cloud Architecture</h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Design perimeterless network policies, container isolation with gVisor, and real-time SIEM anomaly detection.
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
