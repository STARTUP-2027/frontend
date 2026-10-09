import type { ChapterTimestamp, QuizQuestion, CourseResource } from "../context/CourseContext";

export interface NavigableItem {
  id: string;
  title: string;
  moduleId: string;
  moduleTitle: string;
  submoduleTitle?: string;
  type: "video" | "reading" | "lab" | "quiz" | "code";
  duration?: string;
  summary?: string;
  notes?: string;
  videoUrl?: string;
  transcript?: string;
  timestamps?: ChapterTimestamp[];
  codeSnippet?: string;
  labObjective?: string;
  expectedOutput?: string;
  quizzes?: QuizQuestion[];
  resources?: CourseResource[];
  flashcards?: Array<{ front: string; back: string }>;
}

export type ContentTabType =
  | "video"
  | "reading"
  | "lab"
  | "quiz"
  | "flashcards"
  | "resources"
  | "qa"
  | "scratchpad";

export type SyllabusTypeFilter = "all" | "video" | "reading" | "lab" | "quiz";

export interface DiscussionComment {
  id: string;
  user: string;
  role: string;
  text: string;
  time: string;
  upvotes: number;
}
