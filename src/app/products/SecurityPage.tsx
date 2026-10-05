import { useState } from "react";
import { Link } from "react-router";
import { SiteFooter, SiteNav } from "../../App";
import { useTheme } from "../theme";

type RoleType = "owner" | "auditor" | "engineer" | "member" | "guest";

interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  ip: string;
  location: string;
  status: "RESOLVED" | "VERIFIED" | "ALERT_MITIGATED" | "ELEVATED";
}

export default function SecurityPage() {
  const { dark } = useTheme();
  const [selectedRole, setSelectedRole] = useState<RoleType>("owner");
  const [mfaEnforced, setMfaEnforced] = useState(true);
  const [piiMasking, setPiiMasking] = useState(true);
  const [ipAllowlist, setIpAllowlist] = useState(true);
  const [threatSimulated, setThreatSimulated] = useState(false);

  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([
    { id: "EV-9021", timestamp: "10:48:12 UTC", actor: "sso.okta.bot@lumon.com", action: "SCIM Provision: 14 new engineers", ip: "198.51.100.42", location: "Frankfurt, DE", status: "VERIFIED" },
    { id: "EV-9020", timestamp: "10:46:05 UTC", actor: "priya.shah@northstar.io", action: "Rotated Production KMS Key (AES-256)", ip: "203.0.113.19", location: "San Francisco, US", status: "VERIFIED" },
    { id: "EV-9019", timestamp: "10:42:30 UTC", actor: "audit.bot@ey-global.com", action: "SOC 2 Type II Evidence Bundle Generated", ip: "192.0.2.88", location: "London, UK", status: "VERIFIED" },
    { id: "EV-9018", timestamp: "10:38:19 UTC", actor: "security.daemon@astra.ai", action: "Automated Zero-Day Vulnerability Scan (0 found)", ip: "Internal Mesh", location: "Global Fleet", status: "RESOLVED" },
  ]);

  const rolePermissions: Record<RoleType, { name: string; desc: string; perms: Array<{ label: string; enabled: boolean }> }> = {
    owner: {
      name: "Organization Owner",
      desc: "Full administrative control over identity, billing, audit exports, and encryption keys.",
      perms: [
        { label: "Manage KMS Keys & Customer-Managed Encryption (BYOK)", enabled: true },
        { label: "Enforce Org-Wide SAML 2.0 & Okta SCIM Directory Sync", enabled: true },
        { label: "Access Raw Immutable Audit Log Stream & Export", enabled: true },
        { label: "Configure Automated PII / PHI Redaction Policies", enabled: true },
        { label: "Revoke Active User Sessions & Enforce Hardware MFA", enabled: true },
      ],
    },
    auditor: {
      name: "Security & Compliance Auditor",
      desc: "Read-only access to compliance proof artifacts, cryptographic signatures, and audit trails.",
      perms: [
        { label: "View SOC 2, ISO 27001, and HIPAA Attestations", enabled: true },
        { label: "Stream Real-time Security Event Telemetry", enabled: true },
        { label: "Export Evidence Logs for Third-Party Penetration Audits", enabled: true },
        { label: "Modify Production Workflows or User Roles", enabled: false },
        { label: "Access Customer Plaintext PII Data", enabled: false },
      ],
    },
    engineer: {
      name: "Data & Platform Engineer",
      desc: "Can build workflows and configure integrations with automated PII masking enforced.",
      perms: [
        { label: "Connect Databases (PostgreSQL, Snowflake, BigQuery)", enabled: true },
        { label: "Create & Test Autonomous Node Workflows", enabled: true },
        { label: "Generate Scoped Ephemeral API Keys (90-day expiry)", enabled: true },
        { label: "Bypass Data Masking Policies or Disable TLS", enabled: false },
        { label: "Change Organization Billing or Security Policies", enabled: false },
      ],
    },
    member: {
      name: "Standard Workspace Member",
      desc: "Collaborates on dashboards and automated processes within assigned project scopes.",
      perms: [
        { label: "View Team Dashboards & Metric Summaries", enabled: true },
        { label: "Trigger Pre-Approved Team Workflows", enabled: true },
        { label: "Export Anonymized PDF Reports", enabled: true },
        { label: "Invite External Guests or Change Team Roles", enabled: false },
        { label: "Modify Workspace Security Policies", enabled: false },
      ],
    },
    guest: {
      name: "External Restricted Guest",
      desc: "Ephemeral read-only access to specific project views with strict watermark overlays.",
      perms: [
        { label: "View Specific Shared Dashboard with Watermark", enabled: true },
        { label: "Download Underlying Raw Datasets", enabled: false },
        { label: "Trigger Automated Actions or Webhooks", enabled: false },
        { label: "Access System Logs or API Documentation", enabled: false },
        { label: "Persist Session beyond 24 Hours", enabled: false },
      ],
    },
  };

  const handleSimulateThreat = () => {
    if (threatSimulated) return;
    setThreatSimulated(true);

    const newThreat: AuditEvent = {
      id: `EV-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toLocaleTimeString() + " UTC",
      actor: "unknown.ip.anomaly@tor-exit.net",
      action: "Unusual geo-login attempt blocked by Astra Zero-Trust Guard",
      ip: "185.220.101.5",
      location: "Unknown VPN / Proxy",
      status: "ALERT_MITIGATED",
    };

    setAuditEvents((prev) => [newThreat, ...prev]);

    setTimeout(() => {
      setThreatSimulated(false);
    }, 4000);
  };

  return (
    <div className={`subpage app security-product-page ${dark ? "dark" : ""}`}>
      <div className="subpage-noise" />
      <SiteNav />

      <main className="product-page-main">
        {/* HERO SECTION */}
        <section className="product-hero">
          <div className="product-hero-badge">
            <span className="badge-dot" style={{ background: "#10b981" }} />
            <span>Astra Zero-Trust Architecture</span>
            <span className="badge-pill">SOC 2 Type II Certified</span>
          </div>

          <h1 className="product-hero-title">
            Fortress-grade security. <br />
            <em className="gradient-text-security">Without the enterprise friction.</em>
          </h1>

          <p className="product-hero-subtitle">
            Enterprise-grade governance, end-to-end cryptographic isolation, continuous automated compliance, 
            and granular role-based access control built for global organizations.
          </p>

          <div className="product-hero-actions">
            <Link to="/signup" className="product-primary-btn">
              Explore Trust Center
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </Link>
            <Link to="/talk-to-sales" className="product-secondary-btn">
              Download Security Whitepaper
            </Link>
          </div>

          {/* Compliance Logos Bar */}
          <div className="security-badges-row">
            <div className="cert-pill">
              <span className="cert-check">🛡️</span>
              <b>SOC 2 Type II</b>
              <small>Ernst & Young Verified</small>
            </div>
            <div className="cert-pill">
              <span className="cert-check">🔒</span>
              <b>ISO / IEC 27001</b>
              <small>Information Security</small>
            </div>
            <div className="cert-pill">
              <span className="cert-check">🏥</span>
              <b>HIPAA Ready</b>
              <small>BAA Available</small>
            </div>
            <div className="cert-pill">
              <span className="cert-check">🇪🇺</span>
              <b>GDPR & CCPA</b>
              <small>EU Data Residency</small>
            </div>
            <div className="cert-pill">
              <span className="cert-check">⚡</span>
              <b>99.999% SLA</b>
              <small>Enterprise High-Availability</small>
            </div>
          </div>
        </section>

        {/* INTERACTIVE RBAC & PERMISSION MATRIX SIMULATOR */}
        <section className="rbac-simulator-section">
          <div className="studio-container">
            <div className="section-pill-tag">GRANULAR ACCESS CONTROLS</div>
            <h2 className="section-title">Interactive Role-Based Access Control (RBAC)</h2>
            <p className="section-subtitle">Simulate real-time policy enforcement across your organization hierarchy.</p>

            <div className="rbac-card">
              {/* Role Navigation Tabs */}
              <div className="rbac-role-tabs">
                {(["owner", "auditor", "engineer", "member", "guest"] as const).map((r) => (
                  <button
                    key={r}
                    className={`role-tab ${selectedRole === r ? "active" : ""}`}
                    onClick={() => setSelectedRole(r)}
                  >
                    {r === "owner" && "👑 "}
                    {r === "auditor" && "🔍 "}
                    {r === "engineer" && "⚙️ "}
                    {r === "member" && "👤 "}
                    {r === "guest" && "🌐 "}
                    {rolePermissions[r].name}
                  </button>
                ))}
              </div>

              {/* Role Detail View */}
              <div className="role-details-panel">
                <div className="role-header-box">
                  <div>
                    <h3>{rolePermissions[selectedRole].name}</h3>
                    <p>{rolePermissions[selectedRole].desc}</p>
                  </div>
                  <div className="global-policy-toggles">
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={mfaEnforced} 
                        onChange={() => setMfaEnforced(!mfaEnforced)} 
                      />
                      <span>Hardware MFA Enforced</span>
                    </label>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={piiMasking} 
                        onChange={() => setPiiMasking(!piiMasking)} 
                      />
                      <span>Auto PII Redaction</span>
                    </label>
                  </div>
                </div>

                <div className="permissions-matrix-grid">
                  {rolePermissions[selectedRole].perms.map((perm, idx) => (
                    <div key={idx} className={`perm-row ${perm.enabled ? "enabled" : "disabled"}`}>
                      <div className="perm-status-icon">
                        {perm.enabled ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        )}
                      </div>
                      <span className="perm-label">{perm.label}</span>
                      <span className={`perm-badge ${perm.enabled ? "allowed" : "denied"}`}>
                        {perm.enabled ? "AUTHORIZED" : "RESTRICTED"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LIVE REAL-TIME AUDIT TRAIL & THREAT MITIGATION SIMULATOR */}
        <section className="security-audit-section">
          <div className="studio-container">
            <div className="audit-header-row">
              <div>
                <span className="badge-pill">IMMUTABLE AUDIT TRAIL</span>
                <h2>Real-time SIEM Security Telemetry</h2>
                <p>Every read, write, key rotation, and session access is cryptographically signed and stored in immutable WORM storage.</p>
              </div>

              <button 
                onClick={handleSimulateThreat}
                className={`threat-sim-btn ${threatSimulated ? "active-alert" : ""}`}
                disabled={threatSimulated}
              >
                <span className="btn-beacon" />
                {threatSimulated ? "Mitigating Threat (Auto-blocked)..." : "Simulate Anomaly Attack"}
              </button>
            </div>

            <div className="audit-table-card">
              <div className="audit-table-head">
                <span>EVENT ID</span>
                <span>TIMESTAMP</span>
                <span>ACTOR & ENTITY</span>
                <span>ACTION PERFORMED</span>
                <span>IP & LOCATION</span>
                <span>STATUS</span>
              </div>

              <div className="audit-table-body">
                {auditEvents.map((ev) => (
                  <div key={ev.id} className={`audit-row status-${ev.status.toLowerCase()}`}>
                    <span className="ev-id">{ev.id}</span>
                    <span className="ev-time">{ev.timestamp}</span>
                    <span className="ev-actor">{ev.actor}</span>
                    <span className="ev-action">{ev.action}</span>
                    <span className="ev-ip">{ev.ip} ({ev.location})</span>
                    <span className={`ev-status-pill status-${ev.status.toLowerCase()}`}>
                      {ev.status === "VERIFIED" && "✓ "}
                      {ev.status === "ALERT_MITIGATED" && "🛡️ "}
                      {ev.status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="audit-table-footer">
                <small>Connected SIEM Integrations: Splunk · Datadog · AWS CloudWatch · SumoLogic</small>
                <Link to="/signup" className="audit-export-link">
                  Export SIEM Webhook Feed →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 3-LAYER CRYPTOGRAPHIC ARCHITECTURE */}
        <section className="security-arch-section">
          <div className="section-pill-tag">CRYPTOGRAPHIC TOPOLOGY</div>
          <h2 className="section-title">Zero-Knowledge multi-layer encryption</h2>
          <p className="section-subtitle">How Astra protects your most sensitive data at every point of the lifecycle.</p>

          <div className="pillars-grid">
            <div className="pillar-card">
              <div className="pillar-icon bg-violet">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h3>In-Transit Encryption (TLS 1.3)</h3>
              <p>All ingress and egress traffic is enforced with TLS 1.3 and Perfect Forward Secrecy. Weak ciphers and legacy SSL protocols are strictly rejected at edge gateways.</p>
              <ul className="pillar-checklist">
                <li><span>✓</span> Strict HTTP HSTS preload</li>
                <li><span>✓</span> Mutual TLS (mTLS) microservice mesh</li>
                <li><span>✓</span> Automated certificate rotation</li>
              </ul>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon bg-emerald">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <h3>At-Rest Encryption & BYOK</h3>
              <p>Data stored in disk, cache, and database backups is encrypted using AES-256-GCM. Enterprise customers can bring their own keys via AWS KMS or Azure Key Vault.</p>
              <ul className="pillar-checklist">
                <li><span>✓</span> Customer-Managed Keys (BYOK)</li>
                <li><span>✓</span> Automated envelope encryption</li>
                <li><span>✓</span> Instant cryptographic erasure</li>
              </ul>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon bg-cyan">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              </div>
              <h3>Continuous Automated Pen-Testing</h3>
              <p>Independent third-party security researchers and top whitehat firms conduct continuous penetration tests and fuzz testing on our platform 24/7/365.</p>
              <ul className="pillar-checklist">
                <li><span>✓</span> Bug Bounty program with HackerOne</li>
                <li><span>✓</span> Static & Dynamic SAST/DAST in CI</li>
                <li><span>✓</span> Automated dependency vulnerability scans</li>
              </ul>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="product-cta-banner">
          <div className="cta-banner-content">
            <h2>Ready to inspect our full compliance package?</h2>
            <p>Request our SOC 2 Type II audit report, ISO certifications, and DPA in one click.</p>
            <div className="banner-actions">
              <Link to="/talk-to-sales" className="product-primary-btn">
                Request Security Brief
              </Link>
              <Link to="/signup" className="product-secondary-btn">
                Launch Enterprise Trial
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
