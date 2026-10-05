import { useState, useMemo } from "react";
import { Link } from "react-router";
import { SiteFooter, SiteNav } from "../../App";
import { useTheme } from "../theme";

type Category = "all" | "crm" | "dev" | "data" | "finance" | "communication";

interface IntegrationApp {
  id: string;
  name: string;
  category: Category;
  tag: string;
  desc: string;
  icon: string;
  connectedDefault?: boolean;
  syncType: "Bi-directional" | "Real-time CDC" | "Event Webhook";
}

const APPS: IntegrationApp[] = [
  { id: "slack", name: "Slack", category: "communication", tag: "Messaging", desc: "Push real-time alerts, approval requests, and automated KPI digests directly into channels.", icon: "💬", syncType: "Bi-directional", connectedDefault: true },
  { id: "salesforce", name: "Salesforce", category: "crm", tag: "CRM", desc: "Bi-directionally sync pipeline stages, account intelligence, and custom object records without latency.", icon: "☁️", syncType: "Bi-directional", connectedDefault: true },
  { id: "github", name: "GitHub", category: "dev", tag: "Engineering", desc: "Correlate code commits, pull requests, and CI/CD pipelines directly with production metrics.", icon: "🐙", syncType: "Event Webhook", connectedDefault: true },
  { id: "stripe", name: "Stripe", category: "finance", tag: "Billing", desc: "Stream invoices, subscription changes, and MRR movements straight into your intelligence layer.", icon: "💳", syncType: "Real-time CDC", connectedDefault: true },
  { id: "snowflake", name: "Snowflake", category: "data", tag: "Warehouse", desc: "Query data directly in Snowflake using Astra's zero-copy federated query engine.", icon: "❄️", syncType: "Bi-directional" },
  { id: "postgres", name: "PostgreSQL", category: "data", tag: "Database", desc: "Connect read-replicas with instant schema auto-discovery and end-to-end TLS 1.3 encryption.", icon: "🐘", syncType: "Real-time CDC" },
  { id: "linear", name: "Linear", category: "dev", tag: "Productivity", desc: "Link engineering issue velocity to customer impact and automated sprint reporting.", icon: "📐", syncType: "Bi-directional" },
  { id: "notion", name: "Notion", category: "communication", tag: "Knowledge", desc: "Turn documentation and roadmap databases into dynamic, live-updating team widgets.", icon: "📝", syncType: "Bi-directional" },
  { id: "hubspot", name: "HubSpot", category: "crm", tag: "Marketing", desc: "Enrich inbound marketing contacts and trigger personalized automation sequences.", icon: "🎯", syncType: "Bi-directional" },
  { id: "aws", name: "Amazon Web Services", category: "dev", tag: "Cloud", desc: "Ingest CloudWatch metrics, S3 data lakes, and EventBridge streams with zero lag.", icon: "⚡", syncType: "Event Webhook" },
  { id: "datadog", name: "Datadog", category: "dev", tag: "Observability", desc: "Ingest APM traces and error budgets to automatically orchestrate incident response flows.", icon: "🐶", syncType: "Real-time CDC" },
  { id: "supabase", name: "Supabase", category: "data", tag: "Backend", desc: "Direct integration with Postgres and Auth for instantaneous realtime database subscriptions.", icon: "⚡", syncType: "Real-time CDC" },
];

export default function IntegrationsPage() {
  const { dark } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [connectedApps, setConnectedApps] = useState<Record<string, boolean>>({
    slack: true,
    salesforce: true,
    github: true,
    stripe: true,
  });
  const [activeCodeLang, setActiveCodeLang] = useState<"ts" | "curl" | "python" | "go">("ts");
  const [apiSuccess, setApiSuccess] = useState(false);

  const filteredApps = useMemo(() => {
    return APPS.filter((app) => {
      const matchesCat = selectedCategory === "all" || app.category === selectedCategory;
      const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            app.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            app.tag.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const toggleConnect = (id: string) => {
    setConnectedApps((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleTestApi = () => {
    setApiSuccess(true);
    setTimeout(() => setApiSuccess(false), 3000);
  };

  return (
    <div className={`subpage app integrations-product-page ${dark ? "dark" : ""}`}>
      <div className="subpage-noise" />
      <SiteNav />

      <main className="product-page-main">
        {/* HERO SECTION */}
        <section className="product-hero">
          <div className="product-hero-badge">
            <span className="badge-dot" style={{ background: "#06b6d4" }} />
            <span>Astra Integration Hub</span>
            <span className="badge-pill">150+ Connectors</span>
          </div>

          <h1 className="product-hero-title">
            Every tool in your stack. <br />
            <em className="gradient-text-integrations">Connected in perfect harmony.</em>
          </h1>

          <p className="product-hero-subtitle">
            Bi-directional real-time data synchronization across all your databases, CRMs, 
            communication channels, and cloud infrastructure. Zero duct tape required.
          </p>

          <div className="product-hero-actions">
            <Link to="/signup" className="product-primary-btn">
              Explore all 150+ apps
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </Link>
            <a href="#api-studio" className="product-secondary-btn">
              View Developer API Docs
            </a>
          </div>

          {/* Quick Metrics */}
          <div className="hero-metrics-bar">
            <div className="metric-item">
              <b>150+</b>
              <small>Pre-built Connectors</small>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <b>&lt; 250ms</b>
              <small>Sync Latency</small>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <b>Bi-directional</b>
              <small>Two-way Realtime Sync</small>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <b>Custom Webhooks</b>
              <small>Unlimited Endpoints</small>
            </div>
          </div>
        </section>

        {/* INTERACTIVE INTEGRATION DIRECTORY & APP GRID */}
        <section className="integrations-directory-section">
          <div className="directory-header">
            <div className="directory-search-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input
                type="text"
                placeholder="Search 150+ integrations by name, protocol, or tag (e.g. Salesforce, Postgres, Webhook)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="clear-search-btn">✕</button>
              )}
            </div>

            <div className="category-pill-bar">
              {[
                { id: "all", label: "All Integrations" },
                { id: "crm", label: "CRMs & Sales" },
                { id: "dev", label: "Developer & Cloud" },
                { id: "data", label: "Databases & Storage" },
                { id: "finance", label: "Finance & Billing" },
                { id: "communication", label: "Communication" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  className={`category-pill ${selectedCategory === cat.id ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat.id as Category)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* App Cards Grid */}
          <div className="apps-grid">
            {filteredApps.map((app) => {
              const isConnected = !!connectedApps[app.id];
              return (
                <div key={app.id} className={`app-card ${isConnected ? "is-connected" : ""}`}>
                  <div className="app-card-top">
                    <div className="app-icon-wrapper">
                      <span className="app-emoji">{app.icon}</span>
                    </div>
                    <div className="app-status-wrap">
                      <span className={`sync-pill ${app.syncType.toLowerCase().replace(/\s+/g, "-")}`}>
                        {app.syncType}
                      </span>
                    </div>
                  </div>

                  <div className="app-card-body">
                    <div className="app-title-row">
                      <h4>{app.name}</h4>
                      <span className="app-tag-badge">{app.tag}</span>
                    </div>
                    <p>{app.desc}</p>
                  </div>

                  <div className="app-card-footer">
                    <button
                      onClick={() => toggleConnect(app.id)}
                      className={`connect-btn ${isConnected ? "connected" : ""}`}
                    >
                      {isConnected ? (
                        <>
                          <span className="dot active-green" />
                          Connected
                        </>
                      ) : (
                        "+ Connect App"
                      )}
                    </button>
                    <Link to="/signup" className="config-link">
                      Configure →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* INTERACTIVE SCHEMA FIELD MAPPER */}
        <section className="schema-mapper-section">
          <div className="section-pill-tag">VISUAL FIELD MAPPING</div>
          <h2 className="section-title">Zero-code schema synchronization</h2>
          <p className="section-subtitle">Map fields across heterogenous databases and SaaS tools with point-and-click ease.</p>

          <div className="mapper-canvas-card">
            <div className="mapper-grid">
              {/* Source Column */}
              <div className="mapper-col">
                <div className="col-header">
                  <span className="source-badge">SOURCE</span>
                  <h4>Salesforce CRM</h4>
                </div>
                <div className="field-box active-field">
                  <span>account.annual_revenue</span>
                  <small>Currency (USD)</small>
                </div>
                <div className="field-box">
                  <span>contact.primary_email</span>
                  <small>String (Email)</small>
                </div>
                <div className="field-box">
                  <span>opportunity.stage_name</span>
                  <small>Enum (Stage)</small>
                </div>
              </div>

              {/* Center Transformation Node */}
              <div className="mapper-center-node">
                <div className="engine-circle">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  <span>Astra Universal Schema</span>
                </div>
                <div className="sync-pulse-line">
                  <span className="flowing-dot" />
                </div>
              </div>

              {/* Destination Column */}
              <div className="mapper-col">
                <div className="col-header">
                  <span className="dest-badge">DESTINATION</span>
                  <h4>Snowflake Data Cloud</h4>
                </div>
                <div className="field-box active-field">
                  <span>PUBLIC.METRICS.ARR_VALUE</span>
                  <small>NUMERIC(18,2)</small>
                </div>
                <div className="field-box">
                  <span>PUBLIC.USERS.USER_EMAIL</span>
                  <small>VARCHAR(255)</small>
                </div>
                <div className="field-box">
                  <span>PUBLIC.PIPELINE.DEAL_STATUS</span>
                  <small>VARCHAR(50)</small>
                </div>
              </div>
            </div>

            <div className="mapper-status-bar">
              <div className="status-item">
                <span className="dot green" />
                <span>CDC Stream Active (0.18s latency)</span>
              </div>
              <div className="status-item">
                <span>Conflict Resolution: <b>Last Write Wins (Deterministic)</b></span>
              </div>
            </div>
          </div>
        </section>

        {/* DEVELOPER API & WEBHOOK STUDIO */}
        <section id="api-studio" className="developer-api-section">
          <div className="api-studio-card">
            <div className="api-studio-left">
              <span className="badge-pill">DEVELOPER FIRST</span>
              <h2>Universal REST & GraphQL APIs</h2>
              <p>
                Need custom integrations? Use our fully typed SDKs and robust webhook engine 
                to connect proprietary on-premise systems with full enterprise security.
              </p>

              <div className="api-features-list">
                <div className="api-feat-item">
                  <span className="feat-bullet">01</span>
                  <div>
                    <b>Strict OpenAPI 3.1 & TypeScript Types</b>
                    <p>Auto-generate client SDKs for any language in your stack.</p>
                  </div>
                </div>
                <div className="api-feat-item">
                  <span className="feat-bullet">02</span>
                  <div>
                    <b>Guaranteed Exactly-Once Webhook Delivery</b>
                    <p>Automatic retry with exponential backoff and replay debugging.</p>
                  </div>
                </div>
              </div>

              <button onClick={handleTestApi} className="product-primary-btn test-api-btn">
                {apiSuccess ? "Payload Delivered (200 OK)" : "Test Sample Payload"}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </button>
            </div>

            <div className="api-studio-right">
              <div className="code-editor-window">
                <div className="code-header">
                  <div className="code-tabs">
                    {(["ts", "curl", "python", "go"] as const).map((lang) => (
                      <button
                        key={lang}
                        className={`code-tab ${activeCodeLang === lang ? "active" : ""}`}
                        onClick={() => setActiveCodeLang(lang)}
                      >
                        {lang.toUpperCase()}
                      </button>
                    ))}
                  </div>
                  <span className="code-auth-badge">Bearer API_KEY</span>
                </div>

                <div className="code-body">
                  <pre>
                    {activeCodeLang === "ts" && `import { AstraClient } from "@astra/sdk";

const astra = new AstraClient({
  apiKey: process.env.ASTRA_SECRET_KEY,
});

// Stream real-time telemetry event
const response = await astra.events.ingest({
  entityId: "usr_94821a",
  eventType: "subscription.upgraded",
  payload: {
    tier: "Enterprise",
    arrDelta: 48000,
    currency: "USD",
  },
});

console.log("Synced to Snowflake + Slack:", response.status);`}

                    {activeCodeLang === "curl" && `curl -X POST https://api.astra.ai/v1/events \\
  -H "Authorization: Bearer sec_live_89481b942c" \\
  -H "Content-Type: application/json" \\
  -d '{
    "entityId": "usr_94821a",
    "eventType": "subscription.upgraded",
    "payload": { "tier": "Enterprise", "arrDelta": 48000 }
  }'`}

                    {activeCodeLang === "python" && `from astra import AstraClient

client = AstraClient(api_key="sec_live_89481b942c")

res = client.events.ingest(
    entity_id="usr_94821a",
    event_type="subscription.upgraded",
    payload={"tier": "Enterprise", "arrDelta": 48000}
)
print(f"Status: {res.status_code}")`}

                    {activeCodeLang === "go" && `package main

import (
  "context"
  "github.com/astra-ai/astra-go"
)

func main() {
  client := astra.NewClient("sec_live_89481b942c")
  _ = client.Events.Ingest(context.Background(), astra.IngestParams{
    EntityID:  "usr_94821a",
    EventType: "subscription.upgraded",
  })
}`}
                  </pre>
                </div>

                {apiSuccess && (
                  <div className="api-test-banner">
                    <span className="badge-dot" style={{ background: "#10b981" }} />
                    <span>HTTP 200 OK — Delivered in 28ms to 3 downstream subscribers.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="product-cta-banner">
          <div className="cta-banner-content">
            <h2>Ready to eliminate data silos forever?</h2>
            <p>Connect your first application in less than 2 minutes.</p>
            <div className="banner-actions">
              <Link to="/signup" className="product-primary-btn">
                Start connecting tools
              </Link>
              <Link to="/talk-to-sales" className="product-secondary-btn">
                Request custom connector
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
