"use client";

import { Suspense } from "react";
import DsaSheetPage from "../../src/app/sheet/DsaSheetPage";

export default function DsaSheetRoute() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg)]" />}>
      <DsaSheetPage />
    </Suspense>
  );
}
