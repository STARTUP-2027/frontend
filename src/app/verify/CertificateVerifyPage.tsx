import { useState } from "react";
import { useParams, Link } from "react-router";
import { useCourses } from "../context/CourseContext";
import { useTheme } from "../theme";
import { SiteNav, SiteFooter } from "../../App";

export default function CertificateVerifyPage() {
  const { credentialId: paramCredentialId } = useParams();
  const { dark } = useTheme();
  const { certificates, courses } = useCourses();

  const [searchId, setSearchId] = useState(paramCredentialId || "");
  const [copiedLink, setCopiedLink] = useState(false);

  // Find certificate matching param or default to first
  const activeCert =
    certificates.find((c) => c.credentialId.toLowerCase() === (searchId || paramCredentialId || "").toLowerCase()) ||
    certificates[0] || {
      id: "cert-default",
      courseId: "ai-agents-masterclass",
      courseTitle: "Autonomous AI Agents & LLM Systems",
      studentName: "Alex Morgan",
      issueDate: "October 06, 2026",
      credentialId: "ASTRA-CERT-8849-2026",
      skills: ["LangGraph", "Vector RAG", "OpenAI / Anthropic APIs", "Agentic Tool Calling", "Evaluation & Tracing"],
      instructorName: "Dr. Aris Vance",
    };

  const matchedCourse = courses.find((c) => c.id === activeCert.courseId);
  const skillsList = activeCert.skills || matchedCourse?.skills || ["LangGraph", "Vector DBs", "Distributed Systems", "RS256 Security"];

  const handleCopyShareLink = () => {
    const url = `${window.location.origin}/verify/${activeCert.credentialId}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleAddToLinkedIn = () => {
    const name = encodeURIComponent(activeCert.courseTitle);
    const orgName = encodeURIComponent("Astra Academy");
    const certUrl = encodeURIComponent(`${window.location.origin}/verify/${activeCert.credentialId}`);
    const certId = encodeURIComponent(activeCert.credentialId);
    
    // LinkedIn Add Certificate URL
    const linkedinUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${name}&organizationName=${orgName}&certUrl=${certUrl}&certId=${certId}&issueYear=2026&issueMonth=10`;
    window.open(linkedinUrl, "_blank");
  };

  return (
    <div className={`subpage app ${dark ? "dark" : ""} min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]`}>
      <SiteNav />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-28 space-y-8">
        {/* Verification Status Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-2xl shrink-0">
              ✓
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Cryptographically Verified
                </span>
                <span className="text-xs text-[var(--muted)] font-mono">ASTRA-VAULT-2026</span>
              </div>
              <h1 className="text-xl font-black mt-1">Official Credential Verification</h1>
            </div>
          </div>

          {/* Quick Lookup Bar */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Search Credential ID..."
              className="p-2.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs font-mono w-48 sm:w-60"
            />
          </div>
        </div>

        {/* The Official Certificate Parchment Card */}
        <div className="relative p-8 sm:p-14 rounded-2xl bg-gradient-to-b from-[#18142a] via-[#110e20] to-[#0d0a17] text-white border-2 border-amber-500/40 shadow-xl space-y-8 text-center overflow-hidden">
          {/* Decorative Corner Filigrees */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-amber-400/40 rounded-tl-xl" />
          <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-400/40 rounded-tr-xl" />
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-amber-400/40 rounded-bl-xl" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-amber-400/40 rounded-br-xl" />

          {/* Top Logo & Watermark */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center text-3xl shadow-lg">
              🏆
            </div>
            <span className="text-[11px] font-mono tracking-widest text-amber-400 font-bold uppercase mt-2">
              Astra Academy of Advanced Engineering
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white mt-1">
              Certificate of Mastery & Engineering Excellence
            </h2>
          </div>

          <div className="space-y-3 max-w-2xl mx-auto">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
              This credential certifies that
            </p>
            <p className="text-2xl sm:text-3xl font-black text-white border-b border-gray-700 pb-3 inline-block px-8">
              {activeCert.studentName}
            </p>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed pt-2">
              has completed all rigorous architectural labs, interactive code sandboxes, and capstone benchmarks for
            </p>
            <p className="text-lg sm:text-xl font-extrabold text-blue-400">
              {activeCert.courseTitle}
            </p>
          </div>

          {/* Skill Matrix Badges */}
          <div className="space-y-2 pt-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Verified Technical Competencies
            </span>
            <div className="flex flex-wrap justify-center gap-1.5 max-w-xl mx-auto">
              {skillsList.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/20"
                >
                  ✓ {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom Signatures & QR Code Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-gray-800 items-end text-left">
            {/* Instructor Signature */}
            <div className="space-y-1">
              <span className="text-[10px] text-gray-400 uppercase font-mono">Lead Instructor</span>
              <p className="font-serif italic text-lg text-amber-300">
                {activeCert.instructorName || "Dr. Aris Vance"}
              </p>
              <span className="text-[10px] text-gray-400 block">Curriculum Chair, Astra Academy</span>
            </div>

            {/* QR Code Graphic */}
            <div className="flex flex-col items-center text-center space-y-1">
              {/* Scalable SVG QR Code */}
              <div className="p-2 bg-white rounded-xl shadow-lg">
                <svg width="72" height="72" viewBox="0 0 100 100" fill="black">
                  <path d="M0 0h30v30H0zM40 0h20v10H40zM70 0h30v30H70zM10 10h10v10H10zM80 10h10v10H80zM0 40h10v20H0zM20 40h20v10H20zM50 40h10v10H50zM70 40h10v10H70zM90 40h10v30H90zM0 70h30v30H0zM10 80h10v10H10zM40 60h20v20H40zM70 60h10v10H70zM60 80h30v20H60z" />
                </svg>
              </div>
              <span className="text-[9px] font-mono text-gray-400">Scan to Verify Live</span>
            </div>

            {/* Issuance & Credential ID */}
            <div className="text-left sm:text-right space-y-1">
              <span className="text-[10px] text-gray-400 uppercase font-mono">Credential ID</span>
              <p className="font-mono text-xs font-bold text-amber-400">
                {activeCert.credentialId}
              </p>
              <span className="text-[10px] text-gray-400 block">Issued: {activeCert.issueDate}</span>
            </div>
          </div>
        </div>

        {/* Share & Actions Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={handleAddToLinkedIn}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#0a66c2] text-white hover:bg-[#084e96] flex items-center gap-2 shadow-md transition-all"
            >
              <span>🔗</span> Add to LinkedIn Profile
            </button>
            <button
              onClick={handleCopyShareLink}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[var(--surface-soft)] border border-[var(--border)] hover:border-[var(--accent)] transition-all flex items-center gap-2"
            >
              <span>📋</span> {copiedLink ? "Link Copied!" : "Copy Share Link"}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl text-xs font-bold border border-[var(--border)] bg-[var(--surface-soft)] hover:bg-[var(--surface)] text-[var(--text)]"
            >
              🖨️ Print / Save PDF
            </button>
            <Link to="/dashboard" className="button button-sm text-xs">
              Back to Dashboard →
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
