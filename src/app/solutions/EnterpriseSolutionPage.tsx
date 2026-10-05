import { useState } from "react";
import { Link } from "react-router";
import { SiteFooter, SiteNav } from "../../App";
import { useTheme } from "../theme";

type Region = "us" | "eu" | "apac" | "uk";

interface RegionInfo {
  name: string;
  location: string;
  latency: string;
  compliance: string[];
  vpcSupported: boolean;
  activeShards: number;
}

const REGIONS: Record<Region, RegionInfo> = {
  us: { name: "US-East & US-West", location: "N. Virginia / Oregon", latency: "8ms", compliance: ["SOC 2 Type II", "HIPAA", "FedRAMP Ready"], vpcSupported: true, activeShards: 48 },
  eu: { name: "EU-Central & West", location: "Frankfurt / Dublin", latency: "11ms", compliance: ["GDPR Sovereignty", "ISO 27001", "BSI C5"], vpcSupported: true, activeShards: 36 },
  apac: { name: "Asia-Pacific", location: "Singapore / Tokyo", latency: "14ms", compliance: ["APEC CBPR", "IRAP Certified", "ISO 27001"], vpcSupported: true, activeShards: 24 },
  uk: { name: "United Kingdom", location: "London", latency: "9ms", compliance: ["UK Cyber Essentials+", "GDPR UK", "SOC 2"], vpcSupported: true, activeShards: 18 },
};

export default function EnterpriseSolutionPage() {
  const { dark } = useTheme();
  const [selectedRegion, setSelectedRegion] = useState<Region>("eu");
  const [activeTab, setActiveTab] = useState<"infra" | "support" | "migration">("infra");

  const reg = REGIONS[selectedRegion];

  return (
    <div className={`subpage app enterprise-solution-page ${dark ? "dark" : ""}`}>
      <div className="subpage-noise" />
      <SiteNav />

      <main className="solution-page-main">
        {/* HERO SECTION */}
        <section className="solution-hero">
          <div className="solution-hero-badge bg-purple-soft">
            <span className="badge-dot dot-purple" />
            <span>ASTRA ENTERPRISE SCALE</span>
            <span className="badge-pill pill-purple">99.999% SLA Guaranteed</span>
          </div>

          <h1 className="solution-hero-title">
            Global scale and governance. <br />
            <em className="gradient-text-enterprise">Without the enterprise drag.</em>
          </h1>

          <p className="solution-hero-subtitle">
            Unify global subsidiaries, disparate cloud environments, and thousands of employees under 
            one secure, compliant, and extraordinarily fast intelligent workspace.
          </p>

          <div className="solution-hero-actions">
            <Link to="/talk-to-sales" className="solution-primary-btn btn-purple">
              Schedule Enterprise Briefing
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </Link>
            <Link to="/signup" className="solution-secondary-btn">
              Explore Enterprise Sandbox
            </Link>
          </div>

          {/* Key Enterprise Trust Stats */}
          <div className="solution-metrics-row">
            <div className="sol-metric-card">
              <span className="sol-metric-num">99.999%</span>
              <span className="sol-metric-label">Financially-Backed Uptime SLA</span>
            </div>
            <div className="sol-metric-card">
              <span className="sol-metric-num">120+</span>
              <span className="sol-metric-label">Countries Supported</span>
            </div>
            <div className="sol-metric-card">
              <span className="sol-metric-num">&lt; 15 Mins</span>
              <span className="sol-metric-label">Dedicated VIP Support SLA</span>
            </div>
            <div className="sol-metric-card">
              <span className="sol-metric-num">Custom BYOK</span>
              <span className="sol-metric-label">Customer-Managed Encryption</span>
            </div>
          </div>
        </section>

        {/* INTERACTIVE GLOBAL MULTI-REGION INFRASTRUCTURE CONSOLE */}
        <section className="enterprise-console-section">
          <div className="solution-card-container">
            <div className="infra-header">
              <div>
                <span className="section-pill-tag">DATA SOVEREIGNTY & ISOLATION</span>
                <h2>Interactive Global Infrastructure Console</h2>
                <p>Select any geographic region to inspect data isolation, local compliance guarantees, and dedicated VPC peering.</p>
              </div>

              <div className="region-selector-bar">
                {(["us", "eu", "apac", "uk"] as const).map((r) => (
                  <button
                    key={r}
                    className={`region-btn ${selectedRegion === r ? "active" : ""}`}
                    onClick={() => setSelectedRegion(r)}
                  >
                    {r === "us" && "🇺🇸 "}
                    {r === "eu" && "🇪🇺 "}
                    {r === "apac" && "🇸🇬 "}
                    {r === "uk" && "🇬🇧 "}
                    {REGIONS[r].name}
                  </button>
                ))}
              </div>
            </div>

            <div className="infra-display-grid">
              {/* Left Region Stats */}
              <div className="region-telemetry-box">
                <div className="region-main-stat">
                  <span className="region-loc-label">PRIMARY DATA CENTER REGION</span>
                  <h3>{reg.name} ({reg.location})</h3>
                  <div className="shard-badge">
                    <span className="dot green" /> {reg.activeShards} Dedicated Isolated Compute Shards
                  </div>
                </div>

                <div className="region-specs-grid">
                  <div className="spec-card">
                    <small>EDGE QUERY LATENCY</small>
                    <b>{reg.latency} p99</b>
                  </div>
                  <div className="spec-card">
                    <small>AWS / AZURE VPC PEERING</small>
                    <b className="text-green">Direct Dedicated Link</b>
                  </div>
                </div>

                <div className="compliance-chips-box">
                  <b>Regional Sovereignty & Attestations:</b>
                  <div className="chips-list">
                    {reg.compliance.map((c) => (
                      <span key={c} className="comp-chip">✓ {c}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Global Architecture Topology */}
              <div className="topology-card">
                <div className="topo-head">
                  <span className="topo-title">DEDICATED ZERO-TRUST MESH TOPOLOGY</span>
                  <span className="topo-status">Live Connected</span>
                </div>

                <div className="topo-layers">
                  <div className="topo-layer">
                    <span className="layer-num">01</span>
                    <div>
                      <b>Edge Anycast Gateway & WAF</b>
                      <p>DDoS protection, TLS 1.3 termination, and geofencing.</p>
                    </div>
                  </div>
                  <div className="topo-layer">
                    <span className="layer-num">02</span>
                    <div>
                      <b>Customer-Isolated Tenant VPC</b>
                      <p>Hardware-isolated containers with zero memory sharing.</p>
                    </div>
                  </div>
                  <div className="topo-layer">
                    <span className="layer-num">03</span>
                    <div>
                      <b>Customer-Managed KMS Storage</b>
                      <p>AES-256 envelope encryption with customer root keys.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4-WEEK ENTERPRISE MIGRATION ROADMAP */}
        <section className="enterprise-migration-section">
          <div className="migration-card">
            <div className="migration-head">
              <span className="section-pill-tag">WHITE-GLOVE ONBOARDING</span>
              <h2>Proven 4-Week Enterprise Migration Framework</h2>
              <p>Our dedicated solutions architects migrate complex legacy workflows with zero downtime.</p>
            </div>

            <div className="migration-steps-grid">
              <div className="mig-step">
                <span className="step-badge">WEEK 01</span>
                <h4>Discovery & SSO Setup</h4>
                <p>Okta/Azure AD SCIM directory integration, RBAC definition, and VPC peering setup.</p>
              </div>
              <div className="mig-step">
                <span className="step-badge">WEEK 02</span>
                <h4>Data & Schema Migration</h4>
                <p>Automated bi-directional sync with Snowflake, Salesforce, and legacy Postgres data lakes.</p>
              </div>
              <div className="mig-step">
                <span className="step-badge">WEEK 03</span>
                <h4>Workflow Orchestration</h4>
                <p>Custom AI automation buildout, human-in-the-loop approvals, and SLA verification.</p>
              </div>
              <div className="mig-step">
                <span className="step-badge">WEEK 04</span>
                <h4>Organization-Wide Launch</h4>
                <p>Executive dashboards, department enablement sessions, and 24/7 hypercare support.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3 CORE ENTERPRISE PILLARS */}
        <section className="enterprise-pillars-section">
          <div className="section-pill-tag">EXECUTIVE ASSURANCE</div>
          <h2 className="section-title">Built for the Fortune 500 and high-growth scaleups</h2>
          <p className="section-subtitle">The security and reliability global enterprises demand.</p>

          <div className="pillars-grid">
            <div className="pillar-card">
              <div className="pillar-icon bg-purple-soft text-purple">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h3>Custom Governance & Controls</h3>
              <p>Maintain centralized control with custom password policies, IP allowlisting, automated session timeouts, and granular audit log exports.</p>
              <ul className="pillar-checklist">
                <li><span>✓</span> SAML 2.0 & Okta SCIM sync</li>
                <li><span>✓</span> Immutable WORM SIEM audit logs</li>
                <li><span>✓</span> Role-based column level masking</li>
              </ul>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon bg-purple-soft text-purple">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <h3>Dedicated Solutions Architect</h3>
              <p>Every enterprise customer is paired with a named Solutions Architect, Customer Success Manager, and 24/7/365 priority emergency hotline.</p>
              <ul className="pillar-checklist">
                <li><span>✓</span> 15-minute emergency response SLA</li>
                <li><span>✓</span> Quarterly Executive Business Reviews</li>
                <li><span>✓</span> Custom integration engineering</li>
              </ul>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon bg-purple-soft text-purple">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>
              </div>
              <h3>Isolated Multi-Tenant & On-Prem</h3>
              <p>Run Astra within our isolated enterprise cloud, or deploy dedicated VPC clusters inside your existing AWS, Google Cloud, or Azure tenant.</p>
              <ul className="pillar-checklist">
                <li><span>✓</span> Single-tenant VPC deployments</li>
                <li><span>✓</span> Zero shared infrastructure</li>
                <li><span>✓</span> Custom data retention rules</li>
              </ul>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="product-cta-banner bg-purple-gradient">
          <div className="cta-banner-content">
            <h2>Ready to modernize your enterprise workspace?</h2>
            <p>Our solutions team will build a tailored transformation blueprint for your organization.</p>
            <div className="banner-actions">
              <Link to="/talk-to-sales" className="product-primary-btn">
                Request Custom Enterprise Plan
              </Link>
              <Link to="/signup" className="product-secondary-btn">
                Launch Sandbox Environment
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
