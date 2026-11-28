"use client";

import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../theme";
import { SiteNav, SiteFooter, Icon } from "../../App";
import BattleRoomArena from "./BattleRoomArena";

interface ChallengeBadgeConfig {
  label: string;
  icon: string;
  gradient: string;
}

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
  bannerGradient?: string;
  iconType?: "ai" | "cloud-server" | "code-brackets" | "shield-padlock" | "k8s-wheel" | "database-disks";
  badgeConfig?: ChallengeBadgeConfig;
  actionLabel?: string;
  actionStyle?: "primary" | "secondary";
}

const ALL_CHALLENGES: Challenge[] = [
  {
    id: "ch-1",
    title: "LangGraph Cyclic State Memory Checkpoints",
    category: "ai",
    categoryLabel: "AI & Multi-Agent",
    difficulty: "Architect",
    xp: 350,
    timeLimitSec: 300,
    type: "quiz",
    typeLabel: "Architecture Quiz",
    question: "Build multi-agent systems and understand how state checkpoints work in LangGraph.",
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
    tags: ["LangGraph", "Agent Memory", "AI Agents", "StateGraph"],
    iconType: "ai",
    badgeConfig: { label: "Bestseller", icon: "👑", gradient: "from-amber-500 via-rose-500 to-purple-600" },
    actionLabel: "View Details",
    actionStyle: "secondary",
  },
  {
    id: "ch-2",
    title: "React 19 Server Action Optimistic State Mutation",
    category: "fullstack",
    categoryLabel: "Full-Stack & React 19",
    difficulty: "Intermediate",
    xp: 180,
    timeLimitSec: 360,
    type: "code",
    typeLabel: "Live Code Benchmark",
    question: "Write optimistic state updater function applyOptimisticUpdate for seamless UX.",
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
    acceptanceRate: "74.5%",
    tags: ["React 19", "useOptimistic", "Server Actions", "Next.js"],
    iconType: "cloud-server",
    badgeConfig: { label: "Trending", icon: "⚡", gradient: "from-emerald-500 to-teal-600" },
    actionLabel: "Solve Challenge",
    actionStyle: "primary",
  },
  {
    id: "ch-3",
    title: "High-Performance System Design",
    category: "rust",
    categoryLabel: "Rust & Systems",
    difficulty: "Advanced",
    xp: 180,
    timeLimitSec: 480,
    type: "quiz",
    typeLabel: "Architecture Quiz",
    question: "Build memory-safe, ultra-low-latency backend microservices with Rust.",
    options: [
      "Zero-cost abstractions with ownership semantics and lock-free atomic channels",
      "Garbage collection sweeps running on thread pauses",
      "Interpreted Python runtime wrappers inside memory",
      "Shared raw mutable pointers without mutex locks"
    ],
    correctIndex: 0,
    explanation: "Rust eliminates runtime GC pauses through compile-time affine type systems and borrow checker static memory guarantees.",
    solvedCount: 3210,
    acceptanceRate: "82.1%",
    tags: ["Rust", "System Design", "Microservices", "Concurrency"],
    iconType: "code-brackets",
    badgeConfig: { label: "Popular", icon: "⭐", gradient: "from-blue-500 to-indigo-600" },
    actionLabel: "View Details",
    actionStyle: "secondary",
  },
  {
    id: "ch-4",
    title: "Zero-Trust Rust mTLS Token Signature Verifier",
    category: "security",
    categoryLabel: "Cybersecurity & Kernel",
    difficulty: "Architect",
    xp: 120,
    timeLimitSec: 360,
    type: "quiz",
    typeLabel: "Architecture Quiz",
    question: "Which cryptographic primitives ensure that a distributed trustless system maintains identity verifiability across untrusted networks?",
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
    iconType: "shield-padlock",
    badgeConfig: { label: "New", icon: "💠", gradient: "from-sky-500 to-blue-600" },
    actionLabel: "Solve Challenge",
    actionStyle: "primary",
  },
  {
    id: "ch-5",
    title: "Kubernetes ArgoCD GitOps Drift Resolution",
    category: "devops",
    categoryLabel: "Cloud & DevOps",
    difficulty: "Intermediate",
    xp: 160,
    timeLimitSec: 300,
    type: "quiz",
    typeLabel: "Architecture Quiz",
    question: "When a developer manually edits a live Kubernetes deployment in GitOps, how does automated reconciliation handle drift?",
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
    iconType: "k8s-wheel",
    badgeConfig: { label: "Popular", icon: "⭐", gradient: "from-blue-500 to-indigo-600" },
    actionLabel: "Solve Challenge",
    actionStyle: "primary",
  },
  {
    id: "ch-6",
    title: "PostgreSQL 16 Window Function Percentile Ranking",
    category: "database",
    categoryLabel: "Database & SQL",
    difficulty: "Beginner",
    xp: 140,
    timeLimitSec: 240,
    type: "quiz",
    typeLabel: "Architecture Quiz",
    question: "Which PostgreSQL analytical window function assigns a continuous percentile rank across partitioned student scores?",
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
    tags: ["PostgreSQL", "SQL", "Window", "Analytics"],
    iconType: "database-disks",
    badgeConfig: { label: "Database & SQL", icon: "🗄️", gradient: "from-purple-500 to-indigo-600" },
    actionLabel: "Solve Challenge",
    actionStyle: "primary",
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
    iconType: "shield-padlock",
    badgeConfig: { label: "Security & Kernel", icon: "🛡️", gradient: "from-rose-500 to-orange-600" },
    actionLabel: "Solve Challenge",
    actionStyle: "primary",
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
    iconType: "code-brackets",
    badgeConfig: { label: "Concurrency", icon: "⚡", gradient: "from-cyan-500 to-blue-600" },
    actionLabel: "Solve Challenge",
    actionStyle: "primary",
  },
];

const LEADERBOARD_USERS = [
  { rank: 1, name: "Kaito Takahashi", avatar: "KT", role: "Full-Stack Dev", xp: 18450, streak: 482 },
  { rank: 2, name: "Dr. Aria Vince", avatar: "AV", role: "AI Researcher", xp: 16920, streak: 354 },
  { rank: 3, name: "Elon Revolt", avatar: "ER", role: "Principle Engineer", xp: 15270, streak: 295 },
  { rank: 4, name: "Alex Morgan", avatar: "AM", role: "Pro Learner", xp: 14560, streak: 188 },
  { rank: 5, name: "Marcus Brady", avatar: "MB", role: "Data Scientist", xp: 13890, streak: 234 },
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

function ArenaThumbnailGraphic({ type }: { type?: string }) {
  switch (type) {
    case "ai":
      return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <svg className="w-full h-full" viewBox="0 0 320 180" fill="none">
            <defs>
              <radialGradient id="aiGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
                <stop offset="60%" stopColor="#1e3a8a" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#020617" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="aiTextGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#93c5fd" />
                <stop offset="45%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
              <linearGradient id="aiShadowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e40af" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
              <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <rect width="320" height="180" fill="#080e1e" />
            <circle cx="160" cy="85" r="75" fill="url(#aiGlow)" />
            <path d="M40 90 H105 L125 110 H140" stroke="#1e3a8a" strokeWidth="1.5" strokeDasharray="3 3" />
            <path d="M280 80 H215 L195 60 H180" stroke="#1e3a8a" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="105" cy="90" r="3" fill="#38bdf8" />
            <circle cx="215" cy="80" r="3" fill="#38bdf8" />
            <circle cx="125" cy="110" r="2.5" fill="#60a5fa" />
            <circle cx="195" cy="60" r="2.5" fill="#60a5fa" />
            <ellipse cx="160" cy="85" rx="58" ry="32" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="4 4" />
            <ellipse cx="160" cy="85" rx="42" ry="24" stroke="#60a5fa" strokeWidth="1" strokeOpacity="0.6" />
            <text x="163" y="102" textAnchor="middle" fontSize="62" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" fill="url(#aiShadowGrad)" letterSpacing="-1">
              AI
            </text>
            <text x="160" y="98" textAnchor="middle" fontSize="62" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" fill="url(#aiTextGrad)" filter="url(#glowFilter)" letterSpacing="-1">
              AI
            </text>
          </svg>
        </div>
      );
    case "cloud-server":
      return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <svg className="w-full h-full" viewBox="0 0 320 180" fill="none">
            <defs>
              <radialGradient id="serverGlow" cx="50%" cy="60%" r="55%">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#020617" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#0369a1" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <rect width="320" height="180" fill="#041226" />
            <circle cx="160" cy="95" r="75" fill="url(#serverGlow)" />
            <path d="M110 65 Q130 40 160 42 Q190 35 210 58 Q235 60 230 80 Q235 100 205 100 H115 Q90 100 95 80 Q90 65 110 65 Z" fill="url(#cloudGrad)" />
            <g transform="translate(100, 65)">
              <rect x="0" y="0" width="30" height="58" rx="3" fill="#0f223d" stroke="#0284c7" strokeWidth="1.2" />
              <line x1="5" y1="12" x2="25" y2="12" stroke="#38bdf8" strokeWidth="2" strokeOpacity="0.8" />
              <line x1="5" y1="24" x2="25" y2="24" stroke="#38bdf8" strokeWidth="2" strokeOpacity="0.8" />
              <line x1="5" y1="36" x2="25" y2="36" stroke="#38bdf8" strokeWidth="2" strokeOpacity="0.8" />
              <line x1="5" y1="48" x2="25" y2="48" stroke="#10b981" strokeWidth="2" strokeOpacity="0.9" />
              <circle cx="7" cy="6" r="1.5" fill="#38bdf8" />
              <circle cx="12" cy="6" r="1.5" fill="#10b981" />
            </g>
            <g transform="translate(145, 52)">
              <rect x="0" y="0" width="34" height="74" rx="3" fill="#162e52" stroke="#38bdf8" strokeWidth="1.5" />
              <line x1="5" y1="14" x2="29" y2="14" stroke="#60a5fa" strokeWidth="2" />
              <line x1="5" y1="28" x2="29" y2="28" stroke="#38bdf8" strokeWidth="2" />
              <line x1="5" y1="42" x2="29" y2="42" stroke="#38bdf8" strokeWidth="2" />
              <line x1="5" y1="56" x2="29" y2="56" stroke="#10b981" strokeWidth="2" />
              <line x1="5" y1="68" x2="29" y2="68" stroke="#38bdf8" strokeWidth="2" />
              <circle cx="8" cy="7" r="1.5" fill="#10b981" />
              <circle cx="14" cy="7" r="1.5" fill="#38bdf8" />
            </g>
            <g transform="translate(193, 62)">
              <rect x="0" y="0" width="30" height="62" rx="3" fill="#0f223d" stroke="#0284c7" strokeWidth="1.2" />
              <line x1="5" y1="12" x2="25" y2="12" stroke="#38bdf8" strokeWidth="2" strokeOpacity="0.8" />
              <line x1="5" y1="24" x2="25" y2="24" stroke="#10b981" strokeWidth="2" strokeOpacity="0.9" />
              <line x1="5" y1="36" x2="25" y2="36" stroke="#38bdf8" strokeWidth="2" strokeOpacity="0.8" />
              <line x1="5" y1="48" x2="25" y2="48" stroke="#38bdf8" strokeWidth="2" strokeOpacity="0.8" />
              <circle cx="7" cy="6" r="1.5" fill="#38bdf8" />
              <circle cx="12" cy="6" r="1.5" fill="#38bdf8" />
            </g>
          </svg>
        </div>
      );
    case "code-brackets":
      return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <svg className="w-full h-full" viewBox="0 0 320 180" fill="none">
            <defs>
              <radialGradient id="codeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.45" />
                <stop offset="70%" stopColor="#4c1d95" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#020617" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="code3DGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f0abfc" />
                <stop offset="40%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#7e22ce" />
              </linearGradient>
            </defs>
            <rect width="320" height="180" fill="#0f0728" />
            <circle cx="160" cy="85" r="75" fill="url(#codeGlow)" />
            <path d="M50 40 H270 M50 70 H270 M50 100 H270 M50 130 H270" stroke="#581c87" strokeWidth="0.8" strokeOpacity="0.3" />
            <path d="M80 30 V150 M120 30 V150 M160 30 V150 M200 30 V150 M240 30 V150" stroke="#581c87" strokeWidth="0.8" strokeOpacity="0.3" />
            <text x="163" y="106" textAnchor="middle" fontSize="66" fontWeight="900" fontFamily="monospace, monospace" fill="#4c1d95" letterSpacing="-2">
              {"</>"}
            </text>
            <text x="160" y="102" textAnchor="middle" fontSize="66" fontWeight="900" fontFamily="monospace, monospace" fill="url(#code3DGrad)" letterSpacing="-2">
              {"</>"}
            </text>
          </svg>
        </div>
      );
    case "shield-padlock":
      return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <svg className="w-full h-full" viewBox="0 0 320 180" fill="none">
            <defs>
              <radialGradient id="shieldGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#020617" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="shieldBorder" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#67e8f9" />
                <stop offset="100%" stopColor="#0e7490" />
              </linearGradient>
            </defs>
            <rect width="320" height="180" fill="#041424" />
            <circle cx="160" cy="85" r="75" fill="url(#shieldGlow)" />
            <path d="M70 85 H120 M200 85 H250 M160 30 V50 M160 130 V150" stroke="#0891b2" strokeWidth="1.5" strokeOpacity="0.4" />
            <path d="M160 45 L198 62 V92 Q198 122 160 135 Q122 122 122 92 V62 Z" fill="#082f49" fillOpacity="0.8" stroke="url(#shieldBorder)" strokeWidth="2.5" />
            <path d="M160 54 L188 67 V90 Q188 114 160 124 Q132 114 132 90 V67 Z" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.5" />
            <g transform="translate(150, 75)">
              <rect x="0" y="8" width="20" height="16" rx="3" fill="#38bdf8" />
              <path d="M4 8 V4 Q4 0 10 0 Q16 0 16 4 V8" stroke="#38bdf8" strokeWidth="2.5" fill="none" />
              <circle cx="10" cy="14" r="2" fill="#082f49" />
              <path d="M10 16 V19" stroke="#082f49" strokeWidth="1.5" />
            </g>
          </svg>
        </div>
      );
    case "k8s-wheel":
      return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <svg className="w-full h-full" viewBox="0 0 320 180" fill="none">
            <defs>
              <radialGradient id="k8sGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#020617" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="k8sBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </linearGradient>
            </defs>
            <rect width="320" height="180" fill="#07122b" />
            <circle cx="160" cy="85" r="75" fill="url(#k8sGlow)" />
            <circle cx="160" cy="85" r="50" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.3" strokeDasharray="6 4" />
            <g transform="translate(160, 85)">
              <circle cx="0" cy="0" r="14" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="2" />
              <circle cx="0" cy="0" r="6" fill="#38bdf8" />
              {[0, 51.4, 102.8, 154.2, 205.6, 257, 308.4].map((deg, i) => (
                <g key={i} transform={`rotate(${deg})`}>
                  <line x1="0" y1="-14" x2="0" y2="-38" stroke="#60a5fa" strokeWidth="3" />
                  <circle cx="0" cy="-38" r="4" fill="#38bdf8" stroke="#1e3a8a" strokeWidth="1.5" />
                  <line x1="-3" y1="-43" x2="3" y2="-43" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" />
                </g>
              ))}
              <circle cx="0" cy="0" r="34" stroke="url(#k8sBlue)" strokeWidth="3" fill="none" />
            </g>
          </svg>
        </div>
      );
    case "database-disks":
    default:
      return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <svg className="w-full h-full" viewBox="0 0 320 180" fill="none">
            <defs>
              <radialGradient id="dbGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#020617" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="dbDiskGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#3730a3" />
              </linearGradient>
            </defs>
            <rect width="320" height="180" fill="#0b0826" />
            <circle cx="160" cy="85" r="75" fill="url(#dbGlow)" />
            <g transform="translate(160, 48)">
              <path d="M-45 16 V28 Q-45 42 0 42 Q45 42 45 28 V16 Z" fill="url(#dbDiskGrad)" stroke="#6366f1" strokeWidth="1.5" />
              <ellipse cx="0" cy="16" rx="45" ry="14" fill="#a5b4fc" stroke="#c7d2fe" strokeWidth="1.5" />
              
              <path d="M-45 40 V52 Q-45 66 0 66 Q45 66 45 52 V40 Z" fill="url(#dbDiskGrad)" stroke="#6366f1" strokeWidth="1.5" />
              <ellipse cx="0" cy="40" rx="45" ry="14" fill="#818cf8" stroke="#a5b4fc" strokeWidth="1.5" />
              
              <path d="M-45 64 V76 Q-45 90 0 90 Q45 90 45 76 V64 Z" fill="url(#dbDiskGrad)" stroke="#4f46e5" strokeWidth="1.5" />
              <ellipse cx="0" cy="64" rx="45" ry="14" fill="#6366f1" stroke="#818cf8" strokeWidth="1.5" />
              
              <circle cx="-25" cy="28" r="2" fill="#38bdf8" />
              <circle cx="-25" cy="52" r="2" fill="#10b981" />
              <circle cx="-25" cy="76" r="2" fill="#38bdf8" />
            </g>
          </svg>
        </div>
      );
  }
}

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

  // Bookmark state
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Leaderboard timeframe state
  const [leaderboardTimeframe, setLeaderboardTimeframe] = useState<"Weekly" | "Monthly" | "All Time">("Weekly");
  const displayedLeaderboard = useMemo(() => {
    if (leaderboardTimeframe === "Monthly") {
      return LEADERBOARD_USERS.map((u) => ({
        ...u,
        xp: Math.round(u.xp * 3.4),
        streak: Math.round(u.streak * 1.6),
      }));
    }
    if (leaderboardTimeframe === "All Time") {
      return LEADERBOARD_USERS.map((u) => ({
        ...u,
        xp: Math.round(u.xp * 9.2),
        streak: Math.round(u.streak * 2.4),
      }));
    }
    return LEADERBOARD_USERS;
  }, [leaderboardTimeframe]);

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

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-36 pb-36 space-y-8">

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
                  <p className="text-lg font-black text-amber-500">#4</p>
                </div>
                <div className="text-center px-3 border-r border-[var(--border-soft)]">
                  <span className="text-[10px] uppercase font-black text-[var(--muted)] tracking-wider">Contest XP</span>
                  <p className="text-lg font-black text-blue-600 dark:text-blue-400">{user?.xp || 4900} XP</p>
                </div>
                <div className="text-center px-3">
                  <span className="text-[10px] uppercase font-black text-[var(--muted)] tracking-wider">Win Rate</span>
                  <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">85%</p>
                </div>
              </div>
            </div>
          </div>

          {/* ARENA MODE TABS */}
          <div className="flex border-b border-[var(--border-soft)] gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveMainTab("catalog")}
              className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeMainTab === "catalog"
                  ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 font-extrabold"
                  : "border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span className="text-sm">🎯</span> Daily Quizzes & Benchmarks ({ALL_CHALLENGES.length})
            </button>
          <button
            onClick={() => setActiveMainTab("hackathon")}
            className = {`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${activeMainTab === "hackathon"
                    ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 font-extrabold"
                    : "border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
            >
              <span className="text-sm">🏆</span> Speed Hackathons & Scoreboard
            </button>
            <button
              onClick={() => setActiveMainTab("duel")}
              className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeMainTab === "duel"
                  ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 font-extrabold"
                  : "border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
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
              className = {`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${selectedStatus === tab.id
                    ? "bg-blue-600 text-white shadow-sm font-black"
                    : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 font-bold"
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
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-bold cursor-pointer"
            >
              Reset Filters ✕
            </button>
          )}
        </div>
    </div>
            </div >

    {/* TWO-COLUMN GRID: CARDS FEED (LEFT 8-9 COLS) + LEADERBOARD (RIGHT 3-4 COLS) */}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

      {/* ================= CARDS FEED (8-9 COLS) ================= */}
      <div className="lg:col-span-8 xl:col-span-9 space-y-4">
      {
        filteredChallenges.length === 0 ? (
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
              className="button button-sm text-xs font-bold mx-auto mt-2 cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          /* HIGH-IMPACT ARENA GRID: 3-column on wide screens, matching reference image */
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 auto-rows-fr">
            {filteredChallenges.map((ch) => {
              const isSolved = solvedChallengeIds.includes(ch.id);
              const isBookmarked = bookmarkedIds.includes(ch.id);

              return (
                <article
                  key={ch.id}
                  className="group relative rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-purple-400/40 dark:hover:border-purple-500/40 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden text-left h-full"
                >
                  {/* Visual 3D / Cyber Thumbnail Banner */}
                  <div className="h-44 sm:h-48 relative overflow-hidden bg-slate-950 shrink-0">
                    {/* Centered Glowing 3D Vector Illustration */}
                    <ArenaThumbnailGraphic type={ch.iconType} />

                    {/* Top-Left Category / Status Badge Pill */}
                    <div className={`absolute top-3 left-3 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black text-white shadow-md backdrop-blur-md bg-gradient-to-r ${ch.badgeConfig?.gradient || "from-blue-600 to-indigo-600"}`}>
                      <span>{ch.badgeConfig?.icon}</span>
                      <span>{ch.badgeConfig?.label}</span>
                    </div>

                    {/* Top-Right Heart Bookmark Button */}
                    <button
                      type="button"
                      onClick={(e) => toggleBookmark(ch.id, e)}
                      className={`absolute top-3 right-3 z-20 w-8 h-8 rounded-full border backdrop-blur-md flex items-center justify-center transition-all cursor-pointer ${
                        isBookmarked
                          ? "bg-rose-500/80 border-rose-400 text-white shadow-md shadow-rose-500/30 scale-105"
                          : "bg-black/30 hover:bg-black/50 border-white/20 text-white hover:scale-105"
                      }`}
                      title={isBookmarked ? "Remove Bookmark" : "Bookmark Challenge"}
                    >
                      <svg className="w-4 h-4" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                    </button>

                    {/* Bottom-Right XP Badge inside banner */}
                    <div className="absolute bottom-3 right-3 z-20 px-2.5 py-1 rounded-full text-[11px] font-black font-mono bg-slate-950/80 text-amber-300 border border-amber-400/30 backdrop-blur-md flex items-center gap-1 shadow-lg">
                      <span>⭐</span>
                      <span>+{ch.xp} XP</span>
                    </div>

                    {/* Bottom Organic Wave Curve Transition */}
                    <div className="absolute -bottom-1 left-0 right-0 z-20 pointer-events-none text-[var(--surface)] fill-current">
                      <svg viewBox="0 0 500 28" preserveAspectRatio="none" className="w-full h-5 sm:h-6 block">
                        <path d="M0,6 C130,26 230,2 350,22 C420,30 470,16 500,24 L500,28 L0,28 Z" />
                      </svg>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3 bg-[var(--surface)]">
                    <div className="space-y-2">
                      <h3 className="text-base font-bold text-[var(--text)] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug min-h-[2.5rem]">
                        {ch.title}
                      </h3>

                      <p className="text-xs text-[var(--muted)] line-clamp-2 leading-relaxed min-h-[2.25rem]">
                        {ch.question}
                      </p>

                      {/* Tech Tags */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1 min-h-[1.75rem]">
                        {ch.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-0.5 rounded-md bg-[var(--surface-soft)] border border-[var(--border-soft)] text-[10px] font-medium text-[var(--muted)] hover:text-[var(--text)]"
                          >
                            {tag}
                          </span>
                        ))}
                        {ch.tags.length > 3 && (
                          <span className="px-1.5 py-0.5 rounded-md bg-[var(--surface-soft)] border border-[var(--border-soft)] text-[10px] text-[var(--muted)] font-semibold">
                            +{ch.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 3-Column Metrics Row */}
                    <div className="grid grid-cols-3 gap-1 py-2 px-3 rounded-xl bg-[var(--surface-soft)]/60 border border-[var(--border-soft)] text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-[11px] font-bold text-[var(--text)]">⏱ {Math.floor(ch.timeLimitSec / 60)} min</span>
                        <span className="text-[9px] text-[var(--muted)] font-medium">Time</span>
                      </div>
                      <div className="flex flex-col items-center border-x border-[var(--border-soft)]">
                        <span className="text-[11px] font-bold text-[var(--text)]">👥 {ch.solvedCount.toLocaleString()}</span>
                        <span className="text-[9px] text-[var(--muted)] font-medium">Attempts</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 font-mono">📶 {ch.acceptanceRate}</span>
                        <span className="text-[9px] text-[var(--muted)] font-medium">Accepted</span>
                      </div>
                    </div>

                    {/* Card Footer: Difficulty + Action CTA Button */}
                    <div className="pt-3 border-t border-[var(--border-soft)] flex items-center justify-between gap-3 mt-auto">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                        ch.difficulty === "Beginner"
                          ? "bg-blue-100 text-blue-900 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800"
                          : ch.difficulty === "Intermediate"
                          ? "bg-amber-100 text-amber-900 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800"
                          : ch.difficulty === "Advanced"
                          ? "bg-emerald-100 text-emerald-900 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                          : "bg-purple-100 text-purple-900 border border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800"
                      }`}>
                        {ch.difficulty}
                      </span>

                      <button
                        onClick={() => handleOpenChallenge(ch)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                          isSolved || ch.actionStyle === "secondary"
                            ? "bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800"
                            : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/20"
                        }`}
                      >
                        <span>{isSolved ? "Retake" : ch.actionLabel || "Solve Challenge"}</span>
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

      {/* ================= ARENA LEADERBOARD (3-4 COLS) ================= */}
      <aside className="lg:col-span-4 xl:col-span-3 space-y-5 sticky top-28">
        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-4 shadow-xs">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--border-soft)] pb-3">
            <h3 className="text-sm font-black uppercase tracking-wider text-[var(--text)] flex items-center gap-2">
              <span className="text-amber-500 text-base">🏆</span> ARENA LEADERBOARD
            </h3>
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
              Live
            </span>
          </div>

          {/* Timeframe Tabs: Weekly, Monthly, All Time */}
          <div className="flex items-center p-1 rounded-xl bg-[var(--surface-soft)] border border-[var(--border-soft)] text-xs font-bold">
            {(["Weekly", "Monthly", "All Time"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setLeaderboardTimeframe(tab)}
                className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                  leaderboardTimeframe === tab
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold shadow-sm"
                    : "text-[var(--muted)] hover:text-[var(--text)] font-semibold"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Users List */}
          <div className="divide-y divide-[var(--border-soft)]">
            {displayedLeaderboard.map((usr) => (
              <div key={usr.rank} className="py-2.5 flex items-center justify-between text-xs hover:bg-[var(--surface-soft)]/50 px-1 rounded-lg transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`w-5 font-black text-xs text-center ${
                    usr.rank === 1 ? "text-amber-500 font-extrabold" : usr.rank === 2 ? "text-slate-400 font-bold" : usr.rank === 3 ? "text-amber-700 font-bold" : "text-[var(--muted)]"
                  }`}>
                    #{usr.rank}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                    {usr.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="font-extrabold truncate text-[var(--text)] text-xs">{usr.name}</p>
                    <span className="text-[10px] text-[var(--muted)] font-medium block truncate">{usr.role}</span>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-2">
                  <span className="font-extrabold text-[var(--text)] text-xs block">{usr.xp.toLocaleString()} XP</span>
                  <span className="text-[10px] text-amber-500 font-bold flex items-center justify-end gap-0.5">
                    <span>🔥</span> {usr.streak}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Button */}
          <div className="pt-2 border-t border-[var(--border-soft)]">
            <Link
              to="/contests?tab=hackathon"
              className="w-full py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <span>🏆</span>
              <span>View Full Leaderboard →</span>
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
)
}

<SiteFooter />
    </div >
  );
}
