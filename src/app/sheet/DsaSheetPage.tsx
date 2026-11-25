import React, { useState, useEffect, useMemo } from "react";
import sheetsRawData from "../data/sheetsData.json";
import { useTheme } from "../theme";
import { SiteNav, SiteFooter } from "../../App";
import {
  SearchIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  BookmarkIcon,
  CheckIcon,
  CodeIcon,
  ExternalLinkIcon,
  YoutubeIcon,
  LightbulbIcon,
  FileTextIcon,
  BookOpenIcon,
  LayersIcon,
  XIcon,
  SaveIcon,
  FlameIcon,
} from "./SheetIcons";

interface Company {
  id: string;
  name: string;
  isTop?: boolean;
}

interface Problem {
  id: string;
  title: string;
  difficulty: string;
  reference?: string;
  leetcodeUrl?: string;
  gfgUrl?: string;
  videoUrl?: string;
  youtubeUrl?: string;
  hints?: string[];
  notes?: string;
  companies?: Company[];
}

interface Pattern {
  id: string;
  name: string;
  identification?: string;
  strategy?: string;
  problems?: Problem[];
  patternTotal?: number;
  patternSolved?: number;
}

interface Topic {
  id: string;
  name: string;
  description?: string;
  patterns?: Pattern[];
  topicTotal?: number;
  topicSolved?: number;
  topicPercent?: number;
}

interface Sheet {
  slug: string;
  name: string;
  description?: string;
  topics?: Topic[];
}

/* ===================== VIDEO MODAL ===================== */
function VideoModal({
  videoUrl,
  title,
  onClose,
}: {
  videoUrl: string;
  title: string;
  onClose: () => void;
}) {
  if (!videoUrl) return null;

  let embedUrl = videoUrl;
  const match = videoUrl.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  if (match && match[1]) {
    embedUrl = `https://www.youtube.com/embed/${match[1]}?autoplay=1`;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border-soft)] pb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="flex h-3 w-3 rounded-full bg-rose-500 animate-pulse shrink-0" />
            <h3 className="text-sm sm:text-base font-extrabold text-[var(--text)] truncate">
              {title} — Video Explanation
            </h3>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={videoUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 rounded-xl border border-[var(--border-soft)] bg-[var(--surface-soft)] px-3 py-1.5 text-xs text-[var(--muted)] hover:text-[var(--text)] transition-colors"
            >
              Open in YouTube <ExternalLinkIcon size={13} />
            </a>
            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-[var(--muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)] transition-colors"
              aria-label="Close video"
            >
              <XIcon size={18} />
            </button>
          </div>
        </div>

        <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-inner">
          <iframe
            src={embedUrl}
            title={title}
            className="h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}

/* ===================== NOTES MODAL ===================== */
function NotesModal({
  problem,
  onClose,
  onSave,
  initialNote,
}: {
  problem: Problem;
  onClose: () => void;
  onSave: (problemId: string, noteText: string) => void;
  initialNote: string;
}) {
  const [note, setNote] = useState(initialNote || "");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setNote(initialNote || "");
  }, [initialNote]);

  const handleSave = () => {
    onSave(problem.id, note);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border-soft)] pb-3">
          <div className="min-w-0">
            <h3 className="text-base font-extrabold text-[var(--text)]">Personal Problem Notes</h3>
            <p className="text-xs text-[var(--muted)] truncate max-w-xs sm:max-w-md">
              {problem.title} {problem.reference && `(${problem.reference})`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-[var(--muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)] transition-colors"
          >
            <XIcon size={18} />
          </button>
        </div>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Write your key takeaways, tricky edge cases to remember, time/space complexities, or interview pitfalls..."
          className="h-44 w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-3 text-xs sm:text-sm text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] font-mono leading-relaxed"
        />

        <div className="flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-xs font-semibold text-[var(--muted)] hover:text-[var(--text)] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 rounded-xl bg-[var(--accent)] px-4 py-2 text-xs font-bold text-white hover:opacity-90 transition-all shadow-md shadow-purple-500/20"
          >
            {saved ? (
              <>
                <CheckIcon size={14} /> Saved!
              </>
            ) : (
              <>
                <SaveIcon size={14} /> Save Note
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===================== MAIN DSA SHEET PAGE ===================== */
export default function DsaSheetPage() {
  const { dark } = useTheme();
  const sheets: Sheet[] = (sheetsRawData as any).sheets || [];

  // Active sheet selection: 'pattern-wise-sheet' | 'last-minute-100' | 'sbc'
  const [activeSheetSlug, setActiveSheetSlug] = useState<string>(() => {
    return localStorage.getItem("rb_active_sheet") || "pattern-wise-sheet";
  });

  // Solved state: Map of problemId -> boolean
  const [solvedMap, setSolvedMap] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem("rb_solved_map");
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Bookmarks: Map of problemId -> boolean
  const [bookmarkMap, setBookmarkMap] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem("rb_bookmark_map");
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Notes: Map of problemId -> string
  const [notesMap, setNotesMap] = useState<Record<string, string>>(() => {
    try {
      const stored = localStorage.getItem("rb_notes_map");
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<"ALL" | "EASY" | "MEDIUM" | "HARD">("ALL");
  const [showDifficultyDropdown, setShowDifficultyDropdown] = useState(false);
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});
  const [expandedPatterns, setExpandedPatterns] = useState<Record<string, boolean>>({});
  const [expandedHints, setExpandedHints] = useState<Record<string, boolean>>({});
  const [activeVideo, setActiveVideo] = useState<{ url: string; title: string } | null>(null);
  const [activeNoteProblem, setActiveNoteProblem] = useState<Problem | null>(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem("rb_active_sheet", activeSheetSlug);
  }, [activeSheetSlug]);

  useEffect(() => {
    localStorage.setItem("rb_solved_map", JSON.stringify(solvedMap));
  }, [solvedMap]);

  useEffect(() => {
    localStorage.setItem("rb_bookmark_map", JSON.stringify(bookmarkMap));
  }, [bookmarkMap]);

  useEffect(() => {
    localStorage.setItem("rb_notes_map", JSON.stringify(notesMap));
  }, [notesMap]);

  // Current active sheet object
  const currentSheet = useMemo(() => {
    return sheets.find((s) => s.slug === activeSheetSlug) || sheets[0] || { topics: [] };
  }, [sheets, activeSheetSlug]);

  // Set initial expanded topic when sheet changes
  useEffect(() => {
    if (currentSheet.topics && currentSheet.topics.length > 0) {
      const firstTopicId = currentSheet.topics[0].id;
      setExpandedTopics({ [firstTopicId]: true });
      if (currentSheet.topics[0].patterns && currentSheet.topics[0].patterns.length > 0) {
        setExpandedPatterns({ [currentSheet.topics[0].patterns[0].id]: true });
      }
    }
  }, [activeSheetSlug]);

  // Stats across sheets
  const stats = useMemo(() => {
    let totalAll = 0;
    let solvedAll = 0;
    const sheetCounts: Record<string, { total: number; solved: number }> = {};

    sheets.forEach((sheet) => {
      let sTotal = 0;
      let sSolved = 0;
      (sheet.topics || []).forEach((t) => {
        (t.patterns || []).forEach((p) => {
          (p.problems || []).forEach((prob) => {
            sTotal++;
            totalAll++;
            if (solvedMap[prob.id]) {
              sSolved++;
              solvedAll++;
            }
          });
        });
      });
      sheetCounts[sheet.slug] = { total: sTotal, solved: sSolved };
    });

    return { totalAll, solvedAll, sheetCounts };
  }, [sheets, solvedMap]);

  const toggleSolved = (id: string) => {
    setSolvedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleBookmark = (id: string) => {
    setBookmarkMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSaveNote = (id: string, text: string) => {
    setNotesMap((prev) => ({ ...prev, [id]: text }));
  };

  const toggleTopicExpand = (topicId: string) => {
    setExpandedTopics((prev) => ({ ...prev, [topicId]: !prev[topicId] }));
  };

  const togglePatternExpand = (patternId: string) => {
    setExpandedPatterns((prev) => ({ ...prev, [patternId]: !prev[patternId] }));
  };

  const toggleHintExpand = (problemId: string) => {
    setExpandedHints((prev) => ({ ...prev, [problemId]: !prev[problemId] }));
  };

  // Difficulty counts for the current active sheet
  const diffCounts = useMemo(() => {
    let easy = 0;
    let medium = 0;
    let hard = 0;
    let total = 0;

    (currentSheet.topics || []).forEach((t) => {
      (t.patterns || []).forEach((p) => {
        (p.problems || []).forEach((prob) => {
          total++;
          const d = (prob.difficulty || "").toUpperCase();
          if (d === "EASY") easy++;
          else if (d === "MEDIUM") medium++;
          else if (d === "HARD") hard++;
        });
      });
    });

    return { easy, medium, hard, total };
  }, [currentSheet]);

  // Filter topics and problems
  const filteredTopics = useMemo(() => {
    return (currentSheet.topics || [])
      .map((topic) => {
        let topicTotal = 0;
        let topicSolved = 0;

        const filteredPatterns = (topic.patterns || [])
          .map((pattern) => {
            let patternSolved = 0;
            const originalProblems = pattern.problems || [];
            originalProblems.forEach((pr) => {
              topicTotal++;
              if (solvedMap[pr.id]) {
                topicSolved++;
                patternSolved++;
              }
            });

            const filteredProblems = originalProblems.filter((prob) => {
              if (difficultyFilter !== "ALL") {
                if ((prob.difficulty || "").toUpperCase() !== difficultyFilter) return false;
              }

              const isBookmarked = !!bookmarkMap[prob.id];
              if (onlyBookmarked && !isBookmarked) return false;

              if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase().trim();
                const matchTitle = prob.title?.toLowerCase().includes(q);
                const matchRef = prob.reference?.toLowerCase().includes(q);
                const matchPattern = pattern.name?.toLowerCase().includes(q);
                const matchTopic = topic.name?.toLowerCase().includes(q);
                const matchCompany = (prob.companies || []).some((c) =>
                  c.name?.toLowerCase().includes(q)
                );
                return matchTitle || matchRef || matchPattern || matchTopic || matchCompany;
              }

              return true;
            });

            return {
              ...pattern,
              patternTotal: originalProblems.length,
              patternSolved,
              problems: filteredProblems,
            };
          })
          .filter((p) => p.problems.length > 0 || !searchQuery.trim());

        const topicPercent = topicTotal > 0 ? Math.round((topicSolved / topicTotal) * 100) : 0;

        return {
          ...topic,
          patterns: filteredPatterns,
          topicTotal,
          topicSolved,
          topicPercent,
        };
      })
      .filter((t) => (t.patterns && t.patterns.length > 0) || !searchQuery.trim());
  }, [currentSheet, solvedMap, bookmarkMap, difficultyFilter, onlyBookmarked, searchQuery]);

  const currentSheetStats = stats.sheetCounts[activeSheetSlug] || { total: 0, solved: 0 };
  const currentSheetPercent =
    currentSheetStats.total > 0
      ? Math.round((currentSheetStats.solved / currentSheetStats.total) * 100)
      : 0;

  return (
    <div className={`subpage app ${dark ? "dark" : ""}`}>
      <div className="subpage-noise" />
      <SiteNav />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ===================== HERO BANNER ===================== */}
        <section className="relative p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[var(--surface)] via-[var(--surface-soft)] to-[var(--surface)] border border-[var(--border-soft)] shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wider">
                <FlameIcon size={14} /> Pattern-Based DSA Sheet
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-[var(--text)]">
                Learn <span className="text-emerald-400">patterns</span>, <br />
                not just the solution.
              </h1>

              <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                Master 380+ interview algorithms topic by topic. Pattern Wise guides your foundational reasoning, Last Minute 100 optimizes crunch time, and SBC targets top IT consulting benchmarks.
              </p>
            </div>

            {/* Metric Pills */}
            <div className="flex flex-wrap items-center gap-2.5 pb-1">
              <div className="inline-flex items-center gap-2 rounded-2xl bg-[var(--surface)] border border-[var(--border-soft)] px-4 py-2 text-xs shadow-sm">
                <BookOpenIcon size={15} className="text-emerald-400" />
                <span className="font-extrabold text-[var(--text)]">{sheets.length}</span>
                <span className="text-[var(--muted)]">Sheets</span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-2xl bg-[var(--surface)] border border-[var(--border-soft)] px-4 py-2 text-xs shadow-sm">
                <LayersIcon size={15} className="text-purple-400" />
                <span className="font-extrabold text-[var(--text)]">50</span>
                <span className="text-[var(--muted)]">Topics</span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-2xl bg-[var(--surface)] border border-[var(--border-soft)] px-4 py-2 text-xs shadow-sm">
                <CodeIcon size={15} className="text-sky-400" />
                <span className="font-extrabold text-[var(--text)]">{stats.totalAll}</span>
                <span className="text-[var(--muted)]">Problems</span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 text-xs shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-extrabold text-emerald-400">
                  {stats.solvedAll}/{stats.totalAll} Solved
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 3 SHEET SELECTOR CARDS ===================== */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              slug: "pattern-wise-sheet",
              number: "1",
              name: "Pattern Wise Sheet",
              subtitle: "Topic by topic algorithmic patterns",
              defaultTotal: 385,
            },
            {
              slug: "last-minute-100",
              number: "2",
              name: "Last Minute 100",
              subtitle: "Essential 100 questions for upcoming interviews",
              defaultTotal: 106,
            },
            {
              slug: "sbc",
              number: "3",
              name: "SBC Sheet",
              subtitle: "TCS, Infosys, Wipro, Accenture & TechM targets",
              defaultTotal: 129,
            },
          ].map((card) => {
            const active = activeSheetSlug === card.slug;
            const sheetStat = stats.sheetCounts[card.slug] || {
              total: card.defaultTotal,
              solved: 0,
            };
            const pct =
              sheetStat.total > 0 ? Math.round((sheetStat.solved / sheetStat.total) * 100) : 0;

            return (
              <div
                key={card.slug}
                onClick={() => setActiveSheetSlug(card.slug)}
                className={`cursor-pointer rounded-3xl p-5 transition-all flex flex-col justify-between border ${
                  active
                    ? "bg-emerald-500/[0.08] border-emerald-500/50 shadow-xl shadow-emerald-500/10 ring-2 ring-emerald-500/30"
                    : "bg-[var(--surface)] border-[var(--border-soft)] hover:border-[var(--border)] hover:bg-[var(--surface-soft)]/50"
                }`}
              >
                <div className="flex items-center gap-3.5 mb-3">
                  <div
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-sm font-black transition-colors ${
                      active
                        ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/20"
                        : "bg-[var(--surface-soft)] text-[var(--muted)] border border-[var(--border)]"
                    }`}
                  >
                    {card.number}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-extrabold text-[var(--text)] truncate">
                      {card.name}
                    </h3>
                    <p className="text-[11px] text-[var(--muted)] truncate">{card.subtitle}</p>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-[var(--border-soft)]">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-[var(--muted)]">
                    <span>
                      {sheetStat.solved}/{sheetStat.total || card.defaultTotal} solved
                    </span>
                    <span className={active ? "text-emerald-400" : ""}>{pct}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[var(--surface-soft)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* ===================== ACTIVE SHEET MAIN VIEWPORT ===================== */}
        <section className="rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] p-5 sm:p-7 space-y-6 shadow-2xl">
          {/* Active Sheet Header & Progress */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[var(--text)]">
                  {currentSheet.name || "DSA Sheet"}
                </h2>
                <p className="text-xs sm:text-sm text-[var(--muted)]">
                  {currentSheet.description || "Master algorithmic problem solving pattern by pattern."}
                </p>
              </div>

              <span className="text-xs sm:text-sm font-mono font-bold text-[var(--muted)] whitespace-nowrap self-start sm:self-auto">
                <span className="text-[var(--text)] font-black">{currentSheetStats.solved}</span> /{" "}
                {currentSheetStats.total} problems solved{" "}
                <span className="text-emerald-400 font-extrabold">({currentSheetPercent}%)</span>
              </span>
            </div>

            <div className="h-2 w-full bg-[var(--surface-soft)] rounded-full overflow-hidden border border-[var(--border-soft)]">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
                style={{ width: `${currentSheetPercent}%` }}
              />
            </div>
          </div>

          {/* Filter Bar (Search, Difficulty Dropdown, Bookmarked Toggle) */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[var(--border-soft)]">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[220px]">
              <SearchIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search problem title, pattern, topic, or company (e.g. Google)..."
                className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] py-2.5 pl-10 pr-10 text-xs sm:text-sm text-[var(--text)] placeholder-[var(--muted)] focus:border-emerald-500 focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted)] hover:text-[var(--text)]"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Difficulty Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDifficultyDropdown(!showDifficultyDropdown)}
                className="flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2.5 text-xs sm:text-sm font-bold text-[var(--text)] hover:border-emerald-500 transition-all cursor-pointer select-none"
              >
                <span>
                  Difficulty:{" "}
                  <strong className="text-emerald-400">
                    {difficultyFilter === "ALL" ? "All" : difficultyFilter}
                  </strong>
                </span>
                {showDifficultyDropdown ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />}
              </button>

              {showDifficultyDropdown && (
                <div className="absolute left-0 mt-2 z-40 w-52 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-2xl animate-fade-in space-y-1">
                  <button
                    onClick={() => {
                      setDifficultyFilter("ALL");
                      setShowDifficultyDropdown(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                      difficultyFilter === "ALL"
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "text-[var(--muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
                    }`}
                  >
                    <span>All Difficulties</span>
                    <span className="font-mono text-[10px]">{diffCounts.total}</span>
                  </button>
                  <button
                    onClick={() => {
                      setDifficultyFilter("EASY");
                      setShowDifficultyDropdown(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                      difficultyFilter === "EASY"
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "text-emerald-400 hover:bg-[var(--surface-soft)]"
                    }`}
                  >
                    <span>Easy</span>
                    <span className="font-mono text-[10px] text-[var(--muted)]">{diffCounts.easy}</span>
                  </button>
                  <button
                    onClick={() => {
                      setDifficultyFilter("MEDIUM");
                      setShowDifficultyDropdown(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                      difficultyFilter === "MEDIUM"
                        ? "bg-amber-500/15 text-amber-400"
                        : "text-amber-400 hover:bg-[var(--surface-soft)]"
                    }`}
                  >
                    <span>Medium</span>
                    <span className="font-mono text-[10px] text-[var(--muted)]">{diffCounts.medium}</span>
                  </button>
                  <button
                    onClick={() => {
                      setDifficultyFilter("HARD");
                      setShowDifficultyDropdown(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                      difficultyFilter === "HARD"
                        ? "bg-rose-500/15 text-rose-400"
                        : "text-rose-400 hover:bg-[var(--surface-soft)]"
                    }`}
                  >
                    <span>Hard</span>
                    <span className="font-mono text-[10px] text-[var(--muted)]">{diffCounts.hard}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Bookmarked Filter Button */}
            <button
              onClick={() => setOnlyBookmarked(!onlyBookmarked)}
              className={`flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                onlyBookmarked
                  ? "border-amber-400/50 bg-amber-400/15 text-amber-400 shadow-sm"
                  : "border-[var(--border)] bg-[var(--surface-soft)] text-[var(--muted)] hover:text-[var(--text)]"
              }`}
            >
              <BookmarkIcon size={15} fill={onlyBookmarked ? "currentColor" : "none"} />
              <span>Bookmarked</span>
            </button>
          </div>

          {/* ===================== TOPICS LIST ===================== */}
          <div className="space-y-6 pt-2">
            {filteredTopics.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-[var(--surface-soft)]/50 border border-[var(--border-soft)] space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 text-2xl flex items-center justify-center mx-auto">
                  🔍
                </div>
                <h4 className="text-base font-extrabold text-[var(--text)]">No problems found</h4>
                <p className="text-xs text-[var(--muted)]">
                  Try adjusting your search query, difficulty dropdown, or bookmark filter.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setDifficultyFilter("ALL");
                    setOnlyBookmarked(false);
                  }}
                  className="button button-sm text-xs font-bold mt-2"
                >
                  Reset Sheet Filters
                </button>
              </div>
            ) : (
              filteredTopics.map((topic) => {
                const isTopicOpen = expandedTopics[topic.id] !== false;

                return (
                  <div
                    key={topic.id}
                    className="rounded-3xl border border-[var(--border-soft)] bg-[var(--surface)] overflow-hidden shadow-lg"
                  >
                    {/* Collapsible Topic Header */}
                    <div
                      onClick={() => toggleTopicExpand(topic.id)}
                      className="p-5 sm:p-6 bg-[var(--surface-soft)]/40 hover:bg-[var(--surface-soft)]/80 transition-colors cursor-pointer select-none space-y-3"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center text-xs font-black shrink-0">
                            {isTopicOpen ? "−" : "+"}
                          </span>
                          <h3 className="text-base sm:text-xl font-black text-[var(--text)] truncate">
                            {topic.name}
                          </h3>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-xs font-mono font-bold text-[var(--muted)]">
                            {topic.topicSolved}/{topic.topicTotal} solved
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-mono text-xs font-extrabold">
                            {topic.topicPercent}%
                          </span>
                        </div>
                      </div>

                      {/* Topic Progress Bar */}
                      <div className="h-1.5 w-full bg-[var(--surface)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${topic.topicPercent}%` }}
                        />
                      </div>

                      {topic.description && (
                        <p className="text-xs text-[var(--muted)] leading-relaxed">
                          {topic.description}
                        </p>
                      )}
                    </div>

                    {/* Topic Patterns & Problems Container */}
                    {isTopicOpen && (
                      <div className="p-4 sm:p-6 space-y-6">
                        {(topic.patterns || []).map((pattern) => {
                          const isPatternOpen = expandedPatterns[pattern.id] !== false;
                          const patternTotal = pattern.patternTotal || (pattern.problems || []).length;
                          const patternSolved = pattern.patternSolved || 0;
                          const isAllPatternDone = patternTotal > 0 && patternSolved === patternTotal;

                          return (
                            <div
                              key={pattern.id}
                              className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] overflow-hidden"
                            >
                              {/* Pattern Accordion Bar */}
                              <div
                                onClick={() => togglePatternExpand(pattern.id)}
                                className={`p-4 flex items-center justify-between gap-3 cursor-pointer select-none transition-colors ${
                                  isAllPatternDone
                                    ? "bg-emerald-500/[0.04]"
                                    : "bg-[var(--surface-soft)]/50 hover:bg-[var(--surface-soft)]"
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  {isPatternOpen ? (
                                    <ChevronUpIcon size={16} className="text-[var(--muted)] shrink-0" />
                                  ) : (
                                    <ChevronDownIcon size={16} className="text-[var(--muted)] shrink-0" />
                                  )}
                                  <h4 className="text-xs sm:text-sm font-extrabold text-[var(--text)] truncate">
                                    {pattern.name}
                                  </h4>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="px-2 py-0.5 rounded-full border border-emerald-500/40 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10">
                                    {patternSolved}/{patternTotal}
                                  </span>
                                </div>
                              </div>

                              {/* Pattern Content (Strategy & Problems) */}
                              {isPatternOpen && (
                                <div className="p-4 sm:p-5 space-y-4">
                                  {/* Pattern Identification & Strategy Tips */}
                                  {(pattern.identification || pattern.strategy) && (
                                    <div className="p-3.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border-soft)] text-xs space-y-2">
                                      {pattern.identification && (
                                        <div className="flex items-start gap-2 text-[var(--text)] leading-relaxed">
                                          <span className="text-sm shrink-0">🎯</span>
                                          <span>
                                            <strong className="text-emerald-400">Pattern Recognition:</strong>{" "}
                                            {pattern.identification}
                                          </span>
                                        </div>
                                      )}
                                      {pattern.strategy && (
                                        <div className="flex items-start gap-2 text-[var(--muted)] leading-relaxed">
                                          <span className="text-sm shrink-0">💡</span>
                                          <span>
                                            <strong className="text-[var(--text)]">Core Strategy:</strong>{" "}
                                            {pattern.strategy}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* Problem Rows Table */}
                                  <div className="space-y-2">
                                    {(pattern.problems || []).map((prob, probIdx) => {
                                      const isSolved = !!solvedMap[prob.id];
                                      const isBookmarked = !!bookmarkMap[prob.id];
                                      const hasNote = !!notesMap[prob.id];
                                      const isHintOpen = !!expandedHints[prob.id];
                                      const diff = (prob.difficulty || "").toUpperCase();
                                      const problemUrl = prob.leetcodeUrl || prob.gfgUrl || "#";
                                      const videoUrl = prob.videoUrl || prob.youtubeUrl;

                                      return (
                                        <div
                                          key={prob.id}
                                          className={`rounded-2xl border transition-all p-3.5 ${
                                            isSolved
                                              ? "bg-emerald-500/[0.03] border-emerald-500/25"
                                              : "bg-[var(--surface)] border-[var(--border-soft)] hover:border-[var(--border)] hover:bg-[var(--surface-soft)]/40"
                                          }`}
                                        >
                                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            {/* Left: Checkbox, Number, Title, Difficulty, Companies */}
                                            <div className="flex items-center gap-3 min-w-0">
                                              {/* Solved Checkbox */}
                                              <button
                                                type="button"
                                                onClick={() => toggleSolved(prob.id)}
                                                className="shrink-0 transition-transform active:scale-90 cursor-pointer"
                                                title={isSolved ? "Mark as unsolved" : "Mark as solved"}
                                              >
                                                {isSolved ? (
                                                  <div className="grid h-5 w-5 place-items-center rounded-full bg-emerald-500 text-black shadow-sm">
                                                    <CheckIcon size={12} strokeWidth={3} />
                                                  </div>
                                                ) : (
                                                  <div className="h-5 w-5 rounded-full border-2 border-[var(--muted)]/50 hover:border-emerald-400 transition-colors" />
                                                )}
                                              </button>

                                              <span className="font-mono text-xs text-[var(--muted)] w-5 shrink-0 text-center">
                                                {probIdx + 1}
                                              </span>

                                              {/* Problem Title */}
                                              <a
                                                href={problemUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className={`text-xs sm:text-sm font-bold hover:text-emerald-400 transition-colors truncate max-w-xs sm:max-w-md ${
                                                  isSolved
                                                    ? "line-through text-[var(--muted)]"
                                                    : "text-[var(--text)]"
                                                }`}
                                              >
                                                {prob.title}
                                              </a>

                                              {/* Difficulty Badge */}
                                              <span
                                                className={`rounded-full px-2 py-0.5 text-[9px] font-mono font-black uppercase tracking-wider shrink-0 ${
                                                  diff === "EASY"
                                                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                                    : diff === "MEDIUM"
                                                    ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                                                    : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                                                }`}
                                              >
                                                {prob.difficulty}
                                              </span>

                                              {/* Top Company Tags */}
                                              {prob.companies && prob.companies.length > 0 && (
                                                <div className="hidden lg:flex items-center gap-1 shrink-0">
                                                  {prob.companies.slice(0, 2).map((comp) => (
                                                    <span
                                                      key={comp.id || comp.name}
                                                      className="px-2 py-0.5 rounded-md bg-[var(--surface-soft)] border border-[var(--border-soft)] text-[9px] text-[var(--muted)] font-semibold"
                                                    >
                                                      {comp.name}
                                                    </span>
                                                  ))}
                                                  {prob.companies.length > 2 && (
                                                    <span className="text-[9px] text-[var(--muted)] font-mono">
                                                      +{prob.companies.length - 2}
                                                    </span>
                                                  )}
                                                </div>
                                              )}
                                            </div>

                                            {/* Right: Actions (Hint, Notes, Video, Bookmark, External Link) */}
                                            <div className="flex items-center justify-end gap-1 shrink-0 self-end sm:self-auto">
                                              {/* Hint Toggle */}
                                              {(prob.hints?.length || prob.notes) && (
                                                <button
                                                  onClick={() => toggleHintExpand(prob.id)}
                                                  className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                                                    isHintOpen
                                                      ? "bg-amber-400/20 text-amber-400"
                                                      : "text-[var(--muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
                                                  }`}
                                                  title="Toggle Hints"
                                                >
                                                  <LightbulbIcon size={15} />
                                                </button>
                                              )}

                                              {/* Video Solution */}
                                              {videoUrl && (
                                                <button
                                                  onClick={() =>
                                                    setActiveVideo({ url: videoUrl, title: prob.title })
                                                  }
                                                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                                  title="Watch Video Solution"
                                                >
                                                  <YoutubeIcon size={15} />
                                                </button>
                                              )}

                                              {/* Notes Modal Button */}
                                              <button
                                                onClick={() => setActiveNoteProblem(prob)}
                                                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer relative ${
                                                  hasNote
                                                    ? "bg-purple-500/20 text-purple-400"
                                                    : "text-[var(--muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
                                                }`}
                                                title={hasNote ? "Edit your note" : "Add personal note"}
                                              >
                                                <FileTextIcon size={15} />
                                                {hasNote && (
                                                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-purple-400" />
                                                )}
                                              </button>

                                              {/* Bookmark Button */}
                                              <button
                                                onClick={() => toggleBookmark(prob.id)}
                                                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                                                  isBookmarked
                                                    ? "text-amber-400 bg-amber-400/10"
                                                    : "text-[var(--muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
                                                }`}
                                                title={isBookmarked ? "Remove Bookmark" : "Bookmark Problem"}
                                              >
                                                <BookmarkIcon
                                                  size={15}
                                                  fill={isBookmarked ? "currentColor" : "none"}
                                                />
                                              </button>

                                              {/* External Problem Link */}
                                              <a
                                                href={problemUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-1.5 rounded-lg text-[var(--muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)] transition-colors"
                                                title="Open on LeetCode / GeeksForGeeks"
                                              >
                                                <ExternalLinkIcon size={15} />
                                              </a>
                                            </div>
                                          </div>

                                          {/* Expandable Hint Dropdown */}
                                          {isHintOpen && (
                                            <div className="mt-3 p-3.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border-soft)] text-xs text-[var(--text)] space-y-2 animate-fade-in font-sans">
                                              <div className="flex items-center gap-1.5 font-bold text-amber-400">
                                                <LightbulbIcon size={13} />
                                                <span>Hints & Approach Breakdown:</span>
                                              </div>
                                              {prob.hints && prob.hints.length > 0 ? (
                                                <ul className="list-disc pl-4 space-y-1 text-[var(--muted)]">
                                                  {prob.hints.map((h, hIdx) => (
                                                    <li key={hIdx}>{h}</li>
                                                  ))}
                                                </ul>
                                              ) : prob.notes ? (
                                                <p className="text-[var(--muted)]">{prob.notes}</p>
                                              ) : (
                                                <p className="text-[var(--muted)]">
                                                  Identify the base invariant, consider two pointers or hash-table memoization for optimal time complexity.
                                                </p>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>

      {/* Video Solution Modal */}
      {activeVideo && (
        <VideoModal
          videoUrl={activeVideo.url}
          title={activeVideo.title}
          onClose={() => setActiveVideo(null)}
        />
      )}

      {/* Personal Notes Modal */}
      {activeNoteProblem && (
        <NotesModal
          problem={activeNoteProblem}
          onClose={() => setActiveNoteProblem(null)}
          onSave={handleSaveNote}
          initialNote={notesMap[activeNoteProblem.id] || ""}
        />
      )}

      <SiteFooter />
    </div>
  );
}
