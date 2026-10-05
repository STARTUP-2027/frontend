import { useState } from "react";
import { Link } from "react-router";
import { SiteFooter, SiteNav } from "../../App";
import { useTheme } from "../theme";

interface RoadmapBet {
  id: string;
  quarter: "Q1" | "Q2" | "Q3";
  title: string;
  category: "Core Engine" | "AI & ML" | "Integrations" | "Security";
  feedbackSignals: number;
  pipelineInfluenced: number;
  status: "IN_DEVELOPMENT" | "SHIPPED" | "DISCOVERY";
  engOwner: string;
}

const BETS: RoadmapBet[] = [
  { id: "b1", quarter: "Q1", title: "Federated Zero-Copy Snowflake Ingestion", category: "Core Engine", feedbackSignals: 420, pipelineInfluenced: 4200000, status: "SHIPPED", engOwner: "Core Platform Squad" },
  { id: "b2", quarter: "Q1", title: "Autonomous Multi-Model LLM Reasoning Engine", category: "AI & ML", feedbackSignals: 680, pipelineInfluenced: 8500000, status: "SHIPPED", engOwner: "AI Intelligence Squad" },
  { id: "b3", quarter: "Q2", title: "Granular Cell-Based Regional Data Residency", category: "Security", feedbackSignals: 310, pipelineInfluenced: 5600000, status: "IN_DEVELOPMENT", engOwner: "Security & Cloud Squad" },
  { id: "b4", quarter: "Q3", title: "Bi-directional Webhook Replay Debugger", category: "Integrations", feedbackSignals: 190, pipelineInfluenced: 2100000, status: "DISCOVERY", engOwner: "Ecosystem Squad" },
];

export default function ProductEngineeringSolutionPage() {
  const { dark } = useTheme();
  const [selectedQuarter, setSelectedQuarter] = useState<"all" | "Q1" | "Q2" | "Q3">("all");
  const [selectedBet, setSelectedBet] = useState<RoadmapBet>(BETS[1]);

  const filteredBets = selectedQuarter === "all"
    ? BETS
    : BETS.filter((b) => b.quarter === selectedQuarter);

  return (
    <div className={`subpage app product-eng-solution-page ${dark ? "dark" : ""}`}>
      <div className="subpage-noise" />
      <SiteNav />

      <main className="solution-page-main">
        {/* HERO SECTION */}
        <section className="solution-hero">
          <div className="solution-hero-badge bg-indigo-soft">
            <span className="badge-dot dot-indigo" />
            <span>ASTRA FOR PRODUCT & ENGINEERING</span>
            <span className="badge-pill pill-indigo">Shared Context. Faster Shipping.</span>
          </div>

          <h1 className="solution-hero-title">
            Connect customer discovery directly to <br />
            <em className="gradient-text-eng">production code delivery.</em>
          </h1>

          <p className="solution-hero-subtitle">
            Eliminate the disconnect between user signals, PM roadmaps, and Git commits. 
            Empower engineering teams to ship high-impact features 38% faster with complete business context.
          </p>

          <div className="solution-hero-actions">
            <Link to="/signup" className="solution-primary-btn btn-indigo">
              Ship with shared context
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </Link>
            <Link to="/talk-to-sales" className="solution-secondary-btn">
              Explore PM & Eng Workflows
            </Link>
          </div>

          {/* DORA Metrics Banner */}
          <div className="dora-metrics-row">
            <div className="dora-card">
              <span className="dora-val">18.4× / day</span>
              <span className="dora-title">Deployment Frequency</span>
              <small>Elite DORA Tier</small>
            </div>
            <div className="dora-card">
              <span className="dora-val">42 Mins</span>
              <span className="dora-title">Lead Time to Production</span>
              <small>Commit to deploy</small>
            </div>
            <div className="dora-card">
              <span className="dora-val">&lt; 0.05%</span>
              <span className="dora-title">Change Failure Rate</span>
              <small>Automated rollbacks</small>
            </div>
            <div className="dora-card">
              <span className="dora-val">1.9 Mins</span>
              <span className="dora-title">Mean Time to Restore (MTTR)</span>
              <small>Automated triage</small>
            </div>
          </div>
        </section>

        {/* INTERACTIVE ROADMAP & CUSTOMER IMPACT HUB */}
        <section className="roadmap-hub-section">
          <div className="solution-card-container">
            <div className="roadmap-header">
              <div>
                <span className="section-pill-tag">DATA-DRIVEN ROADMAPPING</span>
                <h2>Customer Signals to Code Delivery</h2>
                <p>Click any roadmap bet to inspect underlying customer feedback clusters, influenced ARR, and squad commits.</p>
              </div>

              <div className="quarter-toggle-group">
                {(["all", "Q1", "Q2", "Q3"] as const).map((q) => (
                  <button
                    key={q}
                    className={`quarter-btn ${selectedQuarter === q ? "active" : ""}`}
                    onClick={() => setSelectedQuarter(q)}
                  >
                    {q === "all" ? "All Quarters" : q}
                  </button>
                ))}
              </div>
            </div>

            <div className="roadmap-grid-layout">
              {/* Left Bets List */}
              <div className="bets-list">
                {filteredBets.map((bet) => (
                  <div
                    key={bet.id}
                    className={`bet-card ${selectedBet.id === bet.id ? "active-bet" : ""}`}
                    onClick={() => setSelectedBet(bet)}
                  >
                    <div className="bet-card-head">
                      <span className="bet-quarter-badge">{bet.quarter}</span>
                      <span className="bet-cat">{bet.category}</span>
                      <span className={`bet-status ${bet.status.toLowerCase().replace(/_/g, "-")}`}>
                        {bet.status}
                      </span>
                    </div>

                    <h4 className="bet-title">{bet.title}</h4>

                    <div className="bet-card-foot">
                      <span>👥 {bet.feedbackSignals} Customer Requests</span>
                      <b className="bet-arr">${(bet.pipelineInfluenced / 1000000).toFixed(1)}M ARR Influenced</b>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Bet Inspector Panel */}
              <div className="bet-inspector">
                <div className="inspector-top">
                  <span className="badge-pill">FEATURE SPEC & IMPACT ATTRIBUTION</span>
                  <h3>{selectedBet.title}</h3>
                  <p className="inspector-owner">Assigned Squad: <b>{selectedBet.engOwner}</b></p>
                </div>

                <div className="inspector-kpi-grid">
                  <div className="kpi-box">
                    <small>CUSTOMER SIGNALS</small>
                    <b>{selectedBet.feedbackSignals} Accounts</b>
                  </div>
                  <div className="kpi-box">
                    <small>PIPELINE AT STAKE</small>
                    <b>${(selectedBet.pipelineInfluenced / 1000000).toFixed(1)}M ARR</b>
                  </div>
                </div>

                <div className="git-sync-box">
                  <b>Connected GitHub Pull Requests & Releases</b>
                  <div className="pr-item">
                    <span className="pr-badge merged">MERGED</span>
                    <span>feat(core): implement distributed streaming consumer #409</span>
                  </div>
                  <div className="pr-item">
                    <span className="pr-badge open">OPEN</span>
                    <span>test(e2e): end-to-end chaos testing on k8s cluster #418</span>
                  </div>
                </div>

                <div className="release-actions">
                  <Link to="/signup" className="solution-primary-btn btn-indigo">
                    Generate Release Notes →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3 CORE ENG PILLARS */}
        <section className="eng-pillars-section">
          <div className="section-pill-tag">ENGINEERED FOR VELOCITY</div>
          <h2 className="section-title">Built for high-velocity software engineering</h2>
          <p className="section-subtitle">Bridge the gap between strategic vision and day-to-day code execution.</p>

          <div className="pillars-grid">
            <div className="pillar-card">
              <div className="pillar-icon bg-indigo-soft text-indigo">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
              </div>
              <h3>Bi-directional Issue Sync</h3>
              <p>Link Jira, Linear, and GitHub issues directly to customer revenue accounts. Prioritize engineering backlog by real dollars, not gut feel.</p>
              <ul className="pillar-checklist">
                <li><span>✓</span> Automated customer ARR weighting</li>
                <li><span>✓</span> Two-way Linear & Jira issue updates</li>
                <li><span>✓</span> SLA breach notifications in Slack</li>
              </ul>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon bg-indigo-soft text-indigo">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <h3>Autonomous Release Notes</h3>
              <p>Astra analyzes merged pull requests and customer feature requests, automatically drafting human-readable changelogs and notifying target users.</p>
              <ul className="pillar-checklist">
                <li><span>✓</span> Automatic PR summary extraction</li>
                <li><span>✓</span> Targeted email & in-app alerts</li>
                <li><span>✓</span> Customer satisfaction tracking</li>
              </ul>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon bg-indigo-soft text-indigo">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              </div>
              <h3>Production Observability Correlation</h3>
              <p>Correlate Datadog, Sentry, and OpenTelemetry error spikes with the exact commit SHA and user segment impacted for sub-minute MTTR.</p>
              <ul className="pillar-checklist">
                <li><span>✓</span> Zero-configuration DORA tracking</li>
                <li><span>✓</span> Automated rollback canary triggers</li>
                <li><span>✓</span> Blast radius customer mapping</li>
              </ul>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="product-cta-banner bg-indigo-gradient">
          <div className="cta-banner-content">
            <h2>Ready to ship higher-impact software faster?</h2>
            <p>Empower your product and engineering squads with Astra.</p>
            <div className="banner-actions">
              <Link to="/signup" className="product-primary-btn">
                Start building with shared context
              </Link>
              <Link to="/talk-to-sales" className="product-secondary-btn">
                Schedule Engineering Demo
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
