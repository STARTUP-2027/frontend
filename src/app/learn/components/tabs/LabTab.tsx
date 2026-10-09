import React from "react";
import type { NavigableItem } from "../../types";

interface LabTabProps {
  item: NavigableItem;
  userCode: string;
  setUserCode: (code: string) => void;
  codeOutput: string;
  isRunningCode: boolean;
  labPassed: boolean;
  onRunLabCode: () => void;
  onResetStarter: () => void;
}

export default function LabTab({
  item,
  userCode,
  setUserCode,
  codeOutput,
  isRunningCode,
  labPassed,
  onRunLabCode,
  onResetStarter,
}: LabTabProps) {
  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* Lab Header & Objective */}
      <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase">
              Hands-on Lab Simulator
            </span>
            <span className="text-xs font-bold text-[var(--text)]">{item.title}</span>
          </div>
          <p className="text-xs text-[var(--muted)]">{item.labObjective}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onResetStarter}
            className="px-3 py-1.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs font-bold hover:bg-[var(--surface-soft)] cursor-pointer"
          >
            ↺ Reset Starter
          </button>
          <button
            onClick={onRunLabCode}
            disabled={isRunningCode}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black shadow-lg shadow-purple-600/25 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <span>{isRunningCode ? "⏳" : "▶"}</span>
            <span>{isRunningCode ? "Executing Lab..." : "Run & Verify Lab"}</span>
          </button>
        </div>
      </div>

      {/* Code Editor + Live Terminal Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Code Editor (7 cols) */}
        <div className="lg:col-span-7 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[var(--muted)] px-1">
            <span>Source Implementation (TypeScript / Python)</span>
            <span className="font-mono text-[10px]">UTF-8 • 2 Spaces</span>
          </div>
          <textarea
            rows={14}
            value={userCode}
            onChange={(e) => setUserCode(e.target.value)}
            className="w-full p-4 rounded-2xl font-mono text-xs bg-[#0b0a14] text-[#93c5fd] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y leading-relaxed shadow-inner"
          />
        </div>

        {/* Right: Terminal Console Output (5 cols) */}
        <div className="lg:col-span-5 space-y-2 flex flex-col">
          <div className="flex items-center justify-between text-xs font-bold text-[var(--muted)] px-1">
            <span>Astra Isolated Terminal Sandbox</span>
            {labPassed && (
              <span className="text-emerald-400 font-bold text-[11px] animate-pulse">
                ✓ Verified
              </span>
            )}
          </div>
          <div className="flex-1 p-4 rounded-2xl bg-[#06050b] text-[#34d399] font-mono text-xs border border-[var(--border-soft)] whitespace-pre-wrap min-h-[260px] overflow-y-auto shadow-inner">
            {codeOutput || (
              <div className="text-gray-500 italic space-y-2">
                <p>&gt; Astra Terminal Sandbox v2.4 online.</p>
                <p>&gt; Click "Run & Verify Lab" above to compile and validate tests.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
