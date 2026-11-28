"use client";

import { Suspense } from "react";
import PricingPage from "../../src/app/PricingPage";

export default function PricingRoute() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg)]" />}>
      <PricingPage />
    </Suspense>
  );
}
