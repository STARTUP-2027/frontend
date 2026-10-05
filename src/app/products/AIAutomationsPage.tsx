import { useState, useEffect } from "react";
import { Link } from "react-router";
import { SiteFooter, SiteNav } from "../../App";
import { useTheme } from "../theme";

export default function AIAutomationsPage() {
  const { dark } = useTheme();
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedBlueprint, setSelectedBlueprint] = useState<"churn" | "lead" | "incident" | "invoice">("churn");
  const [logs, setLogs] = useState<Array<{ id: number; time: string; msg: string; type: "info" | "success" | "ai" }>>([
    { id: 1, time: "10:42:01", msg: "Workflow engine initialized and listening on webhooks", type: "info" },
    { id: 2, time: "10:42:04", msg: "Trigger received: Zendesk ticket #4819 (Priority: Urgent)", type: "info" },
  ]);

  const blueprints = {
    churn: {
      title: "VIP Customer Churn Prevention",
      trigger: "Zendesk High-Priority Ticket / Negative Sentiment",
      aiReasoning: "Astra LLM scores sentiment (-0.84), flags $45k ARR contract renewal in 30d",
      action: "Slack #exec-churn alert + Stripe draft 20% discount offer + Notify Maya Chen",
      impact: "Reduced churn by 34% across 1,200 enterprise accounts",
    },
    lead: {
      title: "High-Intent Inbound Enrichment",
      trigger: "Form submission on Pricing page from Fortune 500 domain",
      aiReasoning: "Enrich with Clearbit/LinkedIn data, assign tier: Enterprise Tier 1",
      action: "Instantly create Salesforce Opportunity & book round-robin calendar slot",
      impact: "12-minute faster lead response time; 41% higher close rate",
    },
    incident: {
      title: "Automated Production Triage",
      trigger: "Datadog p99 latency spike alert (>500ms in us-east-1)",
      aiReasoning: "Correlate error logs with latest GitHub release SHA-8f4b12",
      action: "Trigger automatic rollback canary & dispatch PagerDuty alert to on-call",
      impact: "MTTR decreased from 42 mins to 90 seconds",
    },
    invoice: {
      title: "Autonomous Invoice Reconciliation",
      trigger: "New PDF invoice attached to billing@company.com",
      aiReasoning: "OCR extract line items, verify against Purchase Order in NetSuite",
      action: "Approve payment if <$5,000 threshold; otherwise route to VP Finance",
      impact: "Automated 8,400 monthly hours of manual accounting entry",
    },
  };

  const handleTestRun = () => {
    if (isRunning) return;
    setIsRunning(true);
    setActiveStep(1);
    
    setLogs((prev) => [
      { id: Date.now(), time: new Date().toLocaleTimeString(), msg: "Initiating live workflow simulation...", type: "info" },
      ...prev.slice(0, 4)
    ]);

    setTimeout(() => {
      setActiveStep(2);
      setLogs((prev) => [
        { id: Date.now(), time: new Date().toLocaleTimeString(), msg: "AI Reasoning: Extracted intent with 99.4% confidence", type: "ai" },
        ...prev
      ]);
    }, 1200);

    setTimeout(() => {
      setActiveStep(3);
      setLogs((prev) => [
        { id: Date.now(), time: new Date().toLocaleTimeString(), msg: "Branch Condition matched: ARR > $20k -> Executive Path", type: "info" },
        ...prev
      ]);
    }, 2400);

    setTimeout(() => {
      setActiveStep(4);
      setLogs((prev) => [
        { id: Date.now(), time: new Date().toLocaleTimeString(), msg: "Execution finished: Webhooks delivered (200 OK in 142ms)", type: "success" },
        ...prev
      ]);
      setIsRunning(false);
    }, 3600);
  };

  return (
    <div className={`subpage app automations-product-page ${dark ? "dark" : ""}`}>
      <div className="subpage-noise" />
      <SiteNav />

      <main className="product-page-main">
        {/* HERO SECTION */}
        <section className="product-hero">
          <div className="product-hero-badge">
            <span className="badge-dot ai-dot" />
            <span>Astra Autonomous Studio 2.0</span>
            <span className="badge-pill">Zero-Code Multi-Agent</span>
          </div>

          <h1 className="product-hero-title">
            Put complex business logic <br />
            <em className="gradient-text-ai">on self-driving autopilot.</em>
          </h1>

          <p className="product-hero-subtitle">
            Orchestrate multi-step AI agents, database triggers, and human approvals into resilient, 
            self-healing workflows. Scale operations without multiplying headcount.
          </p>

          <div className="product-hero-actions">
            <button 
              onClick={handleTestRun}
              className="product-primary-btn glow-btn"
              disabled={isRunning}
            >
              {isRunning ? "Simulating Execution..." : "Run Live Workflow Demo"}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="m9 7 8 5-8 5V7Z"/></svg>
            </button>
            <Link to="/signup" className="product-secondary-btn">
              Build free workflow
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="hero-metrics-bar">
            <div className="metric-item">
              <b>18.4M+</b>
              <small>Monthly Actions Executed</small>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <b>142ms</b>
              <small>Median Execution Time</small>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <b>99.998%</b>
              <small>Reliability Uptime</small>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <b>100%</b>
              <small>Deterministic Rollbacks</small>
            </div>
          </div>
        </section>

        {/* INTERACTIVE WORKFLOW NODE STUDIO CANVAS */}
        <section className="workflow-studio-section">
          <div className="studio-container">
            <div className="workflow-studio-header">
              <div className="workflow-title-group">
                <span className="studio-pill">INTERACTIVE WORKFLOW GRAPH</span>
                <h3>{blueprints[selectedBlueprint].title}</h3>
              </div>
              <div className="workflow-actions-group">
                <button 
                  className={`run-flow-btn ${isRunning ? "running" : ""}`}
                  onClick={handleTestRun}
                  disabled={isRunning}
                >
                  <span className="btn-icon">⚡</span>
                  {isRunning ? "Simulating Flow..." : "Test Run Workflow"}
                </button>
              </div>
            </div>

            {/* Visual Node Graph Canvas */}
            <div className="visual-node-canvas">
              {/* Node 1: Trigger */}
              <div 
                className={`flow-node node-trigger ${activeStep === 1 ? "active-step" : ""}`}
                onClick={() => setActiveStep(1)}
              >
                <div className="node-badge">STEP 01: TRIGGER</div>
                <div className="node-content">
                  <div className="node-icon trigger-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                  </div>
                  <div>
                    <h4>Event Webhook</h4>
                    <p>{blueprints[selectedBlueprint].trigger}</p>
                  </div>
                </div>
                <div className="node-status-chip">
                  <span className="status-dot green" />
                  <span>Listening</span>
                </div>
              </div>

              {/* Node Connector 1 */}
              <div className={`flow-connector ${activeStep >= 2 ? "active-pulse" : ""}`}>
                <div className="connector-line" />
                <div className="energy-pulse" />
              </div>

              {/* Node 2: AI Reasoning */}
              <div 
                className={`flow-node node-ai ${activeStep === 2 ? "active-step" : ""}`}
                onClick={() => setActiveStep(2)}
              >
                <div className="node-badge ai-badge">STEP 02: AI AGENT REASONING</div>
                <div className="node-content">
                  <div className="node-icon ai-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 3 1.3 3.7L17 8l-3.7 1.3L12 13l-1.3-3.7L7 8l3.7-1.3L12 3Z"/><path d="m19 14 .7 2.3L22 17l-2.3.7L19 20l-.7-2.3L16 17l2.3-.7L19 14Z"/></svg>
                  </div>
                  <div>
                    <h4>Astra Intelligence</h4>
                    <p>{blueprints[selectedBlueprint].aiReasoning}</p>
                  </div>
                </div>
                <div className="node-status-chip">
                  <span className="status-dot purple" />
                  <span>Multi-Model (Claude 3.7 + GPT-4o)</span>
                </div>
              </div>

              {/* Node Connector 2 */}
              <div className={`flow-connector ${activeStep >= 3 ? "active-pulse" : ""}`}>
                <div className="connector-line" />
                <div className="energy-pulse" />
              </div>

              {/* Node 3: Branch Decision */}
              <div 
                className={`flow-node node-branch ${activeStep === 3 ? "active-step" : ""}`}
                onClick={() => setActiveStep(3)}
              >
                <div className="node-badge">STEP 03: GUARDRAIL & BRANCH</div>
                <div className="node-content">
                  <div className="node-icon branch-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><path d="M6 9v12m0-6h9m3-6v9"/></svg>
                  </div>
                  <div>
                    <h4>Policy Check & Route</h4>
                    <p>Validate RBAC permissions and evaluate contract tier conditional threshold.</p>
                  </div>
                </div>
                <div className="node-status-chip">
                  <span className="status-dot cyan" />
                  <span>Deterministic Guardrail</span>
                </div>
              </div>

              {/* Node Connector 3 */}
              <div className={`flow-connector ${activeStep >= 4 ? "active-pulse" : ""}`}>
                <div className="connector-line" />
                <div className="energy-pulse" />
              </div>

              {/* Node 4: Action */}
              <div 
                className={`flow-node node-action ${activeStep === 4 ? "active-step" : ""}`}
                onClick={() => setActiveStep(4)}
              >
                <div className="node-badge action-badge">STEP 04: MULTI-SYSTEM SYNC</div>
                <div className="node-content">
                  <div className="node-icon action-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  </div>
                  <div>
                    <h4>Execute & Notify</h4>
                    <p>{blueprints[selectedBlueprint].action}</p>
                  </div>
                </div>
                <div className="node-status-chip">
                  <span className="status-dot green" />
                  <span>200 OK Delivered</span>
                </div>
              </div>
            </div>

            {/* Bottom Console Log Stream */}
            <div className="workflow-console">
              <div className="console-header">
                <div className="console-title">
                  <span className="terminal-dot red" />
                  <span className="terminal-dot yellow" />
                  <span className="terminal-dot green" />
                  <span>Real-time Telemetry & Execution Log</span>
                </div>
                <small className="console-meta">Worker pool: active · Memory isolation: 100%</small>
              </div>

              <div className="console-body">
                {logs.map((log) => (
                  <div key={log.id} className={`console-line line-${log.type}`}>
                    <span className="log-time">[{log.time}]</span>
                    <span className="log-type">{log.type.toUpperCase()}</span>
                    <span className="log-msg">{log.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* BLUEPRINT GALLERY SECTION */}
        <section className="automation-blueprints-section">
          <div className="section-pill-tag">PROVEN TEMPLATES</div>
          <h2 className="section-title">Pre-built automation blueprints</h2>
          <p className="section-subtitle">Deploy ready-to-run enterprise workflows in a single click.</p>

          <div className="blueprint-tabs">
            {(Object.keys(blueprints) as Array<keyof typeof blueprints>).map((key) => (
              <button
                key={key}
                className={`blueprint-tab-btn ${selectedBlueprint === key ? "active" : ""}`}
                onClick={() => setSelectedBlueprint(key)}
              >
                {blueprints[key].title}
              </button>
            ))}
          </div>

          <div className="blueprint-showcase-card">
            <div className="blueprint-card-left">
              <span className="badge-pill">PRODUCTION BLUEPRINT</span>
              <h3>{blueprints[selectedBlueprint].title}</h3>
              <p className="blueprint-desc">{blueprints[selectedBlueprint].aiReasoning}</p>
              
              <div className="blueprint-impact-badge">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m18 15-6-6-6 6"/></svg>
                <span>{blueprints[selectedBlueprint].impact}</span>
              </div>

              <div className="blueprint-actions">
                <Link to="/signup" className="product-primary-btn">
                  Use this blueprint
                </Link>
                <button onClick={handleTestRun} className="product-secondary-btn">
                  Simulate in canvas
                </button>
              </div>
            </div>

            <div className="blueprint-card-right">
              <div className="flow-breakdown-box">
                <div className="flow-step-item">
                  <span className="step-num">01</span>
                  <div>
                    <b>Incoming Event:</b>
                    <p>{blueprints[selectedBlueprint].trigger}</p>
                  </div>
                </div>
                <div className="flow-step-item">
                  <span className="step-num">02</span>
                  <div>
                    <b>Autonomous Action:</b>
                    <p>{blueprints[selectedBlueprint].action}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SAFETY & ENTERPRISE CONTROLS */}
        <section className="automation-safety-section">
          <div className="section-pill-tag">ENTERPRISE SAFETY MESH</div>
          <h2 className="section-title">Built with strict deterministic guardrails</h2>
          <p className="section-subtitle">Autonomous power without the risk of uncontrolled hallucinations.</p>

          <div className="pillars-grid">
            <div className="pillar-card">
              <div className="pillar-icon bg-violet">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/></svg>
              </div>
              <h3>Human-in-the-Loop Intercepts</h3>
              <p>Configure sensitive actions to pause for instant human review in Slack, Microsoft Teams, or email with one-click approval buttons.</p>
              <ul className="pillar-checklist">
                <li><span>✓</span> Interactive interactive slack cards</li>
                <li><span>✓</span> Custom financial threshold pauses</li>
                <li><span>✓</span> Timeout & escalation fail-safes</li>
              </ul>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon bg-cyan">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>
              </div>
              <h3>Deterministic State Rollbacks</h3>
              <p>If any downstream third-party API returns an error, Astra automatically triggers compensating transactions to prevent partial writes.</p>
              <ul className="pillar-checklist">
                <li><span>✓</span> ACID-compliant distributed sagas</li>
                <li><span>✓</span> Automated webhook retry backoff</li>
                <li><span>✓</span> Dead letter queue telemetry</li>
              </ul>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon bg-emerald">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <h3>Isolated Sandboxed Execution</h3>
              <p>Every automation executes inside an isolated ephemeral microVM with encrypted memory and zero retention of sensitive customer prompts.</p>
              <ul className="pillar-checklist">
                <li><span>✓</span> Ephemeral firewalled sandboxes</li>
                <li><span>✓</span> Zero model training on customer data</li>
                <li><span>✓</span> SOC 2 Type II audit logging</li>
              </ul>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="product-cta-banner">
          <div className="cta-banner-content">
            <h2>Ready to automate your most critical business flows?</h2>
            <p>Deploy your first self-driving workflow in less than 5 minutes.</p>
            <div className="banner-actions">
              <Link to="/signup" className="product-primary-btn">
                Start building for free
              </Link>
              <Link to="/talk-to-sales" className="product-secondary-btn">
                Talk to an automation architect
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
