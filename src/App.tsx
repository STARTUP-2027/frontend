import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router";
import { useTheme } from "./app/theme";

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

const productTabs = [
  { id: "analytics", label: "Analytics", icon: "chart" as IconName },
  { id: "automations", label: "AI Automations", icon: "sparkles" as IconName },
  { id: "integrations", label: "Integrations", icon: "grid" as IconName },
  { id: "security", label: "Security", icon: "lock" as IconName },
];

const testimonials = [
  { quote: "We replaced four fragmented tools and gave every team a single source of truth. Our decision velocity doubled in one quarter.", name: "Maya Chen", role: "COO at Lumon", initials: "MC", company: "LUMON" },
  { quote: "The automation layer feels like adding ten operators to the team. Astra turns messy workflows into clean, measurable systems.", name: "Jordan Bell", role: "VP Growth at Arc", initials: "JB", company: "ARC SYSTEMS" },
  { quote: "Enterprise-grade without enterprise drag. We shipped our full data stack in days and have stayed at 99.99% reliability.", name: "Priya Shah", role: "CTO at Northstar", initials: "PS", company: "NORTHSTAR" },
];

const pricing = [
  { name: "Starter", copy: "For teams ready to work smarter.", monthly: 19, features: ["5 team members", "10 AI workflows", "Core analytics", "50+ integrations"] },
  { name: "Pro", copy: "For ambitious teams scaling fast.", monthly: 49, popular: true, features: ["Unlimited members", "Unlimited AI workflows", "Advanced analytics", "Priority support", "Custom dashboards"] },
  { name: "Enterprise", copy: "For organizations built for scale.", monthly: 99, features: ["Everything in Pro", "SSO & advanced security", "Custom data retention", "Dedicated success team"] },
];

export function Logo() {
  return (
    <div className="logo" aria-label="Astra home">
      <span className="logo-mark"><span /></span>
      <span>Astra</span>
    </div>
  );
}

export function SiteNav() {
  const { dark, setDark } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="nav-wrap">
      <nav className="nav">
        <Link to="/" aria-label="Astra home"><Logo /></Link>
        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <div className="nav-item">
            <button className="nav-trigger">Product <Icon name="chevron" size={14} /></button>
            <div className="mega-menu">
              <div className="mega-main">
                <span className="mega-label">Platform</span>
                <Link to="/product/analytics"><i><Icon name="chart" /></i><span><b>Analytics</b><small>Turn live data into clear decisions</small></span></Link>
                <Link to="/product/ai-automations"><i><Icon name="sparkles" /></i><span><b>AI Automations</b><small>Put repetitive work on autopilot</small></span></Link>
                <Link to="/product/integrations"><i><Icon name="grid" /></i><span><b>Integrations</b><small>Connect your entire tech stack</small></span></Link>
                <Link to="/product/security"><i><Icon name="lock" /></i><span><b>Security</b><small>Enterprise control, built in</small></span></Link>
              </div>
              <div className="mega-aside">
                <span className="mega-label">What’s new</span>
                <div className="mega-feature"><span><Icon name="sparkles" /></span><b>Astra Intelligence 2.0</b><p>Meet your new AI operating layer.</p><Link to="/product/ai-automations">Explore the launch <Icon name="arrow" size={14} /></Link></div>
              </div>
            </div>
          </div>
          <div className="nav-item">
            <button className="nav-trigger">Solutions <Icon name="chevron" size={14} /></button>
            <div className="mega-menu solutions-menu">
              <div className="mega-main">
                <span className="mega-label">By team</span>
                <Link to="/solutions/sales"><i><Icon name="chart" /></i><span><b>Sales & revenue</b><small>Turn signals into pipeline</small></span></Link>
                <Link to="/solutions/operations"><i><Icon name="users" /></i><span><b>Operations</b><small>Scale processes without the drag</small></span></Link>
                <Link to="/solutions/product-engineering"><i><Icon name="code" /></i><span><b>Product & engineering</b><small>Ship with shared context</small></span></Link>
                <Link to="/solutions/enterprise"><i><Icon name="globe" /></i><span><b>Enterprise</b><small>Built for global organizations</small></span></Link>
              </div>
              <div className="mega-links">
                <span className="mega-label">By company size</span>
                <Link to="/solutions/startups">Startups <Icon name="arrow" size={14} /></Link>
                <Link to="/solutions/growing-teams">Growing teams <Icon name="arrow" size={14} /></Link>
                <button onClick={() => navigate("/talk-to-sales")}>Enterprise <Icon name="arrow" size={14} /></button>
                <span className="mega-label second">Talk to an expert</span>
                <p>We’ll help you design the right workspace for your team.</p>
              </div>
            </div>
          </div>
          <Link to="/customers">Customers</Link>
          <Link to="/pricing">Pricing</Link>
        </div>
        <div className="nav-actions">
          <button className="theme-toggle" onClick={() => setDark(!dark)} aria-label={`Switch to ${dark ? "light" : "dark"} mode`}>
            <span className={!dark ? "selected" : ""}><Icon name="sun" size={15} /></span>
            <span className={dark ? "selected" : ""}><Icon name="moon" size={15} /></span>
          </button>
          <button className="text-button" onClick={() => navigate("/signin")}>Sign in</button>
          <button className="button button-sm" onClick={() => navigate("/signup")}>Get started <Icon name="arrow" size={15} /></button>
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
          <p>The intelligent workspace for teams<br />building what’s next.</p>
          <span className="status"><i /> All systems normal (99.999% SLA)</span>
        </div>
        <div className="footer-links">
          <div>
            <b>Platform</b>
            <Link to="/product/analytics">Analytics</Link>
            <Link to="/product/ai-automations">AI Automations <small className="badge-pill">NEW</small></Link>
            <Link to="/product/integrations">Integrations</Link>
            <Link to="/product/security">Security</Link>
            <Link to="/pricing">Pricing</Link>
          </div>
          <div>
            <b>Solutions</b>
            <Link to="/solutions/sales">Sales & Revenue</Link>
            <Link to="/solutions/operations">Operations</Link>
            <Link to="/solutions/product-engineering">Product & Eng</Link>
            <Link to="/solutions/enterprise">Enterprise</Link>
            <Link to="/solutions/startups">Startups</Link>
            <Link to="/solutions/growing-teams">Growing Teams</Link>
          </div>
          <div>
            <b>Resources</b>
            <Link to="/customers">Customer Stories</Link>
            <Link to="/product/integrations">API & Webhooks</Link>
            <Link to="/product/security">Trust Center</Link>
            <Link to="/pricing">ROI Calculator</Link>
            <Link to="/talk-to-sales">Schedule Demo</Link>
          </div>
          <div>
            <b>Company</b>
            <Link to="/customers">About Astra</Link>
            <Link to="/talk-to-sales">Contact Sales</Link>
            <Link to="/signin">Sign In</Link>
            <Link to="/signup">Create Account</Link>
            <Link to="/product/security">Privacy & Terms</Link>
          </div>
        </div>
        <div className="newsletter">
          <b>Stay ahead of the curve.</b>
          <p>Monthly insights for ambitious teams.<br />No noise, ever.</p>
          {subscribed ? (
            <div className="newsletter-success">
              <span>✓ You're subscribed! Welcome to Astra insights.</span>
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
        <span>© 2025 Astra Labs, Inc. All rights reserved.</span>
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

function MiniChart({ variant = "area" }: { variant?: "area" | "bars" }) {
  if (variant === "bars") {
    return <div className="mini-bars">{[46, 68, 53, 82, 65, 96, 75, 88, 100, 84, 105, 94].map((height, index) => <i key={index} style={{ height }} />)}</div>;
  }
  return (
    <svg className="area-chart" viewBox="0 0 640 220" preserveAspectRatio="none" aria-label="Upward trending performance chart">
      <defs>
        <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1"><stop stopColor="var(--accent)" stopOpacity=".35" /><stop offset="1" stopColor="var(--accent)" stopOpacity="0" /></linearGradient>
      </defs>
      <path className="chart-grid" d="M0 44h640M0 88h640M0 132h640M0 176h640" />
      <path className="chart-fill" d="M0 190C45 185 57 146 100 154s67 27 105-3 65-78 111-58 64 70 108 45 66-81 109-71 58 33 107-28v181H0Z" />
      <path className="chart-line" d="M0 190C45 185 57 146 100 154s67 27 105-3 65-78 111-58 64 70 108 45 66-81 109-71 58 33 107-28" />
      <circle cx="533" cy="67" r="6" className="chart-dot" />
    </svg>
  );
}

function DashboardPreview({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`dashboard ${compact ? "dashboard-compact" : ""}`}>
      <aside className="dash-sidebar">
        <Logo />
        <div className="dash-nav">
          <span className="active"><Icon name="grid" /> Overview</span>
          <span><Icon name="chart" /> Analytics</span>
          <span><Icon name="sparkles" /> Automations</span>
          <span><Icon name="users" /> Customers</span>
        </div>
        <div className="dash-team"><span>AM</span><div><b>Alex Morgan</b><small>Workspace admin</small></div></div>
      </aside>
      <div className="dash-main">
        <div className="dash-top"><div><small>Overview</small><h3>Good morning, Alex</h3></div><span className="search">Search anything...</span><span className="avatar">AM</span></div>
        <div className="stat-grid">
          <div className="dash-stat"><span>Revenue</span><b>$84,620</b><small className="positive">↗ 18.2%</small></div>
          <div className="dash-stat"><span>Active users</span><b>24,892</b><small className="positive">↗ 12.8%</small></div>
          <div className="dash-stat"><span>Conversion</span><b>14.6%</b><small className="positive">↗ 4.7%</small></div>
        </div>
        <div className="dash-panels">
          <div className="dash-chart">
            <div className="panel-title"><div><span>Revenue overview</span><b>$288,449</b></div><small>Last 12 months⌄</small></div>
            <MiniChart />
            <div className="months"><span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span></div>
          </div>
          <div className="dash-activity">
            <div className="panel-title"><span>Live activity</span><small>View all</small></div>
            {[
              ["VN", "New workspace created", "Just now"],
              ["AR", "Automation completed", "2m ago"],
              ["KT", "Subscription upgraded", "8m ago"],
            ].map((item) => <div className="activity" key={item[1]}><i>{item[0]}</i><div><b>{item[1]}</b><small>{item[2]}</small></div></div>)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const navigate = useNavigate();
  const { dark } = useTheme();
  const [activeTab, setActiveTab] = useState("analytics");
  const [annual, setAnnual] = useState(true);
  const [testimonial, setTestimonial] = useState(0);
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className={`app ${dark ? "dark" : ""}`}>
      <div className="noise" />
      <SiteNav />

      <main>
        <section className="hero">
          <div className="hero-orb orb-one" /><div className="hero-orb orb-two" />
          <div className="hero-copy">
            <Pill><span className="live-dot" /> The intelligent workspace for modern teams <Icon name="arrow" size={14} /></Pill>
            <h1>Turn ambitious ideas into <span>unstoppable growth.</span></h1>
            <p>Astra unifies your data, teams, and AI workflows in one beautifully simple workspace—so you can move from insight to impact, faster.</p>
            <div className="hero-actions">
              <button className="button button-lg" onClick={() => navigate("/signup")}>Start free for 14 days <Icon name="arrow" /></button>
              <button className="button-secondary button-lg" onClick={() => setDemoOpen(true)}><span className="play"><Icon name="play" size={15} /></span> Watch interactive demo</button>
            </div>
            <div className="micro-proof"><span><Icon name="check" size={14} /> No credit card</span><span><Icon name="check" size={14} /> Setup in 2 minutes</span><span><Icon name="check" size={14} /> Cancel anytime</span></div>
          </div>

          <div className="hero-product">
            <div className="product-glow" />
            <div className="browser">
              <div className="browser-bar"><div><i /><i /><i /></div><span>app.astra.ai/dashboard</span><small><Icon name="lock" size={12} /></small></div>
              <DashboardPreview />
            </div>
            <div className="float-card revenue-card">
              <span className="float-icon"><Icon name="chart" /></span>
              <div><small>Monthly revenue</small><b>$84,620</b><em>↗ 18.2%</em></div>
              <MiniChart variant="bars" />
            </div>
            <div className="float-card ai-card">
              <span className="ai-mark"><Icon name="sparkles" /></span>
              <div><b>AI workflow complete</b><small>1,248 records enriched</small></div>
              <span className="done"><Icon name="check" size={13} /></span>
            </div>
            <div className="float-card users-card">
              <div className="avatar-stack"><i>MK</i><i>JD</i><i>SL</i><i>+8</i></div>
              <div><b>24 teammates online</b><small>Working across 6 projects</small></div>
            </div>
          </div>

          <div className="trusted">
            <div className="live-users"><span className="avatar-stack"><i>AM</i><i>JK</i><i>PS</i></span><span><b>2,840 teams</b> joined this month</span><span className="ticker-dot" /></div>
            <p>Trusted by forward-thinking teams at</p>
            <div className="logos"><span>vertex</span><span className="logo-bold">NORTHSTAR</span><span>∞ LUMON</span><span className="logo-bold">QUANT</span><span>arc systems</span></div>
          </div>
        </section>

        <section className="section features" id="features">
          <SectionHeader eyebrow="Built for momentum" title={<>Everything you need to turn <span className="gradient-text">motion into growth.</span></>} copy="One intelligent platform. Every workflow connected. Endless ways to move your business forward." />
          <div className="bento">
            <article className="bento-card analytics-card">
              <div className="card-icon"><Icon name="chart" /></div>
              <div className="card-copy"><Pill>INSIGHT ENGINE</Pill><h3>See the signal.<br />Skip the noise.</h3><p>Turn live data into clear decisions with AI-powered analytics that surface what matters.</p></div>
              <div className="analytics-widget">
                <div className="widget-top"><span><i /> Revenue</span><small>Last 30 days⌄</small></div>
                <div className="metric-line"><b>$284,620</b><em>↗ 24.8%</em></div>
                <MiniChart />
                <span className="chart-tooltip"><b>$28,493</b><small>May 18</small></span>
              </div>
            </article>
            <article className="bento-card automation-card">
              <div className="card-icon"><Icon name="sparkles" /></div>
              <div className="card-copy"><Pill>AI AUTOMATIONS</Pill><h3>Your busiest work,<br />handled automatically.</h3><p>Build powerful AI workflows in minutes—no code, no bottlenecks.</p></div>
              <div className="workflow">
                <div className="flow-node"><i className="flow-purple"><Icon name="bolt" /></i><div><small>WHEN THIS HAPPENS</small><b>New lead created</b></div><span className="toggle-on" /></div>
                <span className="flow-line" />
                <div className="flow-node"><i className="flow-pink"><Icon name="sparkles" /></i><div><small>ASTRA AI</small><b>Enrich & score lead</b></div><em>2.4s</em></div>
                <span className="flow-line" />
                <div className="flow-node"><i className="flow-blue"><Icon name="arrow" /></i><div><small>THEN DO THIS</small><b>Route to sales team</b></div><span className="done"><Icon name="check" size={12} /></span></div>
              </div>
            </article>
            <article className="bento-card integrations-card">
              <div className="card-copy"><Pill>INTEGRATIONS</Pill><h3>Plays well with your entire stack.</h3><p>Connect 150+ tools with one click. Your data stays perfectly in sync.</p></div>
              <div className="integration-orbit">
                <span className="center-logo"><Logo /></span>
                {["S", "N", "◆", "G", "Z", "F", "H", "W"].map((item, index) => <i key={index} style={{ "--i": index } as React.CSSProperties}>{item}</i>)}
              </div>
              <span className="integration-count"><Icon name="plus" size={14} /> 150 integrations</span>
            </article>
            <article className="bento-card security-card">
              <div className="security-art">
                <div className="shield"><Icon name="lock" size={28} /><span /></div>
                <div className="orbit-lines" /><i className="security-check check-one"><Icon name="check" size={12} /></i><i className="security-check check-two"><Icon name="check" size={12} /></i>
              </div>
              <div className="card-copy"><Pill>ENTERPRISE SECURITY</Pill><h3>Your trust is our infrastructure.</h3><p>SOC 2 Type II, SSO, and enterprise-grade encryption—built in from day one.</p></div>
              <div className="security-badges"><span>SOC<br /><b>2</b></span><span>GDPR<br /><b>READY</b></span><span>256<br /><b>BIT</b></span></div>
            </article>
          </div>
        </section>

        <section className="section showcase" id="solutions">
          <SectionHeader eyebrow="See Astra in action" title={<>One workspace. <span className="gradient-text">Infinite possibilities.</span></>} copy="Explore how Astra brings every part of your operation together in one seamless experience." />
          <div className="tabs" role="tablist">
            {productTabs.map((tab) => <button key={tab.id} className={activeTab === tab.id ? "active" : ""} onClick={() => setActiveTab(tab.id)}><Icon name={tab.icon} /> {tab.label}</button>)}
          </div>
          <div className="showcase-shell">
            <div className="showcase-top"><span>{productTabs.find((tab) => tab.id === activeTab)?.label} workspace</span><small>Live preview</small></div>
            <div className="showcase-content" key={activeTab}>
              <div className="showcase-copy">
                <Pill>{activeTab === "analytics" ? "LIVE INTELLIGENCE" : activeTab === "automations" ? "SMART WORKFLOWS" : activeTab === "integrations" ? "CONNECTED STACK" : "TOTAL CONTROL"}</Pill>
                <h3>{activeTab === "analytics" ? "Know what’s working—before the meeting starts." : activeTab === "automations" ? "Build once. Let intelligence do the rest." : activeTab === "integrations" ? "Every tool, finally speaking the same language." : "Move quickly without compromising trust."}</h3>
                <p>{activeTab === "analytics" ? "Live dashboards connect every signal across your business, then surface the patterns, opportunities, and risks that need your attention." : "Purpose-built tools that help your team accomplish more with less friction."}</p>
                <ul><li><Icon name="check" /> Real-time performance signals</li><li><Icon name="check" /> AI-generated forecasts</li><li><Icon name="check" /> Fully customizable views</li></ul>
                <button className="inline-link">Explore {activeTab} <Icon name="arrow" /></button>
              </div>
              <div className="showcase-dashboard"><DashboardPreview compact /></div>
            </div>
          </div>
        </section>

        <section className="metrics-band" id="customers">
          <div className="metrics-orb" />
          <div className="metrics-intro"><Pill>Built to perform</Pill><h2>Numbers that speak<br />for themselves.</h2><p>From first workflow to global scale, Astra is the engine behind teams that refuse to slow down.</p></div>
          <div className="metrics-grid">
            <div><span><Icon name="chart" /></span><b>$2.4B<em>+</em></b><p>Processed through Astra</p><small>↗ 42% year over year</small></div>
            <div><span><Icon name="bolt" /></span><b>99.99<em>%</em></b><p>Platform uptime</p><small>Last 12 months</small></div>
            <div><span><Icon name="users" /></span><b>150K<em>+</em></b><p>High-performing teams</p><small>Across 120 countries</small></div>
            <div><span><Icon name="clock" /></span><b>18M<em> hrs</em></b><p>Saved with automations</p><small>And counting</small></div>
          </div>
        </section>

        <section className="section testimonials">
          <SectionHeader eyebrow="Loved by teams" title={<>The people building what’s next <span className="gradient-text">choose Astra.</span></>} copy="Join thousands of teams turning complexity into momentum." />
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

        <section className="section pricing" id="pricing">
          <SectionHeader eyebrow="Simple, transparent pricing" title={<>Start small. <span className="gradient-text">Scale without limits.</span></>} copy="Every plan includes a 14-day free trial. No credit card required." />
          <div className="billing-toggle"><span className={!annual ? "active" : ""}>Monthly</span><button onClick={() => setAnnual(!annual)} className={annual ? "on" : ""} aria-label="Toggle annual billing"><i /></button><span className={annual ? "active" : ""}>Annually</span><Pill tone="green">SAVE 20%</Pill></div>
          <div className="pricing-grid">
            {pricing.map((plan) => {
              const price = annual ? Math.round(plan.monthly * 0.8) : plan.monthly;
              return <article className={`price-card ${plan.popular ? "popular" : ""}`} key={plan.name}>
                {plan.popular && <span className="popular-tag"><Icon name="sparkles" size={13} /> MOST POPULAR</span>}
                <span className="plan-icon"><Icon name={plan.name === "Starter" ? "bolt" : plan.name === "Pro" ? "sparkles" : "globe"} /></span>
                <h3>{plan.name}</h3><p>{plan.copy}</p>
                <div className="price"><sup>$</sup><b>{price}</b><span>/ user<br />/ month</span></div>
                <button className={plan.popular ? "button" : "price-button"} onClick={() => navigate(plan.name === "Enterprise" ? "/talk-to-sales" : "/signup")}>{plan.name === "Enterprise" ? "Talk to sales" : "Start free trial"} <Icon name="arrow" /></button>
                <small>WHAT’S INCLUDED</small>
                <ul>{plan.features.map((feature) => <li key={feature}><span><Icon name="check" size={13} /></span>{feature}</li>)}</ul>
              </article>;
            })}
          </div>
          <p className="pricing-note">All plans include SSL encryption, 99.99% uptime, and access to our community. <button>Compare all features <Icon name="arrow" size={14} /></button></p>
        </section>

        <section className="cta-section">
          <div className="cta-card">
            <div className="cta-grid" /><div className="cta-orb cta-orb-one" /><div className="cta-orb cta-orb-two" />
            <div className="cta-content"><Pill>YOUR NEXT CHAPTER STARTS HERE</Pill><h2>Build the business<br />you can’t stop thinking about.</h2><p>Join 150,000+ teams already moving faster with Astra.<br />Your first 14 days are on us.</p>
              <form className="signup" onSubmit={(event) => event.preventDefault()}><input type="email" placeholder="Enter your work email" aria-label="Work email" required /><button className="button">Start free <Icon name="arrow" /></button></form>
              <div className="cta-proof"><span><Icon name="check" /> Free 14-day trial</span><span><Icon name="check" /> No credit card</span><span><Icon name="check" /> Cancel anytime</span></div>
            </div>
            <div className="cta-float"><span className="ai-mark"><Icon name="sparkles" /></span><div><b>Your workspace is ready</b><small>Set up in just 1 minute 48 seconds</small></div><span className="done"><Icon name="check" size={13} /></span></div>
          </div>
        </section>
      </main>

      <SiteFooter />
      {demoOpen && <div className="demo-modal" role="dialog" aria-modal="true" aria-label="Interactive Astra demo"><button className="modal-backdrop" onClick={() => setDemoOpen(false)} aria-label="Close demo" /><div className="demo-dialog"><button className="modal-close" onClick={() => setDemoOpen(false)} aria-label="Close demo">×</button><Pill><Icon name="sparkles" size={13} /> INTERACTIVE TOUR</Pill><h2>See momentum in motion.</h2><p>Explore how one intelligent workspace connects signals, automates work, and keeps every team moving together.</p><div className="demo-screen"><DashboardPreview compact /><span className="demo-play"><Icon name="play" size={22} /></span></div><button className="button button-lg" onClick={() => navigate("/signup")}>Start building free <Icon name="arrow" /></button></div></div>}
    </div>
  );
}
