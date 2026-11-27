"use client";

import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router";
import { useTheme } from "./app/theme";
import { useAuth } from "./app/context/AuthContext";
import { useCourses, type Course } from "./app/context/CourseContext";
import StudentDashboardPage from "./app/dashboard/StudentDashboardPage";
import AdminCreatorHub from "./app/admin/AdminCreatorHub";
import HeroInteractiveGraph from "./app/components/HeroInteractiveGraph";
import AlumniMarquee from "./app/components/AlumniMarquee";
import CourseCard from "./app/courses/CourseCard";
import CoursePreviewModal from "./app/courses/CoursePreviewModal";
import AstraPlatformWidget from "./app/components/AstraPlatformWidget";

type IconName =
  | "arrow"
  | "bolt"
  | "chart"
  | "check"
  | "chevron"
  | "clock"
  | "code"
  | "globe"
  | "grid"
  | "layers"
  | "lock"
  | "moon"
  | "play"
  | "plus"
  | "sparkles"
  | "sun"
  | "users";

const iconPaths: Record<IconName, ReactNode> = {
  arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
  bolt: <path d="m13 2-8 11h7l-1 9 8-12h-7l1-8Z" />,
  chart: <><path d="M4 19V9m6 10V5m6 14v-7m4 7H2" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  chevron: <path d="m8 10 4 4 4-4" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  code: <><path d="m8 9-3 3 3 3m8-6 3 3-3 3m-3-8-2 10" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" /></>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /></>,
  layers: <><path d="m12 3-9 5 9 5 9-5-9-5Z" /><path d="m3 12 9 5 9-5M3 16l9 5 9-5" /></>,
  lock: <><rect x="4" y="10" width="16" height="11" rx="3" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
  moon: <path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z" />,
  play: <path d="m9 7 8 5-8 5V7Z" />,
  plus: <path d="M12 5v14M5 12h14" />,
  sparkles: <><path d="m12 3 1.3 3.7L17 8l-3.7 1.3L12 13l-1.3-3.7L7 8l3.7-1.3L12 3Z" /><path d="m19 14 .7 2.3L22 17l-2.3.7L19 20l-.7-2.3L16 17l2.3-.7L19 14ZM5 14l.7 1.3L7 16l-1.3.7L5 18l-.7-1.3L3 16l1.3-.7L5 14Z" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" /></>,
};

export function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {iconPaths[name]}
    </svg>
  );
}

const courseTabs = [
  { id: "ai", label: "AI & Machine Learning", icon: "sparkles" as IconName },
  { id: "fullstack", label: "Full-Stack Web & Systems", icon: "code" as IconName },
  { id: "security", label: "Zero Trust Cybersecurity", icon: "lock" as IconName },
  { id: "devops", label: "Cloud & Kubernetes", icon: "grid" as IconName },
];

const domainShowcaseData: Record<
  string,
  {
    id: string;
    label: string;
    icon: IconName;
    pill: string;
    title: string;
    description: string;
    points: string[];
    ctaLabel: string;
    categoryQuery: string;
    roadmapTitle: string;
    statsText: string;
    techTags: string[];
    modules: Array<{
      title: string;
      duration: string;
      tag: string;
      tagClass: string;
    }>;
  }
> = {
  ai: {
    id: "ai",
    label: "AI & Machine Learning",
    icon: "sparkles",
    pill: "AGENTIC AI & RAG ARCHITECTURE",
    title: "Build autonomous multi-agent swarms with LangGraph & Vector Stores.",
    description:
      "Master multi-agent orchestration, stateful graph evaluation, tool execution, and hybrid BM25 + dense embedding retrieval systems.",
    points: [
      "Production-grade multi-agent cyclic loops & memory checkpoints",
      "Hybrid RAG with Qdrant, Milvus & semantic reranking",
      "Automated benchmark evaluation & prompt optimization",
    ],
    ctaLabel: "Browse AI & ML Masterclasses",
    categoryQuery: "ai",
    roadmapTitle: "Agentic AI Engineering Roadmap",
    statsText: "4 Masterclasses • 2,400+ Active Engineers",
    techTags: ["LangGraph", "Python 3.12", "Qdrant", "Claude 3.7", "FastAPI"],
    modules: [
      {
        title: "1. Vector Embedding Pipelines & Dense Search",
        duration: "4.5 Hours",
        tag: "Included",
        tagClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      },
      {
        title: "2. Multi-Agent Swarms with LangGraph & Tool Calling",
        duration: "6.0 Hours",
        tag: "Interactive Lab",
        tagClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      },
      {
        title: "3. Production RAG Benchmarking & Evaluators",
        duration: "5.5 Hours",
        tag: "Hands-on",
        tagClass: "bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/20",
      },
      {
        title: "4. Capstone: Autonomous Code Synthesis Engine",
        duration: "8.0 Hours",
        tag: "Verified Certificate",
        tagClass: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      },
    ],
  },
  fullstack: {
    id: "fullstack",
    label: "Full-Stack Web & Systems",
    icon: "code",
    pill: "REACT 19 & DISTRIBUTED SYSTEMS",
    title: "Ship zero-bundle React 19 apps with edge streaming & microservices.",
    description:
      "Master Server Components, optimistic mutations, distributed PostgreSQL sharding, and edge hydration for ultra-fast web platforms.",
    points: [
      "React 19 Server Actions & Suspense streaming architecture",
      "High-throughput edge caching with Cloudflare Workers",
      "Distributed database sharding & real-time WebSocket sync",
    ],
    ctaLabel: "Browse Full-Stack Masterclasses",
    categoryQuery: "fullstack",
    roadmapTitle: "Full-Stack Systems Roadmap",
    statsText: "6 Masterclasses • 3,800+ Active Engineers",
    techTags: ["React 19", "Next.js 15", "PostgreSQL", "Redis", "TypeScript"],
    modules: [
      {
        title: "1. Modern React 19 Architecture & RSC Internals",
        duration: "5.0 Hours",
        tag: "Included",
        tagClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      },
      {
        title: "2. Edge Streaming & Real-time WebSocket Hubs",
        duration: "6.5 Hours",
        tag: "Interactive Lab",
        tagClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      },
      {
        title: "3. Distributed Database Indexing & Caching Shards",
        duration: "4.5 Hours",
        tag: "Hands-on",
        tagClass: "bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/20",
      },
      {
        title: "4. Capstone: Real-time Multi-tenant SaaS Engine",
        duration: "9.0 Hours",
        tag: "Verified Certificate",
        tagClass: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      },
    ],
  },
  security: {
    id: "security",
    label: "Zero Trust Cybersecurity",
    icon: "lock",
    pill: "ZERO TRUST & RUST SYSTEMS",
    title: "Architect memory-safe microservices with Rust and cryptographic guards.",
    description:
      "Build bulletproof enterprise security layers with compile-time memory safety, mTLS token handshakes, and automated vulnerability scanning.",
    points: [
      "Memory-safe asynchronous microservices with Rust & Tokio",
      "mTLS & cryptographic RS256 token verification guards",
      "Automated AST vulnerability auditing & invariant testing",
    ],
    ctaLabel: "Browse Cybersecurity Masterclasses",
    categoryQuery: "security",
    roadmapTitle: "Zero-Trust Security Roadmap",
    statsText: "4 Masterclasses • 1,900+ Active Engineers",
    techTags: ["Rust 2024", "Tokio", "Ring Crypto", "mTLS", "Linux eBPF"],
    modules: [
      {
        title: "1. Rust Systems Programming & Memory Safety",
        duration: "6.0 Hours",
        tag: "Included",
        tagClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      },
      {
        title: "2. Zero-Trust Identity & mTLS Authentication",
        duration: "5.5 Hours",
        tag: "Interactive Lab",
        tagClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      },
      {
        title: "3. Cryptographic Token Guards & Tenant Isolation",
        duration: "4.5 Hours",
        tag: "Hands-on",
        tagClass: "bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/20",
      },
      {
        title: "4. Capstone: Production Zero-Trust Security Gateway",
        duration: "7.5 Hours",
        tag: "Verified Certificate",
        tagClass: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      },
    ],
  },
  devops: {
    id: "devops",
    label: "Cloud & Kubernetes",
    icon: "grid",
    pill: "KUBERNETES & CLOUD GITOPS",
    title: "Automate multi-cluster cloud deployments with GitOps & ArgoCD.",
    description:
      "Deploy, scale, and orchestrate production Kubernetes clusters with infrastructure as code, automated zero-downtime rollouts, and observability.",
    points: [
      "GitOps pipelines with ArgoCD & declarative Kubernetes Helm",
      "Infrastructure as Code with Terraform & AWS multi-region",
      "Distributed OpenTelemetry tracing & Prometheus monitoring",
    ],
    ctaLabel: "Browse Cloud & DevOps Masterclasses",
    categoryQuery: "devops",
    roadmapTitle: "Cloud & Kubernetes Roadmap",
    statsText: "5 Masterclasses • 2,100+ Active Engineers",
    techTags: ["Kubernetes", "Docker", "Terraform", "ArgoCD", "AWS", "Helm"],
    modules: [
      {
        title: "1. Containerization & Multi-Stage Docker Builds",
        duration: "4.0 Hours",
        tag: "Included",
        tagClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      },
      {
        title: "2. Kubernetes Cluster Orchestration & Ingress Routing",
        duration: "7.0 Hours",
        tag: "Interactive Lab",
        tagClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      },
      {
        title: "3. ArgoCD GitOps Continuous Delivery Pipelines",
        duration: "5.0 Hours",
        tag: "Hands-on",
        tagClass: "bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/20",
      },
      {
        title: "4. Capstone: High-Availability Cloud Infrastructure",
        duration: "8.5 Hours",
        tag: "Verified Certificate",
        tagClass: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      },
    ],
  },
};

const testimonials = [
  { quote: "Astra Academy is the gold standard for engineering masterclasses. The hands-on capstone projects and RAG architecture modules helped our team build production agents in 2 weeks.", name: "Aris Vance", role: "Staff AI Researcher at Anthropic Alumni", initials: "AV", company: "ANTHROPIC" },
  { quote: "The hands-on curriculum is miles ahead of generic video courses. I went from junior full-stack to leading systems architecture within 9 months.", name: "Jordan Bell", role: "Principal Engineer at Arc Cloud", initials: "JB", company: "ARC SYSTEMS" },
  { quote: "We upskilled our entire backend team on Rust and Zero-Trust networks. The visual course creation studio also lets our senior staff publish internal masterclasses easily.", name: "Priya Shah", role: "VP Engineering at Northstar", initials: "PS", company: "NORTHSTAR" },
];

const pricing = [
  { name: "Starter Pass", copy: "For self-paced developers starting their tech journey.", monthly: 19, features: ["Access to 10 foundational courses", "Curated Pattern-Wise DSA Sheets", "Community Discord access", "Course completion certificates"] },
  { name: "Pro All-Access", copy: "For ambitious engineers advancing to Senior/Staff roles.", monthly: 49, popular: true, features: ["Unlimited access to all 50+ masterclasses", "Full 380+ DSA problem solutions", "Verified industry certificates", "Direct mentor feedback & office hours", "Private GitHub starter repositories"] },
  { name: "Team & Enterprise", copy: "For engineering orgs scaling technical excellence.", monthly: 99, features: ["Everything in Pro All-Access", "Custom internal Course Creator Studio", "Team skill analytics & progress reports", "SSO & corporate billing", "Dedicated curriculum advisor"] },
];

export function Logo() {
  return (
    <div className="logo" aria-label="Astra Academy">
      <span className="logo-mark"><span /></span>
      <span>Astra Academy</span>
    </div>
  );
}

export function SiteNav() {
  const { user, isLoggedIn, logout, switchRole } = useAuth();
  const { courses } = useCourses();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="nav-wrap">
      <nav className="nav">
        <Link to="/" aria-label="Astra Academy home"><Logo /></Link>

        {/* Navigation Links */}
        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          {!isLoggedIn ? (
            <>
              <div className="nav-item">
                <button className="nav-trigger">Course Domains <Icon name="chevron" size={14} /></button>
                <div className="mega-menu">
                  <div className="mega-main">
                    <span className="mega-label">Explore Domains</span>
                    <Link to="/courses?category=ai"><i><Icon name="sparkles" /></i><span><b>AI & Machine Learning</b><small>Autonomous Agents, RAG & LLMs</small></span></Link>
                    <Link to="/courses?category=fullstack"><i><Icon name="code" /></i><span><b>Full-Stack & Systems</b><small>React 19, Next.js & Distributed DBs</small></span></Link>
                    <Link to="/courses?category=security"><i><Icon name="lock" /></i><span><b>Cybersecurity & Zero Trust</b><small>Offensive Security & Rust Systems</small></span></Link>
                    <Link to="/courses?category=devops"><i><Icon name="grid" /></i><span><b>DevOps & Cloud</b><small>Kubernetes, Docker & GitOps</small></span></Link>
                  </div>
                  <div className="mega-aside">
                    <span className="mega-label">Featured Masterclass</span>
                    <div className="mega-feature">
                      <span><Icon name="sparkles" /></span>
                      <b>AI Agents & Multi-Agent Graphs 2026</b>
                      <p>Master LangGraph, vector search, and tool execution.</p>
                      <Link to="/courses?category=ai">Explore Catalog <Icon name="arrow" size={14} /></Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="nav-item">
                <button className="nav-trigger">Interactive Hubs <Icon name="chevron" size={14} /></button>
                <div className="mega-menu solutions-menu">
                  <div className="mega-main">
                    <span className="mega-label">Hands-on Practice</span>
                    <Link to="/dsa-sheet"><i><Icon name="layers" /></i><span><b>DSA Problem Sheets</b><small>Pattern-wise, Last Minute 100 & SBC Sheet</small></span></Link>
                    <Link to="/contests"><i><Icon name="bolt" /></i><span><b>Contest Arena & Daily Quizzes</b><small>Timed challenges & 1v1 Battle Mode</small></span></Link>
                    <Link to="/verify"><i><Icon name="check" /></i><span><b>Credential Verification</b><small>Public verified certificates & LinkedIn badge</small></span></Link>
                    <Link to="/courses"><i><Icon name="chart" /></i><span><b>Full Catalog</b><small>All 50+ interactive courses</small></span></Link>
                  </div>
                  <div className="mega-links">
                    <span className="mega-label">Highlights</span>
                    <Link to="/dsa-sheet">Pattern-Wise DSA Sheet <Icon name="arrow" size={14} /></Link>
                    <Link to="/contests">Weekly Speed Hackathon <Icon name="arrow" size={14} /></Link>
                    <Link to="/pricing">All-Access Pass <Icon name="arrow" size={14} /></Link>
                  </div>
                </div>
              </div>

              <Link to="/courses">Courses</Link>
              <Link to="/dsa-sheet" className="flex items-center gap-1 font-semibold text-[var(--accent)]">
                <span>🧠</span> DSA Sheet
              </Link>
              <Link to="/contests" className="flex items-center gap-1">
                <span>⚡</span> Arena
              </Link>
              <Link to="/pricing">Pricing</Link>
            </>
          ) : user?.role === "admin" ? (
            <>
              <Link to="/admin" className="font-bold text-[var(--accent)]">🛠️ Creator Studio</Link>
              <Link to="/dsa-sheet" className="flex items-center gap-1 font-semibold"><span>🧠</span> DSA Sheet</Link>
              <Link to="/contests">⚡ Arena</Link>
              <Link to="/courses">Catalog</Link>
              <Link to="/dashboard">Student View</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="font-bold text-[var(--accent)]">🎓 My Learning</Link>
              <Link to="/dsa-sheet" className="flex items-center gap-1 font-semibold text-[var(--accent)]"><span>🧠</span> DSA Sheet</Link>
              <Link to="/contests">⚡ Arena</Link>
              <Link to="/notes">📑 Notes</Link>
              <Link to="/courses">Catalog</Link>
            </>
          )}
        </div>

        {/* Navigation Actions */}
        <div className="nav-actions">
          {!isLoggedIn ? (
            <>
              <button className="button button-sm" onClick={() => navigate("/signup")}>Enroll Free <Icon name="arrow" size={15} /></button>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-[var(--surface-soft)] border border-[var(--border-soft)] hover:border-[var(--accent)] transition-all"
              >
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center">
                  {user?.avatar || "AM"}
                </span>
                <span className="text-xs font-bold hidden sm:inline-block truncate max-w-[120px]">
                  {user?.name}
                </span>
                <Icon name="chevron" size={13} />
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 mt-3 w-64 p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl z-50 space-y-2 animate-fade-in text-xs">
                  <div className="p-2 border-b border-[var(--border-soft)]">
                    <p className="font-extrabold truncate">{user?.name}</p>
                    <p className="text-[10px] text-[var(--muted)] truncate">{user?.email}</p>
                    <span className="mt-1 inline-block text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 uppercase">
                      {user?.role === "admin" ? "Platform Admin / Creator" : "Pro Student"}
                    </span>
                  </div>

                  {/* Admin Specific Studio Options (Moved from horizontal bar) */}
                  {user?.role === "admin" ? (
                    <div className="space-y-1">
                      <div className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--accent)]">
                        Admin &amp; Curriculum Studio
                      </div>
                      <Link
                        to="/admin?tab=studio"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 p-2 rounded-xl hover:bg-[var(--surface-soft)] font-semibold text-[var(--foreground)] transition-colors"
                      >
                        <span>✏️</span> Dynamic Course Studio
                      </Link>
                      <Link
                        to="/admin?tab=courses"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 p-2 rounded-xl hover:bg-[var(--surface-soft)] font-semibold text-[var(--foreground)] transition-colors"
                      >
                        <span>📚</span> Manage Catalog ({courses.length})
                      </Link>
                      <Link
                        to="/admin?tab=students"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 p-2 rounded-xl hover:bg-[var(--surface-soft)] font-semibold text-[var(--foreground)] transition-colors"
                      >
                        <span>👥</span> Manage All Students
                      </Link>
                      <Link
                        to="/admin?tab=analytics"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 p-2 rounded-xl hover:bg-[var(--surface-soft)] font-semibold text-[var(--foreground)] transition-colors"
                      >
                        <span>📊</span> Customizable Analytics Dashboard
                      </Link>
                      <Link
                        to="/admin?tab=hackathons"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 p-2 rounded-xl hover:bg-[var(--surface-soft)] font-semibold text-[var(--foreground)] transition-colors"
                      >
                        <span>🏆</span> Hackathons &amp; Arenas
                      </Link>
                    </div>
                  ) : null}

                  {/* Non-duplicated utility items */}
                  <div className="pt-2 border-t border-[var(--border-soft)] space-y-1">
                    <Link
                      to="/notes"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 p-2 rounded-xl hover:bg-[var(--surface-soft)] font-semibold text-[var(--foreground)]"
                    >
                      <span>📑</span> Saved Notes &amp; Flashcards
                    </Link>
                    <Link
                      to="/verify"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 p-2 rounded-xl hover:bg-[var(--surface-soft)] font-semibold text-[var(--foreground)]"
                    >
                      <span>📜</span> Verified Credentials
                    </Link>
                  </div>

                  {user?.role !== "admin" && (
                    <button
                      onClick={() => {
                        switchRole("admin");
                        setProfileOpen(false);
                        navigate("/admin");
                      }}
                      className="w-full text-left flex items-center gap-2 p-2 rounded-xl hover:bg-[var(--surface-soft)] text-blue-600 dark:text-blue-400 font-semibold"
                    >
                      <span>👑</span> Switch to Admin Creator View
                    </button>
                  )}

                  <div className="pt-2 border-t border-[var(--border-soft)]">
                    <button
                      onClick={() => {
                        logout();
                        setProfileOpen(false);
                        navigate("/");
                      }}
                      className="w-full text-left p-2 rounded-xl hover:bg-rose-500/10 text-rose-500 font-bold"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation"><i /><i /></button>
        </div>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  const { dark, setDark } = useTheme();
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail("");
    }
  };

  return (
    <footer className="mt-8 sm:mt-10 border-t border-[var(--border-soft)] bg-gradient-to-b from-[var(--surface)] to-[var(--bg)] text-[var(--text)] transition-colors relative overflow-hidden">
      {/* Subtle Glow backdrop effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-blue-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-10 space-y-8 relative z-10">
        {/* Top Tier: Live Metrics Banner & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs">
          {/* Brand & Live Platform Status */}
          <div className="lg:col-span-6 space-y-4">
            <Link to="/" aria-label="Astra Academy home"><Logo /></Link>
            <p className="text-xs text-[var(--muted)] leading-relaxed max-w-md">
              The premier interactive engineering academy for autonomous AI systems, distributed full-stack architecture, zero-trust security, and cloud infrastructure.
            </p>

            {/* Live Operational Status Indicator */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] font-semibold text-[var(--muted)]">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                All Systems Operational
              </span>
              <span>•</span>
              <span className="font-mono">99.99% Cloud Uptime</span>
              <span>•</span>
              <span>150k+ Active Engineers</span>
            </div>
          </div>

          {/* Newsletter Subscribe Box */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black tracking-tight text-[var(--text)] flex items-center gap-2">
                <span>📬</span> Stay Ahead in AI & Systems Engineering
              </h4>
              <span className="text-[10px] uppercase font-bold text-[var(--accent)]">Weekly Brief</span>
            </div>
            <p className="text-xs text-[var(--muted)]">
              In-depth architecture breakdowns, AST deep dives, and early hackathon invites. Zero spam.
            </p>

            {subscribed ? (
              <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fade-in">
                <span>✓</span> You're on the list! Check your inbox for our latest RAG system design guide.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  placeholder="name@company.com"
                  aria-label="Newsletter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 p-3 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs text-[var(--text)] focus:ring-2 focus:ring-[var(--accent)]"
                />
                <button type="submit" className="button py-3 px-6 text-xs font-black shadow-md shrink-0">
                  Subscribe →
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Middle Tier: 5 Category Columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-xs">
          {/* Column 1: Course Domains */}
          <div className="space-y-3">
            <h5 className="font-extrabold uppercase tracking-wider text-[var(--accent)] text-[11px]">
              Course Domains
            </h5>
            <ul className="space-y-2 text-[var(--muted)]">
              <li><Link to="/courses?category=ai" className="hover:text-[var(--text)] transition-colors">Autonomous AI & RAG</Link></li>
              <li><Link to="/courses?category=fullstack" className="hover:text-[var(--text)] transition-colors">React 19 & Next.js</Link></li>
              <li><Link to="/courses?category=security" className="hover:text-[var(--text)] transition-colors">Rust Systems & Security</Link></li>
              <li><Link to="/courses?category=devops" className="hover:text-[var(--text)] transition-colors">Kubernetes & DevOps</Link></li>
              <li><Link to="/courses" className="hover:text-[var(--text)] transition-colors font-bold text-[var(--text)]">Full Course Catalog →</Link></li>
            </ul>
          </div>

          {/* Column 2: Interactive Hubs */}
          <div className="space-y-3">
            <h5 className="font-extrabold uppercase tracking-wider text-amber-400 text-[11px]">
              Interactive Hubs
            </h5>
            <ul className="space-y-2 text-[var(--muted)]">
              <li><Link to="/contests" className="hover:text-[var(--text)] transition-colors flex items-center gap-1.5"><span>⚡</span> Contest Arena</Link></li>
              <li><Link to="/contests" className="hover:text-[var(--text)] transition-colors flex items-center gap-1.5"><span>⚔️</span> 1v1 Battle Duels</Link></li>
              <li><Link to="/dsa-sheet" className="hover:text-[var(--text)] transition-colors flex items-center gap-1.5"><span>🧠</span> DSA Sheets (Pattern-Wise & SBC)</Link></li>
              <li><Link to="/notes" className="hover:text-[var(--text)] transition-colors flex items-center gap-1.5"><span>📑</span> Notes & Flashcards</Link></li>
              <li><Link to="/verify" className="hover:text-[var(--text)] transition-colors flex items-center gap-1.5"><span>🏆</span> Credential Hub</Link></li>
            </ul>
          </div>

          {/* Column 3: Learning Tracks */}
          <div className="space-y-3">
            <h5 className="font-extrabold uppercase tracking-wider text-[var(--text)] text-[11px]">
              Learning Tracks
            </h5>
            <ul className="space-y-2 text-[var(--muted)]">
              <li><Link to="/courses?level=Beginner" className="hover:text-[var(--text)] transition-colors">Zero to Job-Ready</Link></li>
              <li><Link to="/courses?level=Advanced" className="hover:text-[var(--text)] transition-colors">Staff & Principal Architect</Link></li>
              <li><Link to="/contests" className="hover:text-[var(--text)] transition-colors">Weekly Speed Hackathons</Link></li>
              <li><Link to="/pricing" className="hover:text-[var(--text)] transition-colors">All-Access Pass</Link></li>
              <li><Link to="/verify" className="hover:text-[var(--text)] transition-colors">Verified Credentials</Link></li>
            </ul>
          </div>

          {/* Column 4: Platform & Creator */}
          <div className="space-y-3">
            <h5 className="font-extrabold uppercase tracking-wider text-[var(--text)] text-[11px]">
              Platform & Creator
            </h5>
            <ul className="space-y-2 text-[var(--muted)]">
              <li><Link to="/admin" className="hover:text-[var(--text)] transition-colors">Course Creator Studio</Link></li>
              <li><Link to="/dashboard" className="hover:text-[var(--text)] transition-colors">Student Dashboard</Link></li>
              <li><Link to="/signin" className="hover:text-[var(--text)] transition-colors">Sign In (Demo Accounts)</Link></li>
              <li><Link to="/signup" className="hover:text-[var(--text)] transition-colors">Create Free Account</Link></li>
              <li><Link to="/pricing" className="hover:text-[var(--text)] transition-colors">Enterprise Pricing</Link></li>
            </ul>
          </div>

          {/* Column 5: Trust & Compliance */}
          <div className="space-y-3">
            <h5 className="font-extrabold uppercase tracking-wider text-emerald-400 text-[11px]">
              Trust & Enterprise
            </h5>
            <div className="space-y-2 text-[10px] text-[var(--muted)]">
              <span className="block px-2.5 py-1 rounded-md bg-[var(--surface-soft)] font-mono text-[var(--text)]">
                🛡️ SOC-2 Type II Certified
              </span>
              <span className="block px-2.5 py-1 rounded-md bg-[var(--surface-soft)] font-mono text-[var(--text)]">
                🔒 ISO 27001 Compliant
              </span>
              <span className="block px-2.5 py-1 rounded-md bg-[var(--surface-soft)] font-mono text-[var(--text)]">
                ⚡ React 19 & LangGraph
              </span>
              <p className="text-[10px] pt-1">Enterprise SSO & Corporate Billing ready.</p>
            </div>
          </div>
        </div>

        {/* Bottom Tier: Copyright, Socials, Theme Switcher */}
        <div className="pt-8 border-t border-[var(--border-soft)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--muted)]">
          <div>
            <span>© 2026 Astra Academy, Inc. All rights reserved. Master engineering at scale.</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              aria-label="X (Twitter)"
              className="w-8 h-8 rounded-full bg-[var(--surface-soft)] border border-[var(--border-soft)] hover:border-[var(--accent)] hover:text-[var(--text)] flex items-center justify-center font-bold transition-all hover:scale-110"
            >
              𝕏
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="w-8 h-8 rounded-full bg-[var(--surface-soft)] border border-[var(--border-soft)] hover:border-[var(--accent)] hover:text-[var(--text)] flex items-center justify-center font-bold transition-all hover:scale-110"
            >
              in
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="w-8 h-8 rounded-full bg-[var(--surface-soft)] border border-[var(--border-soft)] hover:border-[var(--accent)] hover:text-[var(--text)] flex items-center justify-center font-bold transition-all hover:scale-110"
            >
              ⌘
            </a>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Discord"
              className="w-8 h-8 rounded-full bg-[var(--surface-soft)] border border-[var(--border-soft)] hover:border-[var(--accent)] hover:text-[var(--text)] flex items-center justify-center font-bold transition-all hover:scale-110"
            >
              💬
            </a>
          </div>

          {/* Theme Selector Pill */}
          <button
            onClick={() => setDark(!dark)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--surface-soft)] border border-[var(--border-soft)] hover:border-[var(--accent)] text-xs font-bold text-[var(--text)] transition-all"
          >
            <Icon name={dark ? "moon" : "sun"} size={13} />
            <span>{dark ? "Dark Mode" : "Light Mode"}</span>
          </button>
        </div>
      </div>

      {/* Global Interactive Astra Platform Widget */}
      <AstraPlatformWidget />
    </footer>
  );
}

function Pill({ children, tone = "violet" }: { children: ReactNode; tone?: "violet" | "green" }) {
  return <span className={`pill pill-${tone}`}>{children}</span>;
}

function SectionHeader({ eyebrow, title, copy }: { eyebrow: string; title: ReactNode; copy: string }) {
  return (
    <div className="section-header">
      <Pill><Icon name="sparkles" size={14} /> {eyebrow}</Pill>
      <h2>{title}</h2>
      <p>{copy}</p>
    </div>
  );
}

export default function App() {
  const navigate = useNavigate();
  const { dark } = useTheme();
  const { user, isLoggedIn } = useAuth();
  const { courses, enrollInCourse, isEnrolled } = useCourses();
  const [activeTab, setActiveTab] = useState("ai");
  const [annual, setAnnual] = useState(true);
  const [testimonial, setTestimonial] = useState(0);
  const [previewCourse, setPreviewCourse] = useState<Course | null>(null);

  // If logged in, automatically show the appropriate dashboard view!
  if (isLoggedIn) {
    if (user?.role === "admin") {
      return <AdminCreatorHub />;
    }
    return <StudentDashboardPage />;
  }

  // Otherwise, render the public high-converting Astra Academy platform!
  return (
    <div className={`app ${dark ? "dark" : ""}`}>
      <div className="noise" />
      <SiteNav />

      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-orb orb-one" /><div className="hero-orb orb-two" />
          <div className="hero-copy">
            <Pill><span className="live-dot" /> Master Autonomous AI & Engineering <Icon name="arrow" size={14} /></Pill>
            <h1>Master in-demand tech skills <span>through interactive building.</span></h1>
            <p>Astra Academy combines project-based masterclasses with curated pattern-wise DSA sheets, autonomous agent pipelines, and verified certifications.</p>
            <div className="hero-actions">
              <button className="button button-lg" onClick={() => navigate("/signup")}>Start Learning Free <Icon name="arrow" /></button>
              <button className="button-secondary button-lg" onClick={() => navigate("/courses")}><span className="play"><Icon name="play" size={15} /></span> Explore 50+ Courses</button>
            </div>
            <div className="micro-proof"><span><Icon name="check" size={14} /> Free Starter Courses</span><span><Icon name="check" size={14} /> Pattern-Wise DSA Sheet</span><span><Icon name="check" size={14} /> Verified Certificates</span></div>
          </div>

          {/* Interactive Classroom Hero Sandbox Preview */}
          <div className="w-full max-w-6xl mx-auto px-4 mt-8 relative">
            <HeroInteractiveGraph />

            {/* Subtle Floating Stat Badges Positioned Cleanly Beneath & Around */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
              <div className="px-4 py-2 rounded-2xl bg-[var(--surface)] border border-[var(--border-soft)] shadow-md flex items-center gap-2.5 text-xs">
                <span className="text-base">🔥</span>
                <span><strong>14-Day Streak</strong> <span className="text-[var(--muted)]">• +450 XP this week</span></span>
              </div>
              <div className="px-4 py-2 rounded-2xl bg-[var(--surface)] border border-[var(--border-soft)] shadow-md flex items-center gap-2.5 text-xs">
                <span className="text-base">🏆</span>
                <span><strong>Verified Certificate</strong> <span className="text-[var(--muted)]">• AI Systems Architect</span></span>
              </div>
              <div className="px-4 py-2 rounded-2xl bg-[var(--surface)] border border-[var(--border-soft)] shadow-md flex items-center gap-2.5 text-xs">
                <div className="avatar-stack flex -space-x-1.5">
                  <i className="w-5 h-5 rounded-full bg-blue-600 text-[9px] text-white flex items-center justify-center">AV</i>
                  <i className="w-5 h-5 rounded-full bg-sky-600 text-[9px] text-white flex items-center justify-center">JB</i>
                  <i className="w-5 h-5 rounded-full bg-emerald-500 text-[9px] text-white flex items-center justify-center">MS</i>
                </div>
                <span><strong>15,000+ Engineers</strong> <span className="text-[var(--muted)]">building now</span></span>
              </div>
            </div>
          </div>

          {/* Continuous Sliding Alumni Marquee */}
          <AlumniMarquee />
        </section>

        {/* Featured Masterclasses Grid */}
        <section className="section features" id="features">
          <SectionHeader eyebrow="Curated Masterclasses" title={<>Built by industry leaders. <span className="gradient-text">Mastered by you.</span></>} copy="Every course is packed with architectural diagrams, production-grade projects, and portfolio-ready capstones." />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 max-w-7xl mx-auto">
            {courses.slice(0, 4).map((c) => (
              <CourseCard
                key={c.id}
                course={c}
                isEnrolled={isEnrolled(c.id)}
                onPreview={(course) => setPreviewCourse(course)}
                onStartLearning={(course) => {
                  if (isEnrolled(course.id)) {
                    navigate(`/learn/${course.id}`);
                  } else {
                    setPreviewCourse(course);
                  }
                }}
              />
            ))}
          </div>
        </section>

        {/* Interactive Domain Showcase */}
        <section className="section showcase" id="solutions">
          <SectionHeader
            eyebrow="Domain Specializations"
            title={<>Deep dive into <span className="gradient-text">cutting-edge tech.</span></>}
            copy="Select a specialization to see hands-on curriculum breakdowns, module roadmaps, and production projects."
          />
          <div className="tabs" role="tablist">
            {courseTabs.map((tab) => (
              <button
                key={tab.id}
                className={activeTab === tab.id ? "active" : ""}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon name={tab.icon} /> {tab.label}
              </button>
            ))}
          </div>

          {(() => {
            const domain = domainShowcaseData[activeTab] || domainShowcaseData.ai;
            return (
              <div className="showcase-shell">
                <div className="showcase-top">
                  <span className="font-bold">{domain.label} Masterclass Track</span>
                  <small className="font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                    Interactive Syllabus & Capstones
                  </small>
                </div>

                <div className="showcase-content" key={activeTab}>
                  {/* Left Column: Domain Details & Bullet Points */}
                  <div className="showcase-copy">
                    <Pill>
                      <Icon name={domain.icon} size={13} /> {domain.pill}
                    </Pill>
                    <h3>{domain.title}</h3>
                    <p>{domain.description}</p>
                    <ul>
                      {domain.points.map((point, idx) => (
                        <li key={idx}>
                          <Icon name="check" /> {point}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => navigate(`/courses?category=${domain.categoryQuery}`)}
                      className="inline-link mt-2"
                    >
                      {domain.ctaLabel} <Icon name="arrow" />
                    </button>
                  </div>

                  {/* Right Column: Dynamic Module Roadmap & Tech Stack */}
                  <div className="showcase-dashboard flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4 pb-2 border-b border-[var(--border-soft)]">
                        <h4 className="text-xs font-black uppercase text-[var(--accent)] tracking-wider">
                          {domain.roadmapTitle}
                        </h4>
                        <span className="text-[11px] font-semibold text-[var(--muted)]">
                          {domain.statsText}
                        </span>
                      </div>

                      <div className="space-y-2.5">
                        {domain.modules.map((mod, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border-soft)] hover:border-[var(--accent)] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                          >
                            <span className="font-bold text-[var(--text)]">
                              {mod.title}
                            </span>
                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                              <span className="text-[10px] text-[var(--muted)] font-mono">
                                ⏱ {mod.duration}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${mod.tagClass}`}
                              >
                                {mod.tag}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tech Stack Badges */}
                    <div className="pt-3 border-t border-[var(--border-soft)] flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] text-[var(--muted)] font-bold uppercase mr-1">
                        Core Tech:
                      </span>
                      {domain.techTags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 rounded-lg bg-[var(--surface)] border border-[var(--border-soft)] text-[10px] font-mono text-[var(--text)] shadow-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </section>

        {/* Testimonials */}
        <section className="section testimonials">
          <SectionHeader eyebrow="Alumni Success" title={<>Engineers who refuse to stand still <span className="gradient-text">choose Astra.</span></>} copy="Join thousands of developers advancing their careers with our project-driven curriculum." />
          <div className="testimonial-stage">
            <button className="carousel-button prev" onClick={() => setTestimonial((testimonial + testimonials.length - 1) % testimonials.length)} aria-label="Previous testimonial"><Icon name="arrow" /></button>
            <article className="quote-card" key={testimonial}>
              <div className="quote-mark">“</div>
              <div className="stars">★★★★★</div>
              <blockquote>{testimonials[testimonial].quote}</blockquote>
              <div className="quote-person"><span>{testimonials[testimonial].initials}</span><div><b>{testimonials[testimonial].name}</b><small>{testimonials[testimonial].role}</small></div><em>{testimonials[testimonial].company}</em></div>
            </article>
            <button className="carousel-button next" onClick={() => setTestimonial((testimonial + 1) % testimonials.length)} aria-label="Next testimonial"><Icon name="arrow" /></button>
          </div>
          <div className="carousel-dots">{testimonials.map((_, index) => <button key={index} className={testimonial === index ? "active" : ""} onClick={() => setTestimonial(index)} aria-label={`Show testimonial ${index + 1}`} />)}</div>
        </section>

        {/* Pricing */}
        <section className="section pricing" id="pricing">
          <SectionHeader eyebrow="Membership Plans" title={<>Invest in your career. <span className="gradient-text">Scale your impact.</span></>} copy="Start free or unlock the full library with an All-Access Pass." />
          <div className="billing-toggle"><span className={!annual ? "active" : ""}>Monthly</span><button onClick={() => setAnnual(!annual)} className={annual ? "on" : ""} aria-label="Toggle annual billing"><i /></button><span className={annual ? "active" : ""}>Annually</span><Pill tone="green">SAVE 20%</Pill></div>
          <div className="pricing-grid">
            {pricing.map((plan) => {
              const price = annual ? Math.round(plan.monthly * 0.8) : plan.monthly;
              return (
                <article className={`price-card ${plan.popular ? "popular" : ""}`} key={plan.name}>
                  {plan.popular && <span className="popular-tag"><Icon name="sparkles" size={13} /> MOST POPULAR</span>}
                  <div>
                    <span className="plan-icon"><Icon name={plan.name === "Starter Pass" ? "bolt" : plan.name === "Pro All-Access" ? "sparkles" : "globe"} /></span>
                    <h3>{plan.name}</h3>
                    <p>{plan.copy}</p>
                    <div className="price">
                      <sup>$</sup><b>{price}</b>
                      <span>/ month<br />billed {annual ? "annually" : "monthly"}</span>
                    </div>
                    <button className={plan.popular ? "button" : "price-button"} onClick={() => navigate("/signup")}>
                      Start Learning <Icon name="arrow" />
                    </button>
                  </div>
                  <div className="mt-6 pt-6 border-t border-[var(--border-soft)]">
                    <small className="feature-header">WHAT’S INCLUDED</small>
                    <ul>
                      {plan.features.map((feature) => (
                        <li key={feature}>
                          <span><Icon name="check" size={13} /></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Call to Action */}
        <section className="cta-section">
          <div className="cta-card">
            <div className="cta-grid" /><div className="cta-orb cta-orb-one" /><div className="cta-orb cta-orb-two" />
            <div className="cta-content">
              <Pill>ACCELERATE YOUR LEARNING</Pill>
              <h2>Your next tech breakthrough<br />starts today.</h2>
              <p>Join 150,000+ ambitious developers mastering AI and cloud engineering.<br />Start learning with free starter courses.</p>
              <form className="signup" onSubmit={(event) => { event.preventDefault(); navigate("/signup"); }}>
                <input type="email" placeholder="Enter your email address" aria-label="Email" required />
                <button className="button">Enroll Free <Icon name="arrow" /></button>
              </form>
              <div className="cta-proof"><span><Icon name="check" /> 3-Day Free Trial</span><span><Icon name="check" /> No credit card</span><span><Icon name="check" /> Full DSA Sheets</span></div>
            </div>
            <div className="cta-float"><span className="ai-mark"><Icon name="sparkles" /></span><div><b>Certificate Unlocked</b><small>AI Agent Systems Architect</small></div><span className="done"><Icon name="check" size={13} /></span></div>
          </div>
        </section>
      </main>

      {/* Course Preview Modal for Unenrolled Users */}
      <CoursePreviewModal
        course={previewCourse}
        isOpen={!!previewCourse}
        onClose={() => setPreviewCourse(null)}
        onEnroll={(courseId) => {
          enrollInCourse(courseId);
          navigate(`/learn/${courseId}`);
        }}
      />

      <SiteFooter />
    </div>
  );
}
