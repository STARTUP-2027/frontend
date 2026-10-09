import React from "react";
import type { NavigableItem } from "../../types";

interface ResourcesTabProps {
  item: NavigableItem;
}

export default function ResourcesTab({ item }: ResourcesTabProps) {
  const handleDownload = (name: string) => {
    alert(`Downloading ${name}...`);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-3xl mx-auto">
      <div className="border-b border-[var(--border-soft)] pb-3">
        <h3 className="text-base font-black text-[var(--text)]">
          Downloadable Assets & Cheatsheets
        </h3>
        <p className="text-xs text-[var(--muted)]">
          Official course reference materials, CLI templates, and architecture specs.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {item.resources?.map((res) => (
          <div
            key={res.id}
            className="p-4 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border-soft)] hover:border-purple-500/50 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{res.type === "pdf" ? "📕" : "💻"}</span>
              <div>
                <h4 className="text-xs font-bold text-[var(--text)]">{res.name}</h4>
                <span className="text-[10px] text-[var(--muted)] font-mono">
                  {res.size || "1.2 MB"} • {res.type.toUpperCase()}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleDownload(res.name)}
              className="px-3 py-1.5 rounded-xl bg-[var(--surface)] hover:bg-purple-600 hover:text-white border border-[var(--border)] text-xs font-bold transition-all cursor-pointer"
            >
              Download ⤓
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
