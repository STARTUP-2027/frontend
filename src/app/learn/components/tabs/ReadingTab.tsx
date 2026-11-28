"use client";

import React, { useState } from "react";
import type { NavigableItem } from "../../types";
import type { ContentBlock } from "../../../context/CourseContext";

interface ReadingTabProps {
  item: NavigableItem;
}

export default function ReadingTab({ item }: ReadingTabProps) {
  // Checklist local toggle state
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  // Quiz local answers state
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<string, number>>({});
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const toggleChecklist = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const selectQuizOption = (blockId: string, optIndex: number) => {
    setSelectedQuizAnswers((prev) => ({ ...prev, [blockId]: optIndex }));
  };

  const copyToClipboard = (text: string, id: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedCodeId(id);
      setTimeout(() => setCopiedCodeId(null), 1800);
    }
  };

  // Helper visual renderer for Flowchart & Architecture Diagrams (identical to Admin Studio)
  const renderFlowchartDiagram = (code?: string) => {
    const lines = (code || "").split("\n").filter((l) => l.includes("->"));
    if (lines.length === 0) {
      return (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs">
          {code || "No diagram connections defined"}
        </div>
      );
    }

    return (
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 space-y-4 shadow-md">
        <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2 border-b border-slate-800">
          <span className="font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" /> Live SVG Architecture Flow
          </span>
          <span className="text-[10px] uppercase font-bold text-cyan-400">Interactive Execution Path</span>
        </div>

        <div className="flex flex-col items-center gap-2 py-3">
          {lines.map((line, idx) => {
            const parts = line.split("->").map((p) => p.replace(/[\[\]]/g, "").trim());
            const source = parts[0] || "Source Node";
            const target = parts[1] || "Destination";

            return (
              <div key={idx} className="flex flex-col items-center w-full max-w-lg">
                <div className="w-full p-3 rounded-xl bg-slate-900/90 border border-cyan-500/40 text-center font-mono text-xs font-bold text-cyan-200 shadow-sm hover:border-cyan-400 transition-colors">
                  {source}
                </div>
                <div className="h-6 w-0.5 bg-gradient-to-b from-cyan-400 to-indigo-500 relative my-0.5">
                  <div className="absolute -bottom-1 -left-1 text-[10px] text-indigo-400">▼</div>
                </div>
                {idx === lines.length - 1 && (
                  <div className="w-full p-3 rounded-xl bg-slate-900/90 border border-indigo-500/40 text-center font-mono text-xs font-bold text-indigo-200 shadow-sm hover:border-indigo-400 transition-colors">
                    {target}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render individual ContentBlock created by Admin Studio
  const renderBlock = (block: ContentBlock) => {
    switch (block.type) {
      case "callout": {
        const tone = block.calloutTone || "info";
        const toneStyles = {
          tip: "bg-emerald-500/10 border-emerald-500 text-emerald-400 icon-💡",
          warning: "bg-amber-500/10 border-amber-500 text-amber-400 icon-⚠️",
          info: "bg-blue-500/10 border-blue-500 text-blue-400 icon-ℹ️",
          success: "bg-teal-500/10 border-teal-500 text-teal-400 icon-✅",
          protip: "bg-purple-500/10 border-purple-500 text-purple-400 icon-🔥",
        }[tone];

        const [bgClass, borderClass, textClass, iconText] = toneStyles.split(" ");
        const icon = iconText.replace("icon-", "");

        return (
          <div key={block.id} className={`p-4 rounded-2xl ${bgClass} border-l-4 ${borderClass} space-y-1.5`}>
            <div className={`flex items-center gap-2 font-black text-xs uppercase tracking-wider ${textClass}`}>
              <span>{icon}</span>
              <span>{block.title || `${tone.toUpperCase()} NOTE`}</span>
            </div>
            <p className="text-xs sm:text-sm text-[var(--text)] leading-relaxed">
              {block.calloutMessage}
            </p>
          </div>
        );
      }

      case "diagram": {
        return (
          <div key={block.id} className="space-y-2">
            {block.title && (
              <h4 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <span>📐</span> {block.title}
              </h4>
            )}
            {renderFlowchartDiagram(block.diagramCode)}
          </div>
        );
      }

      case "code": {
        const codeText = block.codeSnippet || "";
        const isCopied = copiedCodeId === block.id;

        return (
          <div key={block.id} className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
                <span className="font-bold text-slate-200">{block.codeLanguage || "typescript"}</span>
              </span>
              <button
                onClick={() => copyToClipboard(codeText, block.id)}
                className="hover:text-white transition-colors cursor-pointer text-[11px] font-sans font-semibold"
              >
                {isCopied ? "✓ Copied" : "Copy Code"}
              </button>
            </div>
            <pre className="p-4 overflow-x-auto text-xs font-mono text-cyan-100 leading-relaxed">
              <code>{codeText}</code>
            </pre>
            {block.codeOutput && (
              <div className="px-4 py-2.5 bg-slate-900/70 border-t border-slate-800 text-[11px] font-mono text-emerald-400">
                <span className="text-slate-500 mr-2">Output:</span>
                {block.codeOutput}
              </div>
            )}
          </div>
        );
      }

      case "quiz": {
        const selected = selectedQuizAnswers[block.id];
        const correct = block.quizCorrectIndex ?? 0;
        const isAnswered = selected !== undefined;
        const isRight = isAnswered && selected === correct;

        return (
          <div key={block.id} className="p-5 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border-soft)] space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-400 font-black text-[10px] uppercase tracking-wider flex items-center gap-1">
                <span>🧠</span> Knowledge Check
              </span>
              {block.quizPoints && (
                <span className="text-xs font-mono font-bold text-amber-400">
                  +{block.quizPoints} XP
                </span>
              )}
            </div>

            <h4 className="text-sm font-extrabold text-[var(--text)] leading-snug">
              {block.quizQuestion || "Concept Assessment"}
            </h4>

            <div className="space-y-2">
              {(block.quizOptions || []).map((opt, optIdx) => {
                const isSelected = selected === optIdx;
                let optClass = "border-[var(--border-soft)] bg-[var(--surface)] hover:border-blue-500";
                if (isAnswered) {
                  if (optIdx === correct) optClass = "border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold";
                  else if (isSelected) optClass = "border-rose-500 bg-rose-500/10 text-rose-400";
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => selectQuizOption(block.id, optIdx)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between cursor-pointer ${optClass}`}
                  >
                    <span>{opt}</span>
                    {isAnswered && optIdx === correct && <span className="text-emerald-400 font-bold">✓</span>}
                    {isAnswered && isSelected && optIdx !== correct && <span className="text-rose-400 font-bold">✕</span>}
                  </button>
                );
              })}
            </div>

            {isAnswered && block.quizExplanation && (
              <div className={`p-3 rounded-xl text-xs ${isRight ? "bg-emerald-500/10 text-emerald-300" : "bg-blue-500/10 text-blue-300"}`}>
                <span className="font-bold">{isRight ? "Correct! " : "Explanation: "}</span>
                {block.quizExplanation}
              </div>
            )}
          </div>
        );
      }

      case "checklist": {
        return (
          <div key={block.id} className="p-5 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border-soft)] space-y-3">
            {block.title && (
              <h4 className="text-xs font-black uppercase tracking-wider text-[var(--accent)] flex items-center gap-1.5">
                <span>✓</span> {block.title}
              </h4>
            )}
            <div className="space-y-2">
              {(block.checklistItems || []).map((item) => {
                const isDone = !!checkedItems[item.id];
                return (
                  <label
                    key={item.id}
                    onClick={() => toggleChecklist(item.id)}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-[var(--surface)] transition-colors cursor-pointer select-none text-xs"
                  >
                    <input
                      type="checkbox"
                      checked={isDone}
                      onChange={() => {}}
                      className="w-4 h-4 rounded border-[var(--border)] text-blue-600 focus:ring-0 cursor-pointer"
                    />
                    <span className={isDone ? "line-through text-[var(--muted)]" : "text-[var(--text)] font-semibold"}>
                      {item.text}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        );
      }

      case "image": {
        return (
          <div key={block.id} className="space-y-2 text-center">
            {block.imageUrl && (
              <div className="rounded-2xl overflow-hidden border border-[var(--border-soft)] bg-black/40">
                <img src={block.imageUrl} alt={block.imageCaption || "Lesson diagram"} className="w-full max-h-96 object-cover" />
              </div>
            )}
            {block.imageCaption && (
              <p className="text-xs text-[var(--muted)] italic">{block.imageCaption}</p>
            )}
          </div>
        );
      }

      case "resources": {
        return (
          <div key={block.id} className="p-4 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border-soft)] space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-[var(--accent)] flex items-center gap-1.5">
              <span>📁</span> Downloadable Lesson Resources
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(block.resourceFiles || []).map((res, idx) => (
                <a
                  key={idx}
                  href={res.url || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border-soft)] hover:border-blue-400 text-xs transition-all"
                >
                  <span className="font-semibold truncate">{res.name}</span>
                  <span className="text-[10px] text-[var(--muted)] shrink-0 font-mono ml-2">{res.size || "PDF"}</span>
                </a>
              ))}
            </div>
          </div>
        );
      }

      case "rich_text":
      default: {
        return (
          <div key={block.id} className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed space-y-3">
            {block.title && <h3 className="text-base font-bold text-[var(--text)]">{block.title}</h3>}
            <div className="p-4 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border-soft)] whitespace-pre-wrap font-sans text-xs leading-relaxed text-[var(--text)]">
              {block.content || item.notes}
            </div>
          </div>
        );
      }
    }
  };

  const hasDynamicBlocks = item.blocks && item.blocks.length > 0;

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-4xl mx-auto">
      {/* Topic Header */}
      <div className="border-b border-[var(--border-soft)] pb-4 space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-400 font-black text-[10px] uppercase tracking-wider">
            {hasDynamicBlocks ? "Dynamic Course Module" : "Engineering Masterclass"}
          </span>
          <span className="text-xs text-[var(--muted)]">•</span>
          <span className="text-xs text-[var(--muted)]">Duration: {item.duration || "15 min"}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-[var(--text)]">{item.title}</h2>
        {item.summary && <p className="text-xs text-[var(--muted)] leading-relaxed">{item.summary}</p>}
      </div>

      {/* Render Admin Studio Blocks in Sequence */}
      {hasDynamicBlocks ? (
        <div className="space-y-6">
          {item.blocks!.map((block) => renderBlock(block))}
        </div>
      ) : (
        /* Fallback Clean View for Standard Lessons */
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-indigo-500/10 border-l-4 border-indigo-500 space-y-1">
            <div className="flex items-center gap-2 text-indigo-400 font-black text-xs uppercase tracking-wider">
              <span>💡</span> Key Architectural Invariant
            </div>
            <p className="text-xs text-[var(--text)] leading-relaxed">
              Verify state consistency and deterministic transitions before executing downstream nodes in production.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border-soft)]">
            <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-[var(--text)]">
              {item.notes}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
