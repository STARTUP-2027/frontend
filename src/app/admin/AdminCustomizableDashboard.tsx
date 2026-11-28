import { useState, useEffect, useMemo } from "react";
import { useCourses } from "../context/CourseContext";
import { useTheme } from "../theme";

export interface DashboardWidgetConfig {
  id: string;
  title: string;
  category: "finance" | "performance" | "curriculum" | "feedback" | "features";
  description: string;
  enabled: boolean;
  order: number;
}

const DEFAULT_WIDGETS: DashboardWidgetConfig[] = [
  {
    id: "subscriptions_mrr",
    title: "Subscriptions & Recurring Revenue (MRR/ARR)",
    category: "finance",
    description: "Monthly recurring revenue, new subscribers vs churn, and annual run rate trajectory.",
    enabled: true,
    order: 1,
  },
  {
    id: "profit_margins",
    title: "Financials, Gross Profit & Margins",
    category: "finance",
    description: "Revenue breakdown, infrastructure/GPU server costs, creator payouts, and net profit margin.",
    enabled: true,
    order: 2,
  },
  {
    id: "server_load",
    title: "Real-Time Platform & Server Load",
    category: "performance",
    description: "Live WebSocket connections, edge CPU/RAM utilization, P95 API response times, and cluster health.",
    enabled: true,
    order: 3,
  },
  {
    id: "curriculum_analysis",
    title: "Curriculum Completion & Drop-Off Funnel",
    category: "curriculum",
    description: "Learner progression funnel, module retention drop-offs, and assessment pass rates.",
    enabled: true,
    order: 4,
  },
  {
    id: "student_feedback",
    title: "Student Feedbacks & Sentiment Analysis (NPS)",
    category: "feedback",
    description: "Net Promoter Score (+72), 5-star distribution, and live student satisfaction sentiments.",
    enabled: true,
    order: 5,
  },
  {
    id: "coming_soon_features",
    title: "Upcoming Roadmap & Beta Features (Coming Soon)",
    category: "features",
    description: "Live preview of upcoming platform modules: AI Auto-Proctoring, Live Rooms & Offline Sync.",
    enabled: true,
    order: 6,
  },
];

export default function AdminCustomizableDashboard() {
  const { dark } = useTheme();
  const { courses } = useCourses();

  // Widget Configuration State (stored in localStorage)
  const [widgets, setWidgets] = useState<DashboardWidgetConfig[]>(() => {
    const saved = localStorage.getItem("astra_admin_dashboard_widgets");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_WIDGETS;
      }
    }
    return DEFAULT_WIDGETS;
  });

  const saveWidgets = (updated: DashboardWidgetConfig[]) => {
    setWidgets(updated);
    localStorage.setItem("astra_admin_dashboard_widgets", JSON.stringify(updated));
  };

  // Filter States
  const [timeRange, setTimeRange] = useState<"today" | "7d" | "30d" | "90d" | "1y" | "all">("30d");
  const [domainFilter, setDomainFilter] = useState<string>("all");
  const [tierFilter, setTierFilter] = useState<"all" | "free" | "pro" | "enterprise">("all");
  const [isLiveSimulating, setIsLiveSimulating] = useState(true);

  // Simulated real-time server load jitter
  const [serverLoad, setServerLoad] = useState({
    activeSockets: 3420,
    cpuPercent: 28,
    ramPercent: 44,
    p95LatencyMs: 38,
    reqPerSec: 1840,
  });

  useEffect(() => {
    if (!isLiveSimulating) return;
    const interval = setInterval(() => {
      setServerLoad({
        activeSockets: Math.floor(3380 + Math.random() * 90),
        cpuPercent: Math.floor(26 + Math.random() * 8),
        ramPercent: Math.floor(43 + Math.random() * 4),
        p95LatencyMs: Math.floor(34 + Math.random() * 10),
        reqPerSec: Math.floor(1800 + Math.random() * 120),
      });
    }, 3500);
    return () => clearInterval(interval);
  }, [isLiveSimulating]);

  // Drawer for Customize Dashboard
  const [showCustomizeDrawer, setShowCustomizeDrawer] = useState(false);
  const [customRoadmapItem, setCustomRoadmapItem] = useState("");
  const [roadmapItems, setRoadmapItems] = useState([
    { id: "rm-1", title: "AI Real-Time Code Auto-Proctoring & Anti-Cheat Engine", eta: "Q3 2026", status: "In Beta", votes: 342 },
    { id: "rm-2", title: "Live Collaborative Peer Hacking Rooms (WebRTC + Voice)", eta: "Q3 2026", status: "In Development", votes: 289 },
    { id: "rm-3", title: "Automated Micro-Credential Verification on Hedera/Solana", eta: "Q4 2026", status: "Planned", votes: 195 },
    { id: "rm-4", title: "Native Mobile Offline Video & Notes Sync Player", eta: "Q4 2026", status: "Planned", votes: 412 },
  ]);

  // Toggle Widget Visibility
  const toggleWidget = (id: string) => {
    const updated = widgets.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w));
    saveWidgets(updated);
  };

  const resetWidgets = () => {
    saveWidgets(DEFAULT_WIDGETS);
  };

  // Helper multipliers based on timeframe
  const timeMultiplier = useMemo(() => {
    switch (timeRange) {
      case "today": return 0.04;
      case "7d": return 0.25;
      case "30d": return 1.0;
      case "90d": return 2.9;
      case "1y": return 11.4;
      default: return 1.0;
    }
  }, [timeRange]);

  const activeWidgets = widgets.filter((w) => w.enabled).sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)] flex items-center gap-2">
            <span>Platform Analytics & Executive Dashboard</span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Live Real-Time
            </span>
          </h2>
          <p className="text-xs text-[var(--muted)] mt-1">
            Comprehensive business, infrastructure, and pedagogical metrics. Customize visible widgets to fit your priorities.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsLiveSimulating(!isLiveSimulating)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              isLiveSimulating
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                : "bg-[var(--surface)] text-[var(--muted)] border-[var(--border)]"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isLiveSimulating ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
            {isLiveSimulating ? "Live Feed On" : "Live Feed Paused"}
          </button>

          <button
            onClick={() => setShowCustomizeDrawer(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--accent)] text-white hover:opacity-90 shadow-sm transition-all flex items-center gap-1.5"
          >
            <span>⚙️</span> Customize Widgets ({activeWidgets.length}/{widgets.length})
          </button>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Time Range Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-[var(--muted)]">Time Period:</span>
            <div className="flex rounded-xl bg-[var(--surface-soft)] p-0.5 border border-[var(--border)] text-xs">
              {(
                [
                  { id: "today", label: "Today" },
                  { id: "7d", label: "7 Days" },
                  { id: "30d", label: "30 Days" },
                  { id: "90d", label: "90 Days" },
                  { id: "1y", label: "1 Year" },
                  { id: "all", label: "All Time" },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTimeRange(t.id)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    timeRange === t.id
                      ? "bg-[var(--accent)] text-white shadow-xs"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Domain Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium text-[var(--muted)]">Domain:</span>
              <select
                value={domainFilter}
                onChange={(e) => setDomainFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]"
              >
                <option value="all">All Disciplines</option>
                <option value="ai">AI & Machine Learning</option>
                <option value="fullstack">Full-Stack & Systems</option>
                <option value="devops">Cloud & DevOps</option>
                <option value="security">Cybersecurity & Networking</option>
              </select>
            </div>

            {/* Tier Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium text-[var(--muted)]">Cohort:</span>
              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value as any)}
                className="px-2.5 py-1.5 text-xs rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]"
              >
                <option value="all">All Cohorts</option>
                <option value="free">Free Learners</option>
                <option value="pro">Pro Subscriptions</option>
                <option value="enterprise">Enterprise Teams</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Top Level Metric Summary Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs">
          <div className="text-[11px] font-medium text-[var(--muted)] uppercase tracking-wider">Gross Revenue</div>
          <div className="text-2xl font-bold mt-1 text-[var(--foreground)]">
            ${Math.round(148920 * timeMultiplier).toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-500 font-semibold mt-0.5">↑ +24.8% vs previous period</div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs">
          <div className="text-[11px] font-medium text-[var(--muted)] uppercase tracking-wider">Net Profit (EBITDA)</div>
          <div className="text-2xl font-bold mt-1 text-emerald-500">
            ${Math.round(118400 * timeMultiplier).toLocaleString()}
          </div>
          <div className="text-[11px] text-[var(--muted)] mt-0.5">79.5% gross margin</div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs">
          <div className="text-[11px] font-medium text-[var(--muted)] uppercase tracking-wider">Active Paying Subs</div>
          <div className="text-2xl font-bold mt-1 text-[var(--foreground)]">
            {Math.round(4820 * (timeRange === "today" ? 0.98 : 1)).toLocaleString()}
          </div>
          <div className="text-[11px] text-blue-500 font-semibold mt-0.5">1.2% monthly churn</div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs">
          <div className="text-[11px] font-medium text-[var(--muted)] uppercase tracking-wider">Net Promoter Score</div>
          <div className="text-2xl font-bold mt-1 text-[var(--accent)]">+72</div>
          <div className="text-[11px] text-emerald-500 font-semibold mt-0.5">4.82/5.0 student rating</div>
        </div>
      </div>

      {/* Custom Dynamic Grid of Enabled Widgets */}
      <div className="space-y-6">
        {/* WIDGET 1: Subscriptions & MRR */}
        {widgets.find((w) => w.id === "subscriptions_mrr")?.enabled && (
          <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div>
                <h3 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
                  <span>📈 Subscriptions & Recurring Revenue (MRR Growth)</span>
                  <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    +$32.4k Net MRR
                  </span>
                </h3>
                <p className="text-xs text-[var(--muted)] mt-0.5">
                  Tracks new subscriptions, upgrades, and cohort renewal velocity across billing cycles.
                </p>
              </div>
              <button
                onClick={() => toggleWidget("subscriptions_mrr")}
                className="text-xs text-[var(--muted)] hover:text-rose-500 p-1"
                title="Hide this widget"
              >
                ✕ Hide
              </button>
            </div>

            {/* Bar & Area Chart Visualization */}
            <div className="pt-2">
              <div className="h-44 w-full flex items-end gap-3 px-2 pb-2 border-b border-[var(--border)]">
                {[
                  { month: "Oct", mrr: 88, newSubs: 240, churn: 12 },
                  { month: "Nov", mrr: 102, newSubs: 310, churn: 15 },
                  { month: "Dec", mrr: 115, newSubs: 380, churn: 18 },
                  { month: "Jan", mrr: 128, newSubs: 420, churn: 14 },
                  { month: "Feb", mrr: 139, newSubs: 490, churn: 19 },
                  { month: "Mar (Now)", mrr: 148, newSubs: 560, churn: 16 },
                ].map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <div className="text-[10px] font-mono font-bold text-[var(--muted)] opacity-0 group-hover:opacity-100 transition-opacity">
                      ${item.mrr}k
                    </div>
                    {/* Compound Bar */}
                    <div className="w-full max-w-[48px] flex flex-col justify-end rounded-t-lg overflow-hidden bg-[var(--surface-soft)]">
                      <div
                        className="w-full bg-[var(--accent)] transition-all group-hover:brightness-110"
                        style={{ height: `${(item.mrr / 160) * 110}px` }}
                      />
                    </div>
                    <span className="text-[11px] font-medium text-[var(--muted)]">{item.month}</span>
                  </div>
                ))}
              </div>

              {/* Chart Legend */}
              <div className="flex items-center justify-between text-xs pt-3 text-[var(--muted)]">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-[var(--accent)]" /> Pro & Enterprise ARR
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-emerald-500" /> New Activations (+18%)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-slate-400" /> Churn Target (&lt; 2%)
                  </span>
                </div>
                <span className="font-semibold text-[var(--foreground)]">Annual Run Rate: $1.78M USD</span>
              </div>
            </div>
          </div>
        )}

        {/* WIDGET 2: Financials & Profit Margins */}
        {widgets.find((w) => w.id === "profit_margins")?.enabled && (
          <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div>
                <h3 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
                  <span>💰 Financial Breakdown, Gross Profit & Margins</span>
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                    High Unit Economics
                  </span>
                </h3>
                <p className="text-xs text-[var(--muted)] mt-0.5">
                  Cost of goods sold (COGS), cloud compute, content production royalties, and EBITDA margins.
                </p>
              </div>
              <button
                onClick={() => toggleWidget("profit_margins")}
                className="text-xs text-[var(--muted)] hover:text-rose-500 p-1"
                title="Hide this widget"
              >
                ✕ Hide
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] space-y-1">
                <span className="text-[11px] text-[var(--muted)] font-medium">Gross Billings</span>
                <div className="text-xl font-bold text-[var(--foreground)]">
                  ${Math.round(184200 * timeMultiplier).toLocaleString()}
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="bg-emerald-500 h-full w-full" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] space-y-1">
                <span className="text-[11px] text-[var(--muted)] font-medium">Server & Edge Compute</span>
                <div className="text-xl font-bold text-rose-500">
                  -${Math.round(23100 * timeMultiplier).toLocaleString()}
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="bg-rose-500 h-full w-[16%]" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] space-y-1">
                <span className="text-[11px] text-[var(--muted)] font-medium">Author & Creator Royalties</span>
                <div className="text-xl font-bold text-amber-500">
                  -${Math.round(38500 * timeMultiplier).toLocaleString()}
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="bg-amber-500 h-full w-[24%]" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] space-y-1">
                <span className="text-[11px] text-[var(--muted)] font-medium">Net Profit (Take-Home)</span>
                <div className="text-xl font-bold text-[var(--accent)]">
                  +${Math.round(122600 * timeMultiplier).toLocaleString()}
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="bg-[var(--accent)] h-full w-[66.5%]" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* WIDGET 3: Real-Time Platform & Server Load */}
        {widgets.find((w) => w.id === "server_load")?.enabled && (
          <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div>
                <h3 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
                  <span>⚡ Real-Time Server Load & Cluster Health</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    All Regions Nominal
                  </span>
                </h3>
                <p className="text-xs text-[var(--muted)] mt-0.5">
                  Live telemetry across edge proxies, database read-replicas, and code sandbox nodes.
                </p>
              </div>
              <button
                onClick={() => toggleWidget("server_load")}
                className="text-xs text-[var(--muted)] hover:text-rose-500 p-1"
                title="Hide this widget"
              >
                ✕ Hide
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
                  Concurrent Sockets
                </span>
                <div className="text-2xl font-bold text-[var(--foreground)] mt-1 font-mono">
                  {serverLoad.activeSockets.toLocaleString()}
                </div>
                <span className="text-[11px] text-emerald-500">0 dropped packets</span>
              </div>

              <div className="p-4 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
                  Edge Node CPU
                </span>
                <div className="text-2xl font-bold text-[var(--foreground)] mt-1 font-mono">
                  {serverLoad.cpuPercent}%
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-1.5">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-500"
                    style={{ width: `${serverLoad.cpuPercent}%` }}
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
                  RAM Utilization
                </span>
                <div className="text-2xl font-bold text-[var(--foreground)] mt-1 font-mono">
                  {serverLoad.ramPercent}%
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-1.5">
                  <div
                    className="bg-blue-500 h-full transition-all duration-500"
                    style={{ width: `${serverLoad.ramPercent}%` }}
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
                  P95 Global Latency
                </span>
                <div className="text-2xl font-bold text-[var(--foreground)] mt-1 font-mono">
                  {serverLoad.p95LatencyMs} ms
                </div>
                <span className="text-[11px] text-emerald-500">&lt; 50ms SLA Target</span>
              </div>
            </div>
          </div>
        )}

        {/* WIDGET 4: Curriculum Completion Funnel */}
        {widgets.find((w) => w.id === "curriculum_analysis")?.enabled && (
          <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div>
                <h3 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
                  <span>📊 Curriculum Funnel & Completion Drop-Off Analysis</span>
                  <span className="text-[10px] font-bold text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                    86.4% Completion Rate
                  </span>
                </h3>
                <p className="text-xs text-[var(--muted)] mt-0.5">
                  Diagnose exactly which modules students excel in or where drop-offs occur so you can refine content.
                </p>
              </div>
              <button
                onClick={() => toggleWidget("curriculum_analysis")}
                className="text-xs text-[var(--muted)] hover:text-rose-500 p-1"
                title="Hide this widget"
              >
                ✕ Hide
              </button>
            </div>

            <div className="space-y-3">
              {[
                { stage: "Course Enrollment & Orientation", count: "15,420 students", rate: 100, drop: "0%" },
                { stage: "Module 1: Foundations & Setup Lab", count: "14,810 students", rate: 96, drop: "-4%" },
                { stage: "Module 2: Core Deep Dive & Coding Labs", count: "13,950 students", rate: 90.5, drop: "-5.5%" },
                { stage: "Mid-Curriculum Assessment & Quiz", count: "13,240 students", rate: 85.8, drop: "-4.7%" },
                { stage: "Final Capstone & Hands-on Project", count: "12,610 students", rate: 81.7, drop: "-4.1%" },
                { stage: "Verified Certificate Issuance", count: "11,880 students", rate: 77.0, drop: "-4.7%" },
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)]">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-[var(--foreground)]">{item.stage}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[var(--muted)]">{item.count}</span>
                      <span className="font-bold text-[var(--accent)]">{item.rate}%</span>
                      <span className="text-[10px] text-rose-500 font-mono">({item.drop})</span>
                    </div>
                  </div>
                  <div className="w-full bg-[var(--surface)] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[var(--accent)] h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WIDGET 5: Student Feedback & Sentiment Analysis */}
        {widgets.find((w) => w.id === "student_feedback")?.enabled && (
          <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div>
                <h3 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
                  <span>⭐ Student Feedbacks & Net Sentiment Rating</span>
                  <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    4.82 / 5.0 (2,410 Reviews)
                  </span>
                </h3>
                <p className="text-xs text-[var(--muted)] mt-0.5">
                  Real-time sentiment telemetry collected post-lesson and after certificate completions.
                </p>
              </div>
              <button
                onClick={() => toggleWidget("student_feedback")}
                className="text-xs text-[var(--muted)] hover:text-rose-500 p-1"
                title="Hide this widget"
              >
                ✕ Hide
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                {
                  author: "Devon Chen",
                  rating: 5,
                  course: "Microservices with Go & gRPC",
                  sentiment: "Praise",
                  comment: "The visual architecture diagrams paired with the code examples made gRPC streaming click instantly.",
                  time: "45 mins ago",
                },
                {
                  author: "Elena Rostova",
                  rating: 5,
                  course: "Python 3.12 Core & Data Structures",
                  sentiment: "Praise",
                  comment: "Interactive reading format with flowchart diagrams in between the lessons is 10x better than standard video lectures.",
                  time: "2 hours ago",
                },
                {
                  author: "Alex Rivera",
                  rating: 4,
                  course: "Autonomous AI Agents Mastery",
                  sentiment: "Suggestion",
                  comment: "Loved the multi-agent graph architecture lessons. Would appreciate an extra sandbox lesson on Redis vector indexes.",
                  time: "Yesterday",
                },
              ].map((rev, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[var(--foreground)]">{rev.author}</span>
                    <span className="text-amber-500 font-bold">{"★".repeat(rev.rating)}</span>
                  </div>
                  <p className="text-xs text-[var(--muted)] italic">"{rev.comment}"</p>
                  <div className="flex items-center justify-between text-[10px] text-[var(--muted)] pt-1 border-t border-[var(--border-soft)]">
                    <span className="truncate max-w-[150px]">{rev.course}</span>
                    <span>{rev.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WIDGET 6: "Coming Soon" Feature Drops Widget (Requested specifically) */}
        {widgets.find((w) => w.id === "coming_soon_features")?.enabled && (
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/20 via-[var(--surface)] to-[var(--surface)] border border-indigo-500/30 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div>
                <h3 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
                  <span>🚀 Upcoming Capabilities & Roadmap</span>
                  <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/30">
                    Coming Soon
                  </span>
                </h3>
                <p className="text-xs text-[var(--muted)] mt-0.5">
                  Preview next-generation platform modules currently in engineering and private beta.
                </p>
              </div>
              <button
                onClick={() => toggleWidget("coming_soon_features")}
                className="text-xs text-[var(--muted)] hover:text-rose-500 p-1"
                title="Hide this widget"
              >
                ✕ Hide
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {roadmapItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] flex flex-col justify-between gap-3 group hover:border-indigo-500/40 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-[var(--foreground)]">{item.title}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-[var(--muted)]">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20">
                        {item.status}
                      </span>
                      <span>Target: {item.eta}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-[var(--border-soft)]">
                    <span className="text-[11px] text-[var(--muted)]">👍 {item.votes} Upvotes</span>
                    <button
                      onClick={() => {
                        setRoadmapItems((prev) =>
                          prev.map((r) => (r.id === item.id ? { ...r, votes: r.votes + 1 } : r))
                        );
                      }}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[var(--surface)] border border-[var(--border)] hover:border-indigo-500 text-[var(--foreground)] transition-all"
                    >
                      +1 Upvote
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Custom Roadmap Item inline */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={customRoadmapItem}
                onChange={(e) => setCustomRoadmapItem(e.target.value)}
                placeholder="Suggest upcoming admin feature or module..."
                className="flex-1 text-xs p-2.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={() => {
                  if (!customRoadmapItem.trim()) return;
                  setRoadmapItems((prev) => [
                    ...prev,
                    {
                      id: `rm-${Date.now()}`,
                      title: customRoadmapItem.trim(),
                      eta: "Evaluating",
                      status: "Planned",
                      votes: 1,
                    },
                  ]);
                  setCustomRoadmapItem("");
                }}
                className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shrink-0"
              >
                + Add Feature
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Customize Dashboard Drawer Modal */}
      {showCustomizeDrawer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in">
          <div className="w-full max-w-md bg-[var(--surface)] h-full overflow-y-auto border-l border-[var(--border)] shadow-2xl p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
                <div>
                  <h3 className="text-base font-bold text-[var(--foreground)]">Customize Dashboard</h3>
                  <p className="text-xs text-[var(--muted)]">Toggle visibility of platform graphs & widgets.</p>
                </div>
                <button
                  onClick={() => setShowCustomizeDrawer(false)}
                  className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-soft)] transition-colors"
                >
                  ✕ Close
                </button>
              </div>

              {/* Widget List */}
              <div className="space-y-3">
                {widgets.map((widget) => (
                  <div
                    key={widget.id}
                    className="p-3.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] flex items-start justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[var(--foreground)]">{widget.title}</span>
                      </div>
                      <p className="text-[11px] text-[var(--muted)] mt-1">{widget.description}</p>
                    </div>

                    <button
                      onClick={() => toggleWidget(widget.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                        widget.enabled
                          ? "bg-[var(--accent)] text-white"
                          : "bg-[var(--surface)] text-[var(--muted)] border border-[var(--border)]"
                      }`}
                    >
                      {widget.enabled ? "Visible" : "Hidden"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between">
              <button
                onClick={resetWidgets}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors"
              >
                Reset to Default
              </button>
              <button
                onClick={() => setShowCustomizeDrawer(false)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[var(--accent)] text-white hover:opacity-90"
              >
                Save & Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
