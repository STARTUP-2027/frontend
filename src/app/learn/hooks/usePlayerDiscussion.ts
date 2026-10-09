import { useState } from "react";
import type { DiscussionComment } from "../types";

const INITIAL_COMMENTS: DiscussionComment[] = [
  {
    id: "qa-1",
    user: "Sarah Jenkins",
    role: "Senior Engineer",
    text: "How do you handle checkpointing when the cyclic agent graph encounters an unrecoverable 500 error from external tools?",
    time: "2 hours ago",
    upvotes: 12,
  },
  {
    id: "qa-2",
    user: "Dr. Aris Vance",
    role: "Instructor",
    text: "Great question! We configure an 'EvaluationNode' fallback with exponential backoff and persistent thread checkpoint rewind.",
    time: "1 hour ago",
    upvotes: 24,
  },
];

export function usePlayerDiscussion(userName?: string) {
  const [comments, setComments] = useState<DiscussionComment[]>(INITIAL_COMMENTS);
  const [newQuestionText, setNewQuestionText] = useState<string>("");

  const postQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    const newComment: DiscussionComment = {
      id: `qa-${Date.now()}`,
      user: userName || "Alex Morgan",
      role: "Student",
      text: newQuestionText.trim(),
      time: "Just now",
      upvotes: 1,
    };

    setComments((prev) => [newComment, ...prev]);
    setNewQuestionText("");
  };

  return {
    comments,
    newQuestionText,
    setNewQuestionText,
    postQuestion,
  };
}
