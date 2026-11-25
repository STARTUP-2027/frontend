import { useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate } from "react-router";
import { SiteFooter, SiteNav } from "../App";
import { useTheme } from "./theme";
import { useAuth } from "./context/AuthContext";

function Mark() {
  return (
    <Link to="/" className="page-logo">
      <span className="page-logo-mark"><i /></span>
      <b>Astra Academy</b>
    </Link>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
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
            <h1>
              {isSignup ? (
                <>Your tech journey is<br /><em>about to begin.</em></>
              ) : (
                <>Welcome back to<br /><em>your momentum.</em></>
              )}
            </h1>
            <p>
              {isSignup
                ? "Join 150,000+ developers mastering AI systems, modern cloud, and full-stack engineering."
                : "Continue where you left off. Your masterclasses, DSA sheets, project builds, and certificates are waiting."}
            </p>
            <div className="story-proof">
              <div className="story-avatars"><i>AV</i><i>JB</i><i>MS</i><i>+15K</i></div>
              <span><b>4.95 out of 5</b><small>from 15,000+ engineers at OpenAI, Google & Stripe</small></span>
            </div>
            <blockquote>
              “Astra Academy replaced 5 scattered bootcamps. The hands-on RAG architectures and agentic modules helped me land a Staff AI role.”
              <footer><i>AV</i><span><b>Aris Vance</b><small>AI Engineer at Anthropic Alumni</small></span></footer>
            </blockquote>
          </div>
        </section>
        <section className="auth-panel">
          <div className="auth-card">
            <span className="mobile-mark"><Mark /></span>
            {isSignup && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-2">
                <span>🎁</span> 3-Day Full-Access Free Trial
              </div>
            )}
            <h2>{isSignup ? "Start your 3-day free trial" : "Sign in to Astra Academy"}</h2>
            <p>{isSignup ? "Get instant, unrestricted access to all courses and DSA sheets. No credit card required." : "Access your student dashboard and courses."}</p>

            {/* Test Credentials Box */}
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
              <button className="auth-submit">{isSignup ? "Start 3-day free trial" : "Sign in to Academy"} <Arrow /></button>
              {isSignup && <small className="terms">By creating an account, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.</small>}
            </form>

            <p className="auth-switch">
              {isSignup ? "Already have an account?" : "New to Astra Academy?"}{" "}
              <Link to={isSignup ? "/signin" : "/signup"}>{isSignup ? "Sign in" : "Create free account"}</Link>
            </p>
          </div>
        </section>
      </main>
    </PageShell>
  );
}
