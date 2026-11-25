import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../theme";

interface HackathonTestCase {
  id: string;
  input: string;
  expected: string;
  isHidden: boolean;
  weight: number;
  description: string;
}

interface HackathonProblem {
  id: string;
  title: string;
  track: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Architect";
  description: string;
  constraints: string[];
  starterRepoUrl: string;
  testCases: HackathonTestCase[];
  rubric: {
    innovation: number;
    codeQuality: number;
    scalability: number;
    ux: number;
  };
}

interface HackathonItem {
  id: string;
  title: string;
  tagline: string;
  theme: string;
  prizePool: number;
  currency: string;
  status: "Draft" | "Upcoming" | "Active" | "Judging" | "Completed";
  timeline: {
    registrationStart: string;
    registrationEnd: string;
    hackingStart: string;
    submissionDeadline: string;
    judgingEnd: string;
  };
  prizes: Array<{ place: string; reward: string; count: number }>;
  problems: HackathonProblem[];
  registeredTeamsCount: number;
  submissionsCount: number;
}

const INITIAL_HACKATHONS: HackathonItem[] = [
  {
    id: "hack-ai-agents-2027",
    title: "Global Autonomous Multi-Agent AI Hackathon",
    tagline: "Build self-correcting agent graph workflows with memory persistence & real-world tools",
    theme: "AI & Autonomous Agents",
    prizePool: 65000,
    currency: "USD",
    status: "Active",
    timeline: {
      registrationStart: "2026-10-01",
      registrationEnd: "2026-10-15",
      hackingStart: "2026-10-16",
      submissionDeadline: "2026-10-25",
      judgingEnd: "2026-10-30"
    },
    prizes: [
      { place: "1st Place Grand Champion", reward: "$25,000 + Astra AI Cloud Grants", count: 1 },
      { place: "2nd Place Runner Up", reward: "$15,000 + GPU Credits", count: 1 },
      { place: "3rd Place Bronze", reward: "$10,000 + Swag Tier", count: 1 },
      { place: "Best Agentic Architecture", reward: "$8,000", count: 1 },
      { place: "Community Favorite", reward: "$7,000", count: 1 }
    ],
    registeredTeamsCount: 1420,
    submissionsCount: 88,
    problems: [
      {
        id: "prob-1",
        title: "Self-Healing Distributed Microservice Agent",
        track: "Autonomous Multi-Agent",
        difficulty: "Architect",
        description: "Architect a resilient multi-agent loop in LangGraph/FastAPI that monitors container telemetry, analyzes error traces, autonomously mutates deployment manifests, and verifies health without human intervention.",
        constraints: [
          "Must execute in < 1500ms per agent reasoning cycle.",
          "Must support atomic rollback on unsuccessful healing attempt.",
          "Zero hardcoded API secrets (use zero-trust vault headers)."
        ],
        starterRepoUrl: "https://github.com/astra-academy/langgraph-agentic-starter",
        rubric: {
          innovation: 30,
          codeQuality: 25,
          scalability: 25,
          ux: 20
        },
        testCases: [
          {
            id: "tc-1",
            input: '{"event": "OOMKilled", "pod": "auth-svc-7b", "memoryUsage": "512Mi"}',
            expected: '{"action": "scale_memory_limit", "target": "1024Mi", "verified": true}',
            isHidden: false,
            weight: 20,
            description: "Detects OOM crash and performs adaptive horizontal/vertical scaling"
          },
          {
            id: "tc-2",
            input: '{"event": "504_Gateway_Timeout", "latencyP99": 4200}',
            expected: '{"action": "circuit_break_isolate", "status": "reconciled"}',
            isHidden: true,
            weight: 30,
            description: "Hidden edge case: Latency spike triggers circuit breaker with zero data loss"
          }
        ]
      }
    ]
  }
];

export default function AdminHackathonStudio() {
  const { user } = useAuth();
  const { dark } = useTheme();

  const [hackathons, setHackathons] = useState<HackathonItem[]>(INITIAL_HACKATHONS);
  const [selectedHackathonId, setSelectedHackathonId] = useState<string>(INITIAL_HACKATHONS[0].id);
  const [activeTab, setActiveTab] = useState<"overview" | "problems" | "rubric" | "submissions">("problems");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentHackathon = hackathons.find((h) => h.id === selectedHackathonId) || hackathons[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Add new problem to active hackathon
  const handleAddProblem = () => {
    const newProb: HackathonProblem = {
      id: `prob-${Date.now()}`,
      title: `Problem ${currentHackathon.problems.length + 1}: Real-Time Stream Processor`,
      track: currentHackathon.theme,
      difficulty: "Advanced",
      description: "Implement a high-throughput stream consumer with exactly-once delivery guarantees and sliding-window aggregation.",
      constraints: [
        "Memory consumption must not exceed 64MB under 100k msg/sec load.",
        "Must survive consumer node failure without message loss."
      ],
      starterRepoUrl: "https://github.com/astra-academy/rust-stream-starter",
      rubric: {
        innovation: 30,
        codeQuality: 25,
        scalability: 25,
        ux: 20
      },
      testCases: [
        {
          id: `tc-${Date.now()}-1`,
          input: '{"batch": [10, 20, 30], "windowMs": 5000}',
          expected: '{"sum": 60, "avg": 20, "count": 3}',
          isHidden: false,
          weight: 25,
          description: "Basic sliding window aggregation"
        }
      ]
    };

    setHackathons((prev) =>
      prev.map((h) => (h.id === currentHackathon.id ? { ...h, problems: [...h.problems, newProb] } : h))
    );
    showToast("New problem statement added to hackathon!");
  };

  // Add Testcase to problem
  const handleAddTestCase = (probId: string) => {
    const newTc: HackathonTestCase = {
      id: `tc-${Date.now()}`,
      input: '{"query": "SELECT * FROM telemetry WHERE status = 500", "timeoutMs": 100}',
      expected: '{"status": "handled", "recordsCount": 14}',
      isHidden: false,
      weight: 25,
      description: "Stress load query verification"
    };

    setHackathons((prev) =>
      prev.map((h) => {
        if (h.id !== currentHackathon.id) return h;
        return {
          ...h,
          problems: h.problems.map((p) => (p.id === probId ? { ...p, testCases: [...p.testCases, newTc] } : p))
        };
      })
    );
    showToast("Test case attached to problem!");
  };

  // Update Problem Field
  const handleUpdateProblem = (probId: string, field: keyof HackathonProblem, val: any) => {
    setHackathons((prev) =>
      prev.map((h) => {
        if (h.id !== currentHackathon.id) return h;
        return {
          ...h,
          problems: h.problems.map((p) => (p.id === probId ? { ...p, [field]: val } : p))
        };
      })
    );
  };

  // Update Testcase Field
  const handleUpdateTestCase = (probId: string, tcId: string, field: keyof HackathonTestCase, val: any) => {
    setHackathons((prev) =>
      prev.map((h) => {
        if (h.id !== currentHackathon.id) return h;
        return {
          ...h,
          problems: h.problems.map((p) => {
            if (p.id !== probId) return p;
            return {
              ...p,
              testCases: p.testCases.map((tc) => (tc.id === tcId ? { ...tc, [field]: val } : tc))
            };
          })
        };
      })
    );
  };

  // Remove testcase
  const handleRemoveTestCase = (probId: string, tcId: string) => {
    setHackathons((prev) =>
      prev.map((h) => {
        if (h.id !== currentHackathon.id) return h;
        return {
          ...h,
          problems: h.problems.map((p) => {
            if (p.id !== probId) return p;
            return {
              ...p,
              testCases: p.testCases.filter((tc) => tc.id !== tcId)
            };
          })
        };
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-emerald-500 text-white font-black text-xs shadow-2xl animate-fade-in flex items-center gap-2">
          <span>✓</span> {toastMessage}
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[10px] font-black uppercase">
              Hackathon Creator Studio
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
              ● {currentHackathon.status}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--text)]">{currentHackathon.title}</h2>
          <p className="text-xs text-[var(--muted)]">{currentHackathon.tagline}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleAddProblem}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shadow-lg shadow-purple-600/30 flex items-center gap-2"
          >
            <span>➕ Add Problem Statement</span>
          </button>
        </div>
      </div>

      {/* Studio Sub-Tabs */}
      <div className="flex border-b border-[var(--border-soft)] gap-4">
        {[
          { id: "problems", label: "Problems & Test Cases", icon: "💻" },
          { id: "overview", label: "Timeline & Prize Pool", icon: "🏆" },
          { id: "rubric", label: "Judging Rubric", icon: "⚖️" },
          { id: "submissions", label: "Live Submissions (88)", icon: "📥" }
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id as any)}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === t.id
                ? "border-purple-500 text-purple-400"
                : "border-transparent text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: PROBLEMS & TEST CASES */}
      {activeTab === "problems" && (
        <div className="space-y-6">
          {currentHackathon.problems.map((prob, pIdx) => (
            <div key={prob.id} className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-soft)] pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 font-black text-xs flex items-center justify-center">
                    #{pIdx + 1}
                  </span>
                  <div>
                    <h3 className="text-base font-black text-[var(--text)]">{prob.title}</h3>
                    <span className="text-[10px] text-[var(--muted)] font-semibold">{prob.track} • {prob.difficulty}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleAddTestCase(prob.id)}
                    className="px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 font-bold text-xs border border-indigo-500/30 flex items-center gap-1"
                  >
                    <span>➕ Add Test Case</span>
                  </button>
                </div>
              </div>

              {/* Problem Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-[var(--muted)] mb-1">Problem Title:</label>
                  <input
                    type="text"
                    value={prob.title}
                    onChange={(e) => handleUpdateProblem(prob.id, "title", e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[var(--surface-soft)] border border-[var(--border-soft)] text-[var(--text)] font-semibold outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[var(--muted)] mb-1">Starter GitHub Repo / Boilerplate:</label>
                  <input
                    type="text"
                    value={prob.starterRepoUrl}
                    onChange={(e) => handleUpdateProblem(prob.id, "starterRepoUrl", e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[var(--surface-soft)] border border-[var(--border-soft)] text-[var(--text)] font-mono outline-none focus:border-purple-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-[var(--muted)] mb-1">Architecture Specification & Challenge Markdown:</label>
                  <textarea
                    rows={4}
                    value={prob.description}
                    onChange={(e) => handleUpdateProblem(prob.id, "description", e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border-soft)] text-[var(--text)] font-mono text-xs outline-none focus:border-purple-500 leading-relaxed resize-none"
                  />
                </div>
              </div>

              {/* Public & Hidden Test Cases Section */}
              <div className="pt-4 border-t border-[var(--border-soft)] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <span>🧪</span> Verification Test Harness ({prob.testCases.length} Cases)
                  </h4>
                  <span className="text-[10px] text-[var(--muted)]">Supports public samples & hidden evaluation cases</span>
                </div>

                <div className="space-y-3">
                  {prob.testCases.map((tc, tcIdx) => (
                    <div key={tc.id} className="p-4 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border-soft)] space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-purple-400">Case #{tcIdx + 1}</span>
                          <label className="flex items-center gap-1.5 text-[11px] font-bold cursor-pointer">
                            <input
                              type="checkbox"
                              checked={tc.isHidden}
                              onChange={(e) => handleUpdateTestCase(prob.id, tc.id, "isHidden", e.target.checked)}
                              className="accent-purple-500"
                            />
                            <span className={tc.isHidden ? "text-amber-400" : "text-emerald-400"}>
                              {tc.isHidden ? "🔒 Hidden Suite (Eval Only)" : "🌐 Public Sample"}
                            </span>
                          </label>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-[var(--muted)]">Weight:</span>
                          <input
                            type="number"
                            value={tc.weight}
                            onChange={(e) => handleUpdateTestCase(prob.id, tc.id, "weight", Number(e.target.value))}
                            className="w-14 px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--border-soft)] font-bold text-center"
                          />
                          <span className="text-[10px] text-[var(--muted)]">pts</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTestCase(prob.id, tc.id)}
                            className="text-rose-400 hover:text-rose-300 font-bold ml-2"
                          >
                            ✕
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                        <div>
                          <label className="block text-[10px] font-bold text-[var(--muted)] mb-1">Input Payload / Args:</label>
                          <textarea
                            rows={2}
                            value={tc.input}
                            onChange={(e) => handleUpdateTestCase(prob.id, tc.id, "input", e.target.value)}
                            className="w-full p-2 rounded-lg bg-[var(--surface)] border border-[var(--border-soft)] text-emerald-300 outline-none resize-none text-[11px]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-[var(--muted)] mb-1">Expected Output / Assertion:</label>
                          <textarea
                            rows={2}
                            value={tc.expected}
                            onChange={(e) => handleUpdateTestCase(prob.id, tc.id, "expected", e.target.value)}
                            className="w-full p-2 rounded-lg bg-[var(--surface)] border border-[var(--border-soft)] text-indigo-300 outline-none resize-none text-[11px]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: OVERVIEW & PRIZE POOL */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] shadow-xl space-y-4 text-xs">
            <h3 className="text-sm font-black uppercase text-[var(--accent)] flex items-center gap-2">
              <span>📅</span> Timeline & Phases
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block font-bold text-[var(--muted)] mb-1">Registration Window:</label>
                <div className="grid grid-cols-2 gap-2">
                  <input type="date" value={currentHackathon.timeline.registrationStart} className="p-2 rounded-xl bg-[var(--surface-soft)] border border-[var(--border-soft)] font-mono" />
                  <input type="date" value={currentHackathon.timeline.registrationEnd} className="p-2 rounded-xl bg-[var(--surface-soft)] border border-[var(--border-soft)] font-mono" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[var(--muted)] mb-1">Hacking & Submission Deadline:</label>
                <div className="grid grid-cols-2 gap-2">
                  <input type="date" value={currentHackathon.timeline.hackingStart} className="p-2 rounded-xl bg-[var(--surface-soft)] border border-[var(--border-soft)] font-mono" />
                  <input type="date" value={currentHackathon.timeline.submissionDeadline} className="p-2 rounded-xl bg-[var(--surface-soft)] border border-[var(--border-soft)] font-mono" />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] shadow-xl space-y-4 text-xs">
            <h3 className="text-sm font-black uppercase text-amber-400 flex items-center gap-2">
              <span>🏆</span> Prize Pool Breakdown (${currentHackathon.prizePool.toLocaleString()})
            </h3>
            <div className="space-y-2">
              {currentHackathon.prizes.map((pz, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border-soft)]">
                  <span className="font-bold text-[var(--text)]">{pz.place}</span>
                  <span className="font-extrabold text-amber-400">{pz.reward}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RUBRIC */}
      {activeTab === "rubric" && (
        <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] shadow-xl space-y-4 text-xs">
          <h3 className="text-sm font-black uppercase text-[var(--accent)] flex items-center gap-2">
            <span>⚖️</span> Evaluation Rubric Weights
          </h3>
          <p className="text-[var(--muted)]">Judges score submissions on a 100-point scale based on the following weighted criteria:</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border-soft)] text-center space-y-1">
              <span className="text-2xl">💡</span>
              <h4 className="font-bold text-[var(--text)]">Innovation & Uniqueness</h4>
              <span className="text-xl font-black text-purple-400">30%</span>
            </div>
            <div className="p-4 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border-soft)] text-center space-y-1">
              <span className="text-2xl">💻</span>
              <h4 className="font-bold text-[var(--text)]">Code Architecture & Tests</h4>
              <span className="text-xl font-black text-indigo-400">25%</span>
            </div>
            <div className="p-4 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border-soft)] text-center space-y-1">
              <span className="text-2xl">⚡</span>
              <h4 className="font-bold text-[var(--text)]">Scalability & Performance</h4>
              <span className="text-xl font-black text-emerald-400">25%</span>
            </div>
            <div className="p-4 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border-soft)] text-center space-y-1">
              <span className="text-2xl">🎨</span>
              <h4 className="font-bold text-[var(--text)]">UX & Live Demo</h4>
              <span className="text-xl font-black text-amber-400">20%</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SUBMISSIONS */}
      {activeTab === "submissions" && (
        <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] shadow-xl space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-[var(--border-soft)] pb-3">
            <h3 className="text-sm font-black uppercase text-[var(--accent)] flex items-center gap-2">
              <span>📥</span> Registered Teams & Live Submissions
            </h3>
            <span className="text-xs text-[var(--muted)]">Showing 4 latest entries</span>
          </div>

          <div className="divide-y divide-[var(--border-soft)]">
            {[
              { team: "Team NeuralFlow", members: 4, score: 94.5, repo: "github.com/neuralflow/hack-agent", status: "Verified" },
              { team: "CyberRust Core", members: 3, score: 92.0, repo: "github.com/cyberrust/raft-mesh", status: "Verified" },
              { team: "Vortex Distributed", members: 2, score: 88.5, repo: "github.com/vortex/fastapi-langgraph", status: "Under Review" },
              { team: "Astra Architects", members: 4, score: 86.0, repo: "github.com/astra-arch/agentic-stream", status: "Under Review" }
            ].map((sub, i) => (
              <div key={i} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-extrabold text-[var(--text)]">{sub.team} ({sub.members} engineers)</p>
                  <a href={`https://${sub.repo}`} target="_blank" rel="noreferrer" className="text-[11px] text-purple-400 font-mono hover:underline">
                    {sub.repo}
                  </a>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-xs font-black text-emerald-400">{sub.score} / 100</span>
                    <span className="block text-[10px] text-[var(--muted)]">{sub.status}</span>
                  </div>
                  <button className="px-3 py-1 rounded-lg bg-[var(--surface-soft)] hover:bg-[var(--surface)] border border-[var(--border)] font-bold text-xs">
                    Review Rubric
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
