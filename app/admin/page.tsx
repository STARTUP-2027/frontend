"use client";

import { Suspense } from "react";
import AdminCreatorHub from "../../src/app/admin/AdminCreatorHub";

export default function AdminRoute() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg)]" />}>
      <AdminCreatorHub />
    </Suspense>
  );
}
