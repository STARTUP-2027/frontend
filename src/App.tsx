import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router";
import { useTheme } from "./app/theme";
import { useAuth } from "./app/context/AuthContext";
import { useCourses } from "./app/context/CourseContext";
import StudentDashboardPage from "./app/dashboard/StudentDashboardPage";
import AdminCreatorHub from "./app/admin/AdminCreatorHub";
import HeroInteractiveGraph from "./app/components/HeroInteractiveGraph";
import AlumniMarquee from "./app/components/AlumniMarquee";

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
        tagClass: "bg-purple-500/10 text-purple-400 border-purple-500/30",
      },
      {
        title: "3. Production RAG Benchmarking & Evaluators",
        duration: "5.5 Hours",
        tag: "Hands-on",
        tagClass: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
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
        tagClass: "bg-purple-500/10 text-purple-400 border-purple-500/30",
      },
      {
        title: "3. Distributed Database Indexing & Caching Shards",
        duration: "4.5 Hours",
        tag: "Hands-on",
        tagClass: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
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
        tagClass: "bg-purple-500/10 text-purple-400 border-purple-500/30",
      },
      {
        title: "3. Cryptographic Token Guards & Tenant Isolation",
        duration: "4.5 Hours",
        tag: "Hands-on",
        tagClass: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
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
        tagClass: "bg-purple-500/10 text-purple-400 border-purple-500/30",
      },
      {
        title: "3. ArgoCD GitOps Continuous Delivery Pipelines",
        duration: "5.0 Hours",
        tag: "Hands-on",
        tagClass: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
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
  { quote: "Astra Academy is the gold standard for engineering masterclasses. The live sandbox exercises and RAG architecture modules helped our team build production agents in 2 weeks.", name: "Aris Vance", role: "Staff AI Researcher at Anthropic Alumni", initials: "AV", company: "ANTHROPIC" },
  { quote: "The hands-on curriculum is miles ahead of generic video courses. I went from junior full-stack to leading systems architecture within 9 months.", name: "Jordan Bell", role: "Principal Engineer at Arc Cloud", initials: "JB", company: "ARC SYSTEMS" },
  { quote: "We upskilled our entire backend team on Rust and Zero-Trust networks. The visual course creation studio also lets our senior staff publish internal masterclasses easily.", name: "Priya Shah", role: "VP Engineering at Northstar", initials: "PS", company: "NORTHSTAR" },
];

const pricing = [
  { name: "Starter Pass", copy: "For self-paced developers starting their tech journey.", monthly: 19, features: ["Access to 10 foundational courses", "Interactive in-browser code sandboxes", "Community Discord access", "Course completion certificates"] },
  { name: "Pro All-Access", copy: "For ambitious engineers advancing to Senior/Staff roles.", monthly: 49, popular: true, features: ["Unlimited access to all 50+ masterclasses", "Advanced AI & Rust projects", "Verified industry certificates", "Direct mentor feedback & office hours", "Private GitHub starter repositories"] },
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
  const { dark, setDark } = useTheme();
  const { user, isLoggedIn, logout, switchRole } = useAuth();
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
                <button className="nav-trigger">Learning Tracks <Icon name="chevron" size={14} /></button>
                <div className="mega-menu solutions-menu">
                  <div className="mega-main">
                    <span className="mega-label">By Career Goal</span>
                    <Link to="/courses?level=Beginner"><i><Icon name="bolt" /></i><span><b>Zero to Job-Ready</b><small>Structured career transition</small></span></Link>
                    <Link to="/courses?level=Advanced"><i><Icon name="code" /></i><span><b>Senior & Staff Engineer</b><small>Deep architectural mastery</small></span></Link>
                    <Link to="/courses?level=Intermediate"><i><Icon name="globe" /></i><span><b>Intermediate Skillup</b><small>Systems & architectural patterns</small></span></Link>
                    <Link to="/courses"><i><Icon name="chart" /></i><span><b>Full Masterclasses</b><small>All 50+ interactive courses</small></span></Link>
                  </div>
                  <div className="mega-links">
                    <span className="mega-label">Specializations</span>
                    <Link to="/courses?category=ai">AI Engineering <Icon name="arrow" size={14} /></Link>
                    <Link to="/courses?category=devops">Cloud & Microservices <Icon name="arrow" size={14} /></Link>
                    <Link to="/pricing">All-Access Pass <Icon name="arrow" size={14} /></Link>
                  </div>
                </div>
              </div>

              <Link to="/courses">Course Catalog</Link>
              <Link to="/pricing">Pricing</Link>
            </>
          ) : user?.role === "admin" ? (
            <>
              <Link to="/admin" className="font-bold text-[var(--accent)]">🛠️ Creator Studio</Link>
              <Link to="/courses">Course Catalog</Link>
              <Link to="/dashboard">Student View</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="font-bold text-[var(--accent)]">🎓 My Learning</Link>
              <Link to="/courses">Browse Catalog</Link>
              <Link to="/pricing">Upgrade Plan</Link>
            </>
          )}
        </div>

        {/* Navigation Actions */}
        <div className="nav-actions">
          <button className="theme-toggle" onClick={() => setDark(!dark)} aria-label={`Switch to ${dark ? "light" : "dark"} mode`}>
            <span className={!dark ? "selected" : ""}><Icon name="sun" size={15} /></span>
            <span className={dark ? "selected" : ""}><Icon name="moon" size={15} /></span>
          </button>

          {!isLoggedIn ? (
            <>
              <button className="text-button" onClick={() => navigate("/signin")}>Sign in</button>
              <button className="button button-sm" onClick={() => navigate("/signup")}>Enroll Free <Icon name="arrow" size={15} /></button>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-[var(--surface-soft)] border border-[var(--border-soft)] hover:border-[var(--accent)] transition-all"
              >
                <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-extrabold text-xs flex items-center justify-center">
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
                    <span className="mt-1 inline-block text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase">
                      {user?.role === "admin" ? "Platform Admin / Creator" : "Pro Student"}
                    </span>
                  </div>

                  {user?.role === "admin" ? (
                    <>
                      <Link to="/admin" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 p-2 rounded-xl hover:bg-[var(--surface-soft)] font-semibold">
                        <span>✨</span> Course Creator Studio
                      </Link>
                      <button onClick={() => { switchRole("student"); setProfileOpen(false); navigate("/dashboard"); }} className="w-full text-left flex items-center gap-2 p-2 rounded-xl hover:bg-[var(--surface-soft)] text-purple-400 font-semibold">
                        <span>🎓</span> Switch to Student View
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/dashboard" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 p-2 rounded-xl hover:bg-[var(--surface-soft)] font-semibold">
                        <span>🎓</span> My Learning Dashboard
                      </Link>
                      <button onClick={() => { switchRole("admin"); setProfileOpen(false); navigate("/admin"); }} className="w-full text-left flex items-center gap-2 p-2 rounded-xl hover:bg-[var(--surface-soft)] text-purple-400 font-semibold">
                        <span>👑</span> Switch to Admin Creator View
                      </button>
                    </>
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
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <Link to="/"><Logo /></Link>
          <p>The interactive tech academy for engineers<br />building the future of AI & software.</p>
          <span className="status"><i /> 50+ Live Interactive Masterclasses</span>
        </div>
        <div className="footer-links">
          <div>
            <b>Course Domains</b>
            <Link to="/courses?category=ai">AI & Agentic Systems</Link>
            <Link to="/courses?category=fullstack">React 19 & Next.js</Link>
            <Link to="/courses?category=security">Rust Systems & Security</Link>
            <Link to="/courses?category=devops">Kubernetes & DevOps</Link>
            <Link to="/courses">Full Course Catalog</Link>
          </div>
          <div>
            <b>Learning Tracks</b>
            <Link to="/courses?level=Beginner">Zero to Job-Ready</Link>
            <Link to="/courses?level=Advanced">Senior Engineer Mastery</Link>
            <Link to="/courses?level=Intermediate">Intermediate Tracks</Link>
            <Link to="/courses">Masterclass Library</Link>
            <Link to="/pricing">All-Access Pass</Link>
          </div>
          <div>
            <b>Platform Hub</b>
            <Link to="/dashboard">Student Dashboard</Link>
            <Link to="/admin">Course Creator Studio</Link>
            <Link to="/signin">Sign In (Demo Accounts)</Link>
            <Link to="/signup">Create Account</Link>
            <Link to="/pricing">Membership Plans</Link>
          </div>
          <div>
            <b>Certifications & Info</b>
            <Link to="/courses">Verified Certificates</Link>
            <Link to="/courses">Interactive Sandboxes</Link>
            <Link to="/pricing">Pricing & FAQ</Link>
            <Link to="/signup">Enroll Free</Link>
          </div>
        </div>
        <div className="newsletter">
          <b>Stay ahead in Tech & AI.</b>
          <p>Weekly architecture breakdowns & tutorials.<br />Zero spam, ever.</p>
          {subscribed ? (
            <div className="newsletter-success">
              <span>✓ You're subscribed! Welcome to Astra Academy.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe}>
              <input 
                type="email" 
                placeholder="you@company.com" 
                aria-label="Newsletter email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
              <button aria-label="Subscribe"><Icon name="arrow" /></button>
            </form>
          )}
          <small>By subscribing, you agree to our <Link to="/product/security">Privacy Policy</Link>.</small>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Astra Academy, Inc. All rights reserved.</span>
        <div className="socials">
          <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="X (Twitter)">𝕏</a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">in</a>
          <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub">⌘</a>
        </div>
        <button className="footer-theme" onClick={() => setDark(!dark)}>
          <Icon name={dark ? "moon" : "sun"} /> {dark ? "Dark mode" : "Light mode"} <Icon name="chevron" size={14} />
        </button>
      </div>
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
            <p>Astra Academy combines project-based masterclasses with live in-browser code sandboxes, autonomous agent pipelines, and verified certifications.</p>
            <div className="hero-actions">
              <button className="button button-lg" onClick={() => navigate("/signup")}>Start Learning Free <Icon name="arrow" /></button>
              <button className="button-secondary button-lg" onClick={() => navigate("/courses")}><span className="play"><Icon name="play" size={15} /></span> Explore 50+ Courses</button>
            </div>
            <div className="micro-proof"><span><Icon name="check" size={14} /> Free Starter Courses</span><span><Icon name="check" size={14} /> Interactive Sandboxes</span><span><Icon name="check" size={14} /> Verified Certificates</span></div>
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
                  <i className="w-5 h-5 rounded-full bg-purple-500 text-[9px] text-white flex items-center justify-center">AV</i>
                  <i className="w-5 h-5 rounded-full bg-indigo-500 text-[9px] text-white flex items-center justify-center">JB</i>
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
          <SectionHeader eyebrow="Curated Masterclasses" title={<>Built by industry leaders. <span className="gradient-text">Mastered by you.</span></>} copy="Every course is packed with architectural diagrams, interactive code sandboxes, and portfolio-ready capstones." />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 max-w-7xl mx-auto">
            {courses.slice(0, 4).map((c) => (
              <article
                key={c.id}
                className="group relative rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] hover:border-[var(--accent)] shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden text-left"
              >
                <div>
                  {/* Top Gradient Banner */}
                  <div
                    className="relative h-32 p-3.5 flex flex-col justify-between text-white overflow-hidden"
                    style={{ background: c.bannerGradient || "linear-gradient(135deg, #7c3aed 0%, #4338ca 100%)" }}
                  >
                    <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />
                    
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20">
                        {c.categoryLabel}
                      </span>
                      {c.bestseller && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-400 text-black">
                          ★ BESTSELLER
                        </span>
                      )}
                    </div>

                    <div className="relative z-10 flex items-end justify-between">
                      <span className="text-lg font-black">{c.price === 0 ? "FREE" : `$${c.price}`}</span>
                      <span className="text-[10px] text-white/80 font-mono">⏱ {c.duration}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between text-[10px] text-[var(--muted)] font-semibold">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block" />
                        {c.level}
                      </span>
                      <span className="text-amber-400 font-bold">★ {c.rating}</span>
                    </div>

                    <h3 className="text-sm font-extrabold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors line-clamp-1 leading-snug">
                      {c.title}
                    </h3>
                    <p className="text-xs text-[var(--muted)] line-clamp-2 leading-relaxed">
                      {c.tagline}
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {c.skills.slice(0, 2).map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded-md bg-[var(--surface-soft)] border border-[var(--border-soft)] text-[9px] font-medium text-[var(--text)]"
                        >
                          {skill}
                        </span>
                      ))}
                      {c.skills.length > 2 && (
                        <span className="text-[9px] text-[var(--muted)] self-center font-semibold">
                          +{c.skills.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 pt-2.5 border-t border-[var(--border-soft)] bg-[var(--surface-soft)]/30 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 font-bold text-[9px] flex items-center justify-center shrink-0">
                      {c.instructor.avatar}
                    </div>
                    <span className="text-[11px] font-semibold text-[var(--text)] truncate max-w-[80px]">
                      {c.instructor.name}
                    </span>
                  </div>

                  <button
                    onClick={() => navigate(`/learn/${c.id}`)}
                    className="button button-sm text-[11px] py-1 px-2.5 font-bold shrink-0"
                  >
                    View →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Interactive Domain Showcase */}
        <section className="section showcase" id="solutions">
          <SectionHeader
            eyebrow="Domain Specializations"
            title={<>Deep dive into <span className="gradient-text">cutting-edge tech.</span></>}
            copy="Select a specialization to see hands-on curriculum breakdowns, module roadmaps, and sandbox projects."
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
                    Interactive Syllabus & Sandbox
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
              return <article className={`price-card ${plan.popular ? "popular" : ""}`} key={plan.name}>
                {plan.popular && <span className="popular-tag"><Icon name="sparkles" size={13} /> MOST POPULAR</span>}
                <span className="plan-icon"><Icon name={plan.name === "Starter Pass" ? "bolt" : plan.name === "Pro All-Access" ? "sparkles" : "globe"} /></span>
                <h3>{plan.name}</h3><p>{plan.copy}</p>
                <div className="price"><sup>$</sup><b>{price}</b><span>/ month<br />billed {annual ? "annually" : "monthly"}</span></div>
                <button className={plan.popular ? "button" : "price-button"} onClick={() => navigate("/signup")}>Start Learning <Icon name="arrow" /></button>
                <small>WHAT’S INCLUDED</small>
                <ul>{plan.features.map((feature) => <li key={feature}><span><Icon name="check" size={13} /></span>{feature}</li>)}</ul>
              </article>;
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
              <div className="cta-proof"><span><Icon name="check" /> Free Starter Tier</span><span><Icon name="check" /> No credit card</span><span><Icon name="check" /> Self-paced</span></div>
            </div>
            <div className="cta-float"><span className="ai-mark"><Icon name="sparkles" /></span><div><b>Certificate Unlocked</b><small>AI Agent Systems Architect</small></div><span className="done"><Icon name="check" size={13} /></span></div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
