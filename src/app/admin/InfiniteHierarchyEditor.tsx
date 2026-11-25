import { useState } from "react";
import { type HierarchyItem, type QuizQuestion, type CourseResource, type ChapterTimestamp } from "../context/CourseContext";

interface InfiniteHierarchyEditorProps {
  items: HierarchyItem[];
  onChange: (items: HierarchyItem[]) => void;
}

export default function InfiniteHierarchyEditor({ items, onChange }: InfiniteHierarchyEditorProps) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(items[0]?.id || null);
  const [expandedNodeIds, setExpandedNodeIds] = useState<Set<string>>(new Set([items[0]?.id || ""]));
  const [activeTab, setActiveTab] = useState<"theory" | "video" | "lab" | "quizzes" | "flashcards" | "resources" | "preview">("theory");

  // Toggle expand/collapse of tree node
  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNodeIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Helper to find node by ID in recursive tree
  const findNode = (nodes: HierarchyItem[], id: string): HierarchyItem | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNode(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  // Helper to mutate node in recursive tree
  const updateNodeRecursive = (
    nodes: HierarchyItem[],
    id: string,
    updater: (target: HierarchyItem) => HierarchyItem
  ): HierarchyItem[] => {
    return nodes.map((node) => {
      if (node.id === id) {
        return updater({ ...node });
      }
      if (node.children) {
        return {
          ...node,
          children: updateNodeRecursive(node.children, id, updater)
        };
      }
      return node;
    });
  };

  // Helper to delete node from recursive tree
  const deleteNodeRecursive = (nodes: HierarchyItem[], id: string): HierarchyItem[] => {
    return nodes
      .filter((n) => n.id !== id)
      .map((node) => ({
        ...node,
        children: node.children ? deleteNodeRecursive(node.children, id) : []
      }));
  };

  // Helper to add child node (Infinite Nesting)
  const handleAddChild = (parentId: string, childType: HierarchyItem["type"] = "submodule") => {
    const newChildId = `node-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newChild: HierarchyItem = {
      id: newChildId,
      title: childType === "quiz" ? "Assessment Checkpoint" : childType === "video" ? "Video Lecture" : childType === "reading" ? "Cisco Theory Reading" : "New Submodule / Topic",
      type: childType,
      duration: "20 min",
      summary: "In-depth concept breakdown, operational guidelines, and architectural verification.",
      notes: `# Architecture & Theory\n\n### Overview\nDeep dive into this concept with step-by-step documentation.\n\n> 💡 **Cisco Best Practice**: Always validate state invariant properties before committing transactions.\n\n\`\`\`typescript\n// Implementation Blueprint\nfunction handleStateTransition(payload: any) {\n  console.log("State verified:", payload);\n}\n\`\`\``,
      videoUrl: childType === "video" ? "https://www.youtube-nocookie.com/embed/aircAruvnKk" : undefined,
      transcript: "In this module, we dissect real-time execution flows and examine core architectural constraints in modern cloud environments.",
      timestamps: [
        { time: "00:00", seconds: 0, label: "Topic Introduction" },
        { time: "05:15", seconds: 315, label: "Core Protocol & State Flow" },
        { time: "12:40", seconds: 760, label: "Interactive Code Walkthrough" },
      ],
      codeSnippet: `// Live Code Walkthrough\nfunction executeWorkflow() {\n  return { status: "Verified", passedTests: 5 };\n}\nconsole.log(executeWorkflow());`,
      labObjective: "Implement the required handler function and execute the test harness to pass all 5 verification suites.",
      expectedOutput: "Status: Verified | 5/5 tests passed.",
      quizzes: [],
      resources: [
        { id: "res-1", name: "Architecture Diagram PDF", type: "pdf", size: "1.6 MB" }
      ],
      flashcards: [
        { front: "Key Architectural Term", back: "Core definition and production best practices." }
      ],
      children: []
    };

    const updated = updateNodeRecursive(items, parentId, (parent) => ({
      ...parent,
      children: [...(parent.children || []), newChild]
    }));

    setExpandedNodeIds((prev) => new Set(prev).add(parentId));
    setSelectedItemId(newChildId);
    onChange(updated);
  };

  // Add Top-level root module
  const handleAddRootModule = () => {
    const newModuleId = `mod-${Date.now()}`;
    const newModule: HierarchyItem = {
      id: newModuleId,
      title: `Module ${items.length + 1}: Core System Architecture`,
      type: "module",
      duration: "3.5 Hours",
      summary: "Foundational architecture, distributed protocol patterns, and hands-on labs.",
      notes: "# Module Overview\n\nComprehensive exploration of core architecture and protocol design.",
      quizzes: [],
      children: []
    };
    const updated = [...items, newModule];
    setSelectedItemId(newModuleId);
    onChange(updated);
  };

  // Delete node
  const handleDeleteNode = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (items.length === 1 && items[0].id === id) {
      alert("A course must have at least one root module.");
      return;
    }
    const updated = deleteNodeRecursive(items, id);
    onChange(updated);
    if (selectedItemId === id) {
      setSelectedItemId(updated[0]?.id || null);
    }
  };

  // Edit fields of currently selected node
  const handleFieldChange = (field: keyof HierarchyItem, value: any) => {
    if (!selectedItemId) return;
    const updated = updateNodeRecursive(items, selectedItemId, (node) => ({
      ...node,
      [field]: value
    }));
    onChange(updated);
  };

  // Helper to insert markdown templates into notes
  const handleInsertTemplate = (snippet: string) => {
    if (!selectedNode) return;
    const current = selectedNode.notes || "";
    handleFieldChange("notes", current + "\n\n" + snippet);
  };

  // Multi-Quiz Handlers for selected node
  const handleAddQuizToSelected = () => {
    if (!selectedItemId) return;
    const selected = findNode(items, selectedItemId);
    if (!selected) return;

    const newQuiz: QuizQuestion = {
      id: `quiz-${Date.now()}`,
      question: "Which invariant guarantees atomic state transition across concurrent nodes?",
      options: [
        "Distributed consensus with Raft log replication and memory barriers",
        "Single-threaded asynchronous JavaScript event loops",
        "Writing unindexed JSON strings directly to localStorage",
        "Disabling network checksum verifications"
      ],
      correctIndex: 0,
      explanation: "Raft consensus ensures atomic leader-follower log replication before committing state transitions to storage engines.",
      points: 50
    };

    const updatedQuizzes = [...(selected.quizzes || []), newQuiz];
    handleFieldChange("quizzes", updatedQuizzes);
  };

  const handleUpdateQuiz = (quizIndex: number, updatedQuiz: QuizQuestion) => {
    if (!selectedItemId) return;
    const selected = findNode(items, selectedItemId);
    if (!selected || !selected.quizzes) return;

    const newQuizzes = [...selected.quizzes];
    newQuizzes[quizIndex] = updatedQuiz;
    handleFieldChange("quizzes", newQuizzes);
  };

  const handleDeleteQuiz = (quizIndex: number) => {
    if (!selectedItemId) return;
    const selected = findNode(items, selectedItemId);
    if (!selected || !selected.quizzes) return;

    const newQuizzes = selected.quizzes.filter((_, idx) => idx !== quizIndex);
    handleFieldChange("quizzes", newQuizzes);
  };

  // Timestamps handler
  const handleAddTimestamp = () => {
    if (!selectedNode) return;
    const currentTs = selectedNode.timestamps || [];
    const newTs: ChapterTimestamp = {
      time: "00:00",
      seconds: 0,
      label: `Chapter ${currentTs.length + 1}`
    };
    handleFieldChange("timestamps", [...currentTs, newTs]);
  };

  // Flashcards handler
  const handleAddFlashcard = () => {
    if (!selectedNode) return;
    const currentFc = selectedNode.flashcards || [];
    handleFieldChange("flashcards", [
      ...currentFc,
      { front: "New Concept Term", back: "Detailed definition, trade-offs, and invariants." }
    ]);
  };

  // Resource handler
  const handleAddResource = () => {
    if (!selectedNode) return;
    const currentRes = selectedNode.resources || [];
    const newRes: CourseResource = {
      id: `res-${Date.now()}`,
      name: "New Architecture Reference Guide",
      type: "pdf",
      size: "1.5 MB"
    };
    handleFieldChange("resources", [...currentRes, newRes]);
  };

  // Count total stats recursively
  const getHierarchyStats = (nodes: HierarchyItem[]) => {
    let totalNodes = 0;
    let totalQuizzes = 0;
    let maxDepth = 0;

    const traverse = (list: HierarchyItem[], depth: number) => {
      if (depth > maxDepth) maxDepth = depth;
      for (const item of list) {
        totalNodes++;
        if (item.quizzes) totalQuizzes += item.quizzes.length;
        if (item.children && item.children.length > 0) {
          traverse(item.children, depth + 1);
        }
      }
    };

    traverse(nodes, 1);
    return { totalNodes, totalQuizzes, maxDepth };
  };

  const stats = getHierarchyStats(items);
  const selectedNode = selectedItemId ? findNode(items, selectedItemId) : null;

  // Recursive Tree Node Renderer
  const renderTreeNodes = (nodes: HierarchyItem[], depth = 0) => {
    return (
      <div className="space-y-1">
        {nodes.map((node) => {
          const isSelected = node.id === selectedItemId;
          const isExpanded = expandedNodeIds.has(node.id);
          const hasChildren = node.children && node.children.length > 0;
          const quizCount = node.quizzes?.length || 0;

          const typeIcon =
            node.type === "video"
              ? "🎥"
              : node.type === "reading"
              ? "📄"
              : node.type === "lab" || node.type === "exercise"
              ? "🔬"
              : node.type === "quiz"
              ? "🧠"
              : depth === 0
              ? "📁"
              : "📂";

          return (
            <div key={node.id} className="space-y-1">
              <div
                onClick={() => setSelectedItemId(node.id)}
                style={{ paddingLeft: `${Math.max(12, depth * 20)}px` }}
                className={`group flex items-center justify-between py-2 pr-2.5 rounded-xl cursor-pointer transition-all border ${
                  isSelected
                    ? "bg-purple-600/15 border-purple-500/60 text-[var(--text)] shadow-sm ring-1 ring-purple-500/25"
                    : "bg-[var(--surface)] hover:bg-[var(--surface-soft)] border-[var(--border-soft)] text-[var(--muted)]"
                }`}
              >
                {/* Node Title & Icon */}
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {hasChildren ? (
                    <button
                      onClick={(e) => toggleExpand(node.id, e)}
                      className="w-4 h-4 rounded flex items-center justify-center text-[10px] text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-soft)] cursor-pointer"
                    >
                      {isExpanded ? "▼" : "▶"}
                    </button>
                  ) : (
                    <span className="w-4 text-center text-[10px] opacity-40">•</span>
                  )}

                  <span className="text-xs shrink-0">{typeIcon}</span>

                  <span className={`text-xs truncate font-bold ${isSelected ? "text-purple-400 font-black" : "text-[var(--text)]"}`}>
                    {node.title}
                  </span>

                  {quizCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-md bg-amber-500/20 text-amber-400 text-[10px] font-black shrink-0">
                      🧠 {quizCount}
                    </span>
                  )}
                </div>

                {/* Quick Action Buttons on Hover */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddChild(node.id, "submodule");
                    }}
                    title="Add Nested Submodule"
                    className="p-1 rounded-md bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 text-[10px] font-bold"
                  >
                    + Sub
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddChild(node.id, "quiz");
                    }}
                    title="Add Quiz"
                    className="p-1 rounded-md bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 text-[10px] font-bold"
                  >
                    + Quiz
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleDeleteNode(node.id, e)}
                    title="Delete"
                    className="p-1 rounded-md bg-rose-500/20 hover:bg-rose-500/40 text-rose-400 text-[10px]"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Recursive Children */}
              {hasChildren && isExpanded && (
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-purple-500/20 pointer-events-none" />
                  {renderTreeNodes(node.children!, depth + 1)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Top Hierarchy Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border-soft)] text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 font-bold text-[var(--text)]">
            <span>🌳 Cisco-Grade Curriculum Hierarchy:</span>
            <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 font-black">
              {stats.totalNodes} Nodes
            </span>
          </div>
          <span className="text-[var(--muted)] hidden sm:inline">•</span>
          <span className="text-[var(--muted)]">
            Max Depth: <strong>{stats.maxDepth} Levels</strong>
          </span>
          <span className="text-[var(--muted)] hidden sm:inline">•</span>
          <span className="text-amber-400 font-bold">🧠 Quizzes: {stats.totalQuizzes} Attached</span>
        </div>

        <button
          type="button"
          onClick={handleAddRootModule}
          className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shadow flex items-center gap-1.5 cursor-pointer"
        >
          <span>➕</span> Add Root Module
        </button>
      </div>

      {/* Grid: Left Tree Navigation (5 cols) + Right Selected Node Cisco Studio (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Interactive Tree View (5 cols) */}
        <div className="lg:col-span-5 p-4 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border-soft)]">
            <h3 className="text-xs font-black uppercase tracking-wider text-[var(--accent)] flex items-center gap-1.5">
              <span>🌲</span> Curriculum Tree (Infinite Nesting)
            </h3>
            <span className="text-[10px] text-[var(--muted)]">Click node to configure</span>
          </div>

          <div className="max-h-[600px] overflow-y-auto pr-1 space-y-1">
            {renderTreeNodes(items)}
          </div>
        </div>

        {/* Right: Selected Node Properties & Cisco Multi-Format Studio (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {selectedNode ? (
            <div className="p-5 sm:p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] shadow-xl space-y-5">
              {/* Header: Node Type & Title + Nested Submodule Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-soft)] pb-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
                      Format: {selectedNode.type}
                    </span>
                    <span className="text-xs text-[var(--muted)] font-mono">{selectedNode.duration || "20 min"}</span>
                  </div>
                  <h3 className="text-base font-black text-[var(--text)] mt-1">{selectedNode.title}</h3>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleAddChild(selectedNode.id, "submodule")}
                    className="px-2.5 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 font-bold text-xs border border-purple-500/30 flex items-center gap-1 cursor-pointer"
                  >
                    <span>➕</span> Nest Submodule
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteNode(selectedNode.id)}
                    className="px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs border border-rose-500/30 cursor-pointer"
                  >
                    Delete Node
                  </button>
                </div>
              </div>

              {/* Node Basic Info Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-[var(--muted)] mb-1">Topic Title:</label>
                  <input
                    type="text"
                    value={selectedNode.title}
                    onChange={(e) => handleFieldChange("title", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border-soft)] text-[var(--text)] font-semibold outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[var(--muted)] mb-1">Content Type:</label>
                  <select
                    value={selectedNode.type}
                    onChange={(e) => handleFieldChange("type", e.target.value as any)}
                    className="w-full px-3 py-1.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border-soft)] text-[var(--text)] font-bold outline-none cursor-pointer"
                  >
                    <option value="module">📁 Root Module</option>
                    <option value="submodule">📂 Submodule</option>
                    <option value="video">🎥 Video Lecture</option>
                    <option value="reading">📄 Cisco Reading / Theory</option>
                    <option value="quiz">🧠 Assessment Quiz</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label className="block font-bold text-[var(--muted)] mb-1">Learning Objective / Summary:</label>
                  <input
                    type="text"
                    value={selectedNode.summary || ""}
                    onChange={(e) => handleFieldChange("summary", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border-soft)] text-[var(--text)] outline-none focus:border-purple-500"
                    placeholder="Brief description of skills mastered in this topic..."
                  />
                </div>
              </div>

              {/* Cisco Multi-Format Studio Tabs */}
              <div className="border border-[var(--border-soft)] rounded-2xl overflow-hidden bg-[var(--surface-soft)]/50">
                <div className="flex border-b border-[var(--border-soft)] bg-[var(--surface)] overflow-x-auto no-scrollbar text-xs">
                  {[
                    { id: "theory", label: "📄 Theory / Reading" },
                    { id: "video", label: "🎥 Video & Chapters" },
                    { id: "quizzes", label: `🧠 Quizzes (${selectedNode.quizzes?.length || 0})` },
                    { id: "flashcards", label: `💡 Flashcards (${selectedNode.flashcards?.length || 0})` },
                    { id: "resources", label: `📑 Resources (${selectedNode.resources?.length || 0})` },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-3 py-2 font-bold transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
                        activeTab === tab.id
                          ? "border-purple-500 text-purple-400 bg-[var(--surface-soft)]"
                          : "border-transparent text-[var(--muted)] hover:text-[var(--text)]"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="p-4 space-y-4">
                  {/* TAB 1: THEORY / READING EDITOR */}
                  {activeTab === "theory" && (
                    <div className="space-y-3">
                      {/* Cisco Markdown Template Helper Toolbar */}
                      <div className="flex items-center gap-1.5 flex-wrap pb-2 border-b border-[var(--border-soft)] text-[10px]">
                        <span className="font-bold text-[var(--muted)] mr-1">Insert Cisco Format:</span>
                        <button
                          type="button"
                          onClick={() => handleInsertTemplate("> 💡 **Cisco Best Practice**: Always set verification timeouts <= 30s.")}
                          className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold hover:bg-indigo-500/30 cursor-pointer"
                        >
                          + Pro-Tip Callout
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInsertTemplate("> ⚠️ **Warning**: Never disable memory barriers in distributed clusters.")}
                          className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold hover:bg-amber-500/30 cursor-pointer"
                        >
                          + Warning Callout
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInsertTemplate("| Step | Invariant | SLA |\n| --- | --- | --- |\n| Ingest | Sanitized | <10ms |")}
                          className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold hover:bg-purple-500/30 cursor-pointer"
                        >
                          + Protocol Table
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInsertTemplate("```typescript\n// Implementation\nconst result = verifyInvariants();\n```")}
                          className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold hover:bg-emerald-500/30 cursor-pointer"
                        >
                          + Code Block
                        </button>
                      </div>

                      <textarea
                        rows={10}
                        value={selectedNode.notes || ""}
                        onChange={(e) => handleFieldChange("notes", e.target.value)}
                        className="w-full p-3.5 rounded-xl font-mono text-xs bg-[var(--surface)] text-[var(--text)] border border-[var(--border-soft)] focus:outline-none focus:border-purple-500 leading-relaxed"
                        placeholder="Write Cisco-style markdown documentation, theory, diagrams..."
                      />
                    </div>
                  )}

                  {/* TAB 2: VIDEO & CHAPTERS */}
                  {activeTab === "video" && (
                    <div className="space-y-4 text-xs">
                      <div>
                        <label className="block font-bold text-[var(--muted)] mb-1">Video Embed URL (YouTube/Vimeo/Loom):</label>
                        <input
                          type="text"
                          value={selectedNode.videoUrl || ""}
                          onChange={(e) => handleFieldChange("videoUrl", e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-[var(--surface)] border border-[var(--border-soft)] text-[var(--text)] font-mono outline-none"
                          placeholder="https://www.youtube-nocookie.com/embed/..."
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="font-bold text-[var(--muted)]">Chapter Timestamps:</label>
                          <button
                            type="button"
                            onClick={handleAddTimestamp}
                            className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold text-[10px] cursor-pointer"
                          >
                            + Add Timestamp
                          </button>
                        </div>
                        <div className="space-y-2">
                          {selectedNode.timestamps?.map((ts, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={ts.time}
                                onChange={(e) => {
                                  const updated = [...(selectedNode.timestamps || [])];
                                  updated[idx] = { ...updated[idx], time: e.target.value };
                                  handleFieldChange("timestamps", updated);
                                }}
                                className="w-20 px-2 py-1 rounded bg-[var(--surface)] border border-[var(--border-soft)] font-mono text-center"
                                placeholder="00:00"
                              />
                              <input
                                type="text"
                                value={ts.label}
                                onChange={(e) => {
                                  const updated = [...(selectedNode.timestamps || [])];
                                  updated[idx] = { ...updated[idx], label: e.target.value };
                                  handleFieldChange("timestamps", updated);
                                }}
                                className="flex-1 px-2 py-1 rounded bg-[var(--surface)] border border-[var(--border-soft)]"
                                placeholder="Chapter Label"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-[var(--muted)] mb-1">Transcript Text:</label>
                        <textarea
                          rows={4}
                          value={selectedNode.transcript || ""}
                          onChange={(e) => handleFieldChange("transcript", e.target.value)}
                          className="w-full p-2.5 rounded-lg bg-[var(--surface)] border border-[var(--border-soft)] text-xs leading-relaxed"
                          placeholder="Searchable transcript text..."
                        />
                      </div>
                    </div>
                  )}



                  {/* TAB 4: QUIZZES */}
                  {activeTab === "quizzes" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                          <span>🧠</span> Attached Quizzes ({selectedNode.quizzes?.length || 0})
                        </h4>
                        <button
                          type="button"
                          onClick={handleAddQuizToSelected}
                          className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-black text-xs border border-amber-500/40 flex items-center gap-1 cursor-pointer"
                        >
                          <span>➕ Add Question</span>
                        </button>
                      </div>

                      {(!selectedNode.quizzes || selectedNode.quizzes.length === 0) ? (
                        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-dashed border-[var(--border)] text-center text-xs text-[var(--muted)]">
                          No quizzes attached to this submodule yet. Click "+ Add Question" above.
                        </div>
                      ) : (
                        <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                          {selectedNode.quizzes.map((quiz, qIdx) => (
                            <div key={quiz.id || qIdx} className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border-soft)] space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
                                  Question #{qIdx + 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteQuiz(qIdx)}
                                  className="text-xs text-rose-400 hover:text-rose-300 font-bold cursor-pointer"
                                >
                                  ✕ Remove
                                </button>
                              </div>

                              <div>
                                <label className="block text-[11px] font-bold text-[var(--muted)] mb-1">Question Statement:</label>
                                <input
                                  type="text"
                                  value={quiz.question}
                                  onChange={(e) => {
                                    handleUpdateQuiz(qIdx, { ...quiz, question: e.target.value });
                                  }}
                                  className="w-full px-3 py-1.5 rounded-lg bg-[var(--surface-soft)] border border-[var(--border-soft)] text-xs text-[var(--text)] font-semibold outline-none"
                                />
                              </div>

                              {/* Options */}
                              <div className="space-y-2">
                                <label className="block text-[11px] font-bold text-[var(--muted)]">Options (Radio to pick correct answer):</label>
                                {quiz.options.map((opt, optIdx) => (
                                  <div key={optIdx} className="flex items-center gap-2">
                                    <input
                                      type="radio"
                                      name={`correct-${quiz.id || qIdx}`}
                                      checked={quiz.correctIndex === optIdx}
                                      onChange={() => handleUpdateQuiz(qIdx, { ...quiz, correctIndex: optIdx })}
                                      className="accent-purple-500 w-3.5 h-3.5 cursor-pointer"
                                    />
                                    <input
                                      type="text"
                                      value={opt}
                                      onChange={(e) => {
                                        const newOptions = [...quiz.options];
                                        newOptions[optIdx] = e.target.value;
                                        handleUpdateQuiz(qIdx, { ...quiz, options: newOptions });
                                      }}
                                      className="flex-1 px-2.5 py-1 rounded-lg bg-[var(--surface-soft)] border border-[var(--border-soft)] text-xs text-[var(--text)] outline-none"
                                    />
                                  </div>
                                ))}
                              </div>

                              <div>
                                <label className="block text-[11px] font-bold text-[var(--muted)] mb-1">Explanation & Justification:</label>
                                <input
                                  type="text"
                                  value={quiz.explanation}
                                  onChange={(e) => {
                                    handleUpdateQuiz(qIdx, { ...quiz, explanation: e.target.value });
                                  }}
                                  className="w-full px-3 py-1 rounded-lg bg-[var(--surface-soft)] border border-[var(--border-soft)] text-xs text-[var(--text)] outline-none"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 5: FLASHCARDS */}
                  {activeTab === "flashcards" && (
                    <div className="space-y-4 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[var(--muted)]">Key Concept Flashcard Pairs</span>
                        <button
                          type="button"
                          onClick={handleAddFlashcard}
                          className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-300 font-bold cursor-pointer"
                        >
                          + Add Flashcard
                        </button>
                      </div>
                      <div className="space-y-2">
                        {selectedNode.flashcards?.map((fc, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border-soft)] space-y-2">
                            <input
                              type="text"
                              value={fc.front}
                              onChange={(e) => {
                                const updated = [...(selectedNode.flashcards || [])];
                                updated[idx] = { ...updated[idx], front: e.target.value };
                                handleFieldChange("flashcards", updated);
                              }}
                              className="w-full px-2.5 py-1 rounded bg-[var(--surface-soft)] border border-[var(--border-soft)] font-bold"
                              placeholder="Front Concept Term"
                            />
                            <textarea
                              rows={2}
                              value={fc.back}
                              onChange={(e) => {
                                const updated = [...(selectedNode.flashcards || [])];
                                updated[idx] = { ...updated[idx], back: e.target.value };
                                handleFieldChange("flashcards", updated);
                              }}
                              className="w-full px-2.5 py-1 rounded bg-[var(--surface-soft)] border border-[var(--border-soft)]"
                              placeholder="Back Definition & Invariant"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 6: RESOURCES */}
                  {activeTab === "resources" && (
                    <div className="space-y-4 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[var(--muted)]">Downloadable Assets & Cheatsheets</span>
                        <button
                          type="button"
                          onClick={handleAddResource}
                          className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-300 font-bold cursor-pointer"
                        >
                          + Add Asset
                        </button>
                      </div>
                      <div className="space-y-2">
                        {selectedNode.resources?.map((res, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-[var(--surface)] border border-[var(--border-soft)]">
                            <input
                              type="text"
                              value={res.name}
                              onChange={(e) => {
                                const updated = [...(selectedNode.resources || [])];
                                updated[idx] = { ...updated[idx], name: e.target.value };
                                handleFieldChange("resources", updated);
                              }}
                              className="flex-1 px-2.5 py-1 rounded bg-[var(--surface-soft)] border border-[var(--border-soft)] font-semibold"
                              placeholder="Resource Title (e.g. CLI Guide)"
                            />
                            <select
                              value={res.type}
                              onChange={(e) => {
                                const updated = [...(selectedNode.resources || [])];
                                updated[idx] = { ...updated[idx], type: e.target.value as any };
                                handleFieldChange("resources", updated);
                              }}
                              className="px-2 py-1 rounded bg-[var(--surface-soft)] border border-[var(--border-soft)]"
                            >
                              <option value="pdf">PDF</option>
                              <option value="code">Code ZIP</option>
                              <option value="cheat-sheet">Cheat Sheet</option>
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-[var(--surface)] border border-dashed border-[var(--border-soft)] text-center text-xs text-[var(--muted)]">
              Select a module or submodule from the tree on the left to configure its Cisco theory, video, lab, and assessments.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
