"use client";

import { Suspense } from "react";
import StudentNotesHubPage from "../../src/app/notes/StudentNotesHubPage";

export default function NotesRoute() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg)]" />}>
      <StudentNotesHubPage />
    </Suspense>
  );
}
