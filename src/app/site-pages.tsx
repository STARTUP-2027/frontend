import { useState, type FormEvent, type ReactNode } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router";
import { SiteFooter, SiteNav } from "../App";
import { useTheme } from "./theme";
import { useAuth } from "./context/AuthContext";

function Mark() {
  return <Link to="/" className="page-logo"><span className="page-logo-mark"><i /></span><b>Astra</b></Link>;
}

function Arrow() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}

function Check() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg>;
}

function PageShell({ children }: { children: ReactNode }) {
  const { dark } = useTheme();
  return (
    <div className={`subpage app ${dark ? "dark" : ""}`}>
      <div className="subpage-noise" />
      <SiteNav />
      {children}
      <SiteFooter />
    </div>
  );
}

export function AuthPage({ mode }: { mode: "signin" | "signup" }) {
  const isSignup = mode === "signup";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const { login, switchRole } = useAuth();
  const navigate = useNavigate();

  function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    const res = login(email, password);
    if (res.success) {
      if (email.includes("admin")) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } else {
      setError(res.message || "Invalid credentials");
    }
  }

  const handleQuickLogin = (role: "student" | "admin") => {
    switchRole(role);
    if (role === "admin") {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <PageShell>
      <main className="auth-layout">
        <section className="auth-story">
          <div className="auth-orb" />
          <div className="story-content">
            <span className="eyebrow">ASTRA ACADEMY</span>
            <h1>{isSignup ? <>Your tech journey is<br /><em>about to begin.</em></> : <>Welcome back to<br /><em>your momentum.</em></>}</h1>
            <p>{isSignup ? "Join 150,000+ developers mastering AI systems, modern cloud, and full-stack engineering." : "Continue where you left off. Your code sandboxes, project builds, and certificates are waiting."}</p>
            <div className="story-proof">
              <div className="story-avatars"><i>AV</i><i>JB</i><i>MS</i><i>+15K</i></div>
              <span><b>4.95 out of 5</b><small>from 15,000+ engineers at OpenAI, Google & Stripe</small></span>
            </div>
            <blockquote>“Astra Academy replaced 5 scattered bootcamps. The interactive RAG sandboxes and agentic modules helped me land a Staff AI role.”<footer><i>AV</i><span><b>Aris Vance</b><small>AI Engineer at Anthropic Alumni</small></span></footer></blockquote>
          </div>
        </section>
        <section className="auth-panel">
          <div className="auth-card">
            <span className="mobile-mark"><Mark /></span>
            <h2>{isSignup ? "Create your free account" : "Sign in to Astra Academy"}</h2>
            <p>{isSignup ? "Start learning in less than two minutes." : "Access your student dashboard and courses."}</p>

            {/* Fixed Test Credentials Box for Easy Evaluation */}
            <div className="p-3.5 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs space-y-2 mb-4">
              <div className="flex items-center gap-1.5 font-bold text-[var(--accent)]">
                <span>⚡</span> Fixed Demo Credentials:
              </div>
              <div className="flex flex-col gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleQuickLogin("student")}
                  className="w-full text-left p-2 rounded-lg bg-[var(--surface)] hover:border-[var(--accent)] border border-[var(--border-soft)] flex justify-between items-center transition-all group"
                >
                  <div>
                    <span className="font-bold text-[var(--text)]">🎓 Student:</span> <code>student@astra.edu</code> / <code>student123</code>
                  </div>
                  <span className="text-[10px] font-bold text-[var(--accent)] group-hover:underline">1-Click Login →</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin("admin")}
                  className="w-full text-left p-2 rounded-lg bg-[var(--surface)] hover:border-purple-400 border border-[var(--border-soft)] flex justify-between items-center transition-all group"
                >
                  <div>
                    <span className="font-bold text-purple-400">👑 Admin/Creator:</span> <code>admin@astra.edu</code> / <code>admin123</code>
                  </div>
                  <span className="text-[10px] font-bold text-purple-400 group-hover:underline">1-Click Login →</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold mb-3">
                {error}
              </div>
            )}

            <form onSubmit={submit}>
              <label>
                Email or Username
                <input
                  required
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@astra.edu or admin@astra.edu"
                  autoComplete="email"
                />
              </label>
              <label className="password-label">
                <span>Password {isSignup ? <small>8+ characters</small> : <Link to="/signin">Forgot password?</Link>}</span>
                <input
                  required
                  type={visible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isSignup ? "Create a strong password" : "Enter your password (e.g. student123)"}
                  autoComplete={isSignup ? "new-password" : "current-password"}
                />
                <button type="button" onClick={() => setVisible(!visible)}>{visible ? "Hide" : "Show"}</button>
              </label>
              {!isSignup && <label className="remember"><input type="checkbox" defaultChecked /> Keep me signed in</label>}
              <button className="auth-submit">{isSignup ? "Create free student account" : "Sign in to Academy"} <Arrow /></button>
              {isSignup && <small className="terms">By creating an account, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.</small>}
            </form>

            <p className="auth-switch">{isSignup ? "Already have an account?" : "New to Astra Academy?"} <Link to={isSignup ? "/signin" : "/signup"}>{isSignup ? "Sign in" : "Create free account"}</Link></p>
          </div>
        </section>
      </main>
    </PageShell>
  );
}

export function SalesPage() {
  const [submitted, setSubmitted] = useState(false);
  const { dark } = useTheme();
  return (
    <div className={`subpage app sales-page ${dark ? "dark" : ""}`}>
      <SiteNav />
      <main className="sales-layout">
        <section className="sales-copy">
          <span className="eyebrow">LET’S BUILD WHAT’S NEXT</span>
          <h1>Scale your ambition.<br /><em>Not your complexity.</em></h1>
          <p>Tell us where you’re headed. Our team will show you how Astra can unify your data, automate critical work, and give every team the clarity to move faster.</p>
          <ul><li><span><Check /></span><div><b>A workspace designed around you</b><small>Custom workflows, permissions, and migration guidance.</small></div></li><li><span><Check /></span><div><b>Enterprise security from day one</b><small>SSO, SCIM, SOC 2 Type II, and advanced controls.</small></div></li><li><span><Check /></span><div><b>A partner for every stage of growth</b><small>Dedicated success, onboarding, and priority support.</small></div></li></ul>
          <div className="sales-logos"><small>TRUSTED BY TEAMS AT</small><div><b>vertex</b><b>NORTHSTAR</b><b>∞ LUMON</b><b>QUANT</b></div></div>
        </section>
        <section className="sales-form-wrap">
          <div className="sales-form-card">
            {submitted ? <div className="sales-success"><span><Check /></span><h2>Thanks for reaching out.</h2><p>One of our workspace experts will be in touch within one business day.</p><Link to="/">Back to Astra <Arrow /></Link></div> :
            <><div><span className="form-step">PERSONALIZED DEMO</span><h2>Talk to our sales team</h2><p>See how Astra can work for your organization.</p></div>
            <form onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
              <div className="field-row"><label>First name<input required placeholder="Alex" /></label><label>Last name<input required placeholder="Morgan" /></label></div>
              <label>Work email<input required type="email" placeholder="alex@company.com" /></label>
              <label>Company name<input required placeholder="Acme, Inc." /></label>
              <div className="field-row"><label>Company size<select defaultValue=""><option value="" disabled>Select size</option><option>1–50</option><option>51–250</option><option>251–1,000</option><option>1,000+</option></select></label><label>Country<select defaultValue=""><option value="" disabled>Select country</option><option>United States</option><option>United Kingdom</option><option>Canada</option><option>Australia</option><option>Other</option></select></label></div>
              <label>What would you like to accomplish?<textarea placeholder="Tell us about your goals, team, and current workflow..." /></label>
              <button className="auth-submit">Request my demo <Arrow /></button>
              <small className="terms">By submitting, you agree to Astra’s <a href="#">Privacy Policy</a>.</small>
            </form></>}
          </div>
          <div className="sales-note"><span>AM</span><p>“Our sales engineer understood our operation immediately. We had a working plan before the call ended.”<small>Alex Morgan · VP Operations</small></p></div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

const detailContent: Record<string, { eyebrow: string; title: string; accent: string; copy: string; metric: string; metricLabel: string; features: Array<[string, string]> }> = {
  analytics: { eyebrow: "ASTRA ANALYTICS", title: "See the whole story.", accent: "Act on what matters.", copy: "Connect every signal across your business and turn live data into decisions your entire team can trust.", metric: "42%", metricLabel: "faster decisions", features: [["Live intelligence", "Watch every critical metric update in real time."], ["AI forecasts", "Spot opportunities and risks before they become obvious."], ["Flexible views", "Build dashboards for every team, goal, and workflow."]] },
  "ai-automations": { eyebrow: "ASTRA AI AUTOMATIONS", title: "Your best processes.", accent: "Running themselves.", copy: "Transform repeatable work into intelligent systems that operate around the clock without losing the human context.", metric: "18M", metricLabel: "hours automated", features: [["No-code builder", "Launch sophisticated workflows with simple building blocks."], ["Intelligent routing", "Send every task to the right person at the right moment."], ["Human approval", "Keep your team in control of every important decision."]] },
  integrations: { eyebrow: "ASTRA INTEGRATIONS", title: "Every tool.", accent: "One connected system.", copy: "Bring your entire stack together with secure, reliable integrations that keep every team and data point perfectly in sync.", metric: "150+", metricLabel: "native integrations", features: [["One-click setup", "Connect the tools you already use in a few moments."], ["Two-way sync", "Keep information current everywhere, automatically."], ["Developer platform", "Build anything with flexible APIs and webhooks."]] },
  security: { eyebrow: "ASTRA SECURITY", title: "Move fast.", accent: "Stay in control.", copy: "Enterprise-grade security, governance, and compliance protect your most important work at every layer.", metric: "99.99%", metricLabel: "platform uptime", features: [["Advanced identity", "SSO, SCIM, and granular role-based access."], ["Complete governance", "Audit logs and controls that scale with your organization."], ["Protected by design", "Encryption in transit and at rest, always on."]] },
  sales: { eyebrow: "ASTRA FOR SALES", title: "Turn every signal.", accent: "Into revenue.", copy: "Give your revenue team one intelligent view of every account, conversation, and opportunity so they can focus on the deals that matter.", metric: "31%", metricLabel: "more pipeline", features: [["Account intelligence", "Know which buyers are ready before they raise a hand."], ["Automated follow-up", "Keep every opportunity moving without manual busywork."], ["Reliable forecasts", "Build a clearer view of revenue with live signals."]] },
  operations: { eyebrow: "ASTRA FOR OPERATIONS", title: "Build systems.", accent: "Not bottlenecks.", copy: "Design resilient operations that scale with your ambition, connecting people, process, and data in one adaptive workspace.", metric: "2.8×", metricLabel: "faster execution", features: [["Process command center", "See ownership, progress, and risk across every workflow."], ["Smart intake", "Turn requests into structured, prioritized action."], ["Continuous improvement", "Find and fix process friction with live intelligence."]] },
  "product-engineering": { eyebrow: "ASTRA FOR PRODUCT & ENGINEERING", title: "Shared context.", accent: "Better products.", copy: "Connect strategy, discovery, and delivery so every product decision is grounded in customer and business impact.", metric: "38%", metricLabel: "faster shipping", features: [["Connected roadmaps", "Link every project to the outcomes it is designed to move."], ["Feedback intelligence", "Turn thousands of customer signals into clear themes."], ["Delivery visibility", "Keep stakeholders aligned without another status meeting."]] },
  enterprise: { eyebrow: "ASTRA ENTERPRISE", title: "Global scale.", accent: "Without the drag.", copy: "Unify complex organizations with the control, reliability, and dedicated partnership global teams expect.", metric: "120", metricLabel: "countries supported", features: [["Enterprise controls", "Manage identity, permissions, and data at global scale."], ["Dedicated partnership", "Expert guidance from rollout through transformation."], ["Flexible architecture", "Adapt Astra to your operating model, not the reverse."]] },
  startups: { eyebrow: "ASTRA FOR STARTUPS", title: "Build momentum.", accent: "Before headcount.", copy: "Give a small, ambitious team the operating power of a company ten times its size with intelligent workflows from day one.", metric: "10×", metricLabel: "operating leverage", features: [["Launch in minutes", "Start with proven workflows and adapt them as you grow."], ["AI-powered execution", "Automate the work that slows small teams down."], ["One source of truth", "Keep everyone aligned without adding more meetings."]] },
  "growing-teams": { eyebrow: "ASTRA FOR GROWING TEAMS", title: "Scale the company.", accent: "Keep the clarity.", copy: "Replace scattered systems with one connected operating layer built to preserve speed through every stage of growth.", metric: "60%", metricLabel: "less busywork", features: [["Cross-team clarity", "Give every function the context it needs to move."], ["Repeatable systems", "Turn your best practices into workflows that scale."], ["Actionable insights", "Understand performance without stitching reports together."]] },
};

function DetailNav() {
  return <header className="detail-nav"><Mark /><nav><Link to="/product/analytics">Product</Link><Link to="/solutions/operations">Solutions</Link><Link to="/customers">Customers</Link><Link to="/pricing">Pricing</Link></nav><div><Link to="/signin">Sign in</Link><Link className="detail-nav-cta" to="/signup">Get started <Arrow /></Link></div></header>;
}

function PricingDetail() {
  const plans = [
    ["Starter", "$19", "For small teams building their first connected workspace.", ["5 team members", "Core analytics", "10 AI workflows"]],
    ["Pro", "$49", "For ambitious teams ready to scale their operating system.", ["Unlimited members", "Advanced analytics", "Unlimited workflows"]],
    ["Enterprise", "Custom", "For organizations that need control, security, and partnership.", ["SSO and SCIM", "Dedicated success", "Custom governance"]],
  ];
  return <><section className="detail-hero pricing-detail-hero"><span className="eyebrow">SIMPLE, TRANSPARENT PRICING</span><h1>Invest in momentum.<br /><em>Scale without limits.</em></h1><p>Start free for 14 days. Upgrade when your team is ready. Every plan includes enterprise-grade reliability.</p></section><section className="detail-pricing">{plans.map((plan, index) => <article className={index === 1 ? "featured" : ""} key={plan[0]}>{index === 1 && <span className="detail-popular">MOST POPULAR</span>}<small>0{index + 1}</small><h2>{plan[0]}</h2><p>{plan[2]}</p><strong>{plan[1]}{plan[1].startsWith("$") && <em>/ user / month</em>}</strong><Link to={index === 2 ? "/talk-to-sales" : "/signup"}>{index === 2 ? "Talk to sales" : "Start free"} <Arrow /></Link><ul>{plan[3].map((item) => <li key={item}><span><Check /></span>{item}</li>)}</ul></article>)}</section></>;
}

function CustomersDetail() {
  return <><section className="detail-hero"><span className="eyebrow">CUSTOMER STORIES</span><h1>Built by teams who<br /><em>refuse to stand still.</em></h1><p>See how ambitious companies use Astra to turn complexity into clarity, momentum, and measurable growth.</p><div className="detail-hero-actions"><Link to="/signup">Start your story <Arrow /></Link><Link to="/talk-to-sales">Talk to our team</Link></div></section><section className="story-grid">{[["LUMON","2.4×","faster decision cycles","Astra gave every leader the same live view of the business—and gave us our speed back."],["NORTHSTAR","41%","less operational work","We now spend our time improving the system instead of manually running it."],["VERTEX","$18M","pipeline influenced","Astra tells our revenue team where to focus before the opportunity becomes obvious."]].map((story,index) => <article key={story[0]}><div className={`story-visual visual-${index + 1}`}><span>{story[0]}</span><b>{story[1]}</b><small>{story[2]}</small></div><blockquote>“{story[3]}”</blockquote><Link to="/talk-to-sales">Read the story <Arrow /></Link></article>)}</section></>;
}

export function DetailPage() {
  const { slug } = useParams();
  const location = useLocation();
  const { dark } = useTheme();
  const isPricing = location.pathname === "/pricing";
  const isCustomers = location.pathname === "/customers";
  const content = detailContent[slug || "analytics"] || detailContent.analytics;

  return <div className={`detail-page app ${dark ? "dark" : ""}`}><SiteNav /><main>{isPricing ? <PricingDetail /> : isCustomers ? <CustomersDetail /> : <><section className="detail-hero"><span className="eyebrow">{content.eyebrow}</span><h1>{content.title}<br /><em>{content.accent}</em></h1><p>{content.copy}</p><div className="detail-hero-actions"><Link to="/signup">Start free for 14 days <Arrow /></Link><Link to="/talk-to-sales">Talk to sales</Link></div></section><section className="detail-product"><div className="detail-window"><div className="detail-window-bar"><i /><i /><i /><span>app.astra.ai</span></div><div className="detail-window-body"><aside><Mark /><span /><span /><span /><span /></aside><div className="detail-canvas"><small>LIVE WORKSPACE</small><h2>{content.accent}</h2><div className="detail-chart"><span /><span /><span /><span /><span /><span /><span /><span /></div><div className="detail-stats"><div><small>PERFORMANCE</small><b>{content.metric}</b></div><div><small>WORKFLOWS</small><b>1,248</b></div><div><small>TEAM VELOCITY</small><b>+38%</b></div></div></div></div></div><div className="detail-metric"><span>{content.metric}</span><p>{content.metricLabel}</p></div></section><section className="detail-features"><span className="eyebrow">EVERYTHING IN ONE PLACE</span><h2>Designed to create<br />measurable momentum.</h2><div>{content.features.map((feature,index) => <article key={feature[0]}><span>0{index + 1}</span><h3>{feature[0]}</h3><p>{feature[1]}</p><Link to="/signup">Explore feature <Arrow /></Link></article>)}</div></section></>}</main><section className="detail-cta"><span className="eyebrow">YOUR NEXT CHAPTER</span><h2>Ready to move faster?</h2><p>Build your intelligent workspace today. No credit card required.</p><Link to="/signup">Start free for 14 days <Arrow /></Link></section><SiteFooter /></div>;
}
