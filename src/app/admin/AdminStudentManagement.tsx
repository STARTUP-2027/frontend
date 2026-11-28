import { useState, useMemo } from "react";
import { useCourses } from "../context/CourseContext";
import { useTheme } from "../theme";

export interface StudentRecord {
  id: string;
  name: string;
  email: string;
  avatar: string;
  tier: "free" | "pro" | "enterprise";
  status: "active" | "suspended" | "trial";
  country: string;
  countryCode: string;
  joinedDate: string;
  lastActive: string;
  xp: number;
  streakDays: number;
  enrolledCourseIds: string[];
  courseProgress: Record<string, number>; // courseId -> percentage (0-100)
  certificatesCount: number;
  notes?: string;
}

const INITIAL_STUDENTS: StudentRecord[] = [
  {
    id: "stu-101",
    name: "Alex Rivera",
    email: "alex.rivera@stanford.edu",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    tier: "enterprise",
    status: "active",
    country: "United States",
    countryCode: "US",
    joinedDate: "2026-01-14",
    lastActive: "12 mins ago",
    xp: 14250,
    streakDays: 42,
    enrolledCourseIds: ["course-1", "course-2", "course-3"],
    courseProgress: { "course-1": 100, "course-2": 85, "course-3": 40 },
    certificatesCount: 3,
    notes: "Top performer in Stanford Systems Lab cohort. Active in distributed systems discussions.",
  },
  {
    id: "stu-102",
    name: "Devon Chen",
    email: "devon.chen@tokyotech.ac.jp",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    tier: "pro",
    status: "active",
    country: "Japan",
    countryCode: "JP",
    joinedDate: "2026-02-03",
    lastActive: "1 hour ago",
    xp: 9800,
    streakDays: 28,
    enrolledCourseIds: ["course-1", "course-4"],
    courseProgress: { "course-1": 92, "course-4": 60 },
    certificatesCount: 2,
    notes: "Consistently completes weekly DSA problem sets within 30 minutes.",
  },
  {
    id: "stu-103",
    name: "Sophia Martinez",
    email: "sophia.m@mit.edu",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    tier: "enterprise",
    status: "active",
    country: "United States",
    countryCode: "US",
    joinedDate: "2025-11-20",
    lastActive: "Just now",
    xp: 22400,
    streakDays: 85,
    enrolledCourseIds: ["course-1", "course-2", "course-5", "course-6"],
    courseProgress: { "course-1": 100, "course-2": 100, "course-5": 78, "course-6": 55 },
    certificatesCount: 4,
    notes: "Published capstone project featured on platform showcase.",
  },
  {
    id: "stu-104",
    name: "Liam O'Connor",
    email: "liam.oconnor@tcd.ie",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    tier: "pro",
    status: "active",
    country: "Ireland",
    countryCode: "IE",
    joinedDate: "2026-02-18",
    lastActive: "3 hours ago",
    xp: 6150,
    streakDays: 14,
    enrolledCourseIds: ["course-2"],
    courseProgress: { "course-2": 65 },
    certificatesCount: 1,
  },
  {
    id: "stu-105",
    name: "Ananya Sharma",
    email: "ananya.sharma@iitd.ac.in",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    tier: "pro",
    status: "active",
    country: "India",
    countryCode: "IN",
    joinedDate: "2025-12-05",
    lastActive: "25 mins ago",
    xp: 18900,
    streakDays: 61,
    enrolledCourseIds: ["course-1", "course-3", "course-4"],
    courseProgress: { "course-1": 100, "course-3": 90, "course-4": 82 },
    certificatesCount: 3,
  },
  {
    id: "stu-106",
    name: "Marcus Vance",
    email: "m.vance@cam.ac.uk",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    tier: "free",
    status: "trial",
    country: "United Kingdom",
    countryCode: "GB",
    joinedDate: "2026-03-01",
    lastActive: "2 days ago",
    xp: 2100,
    streakDays: 5,
    enrolledCourseIds: ["course-1"],
    courseProgress: { "course-1": 25 },
    certificatesCount: 0,
    notes: "Evaluating team adoption for Cambridge CS faculty.",
  },
  {
    id: "stu-107",
    name: "Elena Rostova",
    email: "elena.r@ethz.ch",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    tier: "pro",
    status: "active",
    country: "Switzerland",
    countryCode: "CH",
    joinedDate: "2026-01-22",
    lastActive: "40 mins ago",
    xp: 11200,
    streakDays: 34,
    enrolledCourseIds: ["course-2", "course-5"],
    courseProgress: { "course-2": 80, "course-5": 50 },
    certificatesCount: 2,
  },
  {
    id: "stu-108",
    name: "Kofi Mensah",
    email: "kofi.mensah@ug.edu.gh",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    tier: "free",
    status: "active",
    country: "Ghana",
    countryCode: "GH",
    joinedDate: "2026-02-10",
    lastActive: "5 hours ago",
    xp: 4400,
    streakDays: 12,
    enrolledCourseIds: ["course-1"],
    courseProgress: { "course-1": 48 },
    certificatesCount: 0,
  },
  {
    id: "stu-109",
    name: "Zainab Al-Mansoor",
    email: "zainab.m@kaust.edu.sa",
    avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80",
    tier: "enterprise",
    status: "active",
    country: "Saudi Arabia",
    countryCode: "SA",
    joinedDate: "2025-10-15",
    lastActive: "2 hours ago",
    xp: 26500,
    streakDays: 110,
    enrolledCourseIds: ["course-1", "course-2", "course-3", "course-5"],
    courseProgress: { "course-1": 100, "course-2": 100, "course-3": 95, "course-5": 88 },
    certificatesCount: 5,
  },
  {
    id: "stu-110",
    name: "Brandon Lee",
    email: "brandon.lee@uwaterloo.ca",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    tier: "free",
    status: "suspended",
    country: "Canada",
    countryCode: "CA",
    joinedDate: "2026-01-05",
    lastActive: "8 days ago",
    xp: 1200,
    streakDays: 0,
    enrolledCourseIds: ["course-1"],
    courseProgress: { "course-1": 15 },
    certificatesCount: 0,
    notes: "Suspended due to automated submission rate-limit violations during contest.",
  },
];

export default function AdminStudentManagement() {
  const { dark } = useTheme();
  const { courses } = useCourses();

  // Student State
  const [students, setStudents] = useState<StudentRecord[]>(() => {
    const saved = localStorage.getItem("astra_admin_students");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_STUDENTS;
      }
    }
    return INITIAL_STUDENTS;
  });

  const saveStudents = (updated: StudentRecord[]) => {
    setStudents(updated);
    localStorage.setItem("astra_admin_students", JSON.stringify(updated));
  };

  // Filter & Search Controls
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState<"all" | "free" | "pro" | "enterprise">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended" | "trial">("all");
  const [courseFilter, setCourseFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"recent" | "xp" | "streak" | "name">("recent");

  // Selected Student Drawer
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);

  // New Student Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentEmail, setNewStudentEmail] = useState("");
  const [newStudentTier, setNewStudentTier] = useState<"free" | "pro" | "enterprise">("pro");
  const [newStudentCountry, setNewStudentCountry] = useState("United States");
  const [newStudentCourseId, setNewStudentCourseId] = useState("");

  // Notification Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // KPI Calculations
  const totalStudents = students.length;
  const activeToday = students.filter(s => s.status === "active" && !s.lastActive.includes("days")).length;
  const proSubscribers = students.filter(s => s.tier === "pro" || s.tier === "enterprise").length;
  const totalCerts = students.reduce((acc, s) => acc + s.certificatesCount, 0);

  // Filtered & Sorted Student List
  const filteredStudents = useMemo(() => {
    return students
      .filter((s) => {
        const matchesSearch =
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.email.toLowerCase().includes(search.toLowerCase()) ||
          s.country.toLowerCase().includes(search.toLowerCase());

        const matchesTier = tierFilter === "all" || s.tier === tierFilter;
        const matchesStatus = statusFilter === "all" || s.status === statusFilter;
        const matchesCourse = courseFilter === "all" || s.enrolledCourseIds.includes(courseFilter);

        return matchesSearch && matchesTier && matchesStatus && matchesCourse;
      })
      .sort((a, b) => {
        if (sortBy === "xp") return b.xp - a.xp;
        if (sortBy === "streak") return b.streakDays - a.streakDays;
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime();
      });
  }, [students, search, tierFilter, statusFilter, courseFilter, sortBy]);

  // Actions
  const handleUpdateStudentTier = (id: string, newTier: "free" | "pro" | "enterprise") => {
    const updated = students.map((s) => (s.id === id ? { ...s, tier: newTier } : s));
    saveStudents(updated);
    if (selectedStudent && selectedStudent.id === id) {
      setSelectedStudent({ ...selectedStudent, tier: newTier });
    }
    showToast(`Updated student subscription tier to ${newTier.toUpperCase()}`);
  };

  const handleToggleStudentStatus = (id: string) => {
    const target = students.find((s) => s.id === id);
    if (!target) return;
    const newStatus = target.status === "suspended" ? "active" : "suspended";
    const updated = students.map((s) => (s.id === id ? { ...s, status: newStatus as any } : s));
    saveStudents(updated);
    if (selectedStudent && selectedStudent.id === id) {
      setSelectedStudent({ ...selectedStudent, status: newStatus as any });
    }
    showToast(`Student status set to ${newStatus.toUpperCase()}`);
  };

  const handleEnrollCourse = (studentId: string, courseId: string) => {
    if (!courseId) return;
    const updated = students.map((s) => {
      if (s.id === studentId) {
        if (s.enrolledCourseIds.includes(courseId)) return s;
        return {
          ...s,
          enrolledCourseIds: [...s.enrolledCourseIds, courseId],
          courseProgress: { ...s.courseProgress, [courseId]: 0 },
        };
      }
      return s;
    });
    saveStudents(updated);
    if (selectedStudent && selectedStudent.id === studentId) {
      const match = updated.find((s) => s.id === studentId);
      if (match) setSelectedStudent(match);
    }
    showToast("Enrolled student into course successfully!");
  };

  const handleUnenrollCourse = (studentId: string, courseId: string) => {
    const updated = students.map((s) => {
      if (s.id === studentId) {
        const remaining = s.enrolledCourseIds.filter((cid) => cid !== courseId);
        const newProgress = { ...s.courseProgress };
        delete newProgress[courseId];
        return {
          ...s,
          enrolledCourseIds: remaining,
          courseProgress: newProgress,
        };
      }
      return s;
    });
    saveStudents(updated);
    if (selectedStudent && selectedStudent.id === studentId) {
      const match = updated.find((s) => s.id === studentId);
      if (match) setSelectedStudent(match);
    }
    showToast("Unenrolled student from course");
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentEmail.trim()) {
      alert("Please provide name and email");
      return;
    }

    const newStudent: StudentRecord = {
      id: `stu-${Date.now().toString().slice(-4)}`,
      name: newStudentName.trim(),
      email: newStudentEmail.trim(),
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=150&auto=format&fit=crop&q=80`,
      tier: newStudentTier,
      status: "active",
      country: newStudentCountry,
      countryCode: newStudentCountry.slice(0, 2).toUpperCase(),
      joinedDate: new Date().toISOString().split("T")[0],
      lastActive: "Just now",
      xp: 250,
      streakDays: 1,
      enrolledCourseIds: newStudentCourseId ? [newStudentCourseId] : [],
      courseProgress: newStudentCourseId ? { [newStudentCourseId]: 0 } : {},
      certificatesCount: 0,
      notes: "Newly onboarded student via Admin Console.",
    };

    const updated = [newStudent, ...students];
    saveStudents(updated);
    setShowAddModal(false);
    setNewStudentName("");
    setNewStudentEmail("");
    showToast(`Added ${newStudent.name} to platform roster!`);
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Name", "Email", "Tier", "Status", "Country", "Joined Date", "XP", "Streak", "Certs"];
    const rows = filteredStudents.map((s) => [
      s.id,
      `"${s.name}"`,
      `"${s.email}"`,
      s.tier,
      s.status,
      `"${s.country}"`,
      s.joinedDate,
      s.xp,
      s.streakDays,
      s.certificatesCount,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `astra-students-export-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Exported students roster as CSV");
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-slate-900 text-white shadow-xl text-xs font-semibold flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <span className="text-emerald-400">✓</span>
          {toastMsg}
        </div>
      )}

      {/* Header and Quick Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)] flex items-center gap-2">
            <span>Student & Member Directory</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--surface-soft)] text-[var(--muted)] font-mono border border-[var(--border)]">
              {students.length} Total Registered
            </span>
          </h2>
          <p className="text-xs text-[var(--muted)] mt-1">
            Monitor real-time student activity, change subscription tiers, assign courses, and handle access moderation.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--surface-soft)] text-[var(--foreground)] transition-colors flex items-center gap-1.5"
            title="Download CSV report"
          >
            <span>📥</span> Export CSV
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--accent)] text-white hover:opacity-90 shadow-sm transition-all flex items-center gap-1.5"
          >
            <span>+</span> Invite Student
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs">
          <div className="text-[11px] font-medium text-[var(--muted)] uppercase tracking-wider">Active Today</div>
          <div className="text-2xl font-bold mt-1 text-[var(--foreground)]">{activeToday.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-500 font-semibold mt-0.5">● Real-time sessions</div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs">
          <div className="text-[11px] font-medium text-[var(--muted)] uppercase tracking-wider">Pro & Enterprise</div>
          <div className="text-2xl font-bold mt-1 text-[var(--foreground)]">{proSubscribers.toLocaleString()}</div>
          <div className="text-[11px] text-[var(--accent)] font-semibold mt-0.5">
            {Math.round((proSubscribers / (totalStudents || 1)) * 100)}% conversion
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs">
          <div className="text-[11px] font-medium text-[var(--muted)] uppercase tracking-wider">Certificates Issued</div>
          <div className="text-2xl font-bold mt-1 text-[var(--foreground)]">{totalCerts.toLocaleString()}</div>
          <div className="text-[11px] text-blue-500 font-semibold mt-0.5">Verified credentials</div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs">
          <div className="text-[11px] font-medium text-[var(--muted)] uppercase tracking-wider">Platform Health</div>
          <div className="text-2xl font-bold mt-1 text-emerald-500">99.8%</div>
          <div className="text-[11px] text-[var(--muted)] mt-0.5">0 flagged violations</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name, email, or country..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
            />
            <span className="absolute left-3 top-2.5 text-xs text-[var(--muted)]">🔍</span>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-2.5 text-xs text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                ✕
              </button>
            )}
          </div>

          {/* Tier Filter */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-medium text-[var(--muted)]">Plan:</span>
            <div className="flex rounded-xl bg-[var(--surface-soft)] p-0.5 border border-[var(--border)] text-xs">
              {(["all", "free", "pro", "enterprise"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTierFilter(t)}
                  className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-all ${
                    tierFilter === t
                      ? "bg-[var(--accent)] text-white shadow-xs"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-medium text-[var(--muted)]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-2.5 py-1.5 text-xs rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="trial">Trial</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          {/* Course Filter */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-medium text-[var(--muted)]">Course:</span>
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-[var(--foreground)] max-w-44 truncate focus:outline-none focus:border-[var(--accent)]"
            >
              <option value="all">All Enrolled Courses</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-medium text-[var(--muted)]">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 text-xs rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]"
            >
              <option value="recent">Recently Joined</option>
              <option value="xp">Highest XP</option>
              <option value="streak">Longest Streak</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--surface-soft)] text-[var(--muted)] uppercase font-semibold text-[10px] tracking-wider border-b border-[var(--border)]">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-3">Subscription</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">XP & Streak</th>
                <th className="py-3 px-3">Enrolled Courses</th>
                <th className="py-3 px-3">Last Active</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-soft)]">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[var(--muted)]">
                    <p className="text-sm font-medium">No students match your filter criteria.</p>
                    <p className="text-xs mt-1">Try clearing filters or search queries.</p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((stu) => {
                  return (
                    <tr
                      key={stu.id}
                      className="hover:bg-[var(--surface-soft)]/50 transition-colors group cursor-pointer"
                      onClick={() => setSelectedStudent(stu)}
                    >
                      {/* Name & Avatar */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={stu.avatar}
                            alt={stu.name}
                            className="w-9 h-9 rounded-full object-cover border border-[var(--border)] shrink-0"
                            onError={(e) => {
                              // fallback
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-[var(--foreground)] truncate flex items-center gap-1.5">
                              <span>{stu.name}</span>
                              <span className="text-[10px] text-[var(--muted)] font-normal">({stu.countryCode})</span>
                            </div>
                            <div className="text-[11px] text-[var(--muted)] truncate">{stu.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Tier Badge */}
                      <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={stu.tier}
                          onChange={(e) => handleUpdateStudentTier(stu.id, e.target.value as any)}
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border focus:outline-none transition-all cursor-pointer ${
                            stu.tier === "enterprise"
                              ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30"
                              : stu.tier === "pro"
                              ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30"
                              : "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30"
                          }`}
                        >
                          <option value="free">Free Tier</option>
                          <option value="pro">Pro Plan</option>
                          <option value="enterprise">Enterprise</option>
                        </select>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleToggleStudentStatus(stu.id)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 border transition-all ${
                            stu.status === "active"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                              : stu.status === "trial"
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                              : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 hover:bg-rose-500/20"
                          }`}
                          title="Click to toggle suspension"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          <span className="capitalize">{stu.status}</span>
                        </button>
                      </td>

                      {/* XP & Streak */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[var(--foreground)]">{stu.xp.toLocaleString()} XP</span>
                          {stu.streakDays > 0 && (
                            <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded-md border border-amber-500/20">
                              🔥 {stu.streakDays}d
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Enrolled Courses */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold">{stu.enrolledCourseIds.length} enrolled</span>
                          {stu.certificatesCount > 0 && (
                            <span className="text-[10px] text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded-md font-bold">
                              🎓 {stu.certificatesCount} certs
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Last Active */}
                      <td className="py-3 px-3 text-[var(--muted)] text-[11px]">{stu.lastActive}</td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedStudent(stu)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[var(--surface-soft)] border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
                        >
                          Manage →
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Details Drawer / Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in">
          <div className="w-full max-w-lg bg-[var(--surface)] h-full overflow-y-auto border-l border-[var(--border)] shadow-2xl p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Drawer Top Navigation */}
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-[var(--surface-soft)] text-[var(--muted)]">
                    {selectedStudent.id}
                  </span>
                  <span className="text-xs text-[var(--muted)]">Joined {selectedStudent.joinedDate}</span>
                </div>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-soft)] transition-colors"
                >
                  ✕ Close
                </button>
              </div>

              {/* Student Header */}
              <div className="flex items-start gap-4">
                <img
                  src={selectedStudent.avatar}
                  alt={selectedStudent.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[var(--border)] shadow-sm shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold text-[var(--foreground)] truncate">{selectedStudent.name}</h3>
                  <p className="text-xs text-[var(--muted)] truncate">{selectedStudent.email}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs">
                    <span className="px-2 py-0.5 rounded-md bg-[var(--surface-soft)] border border-[var(--border)] text-[var(--muted)]">
                      📍 {selectedStudent.country}
                    </span>
                    <span className="text-xs font-semibold text-amber-500">🔥 {selectedStudent.streakDays} Day Streak</span>
                  </div>
                </div>
              </div>

              {/* Quick Modifier Controls */}
              <div className="p-4 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] space-y-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                  Account Controls
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-[var(--muted)] block mb-1">Subscription Plan</label>
                    <select
                      value={selectedStudent.tier}
                      onChange={(e) => handleUpdateStudentTier(selectedStudent.id, e.target.value as any)}
                      className="w-full text-xs font-bold p-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)]"
                    >
                      <option value="free">Free Tier</option>
                      <option value="pro">Pro Plan</option>
                      <option value="enterprise">Enterprise VIP</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-[var(--muted)] block mb-1">Account Moderation</label>
                    <button
                      onClick={() => handleToggleStudentStatus(selectedStudent.id)}
                      className={`w-full text-xs font-bold p-2 rounded-lg border transition-all text-center ${
                        selectedStudent.status === "active"
                          ? "bg-rose-500/10 text-rose-600 border-rose-500/30 hover:bg-rose-500/20"
                          : "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/20"
                      }`}
                    >
                      {selectedStudent.status === "active" ? "Suspend Account" : "Re-activate Account"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Enrolled Courses & Progress */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                    Enrolled Courses ({selectedStudent.enrolledCourseIds.length})
                  </h4>

                  {/* Add course enrollment dropdown */}
                  <div className="flex items-center gap-1.5">
                    <select
                      onChange={(e) => {
                        handleEnrollCourse(selectedStudent.id, e.target.value);
                        e.target.value = "";
                      }}
                      defaultValue=""
                      className="text-[11px] p-1.5 rounded-lg bg-[var(--surface-soft)] border border-[var(--border)] text-[var(--foreground)] max-w-44 truncate"
                    >
                      <option value="" disabled>
                        + Enroll in Course...
                      </option>
                      {courses
                        .filter((c) => !selectedStudent.enrolledCourseIds.includes(c.id))
                        .map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.title}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  {selectedStudent.enrolledCourseIds.length === 0 ? (
                    <div className="p-4 rounded-xl bg-[var(--surface-soft)] text-center text-xs text-[var(--muted)]">
                      No active course enrollments.
                    </div>
                  ) : (
                    selectedStudent.enrolledCourseIds.map((cid) => {
                      const courseObj = courses.find((c) => c.id === cid);
                      const progress = selectedStudent.courseProgress[cid] ?? 0;
                      return (
                        <div
                          key={cid}
                          className="p-3 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] space-y-2"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-[var(--foreground)] truncate max-w-[240px]">
                              {courseObj ? courseObj.title : `Course #${cid}`}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[var(--accent)]">{progress}%</span>
                              <button
                                onClick={() => handleUnenrollCourse(selectedStudent.id, cid)}
                                className="text-[10px] text-rose-500 hover:text-rose-700 p-0.5"
                                title="Unenroll student"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                          {/* Progress Bar */}
                          <div className="w-full h-1.5 rounded-full bg-[var(--surface)] overflow-hidden">
                            <div
                              className="h-full bg-[var(--accent)] rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Admin Internal Notes */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                  Admin Internal Notes
                </label>
                <textarea
                  defaultValue={selectedStudent.notes || ""}
                  onBlur={(e) => {
                    const newNotes = e.target.value;
                    const updated = students.map((s) =>
                      s.id === selectedStudent.id ? { ...s, notes: newNotes } : s
                    );
                    saveStudents(updated);
                    setSelectedStudent({ ...selectedStudent, notes: newNotes });
                    showToast("Saved admin remarks");
                  }}
                  rows={3}
                  placeholder="Record coaching observations, team affiliation, or exam attempts..."
                  className="w-full text-xs p-3 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] resize-none"
                />
              </div>
            </div>

            {/* Bottom Direct Message trigger */}
            <div className="pt-4 border-t border-[var(--border)]">
              <button
                onClick={() => {
                  const subject = prompt("Direct Announcement Subject:", "Updates on your curriculum track");
                  if (subject) {
                    showToast(`Dispatched direct message notification to ${selectedStudent.email}`);
                  }
                }}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-[var(--surface-soft)] border border-[var(--border)] hover:bg-[var(--accent)] hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <span>✉️</span> Send Direct Email Notice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[var(--surface)] rounded-2xl border border-[var(--border)] shadow-2xl p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <h3 className="text-sm font-bold text-[var(--foreground)]">Invite New Student</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-xs text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-[var(--foreground)]">Full Name</label>
                <input
                  type="text"
                  required
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="e.g. Jordan Matthews"
                  className="w-full p-2.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[var(--foreground)]">Email Address</label>
                <input
                  type="email"
                  required
                  value={newStudentEmail}
                  onChange={(e) => setNewStudentEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="w-full p-2.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-[var(--foreground)]">Subscription Plan</label>
                  <select
                    value={newStudentTier}
                    onChange={(e) => setNewStudentTier(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-[var(--foreground)]"
                  >
                    <option value="free">Free Tier</option>
                    <option value="pro">Pro Plan</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-[var(--foreground)]">Country</label>
                  <input
                    type="text"
                    value={newStudentCountry}
                    onChange={(e) => setNewStudentCountry(e.target.value)}
                    placeholder="e.g. Canada"
                    className="w-full p-2.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-[var(--foreground)]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[var(--foreground)]">Initial Course Enrollment</label>
                <select
                  value={newStudentCourseId}
                  onChange={(e) => setNewStudentCourseId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-[var(--foreground)]"
                >
                  <option value="">No initial course (add later)</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[var(--accent)] text-white font-semibold hover:opacity-90"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
