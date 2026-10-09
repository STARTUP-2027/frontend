import React from "react";
import type { NavigableItem } from "../../types";

interface ReadingTabProps {
  item: NavigableItem;
}

const PACKET_FLOW_DATA = [
  {
    phase: "01. INGEST",
    node: "UserQueryDispatcher",
    payload: "Raw String / Context",
    latency: "< 15 ms",
    guarantee: "At least once",
  },
  {
    phase: "02. RETRIEVE",
    node: "HybridVectorNode",
    payload: "Dense + BM25 Embeddings",
    latency: "< 45 ms",
    guarantee: "Top-k Relevant",
  },
  {
    phase: "03. EVALUATE",
    node: "StateGraphCheckpoint",
    payload: "Thread Checkpoint Struct",
    latency: "< 20 ms",
    guarantee: "Deterministic Replay",
  },
];

export default function ReadingTab({ item }: ReadingTabProps) {
  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-4xl mx-auto">
      {/* Topic Header */}
      <div className="border-b border-[var(--border-soft)] pb-4 space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-400 font-black text-[10px] uppercase tracking-wider">
            Cisco Theory Module
          </span>
          <span className="text-xs text-[var(--muted)]">•</span>
          <span className="text-xs text-[var(--muted)]">Estimated Read Time: {item.duration}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-[var(--text)]">{item.title}</h2>
        <p className="text-xs text-[var(--muted)] leading-relaxed">{item.summary}</p>
      </div>

      {/* Cisco Callout Alert 1: Pro-Tip */}
      <div className="p-4 rounded-2xl bg-indigo-500/10 border-l-4 border-indigo-500 space-y-1">
        <div className="flex items-center gap-2 text-indigo-400 font-black text-xs uppercase tracking-wider">
          <span>💡</span> Cisco Engineering Best Practice
        </div>
        <p className="text-xs text-[var(--text)] leading-relaxed">
          Always decouple compute workers from deterministic graph checkpoints. In mission-critical
          production pipelines, persisting intermediate thread state prevents cascading failures
          and eliminates re-computation costs.
        </p>
      </div>

      {/* Markdown Theory Content */}
      <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed space-y-4">
        <div className="p-5 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border-soft)]">
          <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-[var(--text)]">
            {item.notes}
          </pre>
        </div>
      </div>

      {/* Cisco Callout Alert 2: Security & Warning */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border-l-4 border-amber-500 space-y-1">
        <div className="flex items-center gap-2 text-amber-400 font-black text-xs uppercase tracking-wider">
          <span>⚠️</span> Security & Invariant Invalidation Warning
        </div>
        <p className="text-xs text-[var(--text)] leading-relaxed">
          Never invoke dynamic tool schemas or arbitrary shell commands without passing through an
          explicit validation node. Verify payload JSON structures against rigid strict schemas
          before dispatching to downstream actors.
        </p>
      </div>

      {/* Interactive Data Packet Flow Table */}
      <div className="space-y-2">
        <h4 className="text-xs font-black uppercase tracking-wider text-[var(--accent)]">
          Protocol & State Packet Breakdown
        </h4>
        <div className="overflow-x-auto border border-[var(--border-soft)] rounded-2xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--surface-soft)] border-b border-[var(--border-soft)] text-[10px] uppercase font-black text-[var(--muted)]">
              <tr>
                <th className="p-3">Sequence Phase</th>
                <th className="p-3">State Node</th>
                <th className="p-3">Payload Type</th>
                <th className="p-3">Latency SLA</th>
                <th className="p-3">Guarantee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-soft)] font-mono text-[11px]">
              {PACKET_FLOW_DATA.map((row, idx) => (
                <tr key={idx}>
                  <td className="p-3 font-bold text-purple-400">{row.phase}</td>
                  <td className="p-3">{row.node}</td>
                  <td className="p-3">{row.payload}</td>
                  <td className="p-3">{row.latency}</td>
                  <td className="p-3 text-emerald-400">{row.guarantee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
