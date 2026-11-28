"use client";

import { Suspense } from "react";
import ContestArenaPage from "../../src/app/contests/ContestArenaPage";

export default function ContestsRoute() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg)]" />}>
      <ContestArenaPage />
    </Suspense>
  );
}
