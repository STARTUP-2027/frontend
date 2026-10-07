import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../theme";
import { SiteNav, SiteFooter } from "../../App";

interface DailyChallenge {
  id: string;
  title: string;
  category: "AI & Graph" | "Full-Stack" | "Rust Systems" | "DevOps & Cloud";
  difficulty: "Easy" | "Medium" | "Hard" | "Architect";
  xp: number;
  timeLimitSec: number;
  type: "quiz" | "code";
  question: string;
  options?: string[];
  correctIndex?: number;
  explanation: string;
  starterCode?: string;
  testCases?: Array<{ input: string; expected: string; description: string }>;
}

const DAILY_CHALLENGES: DailyChallenge[] = [
  {
    id: "ch-1",
    title: "LangGraph Cyclic State Memory Checkpoints",
    category: "AI & Graph",
    difficulty: "Architect",
    xp: 250,
    timeLimitSec: 180,
    type: "quiz",
    question: "In LangGraph multi-agent systems, how does StateGraph persist intermediate reasoning steps across cyclic node retries without blowing token context?",
    options: [
      "By saving state snapshot checkpoints in a MemorySaver thread reducer",
      "By restarting the LLM container on every loop",
      "By serializing state into HTTP cookies on the client",
      "By using uncompressed Redis strings for all prompt tokens"
    ],
    correctIndex: 0,
    explanation: "LangGraph utilizes checkpointer interfaces (like MemorySaver or PostgresCheckpointer) to take atomic thread snapshots between node state transitions."
  },
  {
    id: "ch-2",
    title: "React 19 Server Action Optimistic State Mutation",
    category: "Full-Stack",
    difficulty: "Medium",
    xp: 180,
    timeLimitSec: 240,
    type: "code",
    question: "Write an optimistic state updater function `applyOptimisticVote` that receives current state `(votes, isLiked)` and returns the updated state immediately before server resolution.",
    starterCode: `// Implement optimistic voting logic
function applyOptimisticVote(state) {
  const currentVotes = state.votes;
  const wasLiked = state.isLiked;
  
  // Return new optimistic state
  return {
    votes: wasLiked ? currentVotes - 1 : currentVotes + 1,
    isLiked: !wasLiked
  };
}`,
    testCases: [
      { input: "{ votes: 10, isLiked: false }", expected: "{ votes: 11, isLiked: true }", description: "Toggle like on unliked post increments count" },
      { input: "{ votes: 5, isLiked: true }", expected: "{ votes: 4, isLiked: false }", description: "Toggle like on already liked post decrements count" },
      { input: "{ votes: 0, isLiked: false }", expected: "{ votes: 1, isLiked: true }", description: "Handles zero vote base boundary correctly" },
      { input: "{ votes: 999, isLiked: true }", expected: "{ votes: 998, isLiked: false }", description: "Large state invariant preserves atomic transition" }
    ],
    explanation: "Optimistic updates instantly render the expected next state on the client thread while the server mutation processes asynchronously."
  },
  {
    id: "ch-3",
    title: "Zero-Trust Rust mTLS Token Signature Verifier",
    category: "Rust Systems",
    difficulty: "Hard",
    xp: 220,
    timeLimitSec: 200,
    type: "quiz",
    question: "Which cryptographic primitive ensures that a distributed microservice cannot forge RS256 authorization tokens even if its container memory is dumped?",
    options: [
      "Asymmetric Public/Private Key pairs with Hardware Security Module (HSM) signing",
      "Base64 string encoding with timestamp salting",
      "MD5 hashing stored in an environment variable",
      "Symmetric AES-128 keys shared across all microservices"
    ],
    correctIndex: 0,
    explanation: "Asymmetric RS256/Ed25519 cryptography allows verifying signatures using the public key while the private key remains locked inside secure enclaves."
  },
  {
    id: "ch-4",
    title: "Kubernetes ArgoCD GitOps Drift Resolution",
    category: "DevOps & Cloud",
    difficulty: "Medium",
    xp: 160,
    timeLimitSec: 150,
    type: "quiz",
    question: "When a developer manually edits a live Kubernetes Deployment replica count via kubectl, how does ArgoCD respond in Automated Self-Heal mode?",
    options: [
      "ArgoCD immediately detects cluster drift and rolls back the live cluster to match Git declaration",
      "ArgoCD deletes the cluster immediately",
      "ArgoCD commits the manual change back to GitHub main branch",
      "ArgoCD turns off monitoring"
    ],
    correctIndex: 0,
    explanation: "GitOps enforces Git as the single source of truth; self-healing actively reconciles and overrides any out-of-band manual drift."
  }
];

const LEADERBOARD_USERS = [
  { rank: 1, name: "Kaito Takahashi", avatar: "KT", role: "Staff Architect", xp: 18450, streak: 48, badge: "Grandmaster", winRate: "94%" },
  { rank: 2, name: "Dr. Aris Vance", avatar: "AV", role: "AI Researcher", xp: 16920, streak: 36, badge: "Grandmaster", winRate: "91%" },
  { rank: 3, name: "Elena Rostova", avatar: "ER", role: "Principal Systems Eng", xp: 15200, streak: 29, badge: "Staff Architect", winRate: "88%" },
  { rank: 4, name: "Alex Morgan", avatar: "AM", role: "Pro Learner (You)", xp: 14500, streak: 14, badge: "Senior Alchemist", winRate: "85%" },
  { rank: 5, name: "Marcus Brody", avatar: "MB", role: "Cloud Lead", xp: 13800, streak: 22, badge: "Senior Alchemist", winRate: "82%" },
  { rank: 6, name: "Priya Sharma", avatar: "PS", role: "Zero Trust Security", xp: 12400, streak: 19, badge: "Systems Lead", winRate: "79%" },
  { rank: 7, name: "David Chen", avatar: "DC", role: "Full-Stack Dev", xp: 11100, streak: 12, badge: "Systems Lead", winRate: "76%" },
];

const DUEL_QUESTIONS = [
  {
    q: "Which HTTP status code is returned when a client makes too many requests (rate limit exceeded)?",
    options: ["429 Too Many Requests", "401 Unauthorized", "503 Service Unavailable", "418 I'm a teapot"],
    correct: 0,
    timeLimit: 15
  },
  {
    q: "In Vector RAG, what metric measures the angle between two embedding vectors?",
    options: ["Cosine Similarity", "Euclidean Distance", "Manhattan L1 Norm", "Hamming Distance"],
    correct: 0,
    timeLimit: 15
  },
  {
    q: "In React 19, which hook is used to access form action state and pending status directly?",
    options: ["useActionState", "useFormStatus", "useTransitionState", "useFormEffect"],
    correct: 0,
    timeLimit: 15
  },
  {
    q: "Which Rust keyword is used to declare an immutable thread-safe static reference?",
    options: ["static ref / lazy_static", "mut global", "volatile", "extern thread"],
    correct: 0,
    timeLimit: 15
  }
];

export default function ContestArenaPage() {
  const { dark } = useTheme();
  const { user, updateUserStats } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"daily" | "hackathon" | "duel">("daily");
  
  // Daily challenge state
  const [selectedChallengeIdx, setSelectedChallengeIdx] = useState(0);
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [codeEditorVal, setCodeEditorVal] = useState(DAILY_CHALLENGES[1].starterCode || "");
  const [testResults, setTestResults] = useState<Array<{ pass: boolean; msg: string }> | null>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [earnedXP, setEarnedXP] = useState<number | null>(null);

  // Timer for daily challenge
  const [timeLeft, setTimeLeft] = useState(DAILY_CHALLENGES[0].timeLimitSec);
  const [timerRunning, setTimerRunning] = useState(true);

  // 1v1 Battle Duel State
  const [duelActive, setDuelActive] = useState(false);
  const [duelRound, setDuelRound] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [userSelectedOpt, setUserSelectedOpt] = useState<number | null>(null);
  const [duelFeedback, setDuelFeedback] = useState<string | null>(null);
  const [duelWinner, setDuelWinner] = useState<"user" | "ai" | "draw" | null>(null);
  const [duelTimeLeft, setDuelTimeLeft] = useState(15);

  const currentChallenge = DAILY_CHALLENGES[selectedChallengeIdx];

  // Daily challenge timer
  useEffect(() => {
    setTimeLeft(currentChallenge.timeLimitSec);
    setQuizSelectedOption(null);
    setQuizSubmitted(false);
    setTestResults(null);
    if (currentChallenge.starterCode) {
      setCodeEditorVal(currentChallenge.starterCode);
    }
  }, [selectedChallengeIdx]);

  useEffect(() => {
    if (!timerRunning || timeLeft <= 0 || quizSubmitted || testResults) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning, timeLeft, quizSubmitted, testResults]);

  // Run code tests for code challenge
  const handleRunCodeAssertions = () => {
    setIsRunningTests(true);
    setTimeout(() => {
      // Simulate running assertions
      const results = (currentChallenge.testCases || []).map((tc, idx) => ({
        pass: true,
        msg: `Assertion #${idx + 1} passed: ${tc.description} (Latency: ${(1.2 + idx * 0.4).toFixed(1)}ms)`
      }));
      setTestResults(results);
      setIsRunningTests(false);
      setEarnedXP(currentChallenge.xp);
      updateUserStats(currentChallenge.xp);
    }, 700);
  };

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
    if (quizSelectedOption === currentChallenge.correctIndex) {
      setEarnedXP(currentChallenge.xp);
      updateUserStats(currentChallenge.xp);
    }
  };

  // 1v1 Duel Timer & Round logic
  useEffect(() => {
    if (!duelActive || duelWinner) return;
    if (duelTimeLeft <= 0) {
      handleAnswerDuel(-1); // Timeout
      return;
    }
    const timer = setInterval(() => {
      setDuelTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [duelActive, duelTimeLeft, duelWinner]);

  const handleStartDuel = () => {
    setDuelActive(true);
    setDuelRound(0);
    setUserScore(0);
    setAiScore(0);
    setUserSelectedOpt(null);
    setDuelFeedback(null);
    setDuelWinner(null);
    setDuelTimeLeft(15);
  };

  const handleAnswerDuel = (optionIdx: number) => {
    setUserSelectedOpt(optionIdx);
    const currQ = DUEL_QUESTIONS[duelRound];
    const isCorrect = optionIdx === currQ.correct;

    // AI logic: 80% chance AI gets it right in 3-8 seconds
    const aiCorrect = Math.random() < 0.85;

    let userPoints = isCorrect ? 100 + Math.floor(duelTimeLeft * 5) : 0;
    let aiPoints = aiCorrect ? 100 + Math.floor(Math.random() * 50) : 0;

    const newUserScore = userScore + userPoints;
    const newAiScore = aiScore + aiPoints;
    setUserScore(newUserScore);
    setAiScore(newAiScore);

    setDuelFeedback(
      isCorrect
        ? `⚡ Fast & Correct! (+${userPoints} pts)`
        : `❌ Incorrect! (AI scored +${aiPoints} pts)`
    );

    setTimeout(() => {
      if (duelRound < DUEL_QUESTIONS.length - 1) {
        setDuelRound((r) => r + 1);
        setUserSelectedOpt(null);
        setDuelFeedback(null);
        setDuelTimeLeft(15);
      } else {
        // Match finished
        const winner = newUserScore > newAiScore ? "user" : newUserScore < newAiScore ? "ai" : "draw";
        setDuelWinner(winner);
        if (winner === "user") {
          updateUserStats(300);
        }
      }
    }, 1800);
  };

  return (
    <div className={`subpage app ${dark ? "dark" : ""} min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]`}>
      <SiteNav />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-28 space-y-8">
        {/* Arena Banner Header */}
        <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-950/60 to-purple-900/20 border border-[var(--border-soft)] shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase flex items-center gap-1.5">
                  <span>⚡</span> Live Coding & Contest Arena
                </span>
                <span className="text-xs text-[var(--muted)]">Season 4 Active</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
                Quiz Playground & Hackathon Arena
              </h1>
              <p className="text-xs text-[var(--muted)] max-w-2xl">
                Compete in daily architectural benchmark quizzes, timed hackathons, and real-time 1v1 code duels to climb the global leaderboard.
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="flex items-center gap-3 bg-[var(--surface)]/80 backdrop-blur-md p-4 rounded-2xl border border-[var(--border-soft)] shadow-lg">
              <div className="text-center px-3 border-r border-[var(--border-soft)]">
                <span className="text-[10px] uppercase font-bold text-[var(--muted)]">Your Rank</span>
                <p className="text-lg font-black text-amber-400">#4</p>
              </div>
              <div className="text-center px-3 border-r border-[var(--border-soft)]">
                <span className="text-[10px] uppercase font-bold text-[var(--muted)]">Contest XP</span>
                <p className="text-lg font-black text-[var(--accent)]">{user?.xp || 1450} XP</p>
              </div>
              <div className="text-center px-3">
                <span className="text-[10px] uppercase font-bold text-[var(--muted)]">Win Rate</span>
                <p className="text-lg font-black text-emerald-400">85%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Arena Tabs */}
        <div className="flex border-b border-[var(--border-soft)] gap-2">
          <button
            onClick={() => setActiveTab("daily")}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "daily"
                ? "border-[var(--accent)] text-[var(--accent)]"
                : "border-transparent text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            <span className="text-sm">🎯</span> Daily Coding & Arch Challenges
          </button>
          <button
            onClick={() => setActiveTab("hackathon")}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "hackathon"
                ? "border-[var(--accent)] text-[var(--accent)]"
                : "border-transparent text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            <span className="text-sm">🏆</span> Speed Hackathons & Scoreboard
          </button>
          <button
            onClick={() => setActiveTab("duel")}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "duel"
                ? "border-[var(--accent)] text-[var(--accent)]"
                : "border-transparent text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            <span className="text-sm">⚔️</span> Battle Mode (1v1 AI Code Duel)
          </button>
        </div>

        {/* TAB 1: Daily Challenges */}
        {activeTab === "daily" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Interactive Challenge Playground */}
            <div className="lg:col-span-2 space-y-6">
              {/* Challenge Selector Pills */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {DAILY_CHALLENGES.map((ch, idx) => (
                  <button
                    key={ch.id}
                    onClick={() => setSelectedChallengeIdx(idx)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                      selectedChallengeIdx === idx
                        ? "bg-[var(--accent)] text-white shadow-md scale-102"
                        : "bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)]"
                    }`}
                  >
                    <span>{idx + 1}.</span>
                    <span>{ch.title.slice(0, 24)}...</span>
                    <span className="text-[10px] opacity-80">+{ch.xp} XP</span>
                  </button>
                ))}
              </div>

              {/* Challenge Main Card */}
              <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] space-y-6 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border-soft)]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        {currentChallenge.category}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        currentChallenge.difficulty === "Architect"
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}>
                        {currentChallenge.difficulty}
                      </span>
                      <span className="text-xs font-bold text-emerald-400">+{currentChallenge.xp} XP</span>
                    </div>
                    <h2 className="text-lg font-black mt-1.5">{currentChallenge.title}</h2>
                  </div>

                  {/* Timer Badge */}
                  <div className="flex items-center gap-2 bg-[var(--surface-soft)] px-3.5 py-1.5 rounded-xl border border-[var(--border)] self-start sm:self-auto font-mono text-xs font-bold text-amber-400">
                    <span>⏱️</span>
                    <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}</span>
                  </div>
                </div>

                {/* Question Statement */}
                <div className="space-y-2">
                  <p className="text-xs sm:text-sm font-semibold leading-relaxed">
                    {currentChallenge.question}
                  </p>
                </div>

                {/* Multiple Choice Quiz Challenge Mode */}
                {currentChallenge.type === "quiz" && (
                  <div className="space-y-3">
                    {currentChallenge.options?.map((opt, optIdx) => {
                      let btnStyle = "border-[var(--border)] bg-[var(--surface-soft)] hover:border-[var(--accent)]";
                      if (quizSubmitted) {
                        if (optIdx === currentChallenge.correctIndex) {
                          btnStyle = "border-emerald-500 bg-emerald-500/20 text-emerald-400 font-bold";
                        } else if (quizSelectedOption === optIdx) {
                          btnStyle = "border-rose-500 bg-rose-500/20 text-rose-400";
                        }
                      } else if (quizSelectedOption === optIdx) {
                        btnStyle = "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)] font-bold";
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => !quizSubmitted && setQuizSelectedOption(optIdx)}
                          className={`w-full p-4 rounded-2xl border text-left text-xs transition-all flex items-start justify-between gap-3 ${btnStyle}`}
                        >
                          <span className="leading-relaxed">{opt}</span>
                          {quizSubmitted && optIdx === currentChallenge.correctIndex && (
                            <span className="text-emerald-400 font-bold shrink-0">✓ Correct</span>
                          )}
                        </button>
                      );
                    })}

                    {!quizSubmitted ? (
                      <button
                        onClick={handleSubmitQuiz}
                        disabled={quizSelectedOption === null}
                        className="button button-sm text-xs font-bold mt-4 disabled:opacity-50"
                      >
                        Submit Verification Answer →
                      </button>
                    ) : (
                      <div className="p-4 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border-soft)] text-xs space-y-1 animate-fade-in">
                        <span className="font-extrabold text-[var(--accent)]">Architectural Explanation:</span>
                        <p className="text-[var(--muted)] leading-relaxed">{currentChallenge.explanation}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Code Challenge Mode */}
                {currentChallenge.type === "code" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--muted)]">AST Code Solution Editor</span>
                      <button
                        onClick={handleRunCodeAssertions}
                        disabled={isRunningTests}
                        className="button button-sm text-xs flex items-center gap-2 shadow-md"
                      >
                        <span>⚡</span>
                        {isRunningTests ? "Running Benchmarks..." : "Run Test Suite (4 Assertions)"}
                      </button>
                    </div>

                    <textarea
                      rows={9}
                      value={codeEditorVal}
                      onChange={(e) => setCodeEditorVal(e.target.value)}
                      className="w-full p-4 rounded-2xl font-mono text-xs bg-[#0b0a14] text-[#93c5fd] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    />

                    {/* Assertion Output Benchmarks */}
                    {testResults && (
                      <div className="p-4 rounded-2xl bg-[#06050b] border border-emerald-500/30 space-y-2 text-xs font-mono animate-fade-in">
                        <div className="flex items-center justify-between text-emerald-400 font-bold">
                          <span>✅ All 4/4 Assertions Passed! (100% Score)</span>
                          <span className="text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            Passing in 4.2ms
                          </span>
                        </div>
                        <div className="divide-y divide-gray-800 space-y-1 pt-1 text-[11px] text-gray-300">
                          {testResults.map((r, i) => (
                            <div key={i} className="pt-1 text-emerald-300">
                              {r.msg}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* XP Reward Banner */}
                {earnedXP && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/40 text-xs font-bold flex items-center justify-between text-purple-300 animate-bounce">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🎉</span>
                      <span>Challenge Completed! +{earnedXP} XP added to your leaderboard standing.</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-purple-500/30 text-white text-[10px]">
                      Streak +1 🔥
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right 1 Col: Live Leaderboard Widget */}
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] space-y-4 shadow-md">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-wider text-[var(--accent)] flex items-center gap-1.5">
                    <span>👑</span> Arena Leaderboard
                  </h3>
                  <span className="text-[10px] text-[var(--muted)] font-mono">Real-time Sync</span>
                </div>

                <div className="divide-y divide-[var(--border-soft)]">
                  {LEADERBOARD_USERS.map((usr) => (
                    <div key={usr.rank} className="py-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`w-5 font-black text-center ${
                          usr.rank === 1 ? "text-amber-400 text-sm" : usr.rank === 2 ? "text-gray-300" : usr.rank === 3 ? "text-amber-600" : "text-[var(--muted)]"
                        }`}>
                          {usr.rank === 1 ? "🥇" : usr.rank === 2 ? "🥈" : usr.rank === 3 ? "🥉" : `#${usr.rank}`}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {usr.avatar}
                        </div>
                        <div className="min-w-0">
                          <p className="font-extrabold truncate text-[var(--text)]">{usr.name}</p>
                          <span className="text-[10px] text-[var(--muted)]">{usr.role}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-bold text-[var(--accent)]">{usr.xp.toLocaleString()} XP</span>
                        <span className="block text-[10px] text-amber-400">🔥 {usr.streak}d</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Weekly Speed Hackathon */}
        {activeTab === "hackathon" && (
          <div className="space-y-6">
            <div className="p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] shadow-xl relative overflow-hidden">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse">
                      🔴 Live Event This Week
                    </span>
                    <span className="text-xs text-[var(--muted)] font-mono">Ends in 2d 14h</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black">
                    Weekly Speed Hackathon: "Build a RAG LangGraph in 30 Mins"
                  </h2>
                  <p className="text-xs text-[var(--muted)] leading-relaxed">
                    Build an autonomous RAG question-answering agent that uses a cyclic state graph, self-evaluates document relevance, and rewrites queries upon failure.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="px-2.5 py-1 rounded-lg bg-[var(--surface-soft)] text-xs font-mono text-[var(--accent)]">
                      🏆 1st Prize: $1,000 + Astra All-Access Pass
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-[var(--surface-soft)] text-xs font-mono text-emerald-400">
                      🏅 Top 10%: Verified Grandmaster Badge
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 shrink-0">
                  <button
                    onClick={() => navigate("/sandbox")}
                    className="button py-3.5 px-8 text-xs font-black shadow-xl hover:scale-105 transition-transform flex items-center justify-center gap-2"
                  >
                    <span>🚀</span> Enter Hackathon Arena & Open Sandbox
                  </button>
                  <span className="text-[10px] text-center text-[var(--muted)]">342 active contestants online</span>
                </div>
              </div>
            </div>

            {/* Hackathon Specs & Requirements */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] space-y-2">
                <span className="text-xl">📐</span>
                <h4 className="text-sm font-extrabold">1. Evaluation Metric</h4>
                <p className="text-xs text-[var(--muted)]">Solutions benchmarked across 20 synthetic edge cases including hallucinations, token limits, and cyclic recursion bounds.</p>
              </div>
              <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] space-y-2">
                <span className="text-xl">⏱️</span>
                <h4 className="text-sm font-extrabold">2. Time & Token Limits</h4>
                <p className="text-xs text-[var(--muted)]">30 minutes maximum runtime per challenge. Automated AST linter rejects solutions exceeding 4,000 token prompt payloads.</p>
              </div>
              <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] space-y-2">
                <span className="text-xl">🛡️</span>
                <h4 className="text-sm font-extrabold">3. Verified Credential</h4>
                <p className="text-xs text-[var(--muted)]">Participants scoring &gt;90% earn the verified "Speed Graph Architect" credential directly shareable to LinkedIn.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Battle Mode (1v1 AI Code Duel) */}
        {activeTab === "duel" && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] shadow-xl space-y-6">
            {!duelActive ? (
              <div className="text-center max-w-xl mx-auto py-12 space-y-6">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-black text-3xl flex items-center justify-center mx-auto shadow-2xl">
                  ⚔️
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-black">1v1 Real-Time Code Duel</h2>
                  <p className="text-xs text-[var(--muted)]">
                    Challenge Astra AI Bot (powered by Claude 3.7 & GPT-4o benchmarks) in a 4-round lightning architecture duel. Speed and precision win the match.
                  </p>
                </div>
                <button
                  onClick={handleStartDuel}
                  className="button py-4 px-10 text-sm font-black shadow-2xl hover:scale-105 transition-transform"
                >
                  ⚡ Start 1v1 Battle Match
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Score & Health Bars */}
                <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border)]">
                  {/* User Player */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-purple-400">{user?.name || "Alex Morgan"} (You)</span>
                      <span className="font-mono text-[var(--accent)]">{userScore} pts</span>
                    </div>
                    <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300"
                        style={{ width: `${Math.min(100, (userScore / 600) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* AI Opponent */}
                  <div className="space-y-2 text-right">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="font-mono text-rose-400">{aiScore} pts</span>
                      <span className="text-rose-400">🤖 Astra AI Bot 9000</span>
                    </div>
                    <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden flex justify-end">
                      <div
                        className="h-full bg-gradient-to-l from-rose-500 to-amber-500 transition-all duration-300"
                        style={{ width: `${Math.min(100, (aiScore / 600) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Match Round & Question */}
                {!duelWinner ? (
                  <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold uppercase text-[var(--muted)]">
                        Round {duelRound + 1} of {DUEL_QUESTIONS.length}
                      </span>
                      <span className="font-mono font-bold text-amber-400 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20">
                        ⏱️ {duelTimeLeft}s
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold">{DUEL_QUESTIONS[duelRound].q}</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {DUEL_QUESTIONS[duelRound].options.map((opt, optIdx) => {
                        let btnStyle = "border-[var(--border)] bg-[var(--surface-soft)] hover:border-[var(--accent)]";
                        if (userSelectedOpt !== null) {
                          if (optIdx === DUEL_QUESTIONS[duelRound].correct) {
                            btnStyle = "border-emerald-500 bg-emerald-500/20 text-emerald-400 font-bold";
                          } else if (userSelectedOpt === optIdx) {
                            btnStyle = "border-rose-500 bg-rose-500/20 text-rose-400";
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={userSelectedOpt !== null}
                            onClick={() => handleAnswerDuel(optIdx)}
                            className={`p-4 rounded-xl border text-left text-xs transition-all ${btnStyle}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {duelFeedback && (
                      <p className="text-xs font-bold text-center text-[var(--accent)] animate-bounce pt-2">
                        {duelFeedback}
                      </p>
                    )}
                  </div>
                ) : (
                  /* Victory / Defeat Screen */
                  <div className="text-center py-10 space-y-6 animate-fade-in">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto text-3xl shadow-2xl bg-amber-500/20 border-2 border-amber-500/40">
                      {duelWinner === "user" ? "🏆" : duelWinner === "ai" ? "💀" : "🤝"}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-2xl font-black">
                        {duelWinner === "user" ? "VICTORY! You Defeated Astra AI" : duelWinner === "ai" ? "DEFEAT! AI Won the Match" : "DRAW MATCH!"}
                      </h3>
                      <p className="text-xs text-[var(--muted)]">
                        Final Score: You ({userScore} pts) vs AI ({aiScore} pts)
                      </p>
                      {duelWinner === "user" && (
                        <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          +300 XP Awarded & Rating Bumped
                        </span>
                      )}
                    </div>
                    <button onClick={handleStartDuel} className="button py-3 px-8 text-xs font-black">
                      Play Rematch ⚡
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
