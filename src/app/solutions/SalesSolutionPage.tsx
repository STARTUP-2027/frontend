import { useState } from "react";
import { Link } from "react-router";
import { SiteFooter, SiteNav } from "../../App";
import { useTheme } from "../theme";

interface Deal {
  id: string;
  name: string;
  company: string;
  value: number;
  stage: "discovery" | "validation" | "negotiation" | "won";
  score: number;
  signal: string;
  champion: string;
}

const DEALS: Deal[] = [
  { id: "d1", name: "Global Cloud Migration", company: "FinScale Corp", value: 148000, stage: "negotiation", score: 96, signal: "Security review completed; VP signed DPA", champion: "Maya Lin (VP Eng)" },
  { id: "d2", name: "Enterprise Workspace Rollout", company: "Vertex Global", value: 92000, stage: "won", score: 99, signal: "Contract executed; onboarding starts Monday", champion: "David Vance (COO)" },
  { id: "d3", name: "AI Automation Platform", company: "Aura Health", value: 64000, stage: "validation", score: 88, signal: "Pilot completed with 100% test pass rate", champion: "Dr. Elena Rostova" },
  { id: "d4", name: "Data Ingestion Pipeline", company: "Quant Logistics", value: 52000, stage: "discovery", score: 82, signal: "Inbound pricing request; 450 seats", champion: "Marcus Thorne" },
];

export default function SalesSolutionPage() {
  const { dark } = useTheme();
  const [selectedDeal, setSelectedDeal] = useState<Deal>(DEALS[0]);
  const [teamReps, setTeamReps] = useState<number>(12);
  const [avgDealSize, setAvgDealSize] = useState<number>(45000);
  const [winRateBoost, setWinRateBoost] = useState<number>(28);

  const pipelineGenerated = (teamReps * 4.8 * (avgDealSize / 1000)).toFixed(0);
  const revenueGained = Math.round(teamReps * (avgDealSize * 3.4) * (winRateBoost / 100));

  return (
    <div className={`subpage app sales-solution-page ${dark ? "dark" : ""}`}>
      <div className="subpage-noise" />
      <SiteNav />

      <main className="solution-page-main">
        {/* HERO SECTION */}
        <section className="solution-hero">
          <div className="solution-hero-badge bg-amber-soft">
            <span className="badge-dot dot-amber" />
            <span>ASTRA REVENUE INTELLIGENCE</span>
            <span className="badge-pill pill-amber">Win 34% More Deals</span>
          </div>

          <h1 className="solution-hero-title">
            Turn fragmented buyer signals into <br />
            <em className="gradient-text-sales">predictable revenue velocity.</em>
          </h1>

          <p className="solution-hero-subtitle">
            Give your sales, SDR, and RevOps teams a single intelligent command center. 
            Identify high-intent accounts before they raise a hand and automate deal progression.
          </p>

          <div className="solution-hero-actions">
            <Link to="/signup" className="solution-primary-btn btn-amber">
              Accelerate your pipeline
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </Link>
            <Link to="/talk-to-sales" className="solution-secondary-btn">
              Request RevOps Demo
            </Link>
          </div>

          {/* Key Stat Cards */}
          <div className="solution-metrics-row">
            <div className="sol-metric-card">
              <span className="sol-metric-num">+38%</span>
              <span className="sol-metric-label">Average Deal Win Rate</span>
            </div>
            <div className="sol-metric-card">
              <span className="sol-metric-num">18 Days</span>
              <span className="sol-metric-label">Shorter Sales Cycles</span>
            </div>
            <div className="sol-metric-card">
              <span className="sol-metric-num">$18.4M</span>
              <span className="sol-metric-label">Pipeline Influenced</span>
            </div>
            <div className="sol-metric-card">
              <span className="sol-metric-num">Zero</span>
              <span className="sol-metric-label">Manual CRM Data Entry</span>
            </div>
          </div>
        </section>

        {/* INTERACTIVE DEAL ROOM & PIPELINE COMMAND CENTER */}
        <section className="pipeline-command-section">
          <div className="solution-card-container">
            <div className="pipeline-header">
              <div>
                <span className="section-pill-tag">LIVE DEAL INTELLIGENCE</span>
                <h2>Interactive Revenue Pipeline Board</h2>
                <p>Click any deal card to inspect live AI buying intent, champion activity, and automated deal alerts.</p>
              </div>

              <div className="pipeline-stats-badge">
                <small>TOTAL PIPELINE</small>
                <b>$356,000 ARR</b>
              </div>
            </div>

            <div className="pipeline-board-layout">
              {/* Kanban Column Stages */}
              <div className="pipeline-stages-grid">
                {[
                  { stage: "discovery", label: "01. Discovery", count: 1 },
                  { stage: "validation", label: "02. Technical Proof", count: 1 },
                  { stage: "negotiation", label: "03. Legal & Security", count: 1 },
                  { stage: "won", label: "04. Closed Won", count: 1 },
                ].map((col) => (
                  <div key={col.stage} className="stage-column">
                    <div className="stage-col-head">
                      <span>{col.label}</span>
                      <small className="stage-count">{col.count}</small>
                    </div>

                    <div className="stage-cards-list">
                      {DEALS.filter((d) => d.stage === col.stage).map((deal) => (
                        <div
                          key={deal.id}
                          className={`deal-card ${selectedDeal.id === deal.id ? "selected-deal" : ""}`}
                          onClick={() => setSelectedDeal(deal)}
                        >
                          <div className="deal-card-top">
                            <span className="deal-company">{deal.company}</span>
                            <span className="deal-score">Score: {deal.score}</span>
                          </div>
                          <h4 className="deal-title">{deal.name}</h4>
                          <div className="deal-card-bottom">
                            <b className="deal-val">${deal.value.toLocaleString()} ARR</b>
                            <span className="deal-champ">{deal.champion.split(" ")[0]}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Selected Deal Insights Sidebar */}
              <div className="deal-inspector-panel">
                <div className="inspector-head">
                  <span className="ai-intent-pill">AI DEAL COPILOT</span>
                  <h3>{selectedDeal.company}</h3>
                  <p className="deal-subtitle">{selectedDeal.name} · ${selectedDeal.value.toLocaleString()} ARR</p>
                </div>

                <div className="inspector-intent-box">
                  <div className="intent-score-row">
                    <span>Buying Intent Score</span>
                    <b className="score-val">{selectedDeal.score} / 100</b>
                  </div>
                  <div className="intent-progress-bar">
                    <div className="intent-fill" style={{ width: `${selectedDeal.score}%` }} />
                  </div>
                </div>

                <div className="inspector-signals-list">
                  <b>Live Buyer Signal</b>
                  <p className="signal-text">{selectedDeal.signal}</p>

                  <b>Executive Champion</b>
                  <p className="champ-text">{selectedDeal.champion}</p>
                </div>

                <div className="inspector-next-step">
                  <span className="step-label">RECOMMENDED AI ACTION</span>
                  <p>Send mutual action plan with SOC 2 report to accelerate contract execution.</p>
                  <button className="deal-action-btn">
                    Execute Automated Action →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* REVENUE ROI CALCULATOR */}
        <section className="sales-roi-section">
          <div className="roi-calculator-card">
            <div className="roi-left">
              <span className="section-pill-tag">PIPELINE EXPANSION CALCULATOR</span>
              <h2>Project your revenue acceleration</h2>
              <p>See how much additional ARR Astra generates by reducing sales friction and automating SDR follow-ups.</p>

              <div className="roi-sliders-group">
                <div className="slider-item">
                  <div className="slider-row">
                    <span>Account Executives & SDRs</span>
                    <b>{teamReps} Reps</b>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="50"
                    value={teamReps}
                    onChange={(e) => setTeamReps(Number(e.target.value))}
                    className="calc-range-slider amber-slider"
                  />
                </div>

                <div className="slider-item">
                  <div className="slider-row">
                    <span>Average Contract Value (ACV)</span>
                    <b>${avgDealSize.toLocaleString()}</b>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="150000"
                    step="5000"
                    value={avgDealSize}
                    onChange={(e) => setAvgDealSize(Number(e.target.value))}
                    className="calc-range-slider amber-slider"
                  />
                </div>
              </div>
            </div>

            <div className="roi-right">
              <div className="roi-stat-box">
                <span className="roi-label">ESTIMATED ANNUAL REVENUE LIFT</span>
                <b className="roi-value">+${revenueGained.toLocaleString()}</b>
                <p className="roi-sub">Based on a verified 28% win rate increase across high-intent cohorts</p>
              </div>

              <div className="roi-sub-stats">
                <div className="sub-stat">
                  <small>Active Pipeline Created</small>
                  <b>${pipelineGenerated}k</b>
                </div>
                <div className="sub-stat">
                  <small>Hours Saved per Rep / mo</small>
                  <b>32 hrs</b>
                </div>
              </div>

              <Link to="/signup" className="solution-primary-btn btn-amber">
                Claim your revenue lift →
              </Link>
            </div>
          </div>
        </section>

        {/* 3 CORE SALES PILLARS */}
        <section className="sales-pillars-section">
          <div className="section-pill-tag">BUILT FOR MODERN REVOPS</div>
          <h2 className="section-title">Everything revenue leaders need to scale</h2>
          <p className="section-subtitle">No more stalled deals, dirty CRM data, or disconnected reps.</p>

          <div className="pillars-grid">
            <div className="pillar-card">
              <div className="pillar-icon bg-amber-soft text-amber">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="m16 12-4-4-4 4M12 16V8"/></svg>
              </div>
              <h3>Automated Account Intent Scoring</h3>
              <p>Astra aggregates product usage, pricing page visits, and LinkedIn company updates to alert reps the minute an enterprise account enters buying mode.</p>
              <ul className="pillar-checklist">
                <li><span>✓</span> Multi-touch intent signal ingestion</li>
                <li><span>✓</span> Automated Slack alert to assigned AE</li>
                <li><span>✓</span> Clearbit & ZoomInfo enrichment</li>
              </ul>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon bg-amber-soft text-amber">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              </div>
              <h3>Zero-Friction Mutual Action Plans</h3>
              <p>Share collaborative workspace rooms with prospects containing security attestations, legal agreements, implementation timelines, and ROI forecasts.</p>
              <ul className="pillar-checklist">
                <li><span>✓</span> Real-time buyer engagement analytics</li>
                <li><span>✓</span> One-click DPA & SOC 2 sharing</li>
                <li><span>✓</span> Bi-directional Salesforce & HubSpot sync</li>
              </ul>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon bg-amber-soft text-amber">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <h3>AI Deal Risk Radar</h3>
              <p>Never get blindsided at quarter-end. Astra continuously analyzes email cadence and sentiment to highlight stalled deals and suggest executive interventions.</p>
              <ul className="pillar-checklist">
                <li><span>✓</span> Automatic churn & stall detection</li>
                <li><span>✓</span> Executive sponsor alignment tracking</li>
                <li><span>✓</span> AI-generated deal recovery drafts</li>
              </ul>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="product-cta-banner bg-amber-gradient">
          <div className="cta-banner-content">
            <h2>Ready to transform your sales organization?</h2>
            <p>Join over 8,000 revenue leaders closing larger deals in less time.</p>
            <div className="banner-actions">
              <Link to="/signup" className="product-primary-btn">
                Start 14-day free trial
              </Link>
              <Link to="/talk-to-sales" className="product-secondary-btn">
                Speak with a Revenue Architect
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
