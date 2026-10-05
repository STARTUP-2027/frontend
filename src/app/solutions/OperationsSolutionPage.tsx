import { useState } from "react";
import { Link } from "react-router";
import { SiteFooter, SiteNav } from "../../App";
import { useTheme } from "../theme";

type Department = "it" | "finance" | "legal" | "customer";

interface SLATicket {
  id: string;
  dept: Department;
  title: string;
  requester: string;
  slaTarget: string;
  slaActual: string;
  status: "AUTOMATED" | "RESOLVED" | "IN_PROGRESS";
  savedTime: string;
}

const TICKETS: SLATicket[] = [
  { id: "T-401", dept: "it", title: "Automated Okta SSO & Hardware Provisioning", requester: "New Hire: Marcus Chen", slaTarget: "48 hours", slaActual: "2.4 minutes", status: "AUTOMATED", savedTime: "4.5 hrs" },
  { id: "T-402", dept: "finance", title: "Cross-Border Vendor Payment Reconciliation", requester: "AWS Invoice #94821", slaTarget: "5 business days", slaActual: "45 seconds", status: "AUTOMATED", savedTime: "3.2 hrs" },
  { id: "T-403", dept: "legal", title: "Enterprise Mutual NDA & Security Review", requester: "Lumon Corp Legal", slaTarget: "3 business days", slaActual: "12 minutes", status: "RESOLVED", savedTime: "6.0 hrs" },
  { id: "T-404", dept: "customer", title: "VIP SLA Escalation & Refund Request", requester: "Tier 1 Enterprise Client", slaTarget: "2 hours", slaActual: "1.8 minutes", status: "AUTOMATED", savedTime: "2.0 hrs" },
];

export default function OperationsSolutionPage() {
  const { dark } = useTheme();
  const [activeDept, setActiveDept] = useState<"all" | Department>("all");
  const [isAutonomousMode, setIsAutonomousMode] = useState(true);

  const filteredTickets = activeDept === "all" 
    ? TICKETS 
    : TICKETS.filter((t) => t.dept === activeDept);

  return (
    <div className={`subpage app operations-solution-page ${dark ? "dark" : ""}`}>
      <div className="subpage-noise" />
      <SiteNav />

      <main className="solution-page-main">
        {/* HERO SECTION */}
        <section className="solution-hero">
          <div className="solution-hero-badge bg-blue-soft">
            <span className="badge-dot dot-blue" />
            <span>ASTRA FOR ENTERPRISE OPERATIONS</span>
            <span className="badge-pill pill-blue">Zero Operational Drag</span>
          </div>

          <h1 className="solution-hero-title">
            Scale resilient company operations <br />
            <em className="gradient-text-ops">without multiplying complexity.</em>
          </h1>

          <p className="solution-hero-subtitle">
            Connect intake, triage, cross-department workflows, and executive reporting in one adaptive 
            operating system. Turn chaotic ticketing queues into self-healing automated processes.
          </p>

          <div className="solution-hero-actions">
            <Link to="/signup" className="solution-primary-btn btn-blue">
              Streamline operations
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </Link>
            <Link to="/talk-to-sales" className="solution-secondary-btn">
              Talk with an Ops Architect
            </Link>
          </div>

          {/* Impact Stats */}
          <div className="solution-metrics-row">
            <div className="sol-metric-card">
              <span className="sol-metric-num">74%</span>
              <span className="sol-metric-label">Reduction in Ticket Cycle Time</span>
            </div>
            <div className="sol-metric-card">
              <span className="sol-metric-num">2.8×</span>
              <span className="sol-metric-label">Faster Execution Speed</span>
            </div>
            <div className="sol-metric-card">
              <span className="sol-metric-num">12,000+</span>
              <span className="sol-metric-label">Monthly Hours Automated</span>
            </div>
            <div className="sol-metric-card">
              <span className="sol-metric-num">100%</span>
              <span className="sol-metric-label">Audit-Ready Compliance</span>
            </div>
          </div>
        </section>

        {/* INTERACTIVE CROSS-DEPT SLA COMMAND CENTER */}
        <section className="ops-sla-section">
          <div className="solution-card-container">
            <div className="sla-header-row">
              <div>
                <span className="section-pill-tag">PROCESS COMMAND CENTER</span>
                <h2>Cross-Department SLA Telemetry</h2>
                <p>Monitor live intake queues, automated resolution latency, and compliance SLAs across every internal team.</p>
              </div>

              <div className="dept-filter-bar">
                {[
                  { id: "all", label: "All Teams" },
                  { id: "it", label: "IT & Security" },
                  { id: "finance", label: "Finance & Billing" },
                  { id: "legal", label: "Legal & Compliance" },
                  { id: "customer", label: "Customer Operations" },
                ].map((dept) => (
                  <button
                    key={dept.id}
                    className={`dept-filter-btn ${activeDept === dept.id ? "active" : ""}`}
                    onClick={() => setActiveDept(dept.id as "all" | Department)}
                  >
                    {dept.label}
                  </button>
                ))}
              </div>
            </div>

            {/* SLA Table */}
            <div className="sla-table-wrap">
              <div className="sla-table-head">
                <span>QUEUE ID</span>
                <span>DEPARTMENT</span>
                <span>WORKFLOW DESCRIPTION</span>
                <span>REQUESTER</span>
                <span>LEGACY SLA</span>
                <span>ASTRA RESOLUTION</span>
                <span>HOURS SAVED</span>
              </div>

              <div className="sla-table-body">
                {filteredTickets.map((ticket) => (
                  <div key={ticket.id} className="sla-row">
                    <span className="ticket-id">{ticket.id}</span>
                    <span className="ticket-dept">
                      <span className={`dept-badge ${ticket.dept}`}>{ticket.dept.toUpperCase()}</span>
                    </span>
                    <span className="ticket-title">{ticket.title}</span>
                    <span className="ticket-req">{ticket.requester}</span>
                    <span className="ticket-target strike-through">{ticket.slaTarget}</span>
                    <span className="ticket-actual highlight-green">
                      <span className="dot green" /> {ticket.slaActual}
                    </span>
                    <span className="ticket-saved">+{ticket.savedTime}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* BEFORE & AFTER TRANSFORMATION COMPARATOR */}
        <section className="ops-transformation-section">
          <div className="transformation-card">
            <div className="trans-header">
              <span className="section-pill-tag">OPERATIONAL VELOCITY COMPARATOR</span>
              <h2>How Astra eliminates operational bottlenecks</h2>
              <p>Toggle between traditional fragmented workflows and Astra Autonomous Operations.</p>

              <div className="mode-toggle-bar">
                <button
                  className={`mode-btn ${!isAutonomousMode ? "active" : ""}`}
                  onClick={() => setIsAutonomousMode(false)}
                >
                  Legacy Manual Operations (Chaos)
                </button>
                <button
                  className={`mode-btn ${isAutonomousMode ? "active" : ""}`}
                  onClick={() => setIsAutonomousMode(true)}
                >
                  ⚡ Astra Autonomous Operations (Frictionless)
                </button>
              </div>
            </div>

            <div className="transformation-body">
              {!isAutonomousMode ? (
                <div className="trans-state legacy-state">
                  <div className="state-badge-row">
                    <span className="state-pill red">LEGACY OPERATION: 3 DAYS 4 HOURS AVERAGE TIME</span>
                  </div>
                  <div className="trans-flow-steps">
                    <div className="trans-step step-bad">
                      <b>01. Scattered Intake</b>
                      <p>Requests arrive in messy Slack DMs, random emails, and spreadsheets.</p>
                      <small className="time-tag">Latency: 18 hours</small>
                    </div>
                    <div className="trans-step step-bad">
                      <b>02. Manual Triage</b>
                      <p>Managers manually route tickets to engineers and operators during weekly syncs.</p>
                      <small className="time-tag">Latency: 24 hours</small>
                    </div>
                    <div className="trans-step step-bad">
                      <b>03. Spliced Approvals</b>
                      <p>Approval chains stall waiting for executives to check buried email threads.</p>
                      <small className="time-tag">Latency: 32 hours</small>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="trans-state astra-state">
                  <div className="state-badge-row">
                    <span className="state-pill green">ASTRA AUTONOMOUS OPS: 2.4 MINUTES END-TO-END</span>
                  </div>
                  <div className="trans-flow-steps">
                    <div className="trans-step step-good">
                      <b>01. Unified Smart Intake</b>
                      <p>AI automatically parses intent, attachments, and priorities from any source.</p>
                      <small className="time-tag highlight">Latency: Instant (0.2s)</small>
                    </div>
                    <div className="trans-step step-good">
                      <b>02. Autonomous Agent Execution</b>
                      <p>Astra executes database queries, creates API accounts, and validates permissions.</p>
                      <small className="time-tag highlight">Latency: 45 seconds</small>
                    </div>
                    <div className="trans-step step-good">
                      <b>03. 1-Click Interactive Approval</b>
                      <p>Executives approve high-threshold items with single-tap Slack / mobile cards.</p>
                      <small className="time-tag highlight">Latency: 90 seconds</small>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 3 CORE OPS PILLARS */}
        <section className="ops-pillars-section">
          <div className="section-pill-tag">ENGINEERED FOR RESILIENCE</div>
          <h2 className="section-title">A modern operating system for modern companies</h2>
          <p className="section-subtitle">Connect people, process, and data in one adaptive environment.</p>

          <div className="pillars-grid">
            <div className="pillar-card">
              <div className="pillar-icon bg-blue-soft text-blue">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="m9 12 2 2 4-4"/></svg>
              </div>
              <h3>Universal Process Intake</h3>
              <p>Turn unstructured requests from Slack, Jira, email, or Google Forms into structured, prioritized workflows with automatic deduplication.</p>
              <ul className="pillar-checklist">
                <li><span>✓</span> Natural language intent parsing</li>
                <li><span>✓</span> Automated urgency classification</li>
                <li><span>✓</span> Real-time requester status portal</li>
              </ul>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon bg-blue-soft text-blue">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <h3>Automated SLA Enforcement</h3>
              <p>Set granular SLAs for every internal queue. Astra automatically escalates bottlenecks and rebalances workloads before deadlines are missed.</p>
              <ul className="pillar-checklist">
                <li><span>✓</span> Predictive SLA breach alerts</li>
                <li><span>✓</span> Dynamic on-call rota balancing</li>
                <li><span>✓</span> Executive weekly SLA summaries</li>
              </ul>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon bg-blue-soft text-blue">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
              </div>
              <h3>Continuous Process Optimization</h3>
              <p>Astra analyzes thousands of workflow executions to identify recurring human bottlenecks and automatically suggests automation shortcuts.</p>
              <ul className="pillar-checklist">
                <li><span>✓</span> Automated process friction heatmaps</li>
                <li><span>✓</span> Root cause trend discovery</li>
                <li><span>✓</span> 1-click suggested optimizations</li>
              </ul>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="product-cta-banner bg-blue-gradient">
          <div className="cta-banner-content">
            <h2>Ready to run your operations on autopilot?</h2>
            <p>Deploy Astra Operations in under a week. Zero code migration.</p>
            <div className="banner-actions">
              <Link to="/signup" className="product-primary-btn">
                Start streamlining operations
              </Link>
              <Link to="/talk-to-sales" className="product-secondary-btn">
                Book an Operations Assessment
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
