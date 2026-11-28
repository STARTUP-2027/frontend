"use client";

import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import { useCourses, BookmarkNote, Flashcard } from "../context/CourseContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../theme";
import { SiteNav, SiteFooter } from "../../App";

// Available syntax highlighting helper
function formatSyntax(code: string) {
  const lines = code.trim().split("\n");
  return lines.map((line, idx) => {
    // Comment line
    if (line.trim().startsWith("//") || line.trim().startsWith("#")) {
      return (
        <span key={idx} className="text-emerald-400 font-mono">
          {line}
        </span>
      );
    }

    // Tokenize keywords
    const formatted = line
      .replace(/\b(const|let|var|function|return|import|from|export|async|await|new|class|public|private|def|if|else)\b/g, '<span class="text-purple-400 font-bold">$1</span>')
      .replace(/\b(StateGraph|AgentState|ToolExecutor|ServerAction|FormData|Component)\b/g, '<span class="text-sky-300 font-bold">$1</span>')
      .replace(/(\.addNode|\.addEdge|\.update|\.revalidatePath|\.callModel)/g, '<span class="text-amber-300">$1</span>')
      .replace(/(".*?"|'.*?'|`.*?`)/g, '<span class="text-emerald-300">$1</span>');

    return (
      <span
        key={idx}
        className="font-mono text-slate-200"
        dangerouslySetInnerHTML={{ __html: formatted }}
      />
    );
  });
}

export default function StudentNotesHubPage() {
  const { dark } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    bookmarks,
    removeBookmark,
    flashcards,
    toggleFlashcardMastered,
    addFlashcard,
    addBookmark,
  } = useCourses();

  // Navigation Tabs: snippets, flashcards, collections
  const [activeTab, setActiveTab] = useState<"snippets" | "flashcards" | "collections">("snippets");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string>("All");

  // Interactive Flashcard State
  const [revealedCardIds, setRevealedCardIds] = useState<Record<string, boolean>>({});

  // Code Block State
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);
  const [fullscreenSnippet, setFullscreenSnippet] = useState<{ title: string; code: string; language: string } | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Record<string, string>>({
    "bm-1": "Java",
    "bm-2": "TypeScript",
  });

  // Folder assignment mapping (mock local storage or in-memory)
  const [folderAssignments, setFolderAssignments] = useState<Record<string, string>>({
    "bm-1": "Architecture",
    "bm-2": "React",
    "fc-1": "Architecture",
    "fc-2": "React",
    "fc-3": "Rust",
    "fc-4": "DevOps",
  });

  // Three dots menu open state
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<BookmarkNote | null>(null);
  const [showMoveModal, setShowMoveModal] = useState<{ id: string; currentFolder: string } | null>(null);

  // Form State for Adding Note / Snippet
  const [newTitle, setNewTitle] = useState("");
  const [newNoteText, setNewNoteText] = useState("");
  const [newSnippet, setNewSnippet] = useState("");
  const [newLanguage, setNewLanguage] = useState("TypeScript");
  const [newTags, setNewTags] = useState("");
  const [newFolder, setNewFolder] = useState("Architecture");

  // Folders list
  const availableFolders = ["Architecture", "React", "Full-Stack", "AI & ML", "Systems", "DevOps"];

  // Toggle flashcard revealed
  const toggleReveal = (id: string) => {
    setRevealedCardIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Copy code helper
  const handleCopySnippet = (id: string, code?: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedSnippetId(id);
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  // Filter bookmarks
  const filteredBookmarks = useMemo(() => {
    return bookmarks.filter((bm) => {
      const matchesSearch =
        bm.lessonTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bm.noteText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (bm.snippet && bm.snippet.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (bm.tags && bm.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesTag = !selectedTag || (bm.tags && bm.tags.includes(selectedTag));
      const folder = folderAssignments[bm.id] || "Architecture";
      const matchesFolder = selectedFolder === "All" || folder === selectedFolder;

      return matchesSearch && matchesTag && matchesFolder;
    });
  }, [bookmarks, searchQuery, selectedTag, selectedFolder, folderAssignments]);

  // Filter flashcards
  const filteredFlashcards = useMemo(() => {
    return flashcards.filter((fc) => {
      const matchesSearch =
        fc.front.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fc.back.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fc.category.toLowerCase().includes(searchQuery.toLowerCase());

      const folder = folderAssignments[fc.id] || "Architecture";
      const matchesFolder = selectedFolder === "All" || folder === selectedFolder;

      return matchesSearch && matchesFolder;
    });
  }, [flashcards, searchQuery, selectedFolder, folderAssignments]);

  // Handle Add Note Submit
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newId = `note-${Date.now()}`;
    const parsedTags = newTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    addBookmark({
      courseId: "custom-notes",
      courseTitle: newFolder,
      lessonId: newId,
      lessonTitle: newTitle,
      noteText: newNoteText,
      snippet: newSnippet ? newSnippet : undefined,
      tags: parsedTags.length > 0 ? parsedTags : ["Architecture", "AI"],
    });

    setFolderAssignments((prev) => ({
      ...prev,
      [`bm-${newId}`]: newFolder,
      [newId]: newFolder,
    }));

    if (newSnippet) {
      setSelectedLanguage((prev) => ({
        ...prev,
        [newId]: newLanguage,
      }));
    }

    setNewTitle("");
    setNewNoteText("");
    setNewSnippet("");
    setNewTags("");
    setShowAddModal(false);
  };

  // Handle Move Folder
  const handleConfirmMove = (id: string, folderName: string) => {
    setFolderAssignments((prev) => ({
      ...prev,
      [id]: folderName,
    }));
    setShowMoveModal(null);
  };

  return (
    <div className={`subpage app ${dark ? "dark" : ""} min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)] transition-colors duration-200`}>
      <SiteNav />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-32 space-y-6">

        {/* ========================================================================= */}
        {/* 1. HERO LEARNING HUB BANNER (MATCHING REFERENCE DESIGN WITH 3D ART & CTA)  */}
        {/* ========================================================================= */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-50/80 via-purple-50/90 to-indigo-50/70 dark:from-slate-900/90 dark:via-purple-950/40 dark:to-slate-900/90 border border-purple-200/80 dark:border-purple-800/40 shadow-sm p-6 sm:p-8 lg:p-10 transition-all">
          {/* Subtle Background Radial Aura */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            
            {/* Left: Eyebrow + Title + Subtitle + 3 Feature Pills */}
            <div className="space-y-4 max-w-2xl">
              {/* Eyebrow Pill */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/25 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider shadow-2xs">
                <span>🔖</span>
                <span>Your Learning Hub</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-2xl sm:text-4xl lg:text-[2.6rem] font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                Bookmarks, Notes &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">Revision Cards</span>
              </h1>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                Save important concepts, take notes, and quickly revise key topics anytime, anywhere.
              </p>

              {/* Three Value Pills matching reference image */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {/* 1. Quick Access */}
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 shadow-2xs backdrop-blur-xs">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm font-bold shrink-0">
                    🔖
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight truncate">Quick Access</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight truncate">Find your saved content</p>
                  </div>
                </div>

                {/* 2. Smart Revision */}
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 shadow-2xs backdrop-blur-xs">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-500 flex items-center justify-center text-sm font-bold shrink-0">
                    ⚡
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight truncate">Smart Revision</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight truncate">Learn more effectively</p>
                  </div>
                </div>

                {/* 3. Across Devices */}
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 shadow-2xs backdrop-blur-xs">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/15 text-sky-500 flex items-center justify-center text-sm font-bold shrink-0">
                    ☁️
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight truncate">Across Devices</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight truncate">Sync your progress</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: 3D Illustration & Action Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-center lg:items-end justify-center gap-4 shrink-0">
              
              {/* 3D Open Book & Checklist Notepad Vector Art */}
              <div className="relative w-44 h-28 hidden sm:flex items-center justify-center pointer-events-none select-none">
                {/* Floating Checklist Notepad */}
                <div className="absolute -top-1 -right-2 w-24 h-28 rounded-xl bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-800/80 shadow-lg p-2.5 transform rotate-6 z-10 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded-md bg-blue-500 text-white flex items-center justify-center text-[8px] font-black">✓</span>
                      <div className="h-1.5 w-12 bg-slate-200 dark:bg-slate-700 rounded-full" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded-md bg-purple-500 text-white flex items-center justify-center text-[8px] font-black">✓</span>
                      <div className="h-1.5 w-14 bg-slate-200 dark:bg-slate-700 rounded-full" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded-md bg-emerald-500 text-white flex items-center justify-center text-[8px] font-black">✓</span>
                      <div className="h-1.5 w-10 bg-slate-200 dark:bg-slate-700 rounded-full" />
                    </div>
                  </div>
                  <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                </div>

                {/* 3D Open Book */}
                <div className="relative w-36 h-22 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-1 shadow-xl transform -rotate-3">
                  <div className="w-full h-full bg-white dark:bg-slate-900 rounded-lg p-2 flex justify-between gap-1 shadow-inner relative overflow-hidden">
                    {/* Left Page Lines */}
                    <div className="w-1/2 space-y-1.5 pr-1 border-r border-slate-200 dark:border-slate-800">
                      <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full" />
                      <div className="h-1.5 w-4/5 bg-slate-200 dark:bg-slate-800 rounded-full" />
                      <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full" />
                    </div>
                    {/* Right Page Lines */}
                    <div className="w-1/2 space-y-1.5 pl-1">
                      <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full" />
                      <div className="h-1.5 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-full" />
                      <div className="h-1.5 w-4/5 bg-slate-200 dark:bg-slate-800 rounded-full" />
                    </div>
                    {/* Blue Ribbon Bookmark */}
                    <div className="absolute top-0 right-7 w-3 h-10 bg-blue-500 rounded-b-md shadow-md" />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setShowAddModal(true)}
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
                >
                  <span className="text-base font-black leading-none">＋</span>
                  <span>Add Personal Note / Snippet</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700 text-xs font-bold flex items-center justify-center gap-2 shadow-2xs hover:scale-[1.01] transition-all cursor-pointer"
                >
                  <span>📊</span>
                  <span>Go to Dashboard →</span>
                </button>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. TABS & SEARCH / FILTER TOOLBAR (MATCHING EXACT PILL NAVIGATION)        */}
        {/* ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
          
          {/* Left Tabs */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1">
            {/* Tab 1: Code Snippets & Notes */}
            <button
              type="button"
              onClick={() => setActiveTab("snippets")}
              className={`px-4 py-2.5 rounded-full text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "snippets"
                  ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/80 shadow-2xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
              }`}
            >
              <span className="text-blue-500">🔖</span>
              <span>Code Snippets &amp; Notes</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === "snippets"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}>
                {bookmarks.length}
              </span>
            </button>

            {/* Tab 2: Revision Flashcards */}
            <button
              type="button"
              onClick={() => setActiveTab("flashcards")}
              className={`px-4 py-2.5 rounded-full text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "flashcards"
                  ? "bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/80 shadow-2xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
              }`}
            >
              <span className="text-purple-500">🗂️</span>
              <span>Revision Flashcards</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === "flashcards"
                  ? "bg-purple-600 text-white"
                  : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}>
                {flashcards.length}
              </span>
            </button>

            {/* Tab 3: My Collections */}
            <button
              type="button"
              onClick={() => setActiveTab("collections")}
              className={`px-4 py-2.5 rounded-full text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "collections"
                  ? "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/80 shadow-2xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
              }`}
            >
              <span className="text-amber-500">⭐</span>
              <span>My Collections</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === "collections"
                  ? "bg-amber-600 text-white"
                  : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}>
                {availableFolders.length}
              </span>
            </button>
          </div>

          {/* Right Controls: Search Pill + Filter Button */}
          <div className="flex items-center gap-2.5 w-full md:w-auto">
            {/* Search Input Pill */}
            <div className="relative flex-1 md:w-72">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none text-xs">
                🔍
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes, tags, or concepts..."
                className="w-full pl-9 pr-8 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-2xs font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Folder / Category Dropdown Filter */}
            <div className="relative">
              <select
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
                className="px-3.5 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer shadow-2xs appearance-none pr-8"
              >
                <option value="All">⚙️ Filter: All Folders</option>
                {availableFolders.map((f) => (
                  <option key={f} value={f}>
                    📁 {f}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 pointer-events-none">
                ▼
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. CARDS SECTION (2-COLUMN GRID MATCHING EXACT CODE SNIPPET & FLASHCARD)  */}
        {/* ========================================================================= */}
        {activeTab === "snippets" && (
          <div className="space-y-6">
            {filteredBookmarks.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-3">
                <span className="text-4xl">📚</span>
                <h3 className="text-base font-black text-slate-900 dark:text-white">No saved notes matching your search</h3>
                <p className="text-xs text-[var(--muted)] max-w-sm mx-auto">
                  Try adjusting your keywords or click &quot;Add Personal Note / Snippet&quot; to create a new entry.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedFolder("All");
                  }}
                  className="button button-sm text-xs font-bold mx-auto mt-2"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {filteredBookmarks.map((bm, index) => {
                  const currentLang = selectedLanguage[bm.id] || "Java";
                  const folder = folderAssignments[bm.id] || "Architecture";
                  const isMenuOpen = activeMenuId === bm.id;

                  return (
                    <article
                      key={bm.id}
                      className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between"
                    >
                      <div className="p-5 sm:p-6 space-y-4">
                        {/* Top Row: Icon + Badge + Date + Three-dots Menu */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            {/* Blue Square </> Icon */}
                            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center font-mono font-bold text-sm shrink-0 shadow-2xs">
                              &lt;/&gt;
                            </div>
                            {/* Code Snippet Badge */}
                            <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-800/60 text-xs font-extrabold tracking-tight shadow-2xs">
                              Code Snippet
                            </span>
                          </div>

                          <div className="flex items-center gap-2 relative">
                            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1">
                              <span>📅</span> {bm.createdAt || "Oct 5, 2026"}
                            </span>

                            {/* Three Dots Menu Button */}
                            <button
                              type="button"
                              onClick={() => setActiveMenuId(isMenuOpen ? null : bm.id)}
                              className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center font-bold text-sm cursor-pointer"
                              title="Options"
                            >
                              ⋮
                            </button>

                            {/* Dropdown Menu */}
                            {isMenuOpen && (
                              <div className="absolute right-0 top-8 z-30 w-44 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl py-1 text-xs">
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleCopySnippet(bm.id, bm.snippet);
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700/60 flex items-center gap-2"
                                >
                                  <span>📋</span> Copy Snippet
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setShowMoveModal({ id: bm.id, currentFolder: folder });
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700/60 flex items-center gap-2"
                                >
                                  <span>📁</span> Move to Folder...
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    removeBookmark(bm.id);
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full text-left px-3 py-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 font-bold"
                                >
                                  <span>🗑️</span> Delete Note
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Title & Description Note */}
                        <div className="space-y-1.5">
                          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug tracking-tight">
                            {bm.lessonTitle}
                          </h2>
                          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                            {bm.noteText}
                          </p>
                        </div>

                        {/* Tags Row + Copy Code Action */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                          {/* Tags Pills */}
                          <div className="flex flex-wrap items-center gap-1.5">
                            {(bm.tags && bm.tags.length > 0 ? bm.tags : ["Architecture", "LangGraph", "AI"]).map((tag) => (
                              <button
                                key={tag}
                                type="button"
                                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                                className={`px-2.5 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                  selectedTag === tag
                                    ? "bg-blue-600 text-white shadow-2xs"
                                    : "bg-blue-50/80 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/40 hover:bg-blue-100"
                                }`}
                              >
                                #{tag}
                              </button>
                            ))}
                          </div>

                          {/* Quick Copy Code Text Link */}
                          {bm.snippet && (
                            <button
                              type="button"
                              onClick={() => handleCopySnippet(bm.id, bm.snippet)}
                              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer shrink-0"
                            >
                              <span>📋</span>
                              <span>{copiedSnippetId === bm.id ? "Copied!" : "Copy Code"}</span>
                            </button>
                          )}
                        </div>

                        {/* ================= EMBEDDED DARK IDE CODE BLOCK ================= */}
                        {bm.snippet && (
                          <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-inner text-xs font-mono">
                            {/* Code Window Header Bar */}
                            <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-slate-400">
                              {/* Left: Language Indicator Dropdown */}
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <select
                                  value={currentLang}
                                  onChange={(e) =>
                                    setSelectedLanguage((prev) => ({
                                      ...prev,
                                      [bm.id]: e.target.value,
                                    }))
                                  }
                                  className="bg-transparent text-slate-300 font-bold text-xs focus:outline-none cursor-pointer"
                                >
                                  <option value="Java" className="bg-slate-900 text-white">Java</option>
                                  <option value="TypeScript" className="bg-slate-900 text-white">TypeScript</option>
                                  <option value="Python" className="bg-slate-900 text-white">Python</option>
                                  <option value="Rust" className="bg-slate-900 text-white">Rust</option>
                                </select>
                              </div>

                              {/* Right: Copy & Fullscreen Controls */}
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleCopySnippet(bm.id, bm.snippet)}
                                  className="px-2 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] font-sans font-bold flex items-center gap-1 transition-colors"
                                  title="Copy snippet"
                                >
                                  <span>📋</span>
                                  <span>{copiedSnippetId === bm.id ? "Copied" : "Copy"}</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setFullscreenSnippet({
                                      title: bm.lessonTitle,
                                      code: bm.snippet || "",
                                      language: currentLang,
                                    })
                                  }
                                  className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                                  title="Expand Fullscreen"
                                >
                                  ⛶
                                </button>
                              </div>
                            </div>

                            {/* Code Lines with Line Numbers */}
                            <div className="p-4 overflow-x-auto flex">
                              {/* Line Numbers Column */}
                              <div className="pr-3 mr-3 border-r border-slate-800 text-slate-600 select-none text-right flex flex-col font-mono text-[11px] leading-relaxed">
                                {bm.snippet.trim().split("\n").map((_, i) => (
                                  <span key={i}>{i + 1}</span>
                                ))}
                              </div>

                              {/* Highlighted Code Text */}
                              <div className="flex flex-col text-[11px] leading-relaxed font-mono whitespace-pre flex-1">
                                {formatSyntax(bm.snippet)}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Card Footer Action Bar */}
                      <div className="px-5 sm:px-6 py-3.5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40 flex flex-wrap items-center justify-between gap-3 text-xs">
                        {/* Folder Indicator */}
                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-semibold">
                          <span>📁</span>
                          <span>Added to:</span>
                          <span className="font-extrabold text-slate-900 dark:text-white">{folder}</span>
                        </div>

                        {/* Action Buttons: Edit, Move to, Delete */}
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setShowEditModal(bm)}
                            className="font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 cursor-pointer"
                          >
                            <span>✏️</span> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowMoveModal({ id: bm.id, currentFolder: folder })}
                            className="font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 cursor-pointer"
                          >
                            <span>📁</span> Move to...
                          </button>
                          <button
                            type="button"
                            onClick={() => removeBookmark(bm.id)}
                            className="font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
                          >
                            <span>🗑️</span> Delete
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. REVISION FLASHCARDS TAB (MATCHING REVISION CARD WITH INTERACTIVE ACCORDION) */}
        {/* ========================================================================= */}
        {activeTab === "flashcards" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {filteredFlashcards.map((fc) => {
                const isRevealed = revealedCardIds[fc.id];
                const folder = folderAssignments[fc.id] || "React";

                return (
                  <article
                    key={fc.id}
                    className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between"
                  >
                    <div className="p-5 sm:p-6 space-y-4">
                      {/* Top Row: Icon + Badge + Date + Three-dots Menu */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          {/* Purple Square Stacked Layers Icon */}
                          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center justify-center font-bold text-lg shrink-0 shadow-2xs">
                            🗂️
                          </div>
                          {/* Revision Card Badge */}
                          <span className="px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200/80 dark:border-purple-800/60 text-xs font-extrabold tracking-tight shadow-2xs">
                            Revision Card
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1">
                            <span>📅</span> Oct 6, 2026
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleFlashcardMastered(fc.id)}
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              fc.mastered
                                ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                            }`}
                          >
                            {fc.mastered ? "✓ Mastered" : "Active Recall"}
                          </button>
                        </div>
                      </div>

                      {/* Title & Description Note */}
                      <div className="space-y-1.5">
                        <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug tracking-tight">
                          {fc.front}
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                          Active recall benchmark card targeting core design principles and architectural trade-offs.
                        </p>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-purple-50/80 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200/60 dark:border-purple-800/40">
                          #{fc.category}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/40">
                          #Revision
                        </span>
                        <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-blue-50/80 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/40">
                          #Full-Stack
                        </span>
                      </div>

                      {/* ================= INTERACTIVE FLASHCARD QUESTION & ANSWER BOX ================= */}
                      <div className="rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-800/40 p-4 transition-all">
                        <div className="flex items-center justify-between gap-4">
                          {/* Lightning Icon + Question */}
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center text-lg shrink-0 shadow-2xs">
                              ⚡
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white leading-snug">
                                {fc.front}
                              </h3>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                                {isRevealed ? "Verified Answer:" : "Click to reveal answer..."}
                              </p>
                            </div>
                          </div>

                          {/* Show / Hide Answer Button */}
                          <button
                            type="button"
                            onClick={() => toggleReveal(fc.id)}
                            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all shrink-0 cursor-pointer whitespace-nowrap"
                          >
                            <span>{isRevealed ? "🙈" : "👁"}</span>
                            <span>{isRevealed ? "Hide Answer" : "Show Answer"}</span>
                          </button>
                        </div>

                        {/* Revealed Content Drawer */}
                        {isRevealed && (
                          <div className="mt-3 pt-3 border-t border-purple-200/60 dark:border-purple-800/40 animate-fade-in">
                            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-mono bg-white/70 dark:bg-slate-900/60 p-3 rounded-xl border border-purple-100 dark:border-purple-900/40">
                              {fc.back}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Footer Action Bar */}
                    <div className="px-5 sm:px-6 py-3.5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40 flex flex-wrap items-center justify-between gap-3 text-xs">
                      {/* Folder Indicator */}
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-semibold">
                        <span>📁</span>
                        <span>Added to:</span>
                        <span className="font-extrabold text-slate-900 dark:text-white">{folder}</span>
                      </div>

                      {/* Action Buttons: Edit, Move to, Delete */}
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => toggleFlashcardMastered(fc.id)}
                          className="font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 cursor-pointer"
                        >
                          <span>{fc.mastered ? "✓ Mastered" : "Mark Mastered"}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowMoveModal({ id: fc.id, currentFolder: folder })}
                          className="font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 cursor-pointer"
                        >
                          <span>📁</span> Move to...
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. COLLECTIONS / FOLDERS VIEW TAB                                        */}
        {/* ========================================================================= */}
        {activeTab === "collections" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {availableFolders.map((folder) => {
                const notesInFolder = bookmarks.filter((bm) => (folderAssignments[bm.id] || "Architecture") === folder);
                const flashcardsInFolder = flashcards.filter((fc) => (folderAssignments[fc.id] || "React") === folder);

                return (
                  <div
                    key={folder}
                    onClick={() => {
                      setSelectedFolder(folder);
                      setActiveTab("snippets");
                    }}
                    className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between h-44"
                  >
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-2xl shadow-2xs">
                        📁
                      </div>
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                        Explore →
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-black text-slate-900 dark:text-white">{folder}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {notesInFolder.length} Code Snippets • {flashcardsInFolder.length} Flashcards
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 6. BOTTOM MOTIVATIONAL PROGRESS & STATS BAR (MATCHING REFERENCE FOOTER)  */}
        {/* ========================================================================= */}
        <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-5 transition-all">
          
          {/* Left: Quick Counts Pills */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {/* Total Items */}
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-base shrink-0">
                ⭐
              </span>
              <div>
                <p className="text-base font-black text-slate-900 dark:text-white leading-tight">
                  {bookmarks.length + flashcards.length}
                </p>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Items</p>
              </div>
            </div>

            {/* Notes */}
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-base shrink-0">
                🔖
              </span>
              <div>
                <p className="text-base font-black text-slate-900 dark:text-white leading-tight">
                  {bookmarks.length}
                </p>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Notes</p>
              </div>
            </div>

            {/* Flashcards */}
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center text-base shrink-0">
                🗂️
              </span>
              <div>
                <p className="text-base font-black text-slate-900 dark:text-white leading-tight">
                  {flashcards.length}
                </p>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Flashcards</p>
              </div>
            </div>
          </div>

          {/* Middle: Keep Going Motivational Progress */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 pt-3 lg:pt-0 lg:pl-6">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🏆</span>
              <div>
                <p className="text-xs font-black text-slate-900 dark:text-white">Keep going!</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">You&apos;re building great learning habits.</p>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="flex items-center gap-3">
              <div className="w-40 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 transition-all duration-500"
                  style={{ width: "75%" }}
                />
              </div>
              <span className="text-xs font-black text-slate-900 dark:text-white font-mono">75%</span>
            </div>
          </div>

          {/* Right: View All Button */}
          <div className="flex justify-end pt-2 lg:pt-0">
            <button
              type="button"
              onClick={() => {
                setActiveTab("snippets");
                setSelectedFolder("All");
                setSearchQuery("");
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-extrabold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>View All</span>
              <span>&gt;</span>
            </button>
          </div>

        </section>

      </main>

      {/* ========================================================================= */}
      {/* 7. MODALS: ADD NOTE, MOVE TO FOLDER, FULLSCREEN CODE VIEW                */}
      {/* ========================================================================= */}
      {/* ADD PERSONAL NOTE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="max-w-xl w-full p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--border-soft)] pb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center text-sm font-black">
                  ＋
                </span>
                <h3 className="text-base sm:text-lg font-black text-[var(--text)]">
                  Add Personal Note / Snippet
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full hover:bg-[var(--surface-soft)] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1.5 text-[var(--text)]">Title / Topic Header</label>
                <input
                  required
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Introduction to Agentic Architectures vs Traditional LLM Calls"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs font-medium text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1.5 text-[var(--text)]">Collection / Folder</label>
                  <select
                    value={newFolder}
                    onChange={(e) => setNewFolder(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs font-bold text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    {availableFolders.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1.5 text-[var(--text)]">Programming Language</label>
                  <select
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs font-bold text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="Java">Java</option>
                    <option value="TypeScript">TypeScript</option>
                    <option value="Python">Python</option>
                    <option value="Rust">Rust</option>
                    <option value="Go">Go</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1.5 text-[var(--text)]">Note Explanation / Takeaway</label>
                <textarea
                  rows={2}
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Key concept: Autonomous Agent cycle operates in Perception -> Planning..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs font-medium text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold mb-1.5 text-[var(--text)]">Code Snippet (Optional)</label>
                <textarea
                  rows={4}
                  value={newSnippet}
                  onChange={(e) => setNewSnippet(e.target.value)}
                  placeholder="// Paste your code snippet here..."
                  className="w-full p-3 rounded-xl bg-slate-950 text-blue-300 font-mono text-[11px] border border-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-bold mb-1.5 text-[var(--text)]">Tags (Comma separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="Architecture, LangGraph, AI"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs font-medium text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[var(--border-soft)]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl font-bold bg-[var(--surface-soft)] text-[var(--text)] hover:bg-[var(--surface)] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md shadow-purple-600/25 transition-all cursor-pointer"
                >
                  Save to Notes Hub
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MOVE TO FOLDER MODAL */}
      {showMoveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="max-w-sm w-full p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl space-y-4">
            <h3 className="text-base font-black text-[var(--text)]">Select Collection / Folder</h3>
            <p className="text-xs text-[var(--muted)]">Organize this item into a dedicated learning category:</p>

            <div className="space-y-2 pt-1">
              {availableFolders.map((folder) => (
                <button
                  key={folder}
                  type="button"
                  onClick={() => handleConfirmMove(showMoveModal.id, folder)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-between cursor-pointer ${
                    showMoveModal.currentFolder === folder
                      ? "bg-purple-50 dark:bg-purple-950/40 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300"
                      : "bg-[var(--surface-soft)] border-[var(--border-soft)] text-[var(--text)] hover:border-slate-300"
                  }`}
                >
                  <span>📁 {folder}</span>
                  {showMoveModal.currentFolder === folder && <span>✓ Current</span>}
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowMoveModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[var(--surface-soft)] text-[var(--text)]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN CODE SNIPPET MODAL */}
      {fullscreenSnippet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="max-w-4xl w-full rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-sm font-bold text-white font-mono">{fullscreenSnippet.title}</h3>
                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-mono">
                  {fullscreenSnippet.language}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(fullscreenSnippet.code);
                    setCopiedSnippetId("fullscreen");
                    setTimeout(() => setCopiedSnippetId(null), 2000);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <span>📋</span>
                  <span>{copiedSnippetId === "fullscreen" ? "Copied!" : "Copy Code"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFullscreenSnippet(null)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-sm font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 overflow-auto font-mono text-xs leading-relaxed flex flex-1">
              <div className="pr-4 mr-4 border-r border-slate-800 text-slate-600 select-none text-right flex flex-col font-mono text-xs">
                {fullscreenSnippet.code.trim().split("\n").map((_, i) => (
                  <span key={i}>{i + 1}</span>
                ))}
              </div>
              <div className="flex flex-col whitespace-pre flex-1">
                {formatSyntax(fullscreenSnippet.code)}
              </div>
            </div>
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}
