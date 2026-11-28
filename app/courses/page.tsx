"use client";

import { Suspense } from "react";
import CoursesCatalogPage from "../../src/app/courses/CoursesCatalogPage";

export default function CoursesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg)]" />}>
      <CoursesCatalogPage />
    </Suspense>
  );
}
