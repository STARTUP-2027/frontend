import React from "react";
import type { NavigableItem, ContentTabType, DiscussionComment } from "../types";
import VideoTab from "./tabs/VideoTab";
import ReadingTab from "./tabs/ReadingTab";
import LabTab from "./tabs/LabTab";
import QuizTab from "./tabs/QuizTab";
import FlashcardsTab from "./tabs/FlashcardsTab";
import ResourcesTab from "./tabs/ResourcesTab";
import DiscussionTab from "./tabs/DiscussionTab";
import ScratchpadTab from "./tabs/ScratchpadTab";

interface WorkspaceTabsProps {
  activeItem?: NavigableItem;
  activeTab: ContentTabType;
  onTabChange: (tab: ContentTabType) => void;
  // Lab props
  userCode: string;
  setUserCode: (code: string) => void;
  codeOutput: string;
  isRunningCode: boolean;
  labPassed: boolean;
  onRunLabCode: () => void;
  onResetStarter: () => void;
  // Discussion props
  comments: DiscussionComment[];
  newQuestionText: string;
  onQuestionTextChange: (text: string) => void;
  onSubmitQuestion: (e: React.FormEvent) => void;
  // Scratchpad props
  personalNote: string;
  onPersonalNoteChange: (note: string) => void;
  onSavePersonalNote: () => void;
  saveNoteSuccess: boolean;
}

export default function WorkspaceTabs({
  activeItem,
  activeTab,
  onTabChange,
  userCode,
  setUserCode,
  codeOutput,
  isRunningCode,
  labPassed,
  onRunLabCode,
  onResetStarter,
  comments,
  newQuestionText,
  onQuestionTextChange,
  onSubmitQuestion,
  personalNote,
  onPersonalNoteChange,
  onSavePersonalNote,
  saveNoteSuccess,
}: WorkspaceTabsProps) {
  if (!activeItem) return null;

  const tabsConfig: Array<{ id: ContentTabType; label: string; badge?: string }> = [
    {
      id: "video",
      label: "🎥 Video Lecture",
      badge: activeItem.timestamps?.length ? `${activeItem.timestamps.length} Ch` : undefined,
    },
    { id: "reading", label: "📄 Cisco Theory & Interactive Reading" },
    {
      id: "quiz",
      label: `🧠 Assessments (${activeItem.quizzes?.length || 1})`,
    },
    { id: "flashcards", label: `💡 Flashcards (${activeItem.flashcards?.length || 2})` },
    {
      id: "resources",
      label: `📑 Resources & Cheatsheets (${activeItem.resources?.length || 2})`,
    },
    { id: "qa", label: `💬 Discussion & Q&A (${comments.length})` },
    { id: "scratchpad", label: "📝 Personal Scratchpad" },
  ];

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-xl">
      {/* Horizontal Tabs Bar */}
      <div className="flex border-b border-[var(--border-soft)] bg-[var(--surface-soft)]/80 overflow-x-auto no-scrollbar">
        {tabsConfig.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === tab.id
                ? "border-purple-500 text-purple-400 bg-[var(--surface)] shadow-inner"
                : "border-transparent text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface)]/50"
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="px-1.5 py-0.2 rounded-md bg-purple-500/20 text-purple-300 text-[10px] font-black">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      {activeTab === "video" && <VideoTab item={activeItem} />}
      {activeTab === "reading" && <ReadingTab item={activeItem} />}
      {activeTab === "quiz" && <QuizTab item={activeItem} />}
      {activeTab === "flashcards" && <FlashcardsTab item={activeItem} />}
      {activeTab === "resources" && <ResourcesTab item={activeItem} />}
      {activeTab === "qa" && (
        <DiscussionTab
          comments={comments}
          newQuestionText={newQuestionText}
          onQuestionTextChange={onQuestionTextChange}
          onSubmitQuestion={onSubmitQuestion}
        />
      )}
      {activeTab === "scratchpad" && (
        <ScratchpadTab
          personalNote={personalNote}
          onNoteChange={onPersonalNoteChange}
          onSaveNote={onSavePersonalNote}
          saveSuccess={saveNoteSuccess}
        />
      )}
    </div>
  );
}
