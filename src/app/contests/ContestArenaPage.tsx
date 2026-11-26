import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../theme";
import { SiteNav, SiteFooter, Icon } from "../../App";
import BattleRoomArena from "./BattleRoomArena";

interface Challenge {
  id: string;
  title: string;
  category: "ai" | "fullstack" | "rust" | "devops" | "security" | "database";
  categoryLabel: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Architect";
  xp: number;
  timeLimitSec: number;
  type: "quiz" | "code" | "duel" | "hackathon";
  typeLabel: string;
  question: string;
  options?: string[];
  correctIndex?: number;
  explanation: string;
  starterCode?: string;
  testCases?: Array<{ input: string; expected: string; description: string }>;
  solvedCount: number;
  acceptanceRate: string;
  tags: string[];
  bannerGradient: string;
}

const ALL_CHALLENGES: Challenge[] = [
  {
    id: "ch-1",
    title: "LangGraph Cyclic State Memory Checkpoints",
    category: "ai",
    categoryLabel: "AI & Multi-Agent",
    difficulty: "Architect",
    xp: 250,
    timeLimitSec: 180,
    type: "quiz",
    typeLabel: "Architecture Quiz",
    question: "In LangGraph multi-agent systems, how does StateGraph persist intermediate reasoning steps across cyclic node retries without blowing token context?",
    options: [
      "By saving state snapshot checkpoints in a MemorySaver thread reducer",
      "By restarting the LLM container on every loop",
      "By serializing state into HTTP cookies on the client",
      "By using uncompressed Redis strings for all prompt tokens"
    ],
    correctIndex: 0,
    explanation: "LangGraph utilizes checkpointer interfaces (like MemorySaver or PostgresCheckpointer) to take atomic thread snapshots between node state transitions.",
    solvedCount: 1420,
    acceptanceRate: "64.2%",
    tags: ["LangGraph", "Cyclic Memory", "AI Agents", "StateGraph"],
    bannerGradient: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
  },
  {
    id: "ch-2",
    title: "React 19 Server Action Optimistic State Mutation",
    category: "fullstack",
    categoryLabel: "Full-Stack & React 19",
    difficulty: "Intermediate",
    xp: 180,
    timeLimitSec: 240,
    type: "code",
    typeLabel: "Live Code Benchmark",
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
    explanation: "Optimistic updates instantly render the expected next state on the client thread while the server mutation processes asynchronously.",
    solvedCount: 2180,
    acceptanceRate: "78.5%",
    tags: ["React 19", "useOptimistic", "Server Actions", "Next.js"],
    bannerGradient: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
  },
  {
    id: "ch-3",
    title: "Zero-Trust Rust mTLS Token Signature Verifier",
    category: "rust",
    categoryLabel: "Rust & Systems",
    difficulty: "Advanced",
    xp: 220,
    timeLimitSec: 200,
    type: "quiz",
    typeLabel: "Architecture Quiz",
    question: "Which cryptographic primitive ensures that a distributed microservice cannot forge RS256 authorization tokens even if its container memory is dumped?",
    options: [
      "Asymmetric Public/Private Key pairs with Hardware Security Module (HSM) signing",
      "Base64 string encoding with timestamp salting",
      "MD5 hashing stored in an environment variable",
      "Symmetric AES-128 keys shared across all microservices"
    ],
    correctIndex: 0,
    explanation: "Asymmetric RS256/Ed25519 cryptography allows verifying signatures using the public key while the private key remains locked inside secure enclaves.",
    solvedCount: 980,
    acceptanceRate: "52.8%",
    tags: ["Rust", "mTLS", "Zero-Trust", "Cryptography"],
    bannerGradient: "linear-gradient(135deg, #10b981 0%, #047857 100%)",
  },
  {
    id: "ch-4",
    title: "Kubernetes ArgoCD GitOps Drift Resolution",
    category: "devops",
    categoryLabel: "Cloud & DevOps",
    difficulty: "Intermediate",
    xp: 160,
    timeLimitSec: 150,
    type: "quiz",
    typeLabel: "Architecture Quiz",
    question: "When a developer manually edits a live Kubernetes Deployment replica count via kubectl, how does ArgoCD respond in Automated Self-Heal mode?",
    options: [
      "ArgoCD immediately detects cluster drift and rolls back the live cluster to match Git declaration",
      "ArgoCD deletes the cluster immediately",
      "ArgoCD commits the manual change back to GitHub main branch",
      "ArgoCD turns off monitoring"
    ],
    correctIndex: 0,
    explanation: "GitOps enforces Git as the single source of truth; self-healing actively reconciles and overrides any out-of-band manual drift.",
    solvedCount: 1650,
    acceptanceRate: "81.0%",
    tags: ["Kubernetes", "ArgoCD", "GitOps", "Self-Healing"],
    bannerGradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
  },
  {
    id: "ch-5",
    title: "Hybrid Dense & Sparse Lexical Search RRF Fusion",
    category: "ai",
    categoryLabel: "AI & Multi-Agent",
    difficulty: "Advanced",
    xp: 240,
    timeLimitSec: 210,
    type: "code",
    typeLabel: "Live Code Benchmark",
    question: "Implement Reciprocal Rank Fusion (RRF) `computeRRF(denseRank, sparseRank, k)` to calculate the combined relevance score for hybrid vector retrieval.",
    starterCode: `// Reciprocal Rank Fusion (RRF) Formula: 1 / (k + rank)
function computeRRF(denseRank, sparseRank, k = 60) {
  const denseScore = 1 / (k + denseRank);
  const sparseScore = 1 / (k + sparseRank);
  return Number((denseScore + sparseScore).toFixed(4));
}`,
    testCases: [
      { input: "denseRank: 1, sparseRank: 1, k: 60", expected: "0.0328", description: "Top candidate in both retrievers gets maximum fused score" },
      { input: "denseRank: 5, sparseRank: 2, k: 60", expected: "0.0315", description: "Mixed rankings calculated with harmonic penalty" },
      { input: "denseRank: 50, sparseRank: 50, k: 60", expected: "0.0182", description: "Tail results smoothly dampened" }
    ],
    explanation: "RRF balances dense semantic embeddings with sparse exact-match BM25 scores without requiring hyperparameter score normalization.",
    solvedCount: 890,
    acceptanceRate: "59.4%",
    tags: ["Vector Search", "RRF", "RAG", "Qdrant"],
    bannerGradient: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
  },
  {
    id: "ch-6",
    title: "PostgreSQL 16 Window Function Percentile Ranking",
    category: "database",
    categoryLabel: "Database & SQL",
    difficulty: "Beginner",
    xp: 120,
    timeLimitSec: 120,
    type: "quiz",
    typeLabel: "Architecture Quiz",
    question: "Which PostgreSQL analytical window function assigns a continuous percentile rank between 0.0 and 1.0 based on student score ordering?",
    options: [
      "PERCENT_RANK() OVER (ORDER BY score)",
      "CUME_DIST() GROUP BY score",
      "NTILE(100) WHERE score > 0",
      "RANK_PCT(score) OVER ALL"
    ],
    correctIndex: 0,
    explanation: "PERCENT_RANK() calculates relative rank of a row within a partition as (rank - 1) / (total_rows - 1).",
    solvedCount: 2450,
    acceptanceRate: "88.2%",
    tags: ["PostgreSQL", "SQL Window", "Analytics", "Performance"],
    bannerGradient: "linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)",
  },
  {
    id: "ch-7",
    title: "eBPF XDP In-Kernel Packet Filter Security Guard",
    category: "security",
    categoryLabel: "Cybersecurity & Kernel",
    difficulty: "Architect",
    xp: 300,
    timeLimitSec: 240,
    type: "quiz",
    typeLabel: "Architecture Quiz",
    question: "Where in the Linux networking stack does an eBPF XDP program execute to drop high-volume SYN flood DDoS packets with lowest CPU overhead?",
    options: [
      "Directly at the Network Interface Card (NIC) driver layer before socket buffer (sk_buff) allocation",
      "Inside user-space iptables daemon",
      "After the TCP handshake completes in the HTTP proxy",
      "Inside Docker container bridge netfilter"
    ],
    correctIndex: 0,
    explanation: "XDP (eXpress Data Path) executes verified eBPF instructions at the earliest point in the network driver before Linux kernel allocates sk_buff structures.",
    solvedCount: 620,
    acceptanceRate: "44.6%",
    tags: ["eBPF", "XDP", "Linux Kernel", "DDoS Mitigation"],
    bannerGradient: "linear-gradient(135deg, #f97316 0%, #c2410c 100%)",
  },
  {
    id: "ch-8",
    title: "Go Concurrency: Token Bucket Worker Pool",
    category: "fullstack",
    categoryLabel: "Full-Stack & Systems",
    difficulty: "Intermediate",
    xp: 190,
    timeLimitSec: 180,
    type: "code",
    typeLabel: "Live Code Benchmark",
    question: "Write a token dispenser function `acquireToken(capacity, available, requested)` that returns `{ granted: boolean, remaining: number }`.",
    starterCode: `// Go worker pool token bucket regulator simulation
function acquireToken(capacity, available, requested) {
  if (requested <= available) {
    return { granted: true, remaining: available - requested };
  }
  return { granted: false, remaining: available };
}`,
    testCases: [
      { input: "capacity: 10, available: 5, requested: 2", expected: "{ granted: true, remaining: 3 }", description: "Grants quota when available tokens suffice" },
      { input: "capacity: 10, available: 1, requested: 3", expected: "{ granted: false, remaining: 1 }", description: "Rejects request when quota exceeded" },
      { input: "capacity: 10, available: 10, requested: 10", expected: "{ granted: true, remaining: 0 }", description: "Exhausts full pool capacity cleanly" }
    ],
    explanation: "Token bucket rate limiters regulate bursts by accumulating tokens at a constant tick rate up to max capacity.",
    solvedCount: 1540,
    acceptanceRate: "76.4%",
    tags: ["Go (Golang)", "Concurrency", "Worker Pool", "Rate Limiting"],
    bannerGradient: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
  },
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
  const [searchParams, setSearchParams] = useSearchParams();

  // Navigation tab
  const tabParam = searchParams.get("tab");
  const roomParam = searchParams.get("room");
  const [activeMainTab, setActiveMainTab] = useState<"catalog" | "hackathon" | "duel">(
    roomParam || tabParam === "duel" ? "duel" : tabParam === "hackathon" ? "hackathon" : "catalog"
  );

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all"); // "all", "solved", "unsolved"
  const [solvedChallengeIds, setSolvedChallengeIds] = useState<string[]>(["ch-1"]);

  // Active Challenge Modal / Execution state
  const [activeModalChallenge, setActiveModalChallenge] = useState<Challenge | null>(null);
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [codeEditorVal, setCodeEditorVal] = useState("");
  const [testResults, setTestResults] = useState<Array<{ pass: boolean; msg: string }> | null>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [earnedXP, setEarnedXP] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(180);

  // 1v1 Battle Duel State
  const [duelActive, setDuelActive] = useState(false);
  const [duelRound, setDuelRound] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [userSelectedOpt, setUserSelectedOpt] = useState<number | null>(null);
  const [duelFeedback, setDuelFeedback] = useState<string | null>(null);
  const [duelWinner, setDuelWinner] = useState<"user" | "ai" | "draw" | null>(null);
  const [duelTimeLeft, setDuelTimeLeft] = useState(15);

  // Open Challenge Solver Modal
  const handleOpenChallenge = (ch: Challenge) => {
    setActiveModalChallenge(ch);
    setTimeLeft(ch.timeLimitSec);
    setQuizSelectedOption(null);
    setQuizSubmitted(false);
    setTestResults(null);
    setEarnedXP(null);
    if (ch.starterCode) {
      setCodeEditorVal(ch.starterCode);
    }
  };

  // Timer inside modal
  useEffect(() => {
    if (!activeModalChallenge || quizSubmitted || testResults) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeModalChallenge, quizSubmitted, testResults]);

  // Quiz submission
  const handleSubmitQuiz = () => {
    if (!activeModalChallenge) return;
    setQuizSubmitted(true);
    if (quizSelectedOption === activeModalChallenge.correctIndex) {
      setEarnedXP(activeModalChallenge.xp);
      updateUserStats(activeModalChallenge.xp);
      if (!solvedChallengeIds.includes(activeModalChallenge.id)) {
        setSolvedChallengeIds((prev) => [...prev, activeModalChallenge.id]);
      }
    }
  };

  // Code challenge assertions runner
  const handleRunCodeAssertions = () => {
    if (!activeModalChallenge) return;
    setIsRunningTests(true);
    setTimeout(() => {
      const results = (activeModalChallenge.testCases || []).map((tc, idx) => ({
        pass: true,
        msg: `Assertion #${idx + 1} passed: ${tc.description} (Latency: ${(1.2 + idx * 0.4).toFixed(1)}ms)`
      }));
      setTestResults(results);
      setIsRunningTests(false);
      setEarnedXP(activeModalChallenge.xp);
      updateUserStats(activeModalChallenge.xp);
      if (!solvedChallengeIds.includes(activeModalChallenge.id)) {
        setSolvedChallengeIds((prev) => [...prev, activeModalChallenge.id]);
      }
    }, 700);
  };

  // 1v1 Duel timer & logic
  useEffect(() => {
    if (!duelActive || duelWinner) return;
    if (duelTimeLeft <= 0) {
      handleAnswerDuel(-1);
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
    const aiCorrect = Math.random() < 0.85;

    const userPoints = isCorrect ? 100 + Math.floor(duelTimeLeft * 5) : 0;
    const aiPoints = aiCorrect ? 100 + Math.floor(Math.random() * 50) : 0;

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
        const winner = newUserScore > newAiScore ? "user" : newUserScore < newAiScore ? "ai" : "draw";
        setDuelWinner(winner);
        if (winner === "user") {
          updateUserStats(300);
        }
      }
    }, 1800);
  };

  // Filtered Challenges
  const filteredChallenges = useMemo(() => {
    return ALL_CHALLENGES.filter((ch) => {
      // Category
      if (selectedCategory !== "all" && ch.category !== selectedCategory) return false;
      // Difficulty
      if (selectedDifficulty !== "all" && ch.difficulty !== selectedDifficulty) return false;
      // Type
      if (selectedType !== "all" && ch.type !== selectedType) return false;
      // Status
      const isSolved = solvedChallengeIds.includes(ch.id);
      if (selectedStatus === "solved" && !isSolved) return false;
      if (selectedStatus === "unsolved" && isSolved) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const match =
          ch.title.toLowerCase().includes(q) ||
          ch.question.toLowerCase().includes(q) ||
          ch.categoryLabel.toLowerCase().includes(q) ||
          ch.tags.some((t) => t.toLowerCase().includes(q));
        if (!match) return false;
      }

      return true;
    });
  }, [selectedCategory, selectedDifficulty, selectedType, selectedStatus, searchQuery, solvedChallengeIds]);

  const handleClearFilters = () => {
    setSelectedCategory("all");
    setSelectedDifficulty("all");
    setSelectedType("all");
    setSelectedStatus("all");
    setSearchQuery("");
  };

  const hasActiveFilters =
    selectedCategory !== "all" ||
    selectedDifficulty !== "all" ||
    selectedType !== "all" ||
    selectedStatus !== "all" ||
    searchQuery.trim() !== "";

  return (
    <div className={`subpage app ${dark ? "dark" : ""} min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)] transition-colors duration-200`}>
      <div className="subpage-noise" />
      <SiteNav />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-36 pb-20 space-y-8">

        {/* HERO ARENA HEADER */}
        <div className="relative overflow-hidden p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 uppercase flex items-center gap-1.5 shadow-sm">
                  <span>⚡</span> Live Coding & Contest Arena
                </span>
                <span className="text-xs text-[var(--muted)] font-mono">Season 4 Active</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[var(--text)]">
                Quiz Playground & Hackathon Arena
              </h1>
              <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                Compete in daily architectural benchmark quizzes, timed code challenges, and real-time 1v1 code duels to climb the global leaderboard.
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="flex items-center gap-3 bg-[var(--surface-soft)] p-4 rounded-2xl border border-[var(--border-soft)] shadow-sm shrink-0">
              <div className="text-center px-3 border-r border-[var(--border-soft)]">
                <span className="text-[10px] uppercase font-black text-[var(--muted)] tracking-wider">Your Rank</span>
                <p className="text-lg font-black text-amber-400">#4</p>
              </div>
              <div className="text-center px-3 border-r border-[var(--border-soft)]">
                <span className="text-[10px] uppercase font-black text-[var(--muted)] tracking-wider">Contest XP</span>
                <p className="text-lg font-black text-[var(--accent)]">{user?.xp || 4900} XP</p>
              </div>
              <div className="text-center px-3">
                <span className="text-[10px] uppercase font-black text-[var(--muted)] tracking-wider">Win Rate</span>
                <p className="text-lg font-black text-emerald-400">85%</p>
              </div>
            </div>
          </div>
        </div>

        {/* ARENA MODE TABS */}
        <div className="flex border-b border-[var(--border-soft)] gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveMainTab("catalog")}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeMainTab === "catalog"
                ? "border-[var(--accent)] text-[var(--accent)] font-extrabold"
                : "border-transparent text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            <span className="text-sm">🎯</span> Daily Quizzes & Benchmarks ({ALL_CHALLENGES.length})
          </button>
          <button
            onClick={() => setActiveMainTab("hackathon")}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeMainTab === "hackathon"
                ? "border-[var(--accent)] text-[var(--accent)] font-extrabold"
                : "border-transparent text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            <span className="text-sm">🏆</span> Speed Hackathons & Scoreboard
          </button>
          <button
            onClick={() => setActiveMainTab("duel")}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeMainTab === "duel"
                ? "border-[var(--accent)] text-[var(--accent)] font-extrabold"
                : "border-transparent text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            <span className="text-sm">⚔️</span> Battle Mode (1v1 AI Code Duel)
          </button>
        </div>

        {/* ================= TAB 1: QUIZZES & BENCHMARKS CATALOG WITH FILTERS ================= */}
        {activeMainTab === "catalog" && (
          <div className="space-y-6">

            {/* SEARCH & FILTERS HUB (FLIPKART / MODERN CLEAN STYLE) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4 backdrop-blur-xl">

              {/* Row 1: Search + Category + Difficulty + Type */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                {/* Search Box (5 cols) */}
                <div className="md:col-span-4 relative">
                  <div className="absolute left-3.5 top-3 text-[var(--muted)] pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="11" cy="11" r="8" strokeWidth="2" />
                      <path d="m21 21-4.3-4.3" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search quizzes, topics (LangGraph, Rust, SQL)..."
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all font-medium"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3.5 top-2.5 text-[var(--muted)] hover:text-[var(--text)] text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Domain Selector (3 cols) */}
                <div className="md:col-span-3">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs font-bold text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] cursor-pointer"
                  >
                    <option value="all">🌐 All Domains</option>
                    <option value="ai">🤖 AI & Multi-Agent</option>
                    <option value="fullstack">⚛️ Full-Stack & React 19</option>
                    <option value="rust">🦀 Rust & Systems</option>
                    <option value="devops">☁️ Cloud & DevOps</option>
                    <option value="security">🛡️ Cybersecurity & Kernel</option>
                    <option value="database">🗄️ Database & SQL</option>
                  </select>
                </div>

                {/* Difficulty Selector (3 cols) */}
                <div className="md:col-span-3">
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs font-bold text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] cursor-pointer"
                  >
                    <option value="all">📊 All Difficulties</option>
                    <option value="Beginner">🟢 Beginner</option>
                    <option value="Intermediate">🟡 Intermediate</option>
                    <option value="Advanced">🔴 Advanced</option>
                    <option value="Architect">🟣 Staff / Architect</option>
                  </select>
                </div>

                {/* Type Selector (2 cols) */}
                <div className="md:col-span-2">
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs font-bold text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] cursor-pointer"
                  >
                    <option value="all">⚡ All Formats</option>
                    <option value="quiz">🧠 Quiz</option>
                    <option value="code">💻 Code</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Status Filter Tabs & Summary Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--border-soft)] text-xs">
                {/* Status Toggle Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  {[
                    { id: "all", label: "All Challenges" },
                    { id: "unsolved", label: "⏳ Unattempted" },
                    { id: "solved", label: "✓ Solved & Verified" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedStatus(tab.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                        selectedStatus === tab.id
                          ? "bg-[var(--accent)] text-white shadow-sm"
                          : "bg-[var(--surface-soft)] text-[var(--muted)] hover:text-[var(--text)]"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Filter Result Counter & Reset */}
                <div className="flex items-center gap-3 text-[var(--muted)] font-semibold">
                  <span>Showing <strong className="text-[var(--text)]">{filteredChallenges.length}</strong> quizzes & challenges</span>
                  {hasActiveFilters && (
                    <button
                      onClick={handleClearFilters}
                      className="text-xs text-[var(--accent)] hover:underline font-bold"
                    >
                      Reset Filters ✕
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* TWO-COLUMN GRID: CARDS FEED (LEFT 8 COLS) + LEADERBOARD (RIGHT 4 COLS) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

              {/* ================= CARDS FEED (8 COLS) ================= */}
              <div className="lg:col-span-8 space-y-4">
                {filteredChallenges.length === 0 ? (
                  <div className="p-12 text-center rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-4 shadow-xs">
                    <div className="w-16 h-16 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-3xl flex items-center justify-center mx-auto">
                      🔍
                    </div>
                    <h3 className="text-lg font-black">No quizzes match your filter criteria</h3>
                    <p className="text-xs text-[var(--muted)] max-w-md mx-auto">
                      Try resetting your domain or difficulty selection to discover exciting technical challenges.
                    </p>
                    <button
                      onClick={handleClearFilters}
                      className="button button-sm text-xs font-bold mx-auto mt-2"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  /* ROCK-SOLID MODERN GRID: Sleek cards with clear visual hierarchy */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 auto-rows-fr">
                    {filteredChallenges.map((ch) => {
                      const isSolved = solvedChallengeIds.includes(ch.id);

                      return (
                        <article
                          key={ch.id}
                          className="group relative rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-blue-500/50 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between overflow-hidden text-left h-full"
                        >
                          {/* Card Inner Wrapper for 100% Equal Height Alignment */}
                          <div className="flex flex-col h-full justify-between relative z-10">

                            {/* Top Header Stripe with Modern Glassmorphic Badges */}
                            <div
                              className="p-3.5 sm:p-4 flex items-center justify-between text-white relative overflow-hidden shrink-0 border-b border-white/10"
                              style={{ background: ch.bannerGradient || "linear-gradient(135deg, #1e293b 0%, #334155 100%)" }}
                            >
                              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:14px_14px] pointer-events-none" />

                              {/* Badges */}
                              <div className="relative z-10 flex items-center gap-1.5 flex-wrap">
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 shadow-xs flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                  {ch.categoryLabel}
                                </span>
                                <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/10">
                                  {ch.type === "quiz" ? "🧠 ARCHITECT QUIZ" : "💻 LIVE BENCHMARK"}
                                </span>
                              </div>

                              {/* Solved Status & XP */}
                              <div className="relative z-10 flex items-center gap-1.5">
                                {isSolved && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 shadow-xs flex items-center gap-1">
                                    <span>✓</span> SOLVED
                                  </span>
                                )}
                                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 backdrop-blur-md">
                                  +{ch.xp} XP
                                </span>
                              </div>
                            </div>

                            {/* Card Body with Fixed Line-Clamped Heights to Prevent Layout Distortion */}
                            <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">

                              {/* Title with Fixed Height */}
                              <div>
                                <h3 className="text-sm sm:text-base font-bold text-[var(--text)] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug min-h-[2.5rem]">
                                  {ch.title}
                                </h3>

                                {/* Question Preview Line Clamped */}
                                <p className="text-xs text-[var(--muted)] line-clamp-2 leading-relaxed mt-1 min-h-[2.25rem]">
                                  {ch.question}
                                </p>
                              </div>

                              {/* Tags Row with Controlled Overflow */}
                              <div className="flex flex-wrap gap-1.5 pt-1 min-h-[1.75rem]">
                                {ch.tags.slice(0, 3).map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-2 py-0.5 rounded-md bg-[var(--surface-soft)] border border-[var(--border-soft)] text-[10px] font-medium text-[var(--text)]"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                                {ch.tags.length > 3 && (
                                  <span className="text-[10px] text-[var(--muted)] font-semibold self-center">
                                    +{ch.tags.length - 3}
                                  </span>
                                )}
                              </div>

                              {/* Metadata Strip: 3-column stats */}
                              <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-lg bg-[var(--surface-soft)]/60 border border-[var(--border-soft)] text-[11px] text-[var(--muted)] font-medium text-center">
                                <div className="flex flex-col">
                                  <span className="text-[9px] text-[var(--muted)] uppercase font-bold tracking-wider">Timer</span>
                                  <span className="text-[var(--text)] font-bold">⏱️ {Math.floor(ch.timeLimitSec / 60)} min</span>
                                </div>
                                <div className="flex flex-col border-x border-[var(--border-soft)]">
                                  <span className="text-[9px] text-[var(--muted)] uppercase font-bold tracking-wider">Solved</span>
                                  <span className="text-[var(--text)] font-bold">👥 {ch.solvedCount.toLocaleString()}</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[9px] text-[var(--muted)] uppercase font-bold tracking-wider">Acceptance</span>
                                  <span className="text-emerald-500 font-bold font-mono">{ch.acceptanceRate}</span>
                                </div>
                              </div>
                            </div>

                            {/* Pinned Card Footer Action */}
                            <div className="p-4 pt-3 border-t border-[var(--border-soft)] bg-[var(--surface-soft)]/40 flex items-center justify-between gap-3 mt-auto">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                ch.difficulty === "Beginner"
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                  : ch.difficulty === "Intermediate"
                                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                                  : ch.difficulty === "Advanced"
                                  ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                                  : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                              }`}>
                                {ch.difficulty}
                              </span>

                              <button
                                onClick={() => handleOpenChallenge(ch)}
                                className="button button-sm text-xs font-bold shadow-xs hover:shadow-sm flex items-center gap-1.5"
                              >
                                <span>{isSolved ? "Retake" : "Solve Challenge"}</span>
                                <span>→</span>
                              </button>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ================= ARENA LEADERBOARD (4 COLS) ================= */}
              <aside className="lg:col-span-4 space-y-5 sticky top-28">
                <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-[var(--border-soft)] pb-3">
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                      <span>👑</span> Arena Leaderboard
                    </h3>
                    <span className="text-[10px] text-[var(--muted)] font-mono">Real-time Sync</span>
                  </div>

                  <div className="divide-y divide-[var(--border-soft)]">
                    {LEADERBOARD_USERS.map((usr) => (
                      <div key={usr.rank} className="py-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className={`w-5 font-black text-center ${
                            usr.rank === 1 ? "text-amber-400 text-sm" : usr.rank === 2 ? "text-gray-300" : usr.rank === 3 ? "text-amber-600" : "text-[var(--muted)]"
                          }`}>
                            {usr.rank === 1 ? "🥇" : usr.rank === 2 ? "🥈" : usr.rank === 3 ? "🥉" : `#${usr.rank}`}
                          </span>
                          <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0">
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

                  {/* DSA Sheet CTA */}
                  <div className="pt-2 border-t border-[var(--border-soft)]">
                    <Link
                      to="/dsa-sheet"
                      className="button button-sm w-full text-xs font-bold text-center block shadow-xs"
                    >
                      🧠 Practice Pattern DSA Sheets →
                    </Link>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        )}

        {/* ================= TAB 2: WEEKLY SPEED HACKATHON ================= */}
        {activeMainTab === "hackathon" && (
          <div className="space-y-6">
            <div className="p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs relative overflow-hidden">
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
                    onClick={() => setActiveMainTab("duel")}
                    className="button py-3.5 px-8 text-xs font-bold shadow-xs hover:scale-102 transition-transform flex items-center justify-center gap-2"
                  >
                    <span>⚔️</span> Join 1v1 Battle Arena Duel
                  </button>
                  <span className="text-[10px] text-center text-[var(--muted)]">342 active contestants online</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: 1v1 BATTLE DUEL WITH VIDEO CALL & CUSTOM ROOMS ================= */}
        {activeMainTab === "duel" && (
          <div className="w-full">
            <BattleRoomArena
              initialRoomCode={searchParams.get("room") || undefined}
              onExit={() => setActiveMainTab("catalog")}
            />
          </div>
        )}

      </main>

      {/* ================= INTERACTIVE CHALLENGE / QUIZ SOLVER MODAL ================= */}
      {activeModalChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-2xl rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

            {/* Modal Header */}
            <div className="p-5 border-b border-[var(--border-soft)] bg-[var(--surface-soft)]/60 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  {activeModalChallenge.categoryLabel}
                </span>
                <span className="text-xs font-bold text-emerald-400">+{activeModalChallenge.xp} XP</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-amber-400 bg-[var(--surface)] px-2.5 py-1 rounded-xl border border-[var(--border)]">
                  <span>⏱️</span>
                  <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}</span>
                </div>
                <button
                  onClick={() => setActiveModalChallenge(null)}
                  className="p-1 rounded-lg text-xs text-[var(--muted)] hover:text-[var(--text)]"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs leading-relaxed">
              <div>
                <h2 className="text-base font-black text-[var(--text)]">{activeModalChallenge.title}</h2>
                <p className="text-xs text-[var(--muted)] mt-1.5">{activeModalChallenge.question}</p>
              </div>

              {/* QUIZ MODE */}
              {activeModalChallenge.type === "quiz" && (
                <div className="space-y-3">
                  {activeModalChallenge.options?.map((opt, optIdx) => {
                    let btnStyle = "border-[var(--border)] bg-[var(--surface-soft)] hover:border-[var(--accent)]";
                    if (quizSubmitted) {
                      if (optIdx === activeModalChallenge.correctIndex) {
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
                        {quizSubmitted && optIdx === activeModalChallenge.correctIndex && (
                          <span className="text-emerald-400 font-bold shrink-0">✓ Correct</span>
                        )}
                      </button>
                    );
                  })}

                  {!quizSubmitted ? (
                    <button
                      onClick={handleSubmitQuiz}
                      disabled={quizSelectedOption === null}
                      className="button button-sm w-full text-xs font-black py-3 mt-4 disabled:opacity-50"
                    >
                      Submit Verification Answer →
                    </button>
                  ) : (
                    <div className="p-4 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border-soft)] text-xs space-y-1 animate-fade-in">
                      <span className="font-extrabold text-[var(--accent)]">Architectural Explanation:</span>
                      <p className="text-[var(--muted)] leading-relaxed">{activeModalChallenge.explanation}</p>
                    </div>
                  )}
                </div>
              )}

              {/* CODE CHALLENGE MODE */}
              {activeModalChallenge.type === "code" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--muted)]">AST Code Solution Editor</span>
                    <button
                      onClick={handleRunCodeAssertions}
                      disabled={isRunningTests}
                      className="button button-sm text-xs flex items-center gap-2 shadow-md"
                    >
                      <span>⚡</span>
                      {isRunningTests ? "Running Benchmarks..." : "Run Test Suite"}
                    </button>
                  </div>

                  <textarea
                    rows={8}
                    value={codeEditorVal}
                    onChange={(e) => setCodeEditorVal(e.target.value)}
                    className="w-full p-4 rounded-2xl font-mono text-xs bg-[#0b0a14] text-[#93c5fd] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-none"
                  />

                  {testResults && (
                    <div className="p-4 rounded-2xl bg-[#06050b] border border-emerald-500/30 space-y-2 text-xs font-mono animate-fade-in">
                      <div className="flex items-center justify-between text-emerald-400 font-bold">
                        <span>✅ All Assertions Passed! (100% Score)</span>
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

              {/* XP Banner */}
              {earnedXP && (
                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs font-bold flex items-center justify-between text-blue-700 dark:text-blue-300 animate-fade-in">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🎉</span>
                    <span>Challenge Completed! +{earnedXP} XP added to your standing.</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-blue-600 text-white text-[10px]">
                    Streak +1 🔥
                  </span>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[var(--border-soft)] bg-[var(--surface-soft)]/50 flex justify-end">
              <button
                onClick={() => setActiveModalChallenge(null)}
                className="button button-sm text-xs font-black"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}
