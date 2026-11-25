import React from "react";
import type { DiscussionComment } from "../../types";

interface DiscussionTabProps {
  comments: DiscussionComment[];
  newQuestionText: string;
  onQuestionTextChange: (val: string) => void;
  onSubmitQuestion: (e: React.FormEvent) => void;
}

export default function DiscussionTab({
  comments,
  newQuestionText,
  onQuestionTextChange,
  onSubmitQuestion,
}: DiscussionTabProps) {
  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between border-b border-[var(--border-soft)] pb-3">
        <div>
          <h3 className="text-base font-black text-[var(--text)]">Student Q&A Community</h3>
          <p className="text-xs text-[var(--muted)]">
            Ask questions and discuss architectural details with fellow students and instructors.
          </p>
        </div>
      </div>

      {/* Ask Question Form */}
      <form onSubmit={onSubmitQuestion} className="space-y-3">
        <textarea
          rows={3}
          placeholder="Ask a question about this module..."
          value={newQuestionText}
          onChange={(e) => onQuestionTextChange(e.target.value)}
          className="w-full p-3 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border-soft)] text-xs text-[var(--text)] focus:outline-none focus:border-purple-500"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!newQuestionText.trim()}
            className="button button-sm text-xs font-black cursor-pointer disabled:opacity-40"
          >
            Post Question
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-3 pt-2">
        {comments.map((c) => (
          <div
            key={c.id}
            className="p-4 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border-soft)] space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-600/30 text-purple-300 text-[10px] font-bold flex items-center justify-center">
                  {c.user.slice(0, 2).toUpperCase()}
                </span>
                <span className="text-xs font-bold text-[var(--text)]">{c.user}</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                    c.role === "Instructor"
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-purple-500/20 text-purple-400"
                  }`}
                >
                  {c.role}
                </span>
              </div>
              <span className="text-[10px] text-[var(--muted)]">{c.time}</span>
            </div>
            <p className="text-xs text-[var(--muted)] leading-relaxed">{c.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
