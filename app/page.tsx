"use client";

import { Suspense } from "react";
import LandingPage from "../src/App";

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg)]" />}>
      <LandingPage />
    </Suspense>
  );
}
