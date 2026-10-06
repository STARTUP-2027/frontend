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
                    <Link to="/product/ai-automations"><i><Icon name="sparkles" /></i><span><b>AI & Machine Learning</b><small>Autonomous Agents, RAG & LLMs</small></span></Link>
                    <Link to="/product/analytics"><i><Icon name="code" /></i><span><b>Full-Stack & Systems</b><small>React 19, Next.js & Distributed DBs</small></span></Link>
                    <Link to="/product/security"><i><Icon name="lock" /></i><span><b>Cybersecurity & Zero Trust</b><small>Offensive Security & Rust Systems</small></span></Link>
                    <Link to="/product/integrations"><i><Icon name="grid" /></i><span><b>DevOps & Cloud</b><small>Kubernetes, Docker & GitOps</small></span></Link>
                  </div>
                  <div className="mega-aside">
                    <span className="mega-label">Featured Masterclass</span>
                    <div className="mega-feature">
                      <span><Icon name="sparkles" /></span>
                      <b>AI Agents & Multi-Agent Graphs 2026</b>
                      <p>Master LangGraph, vector search, and tool execution.</p>
                      <Link to="/courses">Explore Catalog <Icon name="arrow" size={14} /></Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="nav-item">
                <button className="nav-trigger">Learning Tracks <Icon name="chevron" size={14} /></button>
                <div className="mega-menu solutions-menu">
                  <div className="mega-main">
                    <span className="mega-label">By Career Goal</span>
                    <Link to="/solutions/sales"><i><Icon name="bolt" /></i><span><b>Zero to Job-Ready</b><small>Structured career transition</small></span></Link>
                    <Link to="/solutions/product-engineering"><i><Icon name="code" /></i><span><b>Senior & Staff Engineer</b><small>Deep architectural mastery</small></span></Link>
                    <Link to="/solutions/enterprise"><i><Icon name="globe" /></i><span><b>Team Upskilling</b><small>Engineering org training</small></span></Link>
                    <Link to="/solutions/startups"><i><Icon name="chart" /></i><span><b>Founder & Builders</b><small>Build and ship full-stack MVPs</small></span></Link>
                  </div>
                  <div className="mega-links">
                    <span className="mega-label">Specializations</span>
                    <Link to="/courses">AI Engineering <Icon name="arrow" size={14} /></Link>
                    <Link to="/courses">Cloud & Microservices <Icon name="arrow" size={14} /></Link>
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
            <Link to="/product/ai-automations">AI & Agentic Systems</Link>
            <Link to="/product/analytics">React 19 & Next.js</Link>
            <Link to="/product/security">Rust Systems & Security</Link>
            <Link to="/product/integrations">Kubernetes & DevOps</Link>
            <Link to="/courses">Full Course Catalog</Link>
          </div>
          <div>
            <b>Learning Tracks</b>
            <Link to="/solutions/sales">Zero to Job-Ready</Link>
            <Link to="/solutions/product-engineering">Senior Engineer Mastery</Link>
            <Link to="/solutions/enterprise">Team Upskilling</Link>
            <Link to="/solutions/startups">Founder & Builders</Link>
            <Link to="/pricing">All-Access Pass</Link>
          </div>
          <div>
            <b>Platform Hub</b>
            <Link to="/dashboard">Student Dashboard</Link>
            <Link to="/admin">Course Creator Studio</Link>
            <Link to="/signin">Sign In (Demo Accounts)</Link>
            <Link to="/signup">Create Account</Link>
            <Link to="/talk-to-sales">Enterprise Training</Link>
          </div>
          <div>
            <b>Community</b>
            <Link to="/customers">Alumni Stories</Link>
            <Link to="/courses">Certifications</Link>
            <Link to="/product/security">Trust & Quality</Link>
            <Link to="/pricing">Pricing & FAQ</Link>
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
              <div
                key={c.id}
                className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] hover:border-[var(--accent)] shadow-xl transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div
                    className="h-24 rounded-2xl p-3 flex flex-col justify-between text-white shadow-inner"
                    style={{ background: c.bannerGradient }}
                  >
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-black/40 w-fit">
                      {c.categoryLabel}
                    </span>
                    <span className="text-base font-black">{c.price === 0 ? "FREE" : `$${c.price}`}</span>
                  </div>

                  <h3 className="text-sm font-extrabold leading-tight">{c.title}</h3>
                  <p className="text-xs text-[var(--muted)] line-clamp-2">{c.tagline}</p>
                </div>

                <div className="pt-3 border-t border-[var(--border-soft)] flex items-center justify-between">
                  <span className="text-xs text-[var(--muted)]">⏱️ {c.duration}</span>
                  <button onClick={() => navigate(`/learn/${c.id}`)} className="button button-sm text-xs">
                    View Course →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Interactive Domain Showcase */}
        <section className="section showcase" id="solutions">
          <SectionHeader eyebrow="Domain Specializations" title={<>Deep dive into <span className="gradient-text">cutting-edge tech.</span></>} copy="Select a specialization to see hands-on curriculum breakdowns and sandbox projects." />
          <div className="tabs" role="tablist">
            {courseTabs.map((tab) => <button key={tab.id} className={activeTab === tab.id ? "active" : ""} onClick={() => setActiveTab(tab.id)}><Icon name={tab.icon} /> {tab.label}</button>)}
          </div>
          <div className="showcase-shell">
            <div className="showcase-top"><span>{courseTabs.find((tab) => tab.id === activeTab)?.label} Track</span><small>Syllabus Preview</small></div>
            <div className="showcase-content" key={activeTab}>
              <div className="showcase-copy">
                <Pill>{activeTab === "ai" ? "AGENTIC AI & RAG" : activeTab === "fullstack" ? "REACT 19 & NEXT.JS" : activeTab === "security" ? "ZERO TRUST & RUST" : "KUBERNETES GITOPS"}</Pill>
                <h3>{activeTab === "ai" ? "Build autonomous multi-agent swarms with LangGraph." : activeTab === "fullstack" ? "Ship zero-bundle-size RSCs with edge streaming." : activeTab === "security" ? "Architect memory-safe microservices with Rust." : "Automate multi-cluster cloud deployments with ArgoCD."}</h3>
                <p>Complete real-world engineering challenges, submit code for automated test evaluation, and receive personalized feedback.</p>
                <ul><li><Icon name="check" /> Live interactive code execution</li><li><Icon name="check" /> Production-ready architectural blueprints</li><li><Icon name="check" /> Verified completion certificate</li></ul>
                <button onClick={() => navigate("/courses")} className="inline-link">Browse {activeTab} Masterclasses <Icon name="arrow" /></button>
              </div>
              <div className="showcase-dashboard p-6 bg-[var(--surface)] rounded-2xl border border-[var(--border)]">
                <h4 className="text-xs font-bold uppercase text-[var(--accent)] mb-3">Module Roadmap</h4>
                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-[var(--surface-soft)] border border-[var(--border-soft)] flex justify-between items-center">
                    <span>1. Foundations & Architecture</span>
                    <span className="text-emerald-400 font-bold text-[10px]">Included</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--surface-soft)] border border-[var(--border-soft)] flex justify-between items-center">
                    <span>2. Production Sandbox Lab</span>
                    <span className="text-purple-400 font-bold text-[10px]">Hands-on</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--surface-soft)] border border-[var(--border-soft)] flex justify-between items-center">
                    <span>3. Capstone Project & Certification</span>
                    <span className="text-indigo-400 font-bold text-[10px]">Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
