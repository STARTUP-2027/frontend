"use client";

import { Suspense } from "react";
import StudentDashboardPage from "../../src/app/dashboard/StudentDashboardPage";

export default function DashboardRoute() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg)]" />}>
      <StudentDashboardPage />
    </Suspense>
  );
}
