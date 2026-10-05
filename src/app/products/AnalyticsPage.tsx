import { useState, useMemo } from "react";
import { Link } from "react-router";
import { SiteFooter, SiteNav } from "../../App";
import { useTheme } from "../theme";

export default function AnalyticsPage() {
  const { dark } = useTheme();
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d" | "1y">("30d");
  const [activeTab, setActiveTab] = useState<"revenue" | "retention" | "queries">("revenue");
  const [eventVolume, setEventVolume] = useState<number>(5); // in millions
  const [liveStreamActive, setLiveStreamActive] = useState(true);

  // Live Simulated Stream
  const liveEvents = useMemo(() => [
    { id: 1, time: "Just now", text: "Enterprise expansion logged: +$36,000 ARR", client: "Stripe EU", status: "success" },
    { id: 2, time: "4s ago", text: "Cohort retention analysis rendered in 11ms", client: "FinTech Hub", status: "fast" },
    { id: 3, time: "18s ago", text: "Anomaly detection: +42% signups in APAC", client: "Astra Radar", status: "ai" },
    { id: 4, time: "42s ago", text: "Cross-db query federated (Snowflake + Postgres)", client: "Data Mesh", status: "success" },
  ], []);

  // Time-range multiplier
  const mult = timeRange === "24h" ? 0.08 : timeRange === "7d" ? 0.28 : timeRange === "30d" ? 1 : 11.4;

  const mrrValue = (842.5 * mult).toFixed(1);
  const eventsTracked = (eventVolume * (timeRange === "24h" ? 0.05 : timeRange === "7d" ? 0.25 : 1)).toFixed(1);
  const hoursSaved = Math.round(eventVolume * 4.2);
  const costSavings = Math.round(eventVolume * 3850);

  return (
    <div className={`subpage app analytics-product-page ${dark ? "dark" : ""}`}>
      <div className="subpage-noise" />
      <SiteNav />

      <main className="product-page-main">
        {/* HERO SECTION */}
        <section className="product-hero">
          <div className="product-hero-badge">
            <span className="badge-dot" />
            <span>Astra Analytics Engine 3.4</span>
            <span className="badge-pill">Sub-second Latency</span>
          </div>

          <h1 className="product-hero-title">
            Turn raw telemetry into <br />
            <em className="gradient-text-analytics">unfair operational clarity.</em>
          </h1>

          <p className="product-hero-subtitle">
            Unify behavioral events, financial metrics, and customer signals into one interactive, 
            blazing-fast intelligence hub. Answer critical business questions in milliseconds.
          </p>

          <div className="product-hero-actions">
            <Link to="/signup" className="product-primary-btn">
              Start 14-day free trial
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </Link>
            <Link to="/talk-to-sales" className="product-secondary-btn">
              Book personalized demo
            </Link>
          </div>

          {/* Quick proof stats banner */}
          <div className="hero-metrics-bar">
            <div className="metric-item">
              <b>12ms</b>
              <small>p99 Query Latency</small>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <b>142.8%</b>
              <small>Net Revenue Retention</small>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <b>10B+</b>
              <small>Monthly Events Ingested</small>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <b>Zero</b>
              <small>Data Engineering Overhead</small>
            </div>
          </div>
        </section>

        {/* INTERACTIVE DASHBOARD STUDIO */}
        <section className="analytics-studio-section">
          <div className="studio-container">
            {/* Top Toolbar */}
            <div className="studio-toolbar">
              <div className="studio-tabs">
                <button 
                  className={`studio-tab ${activeTab === "revenue" ? "active" : ""}`}
                  onClick={() => setActiveTab("revenue")}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19V9m6 10V5m6 14v-7m4 7H2"/></svg>
                  Revenue Velocity
                </button>
                <button 
                  className={`studio-tab ${activeTab === "retention" ? "active" : ""}`}
                  onClick={() => setActiveTab("retention")}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></svg>
                  Retention Cohorts
                </button>
                <button 
                  className={`studio-tab ${activeTab === "queries" ? "active" : ""}`}
                  onClick={() => setActiveTab("queries")}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m13 2-8 11h7l-1 9 8-12h-7l1-8Z"/></svg>
                  Query Profiler
                </button>
              </div>

              <div className="studio-controls">
                <div className="timerange-picker">
                  {(["24h", "7d", "30d", "1y"] as const).map((range) => (
                    <button
                      key={range}
                      className={`range-btn ${timeRange === range ? "selected" : ""}`}
                      onClick={() => setTimeRange(range)}
                    >
                      {range.toUpperCase()}
                    </button>
                  ))}
                </div>
                <button 
                  className={`live-toggle ${liveStreamActive ? "streaming" : ""}`}
                  onClick={() => setLiveStreamActive(!liveStreamActive)}
                  title="Toggle live telemetry stream"
                >
                  <span className="live-indicator" />
                  {liveStreamActive ? "LIVE" : "PAUSED"}
                </button>
              </div>
            </div>

            {/* Main Interactive Studio Grid */}
            <div className="studio-grid">
              {/* Left Main Chart Area */}
              <div className="studio-chart-panel">
                <div className="chart-header">
                  <div>
                    <span className="chart-eyebrow">
                      {activeTab === "revenue" ? "ANNUALIZED RUN-RATE VELOCITY" : activeTab === "retention" ? "NET EXPANSION COHORTS" : "GLOBAL DISTRIBUTED CACHE HIT RATE"}
                    </span>
                    <div className="chart-val-row">
                      <h3>{activeTab === "revenue" ? `$${mrrValue}k` : activeTab === "retention" ? "142.8%" : "99.94%"}</h3>
                      <span className="trend-badge positive">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m18 15-6-6-6 6"/></svg>
                        +24.6% vs previous period
                      </span>
                    </div>
                  </div>
                  <div className="chart-legend">
                    <span><i className="dot primary" /> Enterprise Tier</span>
                    <span><i className="dot secondary" /> Growth Tier</span>
                  </div>
                </div>

                {/* SVG Visual Graph */}
                <div className="dynamic-chart-canvas">
                  <svg viewBox="0 0 700 240" className="analytics-svg" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="analyticsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="secondaryGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Grid lines */}
                    <line x1="0" y1="40" x2="700" y2="40" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="4 4" />
                    <line x1="0" y1="100" x2="700" y2="100" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="4 4" />
                    <line x1="0" y1="160" x2="700" y2="160" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="4 4" />
                    <line x1="0" y1="220" x2="700" y2="220" stroke="currentColor" strokeOpacity="0.12" />

                    {/* Secondary Curve */}
                    <path
                      d="M0,170 Q120,150 220,130 T440,95 T600,60 T700,45 L700,220 L0,220 Z"
                      fill="url(#secondaryGrad)"
                    />
                    <path
                      d="M0,170 Q120,150 220,130 T440,95 T600,60 T700,45"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="2.5"
                    />

                    {/* Primary Curve */}
                    <path
                      d="M0,195 Q140,175 260,115 T480,70 T620,35 T700,20 L700,220 L0,220 Z"
                      fill="url(#analyticsGrad)"
                    />
                    <path
                      d="M0,195 Q140,175 260,115 T480,70 T620,35 T700,20"
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="3.2"
                    />

                    {/* Glowing highlight markers */}
                    <circle cx="260" cy="115" r="5" fill="#8b5cf6" stroke="#fff" strokeWidth="2" />
                    <circle cx="480" cy="70" r="5" fill="#8b5cf6" stroke="#fff" strokeWidth="2" />
                    <circle cx="700" cy="20" r="6" fill="#a855f7" stroke="#fff" strokeWidth="2.5" />
                  </svg>
                </div>

                {/* Bottom X-axis labels */}
                <div className="chart-x-axis">
                  <span>W1 (Kickoff)</span>
                  <span>W2</span>
                  <span>W3 (Expansion)</span>
                  <span>W4</span>
                  <span>Current Moment</span>
                </div>
              </div>

              {/* Right Live Stream Sidebar */}
              <div className="studio-stream-sidebar">
                <div className="stream-header">
                  <span className="pulse-beacon" />
                  <h4>Live Signal Stream</h4>
                  <small>{liveEvents.length} events/sec</small>
                </div>

                <div className="stream-list">
                  {liveEvents.map((item) => (
                    <div key={item.id} className={`stream-card status-${item.status}`}>
                      <div className="stream-card-top">
                        <span className="stream-client">{item.client}</span>
                        <span className="stream-time">{item.time}</span>
                      </div>
                      <p className="stream-text">{item.text}</p>
                    </div>
                  ))}
                </div>

                <div className="ai-callout-card">
                  <div className="ai-callout-header">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 3 1.3 3.7L17 8l-3.7 1.3L12 13l-1.3-3.7L7 8l3.7-1.3L12 3Z"/></svg>
                    <b>Astra Radar Insight</b>
                  </div>
                  <p>Revenue growth is accelerating fastest in EMEA (+48% QoQ). Suggest creating dedicated European caching shard.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3 DEEP ARCHITECTURAL PILLARS */}
        <section className="analytics-pillars-section">
          <div className="section-pill-tag">ENGINEERED FOR EXTREME SCALE</div>
          <h2 className="section-title">Why high-growth teams switch to Astra Analytics</h2>
          <p className="section-subtitle">Say goodbye to brittle ETL pipelines and endless SQL queries.</p>

          <div className="pillars-grid">
            <div className="pillar-card">
              <div className="pillar-icon bg-violet">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m13 2-8 11h7l-1 9 8-12h-7l1-8Z"/></svg>
              </div>
              <h3>Sub-second Distributed Queries</h3>
              <p>Execute complex cohort analysis, multi-touch attribution, and predictive modeling over billions of records with guaranteed sub-second response times.</p>
              <ul className="pillar-checklist">
                <li><span>✓</span> Columnar real-time memory store</li>
                <li><span>✓</span> Automated distributed cache indexing</li>
                <li><span>✓</span> Zero lock contention on writes</li>
              </ul>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon bg-cyan">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/><circle cx="12" cy="12" r="9"/></svg>
              </div>
              <h3>Unified Semantic Layer</h3>
              <p>Define business metrics once in plain language or YAML. Astra guarantees that "Active Customer" or "Churn Risk" means the exact same thing across all apps.</p>
              <ul className="pillar-checklist">
                <li><span>✓</span> Code-defined semantic models</li>
                <li><span>✓</span> Bi-directional sync to BI and CRM</li>
                <li><span>✓</span> Automated metric drift prevention</li>
              </ul>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon bg-emerald">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 3 1.3 3.7L17 8l-3.7 1.3L12 13l-1.3-3.7L7 8l3.7-1.3L12 3Z"/><path d="m19 14 .7 2.3L22 17l-2.3.7L19 20l-.7-2.3L16 17l2.3-.7L19 14Z"/></svg>
              </div>
              <h3>Autonomous Anomaly Radar</h3>
              <p>Our machine learning model analyzes thousands of micro-cohorts every minute, proactively flagging revenue risks and expansion opportunities before humans notice.</p>
              <ul className="pillar-checklist">
                <li><span>✓</span> Natural language root cause summaries</li>
                <li><span>✓</span> Automated Slack & webhook alerts</li>
                <li><span>✓</span> Noise-cancelling anomaly filter</li>
              </ul>
            </div>
          </div>
        </section>

        {/* INTERACTIVE ROI & CAPACITY CALCULATOR */}
        <section className="analytics-calc-section">
          <div className="calc-card">
            <div className="calc-left">
              <span className="badge-pill">INTERACTIVE ESTIMATOR</span>
              <h2>Calculate your team's velocity gain</h2>
              <p>See how much engineering time and compute cost Astra saves compared to building custom data pipelines.</p>

              <div className="slider-container">
                <div className="slider-label-row">
                  <span>Monthly Ingested Events</span>
                  <b>{eventVolume} Million events/mo</b>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  step="1"
                  value={eventVolume}
                  onChange={(e) => setEventVolume(Number(e.target.value))}
                  className="calc-range-slider"
                />
                <div className="slider-ticks">
                  <span>1M</span>
                  <span>10M</span>
                  <span>25M</span>
                  <span>50M+</span>
                </div>
              </div>
            </div>

            <div className="calc-right">
              <div className="calc-result-box">
                <span className="result-label">ESTIMATED ANNUAL CLOUD SAVINGS</span>
                <b className="result-value">${costSavings.toLocaleString()}</b>
                <p className="result-sub">Calculated against traditional warehouse query fees</p>
              </div>

              <div className="calc-result-grid">
                <div className="mini-res">
                  <small>Eng Hours Saved / mo</small>
                  <b>{hoursSaved} hrs</b>
                </div>
                <div className="mini-res">
                  <small>Query Speedup Factor</small>
                  <b>38× faster</b>
                </div>
              </div>

              <Link to="/signup" className="calc-cta-btn">
                Claim your velocity gains <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </Link>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA BANNER */}
        <section className="product-cta-banner">
          <div className="cta-banner-content">
            <h2>Ready to see your business with extreme clarity?</h2>
            <p>Deploy Astra Analytics in under 10 minutes. No credit card required.</p>
            <div className="banner-actions">
              <Link to="/signup" className="product-primary-btn">
                Start free 14-day trial
              </Link>
              <Link to="/talk-to-sales" className="product-secondary-btn">
                Schedule engineer walkthrough
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
