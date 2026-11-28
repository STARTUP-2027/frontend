"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { astraApi } from "../../lib/api";

interface SubscriptionUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle?: string;
  onTrialActivated?: () => void;
}

export default function SubscriptionUpgradeModal({
  isOpen,
  onClose,
  courseTitle,
  onTrialActivated,
}: SubscriptionUpgradeModalProps) {
  const { switchRole } = useAuth();
  const navigate = useNavigate();

  // Dynamic API configuration state
  const [modalConfig, setModalConfig] = useState<{
    badge: string;
    title: string;
    subtitle: string;
    priceDisplay: string;
    annualDiscountBadge: string;
    ctaPrimary: string;
    ctaSecondary: string;
    guaranteeNotice: string;
    perks: Array<{ icon: string; text: string }>;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      astraApi
        .getSubscriptionModalConfig()
        .then((res) => {
          if (res?.data?.upgradeModal) {
            setModalConfig(res.data.upgradeModal);
          }
        })
        .catch(() => {
          // fallback to safe defaults if network is offline
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Use dynamic configuration from backend API if available, else standard fallback
  const displayBadge = modalConfig?.badge || "Subscription Required";
  const displayTitle = modalConfig?.title || "Unlock Astra Pro Access";
  const displaySubtitle = courseTitle
    ? `To enroll in "${courseTitle}", activate your 3-day free trial or choose a membership pass.`
    : modalConfig?.subtitle || "Start your 3-day free trial or choose an Astra Pro membership pass.";
  const displayCtaPrimary = modalConfig?.ctaPrimary || "Start 3-Day Free Trial";
  const displayCtaSecondary = modalConfig?.ctaSecondary || "View Membership Plans";
  const displayGuarantee = modalConfig?.guaranteeNotice || "Cancel anytime with 1 click. Zero commitments.";
  const displayPerks = modalConfig?.perks || [
    { icon: "⚡", text: "Unlimited access to all 50+ engineering masterclasses" },
    { icon: "🧠", text: "620+ Pattern-Wise DSA Sheet with video solutions & editorials" },
    { icon: "🏆", text: "Shareable verified completion certificates (LinkedIn badge)" },
    { icon: "⚔️", text: "Contest Arena & Speed Hackathon XP leaderboards" },
  ];

  const handleStartTrial = async () => {
    setIsLoading(true);
    try {
      await astraApi.upgradeSubscription({ startTrial: true });
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
      switchRole("student");
      if (onTrialActivated) {
        onTrialActivated();
      }
      onClose();
    }
  };

  const handleViewPricing = () => {
    onClose();
    navigate("/pricing");
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-3xl bg-[var(--surface)] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-[var(--text)] overflow-hidden animate-scale-in"
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer text-sm font-bold"
          title="Close modal"
        >
          ✕
        </button>

        {/* Header Icon & Title */}
        <div className="flex items-start gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 shrink-0 text-xl font-black">
            ⚡
          </div>
          <div className="pr-6">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
              {displayBadge}
            </span>
            <h3 className="text-lg font-black tracking-tight leading-snug">
              {displayTitle}
            </h3>
            <p className="text-xs text-[var(--muted)] mt-1 leading-relaxed">
              {displaySubtitle}
            </p>
          </div>
        </div>

        {/* Feature Checkmarks from API Response */}
        <div className="my-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-2 text-xs">
          {displayPerks.map((perk, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-emerald-500 font-bold shrink-0">{perk.icon || "✓"}</span>
              <span className="text-slate-700 dark:text-slate-200">{perk.text}</span>
            </div>
          ))}
        </div>

        {/* Primary Action: Free Trial (Instant) */}
        <div className="space-y-2.5 pt-1">
          <button
            onClick={handleStartTrial}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-md shadow-blue-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70"
          >
            <span>{isLoading ? "Activating Trial..." : displayCtaPrimary}</span>
            <span>→</span>
          </button>

          {/* Secondary Action: Explore Pricing Plans */}
          <button
            onClick={handleViewPricing}
            className="w-full py-2.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-[var(--text)] font-bold text-xs transition-colors cursor-pointer"
          >
            {displayCtaSecondary}
          </button>
        </div>

        {/* Footer Guarantee Note from API */}
        <p className="text-[10px] text-center text-[var(--muted)] mt-3">
          {displayGuarantee}
        </p>
      </div>
    </div>
  );
}
