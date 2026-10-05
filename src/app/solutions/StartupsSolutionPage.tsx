import { useState } from "react";
import { Link } from "react-router";
import { SiteFooter, SiteNav } from "../../App";
import { useTheme } from "../theme";

export default function StartupsSolutionPage() {
  const { dark } = useTheme();
  const [teamSize, setTeamSize] = useState<number>(6);
  const leverageMultiplier = (teamSize * 3.8).toFixed(1);

  return (
    <div className={`subpage app startups-solution-page ${dark ? "dark" : ""}`}>
      <div className="subpage-noise" />
      <SiteNav />

      <main className="solution-page-main">
        {/* HERO SECTION */}
        <section className="solution-hero">
          <div className="solution-hero-badge bg-emerald-soft">
            <span className="badge-dot dot-emerald" />
            <span>ASTRA FOR FAST-GROWING STARTUPS</span>
            <span className="badge-pill pill-emerald">10× Operating Leverage</span>
          </div>

          <h1 className="solution-hero-title">
            Build massive operational momentum. <br />
            <em className="gradient-text-startups">Long before heavy headcount.</em>
          </h1>

          <p className="solution-hero-subtitle">
            Give a 5-person founding team the execution velocity of a 50-person organization. 
            Automate onboarding, billing, customer signals, and telemetry from day one.
          </p>

          <div className="solution-hero-actions">
            <Link to="/signup" className="solution-primary-btn btn-emerald">
              Launch startup workspace
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </Link>
            <Link to="/pricing" className="solution-secondary-btn">
              View $19 Starter Plan
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="solution-metrics-row">
            <div className="sol-metric-card">
              <span className="sol-metric-num">10×</span>
              <span className="sol-metric-label">Operating Leverage</span>
            </div>
            <div className="sol-metric-card">
              <span className="sol-metric-num">&lt; 10 Mins</span>
              <span className="sol-metric-label">Setup & Deployment Time</span>
            </div>
            <div className="sol-metric-card">
              <span className="sol-metric-num">50+</span>
              <span className="sol-metric-label">Pre-built Startup Playbooks</span>
            </div>
            <div className="sol-metric-card">
              <span className="sol-metric-num">$19 / mo</span>
              <span className="sol-metric-label">Founder-Friendly Pricing</span>
            </div>
          </div>
        </section>

        {/* STARTUP LEVERAGE CALCULATOR */}
        <section className="startups-leverage-section">
          <div className="solution-card-container">
            <div className="startups-calc-card">
              <div className="calc-left">
                <span className="section-pill-tag">FOUNDER CAPACITY MULTIPLIER</span>
                <h2>How much leverage can your team unlock?</h2>
                <p>Slide your current team size to calculate your effective organizational capacity with Astra.</p>

                <div className="slider-item">
                  <div className="slider-row">
                    <span>Current Full-Time Team</span>
                    <b>{teamSize} People</b>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="25"
                    value={teamSize}
                    onChange={(e) => setTeamSize(Number(e.target.value))}
                    className="calc-range-slider emerald-slider"
                  />
                </div>
              </div>

              <div className="calc-right bg-emerald-light">
                <div className="roi-stat-box">
                  <span className="roi-label">EFFECTIVE ORGANIZATIONAL POWER</span>
                  <b className="roi-value">{leverageMultiplier} People Equivalent</b>
                  <p className="roi-sub">Automated SDR intake, automated reconciliation, and live telemetry</p>
                </div>

                <Link to="/signup" className="solution-primary-btn btn-emerald">
                  Start with $19 / mo →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 3 CORE STARTUP PILLARS */}
        <section className="startup-pillars-section">
          <div className="section-pill-tag">FOUNDER ESSENTIALS</div>
          <h2 className="section-title">Everything an early-stage startup needs to win</h2>
          <p className="section-subtitle">Scale your product and revenue, not administrative clutter.</p>

          <div className="pillars-grid">
            <div className="pillar-card">
              <div className="pillar-icon bg-emerald-soft text-emerald">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <h3>Launch in 10 Minutes</h3>
              <p>Deploy pre-configured workspace templates for product roadmaps, lead triage, and investor metric reporting with one click.</p>
            </div>
            <div className="pillar-card">
              <div className="pillar-icon bg-emerald-soft text-emerald">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="m12 6 4 6h-8l4-6z"/></svg>
              </div>
              <h3>AI-Powered Operations</h3>
              <p>Put customer onboarding emails, Stripe billing notifications, and bug triage on autopilot so founders stay focused on product.</p>
            </div>
            <div className="pillar-card">
              <div className="pillar-icon bg-emerald-soft text-emerald">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <h3>Scale Without Re-Platforming</h3>
              <p>Start on our $19 plan and seamlessly scale to enterprise security, SOC 2, and dedicated VPCs when you close your Series A/B.</p>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="product-cta-banner bg-emerald-gradient">
          <div className="cta-banner-content">
            <h2>Ready to build your early-stage momentum?</h2>
            <p>Start free for 14 days. Upgrade whenever you are ready.</p>
            <div className="banner-actions">
              <Link to="/signup" className="product-primary-btn">
                Start Free Trial
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
