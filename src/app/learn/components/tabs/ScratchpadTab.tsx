import React from "react";

interface ScratchpadTabProps {
  personalNote: string;
  onNoteChange: (val: string) => void;
  onSaveNote: () => void;
  saveSuccess: boolean;
}

export default function ScratchpadTab({
  personalNote,
  onNoteChange,
  onSaveNote,
  saveSuccess,
}: ScratchpadTabProps) {
  return (
    <div className="p-6 sm:p-8 space-y-4 max-w-3xl mx-auto">
      <div className="flex items-center justify-between border-b border-[var(--border-soft)] pb-3">
        <div>
          <h3 className="text-base font-black text-[var(--text)]">Lesson Scratchpad Notes</h3>
          <p className="text-xs text-[var(--muted)]">
            Personal markdown notes synced automatically with your Astra Notes Hub.
          </p>
        </div>
        <button
          onClick={onSaveNote}
          className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black shadow cursor-pointer"
        >
          {saveSuccess ? "✓ Saved to Hub!" : "Save to Notes Hub"}
        </button>
      </div>

      <textarea
        rows={10}
        value={personalNote}
        onChange={(e) => onNoteChange(e.target.value)}
        className="w-full p-4 rounded-2xl font-mono text-xs bg-[var(--surface-soft)] text-[var(--text)] border border-[var(--border-soft)] focus:outline-none focus:border-purple-500 leading-relaxed"
      />
    </div>
  );
}
