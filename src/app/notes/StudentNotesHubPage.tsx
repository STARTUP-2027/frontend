import { useState } from "react";
import { Link } from "react-router";
import { useCourses } from "../context/CourseContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../theme";
import { SiteNav, SiteFooter } from "../../App";

export default function StudentNotesHubPage() {
  const { dark } = useTheme();
  const { user } = useAuth();
  const { bookmarks, removeBookmark, flashcards, toggleFlashcardMastered, addFlashcard, addBookmark } = useCourses();

  const [activeTab, setActiveTab] = useState<"bookmarks" | "flashcards">("bookmarks");
  const [searchQuery, setSearchQuery] = useState("");
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);

  // Modal for new note
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteText, setNewNoteText] = useState("");
  const [newNoteSnippet, setNewNoteSnippet] = useState("");
  const [newNoteTags, setNewNoteTags] = useState("");

  const filteredBookmarks = bookmarks.filter((b) =>
    b.lessonTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.noteText.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredFlashcards = flashcards.filter((fc) =>
    fc.front.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fc.back.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fc.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopySnippet = (id: string, snippet?: string) => {
    if (!snippet) return;
    navigator.clipboard.writeText(snippet);
    setCopiedSnippetId(id);
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  const handleSaveCustomNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim()) return;

    addBookmark({
      courseId: "custom-notes",
      courseTitle: "Personal Notes Vault",
      lessonId: `note-${Date.now()}`,
      lessonTitle: newNoteTitle,
      noteText: newNoteText,
      snippet: newNoteSnippet || undefined,
      tags: newNoteTags.split(",").map((t) => t.trim()).filter(Boolean)
    });

    setNewNoteTitle("");
    setNewNoteText("");
    setNewNoteSnippet("");
    setNewNoteTags("");
    setShowAddNoteModal(false);
  };

  return (
    <div className={`subpage app ${dark ? "dark" : ""} min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]`}>
      <SiteNav />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-28 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 uppercase">
                Personal Learning Hub
              </span>
              <span className="text-xs text-[var(--muted)]">{bookmarks.length} Bookmarks • {flashcards.length} Flashcards</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight">Bookmarks, Notes & Revision Cards</h1>
            <p className="text-xs text-[var(--muted)] mt-1">
              Searchable code snippets, key architectural takeaways, and active recall revision flashcards.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddNoteModal(true)}
              className="button button-sm text-xs font-black flex items-center gap-2"
            >
              <span>➕</span> Add Personal Note / Snippet
            </button>
            <Link to="/dashboard" className="px-4 py-2 rounded-xl text-xs font-bold border border-[var(--border)] bg-[var(--surface-soft)] hover:bg-[var(--surface)]">
              Dashboard →
            </Link>
          </div>
        </div>

        {/* Search & Tabs Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex border-b border-[var(--border-soft)] gap-2 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab("bookmarks")}
              className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
                activeTab === "bookmarks"
                  ? "border-[var(--accent)] text-[var(--accent)]"
                  : "border-transparent text-[var(--muted)] hover:text-[var(--text)]"
              }`}
            >
              <span>📑</span> Code Snippets & Notes ({bookmarks.length})
            </button>
            <button
              onClick={() => setActiveTab("flashcards")}
              className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
                activeTab === "flashcards"
                  ? "border-[var(--accent)] text-[var(--accent)]"
                  : "border-transparent text-[var(--muted)] hover:text-[var(--text)]"
              }`}
            >
              <span>🎴</span> Revision Flashcards ({flashcards.length})
            </button>
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes, tags, or concepts..."
            className="p-2.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs w-full sm:w-72"
          />
        </div>

        {/* TAB 1: Bookmarks & Code Notes */}
        {activeTab === "bookmarks" && (
          <div className="space-y-4">
            {filteredBookmarks.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-3">
                <span className="text-4xl">📚</span>
                <h3 className="text-base font-bold">No saved notes matching your search</h3>
                <p className="text-xs text-[var(--muted)]">Bookmark lesson notes in the course player or create custom notes above.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredBookmarks.map((bm) => (
                  <div
                    key={bm.id}
                    className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-blue-500/50 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-5 sm:p-6 space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-[10px] text-[var(--muted)]">
                        <span className="font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{bm.courseTitle}</span>
                        <span>{bm.createdAt}</span>
                      </div>

                      <h3 className="text-sm font-bold text-[var(--text)] leading-snug">
                        {bm.lessonTitle}
                      </h3>

                      <p className="text-xs text-[var(--muted)] leading-relaxed">
                        {bm.noteText}
                      </p>

                      {bm.snippet && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono">
                            <span>Code Snippet</span>
                            <button
                              onClick={() => handleCopySnippet(bm.id, bm.snippet)}
                              className="text-blue-600 dark:text-blue-400 hover:underline font-bold"
                            >
                              {copiedSnippetId === bm.id ? "✓ Copied!" : "📋 Copy Code"}
                            </button>
                          </div>
                          <pre className="p-3.5 rounded-xl bg-slate-950 text-blue-300 font-mono text-[11px] overflow-x-auto border border-slate-800">
                            {bm.snippet}
                          </pre>
                        </div>
                      )}

                      {bm.tags && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {bm.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded-md bg-[var(--surface-soft)] border border-[var(--border-soft)] text-[10px] text-[var(--muted)] font-medium"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-[var(--border-soft)] flex items-center justify-between">
                      {bm.courseId !== "custom-notes" ? (
                        <Link to={`/learn/${bm.courseId}`} className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                          Jump to Lesson →
                        </Link>
                      ) : (
                        <span className="text-xs text-[var(--muted)]">Custom Snippet</span>
                      )}
                      <button
                        onClick={() => removeBookmark(bm.id)}
                        className="text-rose-500 hover:text-rose-400 text-xs font-bold p-1"
                        title="Delete Note"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Revision Flashcards */}
        {activeTab === "flashcards" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFlashcards.map((fc) => {
                const isFlipped = flippedCardId === fc.id;
                return (
                  <div
                    key={fc.id}
                    className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-blue-500/50 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-5 sm:p-6 space-y-4 flex flex-col justify-between min-h-[260px] cursor-pointer"
                    onClick={() => setFlippedCardId(isFlipped ? null : fc.id)}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="px-2.5 py-0.5 rounded-full font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 uppercase">
                          {fc.category}
                        </span>
                        <span className="text-[var(--muted)] font-mono">
                          {isFlipped ? "Answer Side" : "Question Side"}
                        </span>
                      </div>

                      <div className="py-2">
                        {!isFlipped ? (
                          <p className="text-sm font-extrabold text-[var(--text)] leading-relaxed">
                            {fc.front}
                          </p>
                        ) : (
                          <div className="space-y-2 animate-fade-in">
                            <span className="text-[10px] font-bold text-emerald-400 uppercase">Key Recall Concept:</span>
                            <p className="text-xs text-gray-300 leading-relaxed font-medium">
                              {fc.back}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div
                      className="pt-3 border-t border-[var(--border-soft)] flex items-center justify-between text-xs"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => toggleFlashcardMastered(fc.id)}
                        className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition-colors ${
                          fc.mastered
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-[var(--surface-soft)] text-[var(--muted)] hover:text-[var(--text)]"
                        }`}
                      >
                        {fc.mastered ? "✓ Mastered" : "Mark as Mastered"}
                      </button>

                      <button
                        onClick={() => setFlippedCardId(isFlipped ? null : fc.id)}
                        className="text-[var(--accent)] font-bold hover:underline"
                      >
                        {isFlipped ? "Flip to Question" : "Reveal Answer 🔄"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Modal for adding custom note */}
        {showAddNoteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="max-w-lg w-full p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black">Add Personal Note or Code Snippet</h3>
                <button onClick={() => setShowAddNoteModal(false)} className="text-sm font-bold text-[var(--muted)]">✕</button>
              </div>

              <form onSubmit={handleSaveCustomNote} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold mb-1">Title / Topic</label>
                  <input
                    required
                    type="text"
                    value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                    placeholder="e.g. Postgres Index Optimization Notes"
                    className="w-full p-2.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)]"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Note Explanation / Summary</label>
                  <textarea
                    rows={3}
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Key architectural insights..."
                    className="w-full p-2.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)]"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Code Snippet (Optional)</label>
                  <textarea
                    rows={4}
                    value={newNoteSnippet}
                    onChange={(e) => setNewNoteSnippet(e.target.value)}
                    placeholder="// Insert code here..."
                    className="w-full p-2.5 rounded-xl bg-[#090810] text-[#93c5fd] font-mono border border-gray-800"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Tags (Comma separated)</label>
                  <input
                    type="text"
                    value={newNoteTags}
                    onChange={(e) => setNewNoteTags(e.target.value)}
                    placeholder="Postgres, Performance, Database"
                    className="w-full p-2.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)]"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddNoteModal(false)}
                    className="px-4 py-2 rounded-xl font-bold bg-[var(--surface-soft)]"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="button button-sm font-black">
                    Save to Notes Hub
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
