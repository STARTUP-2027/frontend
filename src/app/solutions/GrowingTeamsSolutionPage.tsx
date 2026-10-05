import { useState } from "react";
import { Link } from "react-router";
import { SiteFooter, SiteNav } from "../../App";
import { useTheme } from "../theme";

export default function GrowingTeamsSolutionPage() {
  const { dark } = useTheme();

  return (
    <div className={`subpage app growing-teams-solution-page ${dark ? "dark" : ""}`}>
      <div className="subpage-noise" />
      <SiteNav />

      <main className="solution-page-main">
        {/* HERO SECTION */}
        <section className="solution-hero">
          <div className="solution-hero-badge bg-cyan-soft">
            <span className="badge-dot dot-cyan" />
            <span>ASTRA FOR MID-MARKET & SCALEUPS</span>
            <span className="badge-pill pill-cyan">60% Less Busywork</span>
          </div>

          <h1 className="solution-hero-title">
            Scale the company. <br />
            <em className="gradient-text-growing">Preserve the clarity.</em>
          </h1>

          <p className="solution-hero-subtitle">
            As your headcount doubles, communication overhead doesn't have to quadruple. 
            Replace scattered status meetings with self-updating cross-functional workspaces.
          </p>

          <div className="solution-hero-actions">
            <Link to="/signup" className="solution-primary-btn btn-cyan">
              Explore scaling workspace
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </Link>
            <Link to="/talk-to-sales" className="solution-secondary-btn">
              Talk to Scaling Specialist
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="solution-metrics-row">
            <div className="sol-metric-card">
              <span className="sol-metric-num">60%</span>
              <span className="sol-metric-label">Less Internal Busywork</span>
            </div>
            <div className="sol-metric-card">
              <span className="sol-metric-num">3.2×</span>
              <span className="sol-metric-label">Cross-Team Alignment Velocity</span>
            </div>
            <div className="sol-metric-card">
              <span className="sol-metric-num">Zero</span>
              <span className="sol-metric-label">Status Meetings Required</span>
            </div>
            <div className="sol-metric-card">
              <span className="sol-metric-num">100%</span>
              <span className="sol-metric-label">Single Source of Truth</span>
            </div>
          </div>
        </section>

        {/* 3 CORE PILLARS */}
        <section className="growing-pillars-section">
          <div className="section-pill-tag">SCALE WITHOUT DRAG</div>
          <h2 className="section-title">Designed for companies between 50 and 500 people</h2>
          <p className="section-subtitle">Maintain day-one velocity through your fastest growth stages.</p>

          <div className="pillars-grid">
            <div className="pillar-card">
              <div className="pillar-icon bg-cyan-soft text-cyan">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <h3>Cross-Functional Clarity</h3>
              <p>Give Sales, Product, Marketing, and Operations identical real-time context without forwarding endless emails.</p>
            </div>
            <div className="pillar-card">
              <div className="pillar-icon bg-cyan-soft text-cyan">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <h3>Repeatable Systems</h3>
              <p>Turn proven departmental playbooks into automated workflows that new hires can execute on their first day.</p>
            </div>
            <div className="pillar-card">
              <div className="pillar-icon bg-cyan-soft text-cyan">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="m16 12-4-4-4 4M12 16V8"/></svg>
              </div>
              <h3>Actionable Insights</h3>
              <p>Understand team throughput and customer health without manual BI report stitching or data engineering requests.</p>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="product-cta-banner bg-cyan-gradient">
          <div className="cta-banner-content">
            <h2>Ready to eliminate cross-team misalignment?</h2>
            <p>Deploy Astra across your growing teams in under 48 hours.</p>
            <div className="banner-actions">
              <Link to="/signup" className="product-primary-btn">
                Start 14-day free trial
              </Link>
              <Link to="/talk-to-sales" className="product-secondary-btn">
                Schedule Team Walkthrough
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
